const crossOverMethodology = Object.freeze({
  ONE_POINT: (parentOne, parentTwo) => {
    if (typeof parentOne !== "object" || typeof parentTwo !== "object") return;
    let index = Math.floor(Math.random() * (parentOne.length - 1) + 1);
    let alleleOne = parentOne.genes.slice(0, index);
    let alleleTwo = parentTwo.genes.slice(index, parentTwo.genes.length);
    let childOne = alleleOne.concat(alleleTwo);

    let alleleOneChild = parentTwo.genes.slice(0, index);
    let alleleTwoChild = parentOne.genes.slice(index, parentOne.genes.length);
    let childTwo = alleleOneChild.concat(alleleTwoChild);

    let c1 = new Chromosome(childOne);
    let c2 = new Chromosome(childTwo);

    return [c1, c2];
  },

  TWO_POINT: (parentOne, parentTwo) => {
    let r1 = getRandomInt(parentOne.genes.length);
    let r2 = getRandomInt(parentOne.genes.length);

    let arr = [r1, r2].sort();
    let startPos = arr[0];
    let endPos = arr[1];

    let c1 = parentOne.copy();
    let c2 = parentTwo.copy();

    for (let i = startPos; i < endPos; ++i) {
      let temp = c1.genes[i];
      c1.genes[i] = c2.genes[i];
      c2.genes[i] = temp;
    }

    return [c1, c2];
  },

  UNIFORM: (parentOne, parentTwo) => {
    // Make a copy of the parents.
    let c1 = parentOne.copy();
    let c2 = parentTwo.copy();

    let genesOne = c1.genes;
    let genesTwo = c2.genes;

    let childGenesOne = [];
    let childGenesTwo = [];

    for (let i = 0; i < parentOne.genes.length; ++i) {
      //Determine if swapped or not.
      let randomBoolean = Math.random() >= 0.5;
      if (randomBoolean) {
        childGenesOne.push(genesTwo[i]);
        childGenesTwo.push(genesOne[i]);
      } else {
        childGenesOne.push(genesOne[i]);
        childGenesTwo.push(genesTwo[i]);
      }
    }

    return [new Chromosome(childGenesOne), new Chromosome(childGenesTwo)];
  },

  ORDERED: (parentOne, parentTwo) => {
    let createChild = () => {
      let startPos = getRandomInt(parentOne.genes.length);
      let endPos = getRandomInt(parentOne.genes.length);
      let length = parentOne.genes.length;

      let child = [];

      for (let i = 0; i < length; i++) {
        if (startPos < endPos && i > startPos && i < endPos) {
          child[i] = parentOne.genes[i];
        } else if (startPos > endPos) {
          if (!(i < startPos && i > endPos)) {
            child[i] = parentOne.genes[i];
          }
        }
      }
      for (let i = 0; i < length; i++) {
        if (child.includes(parentTwo.genes[i]) == false)
          for (let ii = 0; ii < length; ii++) {
            if (child[ii] == undefined) {
              child[ii] = parentTwo.genes[i];
              break;
            }
          }
      }

      let c1 = new Chromosome(child);
      return c1;
    };
    return [createChild(), createChild()];
  },

  PMX: (parentOne, parentTwo) => {
    let findFinal = (key, map) => {
      let value = map.get(key);
      let arr = [];
      for (let i = 0; i < map.size; i++) {
        //while (value != undefined) {
        if (value != undefined) {
          arr.push(value);
          value = map.get(value);
        }
        //}
      }

      return arr.pop();
    };

    let arr = [];
    for (let i = 0; i < parentOne.genes.length; ++i) arr.push(i);

    const shuffled = arr.sort(() => 0.5 - Math.random());
    let i0 = shuffled[0];
    let i1 = shuffled[1];
    let twoRandom = [i0, i1].sort();

    let c1 = parentOne.copy();
    let c2 = parentTwo.copy();

    let c1Map = new Map();
    let c2Map = new Map();

    for (let i = 0; i < arr.length; ++i) {
      if (i < twoRandom[0] || i > twoRandom[1]) {
      } else {
        c1Map.set(c2.genes[i], c1.genes[i]);
        c2Map.set(c1.genes[i], c2.genes[i]);
        let temp = c1.genes[i];
        c1.genes[i] = c2.genes[i];
        c2.genes[i] = temp;
      }
    }

    for (let i = 0; i < arr.length; ++i) {
      if (i < twoRandom[0] || i > twoRandom[1]) {
        // If there is nothing in the map put the default
        if (c1Map.get(c1.genes[i]) == undefined) {
          c1.genes[i] = parentOne.genes[i];
        } else {
          c1.genes[i] = findFinal(parentOne.genes[i], c1Map);
        }

        if (c2Map.get(c2.genes[i]) == undefined) {
          c2.genes[i] = parentTwo.genes[i];
        } else {
          c2.genes[i] = findFinal(parentTwo.genes[i], c2Map);
        }
      }
    }
    return [c1, c2];
  }
});

const getRandomIntRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

const generateTarget = (target, mapping) => {
  let mapped = [];
  for (let i = 0; i < target.length; ++i) {
    mapped.push(mapping[target[i]]);
  }
  return mapped;
};

const mutationOperator = {
  ONE_MUTATION: individual => {
    // Reverse the bit of a random index in an individual.
    let index = getRandomIntRange(1, individual.genes.length);
    let mutated = getRandomIntRange(1, data.geneSize);
    individual.genes[index] = mutated;
  },

  TWO_MUTATION: individual => {
    let arr = [];
    for (let i = 0; i < individual.genes.length; ++i) arr.push(i);
    const shuffled = arr.sort(() => 0.5 - Math.random());
    // Two mutations at 2 indexes.
    individual.genes[shuffled[0]] = getRandomInt(data.geneSize);
    individual.genes[shuffled[1]] = getRandomInt(data.geneSize);
  },

  TWO_SWAP_MUTATION: individual => {
    let arr = [];
    for (let i = 0; i < individual.genes.length; ++i) arr.push(i);
    const shuffled = arr.sort(() => 0.5 - Math.random());
    [individual.genes[shuffled[0]], individual.genes[shuffled[1]]] = [
      individual.genes[shuffled[1]],
      individual.genes[shuffled[0]]
    ];
  }
};

let data = (mapping, target) => {
  return {
    geneSize: Object.keys(mapping).length,
    length: target.length
  };
};

class Chromosome {
  constructor(genes) {
    this.genes = genes;
    this.fitness = 0;
  }

  toString() {
    return this.genes + " " + this.fitness;
  }

  copy() {
    let copy = JSON.parse(JSON.stringify(this));
    return new Chromosome(copy.genes);
  }
}

class GeneticAlgorithm {
  constructor(
    seedData,
    data,
    mapping,
    populationSize = 20,
    generations = 500,
    crossOverProbability = 0.8,
    mutationProbability = 0.2,
    elitism = true,
    maximiseFitness = true
  ) {
    this.seedData = seedData;
    this.data = data;
    this.mapping = mapping;
    this.populationSize = populationSize;
    this.generations = generations;
    this.crossOverProbability = crossOverProbability;
    this.mutationProbability = mutationProbability;
    this.elitism = elitism;
    this.maximiseFitness = maximiseFitness;

    this.currentGeneration = [];

    this.fitnessFunction = undefined;
    this.tournamentSize = this.populationSize / 10;
    this.selectionFunction = undefined;
    this.randomSelection = undefined;
    this.mutationOperator = undefined;
    this.crossOverMethodology = undefined;
  }

  setData(data) {
    this.data = data;
  }

  setMapping(mapping) {
    this.mapping = mapping;
  }

  setMaximiseFitness(maximiseFitness) {
    this.maximiseFitness = maximiseFitness;
  }

  setFitnessFunction(fitness) {
    this.fitnessFunction = fitness;
  }

  setSelectionFunction(selection) {
    // https://www.obitko.com/tutorials/genetic-algorithms/selection.php
    let selections = Object.freeze({
      TOURNAMENT: population => {
        let tournamentSize = Math.floor(population.length / 10);
        if (tournamentSize == 0) tournamentSize = 2;
        const shuffled = population.sort(() => 0.5 - Math.random());
        //const shuffled = population.sort(() => 0.5 - Math.random());
        let fight = shuffled.slice(0, tournamentSize);
        fight = fight.sort((a, b) => a.fitness - b.fitness);

        return fight[0];
      },

      RANK: population => {
        population.sort((a, b) => a.fitness - b.fitness);
        return population[0];
      },

      RANDOM: population => {
        let index = getRandomInt(population.length);
        return population[index];
      },

      ROULETTE_WHEEL: population => {
        let sum = 0;
        for (let i = 0; i < population.length; ++i) {
          sum += population[i].fitness;
        }

        let random = getRandomInt(sum);
        population.sort((a, b) => a.fitness - b.fitness);
        let partialSum = 0;
        for (let i = 0; i < population.length; ++i) {
          partialSum += population[i].fitness;
          if (partialSum > random) return population[0];
        }
        return population[0];
      },

      BOLTZMANN_TOURNAMENT: population => {}
    });

    switch (selection) {
      case "tournament":
        this.selectionFunction = selections.TOURNAMENT;
        break;
      case "random":
        this.selectionFunction = selections.RANDOM;
        break;
      case "rank":
        this.selectionFunction = selections.RANK;
        break;
      case "rouletteWheel":
        this.selectionFunction = selections.ROULETTE_WHEEL;
        break;
      default:
        this.selectionFunction = selections.TOURNAMENT;
        break;
    }
  }

