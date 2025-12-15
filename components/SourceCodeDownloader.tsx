import React from 'react';
import { Download, FileCode } from 'lucide-react';

const APP_VERSION = "3.0.0";

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
      '/redfish': {
        target: 'https://192.168.1.100',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
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
        name: 'contexts/SettingsContext.tsx',
        content: `import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  iloUrl: string;
  setIloUrl: (url: string) => void;
  iloUser: string;
  setIloUser: (user: string) => void;
  iloPass: string;
  setIloPass: (pass: string) => void;
  comfyUrl: string;
  setComfyUrl: (url: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
  const usePersistedState = (key: string, defaultValue: string) => {
    const [state, setState] = useState(() => localStorage.getItem(key) || defaultValue);
    useEffect(() => {
      localStorage.setItem(key, state);
    }, [key, state]);
    return [state, setState] as const;
  };

  const [iloUrl, setIloUrl] = usePersistedState('ILO_URL', 'https://192.168.1.100');
  const [iloUser, setIloUser] = usePersistedState('ILO_USER', 'admin');
  const [iloPass, setIloPass] = usePersistedState('ILO_PASS', 'password');
  
  const [comfyUrl, setComfyUrl] = usePersistedState('COMFY_URL', 'http://localhost:8188');
  const [ollamaUrl, setOllamaUrl] = usePersistedState('OLLAMA_URL', 'http://localhost:11434');

  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('DEMO_MODE') === 'true');

  const toggleDemoMode = () => {
    const newVal = !isDemoMode;
    setIsDemoMode(newVal);
    localStorage.setItem('DEMO_MODE', String(newVal));
  };

  return (
    <SettingsContext.Provider value={{
      iloUrl, setIloUrl,
      iloUser, setIloUser,
      iloPass, setIloPass,
      comfyUrl, setComfyUrl,
      ollamaUrl, setOllamaUrl,
      isDemoMode, toggleDemoMode
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
        name: 'components/GpuCard.tsx',
        content: `import React from 'react';
import { Settings, Thermometer, Zap, Activity } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface GpuProps {
  name: string;
  vramTotal: number;
  vramUsed: number;
  temp: number;
  utilization: number;
  power: number;
}

const GpuCard = ({ name, vramTotal, vramUsed, temp, utilization, power }: GpuProps) => {
  const data = Array.from({ length: 20 }, (_, i) => ({
    name: i,
    val: Math.max(0, utilization + (Math.random() * 20 - 10))
  }));

  const vramPercent = (vramUsed / vramTotal) * 100;

  return (
    <div className="bg-panel border border-border rounded-xl p-5 shadow-lg shadow-black/40 hover:border-hpe-cyan/30 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Settings size={18} className="text-hpe-cyan" />
            {name}
          </h3>
          <span className="text-xs text-text-secondary font-mono">NVIDIA DEVICE</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-white">{utilization}%</div>
          <div className="text-xs text-text-secondary">LOAD</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1 font-mono">
          <span className="text-text-secondary">VRAM</span>
          <span className="text-hpe-cyan">{vramUsed} / {vramTotal} GB</span>
        </div>
        <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-hpe-cyan transition-all duration-500"
            style={{ width: \`\${vramPercent}%\` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 p-2 rounded border border-white/5 flex items-center gap-3">
          <Thermometer size={16} className={temp > 80 ? 'text-alert-red' : 'text-hpe-green'} />
          <div>
            <div className="text-sm font-bold text-white">{temp}°C</div>
            <div className="text-[10px] text-text-secondary">TEMP</div>
          </div>
        </div>
        <div className="bg-black/20 p-2 rounded border border-white/5 flex items-center gap-3">
          <Zap size={16} className="text-warn-yellow" />
          <div>
            <div className="text-sm font-bold text-white">{power}W</div>
            <div className="text-[10px] text-text-secondary">POWER</div>
          </div>
        </div>
      </div>

      <div className="h-16 w-full opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={\`grad-\${name}\`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F3FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00F3FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 100]} />
            <Area 
              type="monotone" 
              dataKey="val" 
              stroke="#00F3FF" 
              strokeWidth={2}
              fill={\`url(#grad-\${name})\`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GpuCard;`
    },
    {
        name: 'pages/Dashboard.tsx',
        content: `import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import GpuCard from '../components/GpuCard';
import { Server, Zap, Wind, Database, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

const generatePowerData = () => Array.from({ length: 15 }, (_, i) => ({
  time: \`\${i}s\`,
  value: 200 + Math.random() * 50
}));

const ServiceBadge = ({ name, url, status }: { name: string, url: string, status: 'online' | 'offline' | 'checking' }) => (
  <div className="flex items-center justify-between p-4 bg-panel border border-border rounded-lg">
    <div className="flex items-center gap-3">
      {status === 'online' && <CheckCircle className="text-hpe-green" size={20} />}
      {status === 'offline' && <XCircle className="text-alert-red" size={20} />}
      {status === 'checking' && <AlertTriangle className="text-warn-yellow animate-pulse" size={20} />}
      <div>
        <div className="font-bold text-white">{name}</div>
        <div className="text-xs text-text-secondary truncate max-w-[150px]">{url}</div>
      </div>
    </div>
    <div className={\`px-2 py-1 rounded text-xs font-bold uppercase \${
      status === 'online' ? 'bg-hpe-green/20 text-hpe-green' : 
      status === 'offline' ? 'bg-alert-red/20 text-alert-red' : 
      'bg-warn-yellow/20 text-warn-yellow'
    }\`}>
      {status}
    </div>
  </div>
);

const Dashboard = () => {
  const { isDemoMode, comfyUrl, ollamaUrl } = useSettings();
  const [powerHistory, setPowerHistory] = useState(generatePowerData());
  const [comfyStatus, setComfyStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const interval = setInterval(() => {
      setPowerHistory(prev => {
        const newData = [...prev.slice(1)];
        newData.push({ time: 'now', value: (isDemoMode ? 200 : 0) + Math.random() * 50 });
        return newData;
      });

      if (isDemoMode) {
        setComfyStatus('online');
        setOllamaStatus('online');
      } else {
        setComfyStatus('offline');
        setOllamaStatus('offline');
      }

    }, 2000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-panel border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-hpe-green/20 rounded-lg text-hpe-green">
            <Zap size={24} />
          </div>
          <div>
            <div className="text-sm text-text-secondary">Total Power</div>
            <div className="text-2xl font-mono font-bold text-white">
              {isDemoMode ? (245 + Math.floor(Math.random() * 20)) : 0} W
            </div>
          </div>
        </div>
        
        <div className="bg-panel border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-hpe-cyan/20 rounded-lg text-hpe-cyan">
            <Wind size={24} />
          </div>
          <div>
            <div className="text-sm text-text-secondary">System Fan</div>
            <div className="text-2xl font-mono font-bold text-white">
              {isDemoMode ? 32 : 0} %
            </div>
          </div>
        </div>

        <div className="bg-panel border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
            <Database size={24} />
          </div>
          <div>
            <div className="text-sm text-text-secondary">RAM Usage</div>
            <div className="text-2xl font-mono font-bold text-white">
              {isDemoMode ? 64.2 : 0} / 256 GB
            </div>
          </div>
        </div>

        <div className="bg-panel border border-border p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
            <Server size={24} />
          </div>
          <div>
            <div className="text-sm text-text-secondary">Uptime</div>
            <div className="text-2xl font-mono font-bold text-white">
              14d 2h
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Power Consumption History</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerHistory}>
                <XAxis dataKey="time" hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161B22', borderColor: '#30363D', color: '#fff' }} 
                  itemStyle={{ color: '#01A982' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#01A982" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-panel border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Service Status</h3>
            <div className="space-y-3">
              <ServiceBadge name="ComfyUI" url={comfyUrl} status={comfyStatus} />
              <ServiceBadge name="Ollama API" url={ollamaUrl} status={ollamaStatus} />
              <ServiceBadge name="iLO Redfish" url="Proxy: /redfish" status={isDemoMode ? 'online' : 'checking'} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-hpe-cyan rounded-sm"></span>
          GPU Acceleration Cluster
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GpuCard 
            name="Tesla P40" 
            vramTotal={24} 
            vramUsed={isDemoMode ? 18.5 : 0} 
            temp={isDemoMode ? 68 : 0} 
            utilization={isDemoMode ? 92 : 0}
            power={isDemoMode ? 180 : 0}
          />
           <GpuCard 
            name="RTX 4000 Ada" 
            vramTotal={20} 
            vramUsed={isDemoMode ? 4.2 : 0} 
            temp={isDemoMode ? 45 : 0} 
            utilization={isDemoMode ? 12 : 0}
            power={isDemoMode ? 65 : 0}
          />
           <GpuCard 
            name="RTX 3050" 
            vramTotal={6} 
            vramUsed={isDemoMode ? 1.1 : 0} 
            temp={isDemoMode ? 34 : 0} 
            utilization={isDemoMode ? 2 : 0}
            power={isDemoMode ? 30 : 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;`
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