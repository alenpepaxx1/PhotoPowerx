/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
import {
  Adjustments,
  FilterPreset,
  CurvePoint,
  ToneCurvesState,
  ColorWheelsState,
  HslColorState,
  OpticalVfxState,
} from "@/types/editor";

export const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'original',
    name: 'Normal / Original',
    category: 'Modern',
    description: 'Clean untouched original colors and dynamic range.',
    thumbnailColor: '#4f46e5',
    adjustments: {
      brightness: 0,
      contrast: 0,
      exposure: 0,
      highlights: 0,
      shadows: 0,
      saturation: 0,
      vibrance: 0,
      temperature: 0,
      tint: 0,
      hueRotate: 0,
      sharpness: 0,
      blur: 0,
      vignette: 0,
      grain: 0,
      sepia: 0,
      invert: 0,
      posterize: 0,
      threshold: 0,
    },
  },
  {
    id: 'cinematic-teal-orange',
    name: 'Cinematic Teal & Orange',
    category: 'Cinematic',
    description: 'Hollywood blockbuster look with rich orange skin tones and deep teal shadows.',
    thumbnailColor: '#0284c7',
    adjustments: {
      contrast: 25,
      saturation: 15,
      temperature: 15,
      tint: -10,
      exposure: 5,
      shadows: -15,
      highlights: 10,
      vignette: 25,
      sharpness: 20,
    },
    blendOverlay: {
      color: '#0891b2',
      mode: 'overlay',
      opacity: 0.18,
    },
  },
  {
    id: 'kodak-portra',
    name: 'Kodak Portra 400',
    category: 'Vintage',
    description: 'Timeless 35mm film aesthetic with warm skin tones, soft pastel highlights and subtle grain.',
    thumbnailColor: '#d97706',
    adjustments: {
      contrast: 10,
      temperature: 20,
      tint: 8,
      saturation: -10,
      exposure: 8,
      grain: 18,
      vignette: 15,
      highlights: -10,
      shadows: 15,
    },
    blendOverlay: {
      color: '#f59e0b',
      mode: 'soft-light',
      opacity: 0.15,
    },
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon 2077',
    category: 'Creative',
    description: 'Ultra-vibrant high contrast electric pink, violet and cyan nightlife vibe.',
    thumbnailColor: '#ec4899',
    adjustments: {
      contrast: 35,
      saturation: 50,
      vibrance: 40,
      temperature: -20,
      tint: 35,
      shadows: -20,
      highlights: 25,
      sharpness: 30,
      vignette: 30,
    },
    blendOverlay: {
      color: '#d946ef',
      mode: 'color-dodge',
      opacity: 0.2,
    },
  },
  {
    id: 'noir-bw-contrast',
    name: 'Noir Film B&W',
    category: 'B&W',
    description: 'Dramatic silver-gelatin monochrome with deep crushed blacks and luminous whites.',
    thumbnailColor: '#52525b',
    adjustments: {
      saturation: -100,
      contrast: 45,
      exposure: 5,
      highlights: 20,
      shadows: -30,
      grain: 25,
      sharpness: 35,
      vignette: 35,
    },
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour Sunset',
    category: 'Cinematic',
    description: 'Lush golden afternoon radiance with soft amber glows and lifted shadows.',
    thumbnailColor: '#f59e0b',
    adjustments: {
      brightness: 10,
      contrast: 15,
      temperature: 45,
      tint: 12,
      saturation: 25,
      exposure: 12,
      highlights: 15,
      vignette: 18,
    },
    blendOverlay: {
      color: '#fbbf24',
      mode: 'soft-light',
      opacity: 0.22,
    },
  },
  {
    id: 'retro-vhs-80s',
    name: 'Retro VHS 1986',
    category: 'Vintage',
    description: 'Nostalgic CRT videotape warmth with analog chromatic haze and film texture.',
    thumbnailColor: '#8b5cf6',
    adjustments: {
      contrast: -10,
      saturation: 20,
      grain: 35,
      sepia: 15,
      hueRotate: 10,
      temperature: 15,
      vignette: 20,
    },
    blendOverlay: {
      color: '#a855f7',
      mode: 'screen',
      opacity: 0.15,
    },
  },
  {
    id: 'duotone-synth',
    name: 'Duotone Synthwave',
    category: 'Creative',
    description: 'Striking 2-color duotone mapping blues in shadows and magenta in highlights.',
    thumbnailColor: '#3b82f6',
    adjustments: {
      contrast: 40,
      saturation: 20,
      temperature: -30,
      tint: 50,
      vignette: 40,
    },
    blendOverlay: {
      color: '#6366f1',
      mode: 'hard-light',
      opacity: 0.3,
    },
  },
  {
    id: 'pastel-dream',
    name: 'Pastel Dreamscape',
    category: 'Modern',
    description: 'Soft ethereal tones, lifted velvety blacks, and gentle candy pastel glow.',
    thumbnailColor: '#f472b6',
    adjustments: {
      brightness: 15,
      contrast: -15,
      exposure: 15,
      highlights: -20,
      shadows: 35,
      saturation: 15,
      temperature: 10,
      tint: 15,
      blur: 0,
    },
    blendOverlay: {
      color: '#fbcfe8',
      mode: 'soft-light',
      opacity: 0.25,
    },
  },
  {
    id: 'hdr-vivid',
    name: 'HDR Hyper-Detail',
    category: 'Modern',
    description: 'Ultra-clarity dynamic range with punchy micro-contrast and crisp textures.',
    thumbnailColor: '#10b981',
    adjustments: {
      contrast: 25,
      vibrance: 35,
      saturation: 20,
      highlights: -15,
      shadows: 25,
      sharpness: 50,
      vignette: 15,
    },
  },
  {
    id: 'matte-editorial',
    name: 'Matte Magazine',
    category: 'Vintage',
    description: 'High-fashion editorial flat blacks with sophisticated subdued saturation.',
    thumbnailColor: '#78716c',
    adjustments: {
      contrast: -12,
      shadows: 30,
      highlights: -10,
      saturation: -15,
      temperature: 8,
      grain: 15,
    },
  },
  {
    id: 'nordic-cold',
    name: 'Nordic Frost',
    category: 'Moody',
    description: 'Crisp Scandinavian cold atmosphere with chilled steel blues and clean whites.',
    thumbnailColor: '#38bdf8',
    adjustments: {
      temperature: -45,
      tint: -10,
      saturation: -20,
      contrast: 20,
      exposure: 5,
      sharpness: 25,
      vignette: 20,
    },
    blendOverlay: {
      color: '#bae6fd',
      mode: 'soft-light',
      opacity: 0.2,
    },
  },
  {
    id: 'emerald-forest',
    name: 'Emerald Rainforest',
    category: 'Moody',
    description: 'Deep lush botanical greens with enchanted moody earthy contrast.',
    thumbnailColor: '#059669',
    adjustments: {
      contrast: 20,
      saturation: 25,
      temperature: -15,
      tint: -35,
      shadows: -15,
      highlights: 10,
      vignette: 25,
    },
  },
  {
    id: 'infrared-fantasy',
    name: 'Infrared Surrealism',
    category: 'Creative',
    description: 'Dreamlike false-color infrared spectrum turning foliage into golden pinks.',
    thumbnailColor: '#e11d48',
    adjustments: {
      hueRotate: 180,
      saturation: 30,
      contrast: 25,
      vibrance: 40,
      vignette: 30,
    },
  },
];

