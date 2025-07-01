'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { ReactElement, ChangeEvent } from 'react';

// Type definitions
type Algorithm = 'fcfs' | 'scan' | 'look';
type TrafficPattern = 'morning' | 'lunch' | 'evening' | 'random';
type Direction = 'up' | 'down' | 'idle';

interface FloorRequest {
    startFloor: number;
    destFloor: number;
    timestamp: number;
}

interface Elevator {
    id: number;
    currentFloor: number;
    direction: Direction;
    passengers: Passenger[];
    requests: number[];
}

interface ElevatorSystemState {
    elevators: Elevator[];
    algorithm: Algorithm;
    trafficPattern: TrafficPattern;
    isRunning: boolean;
    requestRate: number;
    pendingRequests: FloorRequest[];
}

interface Passenger {
    id: number;
    startFloor: number;
    destFloor: number;
    waitStartTime: number;
}

interface Metrics {
    avgWaitTime: number;
    totalDistance: number;
    longestWait: number;
    requestsServed: number;
    totalRequests: number;
}

interface FloorRequestCounts {
    up: FloorRequest[];
    down: FloorRequest[];
    total: number;
}

interface RequestIndicatorProps {
    count: number;
    type: 'up' | 'down' | 'total';
}

interface FloorIndicatorsProps {
    requests: FloorRequestCounts;
}

// Constants
const NUM_FLOORS = 8;
const MOVE_DELAY = 1000;
const MAX_PASSENGERS = 8;
const NUM_ELEVATORS = 2;

// Helper components
const RequestIndicator: React.FC<RequestIndicatorProps> = ({ count, type }) => {
    const baseClasses = "text-xs px-1.5 py-0.5 rounded";
    const activeClasses = {
        up: 'bg-green-500 dark:bg-green-600 text-white',
        down: 'bg-red-500 dark:bg-red-600 text-white',
        total: 'bg-blue-500 dark:bg-blue-600 text-white'
    };
    const inactiveClasses = 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400';

    const symbol = {
        up: '↑',
        down: '↓',
        total: ''
    };

    return (
        <div className={`${baseClasses} ${count > 0 ? activeClasses[type] : inactiveClasses}`}>
            {symbol[type]}{count}
        </div>
    );
};

const FloorIndicators: React.FC<FloorIndicatorsProps> = ({ requests }) => (
    <>
        <div className="absolute left-2 flex items-center gap-1" style={{ top: '10px' }}>
            <RequestIndicator count={requests.up.length} type="up" />
            <RequestIndicator count={requests.down.length} type="down" />
        </div>
        <div className="absolute right-2" style={{ top: '10px' }}>
            <RequestIndicator count={requests.total} type="total" />
        </div>
    </>
);

// Helper functions
const generateRequest = (pattern: TrafficPattern): [number, number] => {
    switch (pattern) {
        case 'morning':
            return [0, Math.floor(Math.random() * (NUM_FLOORS - 2)) + 2];
        case 'lunch': {
            const isGroundFloor = Math.random() < 0.4;
            if (isGroundFloor) {
                return [0, Math.floor(Math.random() * (NUM_FLOORS - 1)) + 1];
            }
            const floor1 = Math.floor(Math.random() * NUM_FLOORS);
            let floor2;
            do {
                floor2 = Math.floor(Math.random() * NUM_FLOORS);
            } while (floor2 === floor1);
            return [floor1, floor2];
        }
        case 'evening':
            return [Math.floor(Math.random() * (NUM_FLOORS - 2)) + 2, 0];
        default:
            const start = Math.floor(Math.random() * NUM_FLOORS);
            let dest;
            do {
                dest = Math.floor(Math.random() * NUM_FLOORS);
            } while (dest === start);
            return [start, dest];
    }
};

const findBestElevator = (elevators: Elevator[], floor: number): number => {
    let bestIndex = -1;
    let shortestDistance = Infinity;

    elevators.forEach((elevator, index) => {
        if (elevator.passengers.length < MAX_PASSENGERS) {
            const distance = Math.abs(elevator.currentFloor - floor);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                bestIndex = index;
            }
        }
    });

    return bestIndex;
};

const getFloorRequests = (requests: FloorRequest[], floor: number): FloorRequestCounts => {
    const floorRequests = requests.filter(r => r.startFloor === floor);
    return {
        up: floorRequests.filter(r => r.destFloor > floor),
        down: floorRequests.filter(r => r.destFloor < floor),
        total: floorRequests.length
    };
};

