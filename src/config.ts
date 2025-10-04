export const SITE = {
  website: "https://pangrammer.dev/", // Your actual domain
  author: "Jian Loong Liew",
  profile: "https://pangrammer.dev/",
  desc: "Personal blog of Jian Loong Liew - Software Engineer and Data Visualization enthusiast.",
  title: "Jian Liew",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/jianloong/jianloong.github.io/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Australia/Melbourne", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
