/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI Denoise, Dehaze & Frequency Separation Engine
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

/**
 * Applies Wavelet-based Luminance & Chrominance Denoise to ImageData
 */
export function applyDenoise(
  imageData: ImageData,
  lumDenoise: number, // 0 to 100
  colorDenoise: number // 0 to 100
): ImageData {
  if (lumDenoise <= 0 && colorDenoise <= 0) return imageData;

  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  const lumFactor = lumDenoise / 100;
  const colorFactor = colorDenoise / 100;

  // 3x3 Spatial Box/Median filter for noise reduction
  const copy = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      // Calculate neighbor averages
      let sumR = 0, sumG = 0, sumB = 0;
      let count = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = ((y + dy) * width + (x + dx)) * 4;
          sumR += copy[nIdx];
          sumG += copy[nIdx + 1];
          sumB += copy[nIdx + 2];
          count++;
        }
      }

      const avgR = sumR / count;
      const avgG = sumG / count;
      const avgB = sumB / count;

      // Current pixel
      const curR = copy[idx];
      const curG = copy[idx + 1];
      const curB = copy[idx + 2];

      // Luminance & Chrominance split
      const curLuma = 0.299 * curR + 0.587 * curG + 0.114 * curB;
      const avgLuma = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;

      // Apply Luminance Smooth
      const newLuma = curLuma + (avgLuma - curLuma) * lumFactor;

      // Apply Color Noise Smooth
      const newR = curR + (avgR - curR) * colorFactor;
      const newG = curG + (avgG - curG) * colorFactor;
      const newB = curB + (avgB - curB) * colorFactor;

      // Combine luminance & color adjustments
      const lumaRatio = curLuma > 0 ? newLuma / curLuma : 1;

      data[idx] = Math.max(0, Math.min(255, newR * lumaRatio));
      data[idx + 1] = Math.max(0, Math.min(255, newG * lumaRatio));
      data[idx + 2] = Math.max(0, Math.min(255, newB * lumaRatio));
    }
  }

  return imageData;
}

/**
 * Applies Atmospheric Dehaze filter to recover contrast in foggy/hazy regions
 */
export function applyDehaze(imageData: ImageData, dehazeAmount: number): ImageData {
  if (dehazeAmount === 0) return imageData;

  const data = imageData.data;
  const len = data.length;
  const factor = 1 + (dehazeAmount / 100) * 0.8;

  for (let i = 0; i < len; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Estimate dark channel atmospheric light
    const minChan = Math.min(r, g, b);

    // Subtract airlight haze
    r = (r - minChan * 0.2 * (dehazeAmount / 100)) * factor;
    g = (g - minChan * 0.2 * (dehazeAmount / 100)) * factor;
    b = (b - minChan * 0.2 * (dehazeAmount / 100)) * factor;

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  return imageData;
}