  setCrossOverMethodology(crossOverMethod) {
    switch (crossOverMethod) {
      case "onePoint":
        this.crossOverMethodology = crossOverMethodology.ONE_POINT;
        break;
      case "twoPoint":
        this.crossOverMethodology = crossOverMethodology.TWO_POINT;
        break;
      case "uniform":
        this.crossOverMethodology = crossOverMethodology.UNIFORM;
        break;
      case "pmx":
        this.crossOverMethodology = crossOverMethodology.PMX;
        break;
      case "ordered":
        this.crossOverMethodology = crossOverMethodology.ORDERED;
        break;
      default:
        this.crossOverMethodology = crossOverMethodology.ORDERED;
        break;
    }
  }

  setMutationOperator(mutation) {
    this.mutationOperator = mutation;
  }

  calculateMeanFitness() {
    let sum = 0;
    for (let index = 0; index < this.currentGeneration.length; index++) {
      const element = this.currentGeneration[index];
      sum += element.fitness;
    }

    return sum / this.populationSize;
  }

  createIndividual(seedData) {
    let individual = [];
    let length = seedData["length"];
    for (let i = 1; i <= length; ++i) individual.push(i);
    individual = individual.sort(() => 0.5 - Math.random());
    return individual;
  }

  createInitialPopulation() {
    let initialPopulation = [];

    while (initialPopulation.length != this.populationSize) {
      let genes = this.createIndividual(this.seedData);
      let individual = new Chromosome(genes);
      initialPopulation.push(individual);
    }

    this.currentGeneration = initialPopulation;
  }

  calculatePopulationFitness() {
    for (let individual of this.currentGeneration) {
      individual.fitness = this.fitnessFunction(
        individual.genes,
        this.seedData
      );
    }
  }

  rankPopulation() {
    this.currentGeneration.sort((a, b) => a.fitness - b.fitness);
  }

  createNewPopulation() {
    let newPopulation = [];
    let elite = this.currentGeneration[0].copy();
    let selection = this.selectionFunction;
    let crossOver = this.crossOverMethodology;
    let mutation = this.mutationOperator;

    while (newPopulation.length < this.populationSize) {
      let p1 = selection(this.currentGeneration);
      let p2 = selection(this.currentGeneration);

      let parentOne = new Chromosome(p1.genes);
      let parentTwo = new Chromosome(p2.genes);

      let childOne = parentOne.copy();
      let childTwo = parentTwo.copy();

      let canCrossOver = Math.random() < this.crossOverProbability;
      let canMutate = Math.random() < this.mutationProbability;

      if (canCrossOver) {
        let children = crossOver(parentOne, parentTwo);
        childOne = children[0];
        childTwo = children[1];
      }

      if (canMutate) {
        mutation(childOne);
        mutation(childTwo);
      }

      let fitness = tspFitness(childOne.genes);
      newPopulation.push(childOne);
      if (newPopulation.length < this.populationSize) {
        fitness = tspFitness(childOne.genes);
        newPopulation.push(childTwo);
      }
    }

    if (this.elitism) newPopulation[0] = elite;
    this.currentGeneration = newPopulation;
  }

  createFirstGeneration() {
    this.createInitialPopulation();
    this.calculatePopulationFitness();
    this.rankPopulation();
  }

  createNextGeneration() {
    this.createNewPopulation();
    this.calculatePopulationFitness();
    this.rankPopulation();
  }

  displayBest() {
    const getKeyByValue = (object, value) => {
      return Object.keys(object).find(key => object[key] === value);
    };

    let genes = this.currentGeneration[0].genes;
    //let genes = [7,2,3,4,12,6,8,1,11,10,5,9];
    let output = "";
    for (let i = 0; i < genes.length; ++i) {
      output += getKeyByValue(this.mapping, genes[i]);
    }

    return output;
  }

