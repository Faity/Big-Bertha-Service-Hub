
import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const GpuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-highlight-cyan flex-shrink-0 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h20v10H2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12a2 2 0 100-4 2 2 0 000 4zM14 12a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17h3m14 0h3" />
    </svg>
);

const InfoCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
        <h3 className="text-xl font-bold text-highlight-cyan mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem = ({ label, value }: { label: string, value: React.ReactNode }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm">
        <p className="text-accent-light">{label}</p>
        <p className="text-text-main font-mono text-left sm:text-right">{value}</p>
    </div>
);

const UsageBar = ({ value, total, color, unit }: { value: number, total: number, color: string, unit: string }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-text-main">{value.toFixed(2)} {unit} / {total.toFixed(2)} {unit}</span>
                <span style={{ color }}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2 border border-accent-blue/50">
                <div className="h-1.5 rounded-full" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

const TabButton = ({ label, tabKey, activeTab, setActiveTab }: { label: string, tabKey: string, activeTab: string, setActiveTab: (key: string) => void }) => {
    const isActive = activeTab === tabKey;
    const baseClasses = "px-6 py-3 text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight-cyan rounded-t-lg";
    const activeClasses = "border-b-2 border-highlight-cyan text-highlight-cyan";
    const inactiveClasses = "text-accent-light hover:text-white border-b-2 border-transparent";
    return (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tabKey}`}
            id={`tab-${tabKey}`}
        >
            {label.toUpperCase()}
        </button>
    );
};

const TabPanel = ({ children, tabKey, activeTab }: { children: React.ReactNode, tabKey: string, activeTab: string }) => {
    const isHidden = activeTab !== tabKey;
    return (
        <div
            hidden={isHidden}
            role="tabpanel"
            id={`tabpanel-${tabKey}`}
            aria-labelledby={`tab-${tabKey}`}
            className="animate-fade-in-up"
        >
            {!isHidden && children}
        </div>
    );
};


const SystemInfoPage = () => {
    const { data, loading, error } = useSystemData();
    const [activeTab, setActiveTab] = useState('system');

    if (loading) {
        return <div className="text-center text-accent-light">Loading system information...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading data: {error}</div>;
    }

    if (!data) {
        return <div className="text-center text-accent-light">No system information available.</div>;
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">System Overview</h2>
            
            <div className="w-full">
                <div className="flex border-b border-accent-blue/20" role="tablist" aria-label="System Information Tabs">
                    <TabButton label="System" tabKey="system" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="Hardware" tabKey="hardware" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="Service Details" tabKey="services" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                
                <div className="mt-8">
                    <TabPanel tabKey="system" activeTab={activeTab}>
                        <InfoCard title="System Information">
                            <InfoItem label="OS" value={`${data.system_info.os_name} ${data.system_info.os_version}`} />
                            <InfoItem label="Kernel" value={data.system_info.kernel_version} />
                            <InfoItem label="Architecture" value={data.system_info.architecture} />
                            <InfoItem label="CPU" value={data.system_info.cpu_info} />
                            <InfoItem label="Total RAM" value={`${data.system_info.total_ram_gb.toFixed(2)} GB`} />
                            <InfoItem label="Python Version" value={data.system_info.python_version} />
                            <InfoItem label="ComfyUI Git Hash" value={data.system_info.comfyui_git_version} />
                        </InfoCard>
                    </TabPanel>

                    <TabPanel tabKey="hardware" activeTab={activeTab}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InfoCard title="GPU Status">
                                {data.gpu_status.map((gpu, index) => (
                                    <div key={index} className="bg-primary p-4 rounded-lg flex items-center">
                                        <GpuIcon />
                                        <div className="flex-grow">
                                            <p className="font-bold text-highlight-green mb-1">{gpu.name}</p>
                                            <UsageBar value={gpu.vram_used_mb} total={gpu.vram_total_mb} color="#00F5D4" unit="MB" />
                                        </div>
                                    </div>
                                ))}
                            </InfoCard>
                             <InfoCard title="Storage Status">
                                {data.storage_status.map((disk, index) => (
                                    <div key={index} className="space-y-2 bg-primary p-3 rounded-lg">
                                         <p className="font-bold text-highlight-green">{disk.description || disk.path}</p>
                                         <UsageBar value={disk.used_gb} total={disk.total_gb} color={["#9AE19D", "#FFD700", "#83C5BE"][index % 3]} unit="GB" />
                                    </div>
                                ))}
                            </InfoCard>
                        </div>
                    </TabPanel>
                    
                    <TabPanel tabKey="services" activeTab={activeTab}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InfoCard title="Ollama Service">
                                <InfoItem label="Service Status" value={
                                    <span className={data.ollama_status.status === 'running' ? 'text-highlight-green' : 'text-red-400'}>
                                        {data.ollama_status.status}
                                    </span>
                                } />
                                <InfoItem label="Version" value={data.ollama_status.version} />
                                <InfoItem label="Installed Models" value={data.ollama_status.installed_models.length} />
                            </InfoCard>
                            <InfoCard title="ComfyUI Paths">
                                {Object.entries(data.comfyui_paths).map(([key, value]) => (
                                    <InfoItem key={key} label={key.replace(/_/g, ' ')} value={
                                        <span className={value.startsWith('Path not found') ? 'text-red-400/70' : ''}>
                                            {value.replace('/opt/ki_project/ComfyUI', '...')}
                                        </span>
                                    } />
                                ))}
                            </InfoCard>
                        </div>
                    </TabPanel>
                </div>
            </div>
        </div>
    );
};

export default SystemInfoPage;
