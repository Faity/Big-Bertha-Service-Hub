import React from 'react';

const files = [
    {
        name: 'index.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { SettingsProvider } from './contexts/SettingsContext';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SettingsProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </SettingsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);`
    },
    {
        name: 'vite.config.ts',
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
  },
});`
    },
    {
        name: 'types.ts',
        content: `export interface SystemInfo {
    // Static Host Info
    hostname: string;
    os_name: string;
    os_version: string;
    kernel_version: string;
    architecture: string;
    cpu_model: string;
    python_version: string;
    comfyui_git_version: string;
}

export interface OsStatus {
    // Dynamic Metrics
    cpu_usage_percent: number;
    ram_total_gb: number;
    ram_used_gb: number;
    ram_used_percent: number;
    uptime_seconds: number;
}

export interface IloMetrics {
    inlet_ambient_c: number;
    power_consumed_watts?: number;
    fan_speed_percent?: number;
}

export interface GpuInfo {
    index: number;
    name: string;
    vram_total_mb: number;
    vram_used_mb: number;
    vram_free_mb: number;
    gpu_utilization_percent: number;
    temperature_c: number;
    fan_speed_percent?: number;
}

export interface OllamaModel {
    name: string;
    size: string;
    digest: string;
    updated: string;
}

export interface OllamaStatus {
    status: string; // 'running', 'stopped'
    version: string;
    installed_models: OllamaModel[];
}

export interface ComfyUiPaths {
    base_path: string;
    custom_nodes: string;
    checkpoints: string;
    loras: string;
    vae: string;
    embeddings: string;
    controlnet: string;
    clip_vision: string;
    upscale_models: string;
    workflows: string;
}

export interface ModelsAndAssets {
    custom_nodes: string[];
    checkpoints: string[];
    loras: string[];
    vae: string[];
    controlnet: string[];
}

export interface StorageStatus {
    path: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    filesystem_type: string;
    description: string;
}

export interface SystemData {
    system_info: SystemInfo;
    os_status: OsStatus;
    gpus: GpuInfo[];
    ilo_metrics: IloMetrics;
    ollama_status: OllamaStatus;
    comfyui_paths: ComfyUiPaths;
    models_and_assets: ModelsAndAssets;
    workflows: string[];
    storage_status: StorageStatus[];
}

export interface ChartData {
    name: string;
    value: number;
}`
    },
    {
        name: 'App.tsx',
        content: `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ComfyUIPage from './pages/ComfyUIPage';
import OllamaPage from './pages/OllamaPage';
import MonitoringPage from './pages/MonitoringPage';
import SystemInfoPage from './pages/SystemInfoPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="system-info" element={<SystemInfoPage />} />
        <Route path="comfyui" element={<ComfyUIPage />} />
        <Route path="ollama" element={<OllamaPage />} />
        <Route path="monitoring" element={<MonitoringPage />} />
      </Route>
    </Routes>
  );
}

