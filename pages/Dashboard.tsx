import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import GpuCard from '../components/GpuCard';
import { Server, Zap, Wind, Database, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

// Mock Data Generators for Demo/Offline Mode
const generatePowerData = () => Array.from({ length: 15 }, (_, i) => ({
  time: `${i}s`,
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
    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
      status === 'online' ? 'bg-hpe-green/20 text-hpe-green' : 
      status === 'offline' ? 'bg-alert-red/20 text-alert-red' : 
      'bg-warn-yellow/20 text-warn-yellow'
    }`}>
      {status}
    </div>
  </div>
);

const Dashboard = () => {
  const { isDemoMode, comfyUrl, ollamaUrl } = useSettings();
  const [powerHistory, setPowerHistory] = useState(generatePowerData());
  const [comfyStatus, setComfyStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Simulation / Polling Effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Chart Data
      setPowerHistory(prev => {
        const newData = [...prev.slice(1)];
        newData.push({ time: 'now', value: (isDemoMode ? 200 : 0) + Math.random() * 50 });
        return newData;
      });

      // Check Services (Simple Ping Logic)
      if (isDemoMode) {
        setComfyStatus('online');
        setOllamaStatus('online');
      } else {
        // In real app, we would fetch here. 
        // Simulating failure for now if not demo mode as we can't hit real localhost services from browser sandbox
        setComfyStatus('offline');
        setOllamaStatus('offline');
      }

    }, 2000);
    return () => clearInterval(interval);
  }, [isDemoMode]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Stats */}
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
        {/* Main Chart Area */}
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

        {/* Service Health */}
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

      {/* GPU Cluster Section */}
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

export default Dashboard;