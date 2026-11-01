---
title: Nearest neighbour on a map
description: A Voronoi diagram turns the most common question you can ask a map into a region lookup. Two live diagrams, one of them clickable.
date: 2019-10-27
category: Data
readingTime: 4
scripts:
  - /js/vendor/d3-delaunay-5.1.6.min.js
  - /js/posts/voronoi.js
---

Most questions you ask a map are really the same question: what is nearest? Nearest station, nearest shop, nearest cell tower, nearest anything.

Take the fire station. You have one to place, and you want it to serve as many addresses as possible. Every address belongs to whichever station is closest to it, so the first thing you need is a way to ask "who is closest?" for every point on the map at once. That is what a Voronoi diagram gives you: the plane is cut into one region per point, and each region is exactly the set of positions closer to that point than to any other.

<div class="demo" data-voronoi-scatter-demo>
<div class="demo-controls">
<button type="button" data-voronoi-scatter-new>New points</button>
</div>
<svg data-voronoi-scatter viewBox="0 0 500 500" role="img" aria-label="A Voronoi diagram of thirty random points, each with its own region."></svg>
<p class="demo-note">Thirty random points, their regions, and the triangulation they came from. The 2019 version asked you to reload the page for a new diagram; a button is cheaper.</p>
</div>

The whole first diagram is four lines once the points exist. The geometry comes from d3-delaunay, which is the one part of the old d3 stack still carried here. Everything else about the old post was drawing.

```javascript
var delaunay = d3.Delaunay.from(vertices);
var voronoi = delaunay.voronoi([0, 0, SIZE, SIZE]);

svg.appendChild(el("path", { class: "d-mesh", d: voronoi.render() }));
svg.appendChild(el("path", { class: "d-mesh", d: voronoi.renderBounds() }));
svg.appendChild(el("path", { class: "d-point", d: delaunay.renderPoints() }));
```

## The query

Now the interesting half. The triangulation knows which regions touch which, so a nearest-neighbour query is a region lookup and a neighbour query is a walk over the edges of that region:

```javascript
var nearest = delaunay.find(x, y);       // the region the point fell into
var neighbours = delaunay.neighbors(nearest);

cell(svg, voronoi, nearest, "d-nearest");
neighbours.forEach(function (index) {
  cell(svg, voronoi, index, "d-neighbour");
});

function cell(svg, voronoi, index, className) {
  svg.appendChild(el("path", { class: className, d: voronoi.renderCell(index) }));
}
```

The eight cities below are the ones from the travelling salesperson post, so their positions should look familiar.

<div class="demo" data-voronoi-query-demo>
<p class="demo-readout" data-voronoi-readout aria-live="polite">Loading…</p>
<svg class="demo-click" data-voronoi-query viewBox="0 0 500 500" role="img" aria-label="A Voronoi diagram of eight US cities. Clicking anywhere shades the region of the nearest city and the regions that share an edge with it."></svg>
<p class="demo-note">Click anywhere. The accent region belongs to the city nearest to that point; the cooler regions share a Delaunay edge with it. That shared edge is the whole trick: cities whose regions touch are exactly the pairs that are adjacent on the map.</p>
</div>

<figure>
<img src="/assets/posts/voronoi-nearest-neighbour.png" alt="A Voronoi diagram of a cluster of points: one region shaded blue in the middle, the regions touching it shaded teal, and every other region left white." width="608" height="589" loading="lazy" decoding="async">
<figcaption>The 2019 version of the same query, captured then. The blue region is the nearest one and the teal ones are its neighbours: the two tints the current demo still uses, in the site's own palette.</figcaption>
</figure>

## What it taught me

- **The learning curve on d3 is genuinely steep**, and most of it is spent on the drawing rather than the data structure underneath.
- **Voronoi is not the hard part.** Once the triangulation exists, the regions and the neighbour lists fall out of it.
- **`neighbours` in a triangulation means adjacent, not k-nearest.** They are different queries, and conflating them is easy until a reader tries to search for "the three nearest" and gets two cities on the other side of the country.
- **Iterate the edges explicitly** rather than the region list: `for...of` over what the triangulation hands back is enough. [MDN on iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators).
- **Make the SVG responsive once, with a `viewBox`**, instead of per-diagram sizes. [A short write-up on that](https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b).
- **Queries are cheap; changes are not.** Building the triangulation once and asking it thousands of questions is the deal. Move the points and the structure has to be rebuilt, so a map where things move is a data structure problem, not a drawing one.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The demos were redrawn in plain SVG in 2026; the geometry is still d3-delaunay, which is the only d3 left on the page.</p>
