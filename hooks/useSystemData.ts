
import { useState, useEffect } from 'react';
import { SystemData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const { monitorIp, monitorPort } = useSettings();

    useEffect(() => {
        let isMounted = true;
        const apiUrl = `http://${monitorIp}:${monitorPort}/api/sysmon`;

        const fetchData = async () => {
            try {
                // Defensive: If no IP/Port is configured, don't fetch
                if (!monitorIp || !monitorPort) {
                   throw new Error("Configuration missing: Check Settings");
                }

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const jsonData: SystemData = await response.json();
                
                if (isMounted) {
                    setData(jsonData);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    console.error("Fetch error:", err);
                    setError(err.message || "Failed to fetch data");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // Initial fetch
        fetchData();

        // Poll every 2 seconds for live feeling
        const intervalId = setInterval(fetchData, 2000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [monitorIp, monitorPort]);

    return { data, loading, error };
};
