import React from 'react';
import { GpuStats } from '../types';
import { Zap, Thermometer, Activity, Box, MonitorPlay } from 'lucide-react';

const ProgressBar = ({ value, total, colorClass }: { value: number, total: number, colorClass: string }) => {
    const percent = Math.min(100, Math.max(0, (value / total) * 100));
    return (
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 mt-1">
            <div 
                className={`h-full transition-all duration-300 ease-out ${colorClass}`} 
                style={{ width: `${percent}%` }}
            />
        </div>
    );
};

const SingleGpu = ({ gpu }: { gpu: GpuStats }) => {
    const isCompute = gpu.is_compute_only;
    const accentColor = isCompute ? 'text-hpe-green' : 'text-hpe-cyan';
    const barColor = isCompute ? 'bg-hpe-green' : 'bg-hpe-cyan';
    const borderColor = isCompute ? 'border-hpe-green/20' : 'border-hpe-cyan/20';

    return (
        <div className={`bg-panel border ${borderColor} p-4 rounded-lg flex flex-col justify-between relative overflow-hidden group hover:border-opacity-50 transition-all`}>
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${isCompute ? 'from-hpe-green/5' : 'from-hpe-cyan/5'} to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none`}></div>

            {/* Header */}
            <div className="flex justify-between items-start mb-3 z-10">
                <div>
                    <div className="flex items-center gap-2">
                        {isCompute ? <Box size={16} className={accentColor} /> : <MonitorPlay size={16} className={accentColor} />}
                        <h4 className="font-bold text-white text-sm tracking-wide">{gpu.name}</h4>
                    </div>
                    <span className="text-[10px] text-text-secondary font-mono uppercase">
                        ID: {gpu.index} • {isCompute ? 'COMPUTE ENGINE' : 'RENDER DEVICE'}
                    </span>
                </div>
                <div className="text-right">
                    <span className={`text-xl font-mono font-bold ${gpu.utilization > 90 ? 'text-alert-red' : 'text-white'}`}>
                        {gpu.utilization}%
                    </span>
                    <div className="text-[9px] text-text-secondary">LOAD</div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3 z-10">
                <div className="bg-black/20 rounded p-2 border border-white/5 flex items-center gap-2">
                    <Thermometer size={14} className={gpu.temp > 80 ? 'text-alert-red' : 'text-text-secondary'} />
                    <div>
                        <div className="text-white font-mono text-sm leading-none">{gpu.temp}°C</div>
                    </div>
                </div>
                <div className="bg-black/20 rounded p-2 border border-white/5 flex items-center gap-2">
                    <Zap size={14} className="text-warn-yellow" />
                    <div>
                        <div className="text-white font-mono text-sm leading-none">{gpu.power}W</div>
                    </div>
                </div>
            </div>

            {/* VRAM */}
            <div className="z-10">
                <div className="flex justify-between text-[10px] font-mono text-text-secondary">
                    <span>VRAM</span>
                    <span className="text-white">{gpu.vram_used.toFixed(1)} / {gpu.vram_total.toFixed(1)} GB</span>
                </div>
                <ProgressBar value={gpu.vram_used} total={gpu.vram_total} colorClass={barColor} />
            </div>
        </div>
    );
};

export const GpuCluster = ({ gpus }: { gpus: GpuStats[] }) => {
    if (!gpus || gpus.length === 0) return (
        <div className="p-8 border border-dashed border-border rounded-xl text-center text-text-secondary">
            No GPU Accelerators detected via API.
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gpus.map((gpu) => (
                <SingleGpu key={gpu.index} gpu={gpu} />
            ))}
        </div>
    );
};

export default GpuCluster;