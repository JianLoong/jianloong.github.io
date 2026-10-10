// Comments are powered by giscus (https://giscus.app) and stored as GitHub
// Discussions on this repository — no database and no third party holding the
// data. The widget is only rendered once the two IDs below are filled in.
//
// To finish the setup:
//   1. Enable Discussions: Settings → General → Features → Discussions.
//   2. Install the giscus app on the repo: https://github.com/apps/giscus
//   3. Open https://giscus.app, enter "JianLoong/jianloong.github.io", choose
//      the "Announcements" category, and copy the generated `data-repo-id` and
//      `data-category-id` into `repoId` and `categoryId` below.
//
// Leaving `categoryId` empty keeps the comments section hidden, so a fresh
// clone still builds and renders cleanly.
module.exports = {
  enabled: true,
  repo: "JianLoong/jianloong.github.io",
  repoId: "MDEwOlJlcG9zaXRvcnkzMDM4NjQ2Mw==",
  category: "Announcements",
  categoryId: "DIC_kwDOAc-pH84CsTjN",

  // How a page maps to a discussion thread. `pathname` keeps a stable 1:1 link
  // even if the domain or a post title changes.
  mapping: "pathname",
  strict: "0",
  reactionsEnabled: "1",
  emitMetadata: "0",
  inputPosition: "top",
  lang: "en",

  // Site-styled themes. giscus loads these from inside its iframe, so they are
  // resolved against `site.url` at build time and must be absolute URLs.
  themes: {
    light: "/css/giscus-light.css",
    dark: "/css/giscus-dark.css",
  },
};
