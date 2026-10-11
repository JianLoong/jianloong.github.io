/*
 * The travelling salesperson demo.
 *
 * The 2019 post drew this with Chartist: a stylesheet and two plugin scripts
 * from two CDNs, and a chart API whose axes cannot hold both coordinates of a
 * point — which is why the old chart's axis labels drifted into nonsense. None
 * of the algorithm changed. js/workers/tsp.js is the same file it always was;
 * this only replaces the drawing, in plain SVG, coloured by classes so the
 * result follows the light/dark toggle without a re-render.
 */
(function () {
  var demo = document.querySelector("[data-tsp]");
  if (!demo) return;

  // The thirteen cities, in the order of the distance matrix the worker
  // carries. A is the depot and never moves; the routes it returns are
  // permutations of B-M, which the page closes back onto A.
  var CITIES = {
    A: { name: "New York", lon: -74, lat: 40 },
    B: { name: "Los Angeles", lon: -118, lat: 34 },
    C: { name: "Chicago", lon: -87, lat: 41 },
    D: { name: "Minneapolis", lon: -93, lat: 44 },
    E: { name: "Denver", lon: -104, lat: 39 },
    F: { name: "Dallas", lon: -96, lat: 32 },
    G: { name: "Seattle", lon: -122.33, lat: 47 },
    H: { name: "Boston", lon: -71, lat: 42 },
    I: { name: "San Francisco", lon: -122.41, lat: 37 },
    J: { name: "St. Louis", lon: -90, lat: 38 },
    K: { name: "Houston", lon: -95, lat: 29 },
    L: { name: "Phoenix", lon: -111.07, lat: 33 },
    M: { name: "Salt Lake City", lon: -111.89, lat: 40 }
  };

  // Google OR-Tools' answer for this matrix, which is what the demo starts on.
  var SUGGESTED = "AHCDEMGIBLKFJA".split("");

  var NS = "http://www.w3.org/2000/svg";
  var TOUR_W = 600;
  var TOUR_PAD = 36;
  var CHART_W = 600;
  var CHART_H = 150;
  var CHART_PAD = 26;

  var lons = [];
  var lats = [];
  Object.keys(CITIES).forEach(function (key) {
    lons.push(CITIES[key].lon);
    lats.push(CITIES[key].lat);
  });
  var minLon = Math.min.apply(null, lons);
  var maxLon = Math.max.apply(null, lons);
  var minLat = Math.min.apply(null, lats);
  var maxLat = Math.max.apply(null, lats);

  // A plate carrée fit with latitude flipped, since SVG y grows downward.
  var scale = (TOUR_W - TOUR_PAD * 2) / (maxLon - minLon);
  var TOUR_H = Math.round((maxLat - minLat) * scale + TOUR_PAD * 2);

  function x(lon) {
    return TOUR_PAD + (lon - minLon) * scale;
  }

  function y(lat) {
    return TOUR_H - TOUR_PAD - (lat - minLat) * scale;
  }

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

  var tourSvg = demo.querySelector("[data-tsp-tour]");
  var fitnessSvg = demo.querySelector("[data-tsp-fitness]");
  var readout = demo.querySelector("[data-tsp-readout]");
  var runButton = demo.querySelector("[data-tsp-run]");
  var crossOver = demo.querySelector("[data-tsp-crossover]");
  var selection = demo.querySelector("[data-tsp-selection]");

  tourSvg.setAttribute("viewBox", "0 0 " + TOUR_W + " " + TOUR_H);
  fitnessSvg.setAttribute("viewBox", "0 0 " + CHART_W + " " + CHART_H);

  function drawTour(route) {
    clear(tourSvg);
    tourSvg.appendChild(
      el("rect", { class: "d-frame", x: 0, y: 0, width: TOUR_W, height: TOUR_H })
    );

    var path = route
      .map(function (letter, index) {
        var city = CITIES[letter];
        return (index ? "L" : "M") + x(city.lon).toFixed(1) + " " + y(city.lat).toFixed(1);
      })
      .join(" ");
    tourSvg.appendChild(el("path", { class: "d-route", d: path }));

    var seen = {};
    route.forEach(function (letter) {
      if (seen[letter]) return;
      seen[letter] = true;
      var city = CITIES[letter];
      var cx = x(city.lon);
      var cy = y(city.lat);
      tourSvg.appendChild(el("circle", { class: "d-point", cx: cx, cy: cy, r: 2.6 }));
      var label = el("text", { class: "d-city", x: cx, y: cy - 6, "text-anchor": "middle" });
      label.textContent = letter;
      tourSvg.appendChild(label);
    });
  }

  function drawFitness(summary) {
    var generations = summary[0];
    var average = summary[1];
    var best = summary[2];

    clear(fitnessSvg);
    fitnessSvg.appendChild(
      el("rect", { class: "d-frame", x: 0, y: 0, width: CHART_W, height: CHART_H })
    );

    if (!generations.length) return;

    var lo = Math.min.apply(null, average.concat(best));
    var hi = Math.max.apply(null, average.concat(best));
    var span = hi - lo || 1;
    var step = (CHART_W - CHART_PAD * 2) / Math.max(generations.length - 1, 1);

    function line(values) {
      return values
        .map(function (value, index) {
          var px = (CHART_PAD + index * step).toFixed(1);
          var py = (CHART_H - CHART_PAD - ((value - lo) / span) * (CHART_H - CHART_PAD * 2)).toFixed(1);
          return (index ? "L" : "M") + px + " " + py;
        })
        .join(" ");
    }

    fitnessSvg.appendChild(el("path", { class: "d-avg", d: line(average) }));
    fitnessSvg.appendChild(el("path", { class: "d-best", d: line(best) }));

    [
      { text: hi.toLocaleString(), top: 14 },
      { text: lo.toLocaleString(), top: CHART_H - 6 }
    ].forEach(function (tick) {
      var text = el("text", { class: "d-label", x: 6, y: tick.top });
      text.textContent = tick.text;
      fitnessSvg.appendChild(text);
    });
  }

  function onResult(event) {
    var route = String(event.data[0]);
    var distance = event.data[1];
    var summary = event.data[2];

    drawTour(["A"].concat(route.split(""), ["A"]));
    drawFitness(summary);

    readout.textContent =
      "Best tour this run: " +
      distance.toLocaleString() +
      " miles over " +
      summary[0].length +
      " generations. The proven optimum for this matrix is 7,293, which the GA does not reach.";
    runButton.disabled = false;
  }

  var worker = null;

  function run() {
    runButton.disabled = true;
    readout.textContent =
      "Running " + crossOver.value + " cross-over with " + selection.value + " selection…";

    if (!worker) {
      worker = new Worker("/js/workers/tsp.js");
      worker.onmessage = onResult;
      worker.onerror = function () {
        readout.textContent = "The worker could not be started, so the GA cannot run here.";
        runButton.disabled = false;
      };
    }

    worker.postMessage([crossOver.value, selection.value]);
  }

  runButton.addEventListener("click", run);

  drawTour(SUGGESTED);
  readout.textContent =
    "Starting on OR-Tools' suggested route for this matrix: " +
    SUGGESTED.join("") +
    " at 7,293 miles. Press run for the genetic algorithm's own answer.";
})();
