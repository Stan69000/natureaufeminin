import { randomUUID } from "node:crypto";
import { getCliClient } from "sanity/cli";

const client = getCliClient({
  apiVersion: process.env.SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

function youtubeBlock() {
  return {
    _key: randomUUID().slice(0, 12),
    _type: "youtubeEmbed",
    url: "https://www.youtube.com/watch?v=z7I6Vwwt16E",
    title: "Présentation Audrey Martinez Bouchet",
  };
}

function contactLinkParagraphBlock() {
  return {
    _key: randomUUID().slice(0, 12),
    _type: "block",
    style: "normal",
    markDefs: [
      {
        _key: "contactLink",
        _type: "link",
        href: "/contact",
      },
    ],
    children: [
      {
        _key: randomUUID().slice(0, 12),
        _type: "span",
        marks: [],
        text: "Afin que nous fassions connaissance, je vous invite à me contacter en ",
      },
      {
        _key: randomUUID().slice(0, 12),
        _type: "span",
        marks: ["contactLink"],
        text: "cliquant ICI",
      },
      {
        _key: randomUUID().slice(0, 12),
        _type: "span",
        marks: [],
        text: " !",
      },
    ],
  };
}

function ctaBlock(existing) {
  return {
    _key: existing?._key || randomUUID().slice(0, 12),
    _type: "ctaButton",
    label: "RDV sur Liberlo.com",
    href: "https://liberlo.com/profil/audrey-martinez-bouchet/",
  };
}

function decodeEntities(input) {
  const decoded = String(input || "")
    .replaceAll("&#038;", "&")
    .replaceAll("&amp;", "&")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&rsquo;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .replaceAll("&ndash;", "-")
    .replaceAll("&mdash;", "-")
    .replaceAll("&#8211;", "-")
    .replaceAll("&#8217;", "'");

  return decoded
    .replace(/&#(\d+);/g, (match, dec) => {
      const codePoint = Number.parseInt(dec, 10);
      if (!Number.isFinite(codePoint)) return match;
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return match;
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
      const codePoint = Number.parseInt(hex, 16);
      if (!Number.isFinite(codePoint)) return match;
      try {
        return String.fromCodePoint(codePoint);
      } catch {
        return match;
      }
    });
}

function normalizeTextBlocks(body) {
  return body.map((block) => {
    if (block?._type !== "block" || !Array.isArray(block.children)) return block;
    return {
      ...block,
      children: block.children.map((child) => {
        if (child?._type !== "span" || typeof child.text !== "string") return child;
        return {
          ...child,
          text: decodeEntities(child.text),
        };
      }),
    };
  });
}

function blockText(block) {
  if (block?._type !== "block" || !Array.isArray(block.children)) return "";
  return block.children.map((child) => child?.text || "").join("");
}

function isContactParagraph(block) {
  const text = blockText(block);
  return /Afin que nous fassions connaissance/i.test(text) && /cliquant ICI/i.test(text);
}

function blockHasContactLink(block) {
  if (block?._type !== "block") return false;
  if (!Array.isArray(block.markDefs) || !Array.isArray(block.children)) return false;
  const contactLinkDef = block.markDefs.find(
    (def) => def?._type === "link" && def?.href === "/contact",
  );
  if (!contactLinkDef?._key) return false;
  return block.children.some(
    (child) => child?._type === "span" && Array.isArray(child.marks) && child.marks.includes(contactLinkDef._key),
  );
}

async function main() {
  const page = await client.fetch(
    `*[_type == "page" && slug.current == "qui-suis-je"][0]{
      _id,
      title,
      body
    }`,
  );

  if (!page?._id) {
    throw new Error('Page "qui-suis-je" introuvable.');
  }

  const currentBody = Array.isArray(page.body) ? page.body : [];
  const hasYoutube = currentBody.some((block) => block?._type === "youtubeEmbed");
  const ctaIndex = currentBody.findIndex((block) => block?._type === "ctaButton");
  const hasCta = ctaIndex >= 0;
  let nextBody = normalizeTextBlocks([...currentBody]);
  if (!hasYoutube) nextBody.push(youtubeBlock());

  let keptContactParagraph = false;
  nextBody = nextBody
    .map((block) => {
      if (!isContactParagraph(block)) return block;
      if (keptContactParagraph) return null;
      keptContactParagraph = true;
      return blockHasContactLink(block) ? block : contactLinkParagraphBlock();
    })
    .filter(Boolean);

  if (!keptContactParagraph) {
    nextBody.push(contactLinkParagraphBlock());
  }

  const rdvTextIndexes = [];
  for (let i = 0; i < nextBody.length; i += 1) {
    if (/RDV sur Liberlo\.com/i.test(blockText(nextBody[i]))) {
      rdvTextIndexes.push(i);
    }
  }

  const firstRdvIndex = rdvTextIndexes[0] ?? -1;
  if (rdvTextIndexes.length > 0) {
    nextBody = nextBody.filter((_, index) => !rdvTextIndexes.includes(index));
  }

  const existingCtaIndexAfterCleanup = nextBody.findIndex((block) => block?._type === "ctaButton");
  const existingCta =
    existingCtaIndexAfterCleanup >= 0 ? nextBody[existingCtaIndexAfterCleanup] : null;
  if (existingCtaIndexAfterCleanup >= 0) {
    nextBody.splice(existingCtaIndexAfterCleanup, 1);
  }

  const finalCta = ctaBlock(existingCta);
  if (firstRdvIndex >= 0) {
    const insertAt = Math.min(firstRdvIndex, nextBody.length);
    nextBody.splice(insertAt, 0, finalCta);
  } else {
    const contactIndex = nextBody.findIndex((block) => /cliquant ICI/i.test(blockText(block)));
    const fallbackInsert = contactIndex >= 0 ? contactIndex + 1 : nextBody.length;
    nextBody.splice(fallbackInsert, 0, finalCta);
  }

  await client.patch(page._id).set({ body: nextBody }).commit();
  console.log(
    `Updated ${page._id}: youtube=${hasYoutube ? "already" : "added"}, contactLinkParagraph=normalized, cta=positioned, rdvTextReplaced=${rdvTextIndexes.length > 0 ? "yes" : "no"}, entities=normalized`,
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
