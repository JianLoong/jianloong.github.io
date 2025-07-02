import * as React from "react";
import { useState, useEffect, useRef } from "react";
// Remove the static import of MazeWorker
// import MazeWorker from './mazeWorker.ts?worker&v=2';

// --- Types ---
interface Cell {
  x: number;
  y: number;
  walls: [boolean, boolean, boolean, boolean]; // top, right, bottom, left
  visited: boolean;
}

type MazeType = 'rectangular' | 'circular';
type Algorithm = 'dfs' | 'prims';

// 2. Add state for circular maze
type PolarCell = {
  ring: number;
  sector: number;
  visited: boolean;
  walls: [boolean, boolean, boolean];
};

// --- Maze Generation Functions ---
function createGrid(width: number, height: number): Cell[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      walls: [true, true, true, true],
      visited: false,
    }))
  );
}

function shuffle<T>(arr: T[]): T[] {
  return arr.sort(() => Math.random() - 0.5);
}

function generateMazeDFS(width: number, height: number): Cell[][] {
  const grid = createGrid(width, height);
  const stack: Cell[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { x, y } = current;
    const neighbors: [Cell, number][] = [];
    // top, right, bottom, left
    if (y > 0 && !grid[y - 1][x].visited) neighbors.push([grid[y - 1][x], 0]);
    if (x < width - 1 && !grid[y][x + 1].visited) neighbors.push([grid[y][x + 1], 1]);
    if (y < height - 1 && !grid[y + 1][x].visited) neighbors.push([grid[y + 1][x], 2]);
    if (x > 0 && !grid[y][x - 1].visited) neighbors.push([grid[y][x - 1], 3]);

    if (neighbors.length > 0) {
      const [next, dir] = shuffle(neighbors)[0];
      // Remove wall between current and next
      current.walls[dir] = false;
      next.walls[(dir + 2) % 4] = false;
      next.visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  // Add entrance and exit
  grid[0][0].walls[3] = false; // Entrance: remove left wall of top-left
  grid[height - 1][width - 1].walls[1] = false; // Exit: remove right wall of bottom-right
  return grid;
}

function generateMazePrims(width: number, height: number): Cell[][] {
  const grid = createGrid(width, height);
  const walls: [number, number, number][] = [];
  const start = grid[0][0];
  start.visited = true;
  // Add all walls of the starting cell
  if (0 < height - 1) walls.push([0, 0, 2]); // bottom
  if (0 < width - 1) walls.push([0, 0, 1]); // right

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
      // Add neighbor's walls
      if (ny > 0 && !grid[ny - 1][nx].visited) walls.push([ny, nx, 0]);
      if (nx < width - 1 && !grid[ny][nx + 1].visited) walls.push([ny, nx, 1]);
      if (ny < height - 1 && !grid[ny + 1][nx].visited) walls.push([ny, nx, 2]);
      if (nx > 0 && !grid[ny][nx - 1].visited) walls.push([ny, nx, 3]);
    }
  }
  // Add entrance and exit
  grid[0][0].walls[3] = false; // Entrance: remove left wall of top-left
  grid[height - 1][width - 1].walls[1] = false; // Exit: remove right wall of bottom-right
  return grid;
}

// --- Circular Maze Generation Functions ---
function createPolarGrid(rings: number, sectors: number): PolarCell[][] {
  return Array.from({ length: rings }, (_, r) =>
    Array.from({ length: sectors }, (_, s) => ({
      ring: r,
      sector: s,
      visited: false,
      walls: [true, true, true], // [radialIn, clockwise, counterclockwise]
    }))
  );
}

