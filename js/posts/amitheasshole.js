/*
 * The Am I the Asshole demo.
 *
 * The 2019 version fetched every post's comments from reddit.com, counted the
 * five verdict tokens and drew a frappe-charts percentage bar. It used
 * $.getJSON with `&jsonp=?` — a <script> tag, so no CORS involved. This asks
 * for the subreddit's recent comments the same way, through
 * js/posts/reddit-jsonp.js, and falls back to what the reader pastes when
 * Reddit will not answer. The counting and the chart are unchanged.
 */
(function () {
  var demo = document.querySelector("[data-aita]");
  if (!demo) return;

  var input = demo.querySelector("[data-aita-input]");
  var runButton = demo.querySelector("[data-aita-run]");
  var readout = demo.querySelector("[data-aita-readout]");
  var bar = demo.querySelector("[data-aita-bar]");
  var legend = demo.querySelector("[data-aita-legend]");

  // In the order the original chart listed them. Matched case sensitively: the
  // convention is an uppercase verdict, and folding case would count the INFO
  // inside "information".
  var VERDICTS = ["NTA", "YTA", "ESH", "NAH", "INFO"];

  var NS = "http://www.w3.org/2000/svg";
  var W = 600;
  var BAR_H = 24;

  // r/<sub>/comments.json is the subreddit's recent comments listing: one
  // request, and every body in it is a comment to count.
  var SOURCE = "https://www.reddit.com/r/AmItheAsshole/comments.json?limit=500";
  var LIVE_TIMEOUT = 8000;

  bar.setAttribute("viewBox", "0 0 " + W + " " + BAR_H);

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function total(counts) {
    return counts.reduce(function (sum, count) {
      return sum + count;
    }, 0);
  }

  function drawStack(counts) {
    clear(bar);
    bar.appendChild(
      el("rect", { class: "d-track", x: 0, y: 0, width: W, height: BAR_H })
    );

    var sum = total(counts);
    if (!sum) return;

    var x = 0;
    counts.forEach(function (count, index) {
      if (!count) return;
      var width = (count / sum) * W;
      bar.appendChild(
        el("rect", {
          class: "d-stack d-v" + (index + 1),
          x: x,
          y: 0,
          width: width,
          height: BAR_H
        })
      );
      x += width;
    });
  }

  function drawLegend(counts) {
    var sum = total(counts);
    clear(legend);

    VERDICTS.forEach(function (verdict, index) {
      var row = document.createElement("tr");

      var swatchCell = document.createElement("td");
      var swatch = document.createElement("span");
      swatch.className = "swatch d-v" + (index + 1);
      swatchCell.appendChild(swatch);
      row.appendChild(swatchCell);

      [verdict, String(counts[index]), sum ? (100 * counts[index] / sum).toFixed(1) + "%" : "—"].forEach(
        function (value) {
          var cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        }
      );

      legend.appendChild(row);
    });
  }

  function run(suffix) {
    var text = input.value;

    if (!text.trim()) {
      readout.textContent = "Paste some comments to count.";
      return;
    }

    var counts = VERDICTS.map(function (verdict) {
      var matches = text.match(new RegExp(verdict, "g"));
      return matches ? matches.length : 0;
    });

    drawStack(counts);
    drawLegend(counts);

    var sum = total(counts);
    if (!sum) {
      readout.textContent = "None of the five verdicts appear in that text.";
      return;
    }

    var top = counts.indexOf(Math.max.apply(null, counts));
    readout.textContent =
      sum +
      (sum === 1 ? " verdict" : " verdicts") +
      " in " +
      text.length.toLocaleString() +
      " characters — mostly " +
      VERDICTS[top] +
      " (" +
      counts[top] +
      ")." +
      (suffix ? " " + suffix : "");
  }

  function load() {
    readout.textContent = "Fetching comments from r/AmItheAsshole…";

    redditJSONP(SOURCE, LIVE_TIMEOUT)
      .then(function (payload) {
        var text = redditComments(payload);
        if (!text) throw new Error("no comments came back");

        input.value = text;
        run(
          text.split("\n").length + " comments fetched live from r/AmItheAsshole."
        );
      })
      .catch(function (error) {
        run(
          "Reddit did not answer the live fetch (" +
            error.message +
            "), so this is the pasted sample."
        );
      });
  }

  runButton.addEventListener("click", function () {
    run("");
  });

  drawStack([0, 0, 0, 0, 0]);
  drawLegend([0, 0, 0, 0, 0]);

  // The 2019 page counted on load. Same again, with what you paste as the
  // fallback for when Reddit will not talk to the page.
  load();
})();
