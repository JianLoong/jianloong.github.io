/*
 * The phrase solver.
 *
 * The 2019 post drove this worker with jQuery, loaded from a CDN, for hide()
 * and show() alone — and the post's own lessons say that was a mistake on
 * mobile. The algorithm is untouched: js/workers/ga.js is the same file. This
 * replaces the DOM work and the newest-first table with a live fitness chart
 * and a log of improvements.
 */
(function () {
  var demo = document.querySelector("[data-ga]");
  if (!demo) return;

  var crossover = demo.querySelector("[data-ga-crossover]");
  var selection = demo.querySelector("[data-ga-selection]");
  var targetInput = demo.querySelector("[data-ga-target]");
  var runButton = demo.querySelector("[data-ga-run]");
  var readout = demo.querySelector("[data-ga-readout]");
  var chart = demo.querySelector("[data-ga-chart]");
  var rows = demo.querySelector("[data-ga-rows]");
  var log = demo.querySelector("[data-ga-log]");

  var NS = "http://www.w3.org/2000/svg";
  var W = 600;
  var H = 150;
  var PAD = 30;

  // The worker's alphabet, and the score it reaches when the phrase is right.
  // A-Z, space, ?, 0-9, ! and . is 40 symbols; the fitness ceiling is
  // 40 x length, which is what the worker reports when it finishes.
  var ALPHABET = /^[A-Z0-9 ?!.]*$/;
  var SYMBOLS = 40;

  // Generation windows the chart snaps to, so the curve stays readable instead
  // of being drawn against the worker's full 2,000-generation cap.
  var STEPS = [25, 50, 100, 200, 500, 1000, 2000];

  var points = [];
  var ceiling = 0;
  var worker = null;

  chart.setAttribute("viewBox", "0 0 " + W + " " + H);

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

  function span() {
    var max = 0;
    points.forEach(function (point) {
      if (point[0] > max) max = point[0];
    });
    for (var i = 0; i < STEPS.length; i++) {
      if (max <= STEPS[i]) return STEPS[i];
    }
    return max;
  }

  function drawChart() {
    clear(chart);
    chart.appendChild(el("rect", { class: "d-frame", x: 0, y: 0, width: W, height: H }));

    if (!points.length || !ceiling) {
      var hint = el("text", { class: "d-label", x: W / 2, y: H / 2 + 4, "text-anchor": "middle" });
      hint.textContent = "Each improvement is plotted here as it arrives.";
      chart.appendChild(hint);
      return;
    }

    var generations = span();

    function px(generation) {
      return PAD + (generation / generations) * (W - PAD * 2);
    }

    function py(fitness) {
      return H - PAD - (Math.max(fitness, 0) / ceiling) * (H - PAD * 2);
    }

    // The ceiling: the fitness that means every character matches the target.
    chart.appendChild(
      el("path", {
        class: "d-baseline",
        d: "M" + PAD + " " + py(ceiling).toFixed(1) + " H" + (W - PAD)
      })
    );

    chart.appendChild(
      el("path", {
        class: "d-best",
        d: points
          .map(function (point, index) {
            return (index ? "L" : "M") + px(point[0]).toFixed(1) + " " + py(point[1]).toFixed(1);
          })
          .join(" ")
      })
    );

    points.forEach(function (point) {
      chart.appendChild(
        el("circle", { class: "d-point", cx: px(point[0]).toFixed(1), cy: py(point[1]).toFixed(1), r: 2 })
      );
    });

    var labels = [
      { text: String(ceiling), x: 4, y: py(ceiling) + 4, anchor: "start" },
      { text: "0", x: 4, y: H - PAD + 4, anchor: "start" },
      { text: generations + " generations", x: W - PAD, y: H - 6, anchor: "end" }
    ];

    labels.forEach(function (label) {
      var text = el("text", { class: "d-label", x: label.x, y: label.y, "text-anchor": label.anchor });
      text.textContent = label.text;
      chart.appendChild(text);
    });
  }

  function addRow(generation, fitness, phrase) {
    var row = document.createElement("tr");
    [String(generation), String(fitness)].forEach(function (value) {
      var cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    var phraseCell = document.createElement("td");
    phraseCell.className = "phrase";
    phraseCell.textContent = phrase;
    row.appendChild(phraseCell);
    rows.appendChild(row);
    log.scrollTop = log.scrollHeight;
  }

  function reset() {
    points = [];
    ceiling = 0;
    rows.innerHTML = "";
    drawChart();
  }

  function idle() {
    runButton.disabled = false;
  }

  function onMessage(event) {
    var data = event.data;

    // Solved: the worker reports the ceiling as a word rather than a number.
    if (data[0] === "Complete") {
      var generations = points.length ? points[points.length - 1][0] : 0;
      readout.textContent =
        "Solved in " + generations + " generations, from " + points.length + " improvements.";
      idle();
      return;
    }

    // Gave up: its second field is a status string where an improvement has a
    // fitness. The old page printed this row as though it were a result.
    if (typeof data[1] === "string") {
      readout.textContent =
        "Stopped after " + data[0] + " generations without reaching the target. Random selection is the usual reason.";
      idle();
      return;
    }

    points.push([data[0], data[1]]);
    addRow(data[0], data[1], data[2]);
    readout.textContent =
      "Generation " + data[0] + " — fitness " + data[1] + " of " + ceiling + " — " + data[2];
    drawChart();
  }

  function start() {
    var target = targetInput.value.toLocaleUpperCase();

    if (!target) {
      readout.textContent = "Give it something to evolve towards.";
      return;
    }
    if (target.length > 100) {
      readout.textContent = "The worker takes up to 100 characters; that target is " + target.length + ".";
      return;
    }
    if (!ALPHABET.test(target)) {
      readout.textContent =
        "The worker's alphabet is A-Z, 0-9, space, ? ! and full stop. Remove anything else.";
      return;
    }
    if (!window.Worker) {
      readout.textContent = "This demo needs web workers.";
      return;
    }

    reset();
    ceiling = SYMBOLS * target.length;
    drawChart();
    runButton.disabled = true;
    readout.textContent = "Evolving towards " + target + ", out of a ceiling of " + ceiling + "…";

    if (!worker) {
      worker = new Worker("/js/workers/ga.js");
      worker.onmessage = onMessage;
      worker.onerror = function () {
        readout.textContent = "The worker could not be started, so the GA cannot run here.";
        idle();
      };
    }

    worker.postMessage([crossover.value, selection.value, target]);
  }

  runButton.addEventListener("click", start);

  // A text field in a form should run on Enter. It is not one, so wire it up.
  targetInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") start();
  });

  reset();
  readout.textContent = "Press run to evolve towards the target, or type your own.";
})();
