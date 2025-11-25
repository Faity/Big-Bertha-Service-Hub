import React, { useState, useEffect } from 'react';
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
        ollamaPort, setOllamaPort
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

export default SettingsModal;