// Main component
const ElevatorSimulation: React.FC = () => {
    const [nextPassengerId, setNextPassengerId] = useState(0);
    const [systemMetrics, setSystemMetrics] = useState<Metrics>({
        avgWaitTime: 0,
        totalDistance: 0,
        longestWait: 0,
        requestsServed: 0,
        totalRequests: 0
    });

    const [system, setSystem] = useState<ElevatorSystemState>({
        elevators: Array.from({ length: NUM_ELEVATORS }, (_, i) => ({
            id: i,
            currentFloor: 0,
            direction: 'idle',
            passengers: [],
            requests: []
        })),
        algorithm: 'scan',
        trafficPattern: 'random',
        isRunning: false,
        requestRate: 30,
        pendingRequests: []
    });

    // Traffic generation effect
    useEffect(() => {
        if (system.isRunning) {
            const interval = setInterval(() => {
                const [start, dest] = generateRequest(system.trafficPattern);
                const bestIndex = findBestElevator(system.elevators, start);

                setNextPassengerId(prevId => prevId + 1);
                setSystem(prev => {
                    const newRequest: FloorRequest = {
                        startFloor: start,
                        destFloor: dest,
                        timestamp: Date.now()
                    };

                    const updatedElevators = [...prev.elevators];
                    updatedElevators[bestIndex] = {
                        ...updatedElevators[bestIndex],
                        requests: [...updatedElevators[bestIndex].requests, start, dest],
                        passengers: [...updatedElevators[bestIndex].passengers, {
                            id: nextPassengerId,
                            startFloor: start,
                            destFloor: dest,
                            waitStartTime: Date.now()
                        }]
                    };

                    return {
                        ...prev,
                        elevators: updatedElevators,
                        pendingRequests: [...prev.pendingRequests, newRequest]
                    };
                });

                setSystemMetrics(prev => ({
                    ...prev,
                    totalRequests: prev.totalRequests + 1
                }));
            }, (60 / system.requestRate) * 1000);

            return () => clearInterval(interval);
        }
    }, [system.isRunning, system.requestRate, system.trafficPattern, nextPassengerId]);

    // Elevator movement effect
    useEffect(() => {
        const timers = system.elevators.map((elevator, index) => {
            if (elevator.requests.length > 0) {
                return setInterval(() => {
                    setSystem(prev => {
                        const currentElevator = prev.elevators[index];
                        const nextFloor = currentElevator.requests[0];

                        // Update metrics and remove completed requests
                        const completedPassengers = currentElevator.passengers.filter(
                            p => p.startFloor === currentElevator.currentFloor || p.destFloor === currentElevator.currentFloor
                        );

                        if (completedPassengers.length > 0) {
                            const waitTimes = completedPassengers.map(p => Date.now() - p.waitStartTime);
                            setSystemMetrics(prevMetrics => ({
                                ...prevMetrics,
                                avgWaitTime: (prevMetrics.avgWaitTime * prevMetrics.requestsServed + waitTimes.reduce((a, b) => a + b, 0)) /
                                    (prevMetrics.requestsServed + waitTimes.length),
                                longestWait: Math.max(prevMetrics.longestWait, ...waitTimes),
                                totalDistance: prevMetrics.totalDistance + Math.abs(nextFloor - currentElevator.currentFloor),
                                requestsServed: prevMetrics.requestsServed + waitTimes.length
                            }));
                        }

                        // Update elevator state
                        const newDirection: Direction =
                            nextFloor > currentElevator.currentFloor ? 'up' :
                                nextFloor < currentElevator.currentFloor ? 'down' :
                                    'idle';

                        const updatedElevators = [...prev.elevators];
                        updatedElevators[index] = {
                            ...currentElevator,
                            currentFloor: nextFloor,
                            direction: newDirection,
                            requests: currentElevator.requests.slice(1),
                            passengers: currentElevator.passengers.filter(p => !completedPassengers.includes(p))
                        };

                        // Remove completed requests from pending list
                        const updatedPendingRequests = prev.pendingRequests.filter(r =>
                            !(r.startFloor === currentElevator.currentFloor || r.destFloor === currentElevator.currentFloor)
                        );

                        return {
                            ...prev,
                            elevators: updatedElevators,
                            pendingRequests: updatedPendingRequests
                        };
                    });
                }, MOVE_DELAY + 500); // Add 500ms pause at each floor
            }
            return null;
        });

        return () => timers.forEach(timer => timer && clearInterval(timer));
    }, [system.elevators]);

    const renderElevatorShaft = (elevator: Elevator): ReactElement => (
        <div
            key={elevator.id}
            className="relative border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800"
            style={{
                width: '140px',
                height: `${NUM_FLOORS * 60}px`,
                marginRight: '2rem'
            }}
        >
            {/* Direction indicator above the elevator car, centered and not blocking the floor */}
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bottom: `${(elevator.currentFloor + 1) * 60}px`, // Position above the car (next floor level)
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 20
                }}
            >
                {elevator.direction === 'up' && (
                    <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderBottom: '12px solid #2196F3',
                    }} title="Up" />
                )}
                {elevator.direction === 'down' && (
                    <div style={{
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '12px solid #2196F3',
                    }} title="Down" />
                )}
                {elevator.direction === 'idle' && (
                    <div style={{
                        width: 12,
                        height: 3,
                        background: '#bbb',
                        borderRadius: 2,
                    }} title="Idle" />
                )}
            </div>
            {/* Restore floor rendering */}
            {Array.from({ length: NUM_FLOORS }, (_, i) => {
                const requests = getFloorRequests(system.pendingRequests, i);
                return (
                    <div
                        key={i}
                        className="absolute w-full"
                        style={{ bottom: `${i * 60}px`, height: '60px' }}
                    >
                        {/* Floor number */}
                        <div className="absolute text-sm text-gray-600 dark:text-gray-400"
                            style={{ right: '-25px', top: '20px' }}>
                            {i}
                        </div>

                        {/* Floor line */}
                        <div className={`absolute left-0 w-full h-px ${elevator.requests.includes(i)
                            ? 'bg-yellow-400 dark:bg-yellow-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`} />

                        <FloorIndicators requests={requests} />
                    </div>
                );
            })}
            <div
                className={`absolute flex items-center justify-center text-sm transition-all duration-500 border-2 border-gray-700 dark:border-gray-300 rounded ${elevator.passengers.length > 0
                    ? 'bg-green-500 dark:bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-700'
                    }`}
                style={{
                    left: '70px',
                    bottom: `${elevator.currentFloor * 60}px`,
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <span>{elevator.passengers.length}</span>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Simulation Controls
                </h3>
                <div className="mb-4 flex flex-col sm:flex-row items-stretch gap-4">
                    <button
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${system.isRunning
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-green-500 hover:bg-green-600'
                            } text-white w-full sm:w-24`}
                        onClick={() => setSystem(prev => ({ ...prev, isRunning: !prev.isRunning }))}
                    >
                        {system.isRunning ? 'Stop' : 'Start'}
                    </button>
                    <select
                        value={system.trafficPattern}
                        onChange={(e) => setSystem(prev => ({ ...prev, trafficPattern: e.target.value as TrafficPattern }))}
                        className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-gray-200"
                    >
                        <option value="random">Random Traffic</option>
                        <option value="morning">Morning Rush</option>
                        <option value="lunch">Lunch Time</option>
                        <option value="evening">Evening Rush</option>
                    </select>
                    <select
                        value={system.requestRate}
                        onChange={(e) => setSystem(prev => ({ ...prev, requestRate: parseInt(e.target.value) }))}
                        className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-800 dark:text-gray-200"
                    >
                        <option value="15">15 requests/min</option>
                        <option value="30">30 requests/min</option>
                        <option value="60">60 requests/min</option>
                        <option value="120">120 requests/min</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Algorithm:</span>
                    <div className="flex flex-row flex-wrap gap-2">
                        {(['fcfs', 'scan', 'look'] as Algorithm[]).map(alg => (
                            <button
                                key={alg}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${system.algorithm === alg
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    }`}
                                onClick={() => setSystem(prev => ({ ...prev, algorithm: alg }))}
                            >
                                {alg.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm flex flex-col lg:flex-row gap-8">
                <div className="flex justify-center lg:justify-start">
                    {system.elevators.map(renderElevatorShaft)}
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                        System Metrics
                    </h3>
                    <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Wait:</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                            {Math.round(systemMetrics.avgWaitTime / 1000)}s
                        </div>

                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Distance:</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                            {systemMetrics.totalDistance} floors
                        </div>

                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Longest Wait:</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                            {Math.round(systemMetrics.longestWait / 1000)}s
                        </div>

                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Requests Served:</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                            {systemMetrics.requestsServed} / {systemMetrics.totalRequests}
                        </div>

                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests:</div>
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                            {system.pendingRequests.length}
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    Pending Requests
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    From
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    To
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Wait Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {system.pendingRequests.map((req, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {req.startFloor}
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.destFloor}
                                    </td>
                                    <td className="px-6 py-4">
                                        {Math.round((Date.now() - req.timestamp) / 1000)}s
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ElevatorSimulation;
