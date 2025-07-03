// Maze generation Web Worker for all types
// This file will be loaded as a Web Worker

// --- Types ---
// (No TypeScript types in worker for compatibility)

// --- Utility ---
/**
 * @param {any[]} arr
 * @returns {any[]}
 */
function shuffle(arr: any[]): any[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Rectangular Maze ---
/**
 * @param {number} width
 * @param {number} height
 * @returns {any[][]}
 */
function createGrid(width: any, height: any): any[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      walls: [true, true, true, true], // top, right, bottom, left
      visited: false,
    }))
  );
}

/**
 * @param {number} width
 * @param {number} height
 * @returns {any[][]}
 */
function generateMazeDFS(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  /** @type {any[]} */
  const stack: any[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);
  while (stack.length > 0) {
    const current: any = stack[stack.length - 1];
    const { x, y } = current;
    /** @type {[any, number][]} */
    const neighbors: [any, number][] = [];
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push([grid[y - 1][x], 0]);
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push([grid[y][x + 1], 1]);
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push([grid[y + 1][x], 2]);
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push([grid[y][x - 1], 3]);
    if (neighbors.length > 0) {
      const [next, dir]: [any, number] = shuffle(neighbors)[0];
      current.walls[dir] = false;
      next.walls[(dir + 2) % 4] = false;
      next.visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

/**
 * @param {number} width
 * @param {number} height
 * @returns {any[][]}
 */
function generateMazePrims(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  /** @type {any[]} */
  const walls: any[] = [];
  const start = grid[0][0];
  start.visited = true;
  if (0 < height - 1) walls.push([0, 0, 2]);
  if (0 < width - 1) walls.push([0, 0, 1]);
  while (walls.length > 0) {
    const idx = Math.floor(Math.random() * walls.length);
    const [y, x, dir] = walls.splice(idx, 1)[0];
    const cell = grid[y][x];
    let nx = x, ny = y, ndir = (dir + 2) % 4;
    if (dir === 0) ny -= 1;
    if (dir === 1) nx += 1;
    if (dir === 2) ny += 1;
    if (dir === 3) nx -= 1;
    if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;
    const neighbor = grid[ny][nx];
    if (!neighbor.visited) {
      cell.walls[dir] = false;
      neighbor.walls[ndir] = false;
      neighbor.visited = true;
      if (ny > 0 && !grid[ny - 1][nx].visited) walls.push([ny, nx, 0]);
      if (nx < width - 1 && !grid[ny][nx + 1].visited) walls.push([ny, nx, 1]);
      if (ny < height - 1 && !grid[ny + 1][nx].visited) walls.push([ny, nx, 2]);
      if (nx > 0 && !grid[ny][nx - 1].visited) walls.push([ny, nx, 3]);
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

// --- Rectangular Algorithms ---
// (already present: DFS, Prims)
// Add: Wilsons, Kruskal, Eller, Hunt-and-Kill, Binary Tree, Sidewinder

function generateMazeWilsons(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  function getNeighbors(pos: [number, number]) {
    const [x, y] = pos;
    const nbs: [number, number][] = [];
    if (y > 0) nbs.push([x, y - 1]);
    if (x < width - 1) nbs.push([x + 1, y]);
    if (y < height - 1) nbs.push([x, y + 1]);
    if (x > 0) nbs.push([x - 1, y]);
    return nbs;
  }
  function loopErasedRandomWalk(start: [number, number], inMaze: Set<string>) {
    let path: [number, number][] = [start];
    let visited = new Map<string, number>();
    visited.set(start.toString(), 0);
    let current = start;
    while (!inMaze.has(current.toString())) {
      const nbs = getNeighbors(current);
      const next = nbs[Math.floor(Math.random() * nbs.length)];
      const key = next.toString();
      if (visited.has(key)) {
        const loopStart = visited.get(key)!;
        path = path.slice(0, loopStart + 1);
        visited = new Map(path.map((cell, i) => [cell.toString(), i]));
      } else {
        path.push(next);
        visited.set(key, path.length - 1);
      }
      current = next;
    }
    return path;
  }
  const inMaze = new Set<string>();
  const start = [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
  inMaze.add(start.toString());
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = [x, y].toString();
      if (inMaze.has(key)) continue;
      const path = loopErasedRandomWalk([x, y], inMaze);
      for (let i = 0; i < path.length - 1; i++) {
        const [x1, y1] = path[i];
        const [x2, y2] = path[i + 1];
        if (x2 === x1 && y2 === y1 - 1) { // up
          grid[y1][x1].walls[0] = false;
          grid[y2][x2].walls[2] = false;
        } else if (x2 === x1 + 1 && y2 === y1) { // right
          grid[y1][x1].walls[1] = false;
          grid[y2][x2].walls[3] = false;
        } else if (x2 === x1 && y2 === y1 + 1) { // down
          grid[y1][x1].walls[2] = false;
          grid[y2][x2].walls[0] = false;
        } else if (x2 === x1 - 1 && y2 === y1) { // left
          grid[y1][x1].walls[3] = false;
          grid[y2][x2].walls[1] = false;
        }
        inMaze.add([x1, y1].toString());
      }
      inMaze.add(path[path.length - 1].toString());
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

function generateMazeKruskals(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  const sets: number[] = [];
  let setId = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      sets[y * width + x] = setId++;
    }
  }
  const walls: [number, number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < width - 1) walls.push([x, y, 1]);
      if (y < height - 1) walls.push([x, y, 2]);
    }
  }
  function find(i: number) {
    while (sets[i] !== i) i = sets[i];
    return i;
  }
  function union(i: number, j: number) {
    const ri = find(i);
    const rj = find(j);
    sets[ri] = rj;
  }
  shuffle(walls);
  for (const [x, y, dir] of walls) {
    const i = y * width + x;
    let j;
    if (dir === 1) j = y * width + (x + 1);
    else j = (y + 1) * width + x;
    if (find(i) !== find(j)) {
      union(i, j);
      if (dir === 1) {
        grid[y][x].walls[1] = false;
        grid[y][x + 1].walls[3] = false;
      } else {
        grid[y][x].walls[2] = false;
        grid[y + 1][x].walls[0] = false;
      }
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

function generateMazeEller(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  let sets = Array(width).fill(0).map((_: any, i: number) => i);
  let nextSet = width;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width - 1; x++) {
      if (Math.random() < 0.5 || sets[x] === sets[x + 1]) continue;
      grid[y][x].walls[1] = false;
      grid[y][x + 1].walls[3] = false;
      const oldSet = sets[x + 1];
      for (let i = 0; i < width; i++) if (sets[i] === oldSet) sets[i] = sets[x];
    }
    const setCells: { [key: number]: number[] } = {};
    for (let x = 0; x < width; x++) {
      if (!setCells[sets[x]]) setCells[sets[x]] = [];
      setCells[sets[x]].push(x);
    }
    const newSets = Array(width).fill(-1);
    for (const set in setCells) {
      const cells = setCells[set];
      let numDown = 0;
      for (const x of cells) {
        if (y < height - 1 && (Math.random() < 0.5 || numDown === 0)) {
          grid[y][x].walls[2] = false;
          grid[y + 1][x].walls[0] = false;
          newSets[x] = nextSet++;
          numDown++;
        }
      }
    }
    for (let x = 0; x < width; x++) {
      if (newSets[x] === -1) newSets[x] = nextSet++;
    }
    sets = newSets;
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

function generateMazeHuntAndKill(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  let x = Math.floor(Math.random() * width);
  let y = Math.floor(Math.random() * height);
  visited[y][x] = true;
  function getUnvisitedNeighbors(x: number, y: number) {
    const nbs: [number, number, number][] = [];
    if (y > 0 && !visited[y - 1][x]) nbs.push([x, y - 1, 0]);
    if (x < width - 1 && !visited[y][x + 1]) nbs.push([x + 1, y, 1]);
    if (y < height - 1 && !visited[y + 1][x]) nbs.push([x, y + 1, 2]);
    if (x > 0 && !visited[y][x - 1]) nbs.push([x - 1, y, 3]);
    return nbs;
  }
  while (true) {
    const nbs = getUnvisitedNeighbors(x, y);
    if (nbs.length > 0) {
      const [nx, ny, dir] = nbs[Math.floor(Math.random() * nbs.length)];
      visited[ny][nx] = true;
      grid[y][x].walls[dir] = false;
      grid[ny][nx].walls[(dir + 2) % 4] = false;
      x = nx;
      y = ny;
    } else {
      let found = false;
      for (let yy = 0; yy < height && !found; yy++) {
        for (let xx = 0; xx < width && !found; xx++) {
          if (!visited[yy][xx]) {
            const nbs2 = [];
            if (yy > 0 && visited[yy - 1][xx]) nbs2.push([xx, yy - 1, 0]);
            if (xx < width - 1 && visited[yy][xx + 1]) nbs2.push([xx + 1, yy, 1]);
            if (yy < height - 1 && visited[yy + 1][xx]) nbs2.push([xx, yy + 1, 2]);
            if (xx > 0 && visited[yy][xx - 1]) nbs2.push([xx - 1, yy, 3]);
            if (nbs2.length > 0) {
              const [nx, ny, dir] = nbs2[Math.floor(Math.random() * nbs2.length)];
              grid[yy][xx].walls[dir] = false;
              grid[ny][nx].walls[(dir + 2) % 4] = false;
              x = xx;
              y = yy;
              visited[y][x] = true;
              found = true;
            }
          }
        }
      }
      if (!found) break;
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

function generateMazeBinaryTree(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const neighbors: [number, number, number][] = [];
      if (y > 0) neighbors.push([x, y - 1, 0]); // north
      if (x < width - 1) neighbors.push([x + 1, y, 1]); // east
      if (neighbors.length > 0) {
        const [nx, ny, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];
        grid[y][x].walls[dir] = false;
        grid[ny][nx].walls[(dir + 2) % 4] = false;
      }
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

function generateMazeSidewinder(width: any, height: any): any[][] {
  const grid = createGrid(width, height);
  for (let y = 0; y < height; y++) {
    let run: number[] = [];
    for (let x = 0; x < width; x++) {
      run.push(x);
      const atEasternBoundary = x === width - 1;
      const atNorthernBoundary = y === 0;
      const shouldCloseOut = atEasternBoundary || (!atNorthernBoundary && Math.random() < 0.5);
      if (shouldCloseOut) {
        const member = run[Math.floor(Math.random() * run.length)];
        if (!atNorthernBoundary) {
          grid[y][member].walls[0] = false;
          grid[y - 1][member].walls[2] = false;
        }
        run = [];
      } else {
        grid[y][x].walls[1] = false;
        grid[y][x + 1].walls[3] = false;
      }
    }
  }
  grid[0][0].walls[3] = false;
  grid[height - 1][width - 1].walls[1] = false;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) grid[y][x].visited = false;
  return grid;
}

// --- Circular Maze Generation ---
function createPolarGrid(rings: any, sectors: any): any[][] {
  return Array.from({ length: rings }, (_, r) =>
    Array.from({ length: sectors }, (_, s) => ({
      ring: r,
      sector: s,
      visited: false,
      walls: [true, true, true], // [radialIn, clockwise, counterclockwise]
    }))
  );
}

function generateCircularMazeDFS(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  const stack: any[] = [];
  const start = grid[rings - 1][0];
  start.visited = true;
  stack.push(start);
  while (stack.length > 0) {
    const current: any = stack[stack.length - 1];
    const { ring, sector } = current;
    const neighbors: [any, number, number][] = [];
    const sectorPlus = (sector + 1) % sectors;
    const sectorMinus = (sector - 1 + sectors) % sectors;
    if (ring > 0 && !grid[ring - 1][sector].visited) neighbors.push([grid[ring - 1][sector], 0, 0]);
    if (ring < rings - 1 && !grid[ring + 1][sector].visited) neighbors.push([grid[ring + 1][sector], 0, 0]);
    if (!grid[ring][sectorPlus].visited) neighbors.push([grid[ring][sectorPlus], 1, 2]);
    if (!grid[ring][sectorMinus].visited) neighbors.push([grid[ring][sectorMinus], 2, 1]);
    if (neighbors.length > 0) {
      const idx = (neighbors.length > 1) ? Math.floor(Math.random() * neighbors.length) : 0;
      const [next, wallIdx, neighborWallIdx]: [any, number, number] = neighbors[idx];
      current.walls[wallIdx] = false;
      next.walls[neighborWallIdx] = false;
      next.visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazePrims(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  const walls: any[] = [];
  const start = grid[rings - 1][0];
  start.visited = true;
  if (rings > 1) walls.push([rings - 1, 0, 0, 0]);
  walls.push([rings - 1, 0, 1, 2]);
  walls.push([rings - 1, 0, 2, 1]);
  function addWalls(cell: any) {
    const { ring, sector } = cell;
    const sectorPlus = (sector + 1) % sectors;
    const sectorMinus = (sector - 1 + sectors) % sectors;
    if (ring > 0 && !grid[ring - 1][sector].visited) walls.push([ring, sector, 0, 0]);
    if (ring < rings - 1 && !grid[ring + 1][sector].visited) walls.push([ring, sector, 0, 0]);
    if (!grid[ring][sectorPlus].visited) walls.push([ring, sector, 1, 2]);
    if (!grid[ring][sectorMinus].visited) walls.push([ring, sector, 2, 1]);
  }
  while (walls.length > 0) {
    const idx = (walls.length > 1) ? Math.floor(Math.random() * walls.length) : 0;
    const [r, s, wallIdx, neighborWallIdx] = walls.splice(idx, 1)[0];
    const cell = grid[r][s];
    let nr = r, ns = s;
    if (wallIdx === 0) {
      if (r > 0 && !grid[r - 1][s].visited) nr = r - 1;
      else if (r < rings - 1 && !grid[r + 1][s].visited) nr = r + 1;
    } else if (wallIdx === 1) {
      ns = (s + 1) % sectors;
    } else if (wallIdx === 2) {
      ns = (s - 1 + sectors) % sectors;
    }
    const neighbor = grid[nr][ns];
    if (!neighbor.visited) {
      cell.walls[wallIdx] = false;
      neighbor.walls[neighborWallIdx] = false;
      neighbor.visited = true;
      addWalls(neighbor);
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazeWilsons(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  function getNeighbors(pos: [number, number]) {
    const [r, s] = pos;
    const nbs: [number, number][] = [];
    if (r > 0) nbs.push([r - 1, s]);
    if (r < rings - 1) nbs.push([r + 1, s]);
    nbs.push([r, (s + 1) % sectors]);
    nbs.push([r, (s - 1 + sectors) % sectors]);
    return nbs;
  }
  function loopErasedRandomWalk(start: [number, number], inMaze: Set<string>) {
    let path: [number, number][] = [start];
    let visited = new Map<string, number>();
    visited.set(start.toString(), 0);
    let current = start;
    while (!inMaze.has(current.toString())) {
      const nbs = getNeighbors(current);
      const next = nbs[Math.floor(Math.random() * nbs.length)];
      const key = next.toString();
      if (visited.has(key)) {
        const loopStart = visited.get(key)!;
        path = path.slice(0, loopStart + 1);
        visited = new Map(path.map((cell, i) => [cell.toString(), i]));
      } else {
        path.push(next);
        visited.set(key, path.length - 1);
      }
      current = next;
    }
    return path;
  }
  const inMaze = new Set<string>();
  const start = [rings - 1, 0];
  inMaze.add(start.toString());
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const key = [r, s].toString();
      if (inMaze.has(key)) continue;
      const path = loopErasedRandomWalk([r, s], inMaze);
      for (let i = 0; i < path.length - 1; i++) {
        const [r1, s1] = path[i];
        const [r2, s2] = path[i + 1];
        if (r2 === r1 - 1 && s2 === s1) {
          grid[r1][s1].walls[0] = false;
          grid[r2][s2].walls[0] = false;
        } else if (r2 === r1 + 1 && s2 === s1) {
          grid[r1][s1].walls[0] = false;
          grid[r2][s2].walls[0] = false;
        } else if (r2 === r1 && s2 === (s1 + 1) % sectors) {
          grid[r1][s1].walls[1] = false;
          grid[r2][s2].walls[2] = false;
        } else if (r2 === r1 && s2 === (s1 - 1 + sectors) % sectors) {
          grid[r1][s1].walls[2] = false;
          grid[r2][s2].walls[1] = false;
        }
        inMaze.add([r1, s1].toString());
      }
      inMaze.add(path[path.length - 1].toString());
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazeKruskals(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  const total = rings * sectors;
  const sets: number[] = [];
  let setId = 0;
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      sets[r * sectors + s] = setId++;
    }
  }
  const walls: [number, number, number][] = [];
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      if (r < rings - 1) walls.push([r, s, 0]);
      walls.push([r, s, 1]);
    }
  }
  function find(i: number) {
    while (sets[i] !== i) i = sets[i];
    return i;
  }
  function union(i: number, j: number) {
    const ri = find(i);
    const rj = find(j);
    sets[ri] = rj;
  }
  shuffle(walls);
  for (const [r, s, dir] of walls) {
    const i = r * sectors + s;
    let j;
    if (dir === 0) j = (r + 1) * sectors + s;
    else j = r * sectors + ((s + 1) % sectors);
    if (find(i) !== find(j)) {
      union(i, j);
      if (dir === 0) {
        grid[r][s].walls[0] = false;
        grid[r + 1][s].walls[0] = false;
      } else {
        grid[r][s].walls[1] = false;
        grid[r][(s + 1) % sectors].walls[2] = false;
      }
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazeEller(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  let sets = Array(sectors).fill(0).map((_: any, i: number) => i);
  let nextSet = sectors;
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const nextS = (s + 1) % sectors;
      if (Math.random() < 0.5 || sets[s] === sets[nextS]) continue;
      grid[r][s].walls[1] = false;
      grid[r][nextS].walls[2] = false;
      const oldSet = sets[nextS];
      for (let i = 0; i < sectors; i++) if (sets[i] === oldSet) sets[i] = sets[s];
    }
    const setCells: { [key: number]: number[] } = {};
    for (let s = 0; s < sectors; s++) {
      if (!setCells[sets[s]]) setCells[sets[s]] = [];
      setCells[sets[s]].push(s);
    }
    const newSets = Array(sectors).fill(-1);
    for (const set in setCells) {
      const cells = setCells[set];
      let numOut = 0;
      for (const s of cells) {
        if (r < rings - 1 && (Math.random() < 0.5 || numOut === 0)) {
          grid[r][s].walls[0] = false;
          grid[r + 1][s].walls[0] = false;
          newSets[s] = nextSet++;
          numOut++;
        }
      }
    }
    for (let s = 0; s < sectors; s++) {
      if (newSets[s] === -1) newSets[s] = nextSet++;
    }
    sets = newSets;
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazeHuntAndKill(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  const visited = Array.from({ length: rings }, () => Array(sectors).fill(false));
  let r = Math.floor(Math.random() * rings);
  let s = Math.floor(Math.random() * sectors);
  visited[r][s] = true;
  function getUnvisitedNeighbors(r: number, s: number) {
    const nbs: [number, number, number][] = [];
    if (r > 0 && !visited[r - 1][s]) nbs.push([r - 1, s, 0]);
    if (r < rings - 1 && !visited[r + 1][s]) nbs.push([r + 1, s, 0]);
    if (!visited[r][(s + 1) % sectors]) nbs.push([r, (s + 1) % sectors, 1]);
    if (!visited[r][(s - 1 + sectors) % sectors]) nbs.push([r, (s - 1 + sectors) % sectors, 2]);
    return nbs;
  }
  while (true) {
    const nbs = getUnvisitedNeighbors(r, s);
    if (nbs.length > 0) {
      const [nr, ns, dir] = nbs[Math.floor(Math.random() * nbs.length)];
      visited[nr][ns] = true;
      if (dir === 0) {
        grid[r][s].walls[0] = false;
        grid[nr][ns].walls[0] = false;
      } else if (dir === 1) {
        grid[r][s].walls[1] = false;
        grid[nr][ns].walls[2] = false;
      } else if (dir === 2) {
        grid[r][s].walls[2] = false;
        grid[nr][ns].walls[1] = false;
      }
      r = nr;
      s = ns;
    } else {
      let found = false;
      for (let rr = 0; rr < rings && !found; rr++) {
        for (let ss = 0; ss < sectors && !found; ss++) {
          if (!visited[rr][ss]) {
            const nbs2: [number, number, number][] = [];
            if (rr > 0 && visited[rr - 1][ss]) nbs2.push([rr - 1, ss, 0]);
            if (rr < rings - 1 && visited[rr + 1][ss]) nbs2.push([rr + 1, ss, 0]);
            if (visited[rr][(ss + 1) % sectors]) nbs2.push([rr, (ss + 1) % sectors, 1]);
            if (visited[rr][(ss - 1 + sectors) % sectors]) nbs2.push([rr, (ss - 1 + sectors) % sectors, 2]);
            if (nbs2.length > 0) {
              const [nr, ns, dir] = nbs2[Math.floor(Math.random() * nbs2.length)];
              if (dir === 0) {
                grid[rr][ss].walls[0] = false;
                grid[nr][ns].walls[0] = false;
              } else if (dir === 1) {
                grid[rr][ss].walls[1] = false;
                grid[nr][ns].walls[2] = false;
              } else if (dir === 2) {
                grid[rr][ss].walls[2] = false;
                grid[nr][ns].walls[1] = false;
              }
              r = rr;
              s = ss;
              visited[r][s] = true;
              found = true;
            }
          }
        }
      }
      if (!found) break;
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazeBinaryTree(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const neighbors: [number, number, number][] = [];
      if (r < rings - 1) neighbors.push([r + 1, s, 0]);
      neighbors.push([r, (s + 1) % sectors, 1]);
      if (neighbors.length > 0) {
        const [nr, ns, dir] = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (dir === 0) {
          grid[r][s].walls[0] = false;
          grid[nr][ns].walls[0] = false;
        } else if (dir === 1) {
          grid[r][s].walls[1] = false;
          grid[nr][ns].walls[2] = false;
        }
      }
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

function generateCircularMazeSidewinder(rings: any, sectors: any): any[][] {
  const grid = createPolarGrid(rings, sectors);
  for (let r = 0; r < rings; r++) {
    let run: number[] = [];
    for (let s = 0; s < sectors; s++) {
      run.push(s);
      const atClockwiseBoundary = s === sectors - 1;
      const atOutwardBoundary = r === rings - 1;
      const shouldCloseOut = atClockwiseBoundary || (!atOutwardBoundary && Math.random() < 0.5);
      if (shouldCloseOut) {
        const member = run[Math.floor(Math.random() * run.length)];
        if (!atOutwardBoundary) {
          grid[r][member].walls[0] = false;
          grid[r + 1][member].walls[0] = false;
        }
        run = [];
      } else {
        grid[r][s].walls[1] = false;
        grid[r][(s + 1) % sectors].walls[2] = false;
      }
    }
  }
  grid[rings - 1][0].walls[0] = false;
  grid[0][0].walls[0] = false;
  for (let r = 0; r < rings; r++) for (let s = 0; s < sectors; s++) grid[r][s].visited = false;
  return grid;
}

self.onmessage = function(e) {
  const { mazeType, algorithm, width, height } = e.data;
  let maze = null;
  if (mazeType === 'rectangular' || mazeType === 'polarwarp') {
    switch (algorithm) {
      case 'dfs':
        maze = generateMazeDFS(width, height);
        break;
      case 'prims':
        maze = generateMazePrims(width, height);
        break;
      case 'wilsons':
        maze = generateMazeWilsons(width, height);
        break;
      case 'kruskal':
        maze = generateMazeKruskals(width, height);
        break;
      case 'eller':
        maze = generateMazeEller(width, height);
        break;
      case 'huntandkill':
        maze = generateMazeHuntAndKill(width, height);
        break;
      case 'binarytree':
        maze = generateMazeBinaryTree(width, height);
        break;
      case 'sidewinder':
        maze = generateMazeSidewinder(width, height);
        break;
      default:
        maze = generateMazeDFS(width, height);
    }
  } else if (mazeType === 'circular') {
    switch (algorithm) {
      case 'dfs':
        maze = generateCircularMazeDFS(width, height);
        break;
      case 'prims':
        maze = generateCircularMazePrims(width, height);
        break;
      case 'wilsons':
        maze = generateCircularMazeWilsons(width, height);
        break;
      case 'kruskal':
        maze = generateCircularMazeKruskals(width, height);
        break;
      case 'eller':
        maze = generateCircularMazeEller(width, height);
        break;
      case 'huntandkill':
        maze = generateCircularMazeHuntAndKill(width, height);
        break;
      case 'binarytree':
        maze = generateCircularMazeBinaryTree(width, height);
        break;
      case 'sidewinder':
        maze = generateCircularMazeSidewinder(width, height);
        break;
      default:
        maze = generateCircularMazeDFS(width, height);
    }
  }
  self.postMessage({ maze });
}; 