  run() {
    let averages = [];
    let fitnesses = [];
    let indices = [];
    this.createFirstGeneration();
    for (let i = 0; i <= this.generations; i++) {
      let current = {};
      this.createNextGeneration();

      //let
      let mean = this.calculateMeanFitness();
      if (i % 25 == 0) {
        indices.push(i);
        averages.push(mean);
        fitnesses.push(this.currentGeneration[0].fitness);
      }
      //current.generation = (i);
      //current.mean = mean;
      //current.bestFitness =this.currentGeneration[0].fitness;
      //current.push(mean);
      //current.push(this.currentGeneration[0].fitness);
      //console.log(mean);
      //meanBest.push(current);
    }

    return [indices, averages, fitnesses];
  }

  buildAverageArray() {
    let averages = [];
    for (let index = 0; index < this.currentGeneration.length; index++) {
      const element = this.currentGeneration[index];
      averages.push(this.calculateMeanFitness);
    }

    return averages;
  }

  bestIndividual() {
    let best = this.currentGeneration[0];
    return best;
  }
}

const mapping = {
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13
};

let start = "BCDEFGIJKLMN";

const target = generateTarget(start.toLocaleUpperCase(), mapping);

data = data(mapping, target);

const distanceMatrix = [
  [0, 2451, 713, 1018, 1631, 1374, 2408, 213, 2571, 875, 1420, 2145, 1972],
  [2451, 0, 1745, 1524, 831, 1240, 959, 2596, 403, 1589, 1374, 357, 579],
  [713, 1745, 0, 355, 920, 803, 1737, 851, 1858, 262, 940, 1453, 1260],
  [1018, 1524, 355, 0, 700, 862, 1395, 1123, 1584, 466, 1056, 1280, 987],
  [1631, 831, 920, 700, 0, 663, 1021, 1769, 949, 796, 879, 586, 371],
  [1374, 1240, 803, 862, 663, 0, 1681, 1551, 1765, 547, 225, 887, 999],
  [2408, 959, 1737, 1395, 1021, 1681, 0, 2493, 678, 1724, 1891, 1114, 701],
  [213, 2596, 851, 1123, 1769, 1551, 2493, 0, 2699, 1038, 1605, 2300, 2099],
  [2571, 403, 1858, 1584, 949, 1765, 678, 2699, 0, 1744, 1645, 653, 600],
  [875, 1589, 262, 466, 796, 547, 1724, 1038, 1744, 0, 679, 1272, 1162],
  [1420, 1374, 940, 1056, 879, 225, 1891, 1605, 1645, 679, 0, 1017, 1200],
  [2145, 357, 1453, 1280, 586, 887, 1114, 2300, 653, 1272, 1017, 0, 504],
  [1972, 579, 1260, 987, 371, 999, 701, 2099, 600, 1162, 1200, 504, 0]
];

const validateSurvivor = elements => {
  for (var i = elements.length - 1; i >= 0; i--) {
    if (elements[i].fitness == "INVALID") {
      elements.splice(i, 1);
    }
  }
};

const mappingToCities = (string) => {
  let m = new Map();
  m.set("A","New York");
}

// Remove of A makes index 0 no longer there and the length reduced
let tspFitness = individual => {
  let fitness = 0;

  const result = new Set(individual).size;
  let current = 0;

  for (let index = 1; index < individual.length; index++) {
    const element = individual[index];
    current = 1 * distanceMatrix[individual[index - 1]][individual[index]];
    fitness += current;
  }

  fitness += distanceMatrix[0][individual[1]];
  fitness += distanceMatrix[0][individual[11]];
  return fitness;
};

onmessage = function(e) {
  const ga = new GeneticAlgorithm(data);

  let crossOverMethod = e.data[0];
  let selectionMethod = e.data[1];

  ga.setMapping(mapping);
  ga.setData(data);
  ga.setFitnessFunction(tspFitness);
  ga.setCrossOverMethodology(crossOverMethod);
  ga.setSelectionFunction(selectionMethod);

  ga.setMutationOperator(mutationOperator.TWO_SWAP_MUTATION);
  let summary = ga.run();

  let best = ga.displayBest();

  let c = ga.bestIndividual();

  //this.console.log(c.fitness);

  this.postMessage([best, c.fitness, summary]);

  return best;
};
