import React, { useState } from 'react';
import { useSystemData } from '../hooks/useSystemData';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);

const OllamaPage = () => {
    const { data, loading, error } = useSystemData();
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'ai', text: 'Hello! I am your local AI assistant powered by Ollama. What can I help you with today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const newUserMessage = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, newUserMessage]);
        setMessage('');
        setIsLoading(true);

        setTimeout(() => {
            const aiResponse = { sender: 'ai', text: `This is a simulated response to: "${message}". In a real application, this would be a generated response from an Ollama model.` };
            setChatHistory(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1500);
    };

    const ollamaStatus = data?.ollama_status;
    const serviceIsRunning = ollamaStatus?.status === 'running';

    return (
        <div className="animate-fade-in-up grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-1 flex flex-col gap-8">
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20">
                    <h2 className="text-2xl font-bold mb-4 text-highlight-green">Ollama Control</h2>
                    <div className={`flex items-center space-x-3 ${serviceIsRunning ? 'text-highlight-green' : 'text-red-400'}`}>
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${serviceIsRunning ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${serviceIsRunning ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span>{serviceIsRunning ? `Service Active (${ollamaStatus?.version || 'v?'})` : (loading ? 'Checking Status...' : 'Service Offline')}</span>
                    </div>
                </div>
                <div className="bg-secondary p-6 rounded-xl border border-accent-blue/20 flex-grow">
                    <h3 className="text-xl font-bold mb-4 text-highlight-green">Installed Models</h3>
                    {loading && !ollamaStatus && <p className="text-accent-light animate-pulse">Loading models...</p>}
                    {error && !ollamaStatus && <p className="text-red-400">Error: {error}</p>}
                    
                    {ollamaStatus?.installed_models ? (
                        <ul className="space-y-3">
                            {ollamaStatus.installed_models.length > 0 ? ollamaStatus.installed_models.map(model => (
                                <li key={model.name} className="bg-primary p-3 rounded-lg flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-mono text-text-main">{model.name}</p>
                                        <p className="text-xs text-accent-light">{`${model.digest} ${model.updated}`}</p>
                                    </div>
                                    <span className="text-accent-light font-mono bg-accent-blue/20 px-2 py-1 rounded text-xs">{model.size}</span>
                                </li>
                            )) : (
                                <li className="text-accent-light italic">No models found installed.</li>
                            )}
                        </ul>
                    ) : (
                        !loading && <p className="text-accent-light">Model list unavailable.</p>
                    )}
                </div>
            </div>

            <div className="lg:col-span-2 bg-secondary rounded-xl border border-accent-blue/20 flex flex-col h-[85vh]">
                <div className="p-4 border-b border-accent-blue/20">
                    <h2 className="text-xl font-bold text-highlight-cyan">Model Chat (Simulation)</h2>
                </div>
                <div className="flex-grow p-6 overflow-y-auto space-y-4">
                    {chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg px-4 py-2 rounded-xl ${chat.sender === 'user' ? 'bg-highlight-cyan text-primary' : 'bg-accent-blue text-white'}`}>
                                <p>{chat.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="max-w-lg px-4 py-3 rounded-xl bg-accent-blue text-white">
                                <div className="flex items-center space-x-2">
                                    <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-white rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-accent-blue/20">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Send a message..."
                            className="w-full bg-primary p-3 rounded-lg border border-accent-blue/30 focus:outline-none focus:ring-2 focus:ring-highlight-cyan text-text-main"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-highlight-cyan text-primary p-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                            disabled={isLoading}
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