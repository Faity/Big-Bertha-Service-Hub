import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Save, ToggleLeft, ToggleRight, ServerCog } from 'lucide-react';
import { SourceCodeDownloader } from '../components/SourceCodeDownloader';

const InputField = ({ label, value, onChange, type = "text" }: { label: string, value: string, onChange: (val: string) => void, type?: string }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-text-secondary mb-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-lg p-3 text-text-primary focus:outline-none focus:border-hpe-cyan transition-colors font-mono text-sm"
    />
  </div>
);

const SettingsPage = () => {
  const settings = useSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">System Configuration</h2>
          <p className="text-text-secondary">Manage connections to your local services.</p>
        </div>
        <button 
          onClick={settings.toggleDemoMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${settings.isDemoMode ? 'bg-hpe-cyan/20 text-hpe-cyan' : 'bg-background border border-border text-text-secondary'}`}
        >
          {settings.isDemoMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
          {settings.isDemoMode ? 'DEMO MODE: ON' : 'DEMO MODE: OFF'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hardware Settings */}
        <div className="bg-panel border border-border rounded-xl p-6">
          <h3 className="text-xl font-bold text-hpe-green mb-6 flex items-center gap-2">
            HPE iLO Connection
          </h3>
          <InputField label="iLO IP Address / URL" value={settings.iloUrl} onChange={settings.setIloUrl} />
          <InputField label="Username" value={settings.iloUser} onChange={settings.setIloUser} />
          <InputField label="Password" type="password" value={settings.iloPass} onChange={settings.setIloPass} />
          <p className="text-xs text-text-secondary mt-4 bg-background p-3 rounded border border-border/50">
            Note: Requests are routed via Vite Proxy (/redfish) to avoid CORS issues during development. Ensure the Proxy target in `vite.config.ts` matches this IP, or use a CORS extension.
          </p>
        </div>

        {/* AI Service Settings */}
        <div className="bg-panel border border-border rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-hpe-cyan mb-6 flex items-center gap-2">
              AI Service Endpoints
            </h3>
            <InputField label="ComfyUI URL" value={settings.comfyUrl} onChange={settings.setComfyUrl} />
            <InputField label="Ollama URL" value={settings.ollamaUrl} onChange={settings.setOllamaUrl} />
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
        <button className="bg-hpe-green hover:bg-hpe-green/80 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 shadow-lg shadow-hpe-green/20 transition-all">
          <Save size={20} />
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;