import type { HealthInfo, UploadedImage, Job, EnhanceSettingsState, ImageResult } from '../types';

const API_BASE = '/api';

export const api = {
  async getHealth(): Promise<HealthInfo> {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) {
      throw new Error(`Health check failed with status: ${res.status}`);
    }
    return res.json();
  },

  async uploadImages(files: File[]): Promise<UploadedImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
      throw new Error(err.detail || 'Upload failed');
    }

    return res.json();
  },

  async startEnhancement(
    imageIds: string[],
    settings: EnhanceSettingsState
  ): Promise<Job> {
    const res = await fetch(`${API_BASE}/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_ids: imageIds,
        scale: settings.scale,
        model_name: settings.model,
        output_format: 'png',
        min_height: settings.minHeightEnabled ? settings.minHeight : null,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Enhancement start failed' }));
      throw new Error(err.detail || 'Enhancement start failed');
    }

    return res.json();
  },

  async getJob(jobId: string): Promise<Job> {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch job ${jobId}`);
    }
    return res.json();
  },

  async getJobResults(jobId: string): Promise<ImageResult[]> {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/results`);
    if (!res.ok) {
      throw new Error(`Failed to fetch job results for ${jobId}`);
    }
    return res.json();
  },

  async deleteJob(jobId: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete job ${jobId}`);
    }
    return res.json();
  },

  getDownloadUrl(imageResultId: string): string {
    return `${API_BASE}/download/${imageResultId}`;
  },

  getZipDownloadUrl(jobId: string): string {
    return `${API_BASE}/download-zip/${jobId}`;
  },

  getPreviewUrl(imageId: string): string {
    return `${API_BASE}/preview/${imageId}`;
  },
};
