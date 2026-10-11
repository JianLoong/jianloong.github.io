/*
 * The nearest-neighbour demos.
 *
 * The 2019 post loaded d3 5.12 from a CDN and drew with d3-selection; the
 * geometry came from d3-delaunay, which is still what computes the cells here
 * (js/vendor/d3-delaunay-5.1.6.min.js). Only the drawing and the input handling
 * are new, in plain SVG and DOM, so nothing else has to be vendored and the
 * result follows the theme through its classes.
 *
 * Two demos share one idea: Delaunay gives the triangulation, its Voronoi dual
 * gives the regions, and delaunay.find() answers a nearest-neighbour query by
 * simply saying which region a point fell into.
 */
(function () {
  var NS = "http://www.w3.org/2000/svg";
  var SIZE = 500;

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

  function frame(svg) {
    svg.appendChild(el("rect", { class: "d-frame", x: 0, y: 0, width: SIZE, height: SIZE }));
  }

  function mesh(svg, voronoi) {
    svg.appendChild(el("path", { class: "d-mesh", d: voronoi.render() }));
    svg.appendChild(el("path", { class: "d-mesh", d: voronoi.renderBounds() }));
  }

  function points(svg, delaunay) {
    svg.appendChild(el("path", { class: "d-point", d: delaunay.renderPoints() }));
  }

  function cell(svg, voronoi, index, className) {
    svg.appendChild(el("path", { class: className, d: voronoi.renderCell(index) }));
  }

  // ---- The scatter: thirty random points, one region each -------------------
  var scatter = document.querySelector("[data-voronoi-scatter]");

  if (scatter) {
    scatter.setAttribute("viewBox", "0 0 " + SIZE + " " + SIZE);

    var drawScatter = function () {
      clear(scatter);

      var vertices = [];
      for (var i = 0; i < 30; i++) {
        vertices.push([Math.random() * SIZE, Math.random() * SIZE]);
      }

      var delaunay = window.d3.Delaunay.from(vertices);
      var voronoi = delaunay.voronoi([0, 0, SIZE, SIZE]);

      frame(scatter);
      mesh(scatter, voronoi);
      points(scatter, delaunay);
    };

    drawScatter();

    var redraw = document.querySelector("[data-voronoi-scatter-new]");
    if (redraw) redraw.addEventListener("click", drawScatter);
  }

  // ---- The query: eight cities, and whichever is nearest to the click -------
  var query = document.querySelector("[data-voronoi-query]");

  if (query) {
    query.setAttribute("viewBox", "0 0 " + SIZE + " " + SIZE);

    // The eight cities the 2019 post used, with their real signs.
    var CITIES = [
      { name: "New York", lon: -74, lat: 40 },
      { name: "Los Angeles", lon: -118, lat: 34 },
      { name: "Chicago", lon: -87, lat: 41 },
      { name: "Minneapolis", lon: -93, lat: 44 },
      { name: "Denver", lon: -104, lat: 39 },
      { name: "Dallas", lon: -96, lat: 32 },
      { name: "Seattle", lon: -122, lat: 47 },
      { name: "Boston", lon: -71, lat: 42 }
    ];

    // The window the diagram covers, so the cities land where they belong
    // rather than in the middle of the box.
    var LON0 = -126;
    var LON1 = -66;
    var LAT0 = 26;
    var LAT1 = 50;

    function px(lon) {
      return ((lon - LON0) / (LON1 - LON0)) * SIZE;
    }

    function py(lat) {
      // SVG y grows downward, so latitude runs the other way.
      return ((LAT1 - lat) / (LAT1 - LAT0)) * SIZE;
    }

    var vertices = CITIES.map(function (city) {
      return [px(city.lon), py(city.lat)];
    });

    var delaunay = window.d3.Delaunay.from(vertices);
    var voronoi = delaunay.voronoi([0, 0, SIZE, SIZE]);
    var selected = null;

    var readout = document.querySelector("[data-voronoi-readout]");

    function draw(nearest, neighbours) {
      clear(query);
      frame(query);

      for (var i = 0; i < vertices.length; i++) cell(query, voronoi, i, "d-idle");

      if (neighbours) {
        neighbours.forEach(function (index) {
          cell(query, voronoi, index, "d-neighbour");
        });
      }
      if (nearest !== null && nearest !== undefined) {
        cell(query, voronoi, nearest, "d-nearest");
      }

      mesh(query, voronoi);
      points(query, delaunay);

      CITIES.forEach(function (city, index) {
        var label = el("text", {
          class: "d-city",
          x: vertices[index][0],
          y: vertices[index][1] - 7,
          "text-anchor": "middle"
        });
        label.textContent = city.name;
        query.appendChild(label);
      });
    }

    function ask(x, y) {
      var nearest = delaunay.find(x, y);
      var neighbours = Array.from(delaunay.neighbors(nearest));

      selected = nearest;
      draw(nearest, neighbours);

      readout.textContent =
        "Nearest to that point: " +
        CITIES[nearest].name +
        ". Neighbours in the triangulation: " +
        neighbours
          .map(function (index) {
            return CITIES[index].name;
          })
          .join(", ") +
        ".";
    }

    query.addEventListener("click", function (event) {
      var rect = query.getBoundingClientRect();
      ask(
        ((event.clientX - rect.left) / rect.width) * SIZE,
        ((event.clientY - rect.top) / rect.height) * SIZE
      );
    });

    // Start with a query in the middle of the country so the diagram shows its
    // two tints before anyone clicks.
    ask(SIZE / 2, SIZE / 2);
  }
})();
