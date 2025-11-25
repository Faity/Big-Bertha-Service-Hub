import { useState, useEffect } from 'react';
import { SystemData, IloMetrics } from '../types';
import { useSettings } from '../contexts/SettingsContext';

export const useSystemData = () => {
    const [data, setData] = useState<SystemData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const { monitorIp, monitorPort } = useSettings();

    useEffect(() => {
        let isMounted = true;
        
        if (!monitorIp || !monitorPort) {
             setLoading(false);
             setError("Configuration missing: Check Settings");
             return;
        }

        const apiUrl = `http://${monitorIp}:${monitorPort}/api/sysmon`;

        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                const rawData: any = await response.json();
                
                // --- Frontend Data Interpretation & Parsing ---
                
                // 1. Parse Redfish/iLO Data (Thermal & Power)
                let iloMetrics: IloMetrics = {
                    inlet_ambient_c: 0,
                    power_consumed_watts: 0,
                    fan_speed_percent: 0
                };

                if (rawData.redfish) {
                    if (rawData.redfish.Thermal) {
                        const thermal = rawData.redfish.Thermal;
                        
                        // Temperatures: Look specifically for "01-Inlet Ambient"
                        if (Array.isArray(thermal.Temperatures)) {
                            const ambientSensor = thermal.Temperatures.find((t: any) => 
                                t.Name && t.Name.trim() === '01-Inlet Ambient'
                            );
                            
                            if (ambientSensor && typeof ambientSensor.ReadingCelsius === 'number') {
                                iloMetrics.inlet_ambient_c = ambientSensor.ReadingCelsius;
                            } else {
                                // Fallback to generic ambient search if specific name not found
                                const genericAmbient = thermal.Temperatures.find((t: any) => 
                                    t.Name && t.Name.toLowerCase().includes('ambient')
                                );
                                iloMetrics.inlet_ambient_c = genericAmbient?.ReadingCelsius ?? 0;
                            }
                        }

                        // Fans: Extract 'Reading' specifically (Percentage)
                        if (Array.isArray(thermal.Fans)) {
                            const readings = thermal.Fans
                                .map((f: any) => f.Reading)
                                .filter((r: any) => typeof r === 'number');
                            
                            if (readings.length > 0) {
                                const totalSpeed = readings.reduce((acc: number, curr: number) => acc + curr, 0);
                                iloMetrics.fan_speed_percent = Math.round(totalSpeed / readings.length);
                            }
                        }
                    }

                    // Power
                    if (rawData.redfish.Power && Array.isArray(rawData.redfish.Power.PowerControl)) {
                        const powerControl = rawData.redfish.Power.PowerControl[0];
                        if (powerControl && typeof powerControl.PowerConsumedWatts === 'number') {
                            iloMetrics.power_consumed_watts = powerControl.PowerConsumedWatts;
                        }
                    }
                } else if (rawData.ilo_metrics) {
                    iloMetrics = rawData.ilo_metrics;
                }

                // 2. Normalize OS Status
                const osStatus = rawData.os_status || {
                    cpu_usage_percent: 0,
                    ram_total_gb: 0,
                    ram_used_gb: 0,
                    ram_used_percent: 0,
                    uptime_seconds: 0
                };

                // Robust RAM Mapping
                if (typeof osStatus.ram_total_gb === 'string') {
                    osStatus.ram_total_gb = parseFloat(osStatus.ram_total_gb);
                }
                
                // 3. Normalize GPU Data (Bytes -> GiB)
                // We map raw bytes to the existing _mb fields but store the GiB value
                const processedGpus = (rawData.gpus || []).map((gpu: any) => {
                    // 1 GiB = 1024^3 bytes
                    const bytesInGiB = 1073741824; 
                    
                    let totalGiB = 0;
                    let usedGiB = 0;

                    if (typeof gpu.vram_total_bytes === 'number') {
                        totalGiB = gpu.vram_total_bytes / bytesInGiB;
                    } else if (typeof gpu.vram_total_mb === 'number') {
                        // Fallback if bytes not available
                        totalGiB = gpu.vram_total_mb / 1024;
                    }

                    if (typeof gpu.vram_used_bytes === 'number') {
                        usedGiB = gpu.vram_used_bytes / bytesInGiB;
                    } else if (typeof gpu.vram_used_mb === 'number') {
                        // Fallback
                        usedGiB = gpu.vram_used_mb / 1024;
                    }

                    return {
                        ...gpu,
                        // Update field to hold GiB value
                        vram_total_mb: totalGiB, 
                        vram_used_mb: usedGiB
                    };
                });

                const processedData: SystemData = {
                    ...rawData,
                    os_status: osStatus,
                    ilo_metrics: iloMetrics,
                    gpus: processedGpus,
                    storage_status: rawData.storage_status || [],
                    workflows: rawData.workflows || [],
                };
                
                if (isMounted) {
                    setData(processedData);
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

        fetchData();

        const intervalId = setInterval(fetchData, 3000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [monitorIp, monitorPort]);

    return { data, loading, error };
};