/*
 * The VADER demo.
 *
 * The 2022 post drove the worker with jQuery, loaded from a CDN, purely to
 * reveal a table once a result arrived. The analysis is untouched:
 * js/workers/vader.js is the same Comcast port. This replaces the DOM work
 * with a readout, a polarity bar and a four-cell table.
 */
(function () {
  var demo = document.querySelector("[data-vader]");
  if (!demo) return;

  var input = demo.querySelector("[data-vader-input]");
  var runButton = demo.querySelector("[data-vader-run]");
  var readout = demo.querySelector("[data-vader-readout]");
  var bar = demo.querySelector("[data-vader-bar]");

  var cells = {
    neg: demo.querySelector("[data-vader-neg]"),
    neu: demo.querySelector("[data-vader-neu]"),
    pos: demo.querySelector("[data-vader-pos]"),
    compound: demo.querySelector("[data-vader-compound]")
  };

  var NS = "http://www.w3.org/2000/svg";
  var W = 600;
  var H = 46;
  var PAD = 14;
  var TRACK = 12;

  var worker = null;

  bar.setAttribute("viewBox", "0 0 " + W + " " + H);

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

  // The scale runs -1 to 1 across the width, with zero in the middle, so the
  // length of the bar is the strength and the side is the direction.
  function drawBar(compound) {
    clear(bar);

    var mid = W / 2;
    var y = (H - TRACK) / 2 - 2;
    var half = (W - PAD * 2) / 2;
    var value = Math.max(-1, Math.min(1, compound || 0));
    var end = mid + value * half;

    bar.appendChild(
      el("rect", { class: "d-track", x: PAD, y: y, width: W - PAD * 2, height: TRACK, rx: 6 })
    );

    if (value !== 0) {
      bar.appendChild(
        el("rect", {
          class: value > 0 ? "d-positive" : "d-negative",
          x: Math.min(mid, end),
          y: y,
          width: Math.abs(end - mid),
          height: TRACK,
          rx: 6
        })
      );
    }

    bar.appendChild(
      el("path", { class: "d-zero", d: "M" + mid + " " + (y - 4) + " V" + (y + TRACK + 4) })
    );

    [
      { text: "-1 negative", x: PAD, anchor: "start" },
      { text: "neutral", x: mid, anchor: "middle" },
      { text: "positive 1", x: W - PAD, anchor: "end" }
    ].forEach(function (label) {
      var text = el("text", { class: "d-label", x: label.x, y: H - 2, "text-anchor": label.anchor });
      text.textContent = label.text;
      bar.appendChild(text);
    });
  }

  // VADER's own reading of a compound score: past a twentieth either way it is
  // no longer neutral.
  function band(compound) {
    if (compound >= 0.05) return "positive";
    if (compound <= -0.05) return "negative";
    return "neutral";
  }

  function show(scores) {
    ["neg", "neu", "pos", "compound"].forEach(function (key) {
      cells[key].textContent = Number(scores[key]).toFixed(4);
    });
    drawBar(scores.compound);
    readout.textContent =
      "Compound " + Number(scores.compound).toFixed(4) + " — " + band(scores.compound) + ".";
  }

  function run() {
    var text = input.value.trim();

    if (!text) {
      readout.textContent = "Give it something to read.";
      return;
    }
    if (!window.Worker) {
      readout.textContent = "This demo needs web workers.";
      return;
    }

    readout.textContent = "Reading…";
    runButton.disabled = true;

    if (!worker) {
      worker = new Worker("/js/workers/vader.js");
      worker.onmessage = function (event) {
        show(event.data);
        runButton.disabled = false;
      };
      worker.onerror = function () {
        readout.textContent = "The worker could not be started, so VADER cannot run here.";
        runButton.disabled = false;
      };
    }

    worker.postMessage(text);
  }

  runButton.addEventListener("click", run);

  drawBar(0);
  readout.textContent = "Press run to score the paragraph above.";
})();
