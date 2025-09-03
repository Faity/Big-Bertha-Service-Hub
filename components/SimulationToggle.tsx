import React from 'react';
import { useAppData } from '../contexts/SimulationContext';

const SimulationToggle = () => {
    const { isSimulating, toggleSimulation } = useAppData();

    return (
        <div className="flex flex-col items-center gap-2 p-3 bg-primary rounded-lg border border-accent-blue/20">
            <div className="flex items-center justify-between w-full">
                <label htmlFor="simulation-toggle" className="text-sm font-medium text-text-main cursor-pointer">
                    Server Simulation
                </label>
                <div 
                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors duration-300 ${isSimulating ? 'bg-highlight-cyan' : 'bg-accent-blue'}`}
                    onClick={toggleSimulation}
                    role="switch"
                    aria-checked={isSimulating}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? toggleSimulation() : null}
                >
                    <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${isSimulating ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                </div>
            </div>
            <p className="text-xs text-accent-light text-center">
                {isSimulating ? 'Displaying dynamic, simulated data.' : 'Displaying static data from last report.'}
            </p>
        </div>
    );
};

export default SimulationToggle;
