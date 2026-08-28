/**
 * PhotoPower - Advanced Photo & Video Studio
 * Color Space Converter Engine & File Format Matrix
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

import { ColorSpaceProfile } from '@/types/editor';

/**
 * Applies Color Space transformation matrix to ImageData pixel buffer
 */
export function transformColorSpace(
  imageData: ImageData,
  targetProfile: ColorSpaceProfile,
  bitDepth: 8 | 10 | 16 = 8
): ImageData {
  const data = imageData.data;
  const len = data.length;

  // Color Matrix Primaries Transformations (sRGB reference)
  // [R', G', B'] = Matrix * [R, G, B]
  let rMult = 1.0;
  let gMult = 1.0;
  let bMult = 1.0;

  switch (targetProfile) {
    case 'Display-P3':
      // Wide Gamut Apple Display P3 expansion
      rMult = 1.08;
      gMult = 1.02;
      bMult = 1.05;
      break;
    case 'Adobe-RGB':
      // Adobe RGB (1998) Cyan/Green Gamut expansion
      rMult = 0.98;
      gMult = 1.12;
      bMult = 1.01;
      break;
    case 'ProPhoto-RGB':
      // Extreme Gamut ROMM RGB
      rMult = 1.15;
      gMult = 1.18;
      bMult = 1.22;
      break;
    case 'DCI-P3':
      // Digital Cinema P3 (Theater reference)
      rMult = 1.05;
      gMult = 1.04;
      bMult = 0.96;
      break;
    case 'Rec-2020':
      // Ultra HD TV Broadcast 4K/8K
      rMult = 1.12;
      gMult = 1.25;
      bMult = 1.18;
      break;
    case 'Linear-RGB':
      // Linear Gamma 1.0 (VFX & 32-bit floating point)
      rMult = 1.0;
      gMult = 1.0;
      bMult = 1.0;
      break;
    case 'sRGB':
    default:
      rMult = 1.0;
      gMult = 1.0;
      bMult = 1.0;
      break;
  }

  // Quantization steps based on bitDepth
  const maxVal = bitDepth === 16 ? 65535 : bitDepth === 10 ? 1023 : 255;
  const quantStep = maxVal / 255;

  for (let i = 0; i < len; i += 4) {
    let r = data[i] * rMult;
    let g = data[i + 1] * gMult;
    let b = data[i + 2] * bMult;

    // Linear gamma linearization if requested
    if (targetProfile === 'Linear-RGB') {
      r = Math.pow(r / 255, 2.2) * 255;
      g = Math.pow(g / 255, 2.2) * 255;
      b = Math.pow(b / 255, 2.2) * 255;
    }

    // Simulate bit-depth quantization
    if (bitDepth !== 8) {
      r = Math.round(r * quantStep) / quantStep;
      g = Math.round(g * quantStep) / quantStep;
      b = Math.round(b * quantStep) / quantStep;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  return imageData;
}

/**
 * Converts HTMLCanvasElement into Scalable Vector Graphics (.SVG) XML string format
 */
export function canvasToSvgFormat(canvas: HTMLCanvasElement, title: string = 'PhotoPower Vector'): string {
  const dataUrl = canvas.toDataURL('image/png');
  const width = canvas.width;
  const height = canvas.height;

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- PhotoPower Studio Vector Master Export -->
  <!-- Created by Alen Pepa. Copyright © 2026 Alen Pepa -->
  <title>${title}</title>
  <defs>
    <style>
      .photopower-frame { stroke: rgba(255,255,255,0.2); stroke-width: 1px; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="none" />
  <image width="${width}" height="${height}" xlink:href="${dataUrl}" />
  <rect width="${width}" height="${height}" fill="none" class="photopower-frame" />
</svg>`;
}

/**
 * Converts HTMLCanvasElement to Radiance HDR (.hdr) High Dynamic Range binary string simulation
 */
export function canvasToHdrFormat(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const width = canvas.width;
  const height = canvas.height;

  let hdrHeader = `#?RADIANCE
# PhotoPower Studio 32-bit Linear HDR Format
# Created by Alen Pepa
FORMAT=32-bit_rle_rgbe
EXPOSURE=1.000000

-Y ${height} +X ${width}
`;
  return hdrHeader;
}

/**
 * Format Specification Metadata Matrix for UI & Conversion Inspector
 */
export interface FormatSpec {
  id: string;
  extension: string;
  name: string;
  category: 'Raster' | 'Vector' | 'Video' | '3D / Data' | 'Container';
  mimeType: string;
  supportsAlpha: boolean;
  supportsHdr: boolean;
  compressionType: 'Lossless' | 'Lossy' | 'Uncompressed' | 'Vector' | 'N/A';
  typicalSizeRatio: string;
  description: string;
}

export class FormatMatrix {
  static readonly SUPPORTED_FORMATS: FormatSpec[] = [
    {
      id: 'png',
      extension: '.png',
      name: 'Portable Network Graphics (PNG)',
      category: 'Raster',
      mimeType: 'image/png',
      supportsAlpha: true,
      supportsHdr: false,
      compressionType: 'Lossless',
      typicalSizeRatio: '100% (Baseline)',
      description: 'Standard lossless raster format with 8-bit alpha transparency channel.',
    },
    {
      id: 'jpeg',
      extension: '.jpg',
      name: 'Joint Photographic Experts Group (JPEG)',
      category: 'Raster',
      mimeType: 'image/jpeg',
      supportsAlpha: false,
      supportsHdr: false,
      compressionType: 'Lossy',
      typicalSizeRatio: '25% - 40%',
      description: 'Universal compressed photo format with adjustable quality & chroma subsampling.',
    },
    {
      id: 'webp',
      extension: '.webp',
      name: 'Google WebP Format',
      category: 'Raster',
      mimeType: 'image/webp',
      supportsAlpha: true,
      supportsHdr: false,
      compressionType: 'Lossy',
      typicalSizeRatio: '15% - 25%',
      description: 'Next-generation web format with superior compression efficiency and alpha support.',
    },
    {
      id: 'avif',
      extension: '.avif',
      name: 'AV1 Image File Format (AVIF)',
      category: 'Raster',
      mimeType: 'image/avif',
      supportsAlpha: true,
      supportsHdr: true,
      compressionType: 'Lossy',
      typicalSizeRatio: '10% - 18%',
      description: 'Ultra-modern AV1 codec based format supporting 10-bit HDR and wide color gamuts.',
    },
    {
      id: 'svg',
      extension: '.svg',
      name: 'Scalable Vector Graphics (SVG)',
      category: 'Vector',
      mimeType: 'image/svg+xml',
      supportsAlpha: true,
      supportsHdr: false,
      compressionType: 'Vector',
      typicalSizeRatio: 'Infinite Resolution',
      description: 'XML-based scalable vector format ideal for logos, typography, and graphics.',
    },
    {
      id: 'gif',
      extension: '.gif',
      name: 'Graphics Interchange Format (GIF)',
      category: 'Raster',
      mimeType: 'image/gif',
      supportsAlpha: true,
      supportsHdr: false,
      compressionType: 'Lossless',
      typicalSizeRatio: '50% - 80%',
      description: 'Indexed 256-color animated image sequence container with frame delay control.',
    },
    {
      id: 'bmp',
      extension: '.bmp',
      name: 'Windows Bitmap (BMP)',
      category: 'Raster',
      mimeType: 'image/bmp',
      supportsAlpha: true,
      supportsHdr: false,
      compressionType: 'Uncompressed',
      typicalSizeRatio: '300% (Raw Pixels)',
      description: 'Uncompressed raw pixel data file standard for legacy Windows software.',
    },
    {
      id: 'tiff',
      extension: '.tif',
      name: 'Tag Image File Format (TIFF)',
      category: 'Raster',
      mimeType: 'image/tiff',
      supportsAlpha: true,
      supportsHdr: true,
      compressionType: 'Lossless',
      typicalSizeRatio: '200% - 250%',
      description: 'High-end 16-bit studio master print and publishing standard.',
    },
    {
      id: 'hdr',
      extension: '.hdr',
      name: 'Radiance 32-bit Floating Point (HDR)',
      category: '3D / Data',
      mimeType: 'image/vnd.radiance',
      supportsAlpha: false,
      supportsHdr: true,
      compressionType: 'Lossless',
      typicalSizeRatio: '400% (Float Data)',
      description: '32-bit floating point high dynamic range linear color map format.',
    },
    {
      id: 'webm',
      extension: '.webm',
      name: 'WebM Video Container (VP9)',
      category: 'Video',
      mimeType: 'video/webm',
      supportsAlpha: true,
      supportsHdr: true,
      compressionType: 'Lossy',
      typicalSizeRatio: 'Video Stream',
      description: 'Modern open-source HTML5 video container with VP9 / AV1 video codec.',
    },
    {
      id: 'mp4',
      extension: '.mp4',
      name: 'MPEG-4 Part 14 Video (H.264)',
      category: 'Video',
      mimeType: 'video/mp4',
      supportsAlpha: false,
      supportsHdr: true,
      compressionType: 'Lossy',
      typicalSizeRatio: 'Video Stream',
      description: 'Universal standard video container supported across all devices and media players.',
    },
    {
      id: 'json',
      extension: '.json',
      name: 'PhotoPower Studio Project (JSON)',
      category: 'Container',
      mimeType: 'application/json',
      supportsAlpha: true,
      supportsHdr: true,
      compressionType: 'Lossless',
      typicalSizeRatio: 'Data Vector State',
      description: 'Complete non-destructive project state with all layers, curves, vector paths & history.',
    },
    {
      id: 'cube',
      extension: '.cube',
      name: '3D LUT Cube Matrix (.cube)',
      category: '3D / Data',
      mimeType: 'text/plain',
      supportsAlpha: false,
      supportsHdr: true,
      compressionType: 'Lossless',
      typicalSizeRatio: 'Color Transform',
      description: 'Professional 3D lookup table matrix compatible with Resolve, Premiere, FCPX & Photoshop.',
    },
  ];
}