/**
 * Generate CSS Filter string for real-time live preview
 */
export function getCssFilterString(adj: Adjustments): string {
  const filters: string[] = [];

  // Brightness: default 100% -> 100 + adj.brightness
  const brightnessVal = Math.max(0, 100 + adj.brightness + adj.exposure * 0.8);
  filters.push(`brightness(${brightnessVal}%)`);

  // Contrast: default 100% -> 100 + adj.contrast
  const contrastVal = Math.max(0, 100 + adj.contrast);
  filters.push(`contrast(${contrastVal}%)`);

  // Saturation & Vibrance: default 100%
  const satVal = Math.max(0, 100 + adj.saturation + adj.vibrance * 0.5);
  filters.push(`saturate(${satVal}%)`);

  // Hue Rotate
  if (adj.hueRotate) {
    filters.push(`hue-rotate(${adj.hueRotate}deg)`);
  }

  // Sepia
  if (adj.sepia > 0) {
    filters.push(`sepia(${adj.sepia}%)`);
  }

  // Invert
  if (adj.invert > 0) {
    filters.push(`invert(${adj.invert}%)`);
  }

  // Blur
  if (adj.blur > 0) {
    filters.push(`blur(${adj.blur}px)`);
  }

  return filters.join(' ');
}

/**
 * Apply full pixel-level color grading on HTMLCanvasElement context
 */
