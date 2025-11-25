
export interface SystemInfo {
    // Static Host Info
    hostname: string;
    os_name: string;
    os_version: string;
    kernel_version: string;
    architecture: string;
    cpu_model: string;
    python_version: string;
    comfyui_git_version: string;
}

export interface OsStatus {
    // Dynamic Metrics
    cpu_usage_percent: number;
    ram_total_gb: number;
    ram_used_gb: number;
    ram_used_percent: number;
    uptime_seconds: number;
}

export interface IloMetrics {
    inlet_ambient_c: number;
    power_consumed_watts?: number;
    fan_speed_percent?: number;
}

export interface GpuInfo {
    index: number;
    name: string;
    vram_total_mb: number;
    vram_used_mb: number;
    vram_free_mb: number;
    gpu_utilization_percent: number;
    temperature_c: number;
    fan_speed_percent?: number;
}

export interface OllamaModel {
    name: string;
    size: string;
    digest: string;
    updated: string;
}

export interface OllamaStatus {
    status: string; // 'running', 'stopped'
    version: string;
    installed_models: OllamaModel[];
}

export interface ComfyUiPaths {
    base_path: string;
    custom_nodes: string;
    checkpoints: string;
    loras: string;
    vae: string;
    embeddings: string;
    controlnet: string;
    clip_vision: string;
    upscale_models: string;
    workflows: string;
}

export interface ModelsAndAssets {
    custom_nodes: string[];
    checkpoints: string[];
    loras: string[];
    vae: string[];
    controlnet: string[];
}

export interface StorageStatus {
    path: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    filesystem_type: string;
    description: string;
}

export interface SystemData {
    system_info: SystemInfo;
    os_status: OsStatus;
    gpus: GpuInfo[];
    ilo_metrics: IloMetrics;
    ollama_status: OllamaStatus;
    comfyui_paths: ComfyUiPaths;
    models_and_assets: ModelsAndAssets;
    workflows: string[];
    storage_status: StorageStatus[];
}

export interface ChartData {
    name: string;
    value: number;
}
