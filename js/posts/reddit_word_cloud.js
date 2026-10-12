/*
 * The r/programming word cloud.
 *
 * 2019's version asked reddit.com for a thousand titles and laid them out with
 * d3 v3 and d3.layout.cloud, both from CDNs. It did not use a CORS-enabled
 * fetch: it used $.getJSON with `&jsonp=?`, which is a <script> tag, and a
 * <script> tag is exempt from CORS. This asks the same endpoint the same way,
 * through js/posts/reddit-jsonp.js, and falls back to what you paste when
 * Reddit will not answer. The rest is the same: same stop list, same
 * tokenising, same fifty words, same layout (js/vendor/d3-cloud).
 */
(function () {
  var demo = document.querySelector("[data-rwc]");
  if (!demo) return;

  var input = demo.querySelector("[data-rwc-input]");
  var runButton = demo.querySelector("[data-rwc-run]");
  var readout = demo.querySelector("[data-rwc-readout]");
  var stage = demo.querySelector("[data-rwc-cloud]");

  var WORDS = 50;
  var SIZE = 800;
  var MIN_SIZE = 16;
  var MAX_SIZE = 76;
  var FONT = "'Azeret Mono', monospace";

  // The endpoint the 2019 page counted, and how long it gets before the page
  // gives up on it and uses what was pasted.
  var SOURCE = "https://www.reddit.com/r/programming.json?limit=1000";
  var LIVE_TIMEOUT = 8000;

  // The 2019 post's stop list. The original ended with an empty string, which
  // did nothing; it is left out here.
  var STOP_WORDS = [
    "about", "after", "all", "also", "am", "an", "and", "another", "any", "are", "as", "at", "be",
    "because", "been", "before", "being", "between", "both", "but", "by", "came", "can",
    "come", "could", "did", "do", "each", "for", "from", "get", "got", "has", "had",
    "he", "have", "her", "here", "him", "himself", "his", "how", "if", "in", "into",
    "is", "it", "like", "make", "many", "me", "might", "more", "most", "much", "must",
    "my", "never", "now", "of", "on", "only", "or", "other", "our", "out", "over",
    "said", "same", "see", "should", "since", "some", "still", "such", "take", "than",
    "that", "the", "their", "them", "then", "there", "these", "they", "this", "those",
    "through", "to", "too", "under", "up", "very", "was", "way", "we", "well", "were",
    "what", "where", "which", "while", "who", "with", "would", "you", "your", "a", "i",
    "its", "why"
  ];

  var NS = "http://www.w3.org/2000/svg";

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function tokenise(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\d+/g, " ")
      .split(/\s+/)
      .filter(function (word) {
        return word.length > 1 && STOP_WORDS.indexOf(word) === -1;
      });
  }

  function tally(words) {
    var counts = Object.create(null);

    words.forEach(function (word) {
      counts[word] = (counts[word] || 0) + 1;
    });

    return Object.keys(counts)
      .map(function (word) {
        return { text: word, size: counts[word] };
      })
      .sort(function (a, b) {
        return b.size - a.size || a.text.localeCompare(b.text);
      })
      .slice(0, WORDS);
  }

  function band(index) {
    if (index < 10) return "d-v2";
    if (index < 25) return "d-v1";
    return "d-v3";
  }

  function draw(words) {
    stage.innerHTML = "";

    var svg = el("svg", {
      viewBox: "0 0 " + SIZE + " " + SIZE,
      role: "img",
      "aria-label":
        "A word cloud of the counted words. The largest words are " +
        words
          .slice(0, 5)
          .map(function (word) {
            return word.text;
          })
          .join(", ") +
        "."
    });

    var group = el("g", { transform: "translate(" + SIZE / 2 + "," + SIZE / 2 + ")" });

    words.forEach(function (word, index) {
      var text = el("text", {
        class: "d-cloud " + band(index),
        "text-anchor": "middle",
        "font-size": word.size.toFixed(1),
        transform:
          "translate(" +
          word.x.toFixed(1) +
          "," +
          word.y.toFixed(1) +
          ") rotate(" +
          word.rotate +
          ")"
      });
      text.textContent = word.text;
      group.appendChild(text);
    });

    svg.appendChild(group);
    stage.appendChild(svg);
  }

  function layout(words) {
    var loudest = words[0].size;

    d3.layout
      .cloud()
      .size([SIZE, SIZE])
      .words(
        words.map(function (word) {
          return {
            text: word.text,
            size: MIN_SIZE + (word.size / loudest) * (MAX_SIZE - MIN_SIZE)
          };
        })
      )
      .padding(4)
      .rotate(function () {
        return Math.random() < 0.5 ? 0 : 90;
      })
      .font(FONT)
      .fontSize(function (word) {
        return word.size;
      })
      .on("end", draw)
      .start();
  }

  function render(text, suffix) {
    if (!text.trim()) {
      readout.textContent = "Paste some text to draw.";
      return;
    }

    var words = tally(tokenise(text));
    if (!words.length) {
      readout.textContent = "Nothing left after the stop words came out.";
      return;
    }

    runButton.disabled = true;
    readout.textContent = "Laying out " + words.length + " words…";

    var fonts = document.fonts ? document.fonts.ready : Promise.resolve();

    fonts.then(function () {
      layout(words);
      readout.textContent =
        words
          .slice(0, 5)
          .map(function (word) {
            return word.text + " ×" + word.size;
          })
          .join(" · ") +
        " — " +
        words.length +
        " words laid out" +
        (suffix ? ". " + suffix : ".");
      runButton.disabled = false;
    });
  }

  function run() {
    render(input.value, null);
  }

  // The listing the 2019 page counted: the payload's children, title by title.
  function titles(payload) {
    var children = (payload && payload.data && payload.data.children) || [];

    return children
      .map(function (child) {
        return (child && child.data && child.data.title) || "";
      })
      .filter(function (title) {
        return title.length > 0;
      })
      .join("\n");
  }

  function load() {
    runButton.disabled = true;
    readout.textContent = "Fetching titles from r/programming…";

    redditJSONP(SOURCE, LIVE_TIMEOUT)
      .then(function (payload) {
        var text = titles(payload);
        if (!text) throw new Error("no titles came back");

        input.value = text;
        render(
          text,
          text.split("\n").length + " titles fetched live from r/programming."
        );
      })
      .catch(function (error) {
        render(
          input.value,
          "Reddit did not answer the live fetch (" +
            error.message +
            "), so this is the pasted sample."
        );
      });
  }

  runButton.addEventListener("click", run);

  // The 2019 page drew one on load. Same again, with what you paste as the
  // fallback for when Reddit will not talk to the page.
  load();
})();