function generateCircularMazeDFS(rings: number, sectors: number): PolarCell[][] {
  const grid = createPolarGrid(rings, sectors);
  const stack: PolarCell[] = [];
  const start = grid[rings - 1][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { ring, sector } = current;
    const neighbors: [PolarCell, number, number][] = [];
    // Precompute sector indices for wrapping
    const sectorPlus = (sector + 1) % sectors;
    const sectorMinus = (sector - 1 + sectors) % sectors;
    if (ring > 0 && !grid[ring - 1][sector].visited) neighbors.push([grid[ring - 1][sector], 0, 0]);
    if (ring < rings - 1 && !grid[ring + 1][sector].visited) neighbors.push([grid[ring + 1][sector], 0, 0]);
    if (!grid[ring][sectorPlus].visited) neighbors.push([grid[ring][sectorPlus], 1, 2]);
    if (!grid[ring][sectorMinus].visited) neighbors.push([grid[ring][sectorMinus], 2, 1]);
    if (neighbors.length > 0) {
      // Pick a random neighbor without shuffling the whole array
      const idx = (neighbors.length > 1) ? Math.floor(Math.random() * neighbors.length) : 0;
      const [next, wallIdx, neighborWallIdx] = neighbors[idx];
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
  return grid;
}

function generateCircularMazePrims(rings: number, sectors: number): PolarCell[][] {
  const grid = createPolarGrid(rings, sectors);
  const walls: [number, number, number, number][] = [];
  const start = grid[rings - 1][0];
  start.visited = true;
  if (rings > 1) walls.push([rings - 1, 0, 0, 0]);
  walls.push([rings - 1, 0, 1, 2]);
  walls.push([rings - 1, 0, 2, 1]);
  function addWalls(cell: PolarCell) {
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
  return grid;
}

// --- SVG Components ---
const cellSize = 24;

function RectangularMazeSVG({ maze, width, height }: { maze: Cell[][], width: number, height: number }) {
  if (!maze || !maze.length) return null;
  console.log('RectangularMazeSVG maze:', maze);
  // Solution path
  const solution = findRectangularMazeSolution(maze, width, height);
  const elements = [];
  for (let y = 0; y < height; y++) {
    if (!maze[y]) continue;
    for (let x = 0; x < width; x++) {
      if (!maze[y][x] || !maze[y][x].walls) continue;
      const px = x * cellSize;
      const py = y * cellSize;
      const lines = [];
      if (maze[y][x].walls[0]) lines.push(<line key="t" x1={px} y1={py} x2={px + cellSize} y2={py} stroke="var(--color-accent)" strokeWidth={2} />);
      if (maze[y][x].walls[1]) lines.push(<line key="r" x1={px + cellSize} y1={py} x2={px + cellSize} y2={py + cellSize} stroke="var(--color-accent)" strokeWidth={2} />);
      if (maze[y][x].walls[2]) lines.push(<line key="b" x1={px} y1={py + cellSize} x2={px + cellSize} y2={py + cellSize} stroke="var(--color-accent)" strokeWidth={2} />);
      if (maze[y][x].walls[3]) lines.push(<line key="l" x1={px} y1={py} x2={px} y2={py + cellSize} stroke="var(--color-accent)" strokeWidth={2} />);
      elements.push(<g key={x + "," + y}>{lines}</g>);
    }
  }
  // Highlight entrance (left of top-left cell)
  elements.push(
    <circle
      key="entrance-marker"
      cx={0}
      cy={cellSize / 2}
      r={cellSize / 4}
      fill="var(--color-accent)"
      stroke="var(--color-foreground)"
      strokeWidth={3}
    />
  );
  // Highlight exit (right of bottom-right cell)
  elements.push(
    <circle
      key="exit-marker"
      cx={width * cellSize + 2}
      cy={height * cellSize - cellSize / 2}
      r={cellSize / 4}
      fill="var(--color-accent)"
      stroke="var(--color-foreground)"
      strokeWidth={3}
    />
  );
  // Draw solution path
  if (solution.length > 1) {
    const pathPoints = solution.map(([x, y]) => [x * cellSize + cellSize / 2, y * cellSize + cellSize / 2]);
    elements.push(
      <polyline
        key="solution-path"
        points={pathPoints.map(p => p.join(",")).join(" ")}
        fill="none"
        stroke="#f43f5e"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.7}
      />
    );
  }
  return (
    <svg
      width="100%"
      height={height * cellSize + 2}
      viewBox={`0 0 ${width * cellSize + 2} ${height * cellSize + 2}`}
      className="bg-[var(--color-background)] border border-[var(--color-border)] block"
    >
      {elements}
    </svg>
  );
}

// Helper to find solution path in rectangular maze using BFS
function findRectangularMazeSolution(maze: Cell[][], width: number, height: number): [number, number][] {
  if (!maze || !maze.length) return [];
  const start: [number, number] = [0, 0];
  const end: [number, number] = [width - 1, height - 1];
  const queue: [number, number][] = [start];
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const parent = Array.from({ length: height }, () => Array(width).fill(null));
  visited[0][0] = true;
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x === end[0] && y === end[1]) break;
    if (!maze[y] || !maze[y][x] || !maze[y][x].walls) continue;
    const cell = maze[y][x];
    const deltas = [
      [0, -1, 0], // top
      [1, 0, 1],  // right
      [0, 1, 2],  // bottom
      [-1, 0, 3], // left
    ];
    for (let i = 0; i < 4; i++) {
      const [dx, dy, wallIdx] = deltas[i];
      if (!cell.walls[wallIdx]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[ny][nx]) {
          if (!maze[ny] || !maze[ny][nx] || !maze[ny][nx].walls) continue;
          visited[ny][nx] = true;
          parent[ny][nx] = [x, y];
          queue.push([nx, ny]);
        }
      }
    }
  }
  // Reconstruct path
  const path: [number, number][] = [];
  let cur: [number, number] | null = end;
  while (cur && !(cur[0] === 0 && cur[1] === 0)) {
    path.push(cur);
    cur = parent[cur[1]][cur[0]];
  }
  path.push(start);
  path.reverse();
  return path;
}

