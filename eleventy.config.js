const fs = require("fs");
const path = require("path");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

  // Social cards live in assets/og/ named by URL slug, so a page finds its own
  // card through page.fileSlug and anything else gets the default. Cards are
  // rendered by `npm run og` from tools/og-card.mjs; they are committed, so a
  // deploy never depends on that renderer.
  const OG_DIR = path.join(__dirname, "assets", "og");
  eleventyConfig.addFilter("ogCard", (fileSlug) => {
    if (fileSlug && fs.existsSync(path.join(OG_DIR, `${fileSlug}.png`))) {
      return `/assets/og/${fileSlug}.png`;
    }
    return "/assets/og/default.png";
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("dateFormat", (value) => {
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Australia/Melbourne",
    }).format(date);
  });

  eleventyConfig.addFilter("limit", (arr, count) => {
    return (arr || []).slice(0, count);
  });

  eleventyConfig.addFilter("rfc822", (value) => new Date(value).toUTCString());

  eleventyConfig.addFilter("isoDate", (value) => new Date(value).toISOString());

  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));

  eleventyConfig.setServerOptions({
    port: 8000,
    allowedHosts: [".monkeycode-ai.live"],
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
};
