import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig } from '../types';

interface SettingsContextType {
  config: AppConfig;
  isLoading: boolean;
  error: string | null;
  updateConfig: (newConfig: AppConfig) => Promise<void>;
  refreshConfig: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Default empty config to prevent null checks everywhere
const DEFAULT_CONFIG: AppConfig = {
    ilo_url: "https://192.168.1.100",
    ilo_user: "admin",
    ilo_pass: "",
    comfy_url: "http://localhost:8188",
    ollama_url: "http://localhost:11434"
};

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch Config from Backend on Mount
  useEffect(() => {
    const fetchConfig = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/config');
            
            // Handle 404 specifically - Fallback to defaults if endpoint missing
            if (res.status === 404) {
                console.warn("Config endpoint (/api/config) not found. Using default configuration.");
                setConfig(DEFAULT_CONFIG);
                setError(null);
                return;
            }

            if (!res.ok) throw new Error(`Backend Error: ${res.status}`);
            
            const data: AppConfig = await res.json();
            setConfig(data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to load config:", err);
            // Non-blocking error: allow app to render with defaults, but show warning
            setError("Could not sync with Backend (Port 8000). Using local defaults.");
            setConfig(DEFAULT_CONFIG);
        } finally {
            setIsLoading(false);
        }
    };

    fetchConfig();
  }, [refreshTrigger]);

  const updateConfig = async (newConfig: AppConfig) => {
    setIsLoading(true);
    try {
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConfig)
        });
        
        if (!res.ok) throw new Error("Failed to save configuration to backend");
        
        // Optimistic update
        setConfig(newConfig);
        setError(null);
    } catch (err: any) {
        setError(err.message);
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  const refreshConfig = () => setRefreshTrigger(prev => prev + 1);

  return (
    <SettingsContext.Provider value={{
      config,
      isLoading,
      error,
      updateConfig,
      refreshConfig
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};