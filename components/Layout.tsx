import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import SettingsModal from './SettingsModal';
import { useSettings } from '../contexts/SettingsContext';
import ServerOffButton from './ServerOffButton';
import DownloadSourceButton from './DownloadSourceButton';

export const APP_VERSION = "2.1.0";

const CpuChipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M5 12h2a7 7 0 0110 0h2a9 9 0 00-14 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" />
    </svg>
);

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const InformationCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PaintBrushIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);

const ChatBubbleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const CogIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const navItems = [
    { path: '/', label: 'Dashboard', icon: <HomeIcon /> },
    { path: '/system-info', label: 'System Info', icon: <InformationCircleIcon /> },
    { path: '/comfyui', label: 'ComfyUI', icon: <PaintBrushIcon /> },
    { path: '/ollama', label: 'Ollama', icon: <ChatBubbleIcon /> },
    { path: '/monitoring', label: 'Monitoring', icon: <ChartBarIcon /> },
];

const Layout = () => {
    const { isSetup } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Automatically open settings if not set up
    useEffect(() => {
        if (!isSetup) {
            setIsSettingsOpen(true);
        }
    }, [isSetup]);

    const navLinkClasses = 'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200';
    const inactiveClasses = 'text-accent-light hover:bg-accent-blue hover:text-white';
    const activeClasses = 'bg-highlight-cyan text-primary font-bold shadow-lg';

    return (
        <div className="flex h-screen bg-primary font-sans">
            <aside className="w-64 bg-secondary flex flex-col p-4 border-r border-accent-blue/20">
                <div className="flex items-center space-x-2 p-2 mb-8">
                    <CpuChipIcon />
                    <h1 className="text-xl font-bold text-text-main leading-tight">Big Bertha <br /> Service Hub</h1>
                </div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `${navLinkClasses} ${isActive ? activeClasses : inactiveClasses}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <div className="mt-auto text-xs text-accent-light space-y-4">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-accent-light hover:bg-accent-blue hover:text-white transition-colors duration-200"
                    >
                        <CogIcon />
                        <span>Settings</span>
                    </button>
                    <DownloadSourceButton />
                    {/* ServerOffButton intentionally hidden for now to match cleaner refactor */}
                    <div className="text-center pt-4 border-t border-accent-blue/10">
                      <p className="font-mono text-highlight-cyan mb-1">v{APP_VERSION}</p>
                      <p>HPE ML350 Gen10</p>
                      <p>&copy; 2024 Localhost Services</p>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8 bg-primary">
                <Outlet />
            </main>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    );
};

export default Layout;