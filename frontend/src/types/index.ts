export type Language = 'tr' | 'en';

export type NavItem = 'enhancer' | 'history' | 'settings';

export interface UploadedImage {
  id: string;
  filename: string;
  original_name: string;
  file_size: number;
  width: number;
  height: number;
  format: string;
  preview_url: string;
  created_at: string;
  localFile?: File;
}

export type AIModelType = 'realesrgan-x4plus';

export interface EnhanceSettingsState {
  scale: 2 | 4;
  model: AIModelType;
  minHeightEnabled: boolean;
  minHeight: number;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type ImageStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface ImageResult {
  id: string;
  original_image_id: string;
  original_name: string;
  original_width: number;
  original_height: number;
  original_size: number;
  enhanced_width?: number;
  enhanced_height?: number;
  enhanced_size?: number;
  original_url: string;
  enhanced_url?: string;
  scale: number;
  model_name: string;
  status: ImageStatus;
  error?: string;
  processing_time_ms?: number;
}

export interface Job {
  job_id: string;
  status: JobStatus;
  total_images: number;
  completed_images: number;
  failed_images: number;
  progress_percent: number;
  created_at: string;
  finished_at?: string;
  images: ImageResult[];
  error?: string;
}

export interface HealthInfo {
  status: string;
  engine_available: boolean;
  engine_path: string;
  models_available: string[];
  gpu_info: string;
  vulkan_supported: boolean;
  system_time: string;
}
