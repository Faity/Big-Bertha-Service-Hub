import React, { useState, useEffect } from 'react';
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
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                status === 'online' ? 'bg-hpe-green/20 text-hpe-green' : 
                'bg-alert-red/20 text-alert-red'
            }`}>
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
                <div className={`text-lg font-mono font-bold ${health === 'OK' ? 'text-hpe-green' : 'text-alert-red'}`}>
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
                <div className="h-full bg-white transition-all duration-500" style={{ width: `${sys.cpu_usage}%` }}></div>
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
                                <Cell key={`cell-${index}`} fill={entry.color} />
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

export default Dashboard;