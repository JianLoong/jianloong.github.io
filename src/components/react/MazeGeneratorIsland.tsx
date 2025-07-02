import React, { useState, useEffect } from "react";

// --- Types ---
interface Cell {
  x: number;
  y: number;
  walls: [boolean, boolean, boolean, boolean]; // top, right, bottom, left
  visited: boolean;
}

type MazeType = 'rectangular' | 'circular';
type Algorithm = 'dfs' | 'prims';

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

// --- Circular Maze Types/Functions ---
interface PolarCell {
  ring: number;
  sector: number;
  visited: boolean;
  walls: [boolean, boolean]; // [radial, angular]
}

function createPolarGrid(rings: number, sectors: number): PolarCell[][] {
  return Array.from({ length: rings }, (_, r) =>
    Array.from({ length: sectors }, (_, s) => ({
      ring: r,
      sector: s,
      visited: false,
      walls: [true, true], // [radial, angular]
    }))
  );
}

function generateCircularMazeDFS(rings: number, sectors: number): PolarCell[][] {
  const grid = createPolarGrid(rings, sectors);
  const stack: PolarCell[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { ring, sector } = current;
    const neighbors: [PolarCell, number][] = [];
    // Neighbor inwards (radial)
    if (ring > 0 && !grid[ring - 1][sector].visited) neighbors.push([grid[ring - 1][sector], 0]);
    // Neighbor outwards (radial)
    if (ring < rings - 1 && !grid[ring + 1][sector].visited) neighbors.push([grid[ring + 1][sector], 0]);
    // Neighbor clockwise (angular)
    if (!grid[ring][(sector + 1) % sectors].visited) neighbors.push([grid[ring][(sector + 1) % sectors], 1]);
    // Neighbor counterclockwise (angular)
    if (!grid[ring][(sector - 1 + sectors) % sectors].visited) neighbors.push([grid[ring][(sector - 1 + sectors) % sectors], 1]);

    if (neighbors.length > 0) {
      const [next, wallType] = shuffle(neighbors)[0];
      // Remove wall between current and next
      if (wallType === 0) {
        // Radial wall
        if (next.ring > ring) {
          current.walls[0] = false; // outwards
        } else {
          next.walls[0] = false; // inwards
        }
      } else {
        // Angular wall
        if ((next.sector + 1) % sectors === sector) {
          next.walls[1] = false; // next's clockwise wall
        } else {
          current.walls[1] = false; // current's clockwise wall
        }
      }
      next.visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  // Add exit: remove outer radial wall at sector 0
  grid[rings - 1][0].walls[0] = false;
  return grid;
}

function generateCircularMazePrims(rings: number, sectors: number): PolarCell[][] {
  const grid = createPolarGrid(rings, sectors);
  const walls: [number, number, number][] = [];
  const start = grid[0][0];
  start.visited = true;
  // Add all walls of the starting cell
  if (rings > 1) walls.push([0, 0, 0]); // outwards (radial)
  walls.push([0, 0, 1]); // angular

  while (walls.length > 0) {
    const idx = Math.floor(Math.random() * walls.length);
    const [r, s, dir] = walls.splice(idx, 1)[0];
    const cell = grid[r][s];
    let nr = r, ns = s, ndir = dir;
    if (dir === 0) { // radial
      if (r < rings - 1) nr = r + 1;
      else continue;
    } else if (dir === 1) { // angular
      ns = (s + 1) % sectors;
    }
    const neighbor = grid[nr][ns];
    if (!neighbor.visited) {
      if (dir === 0) {
        cell.walls[0] = false;
        neighbor.walls[0] = false;
      } else if (dir === 1) {
        cell.walls[1] = false;
        neighbor.walls[1] = false;
      }
      neighbor.visited = true;
      // Add neighbor's walls
      if (nr < rings - 1 && !grid[nr + 1][ns].visited) walls.push([nr, ns, 0]);
      if (!grid[nr][(ns + 1) % sectors].visited) walls.push([nr, ns, 1]);
    }
  }
  // Add exit: remove outer radial wall at sector 0
  grid[rings - 1][0].walls[0] = false;
  return grid;
}

// --- SVG Components ---
const cellSize = 24;

function RectangularMazeSVG({ maze, width, height }: { maze: Cell[][], width: number, height: number }) {
  return (
    <svg
      width="100%"
      height={height * cellSize + 2}
      viewBox={`0 0 ${width * cellSize + 2} ${height * cellSize + 2}`}
      className="bg-[var(--color-background)] border border-[var(--color-border)] block"
    >
      {maze.map((row, y) =>
        row.map((cell, x) => {
          const px = x * cellSize;
          const py = y * cellSize;
          const lines = [];
          if (cell.walls[0]) lines.push(<line key="t" x1={px} y1={py} x2={px + cellSize} y2={py} stroke="var(--color-accent)" strokeWidth={2} />);
          if (cell.walls[1]) lines.push(<line key="r" x1={px + cellSize} y1={py} x2={px + cellSize} y2={py + cellSize} stroke="var(--color-accent)" strokeWidth={2} />);
          if (cell.walls[2]) lines.push(<line key="b" x1={px} y1={py + cellSize} x2={px + cellSize} y2={py + cellSize} stroke="var(--color-accent)" strokeWidth={2} />);
          if (cell.walls[3]) lines.push(<line key="l" x1={px} y1={py} x2={px} y2={py + cellSize} stroke="var(--color-accent)" strokeWidth={2} />);
          return <g key={x + "," + y}>{lines}</g>;
        })
      )}
      {/* Highlight entrance (left of top-left cell) */}
      <circle
        cx={0}
        cy={cellSize / 2}
        r={cellSize / 4}
        fill="var(--color-accent)"
        stroke="var(--color-foreground)"
        strokeWidth={3}
      />
      {/* Highlight exit (right of bottom-right cell) */}
      <circle
        cx={width * cellSize + 2}
        cy={height * cellSize - cellSize / 2}
        r={cellSize / 4}
        fill="var(--color-accent)"
        stroke="var(--color-foreground)"
        strokeWidth={3}
      />
    </svg>
  );
}

function CircularMazeSVG({ width, height, algorithm, keyVal }: { width: number, height: number, algorithm: Algorithm, keyVal: number }) {
  // Generate and render circular maze on the fly using selected algorithm
  const rings = width;
  const sectors = height * 3;
  const grid = algorithm === 'dfs'
    ? generateCircularMazeDFS(rings, sectors)
    : generateCircularMazePrims(rings, sectors);
  const cx = (width * cellSize);
  const cy = (width * cellSize);
  const rStep = (width * cellSize) / rings;
  const aStep = (2 * Math.PI) / sectors;
  const elements = [];
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < sectors; s++) {
      const cell = grid[r][s];
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
      // Angular wall (between sectors)
      if (cell.walls[1]) {
        const x1 = cx + r1 * Math.cos(a1);
        const y1 = cy + r1 * Math.sin(a1);
        const x2 = cx + r2 * Math.cos(a1);
        const y2 = cy + r2 * Math.sin(a1);
        elements.push(
          <line
            key={`angular-${r},${s}`}
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
  const outerRing = grid[rings - 1];
  for (let s = 0; s < sectors; s++) {
    // If this is the exit sector and the wall is removed, skip drawing this segment
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
  // Highlight the exit with a marker if the exit wall is removed
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
  // Draw center
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
      key={keyVal}
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
  const [maze, setMaze] = useState(() => generateMazeDFS(20, 20));
  const [circularKey, setCircularKey] = useState(0);

  // Regenerate maze on option change
  useEffect(() => {
    if (mazeType === 'rectangular') {
      if (algorithm === 'dfs') setMaze(generateMazeDFS(width, height));
      else setMaze(generateMazePrims(width, height));
    } else if (mazeType === 'circular') {
      setCircularKey(k => k + 1);
    }
  }, [mazeType, algorithm, size]);

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
      {mazeType === 'rectangular' ? (
        <div className="flex justify-center mt-8 px-4">
          <div className="w-full max-w-full overflow-auto" style={{ maxWidth: width * cellSize + 2 }}>
            <RectangularMazeSVG maze={maze} width={width} height={height} />
          </div>
        </div>
      ) : mazeType === 'circular' ? (
        <div className="flex justify-center mt-8 px-4">
          <div className="w-full" style={{ maxWidth: 600 }}>
            <CircularMazeSVG width={width} height={height} algorithm={algorithm} keyVal={circularKey} />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MazeGeneratorIsland; 