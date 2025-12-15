
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SystemData, GpuInfo, StorageStatus, ChartData } from '../types';

// Utility to create a deeper copy for simulation
const deepCopy = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const generateInitialData = (length: number, range: number): ChartData[] => {
    return Array.from({ length }, (_, i) => ({
        name: `${length - 1 - i}s ago`,
        value: Math.floor(Math.random() * range),
    }));
};

const updateChartData = (prevData: ChartData[], range: number) => {
    const newData = [...prevData.slice(1)];
    const newValue = Math.floor(Math.random() * range);
    newData.push({ name: 'now', value: newValue });
    return newData.map((d, i) => ({ ...d, name: `${newData.length - 1 - i}s ago` }));
};


interface AppDataContextType {
    baseData: SystemData | null;
    displayData: SystemData | null;
    loading: boolean;
    error: string | null;
    isSimulating: boolean;
    toggleSimulation: () => void;
    // Chart data
    cpuHistory: ChartData[];
    ramHistory: ChartData[];
    netHistory: ChartData[];
    diskHistory: ChartData[];
}

const SimulationContext = createContext<AppDataContextType | undefined>(undefined);

const HISTORY_LENGTH = 15;

export const SimulationProvider = ({ children }: { children: ReactNode }) => {
    const [baseData, setBaseData] = useState<SystemData | null>(null);
    const [displayData, setDisplayData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    
    // Time-series data states
    const [cpuHistory, setCpuHistory] = useState<ChartData[]>(generateInitialData(HISTORY_LENGTH, 100));
    const [ramHistory, setRamHistory] = useState<ChartData[]>([]);
    const [netHistory, setNetHistory] = useState<ChartData[]>(generateInitialData(HISTORY_LENGTH, 1000));
    const [diskHistory, setDiskHistory] = useState<ChartData[]>(generateInitialData(HISTORY_LENGTH, 500));


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/application.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData: SystemData = await response.json();
                setBaseData(jsonData);
                setDisplayData(jsonData);
                // Initialize RAM history based on fetched data
                // Accessing ram_total_gb from os_status
                const totalRam = jsonData.os_status?.ram_total_gb || 100;
                setRamHistory(generateInitialData(HISTORY_LENGTH, Math.round(totalRam)));
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const runSimulation = useCallback(() => {
        if (!baseData) return;

        const simulatedData = deepCopy(baseData);

        // Simulate GPU VRAM usage
        if (simulatedData.gpus) {
            simulatedData.gpus = simulatedData.gpus.map((gpu: GpuInfo) => {
                const usageChange = (Math.random() - 0.45) * (gpu.vram_total * 0.05); // Fluctuate by up to 5%, tend to increase slightly
                const newUsed = Math.max(3, Math.min(gpu.vram_total * 0.95, gpu.vram_used + usageChange));
                return {
                    ...gpu,
                    vram_used: newUsed,
                };
            });
        }

        // Simulate Storage usage
        if (simulatedData.storage_status) {
            simulatedData.storage_status = simulatedData.storage_status.map((disk: StorageStatus) => {
                 const usageChange = (Math.random() - 0.4) * 0.01; // Fluctuate by a small amount
                 const newUsed = Math.max(0, Math.min(disk.total_gb * 0.98, disk.used_gb + usageChange));
                 return {
                     ...disk,
                     used_gb: newUsed,
                     free_gb: disk.total_gb - newUsed,
                 };
            });
        }
        
        setDisplayData(simulatedData);

        // Update time-series data
        setCpuHistory(prev => updateChartData(prev, 100));
        setNetHistory(prev => updateChartData(prev, 1000));
        setDiskHistory(prev => updateChartData(prev, 500));
        
        const totalRam = baseData.os_status?.ram_total_gb || 100;
        setRamHistory(prev => updateChartData(prev, Math.round(totalRam)));

    }, [baseData]);


    useEffect(() => {
        let intervalId: number | null = null;
        if (isSimulating && !loading) {
            intervalId = window.setInterval(runSimulation, 2000);
        } else {
            // When simulation stops, revert to base data
            setDisplayData(baseData);
            if(baseData) {
                // Also reset chart data to a static "snapshot"
                 setCpuHistory(generateInitialData(HISTORY_LENGTH, 100));
                 const totalRam = baseData.os_status?.ram_total_gb || 100;
                 setRamHistory(generateInitialData(HISTORY_LENGTH, Math.round(totalRam)));
                 setNetHistory(generateInitialData(HISTORY_LENGTH, 1000));
                 setDiskHistory(generateInitialData(HISTORY_LENGTH, 500));
            }
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isSimulating, baseData, loading, runSimulation]);

    const toggleSimulation = () => {
        setIsSimulating(prev => !prev);
    };

    return (
        <SimulationContext.Provider value={{ baseData, displayData, loading, error, isSimulating, toggleSimulation, cpuHistory, ramHistory, netHistory, diskHistory }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useAppData = (): AppDataContextType => {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error('useAppData must be used within a SimulationProvider');
    }
    return context;
};
