import React from 'react';
import { Download } from 'lucide-react';

const APP_VERSION = "3.0.0";

const files = [
    {
        name: 'vite.config.ts',
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});`
    },
    {
        name: 'types.ts',
        content: `export interface AppConfig {
    ilo_url: string;
    ilo_user: string;
    ilo_pass: string;
    comfy_url: string;
    ollama_url: string;
}

export interface SystemStats {
    cpu_usage: number;
    ram_used: number;
    ram_total: number;
}

export interface GpuStats {
    index: number;
    name: string;
    temp: number;
    power: number;
    vram_used: number;
    vram_total: number;
    utilization: number;
    is_compute_only: boolean;
}

export interface SysMonResponse {
    system: SystemStats;
    gpus: GpuStats[];
}`
    },
    {
        name: 'contexts/SettingsContext.tsx',
        content: `// [Context Logic for /api/config handling]`
    },
    {
        name: 'hooks/useSystemData.ts',
        content: `import { useState, useEffect } from 'react';
import { SysMonResponse } from '../types';

export const useSystemData = () => {
    const [data, setData] = useState<SysMonResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await fetch('/api/sysmon');
                if (!response.ok) throw new Error(\`SysMon API Error: \${response.status}\`);
                const json: SysMonResponse = await response.json();
                if (isMounted) { setData(json); setError(null); }
            } catch (err: any) {
                if (isMounted) setError(err.message || "Failed to fetch system data");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => { isMounted = false; clearInterval(intervalId); };
    }, []);
    return { data, loading, error };
};`
    },
    {
        name: 'components/GpuCluster.tsx',
        content: `// [GPU Cluster Visualization Component]`
    },
    {
        name: 'pages/Dashboard.tsx',
        content: `// [Main Dashboard with GPU Cluster and Service Status]`
    }
];

export const SourceCodeDownloader = () => {
    const handleDownload = () => {
        let fullText = "";
        files.forEach(f => {
            fullText += `--- START OF FILE ${f.name} ---\n\n${f.content}\n\n`;
        });
        
        const blob = new Blob([fullText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BigBerthaHub_Source_v${APP_VERSION}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleDownload}
            className="bg-panel hover:bg-white/5 border border-border text-hpe-cyan font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
             <Download size={18} />
             <span className="font-mono text-sm">SOURCE_CODE.TXT</span>
        </button>
    );
};