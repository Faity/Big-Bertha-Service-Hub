import React from 'react';
import { useSystemData } from '../hooks/useSystemData';

// Reusable Components
const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-highlight-cyan border-t-transparent rounded-full animate-spin"></div>
        <p className="text-accent-light animate-pulse">Establishing Telemetry Link...</p>
    </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center">
        <h3 className="text-xl font-bold text-red-400 mb-2">Connection Lost</h3>
        <p className="text-red-300/70">{message}</p>
        <p className="text-xs text-accent-light mt-4">Check Settings & Server Status</p>
    </div>
);

const MetricCard = ({ title, children, color = "text-text-main" }: { title: string, children?: React.ReactNode, color?: string }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 shadow-lg shadow-black/20 flex flex-col justify-between min-h-[160px]">
        <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${color}`}>{title}</h3>
        {children}
    </div>
);

const ProgressBar = ({ value, max, colorClass }: { value: number, max: number, colorClass: string }) => {
    const safeValue = value ?? 0;
    const safeMax = max > 0 ? max : 100;
    const percent = Math.min(100, Math.max(0, (safeValue / safeMax) * 100));
    
    return (
        <div className="w-full bg-primary h-3 rounded-full overflow-hidden border border-accent-blue/30 mt-2">
            <div 
                className={`h-full transition-all duration-500 ease-out ${colorClass}`} 
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};

const MonitoringPage = () => {
    const { data, loading, error } = useSystemData();

    // 1. Loading State
    if (loading && !data) return <LoadingSpinner />;

    // 2. Error State (Blocking only if no data available)
    if (error && !data) return <ErrorDisplay message={error} />;

    // 3. Defensive Data Access
    const os = data?.os_status;
    const gpus = data?.gpus || [];
    const ilo = data?.ilo_metrics;

    if (!os) return <ErrorDisplay message="Waiting for valid sensor data..." />;

    return (
        <div className="animate-fade-in-up space-y-6">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan mb-8">
                Live Telemetry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CPU Card */}
                <MetricCard title="CPU Load" color="text-highlight-cyan">
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-mono font-bold text-white">{(os.cpu_usage_percent ?? 0).toFixed(1)}%</span>
                        <span className="text-xs text-accent-light mb-1">Utilization</span>
                    </div>
                    <ProgressBar value={os.cpu_usage_percent} max={100} colorClass="bg-highlight-cyan" />
                </MetricCard>

                {/* RAM Card */}
                <MetricCard title="Memory Usage" color="text-purple-400">
                    <div className="flex flex-col">
                        <span className="text-3xl font-mono font-bold text-white">
                            {(os.ram_used_gb ?? 0).toFixed(1)} <span className="text-base text-accent-light">GB</span>
                        </span>
                        <span className="text-xs text-accent-light">of {(os.ram_total_gb ?? 0).toFixed(1)} GB Total</span>
                    </div>
                    <ProgressBar value={os.ram_used_gb} max={os.ram_total_gb} colorClass="bg-purple-500" />
                </MetricCard>

                {/* Ambient Temp Card (iLO) */}
                <MetricCard title="Inlet Temp" color="text-orange-400">
                     <div className="flex flex-col items-center justify-center h-full">
                        {ilo ? (
                             <div className="text-center w-full">
                                <span className="text-4xl font-mono font-bold text-white">{ilo.inlet_ambient_c}°C</span>
                                <div className="flex justify-between items-center w-full mt-2 px-2">
                                    <div className="text-xs text-accent-light">
                                        <p>Power</p>
                                        <p className="text-white font-bold">{ilo.power_consumed_watts ?? 0} W</p>
                                    </div>
                                    <div className="text-xs text-accent-light text-right">
                                        <p>Fans</p>
                                        <p className="text-white font-bold">{ilo.fan_speed_percent ?? 0}%</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <span className="text-accent-light italic">No Sensor Data</span>
                        )}
                    </div>
                </MetricCard>

                 {/* GPU Temp Max (Summary) */}
                 <MetricCard title="Max GPU Temp" color="text-red-400">
                    <div className="flex items-center justify-center h-full">
                        {gpus.length > 0 ? (
                             <div className="text-center">
                                <span className="text-4xl font-mono font-bold text-white">
                                    {Math.max(...gpus.map(g => g.temperature_c ?? 0))}°C
                                </span>
                                <p className="text-xs text-accent-light mt-1">Hotspot</p>
                            </div>
                        ) : (
                             <span className="text-accent-light italic">No GPU</span>
                        )}
                    </div>
                </MetricCard>
            </div>

            {/* GPU Details Grid */}
            <h3 className="text-xl font-bold text-highlight-green mt-8 mb-4">GPU Accelerators</h3>
            {gpus.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {gpus.map((gpu, idx) => (
                        <div key={idx} className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="text-lg font-bold text-white">{gpu.name}</h4>
                                    <span className="text-xs font-mono text-accent-light">ID: {gpu.index}</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl font-bold ${(gpu.temperature_c ?? 0) > 80 ? 'text-red-400' : 'text-green-400'}`}>
                                        {gpu.temperature_c ?? 'N/A'}°C
                                    </span>
                                    <p className="text-xs text-accent-light">Core Temp</p>
                                </div>
                            </div>
                            
                            {/* VRAM Bar - Converted MB to GB */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-accent-light">VRAM Usage</span>
                                    <span className="text-highlight-cyan">
                                        {((gpu.vram_used_mb ?? 0) / 1024).toFixed(2)} / {((gpu.vram_total_mb ?? 0) / 1024).toFixed(2)} GB
                                    </span>
                                </div>
                                <ProgressBar value={gpu.vram_used_mb} max={gpu.vram_total_mb} colorClass="bg-highlight-cyan" />
                            </div>

                             {/* Utilization Bar */}
                             <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-accent-light">Core Utilization</span>
                                    <span className="text-highlight-green">{gpu.gpu_utilization_percent ?? 0}%</span>
                                </div>
                                <ProgressBar value={gpu.gpu_utilization_percent} max={100} colorClass="bg-highlight-green" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8 text-center border border-dashed border-accent-blue/30 rounded-xl text-accent-light">
                    No NVIDIA GPUs detected via API.
                </div>
            )}
        </div>
    );
};

export default MonitoringPage;