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

const buttonStyle = {
  padding: "8px 16px",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "background-color 0.2s",
  marginRight: 8
};

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
    <div style={{ textAlign: "center" }}>
      <h3>Conway's Game of Life</h3>
      <div style={{ marginBottom: 16 }}>
        <div>
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
            style={{
              ...buttonStyle,
              backgroundColor: running ? "#f44336" : "var(--color-accent)",
              width: "100px"
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = running ? "#d32f2f" : "var(--color-accent)"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = running ? "#f44336" : "var(--color-accent)"}
          >
            {running ? "Stop" : "Start"}
          </button>
          <button
            onClick={handleClearGrid}
            style={{ ...buttonStyle, backgroundColor: "var(--color-muted)", width: "100px", color: "var(--color-foreground)" }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#bfc3d9"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "var(--color-muted)"}
          >
            Clear
          </button>
          <button
            onClick={() => setGrid(randomGrid())}
            style={{ ...buttonStyle, backgroundColor: "var(--color-border)", width: "100px", color: "var(--color-foreground)" }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#e0e0e0"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "var(--color-border)"}
          >
            Randomize
          </button>
        </div>
      </div>
      <div style={{
        marginBottom: 16,
        padding: "12px",
        backgroundColor: "var(--color-muted)",
        borderRadius: "4px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)"
      }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{
            marginRight: 16,
            display: "inline-block"
          }}>
            <span style={{
              marginRight: 8,
              fontWeight: "bold",
              color: "var(--color-foreground)"
            }}>
              Speed:
            </span>
            <button
              onClick={() => setSpeed(300)}
              style={{
                ...buttonStyle,
                backgroundColor: speed === 300 ? "#bfc3d9" : "var(--color-muted)",
                color: "var(--color-foreground)",
                padding: "4px 8px"
              }}
            >
              Slow
            </button>
            <button
              onClick={() => setSpeed(200)}
              style={{
                ...buttonStyle,
                backgroundColor: speed === 200 ? "var(--color-accent)" : "var(--color-muted)",
                color: "var(--color-foreground)",
                padding: "4px 8px"
              }}
            >
              Medium
            </button>
            <button
              onClick={() => setSpeed(100)}
              style={{
                ...buttonStyle,
                backgroundColor: speed === 100 ? "#617bff" : "var(--color-muted)",
                color: "var(--color-foreground)",
                padding: "4px 8px"
              }}
            >
              Fast
            </button>
          </div>
          <span style={{
            marginLeft: 8,
            fontSize: "1.1em",
            fontWeight: "bold",
            color: "var(--color-foreground)",
            padding: "4px 12px",
            backgroundColor: "var(--color-muted)",
            borderRadius: "4px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
          }}>
            Generation: {generations}
          </span>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{
            marginRight: 16,
            fontWeight: "bold",
            color: "var(--color-foreground)"
          }}>
            Grid Size:
            <select
              value={`${dimensions.rows}x${dimensions.cols}`}
              onChange={e => {
                const [rows, cols] = e.target.value.split('x').map(Number);
                handleGridSizeChange(rows, cols);
              }}
              style={{
                marginLeft: 8,
                padding: "4px 8px",
                borderRadius: "4px",
                border: "1px solid #999",
                backgroundColor: "var(--color-background)",
                color: "var(--color-foreground)"
              }}
            >
              <option value="15x20">15x20 (Default)</option>
              <option value="20x30">20x30 (Large)</option>
            </select>
          </label>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${dimensions.cols}, ${cellSize}px)`,
          justifyContent: "center",
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
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: grid[i][j] ? cellColors.alive : cellColors.dead,
                border: "solid 1px var(--color-border)",
                cursor: "pointer",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameOfLife;