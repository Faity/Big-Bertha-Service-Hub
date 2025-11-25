
import { useState, useEffect } from 'react';
import { SystemData } from '../types';

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Poll the local server API
                const response = await fetch('http://127.0.0.1:8010/api/sysmon');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData: SystemData = await response.json();
                setData(jsonData);
                setError(null); // Clear error on successful fetch
            } catch (e: any) {
                console.error("Failed to fetch system data:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchData();

        // Poll every 3 seconds (3000ms)
        const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId);
    }, []);

    return { data, loading, error };
};