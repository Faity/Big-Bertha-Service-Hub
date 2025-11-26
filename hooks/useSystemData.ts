import { useState, useEffect } from 'react';
import { SystemData, IloMetrics, GpuInfo, OllamaStatus, ComfyUiPaths } from '../types';
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
                
                // --- Data Interpretation & Parsing ---
                
                // 1. Parse HPE Raw Data (Redfish/iLO)
                let iloMetrics: IloMetrics = {
                    inlet_ambient_c: 0,
                    power_consumed_watts: 0,
                    fan_speed_percent: 0
                };

                const hpe = rawData.hpe_raw_data;
                if (hpe) {
                    // Thermal Data
                    if (hpe.raw_thermal_data) {
                        const temps = hpe.raw_thermal_data.Temperatures;
                        const fans = hpe.raw_thermal_data.Fans;

                        // Temperature: Find "01-Inlet Ambient"
                        if (Array.isArray(temps)) {
                            const ambient = temps.find((t: any) => t.Name === "01-Inlet Ambient");
                            if (ambient && typeof ambient.ReadingCelsius === 'number') {
                                iloMetrics.inlet_ambient_c = ambient.ReadingCelsius;
                            }
                        }

                        // Fans: Extract "Reading" (Percent)
                        if (Array.isArray(fans)) {
                            const validFans = fans.filter((f: any) => typeof f.Reading === 'number');
                            if (validFans.length > 0) {
                                const sum = validFans.reduce((acc: number, curr: any) => acc + curr.Reading, 0);
                                iloMetrics.fan_speed_percent = Math.round(sum / validFans.length);
                            }
                        }
                    }

                    // Power Data
                    if (hpe.raw_power_data && Array.isArray(hpe.raw_power_data.PowerControl)) {
                        const pc = hpe.raw_power_data.PowerControl[0];
                        if (pc && typeof pc.PowerConsumedWatts === 'number') {
                            iloMetrics.power_consumed_watts = pc.PowerConsumedWatts;
                        }
                    }
                }

                // 2. Normalize GPU Data (Bytes -> GiB)
                // The API snapshot sends Bytes in fields named "_mb" (e.g., 6442450944).
                // We convert these to GiB for the frontend display.
                const processedGpus: GpuInfo[] = (rawData.gpus || []).map((gpu: any) => {
                    const bytesInGiB = Math.pow(1024, 3);
                    
                    let totalGiB = 0;
                    let usedGiB = 0;

                    // Handle Total
                    // If the value is very large (> 1,000,000), it's bytes. Otherwise assume MB.
                    if (typeof gpu.vram_total_mb === 'number') {
                        if (gpu.vram_total_mb > 1000000) {
                             totalGiB = gpu.vram_total_mb / bytesInGiB;
                        } else {
                             totalGiB = gpu.vram_total_mb / 1024;
                        }
                    }

                    // Handle Used
                    if (typeof gpu.vram_used_mb === 'number') {
                        if (gpu.vram_used_mb > 1000000) {
                            usedGiB = gpu.vram_used_mb / bytesInGiB;
                        } else {
                            usedGiB = gpu.vram_used_mb / 1024;
                        }
                    }

                    return {
                        ...gpu,
                        vram_total_mb: totalGiB, // Storing GiB in this field for frontend consistency
                        vram_used_mb: usedGiB,
                    };
                });

                // 3. Service Status & Defaults
                // Map snapshot's service_status/ollama_status to ollama_status
                const ollamaStatus: OllamaStatus = {
                    status: rawData.ollama_status?.status || rawData.service_status?.ollama?.status || 'unknown',
                    version: rawData.ollama_status?.version || 'N/A',
                    installed_models: rawData.ollama_status?.installed_models || [] 
                };

                const comfyUiPaths: ComfyUiPaths | any = rawData.comfyui_paths || {}; 

                // 4. OS Status
                const osStatus = rawData.os_status || {
                    cpu_usage_percent: 0,
                    ram_total_gb: 0,
                    ram_used_gb: 0,
                    ram_used_percent: 0,
                    uptime_seconds: 0
                };

                // Ensure numeric types
                if (typeof osStatus.ram_total_gb === 'string') osStatus.ram_total_gb = parseFloat(osStatus.ram_total_gb);
                if (typeof osStatus.ram_used_gb === 'string') osStatus.ram_used_gb = parseFloat(osStatus.ram_used_gb);

                const processedData: SystemData = {
                    ...rawData,
                    os_status: osStatus,
                    ilo_metrics: iloMetrics,
                    gpus: processedGpus,
                    ollama_status: ollamaStatus, 
                    comfyui_paths: comfyUiPaths,
                    models_and_assets: rawData.models_and_assets || { checkpoints: [], loras: [], custom_nodes: [], vae: [], controlnet: [] },
                    workflows: rawData.workflows || [],
                    storage_status: rawData.storage_status || [],
                    system_info: rawData.system_info || { hostname: rawData.server_name || "Unknown" }
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