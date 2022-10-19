---
title: "k-Nearest Neighbour on Maps"
date: 2019-10-27
draft: false
tags: ["Nearest Neighbour", "Maps", "Voronoi"]
ShowReadingTime: true
cover:
  image: "/images/voronoi.png"
---

<script src="https://unpkg.com/d3@5.12.0/dist/d3.min.js"></script>
<script src="/posts/d3-delaunday.min.js"></script>

One of the most common query when working with maps is the nearest neighbour query. This blog post will use Voronoi Diagrams to explain more regarding the nearest neighbour query.

Below is an example of a Voronoi diagram generated using d3.js. One of the good use case of a voronoi diagram in real life applications would be where would be **finding a place to build emergency services.** This place should have the most number of neighbouring regions. For example, if you `click` on the region in the voronoi diagram below, you can see how many regions in which it would consider this region to be its neighbour. The diagram is randomly generated based on a number of points and thus every refresh of this page will show a different voronoi diagram.

<div id="canvas" style="text-align:center;max-width:30em;margin:auto;"></div>

<p align="center"><strong>Fig 1. Voronoi Diagram generated with 30 random points</strong></p>

<!-- <embed src="https://www.desmos.com/calculator/q0nyt99bcr?embed" width="100%" height="500px" style="border: 1px solid #ccc" frameborder=0></embed> -->

The codes to create this diagram are as follows :-

```javascript
const createVoronoi = () => {
  const width = 600;
  const height = 600;
  const vertices = d3.range(30).map(function (d) {
    return [Math.random() * width, Math.random() * height];
  });

  const delaunay = d3.Delaunay.from(vertices);
  const voronoi = delaunay.voronoi([0, 0, width, height]);
  let svg = d3.select("#canvas").append("svg").attr("viewBox", `0 0 600 600`);

  const mesh = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", voronoi.render());

  const bounds = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", voronoi.renderBounds());

  const points = svg
    .append("path")
    .attr("fill", "black")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", delaunay.renderPoints());
};
```

#### Example of a query

I will now re-use my data set of point from an earlier blog entry and I will generate the voronoi diagram. Basically, I would use a query point as well to find out the nearest neighbour and the surrounding neighbours. The figure below shows that the d3-delaunay provides a simple functions that allows you to find the point in which is the closest to the query point. This is done by using `delaunay.find()`. So if you are **inside the blue region**, your closest point would be the point inside the blue region.

It's surrounding neighbours could then be easily obtained once you have this point by using `delaunay.neighbor()` and passing the result of the first find function. So, the regions which are in teal would be the **neighbours of the region in blue**. All the other regions would be coloured in green. This simple data structure would allow you to easily obtain the nearest neighbour. However, of course, there is also the importance of the build time, insertion time and removal time as well.

<div id="exampleQuery" style="text-align:center;max-width:30em;margin:auto;"></div>
<p align="center"><strong>Fig 2. Voronoi Diagram for a NN query.</strong></p>

##### The codes to create this diagram are as follows

```javascript
const queryExample = () => {
  let points = [
    [40, 74],
    [34, 118],
    [41, 87],
    [44, 93],
    [39, 104],
    [32, 96],
    [47, 122],
    [42, 71],
  ];

  // Function to transform the points so that it would work on the grid
  const transform = (point) => {
    return [(point[0] / 90) * 500, (point[1] / 180) * 500];
  };

  let transformed = [];

  points.forEach((element) => {
    transformed.push(transform(element));
  });

  const delaunay = d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([0, 0, 500, 500]);

  // Call the draw Voronoi function.
  drawVoronoi("#exampleQuery", transformed);
};

const drawVoronoi = (id, vertices, color) => {
  const width = 500,
    height = 500;

  const delaunay = d3.Delaunay.from(vertices);
  const voronoi = delaunay.voronoi([0, 0, width, height]);
  let svg = d3.select(id).append("svg").attr("viewBox", `0 0 500 500`);

  const mesh = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", voronoi.render());

  const bounds = svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", voronoi.renderBounds());

  // Find the closest point to this coordinate.
  const ans = delaunay.find(40, 73);
  const neighbours = delaunay.neighbors(ans);
  for (const iterator of neighbours) {
    renderCell(svg, voronoi, iterator, d3.schemeTableau10[3]);
  }

  renderCell(svg, voronoi, ans, d3.schemeTableau10[0]);
  const points = svg
    .append("path")
    .attr("fill", "black")
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", delaunay.renderPoints());
};

const renderCell = (svg, voronoi, index, color) => {
  svg
    .append("path")
    .attr("fill", color)
    .attr("stroke", "#ccc")
    .attr("stroke-width", 1)
    .attr("d", voronoi.renderCell(index));
};
```

#### Lessons from this blog post.

- The learning curve for d3.js is **pretty insane.**
- Voronois are pretty easy using d3.
- Generators can be iterated using the for...of construct. [MDN link](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
- There is a way to make SVG responsive. Refer [this](https://medium.com/@louisemoxy/a-simple-way-to-make-d3-js-charts-svgs-responsive-7afb04bc2e4b) post.

<!-- https://bl.ocks.org/aaizemberg/raw/8063f8c2d1adb7c7ee68/ -->
<!-- https://observablehq.com/@d3/circle-dragging-iii?collection=@d3/d3-delaunay -->

<script>

document.getElementById("theme-toggle").addEventListener("click", () => {
    location.reload()
})


const queryExample = () => {
    
    let points = [[40,74],[34,118],[41,87],[44,93],[39,104],[32,96]
    ,[47,122],[42,71]];

    const transform = point => {
        return [point[0]/90 * 500, point[1]/180*500];
    }

    let transformed = [];
    points.forEach(element => {
        transformed.push(transform(element));
    });
    
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, 500, 500]);
    drawVoronoi("#exampleQuery", transformed);
}