// Helper to find solution path in circular maze using BFS
function findCircularMazeSolution(maze: PolarCell[][], rings: number, sectors: number): [number, number][] {
  if (!maze || !maze.length) return [];
  const start: [number, number] = [rings - 1, 0];
  const end: [number, number] = [0, 0];
  const queue: [number, number][] = [start];
  const visited = Array.from({ length: rings }, () => Array(sectors).fill(false));
  const parent = Array.from({ length: rings }, () => Array(sectors).fill(null));
  visited[start[0]][start[1]] = true;
  while (queue.length > 0) {
    const [r, s] = queue.shift()!;
    if (r === end[0] && s === end[1]) break;
    if (!maze[r] || !maze[r][s] || !maze[r][s].walls) continue;
    const cell = maze[r][s];
    // [dr, ds, cellWallIdx, neighborWallIdx]
    const deltas = [
      [-1, 0, 0, 0], // inwards (radial)
      [1, 0, 0, 0], // outwards (radial)
      [0, 1, 1, 2], // clockwise (angular)
      [0, -1, 2, 1], // counterclockwise (angular)
    ];
    for (let i = 0; i < 4; i++) {
      const [dr, ds, cellWallIdx, neighborWallIdx] = deltas[i];
      let nr = r + dr;
      let ns = (s + ds + sectors) % sectors;
      if (nr < 0 || nr >= rings) continue;
      if (!maze[nr] || !maze[nr][ns] || !maze[nr][ns].walls) continue;
      const neighbor = maze[nr][ns];
      if (!cell.walls[cellWallIdx] && !neighbor.walls[neighborWallIdx]) {
        if (!visited[nr][ns]) {
          visited[nr][ns] = true;
          parent[nr][ns] = [r, s];
          queue.push([nr, ns]);
        }
      }
    }
  }
  // Reconstruct path
  const path: [number, number][] = [];
  let cur: [number, number] | null = end;
  while (cur && !(cur[0] === start[0] && cur[1] === start[1])) {
    path.push(cur);
    cur = parent[cur[0]][cur[1]];
  }
  path.push(start);
  path.reverse();
  return path;
}

