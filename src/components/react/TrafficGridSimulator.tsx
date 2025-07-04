import React, { useEffect, useRef, useState } from 'react';

// --- Constants and Types ---
const GRID_SIZE = 15; // 15x15 grid
const ROAD_ROW = 7; // Center row for EW
const ROAD_COL = 7; // Center col for NS
const INTERSECTION_SIZE = 3; // 3x3 intersection
const TICK_INTERVAL = 300; // ms

const DIRS = {
  NS: { dr: 1, dc: 0 }, // down
  EW: { dr: 0, dc: 1 }, // right
} as const;

type Direction = keyof typeof DIRS;
type LightState = 'green' | 'yellow' | 'red';
type Cell = null | { type: 'car', dir: Direction, id: number };
type CarAnim = {
  id: number;
  from: [number, number];
  to: [number, number];
  dir: Direction;
};

const lightStates: { ns: LightState; ew: LightState }[] = [
  { ns: 'green', ew: 'red' },
  { ns: 'yellow', ew: 'red' },
  { ns: 'red', ew: 'green' },
  { ns: 'red', ew: 'yellow' },
];
const stateDurations = [20, 5, 20, 5]; // ticks

// --- Utility Functions ---
function createEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function isIntersection(r: number, c: number) {
  return (
    r >= ROAD_ROW - 1 && r <= ROAD_ROW + 1 &&
    c >= ROAD_COL - 1 && c <= ROAD_COL + 1
  );
}

// --- Car Spawning Logic ---
function spawnCars(newGrid: Cell[][], tick: number, carIdRef: React.MutableRefObject<number>) {
  if (tick % 3 !== 0) return;
  if (!newGrid[0][ROAD_COL] && Math.random() < 0.2) newGrid[0][ROAD_COL] = { type: 'car', dir: 'NS', id: carIdRef.current++ };
  if (!newGrid[ROAD_ROW][0] && Math.random() < 0.2) newGrid[ROAD_ROW][0] = { type: 'car', dir: 'EW', id: carIdRef.current++ };
}

// --- Car Movement Logic ---
function moveCars(oldGrid: Cell[][], lights: { ns: LightState; ew: LightState }): { newGrid: Cell[][]; moves: CarAnim[] } {
  let newGrid = createEmptyGrid();
  let moves: CarAnim[] = [];
  // Move NS cars (bottom to top to avoid overwrite)
  for (let r = GRID_SIZE - 1; r >= 0; r--) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = oldGrid[r][c];
      if (cell && cell.type === 'car' && cell.dir === 'NS') {
        let nextR = r + DIRS.NS.dr;
        let nextC = c + DIRS.NS.dc;
        // Check intersection entry
        if (r === ROAD_ROW - 2 && c === ROAD_COL && lights.ns !== 'green') {
          newGrid[r][c] = cell;
          moves.push({ id: cell.id, from: [r, c], to: [r, c], dir: 'NS' });
          continue;
        }
        // Move if next cell is empty and on the road
        if (
          nextR < GRID_SIZE &&
          (nextC === ROAD_COL || isIntersection(nextR, nextC)) &&
          !oldGrid[nextR][nextC] && !newGrid[nextR][nextC]
        ) {
          newGrid[nextR][nextC] = cell;
          moves.push({ id: cell.id, from: [r, c], to: [nextR, nextC], dir: 'NS' });
        } else if (r < GRID_SIZE - 1) {
          newGrid[r][c] = cell;
          moves.push({ id: cell.id, from: [r, c], to: [r, c], dir: 'NS' });
        }
      }
    }
  }
  // Move EW cars (right to left to avoid overwrite)
  for (let c = GRID_SIZE - 1; c >= 0; c--) {
    for (let r = 0; r < GRID_SIZE; r++) {
      const cell = oldGrid[r][c];
      if (cell && cell.type === 'car' && cell.dir === 'EW') {
        let nextR = r + DIRS.EW.dr;
        let nextC = c + DIRS.EW.dc;
        // Check intersection entry
        if (r === ROAD_ROW && c === ROAD_COL - 2 && lights.ew !== 'green') {
          newGrid[r][c] = cell;
          moves.push({ id: cell.id, from: [r, c], to: [r, c], dir: 'EW' });
          continue;
        }
        // Move if next cell is empty and on the road
        if (
          nextC < GRID_SIZE &&
          (nextR === ROAD_ROW || isIntersection(nextR, nextC)) &&
          !oldGrid[nextR][nextC] && !newGrid[nextR][nextC]
        ) {
          newGrid[r][nextC] = cell;
          moves.push({ id: cell.id, from: [r, c], to: [r, nextC], dir: 'EW' });
        } else if (c < GRID_SIZE - 1) {
          newGrid[r][c] = cell;
          moves.push({ id: cell.id, from: [r, c], to: [r, c], dir: 'EW' });
        }
      }
    }
  }
  return { newGrid, moves };
}

