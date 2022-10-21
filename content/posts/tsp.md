---
title: "Traveling Sales Person using Genetic Algorithms"
date: 2019-10-23
tags: ["Genetic Algorithm", "Selection", "Cross Over", "TSP"]
ShowReadingTime: true
cover:
  image: "/images/tsp.png"
---

This post is best viewed using the light theme.

<link rel="stylesheet" href="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.css">
<script src="//cdn.jsdelivr.net/chartist.js/latest/chartist.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartist-plugin-pointlabels@0.0.6/dist/chartist-plugin-pointlabels.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chartist-plugin-legend/0.6.2/chartist-plugin-legend.min.js"></script>


This post uses GA to generate a high quality solution of the Traveling Salesman Problem. 


<div id="cities" class="ct-perfect-fourth"></div>

### Traveling Salesman Problem using Genetic Algorithm


This blog post is regarding using genetic algorithm to solve the Traveling Salesman Problem. In a one liner the TSP asks the following question: **_Given a list of cities and the distances between each pair of the cities, what is the shortest possible route that visits each city and returns to the origin city?"_**

The conditions in this scenario are that **no point can be visited twice and it must return to the starting point.** The selected starting point here is New York. (The starting point does not really matter in this scenario.). There are times however, that a point maybe the revisited more than once in order to achieve a better solution. The number of cities in this scenario is 13. In this specific implementation, it will never visit the same city twice.

