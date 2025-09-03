
import React from 'react';
import { useSystemData } from '../hooks/useSystemData';

const UsageBar = ({ value, total, color }: { value: number, total: number, color: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-sm font-mono">
                <span className="text-text-main">{value.toFixed(2)} GB / {total.toFixed(2)} GB</span>
                <span style={{ color }}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2.5 border border-accent-blue/50">
                <div className="h-2.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const MonitoringCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
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
    } = useSystemData();

    if (loading) return <p className="text-center text-accent-light">Loading monitoring data...</p>;
    if (error) return <p className="text-center text-red-400">Error: {error}</p>;
    if (!data) return <p className="text-center text-accent-light">No data available.</p>;

    return (
        <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Server Performance Monitor</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <MonitoringCard title="CPU Information">
                    <p className="text-md font-mono text-text-main">{data.system_info.cpu_info}</p>
                    <p className="text-sm text-accent-light mt-2">Live utilization tracking is disabled.</p>
                </MonitoringCard>
                <MonitoringCard title="Memory (RAM)">
                    <p className="text-2xl font-mono text-highlight-green">{data.system_info.total_ram_gb.toFixed(2)} GB Total</p>
                     <p className="text-sm text-accent-light mt-2">Live usage tracking is disabled.</p>
                </MonitoringCard>
                <MonitoringCard title="Disk I/O">
                     <p className="text-2xl font-mono text-accent-light">N/A</p>
                     <p className="text-sm text-accent-light mt-2">Live I/O monitoring is disabled.</p>
                </MonitoringCard>
                 <MonitoringCard title="Network Traffic">
                     <p className="text-2xl font-mono text-accent-light">N/A</p>
                     <p className="text-sm text-accent-light mt-2">Live traffic monitoring is disabled.</p>
                </MonitoringCard>

                {data.gpu_status.map((gpu, index) => (
                     <MonitoringCard key={index} title={`${gpu.name} VRAM`}>
                        <UsageBar value={gpu.vram_used_mb / 1024} total={gpu.vram_total_mb / 1024} color={index === 0 ? "#BE95C4" : "#F3B391"} />
                    </MonitoringCard>
                ))}

                {data.storage_status.map((disk, index) => (
                    <MonitoringCard key={index} title={disk.description || disk.path}>
                        <UsageBar value={disk.used_gb} total={disk.total_gb} color={["#A9E5BB", "#86BBD8", "#F4A261"][index % 3]} />
                    </MonitoringCard>
                ))}
            </div>
        </div>
    );
};

export default MonitoringPage;
