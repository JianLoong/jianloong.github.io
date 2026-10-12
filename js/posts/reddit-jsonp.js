/*
 * Reaching reddit.com's .json endpoints from a static page.
 *
 * Reddit sends no CORS header on those endpoints, so fetch() cannot read them
 * from another origin. The 2019 posts never used fetch either: they called
 * $.getJSON with `&jsonp=?`, which loads a <script> tag, and a <script> tag is
 * not subject to CORS. These are the two pieces of that, without jQuery.
 *
 * Neither piece guarantees an answer. Reddit's edge replies 403 to clients it
 * does not like — an unauthenticated one, or one it takes for a robot — and the
 * callback may not be honoured at all. Both show up here as a rejection, and
 * the demo decides what to fall back to.
 */
(function () {
  // redditJSONP(url, ms) resolves with the parsed payload of a reddit .json
  // endpoint. It rejects if the script fails to load, if the callback never
  // fires, or after ms.
  window.redditJSONP = function (url, ms) {
    return new Promise(function (resolve, reject) {
      var callback = "redditJSONP_" + Math.random().toString(36).slice(2);
      var script = document.createElement("script");
      var timer = null;
      var settled = false;

      function finish(error, data) {
        if (settled) return;
        settled = true;

        clearTimeout(timer);
        delete window[callback];
        if (script.parentNode) script.parentNode.removeChild(script);

        if (error) reject(error);
        else resolve(data);
      }

      window[callback] = function (data) {
        finish(null, data);
      };

      // A 403 never gets this far, and an HTML block page that arrives with a
      // 200 throws a parse error instead, so the timeout is what catches the
      // case where the callback simply never fires.
      script.onerror = function () {
        finish(new Error("no answer"));
      };

      script.src = url + (url.indexOf("?") === -1 ? "?" : "&") + "jsonp=" + callback;
      timer = setTimeout(function () {
        finish(new Error("timed out"));
      }, ms || 8000);

      document.head.appendChild(script);
    });
  };

  // redditComments(payload) is the text of every comment in a listing, one per
  // line: the bodies, with the newlines inside each one flattened, and the
  // deleted markers left out.
  window.redditComments = function (payload) {
    var children = (payload && payload.data && payload.data.children) || [];

    return children
      .map(function (child) {
        return (child && child.data && child.data.body) || "";
      })
      .map(function (body) {
        return body.replace(/\s+/g, " ").trim();
      })
      .filter(function (body) {
        return body.length > 0 && body !== "[deleted]" && body !== "[removed]";
      })
      .join("\n");
  };
})();
