(function () {
  var root = document.documentElement;
  var stored = localStorage.getItem("theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = stored || (prefersDark ? "dark" : "light");

  root.setAttribute("data-theme", theme);

  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    toggle.addEventListener("click", function () {
      theme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
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
