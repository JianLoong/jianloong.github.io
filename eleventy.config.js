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

  // The writing index groups its entries by the month they were published in.
  // The month is read in the site's own timezone, so a post never lands in a
  // month the date printed on its card contradicts, and the order is the
  // collection's — already newest first. Adjacent entries share a label, so one
  // pass is enough; a descending sort cannot repeat a month after leaving it.
  eleventyConfig.addFilter("byMonth", (posts) => {
    const monthOf = new Intl.DateTimeFormat("en-AU", {
      month: "long",
      year: "numeric",
      timeZone: "Australia/Melbourne",
    });

    const groups = [];

    (posts || []).forEach((post) => {
      const label = monthOf.format(post.date);
      const current = groups[groups.length - 1];

      if (current && current.label === label) current.posts.push(post);
      else groups.push({ label, posts: [post] });
    });

    return groups;
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
