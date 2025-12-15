
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { config, updateConfig } = useSettings();

    const [iloInput, setIloInput] = useState(config.ilo_url);
    const [comfyInput, setComfyInput] = useState(config.comfy_url);
    const [ollamaInput, setOllamaInput] = useState(config.ollama_url);

    useEffect(() => {
        setIloInput(config.ilo_url);
        setComfyInput(config.comfy_url);
        setOllamaInput(config.ollama_url);
    }, [config, isOpen]);

    const handleSave = async () => {
        await updateConfig({
            ...config,
            ilo_url: iloInput,
            comfy_url: comfyInput,
            ollama_url: ollamaInput
        });
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
                        <label htmlFor="ilo-url" className="block text-sm font-medium text-accent-light mb-1">
                            iLO URL
                        </label>
                        <input
                            type="text"
                            id="ilo-url"
                            value={iloInput}
                            onChange={(e) => setIloInput(e.target.value)}
                            placeholder="https://192.168.1.100"
                            className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                        />
                    </div>
                    <div>
                        <label htmlFor="comfy-url" className="block text-sm font-medium text-accent-light mb-1">
                            ComfyUI URL
                        </label>
                        <input
                            type="text"
                            id="comfy-url"
                            value={comfyInput}
                            onChange={(e) => setComfyInput(e.target.value)}
                            placeholder="http://localhost:8188"
                            className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                        />
                    </div>
                    <div>
                        <label htmlFor="ollama-url" className="block text-sm font-medium text-accent-light mb-1">
                            Ollama URL
                        </label>
                        <input
                            type="text"
                            id="ollama-url"
                            value={ollamaInput}
                            onChange={(e) => setOllamaInput(e.target.value)}
                            placeholder="http://localhost:11434"
                            className="w-full bg-primary border border-accent-blue/30 rounded-lg p-2.5 text-text-main focus:outline-none focus:ring-2 focus:ring-highlight-cyan font-mono"
                        />
                    </div>
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
