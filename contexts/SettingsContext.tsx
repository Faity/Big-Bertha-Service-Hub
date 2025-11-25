import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
    monitorIp: string;
    setMonitorIp: (ip: string) => void;
    monitorPort: string;
    setMonitorPort: (port: string) => void;
    comfyUiPort: string;
    setComfyUiPort: (port: string) => void;
    ollamaPort: string;
    setOllamaPort: (port: string) => void;
    isSetup: boolean;
    completeSetup: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
    // Helper to get from local storage or default
    const getStoredValue = (key: string, defaultValue: string) => {
        return localStorage.getItem(key) || defaultValue;
    };

    const [monitorIp, setMonitorIpState] = useState<string>(() => getStoredValue('MONITOR_API_IP', '127.0.0.1'));
    const [monitorPort, setMonitorPortState] = useState<string>(() => getStoredValue('MONITOR_API_PORT', '8010'));
    const [comfyUiPort, setComfyUiPortState] = useState<string>(() => getStoredValue('COMFYUI_PORT', '8188'));
    const [ollamaPort, setOllamaPortState] = useState<string>(() => getStoredValue('OLLAMA_PORT', '11434'));
    
    // Check if the user has completed the initial setup (saved settings at least once)
    const [isSetup, setIsSetup] = useState<boolean>(() => {
        return localStorage.getItem('APP_SETUP_COMPLETED') === 'true';
    });

    const setMonitorIp = (ip: string) => {
        setMonitorIpState(ip);
        localStorage.setItem('MONITOR_API_IP', ip);
    };

    const setMonitorPort = (port: string) => {
        setMonitorPortState(port);
        localStorage.setItem('MONITOR_API_PORT', port);
    };

    const setComfyUiPort = (port: string) => {
        setComfyUiPortState(port);
        localStorage.setItem('COMFYUI_PORT', port);
    };

    const setOllamaPort = (port: string) => {
        setOllamaPortState(port);
        localStorage.setItem('OLLAMA_PORT', port);
    };

    const completeSetup = () => {
        setIsSetup(true);
        localStorage.setItem('APP_SETUP_COMPLETED', 'true');
    };

    return (
        <SettingsContext.Provider value={{ 
            monitorIp, setMonitorIp,
            monitorPort, setMonitorPort,
            comfyUiPort, setComfyUiPort,
            ollamaPort, setOllamaPort,
            isSetup, completeSetup
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};