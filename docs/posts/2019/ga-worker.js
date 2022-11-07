onmessage = function(e) {
  let wordFitness = individual => {
    let fitness = 0;
    for (let i = 0; i < individual.length; ++i) {
      fitness += Math.abs(individual[i] - target[i]);
    }
    return data["geneSize"] * data["length"] - fitness;
  };

  const mapping = {
    A: 0,
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
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
    " ": 26,
    "?": 27,
    "0": 28,
    "1": 29,
    "2": 30,
    "3": 31,
    "4": 32,
    "5": 33,
    "6": 34,
    "7": 35,
    "8": 36,
    "9": 37,
    "!": 38,
    ".": 39
  };

  const generateTarget = target => {
    let mapped = [];
    for (let i = 0; i < target.length; ++i) {
      mapped.push(mapping[target[i]]);
    }
    return mapped;
  };

  let mutationOperator = {
    ONE_MUTATION: individual => {
      // Reverse the bit of a random index in an individual.
      let index = getRandomInt(individual.genes.length);
      let mutated = getRandomInt(data.geneSize);
      individual.genes[index] = mutated;
    },

    TWO_MUTATION: individual => {
      let arr = [];
      for (let i = 0; i < individual.genes.length; ++i) arr.push(i);
      const shuffled = arr.sort(() => 0.5 - Math.random());
      // Two mutations at 2 indexes.
      individual.genes[shuffled[0]] = getRandomInt(data.geneSize);
      individual.genes[shuffled[1]] = getRandomInt(data.geneSize);
    }
  };

  let target = generateTarget(e.data[2].toLocaleUpperCase());

  let crossOverMethod = e.data[0];
  let selectionMethod = e.data[1];

  let data = {
    geneSize: Object.keys(mapping).length,
    length: target.length
  };

  const ga = new GeneticAlgorithm(data);

  ga.setMapping(mapping);
  ga.setData(data);
  ga.setFitnessFunction(wordFitness);
  ga.setCrossOverMethodology(crossOverMethod);
  ga.setSelectionFunction(selectionMethod);

  ga.setMutationOperator(mutationOperator.ONE_MUTATION);
  ga.run();
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

  crossOver(chromosome, methodology) {}
}
class GeneticAlgorithm {
  constructor(
    seedData,
    data,
    mapping,
    populationSize = 100,
    generations = 2000,
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
        fight = fight.sort((a, b) => b.fitness - a.fitness);

        return fight[0];
      },

      RANK: population => {
        population.sort((a, b) => b.fitness - a.fitness);
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
        population.sort((a, b) => b.fitness - a.fitness);
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
    let crossOverMethodology = Object.freeze({
      ONE_POINT: (parentOne, parentTwo) => {
        if (typeof parentOne !== "object" || typeof parentTwo !== "object")
          return;
        let index = Math.floor(Math.random() * (parentOne.length - 1) + 1);
        let alleleOne = parentOne.genes.slice(0, index);
        let alleleTwo = parentTwo.genes.slice(index, parentTwo.genes.length);
        let childOne = alleleOne.concat(alleleTwo);

        let alleleOneChild = parentTwo.genes.slice(0, index);
        let alleleTwoChild = parentOne.genes.slice(
          index,
          parentOne.genes.length
        );
        let childTwo = alleleOneChild.concat(alleleTwoChild);

        let c1 = new Chromosome(childOne);
        let c2 = new Chromosome(childTwo);

        return [c1, c2];
      },

      TWO_POINT: (parentOne, parentTwo) => {
        let arr = [];
        for (let i = 0; i < parentOne.genes.length; ++i) arr.push(i);

        const shuffled = arr.sort(() => 0.5 - Math.random());
        let i0 = shuffled[0];
        let i1 = shuffled[1];
        let twoRandom = [i0, i1].sort();

        let c1 = parentOne.copy();
        let c2 = parentTwo.copy();

        for (let i = twoRandom[0]; i <= twoRandom[1]; ++i) {
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
      default:
        this.crossOverMethodology = crossOverMethodology.ONE_POINT;
        break;
    }
  }

  setMutationOperator(mutation) {
    this.mutationOperator = mutation;
  }

  createIndividual(seedData) {
    let individual = [];
    let length = seedData["length"];
    for (let i = 0; i < length; i++) {
      individual[i] = Math.floor(Math.random() * seedData["geneSize"]);
    }
    return individual;
  }

  createInitialPopulation() {
    let initialPopulation = [];

    for (let i = 0; i < this.populationSize; i++) {
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
    this.currentGeneration.sort((a, b) => b.fitness - a.fitness);
  }

  createNewPopulation() {
    let newPopulation = [];
    let elite = this.currentGeneration[0].copy();
    let selection = this.selectionFunction;
    let crossOver = this.crossOverMethodology;
    let mutation = this.mutationOperator;

    while (newPopulation.length < this.populationSize) {
      //this.calculatePopulationFitness();
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

      newPopulation.push(childOne);
      if (newPopulation.length < this.populationSize)
        newPopulation.push(childTwo);
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
    let output = "";
    for (let i = 0; i < genes.length; ++i) {
      output += getKeyByValue(this.mapping, genes[i]);
    }

    return output;
  }

  run() {
    this.createFirstGeneration();

    let currentBest = "";
    let finished = false;

    for (let i = 0; i <= this.generations; i++) {
      if (currentBest != this.displayBest()) {
        postMessage([
          i,
          this.bestIndividual().fitness,
          this.displayBest(),
          false
        ]);
        currentBest = this.displayBest();
      }

      this.createNextGeneration();

      if (
        this.fitnessFunction(this.bestIndividual().genes) ==
        this.data["geneSize"] * this.data["length"]
      ) {
        //finished = true;
        postMessage([
          ++i,
          this.bestIndividual().fitness,
          this.displayBest(),
          finished
        ]);

        postMessage(["Complete", "Completed", "Completed", finished]);

        return;
      }
    }

    postMessage([this.generations, "Not Completed", "Not Completed", finished]);
  }

  bestIndividual() {
    let best = this.currentGeneration[0];
    return best;
  }
}

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};
