import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';
import { SystemInfo } from '../types';

const GpuIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-highlight-cyan flex-shrink-0 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 7h20v10H2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12a2 2 0 100-4 2 2 0 000 4zM14 12a2 2 0 100-4 2 2 0 000 4z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17h3m14 0h3" />
    </svg>
);

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
            {value !== undefined && value !== null && value !== '' ? value : <span className="text-accent-blue/40 text-xs italic animate-pulse">-- Pending --</span>}
        </div>
    </div>
);

const UsageBar: React.FC<{ value: number; total: number; color: string; unit: string }> = ({ value, total, color, unit }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div>
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
                <span className="text-text-main">{value.toFixed(2)} {unit} / {total.toFixed(2)} {unit}</span>
                <span style={{ color }}>{percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-primary rounded-full h-2 border border-accent-blue/50 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
            </div>
        </div>
    );
};

interface TabButtonProps {
    label: string;
    tabKey: string;
    activeTab: string;
    setActiveTab: (key: string) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, tabKey, activeTab, setActiveTab }) => {
    const isActive = activeTab === tabKey;
    const baseClasses = "px-6 py-3 text-sm font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight-cyan rounded-t-lg";
    const activeClasses = "border-b-2 border-highlight-cyan text-highlight-cyan bg-secondary/50";
    const inactiveClasses = "text-accent-light hover:text-white border-b-2 border-transparent hover:bg-secondary/20";
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

interface TabPanelProps {
    children: React.ReactNode;
    tabKey: string;
    activeTab: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, tabKey, activeTab }) => {
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

    // Safe access to data structures with fallbacks
    // Casting to any to avoid strict TS undefined checks interfering with the "Pending" UI logic
    const systemInfo: Partial<SystemInfo> = data?.system_info || {};
    const gpuStatus = data?.gpu_status || [];
    const storageStatus = data?.storage_status || [];
    const ollamaStatus = data?.ollama_status;
    const comfyuiPaths = data?.comfyui_paths || {};

    if (loading && !data) {
        return <div className="flex items-center justify-center h-64 text-accent-light animate-pulse">Initializing System Scanners...</div>;
    }

    if (error && !data) {
        return <div className="text-center p-8 text-red-400 border border-red-500/30 rounded-xl bg-secondary">System Offline: {error}</div>;
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
                
                <div className="mt-8 min-h-[400px]">
                    <TabPanel tabKey="system" activeTab={activeTab}>
                        <InfoCard title="System Information">
                            <InfoItem label="OS Name" value={systemInfo.os_name} />
                            <InfoItem label="OS Version" value={systemInfo.os_version} />
                            <InfoItem label="Kernel" value={systemInfo.kernel_version} />
                            <InfoItem label="Architecture" value={systemInfo.architecture} />
                            <InfoItem label="CPU Model" value={systemInfo.cpu_info} />
                            <InfoItem label="Total RAM" value={systemInfo.total_ram_gb ? `${systemInfo.total_ram_gb.toFixed(2)} GB` : undefined} />
                            <InfoItem label="Python Runtime" value={systemInfo.python_version} />
                            <InfoItem label="ComfyUI Revision" value={systemInfo.comfyui_git_version} />
                        </InfoCard>
                    </TabPanel>

                    <TabPanel tabKey="hardware" activeTab={activeTab}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InfoCard title="GPU Status">
                                {gpuStatus.length > 0 ? (
                                    gpuStatus.map((gpu, index) => (
                                        <div key={index} className="bg-primary p-4 rounded-lg flex items-center border border-accent-blue/10">
                                            <GpuIcon />
                                            <div className="flex-grow">
                                                <p className="font-bold text-highlight-green mb-1">{gpu.name}</p>
                                                <UsageBar value={gpu.vram_used_mb} total={gpu.vram_total_mb} color="#00F5D4" unit="MB" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-accent-light bg-primary/30 rounded-lg">
                                        <p>No GPU Devices Detected</p>
                                        <span className="text-xs text-accent-blue mt-2">Waiting for hardware telemetry...</span>
                                    </div>
                                )}
                            </InfoCard>
                             <InfoCard title="Storage Status">
                                {storageStatus.length > 0 ? (
                                    storageStatus.map((disk, index) => (
                                        <div key={index} className="space-y-2 bg-primary p-3 rounded-lg border border-accent-blue/10">
                                             <div className="flex justify-between items-center">
                                                <p className="font-bold text-highlight-green text-sm">{disk.description || disk.path}</p>
                                                <span className="text-xs text-accent-light font-mono">{disk.filesystem_type}</span>
                                             </div>
                                             <UsageBar value={disk.used_gb} total={disk.total_gb} color={["#9AE19D", "#FFD700", "#83C5BE"][index % 3]} unit="GB" />
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-accent-light bg-primary/30 rounded-lg">
                                        <p>No Storage Volumes Mounted</p>
                                        <span className="text-xs text-accent-blue mt-2">Waiting for filesystem telemetry...</span>
                                    </div>
                                )}
                            </InfoCard>
                        </div>
                    </TabPanel>
                    
                    <TabPanel tabKey="services" activeTab={activeTab}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <InfoCard title="Ollama Service">
                                {ollamaStatus ? (
                                    <>
                                        <InfoItem label="Service Status" value={
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${ollamaStatus.status === 'running' ? 'bg-green-900/50 text-highlight-green' : 'bg-red-900/50 text-red-400'}`}>
                                                {ollamaStatus.status?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                        } />
                                        <InfoItem label="Version" value={ollamaStatus.version} />
                                        <InfoItem label="Installed Models" value={ollamaStatus.installed_models?.length || 0} />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-accent-light bg-primary/30 rounded-lg">
                                        <p>Service Not Detected</p>
                                        <span className="text-xs text-accent-blue mt-2">Ollama API unreachable</span>
                                    </div>
                                )}
                            </InfoCard>
                            <InfoCard title="ComfyUI Configuration">
                                {Object.keys(comfyuiPaths).length > 0 ? (
                                    Object.entries(comfyuiPaths).map(([key, value]) => (
                                        <InfoItem key={key} label={key.replace(/_/g, ' ')} value={
                                            <span className={(value as string).startsWith('Path not found') ? 'text-red-400/70' : ''}>
                                                {(value as string).replace('/opt/ki_project/ComfyUI', '$COMFY_ROOT')}
                                            </span>
                                        } />
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-accent-light bg-primary/30 rounded-lg">
                                        <p>Configuration Unavailable</p>
                                        <span className="text-xs text-accent-blue mt-2">Path mappings not loaded</span>
                                    </div>
                                )}
                            </InfoCard>
                        </div>
                    </TabPanel>
                </div>
            </div>
        </div>
    );
};

export default SystemInfoPage;