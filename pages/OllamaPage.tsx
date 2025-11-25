import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';
import { useSettings } from '../contexts/SettingsContext';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const OllamaPage = () => {
    const { data, loading, error } = useSystemData();
    const { monitorIp, ollamaPort } = useSettings();
    const [message, setMessage] = useState('');
    
    // Chat UI state (purely frontend for now as per requirements)
    const [chatHistory, setChatHistory] = useState([
        { sender: 'ai', text: 'Ollama subsystem initialized. How can I assist you with the local models?' }
    ]);
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSending) return;

        const newUserMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, newUserMessage]);
        setMessage('');
        setIsSending(true);

        // Simulation response for UI demo
        setTimeout(() => {
            const aiResponse = { sender: 'ai', text: `Echo: ${newUserMessage.text} (This is a UI placeholder. Real chat integration requires backend endpoints.)` };
            setChatHistory(prev => [...prev, aiResponse]);
            setIsSending(false);
        }, 1000);
    };

    // Safe access
    const status = data?.ollama_status;
    const isRunning = status?.status === 'running';

    return (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column: Status & Models */}
            <div className="lg:col-span-1 flex flex-col gap-6 h-full max-h-[calc(100vh-120px)]">
                
                {/* Status Card */}
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
                    <h2 className="text-2xl font-bold mb-4 text-highlight-green">Service Status</h2>
                    <div className="flex items-center space-x-3 mb-4">
                         <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                         <span className={`font-mono ${isRunning ? 'text-text-main' : 'text-red-400'}`}>
                            {loading && !data ? 'CHECKING...' : (isRunning ? 'ONLINE' : 'OFFLINE')}
                         </span>
                    </div>
                    {status && (
                        <div className="text-xs font-mono text-accent-light space-y-1">
                            <p>Version: {status.version}</p>
                            <p>Target: http://{monitorIp}:{ollamaPort}</p>
                        </div>
                    )}
                    {error && !data && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>

                {/* Models List */}
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 flex-grow overflow-hidden flex flex-col">
                    <h3 className="text-xl font-bold mb-4 text-highlight-green">Local Models</h3>
                    
                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        {loading && !data && <p className="text-accent-light animate-pulse">Fetching library...</p>}
                        
                        {status?.installed_models && status.installed_models.length > 0 ? (
                            <ul className="space-y-3">
                                {status.installed_models.map((model, idx) => (
                                    <li key={idx} className="bg-primary p-3 rounded-lg border border-accent-blue/10 hover:border-highlight-cyan/30 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-sm text-text-main truncate w-3/4" title={model.name}>{model.name}</p>
                                            <span className="text-[10px] bg-accent-blue/30 px-1.5 py-0.5 rounded text-highlight-cyan">{model.size}</span>
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] text-accent-light font-mono">
                                            <span>{model.digest.substring(0, 12)}...</span>
                                            <span>{model.updated}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !loading && <p className="text-accent-light italic text-sm">No models found in library.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Chat Interface */}
            <div className="lg:col-span-2 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col h-[calc(100vh-120px)]">
                <div className="p-4 border-b border-accent-blue/20 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-highlight-cyan">Interactive Console</h2>
                    <span className="text-xs text-accent-light uppercase tracking-widest">Demo Mode</span>
                </div>
                
                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-3 rounded-xl shadow-md ${chat.sender === 'user' ? 'bg-highlight-cyan text-primary font-medium' : 'bg-accent-blue/40 text-text-main border border-accent-blue/30'}`}>
                                <p className="text-sm leading-relaxed">{chat.text}</p>
                            </div>
                        </div>
                    ))}
                    {isSending && (
                         <div className="flex justify-start">
                            <div className="bg-accent-blue/40 px-4 py-3 rounded-xl">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-accent-blue/20 bg-primary/30 rounded-b-xl">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message to Ollama..."
                            className="flex-grow bg-primary p-3 rounded-lg border border-accent-blue/30 focus:outline-none focus:border-highlight-cyan text-text-main placeholder-accent-light/50 transition-colors"
                            disabled={isSending || !isRunning}
                        />
                        <button
                            type="submit"
                            className="bg-highlight-cyan hover:bg-highlight-cyan/90 text-primary p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-highlight-cyan/20"
                            disabled={isSending || !isRunning}
                        >
                            <SendIcon />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OllamaPage;