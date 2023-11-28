import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import UnoCSS from "@unocss/astro";
import NetlifyCMS from "astro-netlify-cms";

// https://astro.build/config
export default defineConfig({
  site: "https://yic.one",
  integrations: [
    mdx(),
    UnoCSS(),
    sitemap(),
    NetlifyCMS({
      config: {
        backend: {
          name: "git-gateway",
          branch: "main",
        },
        collections: [
          {
            layout: "$/layouts/BlogPost.astro",
            name: "posts",
            label: "Blog Posts",
            folder: "src/content/blog",
            create: true,
            delete: true,
            fields: [
              { name: "title", widget: "string", label: "Title" },
              { name: "description", widget: "string", label: "Description" },
              { name: "pubDate", widget: "datetime", label: "Publish Date" },
              { name: "heroImage", widget: "image", label: "Hero Image" },
              { name: "tags", widget: "list", label: "Tags" },
              { name: "body", widget: "markdown", label: "Body" },
            ],
          },
        ],
      },
    }),
  ],
});
