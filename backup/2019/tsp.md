---
title: "TSP Algorithm: Solving the Traveling Salesman Problem with Genetic Algorithms"
author: Jian Liew
pubDatetime: 2019-12-15T00:00:00+11:00
slug: tsp-algorithm-genetic-algorithms
featured: false
draft: false
readingTime: 6
tags:
  - software-engineering
  - project
description: "Implementing a genetic algorithm solution for the Traveling Salesman Problem using JavaScript and Web Workers for parallel processing."
---

This post is best viewed using the light theme.

<link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
<script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartist-plugin-pointlabels@0.0.6/dist/chartist-plugin-pointlabels.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chartist-plugin-legend/0.6.2/chartist-plugin-legend.min.js"></script>

## What is the Traveling Salesman Problem?

Ever wondered why the delivery driver drives past your house? Or why your GPS sometimes takes you on what seems like a weird route? That's exactly what the **Traveling Salesman Problem (TSP)** tries to solve!

In simple terms: *"Given a list of cities and the distances between them, what's the shortest possible route that visits each city exactly once and returns to the starting point?"*

It sounds easy, but it's actually one of the most famous problems in computer science. With just 13 cities, there are over 6 billion possible routes to check!

## Why Use Genetic Algorithms?

Genetic algorithms are perfect for TSP because:
- **They don't need to check every possible route** (which would take forever)
- **They can find good solutions quickly** (even if not perfect)
- **They're flexible** - you can easily change parameters to experiment

This post shows how genetic algorithms can solve TSP using real US city coordinates. We'll compare our results with Google's OR-Tools to see how well we do!

## The Cities We're Working With

Here are the 13 US cities we'll be optimizing routes for:

| City | Coordinates | Code | Description |
|------|-------------|------|-------------|
| New York | 40, -74 | A | Starting point |
| Los Angeles | 34, -118 | B | West Coast hub |
| Chicago | 41, -87 | C | Midwest center |
| Minneapolis | 44, -93 | D | Northern city |
| Denver | 39, -104 | E | Mountain region |
| Dallas | 32, -96 | F | Southern hub |
| Seattle | 47, -122 | G | Pacific Northwest |
| Boston | 42, -71 | H | Northeast |
| San Francisco | 37, -122 | I | Bay Area |
| St. Louis | 38, -90 | J | Gateway to West |
| Houston | 29, -95 | K | Texas coast |
| Phoenix | 33, -111 | L | Desert Southwest |
| Salt Lake City | 40, -111 | M | Mountain West |

**Total: 13 cities** - enough to make it interesting but not overwhelming!

## How the Algorithm Works

### The Route Representation
Instead of storing full city names, we use letters A-M. So a route like "A→H→C→D→E→M→G→I→B→L→K→F→J→A" means:
**New York → Boston → Chicago → Minneapolis → Denver → Salt Lake City → Seattle → San Francisco → Los Angeles → Phoenix → Houston → Dallas → St. Louis → New York**

### Distance Calculation
We use **Euclidean distance** (straight-line distance) between coordinates, not road distance. This makes calculations faster and gives us a good approximation.

### The Genetic Algorithm Process
1. **Start with random routes** (population of 20 routes)
2. **Calculate fitness** (shorter routes = better fitness)
3. **Select parents** using different methods
4. **Create children** by combining parts of parent routes
5. **Mutate** some routes randomly
6. **Repeat** for 500 generations

## Interactive TSP Solver

Try the interactive demo below! You can experiment with different genetic algorithm settings:

<div id="cities" class="ct-perfect-fourth"></div>

### Choose Your Settings

**Cross Over Method:**
<select id="crossOverMethod" class="select-css">
  <option value="ordered">Ordered</option>
  <option value="pmx">PMX</option>
</select>

**Selection Method:**
<select id="selectionMethod" class="select-css">
  <option value="tournament">Tournament</option>
  <option value="random">Random</option>
  <option value="rank">Rank</option>
  <option value="rouletteWheel">Roulette Wheel</option>
</select>

**Click "Run" to see how different settings affect the solution!**

<button type="button" id="run" class="hvr-sweep-to-right">Run</button>
<button type="button" onclick="location.reload()" style="margin-left: 10px; background-color: var(--accent); border: none; color: white; padding: 12px 24px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; font-weight: 600; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">Refresh Page</button>

### Quick Tips:
- **Random selection** usually gives poor results - it defeats the purpose of genetic algorithms!
- **Tournament selection** tends to work best for TSP
- Each run gives different results due to the random nature of genetic algorithms
- We use a **mutation rate of 0.2** and **population size of 20**

