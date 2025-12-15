
export interface AppConfig {
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

// Aliases and Compatibility Types
export type GpuInfo = GpuStats;

export interface IloMetrics {
    inlet_ambient_c: number;
    power_consumed_watts?: number;
    fan_speed_percent?: number;
}

export interface OllamaModel {
    name: string;
    size: string;
    digest: string;
    updated: string;
}

export interface OllamaStatus {
    status: string;
    version: string;
    installed_models: OllamaModel[];
}

export interface StorageStatus {
    path: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    filesystem_type: string;
    description: string;
}

export interface SystemInfo {
    hostname: string;
    os_name?: string;
    os_version?: string;
    kernel_version?: string;
    architecture?: string;
    cpu_model?: string;
    python_version?: string;
}

export interface ChartData {
    name: string;
    value: number;
}

export interface ModelsAndAssets {
    checkpoints?: string[];
    loras?: string[];
    custom_nodes?: string[];
    controlnet?: string[];
    vae?: string[];
}

export interface OsStatus {
    cpu_usage_percent: number;
    ram_total_gb: number;
    ram_used_gb: number;
}

export interface SysMonResponse {
    system: SystemStats;
    gpus: GpuStats[];
    
    // Optional Extended Fields
    workflows?: string[];
    models_and_assets?: ModelsAndAssets;
    ollama_status?: OllamaStatus;
    os_status?: OsStatus; // Legacy mapping
    ilo_metrics?: IloMetrics;
    system_info?: SystemInfo;
    storage_status?: StorageStatus[];
    comfyui_paths?: Record<string, string>;
}

export type SystemData = SysMonResponse;
