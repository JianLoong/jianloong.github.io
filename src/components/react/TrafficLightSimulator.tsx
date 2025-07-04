import React, { useState, useEffect, useRef } from 'react';

// --- Constants & Types ---
const lightStates = [
  { ns: 'green', ew: 'red' },
  { ns: 'yellow', ew: 'red' },
  { ns: 'red', ew: 'green' },
  { ns: 'red', ew: 'yellow' },
];
const stateDurations = [3000, 1000, 3000, 1000];
const CAR_LENGTH = 24;
const ROAD_LENGTH = 300;
const INTERSECTION_SIZE = 80;
const CAR_SPEED = 8.0;
const SPAWN_INTERVAL = 800;
const STOP_LINE_OFFSET = 24;
const SVG_SIZE = 600;
const CENTER = SVG_SIZE / 2;
const ROAD_W = 90;
const INTERSECTION = 120;
const MAX_CARS_PER_DIRECTION = 6;
const MIN_GAP = 12;

type Car = {
  id: number;
  dir: 'ns' | 'ew';
  pos: number;
};

// --- Utility Functions ---
function getInitialCars(): Car[] {
  return [];
}

function isCarInIntersection(car: Car, center: number): boolean {
  if (car.dir === 'ns') {
    const y = center - ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 + car.pos;
    return (
      y + CAR_LENGTH > center - INTERSECTION_SIZE / 2 &&
      y < center + INTERSECTION_SIZE / 2
    );
  } else {
    const x = center - ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 + car.pos;
    return (
      x + CAR_LENGTH > center - INTERSECTION_SIZE / 2 &&
      x < center + INTERSECTION_SIZE / 2
    );
  }
}

function canMove(car: Car, idx: number, carsInDir: Car[], state: number): boolean {
  // 1. Check for car ahead (no overlap, maintain gap)
  if (idx > 0) {
    const carAhead = carsInDir[idx - 1];
    if (carAhead.pos - car.pos < CAR_LENGTH + MIN_GAP) {
      return false;
    }
  }
  // 2. Approaching intersection: stop if red, unless already in intersection
  const intersectionStart = 0;
  const intersectionEnd = INTERSECTION_SIZE;
  const carFront = car.pos + CAR_LENGTH;
  const inIntersection = isCarInIntersection(car, CENTER);
  let light = car.dir === 'ns' ? lightStates[state].ns : lightStates[state].ew;
  // If car is before stopping line
  const stopLine = intersectionStart - STOP_LINE_OFFSET;
  if (carFront < stopLine) return true;
  // If car's front is past the stop line but not yet in the intersection
  if (carFront >= stopLine && carFront < intersectionStart) {
    if (light === 'green') return true;
    if (light === 'yellow' && carFront - intersectionStart < CAR_LENGTH + 4) return true;
    return false;
  }
  // If at intersection
  if (carFront >= intersectionStart && carFront < intersectionEnd) {
    const anyCarInIntersection = carsInDir.some((otherCar, otherIdx) =>
      otherIdx !== idx && isCarInIntersection(otherCar, CENTER)
    );
    if (anyCarInIntersection) return false;
    if (light === 'green') {
      const intersectionExit = intersectionEnd;
      let canClear = true;
      if (idx > 0) {
        const carAhead = carsInDir[idx - 1];
        const myExitPos = car.pos + (intersectionExit - intersectionStart) + CAR_LENGTH;
        const carAheadRear = carAhead.pos;
        if (myExitPos + MIN_GAP > carAheadRear) {
          canClear = false;
        }
      }
      if (!canClear) return false;
      return true;
    }
    if (light === 'yellow') {
      if (carFront - intersectionStart < CAR_LENGTH + 4) {
        const intersectionExit = intersectionEnd;
        let canClear = true;
        if (idx > 0) {
          const carAhead = carsInDir[idx - 1];
          const myExitPos = car.pos + (intersectionExit - intersectionStart) + CAR_LENGTH;
          const carAheadRear = carAhead.pos;
          if (myExitPos + MIN_GAP > carAheadRear) {
            canClear = false;
          }
        }
        if (!canClear) return false;
        return true;
      }
      return false;
    }
    return false;
  }
  // After intersection
  return true;
}

// Helper: Should clamp at stop line?
function shouldClampAtStopLine(car: Car, carFront: number, stopLine: number, intersectionStart: number, state: number): boolean {
  let light = car.dir === 'ns' ? lightStates[state].ns : lightStates[state].ew;
  return (
    carFront < stopLine &&
    carFront + CAR_SPEED >= stopLine &&
    !(light === 'green' || (light === 'yellow' && carFront - intersectionStart < CAR_LENGTH + 4))
  );
}

