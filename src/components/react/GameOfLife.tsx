import * as React from "react";
import { useState, useRef, useCallback, useMemo } from "react";

type CellColor = {
  alive: string;
  dead: string;
};

type Dimensions = {
  rows: number;
  cols: number;
};

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const cellSize = 20;

const GameOfLife: React.FC = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({ rows: 15, cols: 20 });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [generations, setGenerations] = useState(0);
  const [cellColors, setCellColors] = useState<CellColor>({
    alive: 'var(--color-accent)',
    dead: 'var(--color-background)'
  });
  const [hasRandomized, setHasRandomized] = useState(false);

  const generateEmptyGrid = useCallback(() => {
    return Array.from({ length: dimensions.rows }, () =>
      Array(dimensions.cols).fill(0)
    );
  }, [dimensions]);

  const [grid, setGrid] = useState(() => generateEmptyGrid());

  const runningRef = useRef(running);
  runningRef.current = running;

  const patterns = useMemo(() => ({
    glider: () => {
      const grid = generateEmptyGrid();
      if (dimensions.rows > 3 && dimensions.cols > 3) {
        grid[1][2] = 1;
        grid[2][3] = 1;
        grid[3][1] = 1;
        grid[3][2] = 1;
        grid[3][3] = 1;
      }
      return grid;
    },

    blinker: () => {
      const grid = generateEmptyGrid();
      const centerRow = Math.floor(dimensions.rows / 2);
      const centerCol = Math.floor(dimensions.cols / 2);
      if (centerRow > 0 && centerCol > 0 && centerRow < dimensions.rows - 1 && centerCol < dimensions.cols - 1) {
        grid[centerRow][centerCol - 1] = 1;
        grid[centerRow][centerCol] = 1;
        grid[centerRow][centerCol + 1] = 1;
      }
      return grid;
    },

    block: () => {
      const grid = generateEmptyGrid();
      const centerRow = Math.floor(dimensions.rows / 2);
      const centerCol = Math.floor(dimensions.cols / 2);
      if (centerRow > 0 && centerCol > 0 && centerRow < dimensions.rows - 1 && centerCol < dimensions.cols - 1) {
        grid[centerRow][centerCol] = 1;
        grid[centerRow][centerCol + 1] = 1;
        grid[centerRow + 1][centerCol] = 1;
        grid[centerRow + 1][centerCol + 1] = 1;
      }
      return grid;
    },

    pulsar: () => {
      const grid = generateEmptyGrid();
      const centerRow = Math.floor(dimensions.rows / 2) - 3;
      const centerCol = Math.floor(dimensions.cols / 2) - 6;

      const addBlock = (startRow: number, startCol: number) => {
        for (let i = 0; i < 3; i++) {
          if (grid[startRow]?.[startCol + i] !== undefined) {
            grid[startRow][startCol + i] = 1;
          }
          if (grid[startRow + 5]?.[startCol + i] !== undefined) {
            grid[startRow + 5][startCol + i] = 1;
          }
        }
      };

      // Create the horizontal lines
      for (let i = 0; i < 6; i += 5) {
        addBlock(centerRow + i, centerCol + 2);
        addBlock(centerRow + i, centerCol + 8);
      }

      // Create the vertical lines
      for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 3; col++) {
          if (grid[centerRow + row]?.[centerCol + 2 + col] === 1) {
            if (grid[centerRow - 2 + col]?.[centerCol + row + 2] !== undefined) {
              grid[centerRow - 2 + col][centerCol + row + 2] = 1;
            }
            if (grid[centerRow - 2 + col]?.[centerCol + row + 8] !== undefined) {
              grid[centerRow - 2 + col][centerCol + row + 8] = 1;
            }
            if (grid[centerRow + 8 + col]?.[centerCol + row + 2] !== undefined) {
              grid[centerRow + 8 + col][centerCol + row + 2] = 1;
            }
            if (grid[centerRow + 8 + col]?.[centerCol + row + 8] !== undefined) {
              grid[centerRow + 8 + col][centerCol + row + 8] = 1;
            }
          }
        }
      }

      return grid;
    }
  }), [dimensions, generateEmptyGrid]);

  const randomGrid = useCallback(() => {
    return Array.from({ length: dimensions.rows }, () =>
      Array.from({ length: dimensions.cols }, () => (Math.random() > 0.7 ? 1 : 0))
    );
  }, [dimensions]);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    setGrid((g) => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;
            if (
              newI >= 0 &&
              newI < dimensions.rows &&
              newJ >= 0 &&
              newJ < dimensions.cols &&
              g[newI]?.[newJ] !== undefined
            ) {
              neighbors += g[newI][newJ];
            }
          });
          if (cell === 1 && (neighbors < 2 || neighbors > 3)) return 0;
          if (cell === 0 && neighbors === 3) return 1;
          return cell;
        })
      );
      setGenerations(gen => gen + 1);
      return newGrid;
    });
    setTimeout(runSimulation, speed);
  }, [speed, dimensions]);

  const handleGridSizeChange = (rows: number, cols: number) => {
    setDimensions({ rows, cols });
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(0)));
    setGenerations(0);
  };

  const handleClearGrid = () => {
    setGrid(generateEmptyGrid());
    setGenerations(0);
    setRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 bg-background rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-accent">Conway's Game of Life</h3>
      {/* Controls */}
      <div className="flex flex-col items-center gap-4 w-full mb-6">
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <button
            onClick={() => {
              setRunning((r) => {
                if (!r) {
                  runningRef.current = true;
                  runSimulation();
                }
                return !r;
              });
            }}
            disabled={!hasRandomized}
            className={`w-28 px-4 py-2 rounded-md font-bold transition-colors text-white shadow ${running ? 'bg-red-500 hover:bg-red-700' : 'bg-accent hover:bg-accent/80'} ${!hasRandomized ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {running ? "Stop" : "Start"}
          </button>
          <button
            onClick={() => {
              handleClearGrid();
              setHasRandomized(false);
            }}
            className="w-28 px-4 py-2 rounded-md font-bold transition-colors bg-muted text-foreground hover:bg-muted/80 shadow"
          >
            Clear
          </button>
          <button
            onClick={() => {
              setGrid(randomGrid());
              setHasRandomized(true);
            }}
            className="w-28 px-4 py-2 rounded-md font-bold transition-colors border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-500 dark:hover:bg-gray-600 shadow"
          >
            Randomize
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Speed:</span>
            <button
              onClick={() => setSpeed(300)}
              className={`px-3 py-1 rounded font-bold transition-colors text-foreground w-20 ${speed === 300 ? 'bg-muted/80' : 'bg-muted hover:bg-muted/60'}`}
            >
              Slow
            </button>
            <button
              onClick={() => setSpeed(200)}
              className={`px-3 py-1 rounded font-bold transition-colors text-foreground w-20 ${speed === 200 ? 'bg-accent' : 'bg-muted hover:bg-muted/60'}`}
            >
              Medium
            </button>
            <button
              onClick={() => setSpeed(100)}
              className={`px-3 py-1 rounded font-bold transition-colors text-foreground w-20 ${speed === 100 ? 'bg-blue-600' : 'bg-muted hover:bg-muted/60'}`}
            >
              Fast
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Grid Size:</span>
            <select
              value={`${dimensions.rows}x${dimensions.cols}`}
              onChange={e => {
                const [rows, cols] = e.target.value.split('x').map(Number);
                handleGridSizeChange(rows, cols);
              }}
              className="px-2 py-1 rounded border border-gray-400 bg-background text-foreground"
            >
              <option value="15x20">15x20 (Default)</option>
              <option value="20x30">20x30 (Large)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground px-3 py-1 bg-muted rounded shadow">Generation: {generations}</span>
          </div>
        </div>
      </div>
      {/* Game Grid */}
      <div
        className="grid border border-border rounded bg-background"
        style={{
          gridTemplateColumns: `repeat(${dimensions.cols}, ${cellSize}px)`
        }}
      >
        {grid.map((row, i) =>
          row.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = grid.map((row, rowIdx) =>
                  row.map((cell, colIdx) =>
                    rowIdx === i && colIdx === j ? (cell ? 0 : 1) : cell
                  )
                );
                setGrid(newGrid);
              }}
              className="transition-colors cursor-pointer border border-border"
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[i][j] ? cellColors.alive : cellColors.dead,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameOfLife;