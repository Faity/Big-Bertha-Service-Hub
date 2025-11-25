import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
    monitorIp: string;
    setMonitorIp: (ip: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
    // Initialize from localStorage or default to localhost
    const [monitorIp, setMonitorIpState] = useState<string>(() => {
        return localStorage.getItem('MONITOR_API_IP') || '127.0.0.1';
    });

    const setMonitorIp = (ip: string) => {
        setMonitorIpState(ip);
        localStorage.setItem('MONITOR_API_IP', ip);
    };

    return (
        <SettingsContext.Provider value={{ monitorIp, setMonitorIp }}>
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