/**
 * Keroxio Image API Client
 */

const API_BASE = import.meta.env.VITE_API_URL || 'https://api.keroxio.fr';

export interface Background {
  name: string;
  filename: string;
  path?: string;
  url?: string;
}

export interface ProcessResult {
  id: string;
  status: string;
  transparent_url: string;
  final_url: string;
  background: string;
  processing_time: number;
}

export interface ImageHealth {
  status: string;
  module: string;
  rembg_available: boolean;
  removebg_configured: boolean;
  backgrounds_count: number;
}

export const imageApi = {
  /**
   * Get health status of image module
   */
  async getHealth(): Promise<ImageHealth> {
    const res = await fetch(`${API_BASE}/image/health`);
    if (!res.ok) throw new Error('Failed to fetch health status');
    return res.json();
  },

  /**
   * List available backgrounds
   */
  async getBackgrounds(): Promise<{ backgrounds: Background[]; count: number }> {
    const res = await fetch(`${API_BASE}/image/backgrounds`);
    if (!res.ok) throw new Error('Failed to fetch backgrounds');
    return res.json();
  },

  /**
   * Get background preview URL
   */
  getBackgroundPreviewUrl(name: string): string {
    return `${API_BASE}/image/backgrounds/${name}.jpg`;
  },

  /**
   * Process image with background removal and composite
   */
  async processImage(
    file: File,
    background: string,
    options: {
      position?: 'center' | 'left' | 'right';
      scale?: number;
      vertical_offset?: number;
    } = {}
  ): Promise<ProcessResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('background', background);
    formData.append('position', options.position || 'center');
    formData.append('scale', String(options.scale || 0));
    formData.append('vertical_offset', String(options.vertical_offset || 0));

    const res = await fetch(`${API_BASE}/image/process/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error || 'Processing failed');
    }

    return res.json();
  },

  /**
   * Remove background only (returns PNG)
   */
  async removeBackground(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/image/remove-bg/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Background removal failed');
    return res.blob();
  },
};
