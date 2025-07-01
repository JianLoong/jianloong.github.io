import React, { useState, useEffect } from "react";

interface Cell {
  x: number;
  y: number;
  walls: [boolean, boolean, boolean, boolean]; // top, right, bottom, left
  visited: boolean;
}

type MazeType = 'rectangular' | 'circular' | 'hexagonal' | 'triangular';
type Algorithm = 'dfs' | 'prims';

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
  return grid;
}

// Proper circular maze cell type
interface PolarCell {
  ring: number;
  sector: number;
  visited: boolean;
  walls: [boolean, boolean]; // [radial, angular]
}

// Generate a polar grid for a circular maze
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

// DFS for circular maze
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
  return grid;
}

// Prim's algorithm for circular maze
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
  return grid;
}

// Hexagonal cell type
interface HexCell {
  q: number; // column
  r: number; // row
  visited: boolean;
  walls: [boolean, boolean, boolean, boolean, boolean, boolean]; // 6 sides
}

// Create hex grid
function createHexGrid(width: number, height: number): HexCell[][] {
  return Array.from({ length: height }, (_, r) =>
    Array.from({ length: width }, (_, q) => ({
      q,
      r,
      visited: false,
      walls: [true, true, true, true, true, true],
    }))
  );
}

// Neighbor offsets for even-q layout
const hexDirs = [
  [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]
];

