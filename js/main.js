(function () {
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var themeListeners = [];

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#161311" : "#f4efe6");
    }
    themeListeners.forEach(function (fn) {
      fn(theme);
    });
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
      themeListeners.push(renderDiagrams);
    };
    document.head.appendChild(mermaidScript);
  }

  // giscus comments (GitHub Discussions). The embed is built here rather than
  // written into the markup so it can start in the theme the visitor actually
  // has, and follow the toggle afterwards. Configuration lives in
  // src/_data/giscus.js; the section only renders once it is filled in.
  var giscus = document.querySelector("[data-giscus]");
  if (giscus) {
    var giscusTheme = function () {
      return root.getAttribute("data-theme") === "dark"
        ? giscus.dataset.themeDark
        : giscus.dataset.themeLight;
    };
    var giscusAttrs = {
      repo: giscus.dataset.repo,
      "repo-id": giscus.dataset.repoId,
      category: giscus.dataset.category,
      "category-id": giscus.dataset.categoryId,
      mapping: giscus.dataset.mapping,
      strict: giscus.dataset.strict,
      "reactions-enabled": giscus.dataset.reactionsEnabled,
      "emit-metadata": giscus.dataset.emitMetadata,
      "input-position": giscus.dataset.inputPosition,
      lang: giscus.dataset.lang,
      theme: giscusTheme(),
      loading: "lazy",
    };
    var giscusScript = document.createElement("script");
    giscusScript.src = "https://giscus.app/client.js";
    giscusScript.async = true;
    giscusScript.crossOrigin = "anonymous";
    Object.keys(giscusAttrs).forEach(function (key) {
      giscusScript.setAttribute("data-" + key, giscusAttrs[key]);
    });
    giscus.appendChild(giscusScript);

    themeListeners.push(function () {
      var frame = document.querySelector("iframe.giscus-frame");
      if (!frame) return;
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } },
        "https://giscus.app"
      );
    });
  }
})();