// Helper: Get clamped position at stop line
function getClampedStopLinePos(stopLine: number): number {
  return stopLine - CAR_LENGTH;
}

function moveCars(carsInDir: Car[], state: number): Car[] {
  return carsInDir.map((car: Car, idx: number) => {
    // Predict next position
    const nextPos = car.pos + CAR_SPEED;
    const intersectionStart = 0;
    const stopLine = intersectionStart - STOP_LINE_OFFSET;
    const carFront = car.pos + CAR_LENGTH;
    // Clamp at stop line if about to cross on red/yellow
    if (shouldClampAtStopLine(car, carFront, stopLine, intersectionStart, state)) {
      return { ...car, pos: getClampedStopLinePos(stopLine) };
    }
    // Normal movement
    if (canMove(car, idx, carsInDir, state)) {
      return { ...car, pos: car.pos + CAR_SPEED };
    } else {
      return car;
    }
  });
}

function filterCars(car: Car): boolean {
  if (car.dir === 'ns' && (CENTER - ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 + car.pos) > SVG_SIZE) return false;
  if (car.dir === 'ew' && (CENTER - ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 + car.pos) > SVG_SIZE) return false;
  return true;
}

// --- SVG Helpers ---
function renderRoads() {
  return (
    <>
      {/* Grass background */}
      <rect x={0} y={0} width={SVG_SIZE} height={SVG_SIZE} fill="#7cb342" />
      {/* Vertical road */}
      <rect x={CENTER - ROAD_W / 2} y={0} width={ROAD_W} height={SVG_SIZE} fill="#222" />
      {/* Horizontal road */}
      <rect x={0} y={CENTER - ROAD_W / 2} width={SVG_SIZE} height={ROAD_W} fill="#222" />
      {/* Solid white lines at road edges (vertical) */}
      <line x1={CENTER - ROAD_W / 2 + 6} y1={0} x2={CENTER - ROAD_W / 2 + 6} y2={SVG_SIZE} stroke="#fff" strokeWidth={2} />
      <line x1={CENTER + ROAD_W / 2 - 6} y1={0} x2={CENTER + ROAD_W / 2 - 6} y2={SVG_SIZE} stroke="#fff" strokeWidth={2} />
      {/* Solid white lines at road edges (horizontal) */}
      <line x1={0} y1={CENTER - ROAD_W / 2 + 6} x2={SVG_SIZE} y2={CENTER - ROAD_W / 2 + 6} stroke="#fff" strokeWidth={2} />
      <line x1={0} y1={CENTER + ROAD_W / 2 - 6} x2={SVG_SIZE} y2={CENTER + ROAD_W / 2 - 6} stroke="#fff" strokeWidth={2} />
    </>
  );
}

function renderIntersection() {
  return (
    <>
      <rect x={CENTER - INTERSECTION / 2} y={CENTER - INTERSECTION / 2} width={INTERSECTION} height={INTERSECTION} fill="#333" rx={10} />
      <rect x={CENTER - INTERSECTION / 2} y={CENTER - INTERSECTION / 2} width={INTERSECTION} height={INTERSECTION} fill="none" stroke="#fff" strokeDasharray="8 6" strokeWidth={2} />
    </>
  );
}

function renderStopLines() {
  return (
    <>
      {/* NS */}
      <rect x={CENTER - ROAD_W / 2} y={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 4} width={ROAD_W} height={4} fill="#f00" />
      {/* EW */}
      <rect y={CENTER - ROAD_W / 2} x={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 4} height={ROAD_W} width={4} fill="#f00" />
      {/* Optional white lines for reference */}
      <rect x={CENTER - ROAD_W / 2} y={CENTER - INTERSECTION / 2 - 4} width={ROAD_W} height={4} fill="#fff" />
      <rect y={CENTER - ROAD_W / 2} x={CENTER - INTERSECTION / 2 - 4} height={ROAD_W} width={4} fill="#fff" />
    </>
  );
}

