module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

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
