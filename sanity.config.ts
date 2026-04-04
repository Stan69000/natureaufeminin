import { defineConfig } from "sanity";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.SANITY_PROJECT_ID || "ngouy1on";
const dataset = process.env.SANITY_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Naturaufeminin Studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
});
