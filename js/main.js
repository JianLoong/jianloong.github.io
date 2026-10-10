(function () {
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#161311" : "#f4efe6");
    }
  }

  // The theme itself is applied by an inline <head> script to avoid a flash;
  // here we only wire up the toggle.
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(theme);
      localStorage.setItem("theme", theme);
    });
  }

  var bar = document.querySelector("[data-progress]");
  if (bar) {
    var article = document.querySelector(".article");
    var onScroll = function () {
      if (!article) return;
      var rect = article.getBoundingClientRect();
      var total = article.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-rect.top / Math.max(total, 1), 0), 1);
      bar.style.width = scrolled * 100 + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