function CircularMazeSVG({ maze, width, height }: { maze: PolarCell[][], width: number, height: number }) {
  if (!maze || !maze.length || !maze[0] || !maze[0].length) {
    return (
      <svg width="100%" height="100">
        <text x={10} y={20} fill="red">Maze data is invalid</text>
      </svg>
    );
  }
  const rings = width;
  const sectors = height * 3;
  const padding = 32;
  const svgSize = width * cellSize * 2 + padding * 2;
  const cx = (width * cellSize) + padding;
  const cy = (width * cellSize) + padding;
  const rStep = (width * cellSize) / rings;
  const aStep = (2 * Math.PI) / sectors;
  const elements = [];
  // Solution path
  const solution = findCircularMazeSolution(maze, rings, sectors);
  if (solution.length > 1) {
    const pathPoints = solution.map(([r, s]) => {
      const rr = (r + 0.5) * rStep;
      const aa = (s + 0.5) * aStep;
      return [cx + rr * Math.cos(aa), cy + rr * Math.sin(aa)];
    });
    elements.push(
      <polyline
        key="solution-path"
        points={pathPoints.map(p => p.join(",")).join(" ")}
        fill="none"
        stroke="#f43f5e"
        strokeWidth={4}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.7}
      />
    );
  }
  for (let r = 0; r < rings; r++) {
    if (!maze[r]) continue;
    for (let s = 0; s < sectors; s++) {
      if (!maze[r][s]) continue;
      const cell = maze[r][s];
      const r1 = r * rStep;
      const r2 = (r + 1) * rStep;
      const a1 = s * aStep;
      const a2 = (s + 1) * aStep;
      // Radial wall (between rings)
      if (cell.walls[0] && r > 0) {
        const x1 = cx + r1 * Math.cos(a1);
        const y1 = cy + r1 * Math.sin(a1);
        const x2 = cx + r1 * Math.cos(a2);
        const y2 = cy + r1 * Math.sin(a2);
        elements.push(
          <line
            key={`radial-${r},${s}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-accent)"
            strokeWidth={2}
          />
        );
      }
      // Clockwise wall (between sectors)
      if (cell.walls[1]) {
        const x1 = cx + r1 * Math.cos(a2);
        const y1 = cy + r1 * Math.sin(a2);
        const x2 = cx + r2 * Math.cos(a2);
        const y2 = cy + r2 * Math.sin(a2);
        elements.push(
          <line
            key={`cw-${r},${s}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-accent)"
            strokeWidth={2}
          />
        );
      }
      // Counterclockwise wall (between sectors)
      if (cell.walls[2]) {
        const x1 = cx + r1 * Math.cos(a1);
        const y1 = cy + r1 * Math.sin(a1);
        const x2 = cx + r2 * Math.cos(a1);
        const y2 = cy + r2 * Math.sin(a1);
        elements.push(
          <line
            key={`ccw-${r},${s}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-accent)"
            strokeWidth={2}
          />
        );
      }
    }
  }
  // Draw outer circle in segments, skipping the exit at sector 0 if its wall is removed
  const outerRing = maze[rings - 1];
  if (!outerRing || !outerRing[0]) {
    return (
      <svg width="100%" height="100">
        <text x={10} y={20} fill="red">Maze data is invalid</text>
      </svg>
    );
  }
  for (let s = 0; s < sectors; s++) {
    if (s === 0 && !outerRing[0].walls[0]) continue;
    const rOuter = rings * rStep;
    const a1 = s * aStep;
    const a2 = (s + 1) * aStep;
    const x1 = cx + rOuter * Math.cos(a1);
    const y1 = cy + rOuter * Math.sin(a1);
    const x2 = cx + rOuter * Math.cos(a2);
    const y2 = cy + rOuter * Math.sin(a2);
    elements.push(
      <path
        key={`outer-arc-${s}`}
        d={`M ${x1} ${y1} A ${rOuter} ${rOuter} 0 0 1 ${x2} ${y2}`}
        stroke="var(--color-accent)"
        strokeWidth={2}
        fill="none"
      />
    );
  }
  // Entrance marker (outermost ring, sector 0)
  if (!outerRing[0].walls[0]) {
    const rOuter = rings * rStep;
    const a0 = 0;
    const xExit = cx + rOuter * Math.cos(a0);
    const yExit = cy + rOuter * Math.sin(a0);
    elements.push(
      <circle
        key="exit-marker"
        cx={xExit}
        cy={yExit}
        r={rStep / 3}
        fill="var(--color-accent)"
        stroke="var(--color-foreground)"
        strokeWidth={3}
      />
    );
  }
  // Center marker (exit)
  elements.push(
    <circle
      key="center"
      cx={cx}
      cy={cy}
      r={rStep / 3}
      fill="var(--color-accent)"
      stroke="var(--color-foreground)"
      strokeWidth={1}
    />
  );
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width * cellSize * 2} ${width * cellSize * 2}`}
      className="bg-[var(--color-background)] border border-[var(--color-border)] block mx-auto"
    >
      {elements}
    </svg>
  );
}

// --- Main Maze Generator Component ---
const MazeGeneratorIsland: React.FC = () => {
  const sizePresets = [
    { label: 'Small (8x8)', value: 8 },
    { label: 'Medium (16x16)', value: 16 },
    { label: 'Large (32x32)', value: 32 },
  ];
  const [size, setSize] = useState(16);
  const width = size;
  const height = size;
  const [mazeType, setMazeType] = useState<MazeType>('rectangular');
  const [algorithm, setAlgorithm] = useState<Algorithm>('dfs');
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [circularMaze, setCircularMaze] = useState<PolarCell[][]>([]);
  const [loading, setLoading] = useState(false);

  const maxRectangularSize = 32;
  const maxCircularSize = 32;

  const safeWidth =
    mazeType === 'rectangular'
      ? Math.min(width, maxRectangularSize)
      : Math.min(width, maxCircularSize);

  const safeHeight =
    mazeType === 'rectangular'
      ? Math.min(height, maxRectangularSize)
      : Math.min(height, maxCircularSize);

  useEffect(() => {
    setLoading(true);
    let mazeData;
    if (mazeType === 'rectangular') {
      mazeData = algorithm === 'dfs'
        ? generateMazeDFS(safeWidth, safeHeight)
        : generateMazePrims(safeWidth, safeHeight);
      setMaze(mazeData);
    } else if (mazeType === 'circular') {
      mazeData = algorithm === 'dfs'
        ? generateCircularMazeDFS(safeWidth, safeHeight * 3)
        : generateCircularMazePrims(safeWidth, safeHeight * 3);
      setCircularMaze(mazeData);
    }
    setLoading(false);
  }, [mazeType, algorithm, width, height]);

  return (
    <div className="interactive-demo-island max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>Maze Generator</h3>
      <div className="mb-6 flex flex-col items-center gap-6 px-4">
        {/* Controls Row */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          <label className="font-semibold text-base flex flex-col items-start bg-[var(--color-muted)] rounded-lg px-4 py-3 w-full" style={{ color: 'var(--color-foreground)' }}>
            <span className="mb-1">Maze Type:</span>
            <select
              value={mazeType}
              onChange={e => setMazeType(e.target.value as MazeType)}
              className="mt-1 text-lg px-3 py-2 border-2 border-[var(--color-border)] rounded-md outline-none bg-[var(--color-background)] text-[var(--color-foreground)] font-semibold shadow-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent)] w-full transition"
            >
              <option value="rectangular">Rectangular</option>
              <option value="circular">Circular</option>
            </select>
          </label>
          <label className="font-semibold text-base flex flex-col items-start bg-[var(--color-muted)] rounded-lg px-4 py-3 w-full" style={{ color: 'var(--color-foreground)' }}>
            <span className="mb-1">Algorithm:</span>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value as Algorithm)}
              className="mt-1 text-lg px-3 py-2 border-2 border-[var(--color-border)] rounded-md outline-none bg-[var(--color-background)] text-[var(--color-foreground)] font-semibold shadow-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent)] w-full transition"
            >
              <option value="dfs">DFS</option>
              <option value="prims">Prim's</option>
            </select>
          </label>
        </div>
        {/* Size Row */}
        <div className="w-full max-w-xl">
          <label className="font-semibold text-base flex flex-col items-start bg-[var(--color-muted)] rounded-lg px-4 py-3 w-full" style={{ color: 'var(--color-foreground)' }}>
            <span className="mb-1">Maze Size:</span>
            <select
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="mt-1 text-lg px-3 py-2 border-2 border-[var(--color-border)] rounded-md outline-none bg-[var(--color-background)] text-[var(--color-foreground)] font-semibold shadow-sm focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[color:var(--color-accent)] w-full transition"
            >
              {sizePresets.map(preset => (
                <option key={preset.value} value={preset.value}>{preset.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {/* Maze rendering */}
      {loading ? (
        <div className="flex justify-center items-center h-64"><span className="loader" /></div>
      ) : mazeType === 'rectangular' ? (
        maze && maze.length && maze[0] && maze[0].length ? (
          <div className="flex justify-center mt-8 px-4">
            <div className="w-full max-w-full overflow-auto" style={{ maxWidth: width * cellSize + 2 }}>
              <RectangularMazeSVG maze={maze} width={width} height={height} />
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 font-semibold mt-8">
            Maze data is empty or invalid.<br/>
            maze.length: {maze ? maze.length : 'undefined'}<br/>
            maze[0]?.length: {maze && maze[0] ? maze[0].length : 'undefined'}
          </div>
        )
      ) : mazeType === 'circular' ? (
        circularMaze && circularMaze.length && circularMaze[0] && circularMaze[0].length ? (
          <div className="flex justify-center mt-8 px-4">
            <div className="w-full max-w-full overflow-auto" style={{ maxWidth: width * cellSize + 2 }}>
              <CircularMazeSVG maze={circularMaze} width={width} height={height} />
            </div>
          </div>
        ) : (
          <div className="text-center text-red-500 font-semibold mt-8">
            Circular maze data is empty or invalid.<br/>
            circularMaze.length: {circularMaze ? circularMaze.length : 'undefined'}<br/>
            circularMaze[0]?.length: {circularMaze && circularMaze[0] ? circularMaze[0].length : 'undefined'}
          </div>
        )
      ) : null}
      {mazeType === 'rectangular' && (width > maxRectangularSize || height > maxRectangularSize) && (
        <div className="text-center text-yellow-600 font-semibold mt-4">
          For rectangular mazes, the maximum supported size is {maxRectangularSize}.<br/>
          The maze will be generated at the maximum allowed size.
        </div>
      )}
      {mazeType === 'circular' && (width > maxCircularSize || height > maxCircularSize) && (
        <div className="text-center text-yellow-600 font-semibold mt-4">
          For circular mazes, the maximum supported size is {maxCircularSize}.<br/>
          The maze will be generated at the maximum allowed size.
        </div>
      )}
    </div>
  );
};

export default MazeGeneratorIsland; 