<div class="columnTwo">
<h3 style="text-align:center" id="chart-title"></h3>
<div class="ct-chart ct-perfect-fourth"></div>
</div>

## Results and Analysis

### How Different Methods Perform
**Roulette Wheel selection** tends to create more dramatic fitness spikes - you'll see the blue line jump around more!

### The Optimal Solution
Google's OR-Tools found the best possible route:
**New York → Boston → Chicago → Minneapolis → Denver → Salt Lake City → Seattle → San Francisco → Los Angeles → Phoenix → Houston → Dallas → St. Louis → New York**

**Total distance: 7,293 miles**

Our genetic algorithm won't always find this exact solution, but it gets pretty close and does it much faster than checking all possible routes!

<div class="columnTwo">
<h5 style="text-align:center" id="summary-chart"></h5>
<div class="summary-chart ct-perfect-fourth"></div>
</div>

## What I Learned Building This

### Key Insights
- **Mapping coordinates** - latitude and longitude need to be swapped for proper chart display
- **Chart APIs** - SVG charts are more responsive but have limitations with axis control
- **Genetic algorithms** - mutation rates above 0.5 turn GA into random search
- **Web workers** - essential for keeping UI responsive during heavy calculations
- **Performance** - population size of 20 and 500 generations work well for this problem size

### Real-World Applications

TSP isn't just academic! It's used everywhere:
- **Delivery companies** optimizing routes for drivers
- **Circuit board manufacturing** minimizing drill paths
- **DNA sequencing** finding optimal gene arrangements
- **Robot path planning** in warehouses and factories

Genetic algorithms are perfect for these real-world problems because they can find good solutions quickly, even when the perfect solution would take too long to calculate.

<script>

