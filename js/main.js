(function () {
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var onThemeChange = null;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#161311" : "#f4efe6");
    }
    if (onThemeChange) onThemeChange();
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

  // Mermaid is self-hosted and only fetched on pages that actually have a diagram.
  var diagrams = document.querySelectorAll(".mermaid");
  if (diagrams.length) {
    var sources = Array.prototype.map.call(diagrams, function (el) {
      return el.textContent;
    });
    var renderDiagrams = function () {
      var theme = root.getAttribute("data-theme") === "dark" ? "dark" : "neutral";
      diagrams.forEach(function (el, i) {
        el.removeAttribute("data-processed");
        el.textContent = sources[i];
      });
      window.mermaid.initialize({ startOnLoad: false, theme: theme });
      window.mermaid.run({ nodes: diagrams });
    };
    var mermaidScript = document.createElement("script");
    mermaidScript.src = "/js/vendor/mermaid.min.js";
    mermaidScript.onload = function () {
      renderDiagrams();
      onThemeChange = renderDiagrams;
    };
    document.head.appendChild(mermaidScript);
  }
})();
