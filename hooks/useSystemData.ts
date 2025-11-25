import { useState, useEffect } from 'react';
import { SystemData } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [usingFallback, setUsingFallback] = useState<boolean>(false);
    const { monitorIp } = useSettings();

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Create a timeout for the live fetch (2 seconds)
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000);

                try {
                    const response = await fetch(`http://${monitorIp}:8010/api/sysmon`, {
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const jsonData: SystemData = await response.json();
                    
                    if (isMounted) {
                        setData(jsonData);
                        setError(null);
                        setUsingFallback(false);
                    }
                } catch (liveError) {
                     clearTimeout(timeoutId);
                     throw liveError; // Re-throw to trigger fallback block
                }
            } catch (e: any) {
                console.warn("Live fetch failed, attempting fallback:", e);
                
                try {
                    // Fallback to local static file
                    const fallbackResponse = await fetch('/application.json');
                    if (!fallbackResponse.ok) throw new Error("Fallback file unreachable");
                    
                    const fallbackData: SystemData = await fallbackResponse.json();
                    
                    if (isMounted) {
                        setData(fallbackData);
                        setUsingFallback(true);
                        // Clear error so UI renders the fallback data
                        setError(null);
                    }
                } catch (fallbackError: any) {
                    if (isMounted) {
                        setError(`Connection failed to ${monitorIp} and fallback data unavailable.`);
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        // Initial fetch
        fetchData();

        // Poll every 5 seconds (relaxed from 3s to reduce fallback spam)
        const intervalId = setInterval(fetchData, 5000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [monitorIp]);

    return { data, loading, error, usingFallback };
};