function initializeTSP() {
  var defaultOptions = {
    currency: undefined, //accepts '£', '$', '€', etc.
    //e.g. 4000 => €4,000
    tooltipFnc: undefined, //accepts function
    //build custom tooltip
    transformTooltipTextFnc: undefined, // accepts function
    // transform tooltip text
    class: undefined, // accecpts 'class1', 'class1 class2', etc.
    //adds class(es) to tooltip wrapper
    anchorToPoint: false, //accepts true or false
    //tooltips do not follow mouse movement -- they are anchored to the point / bar.
    appendToBody: false //accepts true or false
    //appends tooltips to body instead of chart container
  };

  let RAD2DEG = 180 / Math.PI;
  let PI_4 = Math.PI / 4;

  /* The following functions take or return their results in degrees */

  function y2lat(y) { return (Math.atan(Math.exp(y / RAD2DEG)) / PI_4 - 1) * 90; }
  function x2lon(x) { return x; }

  function lat2y(lat) { return lat }
  function lon2y(lon) { return lon; }

  // [0,7,2,3,4,12,6,1,11,10,5,9,0] 

  new Chartist.Line(".ct-chart",[], {
  showLine: true,
  axisX: {
    type: Chartist.AutoScaleAxis,
    onlyInteger: true
  }
  });

  new Chartist.Line(".summary-chart",[], {
  showLine: true,
  axisX: {
    type: Chartist.AutoScaleAxis,
    onlyInteger: true
  }
  });

  const mapLocation = (x, y) => {
    return {
      x: y,
      y: x
    };
  };

  const locationA = mapLocation(lat2y(40), lon2y(-74) );
  const locationB = mapLocation(lat2y(34), lon2y(-118 ));
  const locationC = mapLocation(lat2y(41), lon2y(-87) );
  const locationD = mapLocation(lat2y(44), lon2y(-93) );
  const locationE = mapLocation(lat2y(39), lon2y(-104 ));
  const locationF = mapLocation(lat2y(32), lon2y(-96) );
  const locationG = mapLocation(lat2y(47), lon2y(-122.33 ));
  const locationH = mapLocation(lat2y(42), lon2y(-71) );
  const locationI = mapLocation(lat2y(37), lon2y(-122.41 ));
  const locationJ = mapLocation(lat2y(38), lon2y(-90) );
  const locationK = mapLocation(lat2y(29), lon2y(-95) );
  const locationL = mapLocation(lat2y(33), lon2y(-111.07 ));
  const locationM = mapLocation(lat2y(40), lon2y(-111.89 ));

  const buildSeries = result => {
    let arrayResult = [];
    let array = result.split("");

    //arrayResult.push([locationA, determineLocation(array[1])]);

    for (let index = 1; index < array.length; index++) {
      const element = array[index];
      let inner = [];
      inner.push(determineLocation(array[index]));
      inner.push(determineLocation(array[index - 1]));
      inner.sort((a, b) => a.x - b.x);
      arrayResult.push(inner);
    }

    return arrayResult;
  };

  const determineLocation = character => {
    let location = undefined;

    switch (character) {
      case "A":
        return locationA;
      case "B":
        return locationB;
      case "C":
        return locationC;
      case "D":
        return locationD;
      case "E":
        return locationE;
      case "F":
        return locationF;
      case "G":
        return locationG;
      case "H":
        return locationH;
      case "I":
        return locationI;
      case "J":
        return locationJ;
      case "K":
        return locationK;
      case "L":
        return locationL;
      case "M":
        return locationM;
    }
  };


  const button = document.getElementById("run");
  const cm = document.getElementById("crossOverMethod");
  const sm = document.getElementById("selectionMethod");
  const title = document.getElementById("chart-title");
  const summary = document.getElementById("summary-chart");


  const answerBuilder = {
    labels: [],
    series: buildSeries("AHCDEMGIBLKFJA")
  };

  var defaultOptions = {
    labelClass: 'ct-label',
    labelOffset: {
      x: 0,
      y: -10
    },
    textAnchor: 'middle',
    labelInterpolationFnc: Chartist.noop
  };

  var chart = new Chartist.Line(
    "#cities",
    answerBuilder,
    {
      showLine: true,
      axisX: {
        type: Chartist.AutoScaleAxis,
        onlyInteger: true
      },
      plugins: [
        Chartist.plugins.ctPointLabels({
          textAnchor: "middle",
          
        })
      ]
    }
  );

  if (window.Worker) {
    const tspWorker = new Worker("/assets/scripts/tsp-worker.js");

    tspWorker.onmessage = function(e) {
      let result = "A" + e.data[0] + "A";
    
      const seriesBuilder = {
        labels: [],
        series: buildSeries(result)
      };

      title.innerHTML = "Total Distance = " + e.data[1];
      summary.innerHTML = "Average fitness (Blue)/ Best fitness(Red) over Generation";

      new Chartist.Line(
        ".ct-chart",
        seriesBuilder,
        {
          showLine: true,
          axisX: {
            type: Chartist.AutoScaleAxis,
            onlyInteger: true
          },
          plugins: [
            Chartist.plugins.ctPointLabels({
              textAnchor: "middle",
              
            })
          ]
        }
      );

      const seriesSummary = {
        labels: e.data[2][0],
        series: [e.data[2][1], e.data[2][2]]
      };


      new Chartist.Line(
        ".summary-chart",
        seriesSummary,
        {
          showLine: true,
          fullWidth: false,
          chartPadding: {
            right: 40
          },
          axisX: {
             showLabel: false
          },
          plugins: [
          ]
        }
      );
    };

    button.onclick = function() {
      let crossOverMethod = cm.options[cm.selectedIndex].value;
      let selectionMethod = sm.options[sm.selectedIndex].value;
      tspWorker.postMessage([crossOverMethod, selectionMethod]);
    };
  }
}

// Initialize on DOMContentLoaded (for initial page load)
document.addEventListener('DOMContentLoaded', initializeTSP);

// Initialize on astro:after-swap (for client-side navigation)
document.addEventListener('astro:after-swap', initializeTSP);

</script>

<style>

/* @media only screen and (min-width: 1000px)  {
  .row {
    display: flex !important;
  }
  .column {
    flex: 50% !important;
  }

  .columnOne {
    flex: 30% !important;
  }

  .columnTwo {
    flex: 70% !important;
  }

  .ct-chart, .summary-chart{
    width: 30rem;
  }

  #cities{
    display:block;
    margin: auto;
    width: 40rem;
  }


} */

  .ct-series-a .ct-line, .ct-point {
    stroke: blue;
    stroke-width: 1px;
  }

  #run {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
}

.ct-perfect-fourth{
  background:white;
}

table {
  display: table;
}

/* Updated form styling to match genetic algorithm component */
.select-css {
  width: 100%;
  max-width: 300px;
  padding: 10px 12px;
  border: 2px solid var(--border);
  border-radius: 6px;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 14px;
  transition: border-color 0.3s ease;
  margin-bottom: 1rem;
}

.select-css:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(97, 123, 255, 0.1);
}

.columnOne label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--foreground);
}

.columnOne div {
  margin-bottom: 1.5rem;
}

#run {
  background-color: var(--accent);
  border: none;
  color: white;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#run:hover {
  background-color: #4a5fd1;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

#run:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .select-css {
    max-width: 100%;
  }
  
  .columnOne div {
    margin-bottom: 1rem;
  }
}

</style>