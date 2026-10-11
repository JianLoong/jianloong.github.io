/*
 * Sentiment for a thread, by AFINN.
 *
 * The 2019 version fetched r/hongkong's front page and every thread's comments
 * from reddit.com, scored each comment with AFINN, classified it by the sign of
 * the total, and drew a frappe-charts percentage bar per thread. Reddit's public
 * .json endpoints now answer 403 with no CORS header, so the fetch is gone and
 * the comments are whatever you paste — one per line. The scoring, the
 * classification and the chart are the same, and the lexicon is the same file.
 */
(function () {
  var demo = document.querySelector("[data-hk]");
  if (!demo) return;

  var input = demo.querySelector("[data-hk-input]");
  var runButton = demo.querySelector("[data-hk-run]");
  var readout = demo.querySelector("[data-hk-readout]");
  var bar = demo.querySelector("[data-hk-bar]");
  var legend = demo.querySelector("[data-hk-legend]");
  var charges = demo.querySelector("[data-hk-charges]");

  // The three classes the lexicon can put a comment into, in the order the
  // 2019 chart showed them.
  var BANDS = [
    { key: "positive", className: "d-positive" },
    { key: "negative", className: "d-negative" },
    { key: "neutral", className: "d-neutral" }
  ];

  var NS = "http://www.w3.org/2000/svg";
  var W = 600;
  var BAR_H = 24;

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

  // The 2019 scoring: strip punctuation, lowercase, add up the lexicon's
  // weights. Words the lexicon does not know contribute nothing, which is why a
  // thread full of jargon reads as neutral.
  function score(line) {
    var words = line
      .replace(/[^\w\s']/g, " ")
      .toLowerCase()
      .split(/\s+/);

    var total = 0;
    var hits = [];

    words.forEach(function (word) {
      var weight = afinn[word];
      if (!weight) return;
      total += weight;
      hits.push({ word: word, weight: weight });
    });

    return { total: total, hits: hits };
  }

  function drawStack(counts) {
    clear(bar);
    bar.appendChild(el("rect", { class: "d-track", x: 0, y: 0, width: W, height: BAR_H }));

    var sum = counts.positive + counts.negative + counts.neutral;
    if (!sum) return;

    var x = 0;
    BANDS.forEach(function (band) {
      var count = counts[band.key];
      if (!count) return;
      var width = (count / sum) * W;
      bar.appendChild(
        el("rect", { class: "d-stack " + band.className, x: x, y: 0, width: width, height: BAR_H })
      );
      x += width;
    });
  }

  function drawLegend(counts) {
    var sum = counts.positive + counts.negative + counts.neutral;
    clear(legend);

    BANDS.forEach(function (band) {
      var row = document.createElement("tr");

      var swatchCell = document.createElement("td");
      var swatch = document.createElement("span");
      swatch.className = "swatch " + band.className;
      swatchCell.appendChild(swatch);
      row.appendChild(swatchCell);

      [
        band.key,
        String(counts[band.key]),
        sum ? (100 * counts[band.key] / sum).toFixed(1) + "%" : "—"
      ].forEach(function (value) {
        var cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

      legend.appendChild(row);
    });
  }

  function drawCharges(found) {
    clear(charges);

    if (!found.length) {
      charges.textContent = "No word in the lexicon appeared in that text.";
      return;
    }

    var strongest = found
      .slice()
      .sort(function (a, b) {
        return Math.abs(b.weight) - Math.abs(a.weight) || a.word.localeCompare(b.word);
      })
      .slice(0, 6);

    strongest.forEach(function (hit) {
      var chip = document.createElement("span");
      chip.className = "demo-charge " + (hit.weight > 0 ? "d-positive" : "d-negative");
      chip.textContent = hit.word + " " + (hit.weight > 0 ? "+" : "") + hit.weight;
      charges.appendChild(chip);
    });
  }

  function run() {
    var lines = input.value.split("\n").filter(function (line) {
      return line.trim().length;
    });

    if (!lines.length) {
      readout.textContent = "Paste some comments, one per line.";
      return;
    }

    var counts = { positive: 0, negative: 0, neutral: 0 };
    var found = [];
    var total = 0;

    lines.forEach(function (line) {
      var result = score(line);
      total += result.total;
      found = found.concat(result.hits);

      if (result.total > 0) counts.positive++;
      else if (result.total < 0) counts.negative++;
      else counts.neutral++;
    });

    drawStack(counts);
    drawLegend(counts);
    drawCharges(found);

    readout.textContent =
      lines.length +
      (lines.length === 1 ? " comment" : " comments") +
      " — " +
      counts.positive +
      " positive, " +
      counts.negative +
      " negative, " +
      counts.neutral +
      " neutral. Mean score " +
      (total / lines.length).toFixed(2) +
      ", from " +
      found.length +
      " lexicon hits.";
  }

  runButton.addEventListener("click", run);

  run();
})();
