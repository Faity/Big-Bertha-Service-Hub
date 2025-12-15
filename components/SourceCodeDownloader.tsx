import React from 'react';
import { Download } from 'lucide-react';

const APP_VERSION = "3.0.1";

const files = [
    {
        name: 'metadata.json',
        content: `{
  "name": "Big Bertha Command Center v3.0",
  "description": "Next-Gen Server Management Dashboard for HPE ML350 Gen10. Features real-time Redfish monitoring, AI service status, and GPU telemetry.",
  "version": "${APP_VERSION}",
  "requestFramePermissions": []
}`
    },
    {
        name: 'vite.config.ts',
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});`
    },
    {
        name: 'index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Big Bertha Command Center</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              background: '#0D1117',
              panel: '#161B22',
              border: '#30363D',
              'hpe-green': '#01A982',
              'hpe-cyan': '#00F3FF',
              'alert-red': '#FF4D4D',
              'warn-yellow': '#FFC500',
              text: {
                primary: '#E6EDF3',
                secondary: '#8B949E'
              }
            },
            fontFamily: {
              mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            animation: {
              'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
          }
        }
      }
    </script>
  </head>
  <body class="bg-background text-text-primary antialiased selection:bg-hpe-green selection:text-white">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`
    },
    {
        name: 'types.ts',
        content: `export interface AppConfig {
    ilo_url: string;
    ilo_user: string;
    ilo_pass: string;
    comfy_url: string;
    ollama_url: string;
}

export interface SystemStats {
    cpu_usage: number;
    ram_used: number;
    ram_total: number;
}

export interface GpuStats {
    index: number;
    name: string;
    temp: number;
    power: number;
    vram_used: number;
    vram_total: number;
    utilization: number;
    is_compute_only: boolean;
}

// Aliases and Compatibility Types
export type GpuInfo = GpuStats;

export interface IloMetrics {
    inlet_ambient_c: number;
    power_consumed_watts?: number;
    fan_speed_percent?: number;
}

export interface OllamaModel {
    name: string;
    size: string;
    digest: string;
    updated: string;
}

export interface OllamaStatus {
    status: string;
    version: string;
    installed_models: OllamaModel[];
}

export interface StorageStatus {
    path: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    filesystem_type: string;
    description: string;
}

export interface SystemInfo {
    hostname: string;
    os_name?: string;
    os_version?: string;
    kernel_version?: string;
    architecture?: string;
    cpu_model?: string;
    python_version?: string;
}

export interface ChartData {
    name: string;
    value: number;
}

export interface ModelsAndAssets {
    checkpoints?: string[];
    loras?: string[];
    custom_nodes?: string[];
    controlnet?: string[];
    vae?: string[];
}

export interface OsStatus {
    cpu_usage_percent: number;
    ram_total_gb: number;
    ram_used_gb: number;
}

export interface SysMonResponse {
    system: SystemStats;
    gpus: GpuStats[];
    
    // Optional Extended Fields
    workflows?: string[];
    models_and_assets?: ModelsAndAssets;
    ollama_status?: OllamaStatus;
    os_status?: OsStatus; // Legacy mapping
    ilo_metrics?: IloMetrics;
    system_info?: SystemInfo;
    storage_status?: StorageStatus[];
    comfyui_paths?: Record<string, string>;
}

export type SystemData = SysMonResponse;`
    },
    {
        name: 'contexts/SettingsContext.tsx',
        content: `import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig } from '../types';

interface SettingsContextType {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  updateConfig: (newConfig: AppConfig) => Promise<void>;
  refreshConfig: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default empty config to prevent null checks everywhere
const DEFAULT_CONFIG: AppConfig = {
    ilo_url: "https://192.168.1.100",
    ilo_user: "admin",
    ilo_pass: "",
    comfy_url: "http://localhost:8188",
    ollama_url: "http://localhost:11434"
};

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch Config from Backend on Mount
  useEffect(() => {
    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/config');
            
            // Handle 404 specifically - Fallback to defaults if endpoint missing
            if (res.status === 404) {
                console.warn("Config endpoint (/api/config) not found. Using default configuration.");
                setConfig(DEFAULT_CONFIG);
                setError(null);
                return;
            }

            if (!res.ok) throw new Error(\`Backend Error: \${res.status}\`);
            
            const data: AppConfig = await res.json();
            setConfig(data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to load config:", err);
            // Non-blocking error: allow app to render with defaults, but show warning
            setError("Could not sync with Backend (Port 8000). Using local defaults.");
            setConfig(DEFAULT_CONFIG);
        } finally {
            setIsLoading(false);
        }
    };

    fetchConfig();
  }, [refreshTrigger]);

  const updateConfig = async (newConfig: AppConfig) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConfig)
        });
        
        if (!res.ok) throw new Error("Failed to save configuration to backend");
        
        // Optimistic update
        setConfig(newConfig);
        setError(null);
    } catch (err: any) {
        setError(err.message);
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const refreshConfig = () => setRefreshTrigger(prev => prev + 1);

  return (
    <SettingsContext.Provider value={{
      config,
      isLoading,
      error,
      updateConfig,
      refreshConfig
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};`
    },
    {
        name: 'hooks/useSystemData.ts',
        content: `import { useState, useEffect } from 'react';
import { SysMonResponse } from '../types';

export const useSystemData = () => {
    const [data, setData] = useState<SysMonResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Polls the Python Backend
                const response = await fetch('/api/sysmon');

                if (!response.ok) {
                    throw new Error(\`SysMon API Error: \${response.status}\`);
                }

                const json: SysMonResponse = await response.json();
                
                if (isMounted) {
                    setData(json);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    // console.error("SysMon polling error:", err);
                    // Don't spam console, just set error state
                    setError(err.message || "Failed to fetch system data");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000); // High frequency polling (1s)

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return { data, loading, error };
};`
    },
    {
        name: 'components/GpuCluster.tsx',
        content: `import React from 'react';
import { GpuStats } from '../types';
import { Zap, Thermometer, Activity, Box, MonitorPlay } from 'lucide-react';

const ProgressBar = ({ value, total, colorClass }: { value: number, total: number, colorClass: string }) => {
    const percent = Math.min(100, Math.max(0, (value / total) * 100));
    return (
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5 mt-1">
            <div 
                className={\`h-full transition-all duration-300 ease-out \${colorClass}\`} 
                style={{ width: \`\${percent}%\` }}
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
        <div className={\`bg-panel border \${borderColor} p-4 rounded-lg flex flex-col justify-between relative overflow-hidden group hover:border-opacity-50 transition-all\`}>
            {/* Background Gradient */}
            <div className={\`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br \${isCompute ? 'from-hpe-green/5' : 'from-hpe-cyan/5'} to-transparent rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none\`}></div>

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
                    <span className={\`text-xl font-mono font-bold \${gpu.utilization > 90 ? 'text-alert-red' : 'text-white'}\`}>
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

export default GpuCluster;`
    },
    {
        name: 'pages/Dashboard.tsx',
        content: `import React, { useState, useEffect } from 'react';
import { useSystemData } from '../hooks/useSystemData';
import { useSettings } from '../contexts/SettingsContext';
import { GpuCluster } from '../components/GpuCluster';
import { Server, Database, Cpu, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

// Simple Service Status Checker
const ServiceStatus = ({ name, url }: { name: string, url: string }) => {
    const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');

    useEffect(() => {
        if (!url) {
            setStatus('offline');
            return;
        }

        const check = async () => {
            try {
                // In a real scenario, we might need a CORS proxy or the backend to ping this.
                // Assuming simple reachability check or backend proxy for now.
                // Since user requested frontend-ping:
                await fetch(url, { mode: 'no-cors' }); 
                // 'no-cors' allows us to send request, but we can't read response. 
                // However, if it fails network error, it throws.
                setStatus('online');
            } catch (e) {
                setStatus('offline');
            }
        };
        check();
        const interval = setInterval(check, 10000);
        return () => clearInterval(interval);
    }, [url]);

    return (
        <div className="flex items-center justify-between p-3 bg-panel border border-border rounded-lg">
            <div className="flex items-center gap-3">
                {status === 'online' ? <CheckCircle2 className="text-hpe-green" size={18} /> : 
                 status === 'offline' ? <AlertCircle className="text-alert-red" size={18} /> :
                 <Activity className="text-warn-yellow animate-pulse" size={18} />}
                <div>
                    <div className="font-bold text-sm text-white">{name}</div>
                    <div className="text-[10px] text-text-secondary truncate max-w-[150px]">{url || 'Not Configured'}</div>
                </div>
            </div>
            <div className={\`text-[10px] font-bold px-2 py-0.5 rounded uppercase \${
                status === 'online' ? 'bg-hpe-green/20 text-hpe-green' : 
                'bg-alert-red/20 text-alert-red'
            }\`}>
                {status}
            </div>
        </div>
    );
};

// iLO Status Fetcher (via Backend Proxy)
const IloStatus = () => {
    const [health, setHealth] = useState<string>("Unknown");
    
    useEffect(() => {
        const fetchIlo = async () => {
            try {
                // Calls Backend Proxy -> iLO
                const res = await fetch('/api/redfish/v1/Systems/1');
                if (res.ok) {
                    const data = await res.json();
                    setHealth(data?.Status?.Health || "Unknown");
                } else {
                    setHealth("Error");
                }
            } catch {
                setHealth("Unreachable");
            }
        };
        fetchIlo();
        const interval = setInterval(fetchIlo, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-panel border border-border p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-hpe-green/10 rounded text-hpe-green">
                    <Server size={20} />
                </div>
                <div>
                    <div className="text-sm font-bold text-white">iLO 5 Controller</div>
                    <div className="text-xs text-text-secondary">Proxy: /api/redfish/v1</div>
                </div>
            </div>
            <div className="text-right">
                <div className={\`text-lg font-mono font-bold \${health === 'OK' ? 'text-hpe-green' : 'text-alert-red'}\`}>
                    {health}
                </div>
                <div className="text-[10px] text-text-secondary">HEALTH</div>
            </div>
        </div>
    );
};

const Dashboard = () => {
  const { data, loading, error } = useSystemData();
  const { config } = useSettings();

  if (loading && !data) return (
      <div className="h-full flex flex-col items-center justify-center text-hpe-green animate-pulse">
          <Activity size={48} />
          <p className="mt-4 font-mono">ESTABLISHING UPLINK TO LOCALHOST:8000...</p>
      </div>
  );

  if (error && !data) return (
      <div className="p-8 border-2 border-alert-red/50 bg-alert-red/10 rounded-xl text-center">
          <h2 className="text-xl font-bold text-alert-red mb-2">TELEMETRY LOST</h2>
          <p className="text-white mb-4">{error}</p>
          <p className="text-sm text-text-secondary">Ensure the Python backend is running on port 8000.</p>
      </div>
  );

  const sys = data?.system || { cpu_usage: 0, ram_used: 0, ram_total: 1 };
  const ramData = [
      { name: 'Used', value: sys.ram_used, color: '#00F3FF' },
      { name: 'Free', value: sys.ram_total - sys.ram_used, color: '#161B22' }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Top Row: System Vitality */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CPU Tile */}
        <div className="bg-panel border border-border p-5 rounded-xl flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2 text-text-secondary">
                    <Cpu size={18} />
                    <span className="font-bold text-xs tracking-wider">CPU LOAD</span>
                </div>
                <span className="text-2xl font-mono font-bold text-white">{sys.cpu_usage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-black/40 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-white transition-all duration-500" style={{ width: \`\${sys.cpu_usage}%\` }}></div>
            </div>
            <div className="absolute -right-6 -bottom-6 text-white/5">
                <Cpu size={100} />
            </div>
        </div>

        {/* RAM Tile */}
        <div className="bg-panel border border-border p-5 rounded-xl flex items-center gap-4 relative">
             <div className="h-16 w-16 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={ramData} 
                            dataKey="value" 
                            innerRadius={25} 
                            outerRadius={32} 
                            startAngle={90} 
                            endAngle={-270}
                            stroke="none"
                        >
                            {ramData.map((entry, index) => (
                                <Cell key={\`cell-\${index}\`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Database size={14} className="text-hpe-cyan" />
                </div>
             </div>
             <div>
                 <div className="text-xs text-text-secondary font-bold tracking-wider">MEMORY</div>
                 <div className="text-xl font-mono font-bold text-white">
                     {sys.ram_used.toFixed(0)} <span className="text-sm text-text-secondary">/ {sys.ram_total} GB</span>
                 </div>
             </div>
        </div>

        {/* iLO Health */}
        <IloStatus />

      </div>

      {/* Middle Row: GPU Cluster */}
      <div>
          <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-6 bg-hpe-green rounded-full"></span>
              <h2 className="text-xl font-bold text-white tracking-tight">GPU ACCELERATION CLUSTER</h2>
          </div>
          <GpuCluster gpus={data?.gpus || []} />
      </div>

      {/* Bottom Row: AI Services Status */}
      <div className="bg-panel border border-border rounded-xl p-6">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Service Mesh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ServiceStatus name="ComfyUI Node" url={config.comfy_url} />
            <ServiceStatus name="Ollama LLM" url={config.ollama_url} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;`
    },
    {
        name: 'pages/SettingsPage.tsx',
        content: `import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Save, AlertCircle, Loader2, ServerCog } from 'lucide-react';
import { AppConfig } from '../types';
import { SourceCodeDownloader } from '../components/SourceCodeDownloader';

const InputField = ({ label, value, onChange, type = "text", disabled = false }: { label: string, value: string, onChange: (val: string) => void, type?: string, disabled?: boolean }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="w-full bg-background border border-border rounded-lg p-3 text-text-primary focus:outline-none focus:border-hpe-cyan transition-colors font-mono text-sm disabled:opacity-50"
    />
  </div>
);

const SettingsPage = () => {
  const { config, isLoading, error, updateConfig } = useSettings();
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  // Sync local state when context config loads
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleSave = async () => {
      setIsSaving(true);
      setMessage(null);
      try {
          await updateConfig(localConfig);
          setMessage({ type: 'success', text: 'Configuration saved to server .env file' });
      } catch (err) {
          setMessage({ type: 'error', text: 'Failed to save configuration.' });
      } finally {
          setIsSaving(false);
      }
  };

  if (isLoading && !isSaving) {
      return <div className="p-10 text-center text-hpe-cyan animate-pulse">Loading configuration from server...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">System Configuration</h2>
          <p className="text-text-secondary">Server-side configuration managed via Python Backend.</p>
        </div>
      </div>

      {error && (
         <div className="bg-alert-red/10 border border-alert-red p-4 rounded-lg flex items-center gap-3 text-alert-red">
             <AlertCircle />
             <span>{error}</span>
         </div>
      )}

      {message && (
          <div className={\`p-4 rounded-lg border \${message.type === 'success' ? 'bg-hpe-green/10 border-hpe-green text-hpe-green' : 'bg-alert-red/10 border-alert-red text-alert-red'}\`}>
              {message.text}
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hardware Settings */}
        <div className="bg-panel border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-hpe-green mb-6 flex items-center gap-2">
            HPE iLO Connection
          </h3>
          <InputField 
            label="iLO URL" 
            value={localConfig.ilo_url} 
            onChange={(v) => setLocalConfig({...localConfig, ilo_url: v})} 
          />
          <InputField 
            label="Username" 
            value={localConfig.ilo_user} 
            onChange={(v) => setLocalConfig({...localConfig, ilo_user: v})} 
          />
          <InputField 
            label="Password" 
            type="password" 
            value={localConfig.ilo_pass} 
            onChange={(v) => setLocalConfig({...localConfig, ilo_pass: v})} 
          />
        </div>

        {/* AI Service Settings */}
        <div className="bg-panel border border-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-hpe-cyan mb-6 flex items-center gap-2">
              AI Service Endpoints
            </h3>
            <InputField 
              label="ComfyUI URL" 
              value={localConfig.comfy_url} 
              onChange={(v) => setLocalConfig({...localConfig, comfy_url: v})} 
            />
            <InputField 
              label="Ollama URL" 
              value={localConfig.ollama_url} 
              onChange={(v) => setLocalConfig({...localConfig, ollama_url: v})} 
            />
          </div>

          {/* System Maintenance Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ServerCog size={20} className="text-warn-yellow"/>
              Maintenance & Version
            </h3>
            <div className="flex justify-between items-center bg-background p-4 rounded-lg border border-border">
                <div>
                  <div className="text-sm font-bold text-white">Big Bertha Hub</div>
                  <div className="text-xs text-hpe-green font-mono">v3.0.0</div>
                </div>
                <SourceCodeDownloader />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-hpe-green hover:bg-hpe-green/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg shadow-hpe-green/20 transition-all"
        >
          {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save to Server
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;`
    },
    {
        name: 'App.tsx',
        content: `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';

const AiServicesPlaceholder = () => (
  <div className="p-8 text-center text-text-secondary border border-dashed border-border rounded-xl">
    <h2 className="text-2xl font-bold text-white mb-2">AI Services Detail View</h2>
    <p>Detailed queue management for ComfyUI and Model Browser for Ollama would go here.</p>
  </div>
);

const HardwarePlaceholder = () => (
    <div className="p-8 text-center text-text-secondary border border-dashed border-border rounded-xl">
    <h2 className="text-2xl font-bold text-white mb-2">Deep Hardware Telemetry</h2>
    <p>Raw Redfish JSON data explorer and detailed fan curves would go here.</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="ai-services" element={<AiServicesPlaceholder />} />
        <Route path="hardware" element={<HardwarePlaceholder />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;`
    },
    {
        name: 'components/Layout.tsx',
        content: `import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Server, Brain, Settings, Activity } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Command Center', icon: LayoutDashboard },
    { path: '/ai-services', label: 'AI Services', icon: Brain },
    { path: '/hardware', label: 'Hardware (iLO)', icon: Server },
    { path: '/settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      <aside className="w-64 flex flex-col border-r border-border bg-panel">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <Activity className="text-hpe-green h-8 w-8" />
          <div>
            <h1 className="font-bold text-lg tracking-wider text-white">BERTHA<span className="text-hpe-green">HUB</span></h1>
            <p className="text-xs text-text-secondary font-mono">ML350 Gen10</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => \`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                \${isActive 
                  ? 'bg-hpe-green/10 text-hpe-green border-l-4 border-hpe-green' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-white border-l-4 border-transparent'}
              \`}
            >
              <item.icon size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="bg-black/30 rounded p-3 text-xs font-mono text-text-secondary">
            <div className="flex justify-between mb-1">
              <span>STATUS</span>
              <span className="text-hpe-green">NOMINAL</span>
            </div>
            <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
              <div className="bg-hpe-green h-full w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-hpe-green/5 via-background to-background">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;`
    },
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
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
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
    }
];

export const SourceCodeDownloader = () => {
    const handleDownload = () => {
        let fullText = "";
        files.forEach(f => {
            fullText += `--- START OF FILE ${f.name} ---\n\n${f.content}\n\n`;
        });
        
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BigBerthaHub_Source_v${APP_VERSION}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-panel hover:bg-white/5 border border-border text-hpe-cyan font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
             <Download size={18} />
             <span className="font-mono text-sm">SOURCE_CODE.TXT</span>
        </button>
    );
};