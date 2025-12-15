import React from 'react';
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
  // Generate fake history data for the chart
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

      {/* VRAM Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1 font-mono">
          <span className="text-text-secondary">VRAM</span>
          <span className="text-hpe-cyan">{vramUsed} / {vramTotal} GB</span>
        </div>
        <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-hpe-cyan transition-all duration-500"
            style={{ width: `${vramPercent}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
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

      {/* Mini Chart */}
      <div className="h-16 w-full opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
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
              fill={`url(#grad-${name})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GpuCard;