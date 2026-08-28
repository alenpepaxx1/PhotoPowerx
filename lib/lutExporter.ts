/**
 * PhotoPower - Advanced Photo & Video Studio
 * 3D LUT (.cube format) Exporter Engine
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

import { Adjustments } from '@/types/editor';

/**
 * Converts PhotoPower Studio Adjustments into a standard 3D LUT (.cube format)
 * Compatible with DaVinci Resolve, Adobe Premiere Pro, Final Cut Pro, Photoshop, and Lightroom.
 */
export function generate3DLutCube(
  adjustments: Adjustments,
  lutSize: number = 17,
  title: string = 'PhotoPower_Studio_Grade'
): string {
  let cubeOutput = `# PhotoPower Studio 3D LUT
# Created by Alen Pepa
TITLE "${title}"
LUT_3D_SIZE ${lutSize}
DOMAIN_MIN 0.0 0.0 0.0
DOMAIN_MAX 1.0 1.0 1.0

`;

  const expFactor = Math.pow(2, (adjustments.exposure || 0) / 50);
  const contrastFactor = (100 + (adjustments.contrast || 0)) / 100;
  const satFactor = (100 + (adjustments.saturation || 0)) / 100;

  const tempOffset = ((adjustments.temperature || 0) / 100) * 0.15;
  const tintOffset = ((adjustments.tint || 0) / 100) * 0.15;

  const highlightsFactor = 1 + (adjustments.highlights || 0) / 200;
  const shadowsFactor = 1 + (adjustments.shadows || 0) / 200;

  for (let rIndex = 0; rIndex < lutSize; rIndex++) {
    for (let gIndex = 0; gIndex < lutSize; gIndex++) {
      for (let bIndex = 0; bIndex < lutSize; bIndex++) {
        let r = rIndex / (lutSize - 1);
        let g = gIndex / (lutSize - 1);
        let b = bIndex / (lutSize - 1);

        // 1. Temperature & Tint
        r += tempOffset;
        b -= tempOffset;
        g += tintOffset;

        // 2. Exposure
        r *= expFactor;
        g *= expFactor;
        b *= expFactor;

        // 3. Contrast (around midpoint 0.5)
        r = (r - 0.5) * contrastFactor + 0.5;
        g = (g - 0.5) * contrastFactor + 0.5;
        b = (b - 0.5) * contrastFactor + 0.5;

        // 4. Highlights & Shadows
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        if (luma > 0.5) {
          r *= highlightsFactor;
          g *= highlightsFactor;
          b *= highlightsFactor;
        } else {
          r *= shadowsFactor;
          g *= shadowsFactor;
          b *= shadowsFactor;
        }

        // 5. Saturation
        const avgLuma = 0.299 * r + 0.587 * g + 0.114 * b;
        r = avgLuma + (r - avgLuma) * satFactor;
        g = avgLuma + (g - avgLuma) * satFactor;
        b = avgLuma + (b - avgLuma) * satFactor;

        // Clamp values [0.0, 1.0]
        r = Math.max(0, Math.min(1, r));
        g = Math.max(0, Math.min(1, g));
        b = Math.max(0, Math.min(1, b));

        cubeOutput += `${r.toFixed(6)} ${g.toFixed(6)} ${b.toFixed(6)}\n`;
      }
    }
  }

  return cubeOutput;
}

/**
 * Trigger browser download for generated .cube LUT file
 */
export function download3DLutFile(adjustments: Adjustments, filename: string = 'photopower_grade.cube') {
  const cubeContent = generate3DLutCube(adjustments);
  const blob = new Blob([cubeContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
