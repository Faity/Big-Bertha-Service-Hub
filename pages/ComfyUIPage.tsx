
import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const AccordionItem = ({ title, items }: { title: string, items: string[] | undefined }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    if (!items || items.length === 0) {
        return (
            <div className="border-b border-accent-blue/20">
                <div className="flex justify-between items-center p-4 cursor-not-allowed">
                    <h3 className="text-lg font-semibold text-accent-light">{title}</h3>
                    <span className="text-accent-light text-sm">No items</span>
                </div>
            </div>
        );
    }

    return (
        <div className="border-b border-accent-blue/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                aria-expanded={isOpen}
            >
                <h3 className="text-lg font-semibold text-highlight-green">{title}</h3>
                <div className='flex items-center space-x-2'>
                    <span className="text-sm bg-accent-blue text-text-main rounded-full px-2 py-0.5">{items.length} items</span>
                    <svg
                        className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <ul className="p-4 pt-0 space-y-2 max-h-80 overflow-y-auto">
                    {items.map((item, index) => (
                        <li key={index} className="text-accent-light bg-primary p-2 rounded-md font-mono text-sm">{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


const ComfyUIPage = () => {
    const comfyUiUrl = 'http://localhost:8188';
    const { data, loading, error } = useSystemData();

    return (
        <div className="flex flex-col h-full animate-fade-in-up space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">ComfyUI Interface</h2>
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highlight-green opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-highlight-green"></span>
                    </span>
                    <span className="text-highlight-green">Service Online</span>
                </div>
            </div>
            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100%-100px)]">
                <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden border-2 border-accent-blue/30 shadow-2xl shadow-black/50">
                    <iframe
                        src={comfyUiUrl}
                        title="ComfyUI"
                        className="w-full h-full border-0"
                    />
                </div>

                <div className="lg:col-span-1 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col">
                    <div className="p-4 border-b border-accent-blue/20">
                        <h3 className="text-xl font-bold text-highlight-cyan">ComfyUI Assets</h3>
                    </div>
                    <div className="flex-grow overflow-y-auto">
                        {loading && <p className="p-4 text-accent-light">Loading assets...</p>}
                        {error && <p className="p-4 text-red-400">Error loading assets: {error}</p>}
                        {data && (
                            <div>
                                <AccordionItem title="Workflows" items={data.workflows} />
                                <AccordionItem title="Custom Nodes" items={data.models_and_assets.custom_nodes} />
                                <AccordionItem title="Checkpoints" items={data.models_and_assets.checkpoints} />
                                <AccordionItem title="LoRAs" items={data.models_and_assets.loras} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
             <div className="bg-secondary p-4 rounded-lg border border-accent-blue/20">
                <p className="text-accent-light text-sm">
                    Displaying ComfyUI from <a href={comfyUiUrl} target="_blank" rel="noopener noreferrer" className="text-highlight-cyan underline">{comfyUiUrl}</a>. If the content does not load, ensure the service is running and accessible.
                </p>
            </div>
        </div>
    );
};

export default ComfyUIPage;
