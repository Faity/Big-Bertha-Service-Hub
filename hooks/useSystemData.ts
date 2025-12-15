import { useState, useEffect } from 'react';
import { SysMonResponse } from '../types';

export const useSystemData = () => {
    const [data, setData] = useState<SysMonResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                // Polls the Python Backend
                const response = await fetch('/api/sysmon');

                if (!response.ok) {
                    throw new Error(`SysMon API Error: ${response.status}`);
                }

                const json: SysMonResponse = await response.json();
                
                if (isMounted) {
                    setData(json);
                    setError(null);
                }
            } catch (err: any) {
                if (isMounted) {
                    // console.error("SysMon polling error:", err);
                    // Don't spam console, just set error state
                    setError(err.message || "Failed to fetch system data");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000); // High frequency polling (1s)

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    return { data, loading, error };
};