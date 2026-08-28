/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

import {
  ToneCurvesState,
  ColorWheelsState,
  HslColorState,
  OpticalVfxState,
  Adjustments,
} from '@/types/editor';

export interface SampleMediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  category: 'Portrait' | 'Landscape' | 'Cyberpunk' | 'Cinematic' | 'Architecture' | 'Nature';
  thumbnailUrl: string;
  mediaUrl: string;
  width: number;
  height: number;
  description: string;
}

export const SAMPLE_MEDIA_LIST: SampleMediaItem[] = [
  {
    id: 'sample-portrait-1',
    title: 'Studio Portrait Editorial',
    type: 'photo',
    category: 'Portrait',
    thumbnailUrl: 'https://picsum.photos/seed/portrait89/400/500',
    mediaUrl: 'https://picsum.photos/seed/portrait89/1200/1500',
    width: 1200,
    height: 1500,
    description: 'High dynamic range studio portrait ideal for skin retouching and tone grading.',
  },
  {
    id: 'sample-cyberpunk-1',
    title: 'Neon Cyberpunk Metropolis',
    type: 'photo',
    category: 'Cyberpunk',
    thumbnailUrl: 'https://picsum.photos/seed/cyberneon42/500/350',
    mediaUrl: 'https://picsum.photos/seed/cyberneon42/1600/1000',
    width: 1600,
    height: 1000,
    description: 'Vibrant neon city night lights perfect for glow filters and synthwave grading.',
  },
  {
    id: 'sample-landscape-1',
    title: 'Alpine Golden Sunset',
    type: 'photo',
    category: 'Landscape',
    thumbnailUrl: 'https://picsum.photos/seed/alpinesun77/500/350',
    mediaUrl: 'https://picsum.photos/seed/alpinesun77/1600/1000',
    width: 1600,
    height: 1000,
    description: 'Breathtaking mountain peaks under warm sunset light for exposure & curves.',
  },
  {
    id: 'sample-architecture-1',
    title: 'Minimalist Modern Geometry',
    type: 'photo',
    category: 'Architecture',
    thumbnailUrl: 'https://picsum.photos/seed/archgeom99/500/350',
    mediaUrl: 'https://picsum.photos/seed/archgeom99/1400/900',
    width: 1400,
    height: 900,
    description: 'Clean architectural perspective for crop, straighten and B&W high contrast.',
  },
  {
    id: 'sample-video-cinematic',
    title: 'Cinematic Flow (Sample Video)',
    type: 'video',
    category: 'Cinematic',
    thumbnailUrl: 'https://picsum.photos/seed/videocover91/500/350',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    width: 1280,
    height: 720,
    description: 'Dynamic 1080p video clip ready for real-time LUT color grading, text subtitles and trim.',
  },
  {
    id: 'sample-video-nature',
    title: 'Nature River Streams (Sample Video)',
    type: 'video',
    category: 'Nature',
    thumbnailUrl: 'https://picsum.photos/seed/naturestream44/500/350',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    width: 1280,
    height: 720,
    description: 'HD video sequence to test speed control, frame extraction, and video overlays.',
  }
];

export const SAMPLE_MEDIA = SAMPLE_MEDIA_LIST;

export const DEFAULT_ADJUSTMENTS: Adjustments = {
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
};

export const DEFAULT_TONE_CURVES: ToneCurvesState = {
  enabled: false,
  activeChannel: 'rgb',
  rgb: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  red: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  green: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  blue: [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
};

export const DEFAULT_COLOR_WHEELS: ColorWheelsState = {
  enabled: false,
  shadows: { hue: 0, saturation: 0, luminance: 0 },
  midtones: { hue: 0, saturation: 0, luminance: 0 },
  highlights: { hue: 0, saturation: 0, luminance: 0 },
};

export const DEFAULT_HSL_STATE: HslColorState = {
  enabled: false,
  red: { hue: 0, saturation: 0, luminance: 0 },
  orange: { hue: 0, saturation: 0, luminance: 0 },
  yellow: { hue: 0, saturation: 0, luminance: 0 },
  green: { hue: 0, saturation: 0, luminance: 0 },
  cyan: { hue: 0, saturation: 0, luminance: 0 },
  blue: { hue: 0, saturation: 0, luminance: 0 },
  purple: { hue: 0, saturation: 0, luminance: 0 },
  magenta: { hue: 0, saturation: 0, luminance: 0 },
};

export const DEFAULT_OPTICAL_VFX: OpticalVfxState = {
  enabled: false,
  flareType: 'none',
  intensity: 60,
  posX: 50,
  posY: 35,
  scale: 1,
  rotation: 0,
  blendMode: 'screen',
};

