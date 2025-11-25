import React from 'react';
import { useSystemData } from '../hooks/useSystemData';
import { SystemInfo } from '../types';

interface UsageBarProps {
    value: number;
    total: number;
    color: string;
    unit?: string;
}

const UsageBar: React.FC<UsageBarProps> = ({ value, total, color, unit = 'GB' }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm font-mono">
                <span className="text-text-main">{value.toFixed(2)} {unit} / {total.toFixed(2)} {unit}</span>
                <span style={{ color }}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2.5 border border-accent-blue/50 overflow-hidden">
                <div className="h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

// A placeholder bar for when data is missing but expected (e.g. live polling is off or initializing)
const SkeletonBar: React.FC = () => (
    <div>
        <div className="flex justify-between items-center mb-1 text-sm font-mono">
             <span className="text-accent-blue/40 text-xs">Waiting for signal...</span>
             <span className="text-accent-blue/40 text-xs">--%</span>
        </div>
        <div className="w-full bg-primary rounded-full h-2.5 border border-accent-blue/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-accent-blue/10 animate-pulse"></div>
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent animate-[shimmer_2s_infinite]"></div>
        </div>
    </div>
);

interface MonitoringCardProps {
    title: string;
    children: React.ReactNode;
}

const MonitoringCard: React.FC<MonitoringCardProps> = ({ title, children }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 min-h-[150px] flex flex-col justify-center shadow-lg shadow-black/20">
        <h3 className="text-xl font-bold text-highlight-green mb-4">{title}</h3>
        {children}
    </div>
);


const MonitoringPage = () => {
    const { 
        data, 
        loading, 
        error,
        usingFallback
    } = useSystemData();

    // Defensive: Allow partial rendering even if loading or error, if we have stale data
    if (loading && !data) return <p className="text-center text-accent-light mt-10 animate-pulse">Establishing connection to telemetry services...</p>;
    
    // Defensive defaults: Ensure destructuring doesn't crash if data is partial
    const systemInfo: Partial<SystemInfo> = data?.system_info || {};
    const gpuStatus = data?.gpu_status || [];
    const storageStatus = data?.storage_status || [];

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Server Performance Monitor</h2>
            
            {error && !data && (
                 <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg mb-8 text-center text-red-300">
                    <p>Telemetry Service Unreachable: {error}</p>
                 </div>
            )}

            {usingFallback && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 p-4 rounded-lg mb-8 flex items-start gap-4 animate-fade-in-up">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="text-yellow-200 font-bold text-sm">Offline / Fallback Mode</p>
                        <p className="text-yellow-100/70 text-sm mt-1">
                            Unable to connect to the live monitoring server. Displaying cached system information.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MonitoringCard title="CPU Information">
                    <p className="text-md font-mono text-text-main mb-2 truncate" title={systemInfo.cpu_info}>
                        {systemInfo.cpu_info || "Scanning CPU..."}
                    </p>
                    {systemInfo.cpu_usage_percent !== undefined ? (
                        <UsageBar 
                            value={systemInfo.cpu_usage_percent} 
                            total={100} 
                            color="#00F5D4" 
                            unit="%" 
                        />
                    ) : (
                        <SkeletonBar />
                    )}
                </MonitoringCard>

                <MonitoringCard title="Memory (RAM)">
                    <p className="text-md font-mono text-highlight-green mb-2">
                        Total: {systemInfo.total_ram_gb !== undefined ? `${systemInfo.total_ram_gb.toFixed(2)} GB` : "--- GB"}
                    </p>
                    {systemInfo.ram_used_gb !== undefined && systemInfo.total_ram_gb !== undefined ? (
                        <UsageBar 
                            value={systemInfo.ram_used_gb} 
                            total={systemInfo.total_ram_gb} 
                            color="#BE95C4" 
                        />
                    ) : (
                        <SkeletonBar />
                    )}
                </MonitoringCard>

                <MonitoringCard title="Disk I/O (Current)">
                    {systemInfo.disk_io_read_mbps !== undefined && systemInfo.disk_io_write_mbps !== undefined ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10">
                                <p className="text-xs text-accent-light uppercase">Read</p>
                                <p className="text-xl font-mono text-highlight-cyan">{systemInfo.disk_io_read_mbps.toFixed(2)} MB/s</p>
                            </div>
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10">
                                <p className="text-xs text-accent-light uppercase">Write</p>
                                <p className="text-xl font-mono text-highlight-green">{systemInfo.disk_io_write_mbps.toFixed(2)} MB/s</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10 opacity-50">
                                <p className="text-xs text-accent-light uppercase">Read</p>
                                <p className="text-xl font-mono text-accent-light animate-pulse">--.--</p>
                            </div>
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10 opacity-50">
                                <p className="text-xs text-accent-light uppercase">Write</p>
                                <p className="text-xl font-mono text-accent-light animate-pulse">--.--</p>
                            </div>
                        </div>
                    )}
                </MonitoringCard>

                 <MonitoringCard title="Network Traffic (Current)">
                    {systemInfo.network_rx_mbps !== undefined && systemInfo.network_tx_mbps !== undefined ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10">
                                <p className="text-xs text-accent-light uppercase">Download</p>
                                <p className="text-xl font-mono text-highlight-cyan">{systemInfo.network_rx_mbps.toFixed(2)} MB/s</p>
                            </div>
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10">
                                <p className="text-xs text-accent-light uppercase">Upload</p>
                                <p className="text-xl font-mono text-highlight-green">{systemInfo.network_tx_mbps.toFixed(2)} MB/s</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10 opacity-50">
                                <p className="text-xs text-accent-light uppercase">Download</p>
                                <p className="text-xl font-mono text-accent-light animate-pulse">--.--</p>
                            </div>
                            <div className="bg-primary p-3 rounded-lg text-center border border-accent-blue/10 opacity-50">
                                <p className="text-xs text-accent-light uppercase">Upload</p>
                                <p className="text-xl font-mono text-accent-light animate-pulse">--.--</p>
                            </div>
                        </div>
                    )}
                </MonitoringCard>

                {gpuStatus.length > 0 ? gpuStatus.map((gpu, index) => (
                     <MonitoringCard key={index} title={`${gpu.name} VRAM`}>
                        <UsageBar 
                            value={gpu.vram_used_mb / 1024} 
                            total={gpu.vram_total_mb / 1024} 
                            color={index === 0 ? "#BE95C4" : "#F3B391"} 
                        />
                    </MonitoringCard>
                )) : (
                     <MonitoringCard title="GPU VRAM">
                        <div className="text-center text-accent-light text-sm italic">
                            No GPU telemetry available.
                        </div>
                        <div className="mt-4 opacity-30"><SkeletonBar /></div>
                    </MonitoringCard>
                )}

                {storageStatus.length > 0 ? storageStatus.map((disk, index) => (
                    <MonitoringCard key={index} title={disk.description || disk.path}>
                        <UsageBar 
                            value={disk.used_gb} 
                            total={disk.total_gb} 
                            color={["#A9E5BB", "#86BBD8", "#F4A261"][index % 3]} 
                        />
                    </MonitoringCard>
                )) : (
                    <MonitoringCard title="Storage Usage">
                        <div className="text-center text-accent-light text-sm italic">
                            No Storage telemetry available.
                        </div>
                        <div className="mt-4 opacity-30"><SkeletonBar /></div>
                    </MonitoringCard>
                )}
            </div>
        </div>
    );
};

export default MonitoringPage;