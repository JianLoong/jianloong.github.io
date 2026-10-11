/*
 * The Hacker News word cloud.
 *
 * The 2019 version pulled d3 v3 and d3.layout.cloud from two CDNs and drew with
 * d3-selection. Neither is needed here: the layout is
 * js/vendor/d3-cloud-1.2.5.js (BSD-3-Clause) and the drawing is plain SVG, so
 * the words take the plate's own colours and follow the theme toggle.
 *
 * The data comes from where it always did — api.hnpwa.com, a read-only mirror
 * of Hacker News — which still answers 200 with Access-Control-Allow-Origin: *.
 * It is a third party, so the demo asks for a fixed small number of pages
 * rather than everything the old version pulled.
 */
(function () {
  var demo = document.querySelector("[data-hnwc]");
  if (!demo) return;

  var runButton = demo.querySelector("[data-hnwc-run]");
  var readout = demo.querySelector("[data-hnwc-readout]");
  var stage = demo.querySelector("[data-hnwc-cloud]");

  var PAGES = 8;
  var WORDS = 50;
  var SIZE = 800;
  var MIN_SIZE = 16;
  var MAX_SIZE = 76;
  var FONT = "'Azeret Mono', monospace";

  // The 2019 stop list, exactly as it was printed in the post.
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
    "its", "why", "ask", "hn", "s"
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

  // Three bands, so the tint says something: the loudest words take the accent,
  // the middle the cool tint, the rest the faint one.
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
        "A word cloud of Hacker News titles. The largest words are " +
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

  function fetchPage(page) {
    return fetch("https://api.hnpwa.com/v0/news/" + page + ".json", { mode: "cors" }).then(
      function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      }
    );
  }

  function load() {
    runButton.disabled = true;
    readout.textContent = "Fetching the front page…";

    var requests = [];
    for (var page = 1; page <= PAGES; page++) requests.push(fetchPage(page));

    Promise.all(requests)
      .then(function (pages) {
        var text = "";

        pages.forEach(function (stories) {
          (stories || []).forEach(function (story) {
            if (story && story.title) text += " " + story.title;
          });
        });

        var words = tally(tokenise(text));
        if (!words.length) {
          readout.textContent = "The mirror answered, but no titles came back.";
          runButton.disabled = false;
          return;
        }

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
            " — from " +
            PAGES +
            " pages of titles.";
          runButton.disabled = false;
        });
      })
      .catch(function (error) {
        readout.textContent =
          "The Hacker News mirror did not answer (" +
          error.message +
          "), so there is no cloud to draw. It is a third-party service and it does go down.";
        runButton.disabled = false;
      });
  }

  runButton.addEventListener("click", load);

  // The old post drew one on load. Kept, with the button to ask for another.
  load();
})();
