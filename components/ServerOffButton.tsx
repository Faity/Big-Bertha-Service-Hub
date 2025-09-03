
import React, { useState } from 'react';

const ServerOffButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleShutdown = () => {
        setIsModalOpen(false);
        // In a real app, this would trigger an API call.
        alert('Server shutdown command sent. This is a simulation.');
    };
    
    return (
        <>
            <div className="flex flex-col items-center gap-2 p-3 bg-primary rounded-lg border border-accent-blue/20">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-red-800/50 hover:bg-red-700/60 border border-red-500/50 text-red-200 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    aria-label="Shut down server"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.99 5a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1zM9 12a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
                    </svg>
                    <span>Server OFF</span>
                </button>
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in-up" 
                    style={{ animationDuration: '0.3s' }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="shutdown-modal-title"
                >
                    <div className="bg-secondary rounded-lg shadow-xl p-8 border border-accent-blue/30 max-w-md w-full" role="document">
                        <h2 id="shutdown-modal-title" className="text-2xl font-bold text-red-400 mb-4">Confirm Server Shutdown</h2>
                        <p className="text-accent-light mb-6">
                            Are you sure you want to shut down the server? This action cannot be undone and will terminate all running services.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 rounded-lg bg-accent-blue hover:bg-accent-light hover:text-primary transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleShutdown}
                                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                            >
                                Shut Down
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServerOffButton;