export default App;`
    },
    {
        name: 'contexts/SettingsContext.tsx',
        content: `import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
    monitorIp: string;
    setMonitorIp: (ip: string) => void;
    monitorPort: string;
    setMonitorPort: (port: string) => void;
    comfyUiPort: string;
    setComfyUiPort: (port: string) => void;
    ollamaPort: string;
    setOllamaPort: (port: string) => void;
    isSetup: boolean;
    completeSetup: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
    // Helper to get from local storage or default
    const getStoredValue = (key: string, defaultValue: string) => {
        return localStorage.getItem(key) || defaultValue;
    };

    const [monitorIp, setMonitorIpState] = useState<string>(() => getStoredValue('MONITOR_API_IP', '127.0.0.1'));
    const [monitorPort, setMonitorPortState] = useState<string>(() => getStoredValue('MONITOR_API_PORT', '8010'));
    const [comfyUiPort, setComfyUiPortState] = useState<string>(() => getStoredValue('COMFYUI_PORT', '8188'));
    const [ollamaPort, setOllamaPortState] = useState<string>(() => getStoredValue('OLLAMA_PORT', '11434'));
    
    // Check if the user has completed the initial setup (saved settings at least once)
    const [isSetup, setIsSetup] = useState<boolean>(() => {
        return localStorage.getItem('APP_SETUP_COMPLETED') === 'true';
    });

    const setMonitorIp = (ip: string) => {
        setMonitorIpState(ip);
        localStorage.setItem('MONITOR_API_IP', ip);
    };

    const setMonitorPort = (port: string) => {
        setMonitorPortState(port);
        localStorage.setItem('MONITOR_API_PORT', port);
    };

    const setComfyUiPort = (port: string) => {
        setComfyUiPortState(port);
        localStorage.setItem('COMFYUI_PORT', port);
    };

    const setOllamaPort = (port: string) => {
        setOllamaPortState(port);
        localStorage.setItem('OLLAMA_PORT', port);
    };

    const completeSetup = () => {
        setIsSetup(true);
        localStorage.setItem('APP_SETUP_COMPLETED', 'true');
    };

    return (
        <SettingsContext.Provider value={{ 
            monitorIp, setMonitorIp,
            monitorPort, setMonitorPort,
            comfyUiPort, setComfyUiPort,
            ollamaPort, setOllamaPort,
            isSetup, completeSetup
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};`
    },
    {
        name: 'hooks/useSystemData.ts',
        content: `import { useState, useEffect } from 'react';
import { SystemData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const { monitorIp, monitorPort } = useSettings();

    useEffect(() => {
        let isMounted = true;
        const apiUrl = \`http://\${monitorIp}:\${monitorPort}/api/sysmon\`;

        const fetchData = async () => {
            try {
                // Defensive: If no IP/Port is configured, don't fetch
                if (!monitorIp || !monitorPort) {
                   throw new Error("Configuration missing: Check Settings");
                }

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(\`API Error: \${response.status} \${response.statusText}\`);
                }

                const jsonData: SystemData = await response.json();
                
                if (isMounted) {
                    setData(jsonData);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error("Fetch error:", err);
                    setError(err.message || "Failed to fetch data");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // Initial fetch
        fetchData();

        // Poll every 2 seconds for live feeling
        const intervalId = setInterval(fetchData, 2000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [monitorIp, monitorPort]);

    return { data, loading, error };
};`
    },
    {
        name: 'components/Layout.tsx',
        content: `import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import { useSettings } from '../contexts/SettingsContext';
import DownloadSourceButton from './DownloadSourceButton';

const CpuChipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M5 12h2a7 7 0 0110 0h2a9 9 0 00-14 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { path: '/system-info', label: 'System Info', icon: <InformationCircleIcon /> },
    { path: '/comfyui', label: 'ComfyUI', icon: <PaintBrushIcon /> },
    { path: '/ollama', label: 'Ollama', icon: <ChatBubbleIcon /> },
    { path: '/monitoring', label: 'Monitoring', icon: <ChartBarIcon /> },
];

const Layout = () => {
    const { isSetup } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Automatically open settings if not set up
    useEffect(() => {
        if (!isSetup) {
            setIsSettingsOpen(true);
        }
    }, [isSetup]);

    const navLinkClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200';
    const inactiveClasses = 'text-accent-light hover:bg-accent-blue hover:text-white';
    const activeClasses = 'bg-highlight-cyan text-primary font-bold shadow-lg';

    return (
        <div className="flex h-screen bg-primary font-sans">
            <aside className="w-64 bg-secondary flex flex-col p-4 border-r border-accent-blue/20">
                <div className="flex items-center space-x-2 p-2 mb-8">
                    <CpuChipIcon />
                    <h1 className="text-xl font-bold text-text-main leading-tight">Big Bertha <br /> Service Hub</h1>
                </div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => \`\${navLinkClasses} \${isActive ? activeClasses : inactiveClasses}\`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto text-xs text-accent-light space-y-4">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-light hover:bg-accent-blue hover:text-white transition-colors duration-200"
                    >
                        <CogIcon />
                        <span>Settings</span>
                    </button>
                    <DownloadSourceButton />
                    <div className="text-center pt-4 border-t border-accent-blue/10">
                      <p>HPE ML350 Gen10</p>
                      <p>&copy; 2024 Localhost Services</p>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8 bg-primary">
                <Outlet />
            </main>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default Layout;`
    },
    {
        name: 'components/SettingsModal.tsx',
        content: `import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { 
        monitorIp, setMonitorIp,
        monitorPort, setMonitorPort,
        comfyUiPort, setComfyUiPort,
        ollamaPort, setOllamaPort,
        completeSetup
    } = useSettings();

    const [ipInput, setIpInput] = useState(monitorIp);
    const [monitorPortInput, setMonitorPortInput] = useState(monitorPort);
    const [comfyPortInput, setComfyPortInput] = useState(comfyUiPort);
    const [ollamaPortInput, setOllamaPortInput] = useState(ollamaPort);

    // Sync local state with context when modal opens or context changes
    useEffect(() => {
        setIpInput(monitorIp);
        setMonitorPortInput(monitorPort);
        setComfyPortInput(comfyUiPort);
        setOllamaPortInput(ollamaPort);
    }, [monitorIp, monitorPort, comfyUiPort, ollamaPort, isOpen]);

    const handleSave = () => {
        setMonitorIp(ipInput);
        setMonitorPort(monitorPortInput);
        setComfyUiPort(comfyPortInput);
        setOllamaPort(ollamaPortInput);
        completeSetup(); // Mark first-run setup as complete
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-up" 
            style={{ animationDuration: '0.2s' }}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-secondary rounded-lg shadow-xl p-6 border border-accent-blue/30 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-highlight-cyan">Network Configuration</h2>
                    <button onClick={onClose} className="text-accent-light hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="monitor-ip" className="block text-sm font-medium text-accent-light mb-1">
                            Server Hostname / IP
                        </label>
                        <input
                            type="text"
                            id="monitor-ip"
                            value={ipInput}
                            onChange={(e) => setIpInput(e.target.value)}
                            placeholder="e.g., 192.168.1.70"
                            className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                        />
                         <p className="text-xs text-accent-light/70 mt-1">
                            The central IP address for the Local Big Bertha server.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="monitor-port" className="block text-sm font-medium text-accent-light mb-1">
                                Monitor Port
                            </label>
                            <input
                                type="number"
                                id="monitor-port"
                                value={monitorPortInput}
                                onChange={(e) => setMonitorPortInput(e.target.value)}
                                placeholder="8010"
                                className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                            />
                        </div>
                        <div>
                            <label htmlFor="comfy-port" className="block text-sm font-medium text-accent-light mb-1">
                                ComfyUI Port
                            </label>
                            <input
                                type="number"
                                id="comfy-port"
                                value={comfyPortInput}
                                onChange={(e) => setComfyPortInput(e.target.value)}
                                placeholder="8188"
                                className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                            />
                        </div>
                        <div>
                            <label htmlFor="ollama-port" className="block text-sm font-medium text-accent-light mb-1">
                                Ollama Port
                            </label>
                            <input
                                type="number"
                                id="ollama-port"
                                value={ollamaPortInput}
                                onChange={(e) => setOllamaPortInput(e.target.value)}
                                placeholder="11434"
                                className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-accent-light/70">
                        Default ports: Monitor (8010), ComfyUI (8188), Ollama (11434).
                    </p>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-accent-light hover:text-white hover:bg-accent-blue/30 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 rounded-lg bg-highlight-cyan text-primary font-bold hover:bg-highlight-cyan/90 transition-colors shadow-lg shadow-highlight-cyan/20"
                    >
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;`
    },
    {
        name: 'components/ErrorBoundary.tsx',
        content: `import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D1B2A] text-[#E0E1DD] flex items-center justify-center p-8 font-mono">
          <div className="max-w-3xl w-full bg-[#1B263B] border-2 border-red-500/50 rounded-xl p-8 shadow-2xl shadow-red-900/20">
            <div className="flex items-center gap-4 mb-6 border-b border-red-500/30 pb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-3xl font-bold text-red-400">System Critical Error</h1>
            </div>
            
            <p className="text-xl mb-4">The application encountered an unexpected error and had to stop.</p>
            
            <div className="bg-[#0D1B2A] p-4 rounded-lg border border-red-500/20 overflow-auto max-h-64 mb-6">
              <p className="text-red-300 font-bold mb-2">{this.state.error?.toString()}</p>
              <pre className="text-xs text-[#778DA9] whitespace-pre-wrap">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>

            <div className="flex justify-end gap-4">
               <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.058T4.058 9H3v1h11v-1H3V4h1zm.058 5H21v5h-1v-4H5.058zM4 14v5h16v-1H4v-4z" /> 
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                System Reboot (Reload)
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`
    },
    {
        name: 'pages/HomePage.tsx',
        content: `import React from 'react';
import { Link } from 'react-router-dom';

const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-highlight-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const ServiceCard = ({ icon, title, description, to }: { icon: React.ReactNode, title: string, description: string, to: string }) => (
    <Link to={to} className="bg-secondary p-8 rounded-xl border border-accent-blue/20 hover:border-highlight-cyan/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-highlight-cyan/10 flex flex-col items-center text-center">
        {icon}
        <h3 className="text-2xl font-bold text-highlight-green mb-2">{title}</h3>
        <p className="text-accent-light">{description}</p>
    </Link>
);

const HomePage = () => {
    return (
        <div className="animate-fade-in-up">
            <div 
                className="relative bg-secondary p-12 rounded-2xl border border-accent-blue/20 mb-12 overflow-hidden"
                style={{
                    backgroundImage: \`
                        radial-gradient(circle at 1px 1px, rgba(119, 141, 169, 0.2) 1px, transparent 0),
                        radial-gradient(circle at top left, rgba(0, 245, 212, 0.1), transparent 40%),
                        radial-gradient(circle at bottom right, rgba(154, 225, 157, 0.1), transparent 40%)
                    \`,
                    backgroundSize: '20px 20px, 100% 100%, 100% 100%'
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/30"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-left">
                        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Local Big Bertha <br /> Service Hub</span>
                        </h1>
                        <p className="text-lg text-accent-light mb-6 max-w-2xl">
                            Your unified dashboard for the HPE ML350 Gen10. Access, manage, and monitor high-performance local services with ease.
                        </p>
                    </div>
                    <div className="flex-shrink-0 animate-pulse-glow rounded-xl w-[400px] h-[300px]">
                        <img 
                            src="https://storage.googleapis.com/bot-sandbox-public-images/51a316b2-658f-4f51-872f-524f0c4063bd.png"
                            alt="Ein HPE-Server in einer futuristischen, Hightech-Stadtlandschaft" 
                            className="w-full h-full rounded-xl object-cover shadow-2xl shadow-black/50 border-2 border-highlight-cyan/20"
                        />
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ServiceCard 
                    icon={<InformationCircleIcon />}
                    title="System Info"
                    description="Detailed overview of system hardware, software, and storage."
                    to="/system-info"
                />
                 <ServiceCard 
                    icon={<PaintBrushIcon />}
                    title="ComfyUI"
                    description="Node-based interface for advanced image generation and workflow creation."
                    to="/comfyui"
                />
                <ServiceCard 
                    icon={<ChatBubbleIcon />}
                    title="Ollama"
                    description="Run powerful large language models like Llama 3 locally."
                    to="/ollama"
                />
                <ServiceCard 
                    icon={<ChartBarIcon />}
                    title="Server Monitoring"
                    description="Live performance metrics for CPU, RAM, Disk, and Network."
                    to="/monitoring"
                />
            </div>
        </div>
    );
};

export default HomePage;`
    },
    {
        name: 'pages/SystemInfoPage.tsx',
        content: `import React, { useState } from 'react';
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

    // Destructure safe references
    const { system_info, storage_status, comfyui_paths, gpus } = data;

    return (
        <div className="animate-fade-in-up space-y-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">System Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Static System Info */}
                <InfoCard title="Host Details">
                    <InfoItem label="Hostname" value={system_info?.hostname} />
                    <InfoItem label="OS" value={\`\${system_info?.os_name} \${system_info?.os_version}\`} />
                    <InfoItem label="Kernel" value={system_info?.kernel_version} />
                    <InfoItem label="Architecture" value={system_info?.architecture} />
                    <InfoItem label="Python Env" value={system_info?.python_version} />
                </InfoCard>

                {/* CPU Info */}
                <InfoCard title="Processor">
                    <InfoItem label="Model" value={system_info?.cpu_model} />
                </InfoCard>

                 {/* GPU Info */}
                 <InfoCard title="Graphics Hardware">
                    {gpus && gpus.length > 0 ? gpus.map((gpu, idx) => (
                        <div key={idx} className="border-b border-accent-blue/10 last:border-0 pb-2 mb-2 last:mb-0 last:pb-0">
                            <InfoItem label="Model" value={gpu.name} />
                            <InfoItem label="Memory" value={\`\${(gpu.vram_total_mb / 1024).toFixed(1)} GB\`} />
                            <InfoItem label="Driver Temp" value={\`\${gpu.temperature_c}°C\`} />
                        </div>
                    )) : <p className="text-accent-light italic">No dedicated GPU detected</p>}
                </InfoCard>

                 {/* Storage Info */}
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
                                                style={{ width: \`\${(disk.used_gb / disk.total_gb) * 100}%\` }}
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

                 {/* Paths Info */}
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

export default SystemInfoPage;`
    },
    {
        name: 'pages/ComfyUIPage.tsx',
        content: `import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';
import { useSettings } from '../contexts/SettingsContext';

const AccordionItem = ({ title, items }: { title: string, items: string[] | undefined }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Defensive check for items
    if (!items || !Array.isArray(items) || items.length === 0) {
        return (
            <div className="border-b border-accent-blue/20">
                <div className="flex justify-between items-center p-4 opacity-50">
                    <h3 className="text-lg font-semibold text-accent-light">{title}</h3>
                    <span className="text-accent-light text-sm">Empty</span>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b border-accent-blue/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full p-4 text-left focus:outline-none hover:bg-accent-blue/10 transition-colors"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-highlight-green">{title}</h3>
                <div className='flex items-center space-x-2'>
                    <span className="text-sm bg-accent-blue text-text-main rounded-full px-2 py-0.5">{items.length}</span>
                    <svg
                        className={\`w-5 h-5 transform transition-transform duration-300 \${isOpen ? 'rotate-180' : ''}\`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <div className={\`transition-all duration-300 ease-in-out overflow-hidden \${isOpen ? 'max-h-96' : 'max-h-0'}\`}>
                <ul className="p-4 pt-0 space-y-1 max-h-80 overflow-y-auto custom-scrollbar">
                    {items.map((item, index) => (
                        <li key={index} className="text-accent-light bg-primary/50 px-3 py-2 rounded border border-accent-blue/10 font-mono text-xs truncate" title={item}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ComfyUIPage = () => {
    const { monitorIp, comfyUiPort } = useSettings();
    const { data, loading, error } = useSystemData();
    const comfyUiUrl = \`http://\${monitorIp}:\${comfyUiPort}\`;

    return (
        <div className="flex flex-col h-full animate-fade-in-up space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">ComfyUI Workbench</h2>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                         {/* Simple visual indicator */}
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-highlight-green"></span>
                    </span>
                    <a href={comfyUiUrl} target="_blank" rel="noreferrer" className="text-sm text-highlight-green hover:underline">
                        Open in New Tab
                    </a>
                </div>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100%-100px)]">
                {/* Iframe Area */}
                <div className="lg:col-span-3 bg-black rounded-xl overflow-hidden border-2 border-accent-blue/30 shadow-2xl">
                    <iframe
                        src={comfyUiUrl}
                        title="ComfyUI"
                        className="w-full h-full border-0"
                        allow="clipboard-read; clipboard-write"
                    />
                </div>

                {/* Sidebar Assets */}
                <div className="lg:col-span-1 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-accent-blue/20 bg-primary/30">
                        <h3 className="text-xl font-bold text-highlight-cyan">Asset Library</h3>
                    </div>
                    
                    <div className="flex-grow overflow-y-auto">
                        {loading && !data && <div className="p-4 text-center text-accent-light animate-pulse">Scanning assets...</div>}
                        {error && !data && <div className="p-4 text-center text-red-400">Failed to load assets</div>}
                        
                        {data && (
                            <>
                                <AccordionItem title="Workflows" items={data.workflows} />
                                <AccordionItem title="Checkpoints" items={data.models_and_assets?.checkpoints} />
                                <AccordionItem title="LoRAs" items={data.models_and_assets?.loras} />
                                <AccordionItem title="Custom Nodes" items={data.models_and_assets?.custom_nodes} />
                                <AccordionItem title="ControlNet" items={data.models_and_assets?.controlnet} />
                            </>
                        )}
                    </div>
                    
                    <div className="p-2 border-t border-accent-blue/20 text-xs text-center text-accent-light/50">
                        Syncs with /api/sysmon
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComfyUIPage;`
    },
    {
        name: 'pages/OllamaPage.tsx',
        content: `import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';
import { useSettings } from '../contexts/SettingsContext';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const OllamaPage = () => {
    const { data, loading, error } = useSystemData();
    const { monitorIp, ollamaPort } = useSettings();
    const [message, setMessage] = useState('');
    
    // Chat UI state (purely frontend for now as per requirements)
    const [chatHistory, setChatHistory] = useState([
        { sender: 'ai', text: 'Ollama subsystem initialized. How can I assist you with the local models?' }
    ]);
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        const newUserMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, newUserMessage]);
        setMessage('');
        setIsSending(true);

        // Simulation response for UI demo
        setTimeout(() => {
            const aiResponse = { sender: 'ai', text: \`Echo: \${newUserMessage.text} (This is a UI placeholder. Real chat integration requires backend endpoints.)\` };
            setChatHistory(prev => [...prev, aiResponse]);
            setIsSending(false);
        }, 1000);
    };

    // Safe access
    const status = data?.ollama_status;
    const isRunning = status?.status === 'running';

    return (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column: Status & Models */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full max-h-[calc(100vh-120px)]">
                
                {/* Status Card */}
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
                    <h2 className="text-2xl font-bold mb-4 text-highlight-green">Service Status</h2>
                    <div className="flex items-center space-x-3 mb-4">
                         <div className={\`w-3 h-3 rounded-full \${isRunning ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500'}\`}></div>
                         <span className={\`font-mono \${isRunning ? 'text-text-main' : 'text-red-400'}\`}>
                            {loading && !data ? 'CHECKING...' : (isRunning ? 'ONLINE' : 'OFFLINE')}
                         </span>
                    </div>
                    {status && (
                        <div className="text-xs font-mono text-accent-light space-y-1">
                            <p>Version: {status.version}</p>
                            <p>Target: http://{monitorIp}:{ollamaPort}</p>
                        </div>
                    )}
                    {error && !data && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>

                {/* Models List */}
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 flex-grow overflow-hidden flex flex-col">
                    <h3 className="text-xl font-bold mb-4 text-highlight-green">Local Models</h3>
                    
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        {loading && !data && <p className="text-accent-light animate-pulse">Fetching library...</p>}
                        
                        {status?.installed_models && status.installed_models.length > 0 ? (
                            <ul className="space-y-3">
                                {status.installed_models.map((model, idx) => (
                                    <li key={idx} className="bg-primary p-3 rounded-lg border border-accent-blue/10 hover:border-highlight-cyan/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-sm text-text-main truncate w-3/4" title={model.name}>{model.name}</p>
                                            <span className="text-[10px] bg-accent-blue/30 px-1.5 py-0.5 rounded text-highlight-cyan">{model.size}</span>
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] text-accent-light font-mono">
                                            <span>{model.digest.substring(0, 12)}...</span>
                                            <span>{model.updated}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !loading && <p className="text-accent-light italic text-sm">No models found in library.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Chat Interface */}
            <div className="lg:col-span-2 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col h-[calc(100vh-120px)]">
                <div className="p-4 border-b border-accent-blue/20 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-highlight-cyan">Interactive Console</h2>
                    <span className="text-xs text-accent-light uppercase tracking-widest">Demo Mode</span>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={\`flex \${chat.sender === 'user' ? 'justify-end' : 'justify-start'}\`}>
                            <div className={\`max-w-[80%] px-4 py-3 rounded-xl shadow-md \${chat.sender === 'user' ? 'bg-highlight-cyan text-primary font-medium' : 'bg-accent-blue/40 text-text-main border border-accent-blue/30'}\`}>
                                <p className="text-sm leading-relaxed">{chat.text}</p>
                            </div>
                        </div>
                    ))}
                    {isSending && (
                         <div className="flex justify-start">
                            <div className="bg-accent-blue/40 px-4 py-3 rounded-xl">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-accent-blue/20 bg-primary/30 rounded-b-xl">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message to Ollama..."
                            className="flex-grow bg-primary p-3 rounded-lg border border-accent-blue/30 focus:outline-none focus:border-highlight-cyan text-text-main placeholder-accent-light/50 transition-colors"
                            disabled={isSending || !isRunning}
                        />
                        <button
                            type="submit"
                            className="bg-highlight-cyan hover:bg-highlight-cyan/90 text-primary p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-highlight-cyan/20"
                            disabled={isSending || !isRunning}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OllamaPage;`
    },
    {
        name: 'pages/MonitoringPage.tsx',
        content: `import React from 'react';
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
        <h3 className={\`text-sm font-bold uppercase tracking-wider mb-2 \${color}\`}>{title}</h3>
        {children}
    </div>
);

const ProgressBar = ({ value, max, colorClass }: { value: number, max: number, colorClass: string }) => {
    // Defensive check for inputs
    const safeValue = value ?? 0;
    const safeMax = max > 0 ? max : 100;
    const percent = Math.min(100, Math.max(0, (safeValue / safeMax) * 100));
    
    return (
        <div className="w-full bg-primary h-3 rounded-full overflow-hidden border border-accent-blue/30 mt-2">
            <div 
                className={\`h-full transition-all duration-500 ease-out \${colorClass}\`} 
                style={{ width: \`\${percent}%\` }}
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
                     <div className="flex items-center justify-center h-full">
                        {ilo ? (
                             <div className="text-center">
                                <span className="text-4xl font-mono font-bold text-white">{ilo.inlet_ambient_c}°C</span>
                                <p className="text-xs text-accent-light mt-1">Ambient Sensor</p>
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
                                    <span className={\`text-xl font-bold \${(gpu.temperature_c ?? 0) > 80 ? 'text-red-400' : 'text-green-400'}\`}>
                                        {gpu.temperature_c ?? 'N/A'}°C
                                    </span>
                                    <p className="text-xs text-accent-light">Core Temp</p>
                                </div>
                            </div>
                            
                            {/* VRAM Bar */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-accent-light">VRAM Usage</span>
                                    <span className="text-highlight-cyan">{((gpu.vram_used_mb ?? 0) / 1024).toFixed(1)} / {((gpu.vram_total_mb ?? 0) / 1024).toFixed(1)} GB</span>
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

export default MonitoringPage;`
    }
];

const DownloadSourceButton = () => {
    const handleDownload = () => {
        let fullText = "";
        files.forEach(f => {
            fullText += `--- START OF FILE ${f.name} ---\n\n${f.content}\n\n`;
        });
        
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LocalBigBertha_Source.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="w-full bg-accent-blue/20 hover:bg-accent-blue/40 border border-accent-blue/50 text-highlight-cyan font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-2"
            aria-label="Download Source Code"
        >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Source</span>
        </button>
    );
};

export default DownloadSourceButton;