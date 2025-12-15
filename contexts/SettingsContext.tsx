import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  iloUrl: string;
  setIloUrl: (url: string) => void;
  iloUser: string;
  setIloUser: (user: string) => void;
  iloPass: string;
  setIloPass: (pass: string) => void;
  comfyUrl: string;
  setComfyUrl: (url: string) => void;
  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children?: ReactNode }) => {
  // Helper to persist state
  const usePersistedState = (key: string, defaultValue: string) => {
    const [state, setState] = useState(() => localStorage.getItem(key) || defaultValue);
    useEffect(() => {
      localStorage.setItem(key, state);
    }, [key, state]);
    return [state, setState] as const;
  };

  const [iloUrl, setIloUrl] = usePersistedState('ILO_URL', 'https://192.168.1.100');
  const [iloUser, setIloUser] = usePersistedState('ILO_USER', 'admin');
  const [iloPass, setIloPass] = usePersistedState('ILO_PASS', 'password');
  
  const [comfyUrl, setComfyUrl] = usePersistedState('COMFY_URL', 'http://localhost:8188');
  const [ollamaUrl, setOllamaUrl] = usePersistedState('OLLAMA_URL', 'http://localhost:11434');

  const [isDemoMode, setIsDemoMode] = useState(() => localStorage.getItem('DEMO_MODE') === 'true');

  const toggleDemoMode = () => {
    const newVal = !isDemoMode;
    setIsDemoMode(newVal);
    localStorage.setItem('DEMO_MODE', String(newVal));
  };

  return (
    <SettingsContext.Provider value={{
      iloUrl, setIloUrl,
      iloUser, setIloUser,
      iloPass, setIloPass,
      comfyUrl, setComfyUrl,
      ollamaUrl, setOllamaUrl,
      isDemoMode, toggleDemoMode
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