function renderTrafficLights(state: number) {
  return (
    <>
      {/* NS */}
      <g>
        <circle cx={CENTER - ROAD_W / 2 - 18} cy={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 38} r={10} fill={lightStates[state].ns === 'red' ? 'red' : '#888'} stroke="#111" />
        <circle cx={CENTER - ROAD_W / 2 - 18} cy={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 20} r={10} fill={lightStates[state].ns === 'yellow' ? 'yellow' : '#888'} stroke="#111" />
        <circle cx={CENTER - ROAD_W / 2 - 18} cy={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 2} r={10} fill={lightStates[state].ns === 'green' ? 'green' : '#888'} stroke="#111" />
        <text x={CENTER - ROAD_W / 2 - 36} y={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 20} fill="#222" fontSize="12" textAnchor="end" alignmentBaseline="middle">NS</text>
      </g>
      {/* EW */}
      <g>
        <circle cx={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 38} cy={CENTER - ROAD_W / 2 - 18} r={10} fill={lightStates[state].ew === 'red' ? 'red' : '#888'} stroke="#111" />
        <circle cx={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 20} cy={CENTER - ROAD_W / 2 - 18} r={10} fill={lightStates[state].ew === 'yellow' ? 'yellow' : '#888'} stroke="#111" />
        <circle cx={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 2} cy={CENTER - ROAD_W / 2 - 18} r={10} fill={lightStates[state].ew === 'green' ? 'green' : '#888'} stroke="#111" />
        <text x={CENTER - INTERSECTION / 2 - STOP_LINE_OFFSET - 20} y={CENTER - ROAD_W / 2 - 36} fill="#222" fontSize="12" textAnchor="middle" alignmentBaseline="middle">EW</text>
      </g>
    </>
  );
}

function renderCars(cars: Car[]) {
  return cars.map((car) => {
    if (car.dir === 'ns') {
      const y = CENTER - ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 + car.pos;
      return <rect key={car.id} x={CENTER - 14} y={y} width={28} height={CAR_LENGTH} rx={6} fill="#8e24aa" stroke="#222" />;
    } else {
      const x = CENTER - ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 + car.pos;
      return <rect key={car.id} y={CENTER - 14} x={x} height={28} width={CAR_LENGTH} ry={6} fill="#fb8c00" stroke="#222" />;
    }
  });
}

// --- Main Component ---
export default function TrafficIntersectionSimulator() {
  const [state, setState] = useState(0);
  const [running, setRunning] = useState(true);
  const [cars, setCars] = useState<Car[]>(getInitialCars());
  const animationRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);

  // Traffic light timer
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      setState((prev) => (prev + 1) % lightStates.length);
    }, stateDurations[state]);
    return () => clearTimeout(timer);
  }, [state, running]);

  // Car animation
  useEffect(() => {
    if (!running) return;
    function animate() {
      setCars((prevCars) => {
        const nsCars = prevCars.filter((c) => c.dir === 'ns').sort((a, b) => b.pos - a.pos);
        const ewCars = prevCars.filter((c) => c.dir === 'ew').sort((a, b) => b.pos - a.pos);
        const newNsCars = moveCars(nsCars, state);
        const newEwCars = moveCars(ewCars, state);
        return [...newNsCars, ...newEwCars].filter(filterCars);
      });
      animationRef.current = requestAnimationFrame(animate);
    }
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [running, state]);

  // Car spawning
  useEffect(() => {
    if (!running) return;
    function trySpawn() {
      setCars((prevCars) => {
        const nsCars = prevCars.filter((c) => c.dir === 'ns').sort((a, b) => a.pos - b.pos);
        if (
          (nsCars.length === 0 || nsCars[0].pos > CAR_LENGTH + MIN_GAP) &&
          nsCars.length < MAX_CARS_PER_DIRECTION
        ) {
          prevCars.push({ id: Date.now() + Math.random(), dir: 'ns', pos: -ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 });
        }
        const ewCars = prevCars.filter((c) => c.dir === 'ew').sort((a, b) => a.pos - b.pos);
        if (
          (ewCars.length === 0 || ewCars[0].pos > CAR_LENGTH + MIN_GAP) &&
          ewCars.length < MAX_CARS_PER_DIRECTION
        ) {
          prevCars.push({ id: Date.now() + Math.random(), dir: 'ew', pos: -ROAD_LENGTH / 2 - INTERSECTION_SIZE / 2 });
        }
        return [...prevCars];
      });
      spawnTimerRef.current = window.setTimeout(trySpawn, SPAWN_INTERVAL);
    }
    spawnTimerRef.current = window.setTimeout(trySpawn, SPAWN_INTERVAL);
    return () => {
      if (spawnTimerRef.current !== null) {
        clearTimeout(spawnTimerRef.current);
      }
    };
  }, [running]);

  const start = () => setRunning(true);
  const stop = () => setRunning(false);
  const reset = () => {
    setState(0);
    setRunning(false);
    setCars(getInitialCars());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <h3>Traffic Intersection Simulator</h3>
      <div style={{ width: '100%', maxWidth: 400, aspectRatio: '1 / 1' }}>
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} width="100%" height="100%" style={{ background: '#e5e5e5', borderRadius: 12, boxShadow: '0 2px 8px #0002', display: 'block' }}>
          {renderRoads()}
          {renderIntersection()}
          {renderStopLines()}
          {renderTrafficLights(state)}
          {renderCars(cars)}
        </svg>
      </div>
    </div>
  );
} 