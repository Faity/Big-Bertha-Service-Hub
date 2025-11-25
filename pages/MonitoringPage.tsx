import React from 'react';
import { useSystemData } from '../hooks/useSystemData';

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
            <div className="w-full bg-primary rounded-full h-2.5 border border-accent-blue/50">
                <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

interface MonitoringCardProps {
    title: string;
    children: React.ReactNode;
}

const MonitoringCard: React.FC<MonitoringCardProps> = ({ title, children }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 min-h-[150px] flex flex-col justify-center">
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

    if (loading && !data) return <p className="text-center text-accent-light">Loading monitoring data...</p>;
    if (error && !data) return <p className="text-center text-red-400">Error: {error}</p>;
    if (!data) return <p className="text-center text-accent-light">No data available.</p>;

    const { system_info } = data;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Server Performance Monitor</h2>
            
            {usingFallback && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 p-4 rounded-lg mb-8 flex items-start gap-4 animate-fade-in-up">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <p className="text-yellow-200 font-bold text-sm">Offline / Fallback Mode</p>
                        <p className="text-yellow-100/70 text-sm mt-1">
                            Unable to connect to the live monitoring server. Displaying cached system information from <code>application.json</code>. 
                            Check your Settings IP configuration or ensure the backend service is running.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MonitoringCard title="CPU Information">
                    <p className="text-md font-mono text-text-main mb-2">{system_info.cpu_info}</p>
                    {system_info.cpu_usage_percent !== undefined ? (
                        <UsageBar 
                            value={system_info.cpu_usage_percent} 
                            total={100} 
                            color="#00F5D4" 
                            unit="%" 
                        />
                    ) : (
                        <p className="text-sm text-accent-light">Live CPU data unavailable</p>
                    )}
                </MonitoringCard>

                <MonitoringCard title="Memory (RAM)">
                    <p className="text-md font-mono text-highlight-green mb-2">Total: {system_info.total_ram_gb.toFixed(2)} GB</p>
                    {system_info.ram_used_gb !== undefined ? (
                        <UsageBar 
                            value={system_info.ram_used_gb} 
                            total={system_info.total_ram_gb} 
                            color="#BE95C4" 
                        />
                    ) : (
                        <p className="text-sm text-accent-light">Live RAM data unavailable</p>
                    )}
                </MonitoringCard>

                <MonitoringCard title="Disk I/O (Current)">
                    {system_info.disk_io_read_mbps !== undefined && system_info.disk_io_write_mbps !== undefined ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary p-3 rounded-lg text-center">
                                <p className="text-xs text-accent-light uppercase">Read</p>
                                <p className="text-xl font-mono text-highlight-cyan">{system_info.disk_io_read_mbps.toFixed(2)} MB/s</p>
                            </div>
                            <div className="bg-primary p-3 rounded-lg text-center">
                                <p className="text-xs text-accent-light uppercase">Write</p>
                                <p className="text-xl font-mono text-highlight-green">{system_info.disk_io_write_mbps.toFixed(2)} MB/s</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-2xl font-mono text-accent-light">Waiting for data...</p>
                    )}
                </MonitoringCard>

                 <MonitoringCard title="Network Traffic (Current)">
                    {system_info.network_rx_mbps !== undefined && system_info.network_tx_mbps !== undefined ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary p-3 rounded-lg text-center">
                                <p className="text-xs text-accent-light uppercase">Download</p>
                                <p className="text-xl font-mono text-highlight-cyan">{system_info.network_rx_mbps.toFixed(2)} MB/s</p>
                            </div>
                            <div className="bg-primary p-3 rounded-lg text-center">
                                <p className="text-xs text-accent-light uppercase">Upload</p>
                                <p className="text-xl font-mono text-highlight-green">{system_info.network_tx_mbps.toFixed(2)} MB/s</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-2xl font-mono text-accent-light">Waiting for data...</p>
                    )}
                </MonitoringCard>

                {data.gpu_status.map((gpu, index) => (
                     <MonitoringCard key={index} title={`${gpu.name} VRAM`}>
                        <UsageBar 
                            value={gpu.vram_used_mb / 1024} 
                            total={gpu.vram_total_mb / 1024} 
                            color={index === 0 ? "#BE95C4" : "#F3B391"} 
                        />
                    </MonitoringCard>
                ))}

                {data.storage_status.map((disk, index) => (
                    <MonitoringCard key={index} title={disk.description || disk.path}>
                        <UsageBar 
                            value={disk.used_gb} 
                            total={disk.total_gb} 
                            color={["#A9E5BB", "#86BBD8", "#F4A261"][index % 3]} 
                        />
                    </MonitoringCard>
                ))}
            </div>
        </div>
    );
};

export default MonitoringPage;