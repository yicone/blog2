import mdx from "@astrojs/mdx";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import UnoCSS from "@unocss/astro";

// import NetlifyCMS from "astro-netlify-cms";
import { SKIP, visit } from "unist-util-visit";

/**
 * Removes comments from the given tree.
 *
 * @param {Object} tree - The tree to remove comments from.
 * @returns {Function} - A function that can be used as a plugin in a tree traversal.
 */
function removeComments() {
  return (tree, file) => {
    if (file.extname === ".mdx") {
      visit(tree, "mdxFlowExpression", (node, index, parent) => {
        if (node.value.startsWith("/*") && node.value.endsWith("*/")) {
          parent.children.splice(index, 1);
          return [SKIP, index];
        }
      });
    }

    visit(tree, "html", (node, index, parent) => {
      if (node.value.startsWith("<!--") && node.value.endsWith("-->")) {
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
    visit(tree, "list", (node, index, parent) => {
      if (index > 0 && parent.children[index - 1].type === "list") {
        parent.children[index - 1].children = parent.children[
          index - 1
        ].children.concat(node.children);
        parent.children.splice(index, 1);
        return [SKIP, index];
      }
    });
  };
}

function debugAst() {
  return (tree) => {
    console.log(JSON.stringify(tree, null, 2));
    // 或者将AST输出到一个文件中
    // fs.writeFileSync('path/to/ast.json', JSON.stringify(tree, null, 2));
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://yic.one",
  markdown: {
    remarkPlugins: [removeComments],
  },
  integrations: [
    UnoCSS({
      // injectReset: true,
    }),
    // NetlifyCMS({
    //   config: {
    //     backend: {
    //       name: "git-gateway",
    //       branch: "main",
    //     },
    //     collections: [
    //       {
    //         layout: "$/layouts/BlogPost.astro",
    //         name: "posts",
    //         label: "Blog Posts",
    //         folder: "src/content/blog",
    //         create: true,
    //         delete: true,
    //         fields: [
    //           { name: "title", widget: "string", label: "Title" },
    //           { name: "description", widget: "string", label: "Description" },
    //           { name: "pubDate", widget: "datetime", label: "Publish Date" },
    //           { name: "heroImage", widget: "image", label: "Hero Image" },
    //           { name: "tags", widget: "list", label: "Tags" },
    //           { name: "body", widget: "markdown", label: "Body" },
    //         ],
    //       },
    //       {
    //         name: "my",
    //         label: "My",
    //         folder: "src/content/my",
    //         format: "frontmatter",
    //         extension: "mdx",
    //         create: true,
    //         delete: true,
    //         fields: [
    //           { name: "title", widget: "string", label: "Title" },
    //           { name: "body", widget: "markdown", label: "Body" },
    //         ],
    //       },
    //     ],
    //   },
    // }),
    mdx(),
    sitemap(),
  ],
});
