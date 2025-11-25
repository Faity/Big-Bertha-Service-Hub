import React, { useState } from 'react';
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
                        className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
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
    const comfyUiUrl = `http://${monitorIp}:${comfyUiPort}`;

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

export default ComfyUIPage;