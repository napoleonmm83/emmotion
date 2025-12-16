import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "emmotion",
  title: "emmotion.ch",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool(), media(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
