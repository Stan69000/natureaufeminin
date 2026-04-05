<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header("Referrer-Policy: strict-origin-when-cross-origin");

$allowedOrigins = [
  "https://naturaufeminin.fr",
  "https://www.naturaufeminin.fr",
  "http://localhost:4321",
  "http://127.0.0.1:4321",
];

$recipientEmail = "naturaufeminin@gmail.com";
$turnstileSecretKey = "0x4AAAAAAC0otThoEFz36cHL0t1A6omcK2U";
$siteBaseUrl = "https://naturaufeminin.fr";

function jsonResponse(int $status, array $payload): void
{
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function cleanText(mixed $value): string
{
  if (!is_string($value)) {
    return "";
  }
  $value = trim($value);
  $value = preg_replace('/\s+/u', ' ', $value);
  return $value ?? "";
}

function cleanMessage(mixed $value): string
{
  if (!is_string($value)) {
    return "";
  }
  $value = str_replace(["\r\n", "\r"], "\n", $value);
  return trim($value);
}

function safeHeaderValue(string $value): string
{
  return str_replace(["\r", "\n"], "", $value);
}

function clientIp(): string
{
  $forwarded = $_SERVER["HTTP_X_FORWARDED_FOR"] ?? "";
  if (is_string($forwarded) && $forwarded !== "") {
    $parts = explode(",", $forwarded);
    return trim($parts[0]) ?: "unknown";
  }
  $remoteAddr = $_SERVER["REMOTE_ADDR"] ?? "unknown";
  return is_string($remoteAddr) ? $remoteAddr : "unknown";
}

function isRateLimited(string $ip): bool
{
  $windowSeconds = 600;
  $maxRequests = 6;
  $key = preg_replace('/[^a-zA-Z0-9._-]/', '_', $ip) ?: "unknown";
  $path = sys_get_temp_dir() . "/naf_contact_rate_" . $key . ".json";
  $now = time();

  $data = ["timestamps" => []];
  if (is_file($path)) {
    $raw = file_get_contents($path);
    if (is_string($raw) && $raw !== "") {
      $parsed = json_decode($raw, true);
      if (is_array($parsed) && isset($parsed["timestamps"]) && is_array($parsed["timestamps"])) {
        $data = $parsed;
      }
    }
  }

  $timestamps = array_filter(
    $data["timestamps"],
    static fn ($ts): bool => is_int($ts) && ($now - $ts) <= $windowSeconds
  );

  if (count($timestamps) >= $maxRequests) {
    return true;
  }

  $timestamps[] = $now;
  $data["timestamps"] = array_values($timestamps);
  file_put_contents($path, json_encode($data), LOCK_EX);
  return false;
}

if (($_SERVER["REQUEST_METHOD"] ?? "") === "OPTIONS") {
  $origin = $_SERVER["HTTP_ORIGIN"] ?? "";
  if (is_string($origin) && in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Accept");
    header("Vary: Origin");
  }
  http_response_code(204);
  exit;
}

if (($_SERVER["REQUEST_METHOD"] ?? "") !== "POST") {
  jsonResponse(405, ["error" => "Method not allowed"]);
}

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if (!is_string($origin) || !in_array($origin, $allowedOrigins, true)) {
  jsonResponse(403, ["error" => "Forbidden origin"]);
}

header("Access-Control-Allow-Origin: " . $origin);
header("Vary: Origin");

if (isRateLimited(clientIp())) {
  jsonResponse(429, ["error" => "Too many requests"]);
}

$contentType = $_SERVER["CONTENT_TYPE"] ?? "";
$body = null;

if (is_string($contentType) && stripos($contentType, "application/json") === 0) {
  $rawBody = file_get_contents("php://input");
  if (!is_string($rawBody) || $rawBody === "") {
    jsonResponse(400, ["error" => "Empty body"]);
  }

  $decoded = json_decode($rawBody, true);
  if (!is_array($decoded)) {
    jsonResponse(400, ["error" => "Invalid JSON payload"]);
  }
  $body = $decoded;
} elseif (
  is_string($contentType) &&
  (stripos($contentType, "application/x-www-form-urlencoded") === 0 ||
    stripos($contentType, "multipart/form-data") === 0)
) {
  if (!is_array($_POST) || count($_POST) === 0) {
    jsonResponse(400, ["error" => "Empty form payload"]);
  }
  $body = $_POST;
} else {
  jsonResponse(415, ["error" => "Unsupported content type"]);
}

$firstName = cleanText($body["firstName"] ?? "");
$lastName = cleanText($body["lastName"] ?? "");
$email = strtolower(cleanText($body["email"] ?? ""));
$phone = cleanText($body["phone"] ?? "");
$subject = cleanText($body["subject"] ?? "");
$message = cleanMessage($body["message"] ?? "");
$consent = cleanText($body["consent"] ?? "");
$website = cleanText($body["website"] ?? "");
$originPath = cleanText($body["originPath"] ?? "");
$formStartedAt = cleanText($body["formStartedAt"] ?? "");
$captchaToken = cleanText($body["cf-turnstile-response"] ?? "");

if ($website !== "") {
  jsonResponse(400, ["error" => "Spam detected"]);
}
if ($originPath !== "/contact") {
  jsonResponse(400, ["error" => "Invalid origin path"]);
}
if ($consent !== "yes") {
  jsonResponse(400, ["error" => "Consent required"]);
}
if ($captchaToken === "") {
  jsonResponse(400, ["error" => "Missing captcha token"]);
}

if ($firstName === "" || mb_strlen($firstName) > 80 || $lastName === "" || mb_strlen($lastName) > 80) {
  jsonResponse(400, ["error" => "Invalid name"]);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254) {
  jsonResponse(400, ["error" => "Invalid email"]);
}
if ($phone !== "" && !preg_match('/^[+\d\s().-]{6,30}$/', $phone)) {
  jsonResponse(400, ["error" => "Invalid phone"]);
}
if ($subject === "" || mb_strlen($subject) > 120) {
  jsonResponse(400, ["error" => "Invalid subject"]);
}
if (mb_strlen($message) < 10 || mb_strlen($message) > 5000) {
  jsonResponse(400, ["error" => "Invalid message"]);
}

$startedAtTimestamp = strtotime($formStartedAt);
if ($startedAtTimestamp === false || (time() - $startedAtTimestamp) < 2) {
  jsonResponse(400, ["error" => "Form submitted too quickly"]);
}

$turnstilePayload = http_build_query([
  "secret" => $turnstileSecretKey,
  "response" => $captchaToken,
  "remoteip" => clientIp(),
], "", "&");

$turnstileContext = stream_context_create([
  "http" => [
    "method" => "POST",
    "header" => "Content-Type: application/x-www-form-urlencoded\r\n",
    "content" => $turnstilePayload,
    "timeout" => 10,
  ],
]);

$turnstileRaw = @file_get_contents(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  false,
  $turnstileContext
);

if (!is_string($turnstileRaw) || $turnstileRaw === "") {
  jsonResponse(502, ["error" => "Captcha verification failed"]);
}

$turnstileData = json_decode($turnstileRaw, true);
if (!is_array($turnstileData) || !($turnstileData["success"] ?? false)) {
  jsonResponse(400, ["error" => "Invalid captcha"]);
}

$mailSubject = "[Contact] " . safeHeaderValue($subject);
$mailBody = implode("\n", [
  "Nouveau message depuis le formulaire Natur' Au Feminin",
  "",
  "Prénom: " . $firstName,
  "Nom: " . $lastName,
  "Email: " . $email,
  "Téléphone: " . ($phone !== "" ? $phone : "Non renseigné"),
  "Sujet: " . $subject,
  "Origine: " . $siteBaseUrl . $originPath,
  "",
  "Message:",
  $message,
]);

$fromAddress = "no-reply@naturaufeminin.fr";
$headers = [
  "From: Natur Au Feminin <" . $fromAddress . ">",
  "Reply-To: " . safeHeaderValue($email),
  "MIME-Version: 1.0",
  "Content-Type: text/plain; charset=UTF-8",
  "X-Mailer: PHP/" . phpversion(),
];

$sent = mail($recipientEmail, $mailSubject, $mailBody, implode("\r\n", $headers));
if (!$sent) {
  jsonResponse(502, ["error" => "Email delivery failed"]);
}

jsonResponse(200, ["ok" => true]);