// --- Animation Hook ---
function useCarAnimations(carAnims: CarAnim[], onDone: () => void) {
  const [animProgress, setAnimProgress] = useState(1);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const DURATION = 200; // ms, match TICK_INTERVAL for smoothness

  useEffect(() => {
    setAnimProgress(0);
    startTimeRef.current = performance.now();
  }, [carAnims]);

  useEffect(() => {
    let running = true;
    function animate(now: number) {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(1, elapsed / DURATION);
      setAnimProgress(progress);
      if (running && progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else if (progress >= 1) {
        onDone();
      }
    }
    if (animProgress < 1) {
      animFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animProgress, carAnims]);
  return animProgress;
}

// --- Main Component ---
function TrafficGridSimulator() {
  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [carAnims, setCarAnims] = useState<CarAnim[]>([]);
  const [tick, setTick] = useState(0);
  const [lightIdx, setLightIdx] = useState(0);
  const lightTick = useRef(0);
  const spawnTick = useRef(0);
  const carIdRef = useRef(1);
  const pendingMoveRef = useRef<{ newGrid: Cell[][]; moves: CarAnim[] } | null>(null);
  const pendingLightIdxRef = useRef<number>(0);
  const pendingSpawnTickRef = useRef<number>(0);
  const pendingLightTickRef = useRef<number>(0);

  // Prepare the next move and start animation
  useEffect(() => {
    // Only prepare the next move if not already pending
    if (!pendingMoveRef.current) {
      let lights = lightStates[lightIdx];
      let nextLightTick = lightTick.current + 1;
      let nextSpawnTick = spawnTick.current + 1;
      let nextLightIdx = lightIdx;
      if (nextLightTick >= stateDurations[lightIdx]) {
        nextLightIdx = (lightIdx + 1) % lightStates.length;
        nextLightTick = 0;
      }
      // Compute the next grid and car moves
      const { newGrid, moves } = moveCars(grid, lights);
      spawnCars(newGrid, nextSpawnTick, carIdRef);
      pendingMoveRef.current = { newGrid, moves };
      pendingLightIdxRef.current = nextLightIdx;
      pendingSpawnTickRef.current = nextSpawnTick;
      pendingLightTickRef.current = nextLightTick;
      setCarAnims(moves);
    }
  }, [tick, grid, lightIdx]);

  // Animation progress
  const animProgress = useCarAnimations(carAnims, () => {
    // After animation completes, update the grid and state, then trigger the next tick
    if (pendingMoveRef.current) {
      setGrid(pendingMoveRef.current.newGrid);
      setCarAnims([]); // Clear anims until next tick
      lightTick.current = pendingLightTickRef.current;
      spawnTick.current = pendingSpawnTickRef.current;
      setLightIdx(pendingLightIdxRef.current);
      pendingMoveRef.current = null;
      setTick((t) => t + 1);
    }
  });

  // Start the animation loop
  useEffect(() => {
    if (tick === 0) setTick(1); // Kick off the first tick
  }, [tick]);

  // --- Render ---
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
      <svg width={400} height={400} viewBox={`0 0 ${GRID_SIZE * 20} ${GRID_SIZE * 20}`}
        style={{ background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)', borderRadius: 18, boxShadow: '0 4px 24px #0003', display: 'block', maxWidth: '100%' }}>
        {/* Draw roads */}
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <rect key={`vroad${i}`} x={ROAD_COL * 20} y={i * 20} width={20} height={20} fill="#222" />
        ))}
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <rect key={`hroad${i}`} x={i * 20} y={ROAD_ROW * 20} width={20} height={20} fill="#222" />
        ))}
        {/* Draw intersection box with shadow */}
        <rect x={(ROAD_COL - 1) * 20} y={(ROAD_ROW - 1) * 20} width={60} height={60} fill="#333" rx={12} style={{ filter: 'drop-shadow(0 2px 8px #0006)' }} />
        {/* Draw cars with shadow and highlight, using animation */}
        {carAnims.map(car => {
          const [r0, c0] = car.from;
          const [r1, c1] = car.to;
          // Ease-in-out for smoother animation
          const eased = 0.5 - 0.5 * Math.cos(Math.PI * animProgress);
          const r = r0 + (r1 - r0) * eased;
          const c = c0 + (c1 - c0) * eased;
          return (
            <rect key={car.id} x={c * 20 + 3} y={r * 20 + 3} width={14} height={14} rx={6} fill={car.dir === 'NS' ? '#8e24aa' : '#fb8c00'} stroke="#fff" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 2px 4px #0005)' }} />
          );
        })}
        {/* Draw stop lines */}
        {/* NS */}
        <rect x={ROAD_COL * 20} y={(ROAD_ROW - 2) * 20 + 16} width={20} height={4} fill="#fff" rx={2} />
        {/* EW */}
        <rect y={ROAD_ROW * 20} x={(ROAD_COL - 2) * 20 + 16} height={20} width={4} fill="#fff" rx={2} />
        {/* Traffic lights (glowing circles) */}
        {/* NS */}
        <circle cx={ROAD_COL * 20 - 8} cy={(ROAD_ROW - 2) * 20 + 10} r={8} fill={lightStates[lightIdx].ns === 'green' ? 'green' : lightStates[lightIdx].ns === 'yellow' ? 'yellow' : 'red'} stroke="#111" strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${lightStates[lightIdx].ns})` }} />
        {/* EW */}
        <circle cx={(ROAD_COL - 2) * 20 + 10} cy={ROAD_ROW * 20 - 8} r={8} fill={lightStates[lightIdx].ew === 'green' ? 'green' : lightStates[lightIdx].ew === 'yellow' ? 'yellow' : 'red'} stroke="#111" strokeWidth={2} style={{ filter: `drop-shadow(0 0 8px ${lightStates[lightIdx].ew})` }} />
      </svg>
    </div>
  );
}

export default TrafficGridSimulator; 