export function applyCanvasAdjustments(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  adj: Adjustments
) {
  if (width <= 0 || height <= 0) return;

  // Temperature & Tint adjustment / Color cast simulation
  if (adj.temperature !== 0 || adj.tint !== 0) {
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';

    let r = 128;
    let g = 128;
    let b = 128;

    // Warm: increase red/yellow, decrease blue. Cool: increase blue, decrease red.
    if (adj.temperature > 0) {
      r += adj.temperature * 0.9;
      g += adj.temperature * 0.4;
      b -= adj.temperature * 0.6;
    } else {
      b -= adj.temperature * 0.9;
      g -= adj.temperature * 0.2;
      r += adj.temperature * 0.7;
    }

    // Tint: Magenta (+) vs Green (-)
    if (adj.tint > 0) {
      r += adj.tint * 0.5;
      b += adj.tint * 0.5;
      g -= adj.tint * 0.6;
    } else {
      g -= adj.tint * 0.7;
      r += adj.tint * 0.3;
      b += adj.tint * 0.3;
    }

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    const intensity = Math.min(0.7, (Math.abs(adj.temperature) + Math.abs(adj.tint)) / 140);
    ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${intensity})`;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Vignette overlay
  if (adj.vignette > 0) {
    ctx.save();
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.sqrt(cx * cx + cy * cy);
    const grad = ctx.createRadialGradient(cx, cy, radius * 0.35, cx, cy, radius);
    const opacity = (adj.vignette / 100) * 0.9;
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.7, `rgba(0,0,0,${opacity * 0.4})`);
    grad.addColorStop(1, `rgba(0,0,0,${opacity})`);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Film Grain / Noise injection
  if (adj.grain > 0) {
    ctx.save();
    const grainCanvas = document.createElement('canvas');
    const gw = Math.min(width, 400);
    const gh = Math.min(height, 400);
    grainCanvas.width = gw;
    grainCanvas.height = gh;
    const gctx = grainCanvas.getContext('2d');
    if (gctx) {
      const gImgData = gctx.createImageData(gw, gh);
      const data = gImgData.data;
      const grainAmount = adj.grain * 1.5;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainAmount;
        const val = 128 + noise;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.min(255, Math.abs(noise) * 2.5);
      }
      gctx.putImageData(gImgData, 0, 0);

      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = Math.min(0.55, adj.grain / 100);
      const pattern = ctx.createPattern(grainCanvas, 'repeat');
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
    }
    ctx.restore();
  }

  // Pixel-level convolution / sharpness / threshold if enabled
  if (adj.sharpness > 0 || adj.threshold > 0 || adj.posterize > 0) {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;

      // Posterize
      if (adj.posterize > 1) {
        const levels = Math.max(2, Math.min(16, adj.posterize));
        const step = 255 / (levels - 1);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.round(data[i] / step) * step;
          data[i + 1] = Math.round(data[i + 1] / step) * step;
          data[i + 2] = Math.round(data[i + 2] / step) * step;
        }
      }

      // Threshold (High contrast black & white cut)
      if (adj.threshold > 0) {
        const thresh = adj.threshold;
        for (let i = 0; i < data.length; i += 4) {
          const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          const val = luma >= thresh ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
      }

      ctx.putImageData(imgData, 0, 0);
    } catch {
      // Cross-origin image safety fallback
    }
  }
}

/**
 * Compute 256-value Lookup Table (LUT) from tone curve control points using cubic spline interpolation
 */
export function computeCurveLut(points: CurvePoint[]): Uint8Array {
  const lut = new Uint8Array(256);
  if (!points || points.length < 2) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }

  // Sort points by X ascending
  const sorted = [...points].sort((a, b) => a.x - b.x);

  // If curve is default linear (0,0) -> (255,255)
  if (
    sorted.length === 2 &&
    sorted[0].x === 0 &&
    sorted[0].y === 0 &&
    sorted[1].x === 255 &&
    sorted[1].y === 255
  ) {
    for (let i = 0; i < 256; i++) lut[i] = i;
    return lut;
  }

  // Piecewise monotonic cubic interpolation
  for (let i = 0; i < 256; i++) {
    if (i <= sorted[0].x) {
      lut[i] = Math.max(0, Math.min(255, Math.round(sorted[0].y)));
      continue;
    }
    if (i >= sorted[sorted.length - 1].x) {
      lut[i] = Math.max(0, Math.min(255, Math.round(sorted[sorted.length - 1].y)));
      continue;
    }

    // Find segment
    let segIdx = 0;
    for (let j = 0; j < sorted.length - 1; j++) {
      if (i >= sorted[j].x && i <= sorted[j + 1].x) {
        segIdx = j;
        break;
      }
    }

    const p0 = sorted[segIdx];
    const p1 = sorted[segIdx + 1];
    const dx = Math.max(1, p1.x - p0.x);
    const t = (i - p0.x) / dx;

    // Smoothstep cubic ease
    const smoothT = t * t * (3 - 2 * t);
    const yVal = p0.y + (p1.y - p0.y) * smoothT;
    lut[i] = Math.max(0, Math.min(255, Math.round(yVal)));
  }

  return lut;
}

/**
 * Apply Tone Curves (RGB Master, Red, Green, Blue) to canvas pixels
 */
export function applyToneCurves(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  curves: ToneCurvesState
) {
  if (!curves || !curves.enabled) return;

  const rgbLut = computeCurveLut(curves.rgb);
  const redLut = computeCurveLut(curves.red);
  const greenLut = computeCurveLut(curves.green);
  const blueLut = computeCurveLut(curves.blue);

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      // 1. Channel specific curves
      let r = redLut[data[i]];
      let g = greenLut[data[i + 1]];
      let b = blueLut[data[i + 2]];

      // 2. Master RGB curve
      data[i] = rgbLut[r];
      data[i + 1] = rgbLut[g];
      data[i + 2] = rgbLut[b];
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Cross-origin safe
  }
}

/**
 * Helper: Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360 / 360;
  s = Math.max(0, Math.min(1, s / 100));
  l = Math.max(0, Math.min(1, l / 100));

  if (s === 0) {
    const val = Math.round(l * 255);
    return [val, val, val];
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return [r, g, b];
}

/**
 * Helper: Convert RGB to HSL
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return [h, s * 100, l * 100];
}

/**
 * Apply 3-Way Color Wheels (Lift / Shadows, Gamma / Midtones, Gain / Highlights)
 */
export function applyColorWheels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  wheels: ColorWheelsState
) {
  if (!wheels || !wheels.enabled) return;

  const { shadows, midtones, highlights } = wheels;
  if (
    shadows.saturation === 0 &&
    shadows.luminance === 0 &&
    midtones.saturation === 0 &&
    midtones.luminance === 0 &&
    highlights.saturation === 0 &&
    highlights.luminance === 0
  ) {
    return;
  }

  // Precompute RGB shifts for wheels
  const [sr, sg, sb] = hslToRgb(shadows.hue, shadows.saturation, 50);
  const shadowRShift = (sr - 128) / 128;
  const shadowGShift = (sg - 128) / 128;
  const shadowBShift = (sb - 128) / 128;

  const [mr, mg, mb] = hslToRgb(midtones.hue, midtones.saturation, 50);
  const midRShift = (mr - 128) / 128;
  const midGShift = (mg - 128) / 128;
  const midBShift = (mb - 128) / 128;

  const [hr, hg, hb] = hslToRgb(highlights.hue, highlights.saturation, 50);
  const highRShift = (hr - 128) / 128;
  const highGShift = (hg - 128) / 128;
  const highBShift = (hb - 128) / 128;

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

      // Weights for 3-way balance
      const shadowWeight = Math.pow(1 - luma, 2);
      const highlightWeight = Math.pow(luma, 2);
      const midtoneWeight = Math.max(0, 1 - shadowWeight - highlightWeight);

      // Color offsets
      let deltaR =
        shadowRShift * shadowWeight * 80 +
        midRShift * midtoneWeight * 80 +
        highRShift * highlightWeight * 80;
      let deltaG =
        shadowGShift * shadowWeight * 80 +
        midGShift * midtoneWeight * 80 +
        highGShift * highlightWeight * 80;
      let deltaB =
        shadowBShift * shadowWeight * 80 +
        midBShift * midtoneWeight * 80 +
        highBShift * highlightWeight * 80;

      // Luminance offsets
      const lumDelta =
        (shadows.luminance * shadowWeight +
          midtones.luminance * midtoneWeight +
          highlights.luminance * highlightWeight) *
        0.8;

      data[i] = Math.max(0, Math.min(255, r + deltaR + lumDelta));
      data[i + 1] = Math.max(0, Math.min(255, g + deltaG + lumDelta));
      data[i + 2] = Math.max(0, Math.min(255, b + deltaB + lumDelta));
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Cross-origin safe
  }
}

/**
 * Apply 8-Channel Selective HSL Color Adjustment
 */
export function applyHslAdjustment(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hslState: HslColorState
) {
  if (!hslState || !hslState.enabled) return;

  const channels = [
    { name: 'red', center: 0, shift: hslState.red },
    { name: 'orange', center: 30, shift: hslState.orange },
    { name: 'yellow', center: 60, shift: hslState.yellow },
    { name: 'green', center: 120, shift: hslState.green },
    { name: 'cyan', center: 180, shift: hslState.cyan },
    { name: 'blue', center: 240, shift: hslState.blue },
    { name: 'purple', center: 280, shift: hslState.purple },
    { name: 'magenta', center: 320, shift: hslState.magenta },
  ];

  const hasAnyShift = channels.some(
    (c) => c.shift.hue !== 0 || c.shift.saturation !== 0 || c.shift.luminance !== 0
  );
  if (!hasAnyShift) return;

  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const [h, s, l] = rgbToHsl(data[i], data[i + 1], data[i + 2]);
      if (s < 5) continue; // Skip near neutral greys

      let totalHueShift = 0;
      let totalSatShift = 0;
      let totalLumShift = 0;
      let totalWeight = 0;

      for (const ch of channels) {
        let diff = Math.abs(h - ch.center);
        if (diff > 180) diff = 360 - diff;

        if (diff < 35) {
          const weight = (1 - diff / 35) * (s / 100);
          totalHueShift += ch.shift.hue * weight;
          totalSatShift += ch.shift.saturation * weight;
          totalLumShift += ch.shift.luminance * weight;
          totalWeight += weight;
        }
      }

      if (totalWeight > 0) {
        const newH = (h + totalHueShift + 360) % 360;
        const newS = Math.max(0, Math.min(100, s + totalSatShift));
        const newL = Math.max(0, Math.min(100, l + totalLumShift));

        const [nr, ng, nb] = hslToRgb(newH, newS, newL);
        data[i] = nr;
        data[i + 1] = ng;
        data[i + 2] = nb;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Cross-origin safe
  }
}

/**
 * Apply Cinematic Optical VFX, Light Leaks, Flares & Scanlines
 */
export function applyOpticalVfx(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  vfx: OpticalVfxState
) {
  if (!vfx || !vfx.enabled || vfx.flareType === 'none' || vfx.intensity <= 0) return;

  const cx = (vfx.posX / 100) * width;
  const cy = (vfx.posY / 100) * height;
  const intensity = vfx.intensity / 100;
  const scale = vfx.scale || 1;

  ctx.save();
  ctx.globalCompositeOperation = vfx.blendMode || 'screen';
  ctx.globalAlpha = Math.min(1, intensity);

  switch (vfx.flareType) {
    case 'anamorphic-blue': {
      // Hollywood Anamorphic Blue Flare with laser streaks
      const beamW = width * 1.6 * scale;
      const beamH = Math.max(6, 24 * scale);

      ctx.translate(cx, cy);
      ctx.rotate(((vfx.rotation || 0) * Math.PI) / 180);

      // Core glow
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 80 * scale);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.2, '#38bdf8');
      coreGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.4)');
      coreGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 80 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal wide beam
      const beamGrad = ctx.createLinearGradient(-beamW / 2, 0, beamW / 2, 0);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      beamGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.4)');
      beamGrad.addColorStop(0.5, '#ffffff');
      beamGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.4)');
      beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(-beamW / 2, -beamH / 2, beamW, beamH);

      // Fine streak
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-beamW / 2, -1, beamW, 2);
      break;
    }

    case 'sunburst-golden': {
      // Golden Hour Sunburst with polygonal lens ghosting
      const radius = Math.min(width, height) * 0.45 * scale;
      const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.15, '#fef08a');
      sunGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.6)');
      sunGrad.addColorStop(0.75, 'rgba(217, 119, 6, 0.2)');
      sunGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Golden light rays
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
      for (let r = 0; r < 12; r++) {
        ctx.rotate(Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-radius * 0.1, radius);
        ctx.lineTo(radius * 0.1, radius);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'light-leak-warm': {
      // Vintage Light Leak
      const leakGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, width * 0.8 * scale);
      leakGrad.addColorStop(0, 'rgba(255, 180, 100, 0.9)');
      leakGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)');
      leakGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.25)');
      leakGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.fillStyle = leakGrad;
      ctx.fillRect(0, 0, width, height);
      break;
    }

    case 'prism-rainbow': {
      // Prism Rainbow Glint
      const rW = width * 0.7 * scale;
      const rH = height * 0.35 * scale;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(((vfx.rotation || 25) * Math.PI) / 180);

      const rainbowGrad = ctx.createLinearGradient(-rW / 2, 0, rW / 2, 0);
      rainbowGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
      rainbowGrad.addColorStop(0.15, 'rgba(239, 68, 68, 0.7)');
      rainbowGrad.addColorStop(0.3, 'rgba(245, 158, 11, 0.7)');
      rainbowGrad.addColorStop(0.45, 'rgba(34, 197, 94, 0.7)');
      rainbowGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.7)');
      rainbowGrad.addColorStop(0.75, 'rgba(59, 130, 246, 0.7)');
      rainbowGrad.addColorStop(0.9, 'rgba(168, 85, 247, 0.7)');
      rainbowGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.fillStyle = rainbowGrad;
      ctx.fillRect(-rW / 2, -rH / 2, rW, rH);
      ctx.restore();
      break;
    }

    case 'vintage-dust': {
      // Film Dust & Scratches
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let d = 0; d < 80; d++) {
        const px = Math.sin(d * 997) * width;
        const py = Math.cos(d * 733) * height;
        const size = (Math.abs(Math.sin(d * 13)) * 2 + 0.5) * scale;
        ctx.beginPath();
        ctx.arc(Math.abs(px), Math.abs(py), size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vertical hair / scratch lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 0.8;
      for (let s = 0; s < 4; s++) {
        const sx = (Math.abs(Math.sin(s * 41)) * width * 0.9) + width * 0.05;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx + Math.sin(s) * 15, height);
        ctx.stroke();
      }
      break;
    }

    case 'crt-scanlines': {
      // Retro CRT Scanlines Raster
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      const step = Math.max(3, Math.round(4 * scale));
      for (let y = 0; y < height; y += step) {
        ctx.fillRect(0, y, width, 1.5);
      }
      break;
    }

    case 'chromatic-aberration': {
      // RGB Channel Displacement Glitch
      try {
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const copy = new Uint8ClampedArray(data);
        const shift = Math.round(Math.max(2, 8 * scale * intensity));

        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;

            // Red channel shifted right
            const redX = Math.min(width - 1, x + shift);
            const redIdx = (y * width + redX) * 4;
            data[idx] = copy[redIdx];

            // Blue channel shifted left
            const blueX = Math.max(0, x - shift);
            const blueIdx = (y * width + blueX) * 4;
            data[idx + 2] = copy[blueIdx + 2];
          }
        }

        ctx.putImageData(imgData, 0, 0);
      } catch {
        // Cross origin safe
      }
      break;
    }
  }

  ctx.restore();
}

/**
 * Helper function for batch processing canvas filters
 */
export function applyFilterToCanvas(
  canvas: HTMLCanvasElement,
  filterId: string,
  adjustments: Adjustments
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const preset = FILTER_PRESETS.find((p) => p.id === filterId);
  const combinedAdj = preset ? { ...adjustments, ...preset.adjustments } : adjustments;
  applyCanvasAdjustments(ctx, canvas.width, canvas.height, combinedAdj);
}

