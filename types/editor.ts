/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

export type ToolType =
  | 'select' // Move / Transform
  | 'crop' // Crop & Straighten
  | 'brush' // Freehand Brush
  | 'eraser' // Pixel / Stroke Eraser
  | 'retouch' // Healing / Smooth / Dodge & Burn
  | 'text' // Typography
  | 'shape' // Vector Shapes
  | 'gradient' // Gradient Tool
  | 'eyedropper' // Color Picker
  | 'wand' // Quick / Magic Selection
  | 'hand' // Pan canvas
  | 'zoom'; // Zoom in/out

export type BrushMode =
  | 'round'
  | 'soft'
  | 'airbrush'
  | 'calligraphy'
  | 'neon'
  | 'highlighter'
  | 'spray';

export type RetouchMode =
  | 'heal' // Spot healing simulation
  | 'smooth' // Skin smoothing blur
  | 'dodge' // Lighten
  | 'burn' // Darken
  | 'sharpen'; // Local sharpen

export type ShapeType =
  | 'rectangle'
  | 'rounded-rect'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'arrow'
  | 'line'
  | 'heart'
  | 'callout';

export type BlendMode =
  | 'source-over' // Normal
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export type LayerType = 'image' | 'video' | 'text' | 'shape' | 'drawing' | 'adjustment';

export interface Point {
  x: number;
  y: number;
}

export interface BrushStroke {
  id: string;
  points: Point[];
  color: string;
  size: number;
  opacity: number;
  brushMode: BrushMode;
}

export interface Adjustments {
  // Lighting
  brightness: number; // -100 to 100 (0 default)
  contrast: number; // -100 to 100 (0 default)
  exposure: number; // -100 to 100 (0 default)
  highlights: number; // -100 to 100 (0 default)
  shadows: number; // -100 to 100 (0 default)

  // Color
  saturation: number; // -100 to 100 (0 default)
  vibrance: number; // -100 to 100 (0 default)
  temperature: number; // -100 (cool) to 100 (warm)
  tint: number; // -100 (green) to 100 (magenta)
  hueRotate: number; // 0 to 360 deg

  // Detail & FX
  sharpness: number; // 0 to 100
  blur: number; // 0 to 50 px
  vignette: number; // 0 to 100 %
  grain: number; // 0 to 100 %
  sepia: number; // 0 to 100 %
  invert: number; // 0 to 100 %
  posterize: number; // 0 (off) to 16
  threshold: number; // 0 (off) to 255
}

export interface CurvePoint {
  x: number; // 0 to 255
  y: number; // 0 to 255
}

export type CurveControlPoint = CurvePoint;
export type ToneCurveChannel = 'rgb' | 'red' | 'green' | 'blue';

export interface ToneCurvesState {
  enabled: boolean;
  activeChannel: 'rgb' | 'red' | 'green' | 'blue';
  rgb: CurvePoint[];
  red: CurvePoint[];
  green: CurvePoint[];
  blue: CurvePoint[];
}

export interface ColorWheelBalance {
  hue: number; // 0 to 360
  saturation: number; // 0 to 100
  luminance: number; // -100 to 100
}

export interface ColorWheelsState {
  enabled: boolean;
  shadows: ColorWheelBalance;
  midtones: ColorWheelBalance;
  highlights: ColorWheelBalance;
}

export type HslChannelName = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'magenta';

export interface HslChannelShift {
  hue: number; // -180 to 180
  saturation: number; // -100 to 100
  luminance: number; // -100 to 100
}

export type HslChannelValue = HslChannelShift;

export interface HslColorState {
  enabled: boolean;
  red: HslChannelShift;
  orange: HslChannelShift;
  yellow: HslChannelShift;
  green: HslChannelShift;
  cyan: HslChannelShift;
  blue: HslChannelShift;
  purple: HslChannelShift;
  magenta: HslChannelShift;
}

export type FlareType =
  | 'none'
  | 'anamorphic-blue'
  | 'sunburst-golden'
  | 'golden-sunburst'
  | 'prism-rainbow'
  | 'prism-glint'
  | 'vintage-dust'
  | 'vintage-leak'
  | 'film-dust'
  | 'crt-scanlines'
  | 'chromatic-aberration'
  | 'light-leak-warm';

export type FlareEffectType = FlareType;

