(function () {
  var root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  var themeListeners = [];

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0a0d18" : "#e2e5e8");
    }
    themeListeners.forEach(function (fn) {
      fn(theme);
    });
  }

  // The theme itself is applied by an inline <head> script to avoid a flash;
  // here we only wire up the toggle.
  var toggle = document.querySelector("[data-theme-toggle]");
  if (toggle) {
    // The button now carries its own state: `aria-pressed` mirrors the active
    // theme, and CSS swaps the sun/moon glyph off the same data-theme attribute.
    var syncToggle = function (theme) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    };
    syncToggle(root.getAttribute("data-theme"));
    themeListeners.push(syncToggle);

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

    var postGiscusTheme = function () {
      var frame = document.querySelector("iframe.giscus-frame");
      if (!frame || !frame.contentWindow) return;
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: giscusTheme() } } },
        "https://giscus.app"
      );
    };

    // The embed is lazy, so giscus creates its frame early but does not load the
    // widget until the thread is near the viewport. A toggle in the meantime
    // finds that frame and posts to it, and the message is silently dropped —
    // the frame is still about:blank, so the target origin cannot match — which
    // leaves the thread booting later with the theme the page had at load. So
    // re-assert the theme whenever a giscus frame finishes loading, and watch
    // for frames that do not exist yet.
    var watchGiscusFrame = function (frame) {
      if (frame.dataset.themeWatch === "1") return;
      frame.dataset.themeWatch = "1";
      frame.addEventListener("load", postGiscusTheme);
    };
    var scanForGiscusFrames = function () {
      var frames = giscus.querySelectorAll("iframe.giscus-frame");
      for (var i = 0; i < frames.length; i += 1) {
        watchGiscusFrame(frames[i]);
      }
    };
    scanForGiscusFrames();
    new MutationObserver(scanForGiscusFrames).observe(giscus, {
      childList: true,
      subtree: true,
    });

    themeListeners.push(postGiscusTheme);
  }
})();
