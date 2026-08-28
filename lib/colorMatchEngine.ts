/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI Reference Color Match & Palette Transfer Engine
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

export interface ColorMoments {
  meanR: number;
  meanG: number;
  meanB: number;
  stdR: number;
  stdG: number;
  stdB: number;
  palette: string[];
}

/**
 * Extracts RGB Statistical Moments & 5-Color Dominant Palette from HTMLImageElement or HTMLCanvasElement
 */
export function extractColorMoments(source: HTMLImageElement | HTMLCanvasElement): ColorMoments {
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = 100;
  tempCanvas.height = 100;
  const ctx = tempCanvas.getContext('2d');

  if (!ctx) {
    return { meanR: 128, meanG: 128, meanB: 128, stdR: 50, stdG: 50, stdB: 50, palette: [] };
  }

  ctx.drawImage(source, 0, 0, 100, 100);
  const imgData = ctx.getImageData(0, 0, 100, 100);
  const data = imgData.data;

  let sumR = 0, sumG = 0, sumB = 0;
  const count = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
  }

  const meanR = sumR / count;
  const meanG = sumG / count;
  const meanB = sumB / count;

  let varR = 0, varG = 0, varB = 0;
  for (let i = 0; i < data.length; i += 4) {
    varR += Math.pow(data[i] - meanR, 2);
    varG += Math.pow(data[i + 1] - meanG, 2);
    varB += Math.pow(data[i + 2] - meanB, 2);
  }

  const stdR = Math.sqrt(varR / count) || 1;
  const stdG = Math.sqrt(varG / count) || 1;
  const stdB = Math.sqrt(varB / count) || 1;

  // Dominant palette sampling
  const palette: string[] = [];
  const sampleSteps = [10, 30, 50, 70, 90];
  sampleSteps.forEach((step) => {
    const idx = (step * 100 + step) * 4;
    const hex = `#${data[idx].toString(16).padStart(2, '0')}${data[idx + 1].toString(16).padStart(2, '0')}${data[idx + 2].toString(16).padStart(2, '0')}`;
    palette.push(hex);
  });

  return { meanR, meanG, meanB, stdR, stdG, stdB, palette };
}

/**
 * Transfers color distribution from Reference Image to Target Canvas ImageData
 */
export function applyColorMatch(
  targetData: ImageData,
  refMoments: ColorMoments,
  matchStrength: number = 0.8
): ImageData {
  const targetMoments = extractColorMomentsData(targetData);
  const data = targetData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Normalize target pixel around 0 mean
    let normR = (data[i] - targetMoments.meanR) / targetMoments.stdR;
    let normG = (data[i + 1] - targetMoments.meanG) / targetMoments.stdG;
    let normB = (data[i + 2] - targetMoments.meanB) / targetMoments.stdB;

    // Scale to reference distribution
    let matchR = normR * refMoments.stdR + refMoments.meanR;
    let matchG = normG * refMoments.stdG + refMoments.meanG;
    let matchB = normB * refMoments.stdB + refMoments.meanB;

    // Blend with original target pixel using matchStrength
    data[i] = Math.max(0, Math.min(255, data[i] * (1 - matchStrength) + matchR * matchStrength));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * (1 - matchStrength) + matchG * matchStrength));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * (1 - matchStrength) + matchB * matchStrength));
  }

  return targetData;
}

function extractColorMomentsData(imgData: ImageData): ColorMoments {
  const data = imgData.data;
  let sumR = 0, sumG = 0, sumB = 0;
  const count = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    sumR += data[i];
    sumG += data[i + 1];
    sumB += data[i + 2];
  }

  const meanR = sumR / count;
  const meanG = sumG / count;
  const meanB = sumB / count;

  let varR = 0, varG = 0, varB = 0;
  for (let i = 0; i < data.length; i += 4) {
    varR += Math.pow(data[i] - meanR, 2);
    varG += Math.pow(data[i + 1] - meanG, 2);
    varB += Math.pow(data[i + 2] - meanB, 2);
  }

  const stdR = Math.sqrt(varR / count) || 1;
  const stdG = Math.sqrt(varG / count) || 1;
  const stdB = Math.sqrt(varB / count) || 1;

  return { meanR, meanG, meanB, stdR, stdG, stdB, palette: [] };
}
