import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_PROJECT_ID || "ngouy1on";
const dataset = process.env.SANITY_DATASET || "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "miy44mn3q383avsrb92il0tl",
  },
});
