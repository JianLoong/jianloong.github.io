// Maze generation Web Worker for all types
// This file will be loaded as a Web Worker

// --- Utility ---
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Rectangular Maze ---
function createGrid(width: number, height: number) {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      walls: [true, true, true, true], // top, right, bottom, left
      visited: false,
    }))
  );
}

function generateMazeDFS(width: number, height: number) {
  const grid = createGrid(width, height);
  const stack: any[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { x, y } = current;
    const neighbors: any[] = [];
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push([grid[y - 1][x], 0]);
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push([grid[y][x + 1], 1]);
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push([grid[y + 1][x], 2]);
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push([grid[y][x - 1], 3]);
    if (neighbors.length > 0) {
      const [next, dir] = shuffle(neighbors)[0];
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
  return grid;
}

function generateMazePrims(width: number, height: number) {
  const grid = createGrid(width, height);
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
  return grid;
}

self.onmessage = function(e) {
  const { mazeType, algorithm, width, height } = e.data;
  let maze;
  if (mazeType === 'rectangular') {
    maze = algorithm === 'dfs' ? generateMazeDFS(width, height) : generateMazePrims(width, height);
  }
  console.log('Worker generated maze:', maze);
  self.postMessage({ maze });
}; 