const renderCell = (svg, voronoi, index, color) => {
   svg.append("path")
        .attr("fill", color)
        .attr("stroke","#ccc")
        .attr("stroke-width", 1)
        .attr("d", voronoi.renderCell(index));   
}

const drawVoronoi = (id, vertices, color) => {
    const width = 500, height = 500;
    const delaunay = d3.Delaunay.from(vertices);
    const voronoi = delaunay.voronoi([0, 0, 500, 500]);
    let svg = d3.select(id)
        .append("svg")
        .attr("viewBox", `0 0 500 500`);
        //.attr("width", width)
        //.attr("height", height);
    
    const mesh = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("d", voronoi.render());

    const bounds = svg.append("path")
        .attr("fill", "none")
        .attr("stroke","#ccc")
        .attr("stroke-width", 1)
        .attr("d", voronoi.renderBounds());

    const ans = delaunay.find(40,73);

    for (let index = 0; index < vertices.length; index++) {
        const element = vertices[index];
        renderCell(svg, voronoi, index, d3.schemeTableau10[4]);
    }

    const neighbours = delaunay.neighbors(ans);
    for (const iterator of neighbours) {
        renderCell(svg, voronoi, iterator, d3.schemeTableau10[3]);
    };
     
    renderCell(svg, voronoi, ans, d3.schemeTableau10[0]);
    const points = svg.append("path")
        .attr("fill", "black")
        .attr("stroke","#ccc")
        .attr("stroke-width", 1)
        .attr("d", delaunay.renderPoints());
};

const drawExampleVoronoi = () => {

    const width = 600, height = 600;
    // const vertices = d3.range(30).map(function(d) {
    //     return [Math.random() * width, Math.random() * height];
    // });

    const radius = 10;
    const circles = d3.range(30).map(i => ({
        x: Math.random() * (width - radius * 2) + radius,
        y: Math.random() * (height - radius * 2) + radius,
    }));

    const delaunay = d3.Delaunay.from(circles, d => d.x, d => d.y);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    
    let svg = d3.select("#canvas")
        .append("svg")
        .attr("viewBox", `0 0 600 600`);
        // .attr("width", width)
        // .attr("height", height);

    // const circle = svg.append("g")
    // .selectAll("circle")
    // .data(circles)
    // .join("circle")
    //   .attr("cx", d => d.x)
    //   .attr("cy", d => d.y)
    //   .attr("r", radius)
    //   .attr("fill", "black");
    
    const mesh = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1)
        .attr("d", voronoi.render());

    const bounds = svg.append("path")
        .attr("fill", "none")
        .attr("stroke","#ccc")
        .attr("stroke-width", 1)
        .attr("d", voronoi.renderBounds());

    // for (let index = 0; index < 10; index++) {
    //     svg.append("path")
    //     .attr("fill", d3.schemeTableau10[index % 10])
    //     .attr("stroke","#ccc")
    //     .attr("stroke-width", 1)
    //     .attr("d", voronoi.renderCell(index));
    // }; 

    const points = svg.append("path")
        .attr("fill", "black")
        .attr("stroke","#ccc")
        .attr("stroke-width", 1)
        .attr("d", delaunay.renderPoints());
};


const drawVoronoiWithPoints = (id, noOfPoints) => {

    let selected = undefined;
    
    const width = 1000, height = 1000;  
    const circles = d3.range(30).map(function(d) {
        return [Math.random() * width, Math.random() * height];
    });

    const query = [Math.random() * width,
        Math.random() * height ];

    const delaunay = d3.Delaunay.from(circles);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    let svg = d3.select(id)
        .append("svg")
        .attr("viewBox", `0 0 1000 1000`);
     
    const mesh = svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 5)
        .attr("d", voronoi.render());

    const bounds = svg.append("path")
        .attr("fill", "none")
        .attr("stroke","#ccc")
        .attr("stroke-width", 5)
        .attr("d", voronoi.renderBounds());

    const points = () =>  svg.append("path")
        .attr("fill", "black")
        .attr("stroke","#ccc")
        .attr("stroke-width", 2)
        .attr("d", delaunay.renderPoints());

    points();

    svg.on("click", function() {
        var coords = d3.mouse(this);
        var color = "white"
        if (document.body.className.includes("dark")) {
          color = "dark"
        } else {
          color = "white"
        }
        //mesh();
        if (selected != undefined){
            // Determine theme colour

            renderCell(svg, voronoi, selected, color); 
            
            for (const iterator of delaunay.neighbors(selected)) 
                renderCell(svg, voronoi, iterator, color);
            selected = undefined;
        }

        const ans = (delaunay.find(coords[0],coords[1]));
        selected = ans;
        renderCell(svg, voronoi, ans, d3.schemeTableau10[0]);
   
        points();
        //console.log(ans);
        const neighbours = delaunay.neighbors(ans);
        for (const iterator of neighbours) {
            renderCell(svg, voronoi, iterator, d3.schemeTableau10[3]);
        };  
    });
};


//drawExampleVoronoi();
queryExample();
drawVoronoiWithPoints("#canvas",30);

</script>