// DFS for hex maze
function generateHexMazeDFS(width: number, height: number): HexCell[][] {
  const grid = createHexGrid(width, height);
  const stack: HexCell[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { q, r } = current;
    const neighbors: [HexCell, number][] = [];
    for (let dir = 0; dir < 6; dir++) {
      const dq = hexDirs[dir][0];
      const dr = hexDirs[dir][1];
      const nq = q + dq;
      const nr = r + dr;
      if (nr >= 0 && nr < height && nq >= 0 && nq < width && !grid[nr][nq].visited) {
        neighbors.push([grid[nr][nq], dir]);
      }
    }
    if (neighbors.length > 0) {
      const [next, dir] = shuffle(neighbors)[0];
      // Remove wall between current and next
      current.walls[dir] = false;
      // Remove the opposite wall in the neighbor
      const oppositeDir = (dir + 3) % 6;
      next.walls[oppositeDir] = false;
      next.visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  return grid;
}

// Prim's for hex maze
function generateHexMazePrims(width: number, height: number): HexCell[][] {
  const grid = createHexGrid(width, height);
  const walls: [number, number, number][] = [];
  const start = grid[0][0];
  start.visited = true;
  
  // Add all walls of the starting cell
  for (let dir = 0; dir < 6; dir++) {
    const nq = start.q + hexDirs[dir][0];
    const nr = start.r + hexDirs[dir][1];
    if (nr >= 0 && nr < height && nq >= 0 && nq < width) {
      walls.push([start.r, start.q, dir]);
    }
  }
  
  while (walls.length > 0) {
    const idx = Math.floor(Math.random() * walls.length);
    const [r, q, dir] = walls.splice(idx, 1)[0];
    const cell = grid[r][q];
    const nq = q + hexDirs[dir][0];
    const nr = r + hexDirs[dir][1];
    if (nr < 0 || nr >= height || nq < 0 || nq >= width) continue;
    const neighbor = grid[nr][nq];
    if (!neighbor.visited) {
      // Remove wall between cell and neighbor
      cell.walls[dir] = false;
      const oppositeDir = (dir + 3) % 6;
      neighbor.walls[oppositeDir] = false;
      neighbor.visited = true;
      
      // Add neighbor's walls to the list
      for (let d = 0; d < 6; d++) {
        const nnq = neighbor.q + hexDirs[d][0];
        const nnr = neighbor.r + hexDirs[d][1];
        if (nnr >= 0 && nnr < height && nnq >= 0 && nnq < width && !grid[nnr][nnq].visited) {
          walls.push([neighbor.r, neighbor.q, d]);
        }
      }
    }
  }
  return grid;
}

// Triangular cell type
interface TriCell {
  x: number;
  y: number;
  up: boolean; // true if triangle points up, false if down
  visited: boolean;
  walls: [boolean, boolean, boolean]; // 3 sides
}

// Create triangle grid
function createTriGrid(width: number, height: number): TriCell[][] {
  return Array.from({ length: height }, (_, y) =>
    Array.from({ length: width }, (_, x) => ({
      x,
      y,
      up: (x + y) % 2 === 0,
      visited: false,
      walls: [true, true, true],
    }))
  );
}

// Neighbor offsets for triangles
const triDirsUp = [ [0, -1], [1, 0], [-1, 0] ]; // up, right, left
const triDirsDown = [ [0, 1], [1, 0], [-1, 0] ]; // down, right, left

// DFS for triangle maze
function generateTriMazeDFS(width: number, height: number): TriCell[][] {
  const grid = createTriGrid(width, height);
  const stack: TriCell[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { x, y, up } = current;
    const dirs = up ? triDirsUp : triDirsDown;
    const neighbors: [TriCell, number][] = [];
    for (let dir = 0; dir < 3; dir++) {
      const dx = dirs[dir][0];
      const dy = dirs[dir][1];
      const nx = x + dx;
      const ny = y + dy;
      if (ny >= 0 && ny < height && nx >= 0 && nx < width && !grid[ny][nx].visited) {
        neighbors.push([grid[ny][nx], dir]);
      }
    }
    if (neighbors.length > 0) {
      const [next, dir] = shuffle(neighbors)[0];
      // Remove wall between current and next
      current.walls[dir] = false;
      // Find the corresponding wall in the neighbor to remove
      const nextUp = next.up;
      const nextDirs = nextUp ? triDirsUp : triDirsDown;
      // Find which direction points back to current
      for (let nextDir = 0; nextDir < 3; nextDir++) {
        const ndx = nextDirs[nextDir][0];
        const ndy = nextDirs[nextDir][1];
        if (next.x + ndx === x && next.y + ndy === y) {
          next.walls[nextDir] = false;
          break;
        }
      }
      next.visited = true;
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  return grid;
}

// Prim's for triangle maze
function generateTriMazePrims(width: number, height: number): TriCell[][] {
  const grid = createTriGrid(width, height);
  const walls: [number, number, number][] = [];
  const start = grid[0][0];
  start.visited = true;
  
  // Add all walls of the starting cell
  const dirs = start.up ? triDirsUp : triDirsDown;
  for (let dir = 0; dir < 3; dir++) {
    const nx = start.x + dirs[dir][0];
    const ny = start.y + dirs[dir][1];
    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
      walls.push([start.y, start.x, dir]);
    }
  }
  
  while (walls.length > 0) {
    const idx = Math.floor(Math.random() * walls.length);
    const [y, x, dir] = walls.splice(idx, 1)[0];
    const cell = grid[y][x];
    const dirs = cell.up ? triDirsUp : triDirsDown;
    const nx = x + dirs[dir][0];
    const ny = y + dirs[dir][1];
    if (ny < 0 || ny >= height || nx < 0 || nx >= width) continue;
    const neighbor = grid[ny][nx];
    if (!neighbor.visited) {
      // Remove wall between cell and neighbor
      cell.walls[dir] = false;
      // Find the corresponding wall in the neighbor to remove
      const nextDirs = neighbor.up ? triDirsUp : triDirsDown;
      for (let nextDir = 0; nextDir < 3; nextDir++) {
        const ndx = nextDirs[nextDir][0];
        const ndy = nextDirs[nextDir][1];
        if (neighbor.x + ndx === x && neighbor.y + ndy === y) {
          neighbor.walls[nextDir] = false;
          break;
        }
      }
      neighbor.visited = true;
      
      // Add neighbor's walls to the list
      const ndirs = neighbor.up ? triDirsUp : triDirsDown;
      for (let d = 0; d < 3; d++) {
        const nnx = neighbor.x + ndirs[d][0];
        const nny = neighbor.y + ndirs[d][1];
        if (nny >= 0 && nny < height && nnx >= 0 && nnx < width && !grid[nny][nnx].visited) {
          walls.push([neighbor.y, neighbor.x, d]);
        }
      }
    }
  }
  return grid;
}

const cellSize = 24;

const MazeGeneratorIsland: React.FC = () => {
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(20);
  const [mazeType, setMazeType] = useState<MazeType>('rectangular');
  const [algorithm, setAlgorithm] = useState<Algorithm>('dfs');
  const [maze, setMaze] = useState(() => generateMazeDFS(20, 20));
  const [circularKey, setCircularKey] = useState(0);
  const [hexKey, setHexKey] = useState(0);
  const [triangleKey, setTriangleKey] = useState(0);

  const handleGenerate = () => {
    if (mazeType === 'rectangular') {
      if (algorithm === 'dfs') setMaze(generateMazeDFS(width, height));
      else setMaze(generateMazePrims(width, height));
    } else if (mazeType === 'circular') {
      setCircularKey(k => k + 1);
    } else if (mazeType === 'hexagonal') {
      setHexKey(k => k + 1);
    } else if (mazeType === 'triangular') {
      setTriangleKey(k => k + 1);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Maze Generator</h3>
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px'
      }}>
        {/* First row - Maze Type and Algorithm */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          maxWidth: 600
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            width: '100%'
          }}>
            <label style={{ 
              fontWeight: 700, 
              fontSize: 16, 
              color: '#222', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f3f6fa', 
              borderRadius: 6, 
              padding: '8px 16px',
              width: '100%',
              maxWidth: 300
            }}>
              Maze Type:
              <select
                value={mazeType}
                onChange={e => setMazeType(e.target.value as MazeType)}
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  padding: '8px 10px',
                  border: '1.5px solid #bbb',
                  borderRadius: 4,
                  outline: 'none',
                  background: '#fff',
                  color: '#222',
                  fontWeight: 'bold',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'border 0.2s',
                  width: '100%'
                }}
                onFocus={e => e.currentTarget.style.border = '1.5px solid #4CAF50'}
                onBlur={e => e.currentTarget.style.border = '1.5px solid #bbb'}
              >
                <option value="rectangular">Rectangular</option>
                <option value="circular">Circular</option>
              </select>
            </label>
            <label style={{ 
              fontWeight: 700, 
              fontSize: 16, 
              color: '#222', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f3f6fa', 
              borderRadius: 6, 
              padding: '8px 16px',
              width: '100%',
              maxWidth: 300
            }}>
              Algorithm:
              <select
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value as Algorithm)}
                style={{
                  marginTop: 8,
                  fontSize: 18,
                  padding: '8px 10px',
                  border: '1.5px solid #bbb',
                  borderRadius: 4,
                  outline: 'none',
                  background: '#fff',
                  color: '#222',
                  fontWeight: 'bold',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  transition: 'border 0.2s',
                  width: '100%'
                }}
                onFocus={e => e.currentTarget.style.border = '1.5px solid #4CAF50'}
                onBlur={e => e.currentTarget.style.border = '1.5px solid #bbb'}
              >
                <option value="dfs">DFS</option>
                <option value="prims">Prim's</option>
              </select>
            </label>
          </div>
        </div>
        
        {/* Second row - Width, Height, and Generate button */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          width: '100%',
          maxWidth: 600
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            width: '100%'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f3f6fa', 
              borderRadius: 6, 
              padding: '8px 16px',
              width: '100%',
              maxWidth: 300
            }}>
              <label style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>
                Width:
              </label>
              <input
                type="number"
                min={4}
                max={32}
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  padding: '8px 10px', 
                  fontSize: 18, 
                  border: '1.5px solid #bbb', 
                  borderRadius: 4, 
                  outline: 'none', 
                  background: '#fff', 
                  color: '#222', 
                  fontWeight: 'bold', 
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)', 
                  transition: 'border 0.2s' 
                }}
                onFocus={e => e.currentTarget.style.border = '1.5px solid #4CAF50'}
                onBlur={e => e.currentTarget.style.border = '1.5px solid #bbb'}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              background: '#f3f6fa', 
              borderRadius: 6, 
              padding: '8px 16px',
              width: '100%',
              maxWidth: 300
            }}>
              <label style={{ fontWeight: 700, fontSize: 18, color: '#222', marginBottom: 8 }}>
                Height:
              </label>
              <input
                type="number"
                min={4}
                max={24}
                value={height}
                onChange={e => setHeight(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  padding: '8px 10px', 
                  fontSize: 18, 
                  border: '1.5px solid #bbb', 
                  borderRadius: 4, 
                  outline: 'none', 
                  background: '#fff', 
                  color: '#222', 
                  fontWeight: 'bold', 
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)', 
                  transition: 'border 0.2s' 
                }}
                onFocus={e => e.currentTarget.style.border = '1.5px solid #4CAF50'}
                onBlur={e => e.currentTarget.style.border = '1.5px solid #bbb'}
              />
            </div>
            <button
              onClick={handleGenerate}
              style={{ 
                width: '100%',
                maxWidth: 300,
                padding: '12px 28px', 
                fontSize: 18, 
                fontWeight: 'bold', 
                background: '#4CAF50', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 6, 
                boxShadow: '0 2px 8px rgba(76,175,80,0.12)', 
                cursor: 'pointer', 
                transition: 'background 0.2s, box-shadow 0.2s', 
                outline: 'none' 
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#45a049')}
              onMouseOut={e => (e.currentTarget.style.background = '#4CAF50')}
              onFocus={e => (e.currentTarget.style.boxShadow = '0 0 0 3px #A5D6A7')}
              onBlur={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(76,175,80,0.12)')}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
      {/* Maze rendering */}
      {mazeType === 'rectangular' ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, padding: '0 16px' }}>
          <div style={{ width: '100%', maxWidth: width * cellSize + 2, overflow: 'auto' }}>
            <svg
              width="100%"
              height={height * cellSize + 2}
              viewBox={`0 0 ${width * cellSize + 2} ${height * cellSize + 2}`}
              style={{ background: "#fff", border: "1px solid #ccc", display: 'block' }}
            >
              {maze.map((row, y) =>
                row.map((cell, x) => {
                  const px = x * cellSize;
                  const py = y * cellSize;
                  const lines = [];
                  if (cell.walls[0]) lines.push(<line key="t" x1={px} y1={py} x2={px + cellSize} y2={py} stroke="#222" strokeWidth={2} />);
                  if (cell.walls[1]) lines.push(<line key="r" x1={px + cellSize} y1={py} x2={px + cellSize} y2={py + cellSize} stroke="#222" strokeWidth={2} />);
                  if (cell.walls[2]) lines.push(<line key="b" x1={px} y1={py + cellSize} x2={px + cellSize} y2={py + cellSize} stroke="#222" strokeWidth={2} />);
                  if (cell.walls[3]) lines.push(<line key="l" x1={px} y1={py} x2={px} y2={py + cellSize} stroke="#222" strokeWidth={2} />);
                  return <g key={x + "," + y}>{lines}</g>;
                })
              )}
            </svg>
          </div>
        </div>
      ) : mazeType === 'circular' ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, padding: '0 16px' }}>
          <div style={{ width: '100%', maxWidth: 600 }}>
            <svg
              key={circularKey}
              width="100%"
              viewBox={`0 0 ${width * cellSize * 2} ${width * cellSize * 2}`}
              style={{ background: "#fff", border: "1px solid #ccc", display: 'block', margin: '0 auto' }}
            >
              {/* Generate and render circular maze on the fly using selected algorithm */}
              {(() => {
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
                          stroke="#222"
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
                          stroke="#222"
                          strokeWidth={2}
                        />
                      );
                    }
                  }
                }
                // Draw outer circle
                elements.push(
                  <circle
                    key="outer"
                    cx={cx}
                    cy={cy}
                    r={rings * rStep}
                    stroke="#222"
                    strokeWidth={2}
                    fill="none"
                  />
                );
                // Draw center
                elements.push(
                  <circle
                    key="center"
                    cx={cx}
                    cy={cy}
                    r={rStep / 3}
                    fill="#2196F3"
                    stroke="#222"
                    strokeWidth={1}
                  />
                );
                return elements;
              })()}
            </svg>
          </div>
        </div>
      ) : mazeType === 'hexagonal' ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, padding: '0 16px' }}>
          {(() => {
            const hexW = cellSize * Math.sqrt(3);
            const svgWidth = hexW * width + hexW / 2;
            const svgHeight = cellSize * 1.5 * (height - 1) + cellSize * 2;
            return (
              <div style={{ width: '100%', maxWidth: svgWidth }}>
                <svg
                  key={hexKey}
                  width="100%"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  style={{ background: "#fff", border: "1px solid #ccc", display: 'block', margin: '0 auto' }}
                >
                  {/* Generate and render hexagonal maze on the fly using selected algorithm */}
                  {(() => {
                    const grid = algorithm === 'dfs'
                      ? generateHexMazeDFS(width, height)
                      : generateHexMazePrims(width, height);
                    const elements = [];
                    const cx = hexW / 2;
                    const cy = cellSize;
                    const drawnWalls = new Set<string>();
                    
                    for (let r = 0; r < height; r++) {
                      for (let q = 0; q < width; q++) {
                        const cell = grid[r][q];
                        const x = q * hexW + (r % 2) * (hexW / 2);
                        const y = r * (cellSize * 1.5);
                        // Calculate hex corners
                        const corners = Array.from({ length: 6 }, (_, i) => {
                          const angle = Math.PI / 3 * i;
                          return [x + cx + cellSize * Math.cos(angle), y + cy + cellSize * Math.sin(angle)];
                        });
                        // Draw walls only if not already drawn
                        for (let i = 0; i < 6; i++) {
                          if (cell.walls[i]) {
                            // Create wall key based on cell position and wall direction
                            const wallKey = `${r},${q},${i}`;
                            // Check if this wall should be drawn (only draw from one cell)
                            let shouldDraw = true;
                            const dq = hexDirs[i][0];
                            const dr = hexDirs[i][1];
                            const nq = q + dq;
                            const nr = r + dr;
                            // If neighbor exists and has lower coordinates, let neighbor draw the wall
                            if (nr >= 0 && nr < height && nq >= 0 && nq < width) {
                              if (nr < r || (nr === r && nq < q)) {
                                shouldDraw = false;
                              }
                            }
                            if (shouldDraw && !drawnWalls.has(wallKey)) {
                              drawnWalls.add(wallKey);
                              const [x1, y1] = corners[i];
                              const [x2, y2] = corners[(i + 1) % 6];
                              elements.push(
                                <line
                                  key={`wall-${r},${q},${i}`}
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke="#222"
                                  strokeWidth={2}
                                />
                              );
                            }
                          }
                        }
                      }
                    }
                    return elements;
                  })()}
                </svg>
              </div>
            );
          })()}
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24, padding: '0 16px' }}>
          {(() => {
            const triW = cellSize;
            const triH = cellSize * Math.sqrt(3) / 2;
            const svgWidth = width * triW;
            const svgHeight = height * triW * Math.sqrt(3) / 2;
            return (
              <div style={{ width: '100%', maxWidth: svgWidth }}>
                <svg
                  key={triangleKey}
                  width="100%"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  style={{ background: "#fff", border: "1px solid #ccc", display: 'block', margin: '0 auto' }}
                >
                  {/* Generate and render triangular maze on the fly using selected algorithm */}
                  {(() => {
                    const grid = algorithm === 'dfs'
                      ? generateTriMazeDFS(width, height)
                      : generateTriMazePrims(width, height);
                    const elements = [];
                    const drawnWalls = new Set<string>();
                    
                    for (let y = 0; y < height; y++) {
                      for (let x = 0; x < width; x++) {
                        const cell = grid[y][x];
                        const cx = x * triW + triW / 2;
                        const cy = y * triW * Math.sqrt(3) / 2 + triW / 2;
                        let points;
                        if (cell.up) {
                          points = [
                            [cx, cy - triW / 2],
                            [cx - triW / 2, cy + triW / 2],
                            [cx + triW / 2, cy + triW / 2],
                          ];
                        } else {
                          points = [
                            [cx, cy + triW / 2],
                            [cx - triW / 2, cy - triW / 2],
                            [cx + triW / 2, cy - triW / 2],
                          ];
                        }
                        // Draw walls only if not already drawn
                        for (let i = 0; i < 3; i++) {
                          if (cell.walls[i]) {
                            // Create wall key based on cell position and wall direction
                            const wallKey = `${y},${x},${i}`;
                            // Check if this wall should be drawn (only draw from one cell)
                            let shouldDraw = true;
                            const dirs = cell.up ? triDirsUp : triDirsDown;
                            const dx = dirs[i][0];
                            const dy = dirs[i][1];
                            const nx = x + dx;
                            const ny = y + dy;
                            // If neighbor exists and has lower coordinates, let neighbor draw the wall
                            if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                              if (ny < y || (ny === y && nx < x)) {
                                shouldDraw = false;
                              }
                            }
                            if (shouldDraw && !drawnWalls.has(wallKey)) {
                              drawnWalls.add(wallKey);
                              const [x1, y1] = points[i];
                              const [x2, y2] = points[(i + 1) % 3];
                              elements.push(
                                <line
                                  key={`wall-${y},${x},${i}`}
                                  x1={x1}
                                  y1={y1}
                                  x2={x2}
                                  y2={y2}
                                  stroke="#222"
                                  strokeWidth={2}
                                />
                              );
                            }
                          }
                        }
                      }
                    }
                    return elements;
                  })()}
                </svg>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MazeGeneratorIsland; 