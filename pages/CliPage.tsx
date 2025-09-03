
import React from 'react';

const CliPage = () => {
    return (
        <div className="animate-fade-in-up flex flex-col h-full">
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-highlight-green to-highlight-cyan">Web CLI</h2>
            <div className="flex-grow bg-black rounded-xl border-2 border-accent-blue/30 shadow-2xl shadow-black/50 p-4 font-mono text-sm text-green-400 overflow-y-auto">
                <p>Welcome to Big Bertha Service Hub CLI.</p>
                <p>Last login: {new Date().toUTCString()}</p>
                <p className="text-gray-500">NOTE: This is a simulated interface. SSH commands are not executed.</p>
                <br />
                <div className="flex items-center">
                    <span className="text-highlight-cyan">user@big-bertha</span>
                    <span className="text-text-main">:</span>
                    <span className="text-yellow-400">~</span>
                    <span className="text-text-main">$ &nbsp;</span>
                    <span
                        className="flex-1 bg-transparent outline-none text-white caret-green-400"
                        contentEditable
                        suppressContentEditableWarning
                        aria-label="CLI input"
                    />
                </div>
            </div>
             <div className="bg-secondary mt-6 p-4 rounded-lg border border-accent-blue/20">
                <p className="text-accent-light text-sm">
                    This interface provides a command-line prompt for server interaction. Type your commands to begin. For security, functionality is limited.
                </p>
            </div>
        </div>
    );
};

export default CliPage;
