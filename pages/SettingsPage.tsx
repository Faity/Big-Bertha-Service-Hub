import React, { useState, useEffect } from 'react';
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
          <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-hpe-green/10 border-hpe-green text-hpe-green' : 'bg-alert-red/10 border-alert-red text-alert-red'}`}>
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

export default SettingsPage;