export interface OpticalVfxState {
  enabled: boolean;
  flareType: FlareType;
  intensity: number; // 0 to 100
  posX: number; // 0 to 100 (%)
  posY: number; // 0 to 100 (%)
  scale: number; // 0.2 to 3
  rotation: number; // 0 to 360
  blendMode: BlendMode;
}

export interface SplitCompareState {
  enabled?: boolean;
  active: boolean;
  position: number; // 0 to 1 (0.5 default)
}

export interface LayerStyleEffects {
  dropShadow?: {
    enabled: boolean;
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
    opacity?: number;
  };
  outerGlow?: {
    enabled: boolean;
    color?: string;
    blur?: number;
    opacity?: number;
  };
  strokeOutline?: {
    enabled: boolean;
    color?: string;
    width?: number;
  };
}

export interface TextProperties {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  letterSpacing: number;
  lineHeight: number;
  arcAngle: number; // -180 to 180 (curved text)
  backgroundPill: boolean;
  backgroundColor: string;
  backgroundPadding: number;
  textTransform: 'none' | 'uppercase' | 'lowercase';
  // Video overlay timing (seconds)
  startTime?: number;
  endTime?: number;
  animation?: 'none' | 'fade' | 'slide-up' | 'pop' | 'typewriter';
}

export interface ShapeProperties {
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  cornerRadius: number;
  points?: number; // for star/polygon
  startArrow?: boolean;
  endArrow?: boolean;
  opacity: number;
  shadowColor: string;
  shadowBlur: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  scaleX: number; // 1 or -1 for flip
  scaleY: number; // 1 or -1 for flip

  // Content based on layer type
  imageUrl?: string;
  imageElement?: HTMLImageElement | null;
  videoUrl?: string;
  videoElement?: HTMLVideoElement | null;
  textProps?: TextProperties;
  shapeProps?: ShapeProperties;
  drawingStrokes?: BrushStroke[];
  adjustments?: Adjustments;
  filterPreset?: string;
  styles?: LayerStyleEffects;
}

export interface FilterPreset {
  id: string;
  name: string;
  category: 'Cinematic' | 'Vintage' | 'Creative' | 'B&W' | 'Modern' | 'Moody';
  description: string;
  thumbnailColor: string;
  adjustments: Partial<Adjustments>;
  blendOverlay?: {
    color: string;
    mode: BlendMode;
    opacity: number;
  };
  customCssFilter?: string;
}

export interface VideoState {
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  playbackRate: number; // 0.25, 0.5, 1, 1.5, 2
  loop: boolean;
  volume: number; // 0 to 1
  muted: boolean;
  trimStart: number; // in seconds
  trimEnd: number; // in seconds
  fps: number;
}

export interface CropSettings {
  active: boolean;
  aspectRatio: 'free' | '1:1' | '4:5' | '16:9' | '9:16' | '3:2' | '4:3' | '2:3' | '21:9';
  x: number;
  y: number;
  width: number;
  height: number;
  straightenAngle: number; // -45 to 45 deg
}

export interface HistoryState {
  id: string;
  actionName: string;
  timestamp: number;
  layers: Layer[];
  selectedLayerId: string | null;
  canvasWidth: number;
  canvasHeight: number;
  globalAdjustments: Adjustments;
  toneCurves?: ToneCurvesState;
  colorWheels?: ColorWheelsState;
  hslState?: HslColorState;
  opticalVfx?: OpticalVfxState;
  videoState?: Partial<VideoState>;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  author: 'Alen Pepa';
  copyright: 'PhotoPower © 2026 Alen Pepa. All rights reserved.';
  createdAt: string;
  updatedAt: string;
  canvasWidth: number;
  canvasHeight: number;
  mediaMode: 'photo' | 'video';
}

export type ExportFormat =
  | 'png'
  | 'jpeg'
  | 'webp'
  | 'avif'
  | 'svg'
  | 'gif'
  | 'bmp'
  | 'tiff'
  | 'hdr'
  | 'webm'
  | 'mp4'
  | 'json'
  | 'cube';

export type ColorSpaceProfile =
  | 'sRGB'
  | 'Display-P3'
  | 'Adobe-RGB'
  | 'ProPhoto-RGB'
  | 'DCI-P3'
  | 'Rec-2020'
  | 'Linear-RGB';


