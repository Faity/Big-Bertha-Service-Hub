import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 h-full">
        <h3 className="text-xl font-bold text-highlight-cyan mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm border-b border-accent-blue/10 pb-2 last:border-0 last:pb-0">
        <p className="text-accent-light">{label}</p>
        <div className="text-text-main font-mono text-left sm:text-right">
            {value !== undefined && value !== null && value !== '' ? value : <span className="text-accent-blue/30 italic">N/A</span>}
        </div>
    </div>
);

const SystemInfoPage = () => {
    const { data, loading, error } = useSystemData();

    if (loading && !data) return <div className="p-12 text-center text-accent-light animate-pulse">Querying System Information...</div>;
    if (error && !data) return <div className="p-12 text-center text-red-400 border border-red-500/20 rounded-lg mx-8 mt-8">System API Error: {error}</div>;
    if (!data) return null;

    const { system_info, gpus, storage_status, comfyui_paths } = data;

    return (
        <div className="animate-fade-in-up space-y-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">System Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoCard title="Host Details">
                    <InfoItem label="Hostname" value={system_info?.hostname} />
                    <InfoItem label="OS" value={`${system_info?.os_name} ${system_info?.os_version}`} />
                    <InfoItem label="Kernel" value={system_info?.kernel_version} />
                    <InfoItem label="Architecture" value={system_info?.architecture} />
                    <InfoItem label="Python Env" value={system_info?.python_version} />
                </InfoCard>

                <InfoCard title="Processor">
                    <InfoItem label="Model" value={system_info?.cpu_model} />
                </InfoCard>

                <InfoCard title="Graphics Acceleration">
                    {gpus && gpus.length > 0 ? (
                        <div className="space-y-4">
                            {gpus.map((gpu, idx) => (
                                <div key={idx} className="bg-primary p-3 rounded-lg border border-accent-blue/10">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-highlight-green">{gpu.name}</span>
                                        <span className="text-xs text-accent-light">ID: {gpu.index}</span>
                                    </div>
                                    <div className="text-xs font-mono text-accent-light">
                                        VRAM: {(gpu.vram_total_mb ?? 0).toFixed(2)} GB
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-accent-light italic">No dedicated GPUs detected.</p>
                    )}
                </InfoCard>

                 <div className="md:col-span-2">
                    <InfoCard title="Storage Subsystem">
                        {storage_status && storage_status.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {storage_status.map((disk, idx) => (
                                    <div key={idx} className="bg-primary p-4 rounded-lg border border-accent-blue/10">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-highlight-green">{disk.path}</span>
                                            <span className="text-xs text-accent-light">{disk.filesystem_type}</span>
                                        </div>
                                        <p className="text-xs text-accent-light mb-2">{disk.description}</p>
                                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-highlight-cyan h-full" 
                                                style={{ width: `${(disk.used_gb / disk.total_gb) * 100}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs mt-1 font-mono">
                                            <span>{disk.used_gb.toFixed(1)} GB Used</span>
                                            <span>{disk.total_gb.toFixed(1)} GB Total</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-accent-light italic">No storage volumes reported.</p>
                        )}
                    </InfoCard>
                 </div>

                 <div className="md:col-span-2">
                     <InfoCard title="Application Paths">
                        {comfyui_paths ? Object.entries(comfyui_paths).map(([key, val]) => (
                             <InfoItem key={key} label={key.toUpperCase().replace('_', ' ')} value={val as string} />
                        )) : <p>Path configuration unavailable</p>}
                     </InfoCard>
                 </div>
            </div>
        </div>
    );
};

export default SystemInfoPage;