The inspiration for this post is based on the google OR-Tools found [here](https://developers.google.com/optimization/routing/tsp). This blog post, however uses Genetic Algorithm to obtain the answer. It is implemented with a **web worker** which runs in the browser based on **JavaScript**.

I will also reuse the genetic algorithm implementation written for another blog post however with different fitness functions and different cross-over methodologies.

| Location       | Coordinates | Shorthand |
| -------------- | ----------- | --------- |
| New York       | 40, -74     | A         |
| Los Angeles    | 34, -118    | B         |
| Chicago        | 41, -87     | C         |
| Minneapolis    | 44, -93     | D         |
| Denver         | 39, -104    | E         |
| Dallas         | 32,-96      | F         |
| Seattle        | 47,-122     | G         |
| Boston         | 42,-71      | H         |
| San Francisco  | 37,-122     | I         |
| St. Louis      | 38,-90      | J         |
| Houston        | 29,-95      | K         |
| Phoenix        | 33,-111     | L         |
| Salt Lake City | 40,-111     | M         |

**Total number of cities - 13.**

In order to the Genetic Algorithm to work, a distance matrix needs to be given to it. This distance matrix is based on the "Euclidean Distance" and not Road Network distance. The distance matrix is obtained from [here](https://developers.google.com/optimization/routing/tsp) which has 13 cities in the United States.

<!-- ### The Distance Matrix

The distance matrix here is obtained by calculating the distance between each point.

| Location | A    | B    | C    | D    | E    | F    | G    | H    | I    | J    | K    | L    | M    |
| -------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| A        | 0    | 2451 | 713  | 1018 | 1631 | 1374 | 2408 | 213  | 2571 | 875  | 1420 | 2145 | 1972 |
| B        | 2451 | 0    | 1745 | 1524 | 831  | 1240 | 959  | 2596 | 403  | 1589 | 1374 | 357  | 579  |
| C        | 713  | 1745 | 0    | 355  | 920  | 803  | 1737 | 851  | 1858 | 262  | 940  | 1453 | 1260 |
| D        | 1018 | 1524 | 355  | 0    | 700  | 862  | 1395 | 1123 | 1584 | 466  | 1056 | 1280 | 987  |
| E        | 1631 | 831  | 920  | 700  | 0    | 663  | 1021 | 1769 | 949  | 796  | 879  | 586  | 371  |
| F        | 1374 | 1240 | 803  | 862  | 663  | 0    | 1681 | 1551 | 1765 | 547  | 225  | 887  | 999  |
| G        | 2408 | 959  | 1737 | 1395 | 1021 | 1681 | 0    | 2493 | 678  | 1724 | 1891 | 1114 | 701  |
| H        | 213  | 2596 | 851  | 1123 | 1769 | 1551 | 2493 | 0    | 2699 | 1038 | 1605 | 2300 | 2099 |
| I        | 2571 | 403  | 1858 | 1584 | 949  | 1765 | 678  | 2699 | 0    | 1744 | 1645 | 653  | 600  |
| J        | 875  | 1589 | 262  | 466  | 796  | 547  | 1724 | 1038 | 1744 | 0    | 679  | 1272 | 1162 |
| K        | 1420 | 1374 | 940  | 1056 | 879  | 225  | 1891 | 1605 | 1645 | 679  | 0    | 1017 | 1200 |
| L        | 2145 | 357  | 1453 | 1280 | 586  | 887  | 1114 | 2300 | 653  | 1272 | 1017 | 0    | 504  |
| M        | 1972 | 579  | 1260 | 987  | 371  | 999  | 701  | 2099 | 600  | 1162 | 1200 | 504  | 0    | -->

### The Genetic Algorithm Solution

<div class="row">
  <div class="columnOne">
    <div>
      <label for="crossOver">Cross Over Method</label> 
        <select id="crossOverMethod"  class="select-css">
        <option value="ordered">Ordered</option>
        <option value="pmx">PMX</option>
        </select>
    </div>
    <div>
      <label for="selection">Selection Method</label> 
      <select id="selectionMethod"  class="select-css">
        <option value="tournament">Tournament</option>
        <option value="random">Random</option>
        <option value="rank">Rank</option>
        <option value="rouletteWheel">Roulette Wheel</option>
      </select>
    </div>
    <p></p>
    <strong>Please click run to see the results based on different cross over and selection methods. You can repeat this for different methodologies</strong>
    <p></p>
    <button type="button" id="run" class="hvr-sweep-to-right">Run</button>
    <br />
    <br />
    <p>It can be observed that the selection method random tends to not give a good result as it would defeat the purpose of the GA algorithm. The current mutation rate of the GA is set to 0.2 for this purpose. The starting population size is set to 20.<p>
    <p>Due to the nature of GA, each run under the given settings will give a different solution as I have defaulted the number of generations to 500. This includes running with the same cross over methodology and selection methodology.</p>
  </div>  
  <div>
    <div class="columnTwo">
    <h3 style="text-align:center" id="chart-title"></h3>
      <div class="ct-chart ct-perfect-fourth"></div>
    </div>
  </div>
</div>

<div class="row">
  <div class="columnOne">
    <div>
      <p>The fitness in general would depend on the cross over methodology. For example, if the roulette wheel methodology is used, it can be observed that the average fitness tends to spike more.<p>
      <p>The suggested answer based on the Google OR tools is </p>
      <p><strong>New York -> Boston -> Chicago -> Minneapolis -> Denver -> Salt Lake City -> 
      Seattle -> San Francisco -> Los Angeles -> Phoenix -> Houston -> Dallas -> St Louis -> New York</strong> which gives the total distance of 7293 miles which is also the minimal tour length.</p>
      <p>The GA however does not obtain this solution. It does however, generate a high quality solution really quick.</p>
    </div>
  </div>
  <div>
  <div class="columnTwo">
    <h5 style="text-align:center" id="summary-chart"></h5>
    <div id="" class="summary-chart ct-perfect-fourth">
    </div>
  </div>
  </div>
</div>

#### Lessons from this post

- The earth is not flat! Mapping putting coordinates using latitude and longitude on a chart, it would work in a different way so it displays beautifully. Latitude and longitude needs to be swapped.

- Most chart API do not let you specify both the ***x-axis*** and ***y-axis*** at the same time. This is especially true if the chart is able to generate SVG diagrams. SVG diagrams are always nicer and would generally be of more responsive nature at the end of the day.

- You can use a series graph to draw lines from a point to point in the chartist API. However, chartist API does not like the situation where there are two values on the same axis. (So it is not able to draw a straight line on the x-axis because of the nature of a series chart. An example of this is where there is a point on 30,55 and 30,65.

- There are specific data sets in which people benchmark their TSP solutions.

- The GA will downgrade into a random search if the mutation rate is too high. However, the mutation rate can always be change to tailor to the specific use case.

<script>

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
  const tspWorker = new Worker("/posts/tsp-worker.js");

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

</style>
