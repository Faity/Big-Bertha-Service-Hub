
export interface ChartData {
    name: string;
    value: number;
}

export interface SystemInfo {
    os_name: string;
    os_version: string;
    kernel_version: string;
    architecture: string;
    python_version: string;
    total_ram_gb: number;
    cpu_info: string;
    comfyui_git_version: string;
    // Live monitoring fields
    cpu_usage_percent?: number;
    ram_used_gb?: number;
    disk_io_read_mbps?: number;
    disk_io_write_mbps?: number;
    network_rx_mbps?: number;
    network_tx_mbps?: number;
}

export interface GpuStatus {
    name: string;
    vram_total_mb: number;
    vram_used_mb: number;
    vram_free_mb: number;
    note: string;
}

export interface OllamaModel {
    name: string;
    size: string;
    digest: string;
    updated: string;
}

export interface OllamaStatus {
    status: string;
    service_status: string;
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
    unclip: string;
    upscale_models: string;
    diffusers: string;
    gligen: string;
    t2i_adapter: string;
    video_models: string;
    workflows: string;
}

export interface ModelsAndAssets {
    custom_nodes: string[];
    checkpoints: string[];
    loras: string[];
    vae: string[];
    embeddings: string[];
    controlnet: string[];
    clip_vision: string[];
    upscale_models: string[];
    diffusers: string[];
    gligen: string[];
}

export interface StorageStatus {
    path: string;
    total_gb: number;
    used_gb: number;
    free_gb: number;
    filesystem_type: string;
    device: string;
    uuid: string | null;
    mount_options: string;
    error: string | null;
    description: string;
}

export interface SystemData {
    system_info: SystemInfo;
    gpu_status: GpuStatus[];
    ollama_status: OllamaStatus;
    comfyui_paths: ComfyUiPaths;
    models_and_assets: ModelsAndAssets;
    workflows: string[];
    storage_status: StorageStatus[];
}