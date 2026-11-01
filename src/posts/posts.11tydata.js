/**
 * Directory data for posts.
 *
 * Applies the layout, the `post` tag and the slug permalink, and implements the
 * draft switch: a post with `draft: true` in its frontmatter is neither written
 * nor collected, so it disappears from /writing/, the home page, the feed and
 * the sitemap in one move rather than four.
 *
 *   SHOW_DRAFTS=1 npm start     # preview drafts locally without un-drafting them
 *
 * This is JS rather than posts.json because `permalink` has to be the boolean
 * false to stop Eleventy writing the page, and a template string can only render
 * the string "false", which is truthy, and would write a file called "false".
 */
const showDrafts = process.env.SHOW_DRAFTS === "1";

module.exports = {
  layout: "layouts/post.njk",
  tags: ["post"],
  eleventyComputed: {
    permalink: (data) => (data.draft && !showDrafts ? false : `/posts/${data.page.fileSlug}/`),
    eleventyExcludeFromCollections: (data) => Boolean(data.draft) && !showDrafts,
  },
};
