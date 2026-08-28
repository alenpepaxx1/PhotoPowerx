/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import {
  Layer,
  ToolType,
  BrushMode,
  RetouchMode,
  ShapeType,
  Adjustments,
  VideoState,
  HistoryState,
  FilterPreset,
  BlendMode,
  ToneCurvesState,
  ColorWheelsState,
  HslColorState,
  OpticalVfxState,
  SplitCompareState,
  LayerStyleEffects,
  TextProperties,
} from '@/types/editor';
import {
  DEFAULT_ADJUSTMENTS,
  DEFAULT_TONE_CURVES,
  DEFAULT_COLOR_WHEELS,
  DEFAULT_HSL_STATE,
  DEFAULT_OPTICAL_VFX,
  SAMPLE_MEDIA_LIST,
  SampleMediaItem,
} from '@/lib/sampleMedia';
import { FILTER_PRESETS } from '@/lib/filters';

export type RightPanelTab =
  | 'layers'
  | 'adjustments'
  | 'curves'
  | 'colorwheels'
  | 'vfx'
  | 'filters'
  | 'presets'
  | 'text'
  | 'shape'
  | 'retouch'
  | 'history'
  | 'watermark'
  | 'exif'
  | 'scopes'
  | 'masking'
  | 'audio'
  | 'formats'
  | 'denoise'
  | 'perspective'
  | 'colormatch'
  | 'crop'
  | 'relighting'
  | 'bokeh'
  | 'eraser'
  | 'sky';

interface EditorContextType {
  // State
  layers: Layer[];
  selectedLayerId: string | null;
  selectedLayer: Layer | null;
  activeTool: ToolType;
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  brushMode: BrushMode;
  retouchMode: RetouchMode;
  retouchRadius: number;
  activeShape: ShapeType;
  shapeFill: string;
  shapeStroke: string;
  shapeStrokeWidth: number;
  shapeCornerRadius: number;
  globalAdjustments: Adjustments;
  toneCurves: ToneCurvesState;
  colorWheels: ColorWheelsState;
  hslState: HslColorState;
  opticalVfx: OpticalVfxState;
  splitCompare: SplitCompareState;
  activeFilterId: string;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  pan: { x: number; y: number };
  history: HistoryState[];
  historyIndex: number;
  mediaMode: 'photo' | 'video';
  videoState: VideoState;
  cursorPos: { x: number; y: number };
  hoveredColor: string;
  isExportModalOpen: boolean;
  isAiModalOpen: boolean;
  isAboutModalOpen: boolean;
  isSamplePickerOpen: boolean;
  isCommandPaletteOpen: boolean;
  isPresetManagerOpen: boolean;
  isBatchModalOpen: boolean;
  isLutModalOpen: boolean;
  activeRightPanel: RightPanelTab;
  projectName: string;
  isRecordingVideo: boolean;

  // Actions
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setSelectedLayerId: (id: string | null) => void;
  setActiveTool: (tool: ToolType) => void;
  setBrushColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setBrushMode: (mode: BrushMode) => void;
  setRetouchMode: (mode: RetouchMode) => void;
  setRetouchRadius: (radius: number) => void;
  setActiveShape: (shape: ShapeType) => void;
  setShapeFill: (color: string) => void;
  setShapeStroke: (color: string) => void;
  setShapeStrokeWidth: (width: number) => void;
  setShapeCornerRadius: (radius: number) => void;
  setGlobalAdjustments: React.Dispatch<React.SetStateAction<Adjustments>>;
  updateGlobalAdjustments: (partial: Partial<Adjustments>) => void;
  resetGlobalAdjustments: () => void;
  setToneCurves: React.Dispatch<React.SetStateAction<ToneCurvesState>>;
  updateToneCurves: (partial: Partial<ToneCurvesState>) => void;
  resetToneCurves: () => void;
  setColorWheels: React.Dispatch<React.SetStateAction<ColorWheelsState>>;
  updateColorWheels: (partial: Partial<ColorWheelsState>) => void;
  resetColorWheels: () => void;
  setHslState: React.Dispatch<React.SetStateAction<HslColorState>>;
  updateHslState: (partial: Partial<HslColorState>) => void;
  resetHslState: () => void;
  setOpticalVfx: React.Dispatch<React.SetStateAction<OpticalVfxState>>;
  updateOpticalVfx: (partial: Partial<OpticalVfxState>) => void;
  resetOpticalVfx: () => void;
  setSplitCompare: React.Dispatch<React.SetStateAction<SplitCompareState>>;
  updateSplitCompare: (partial: Partial<SplitCompareState>) => void;
  applyFilterPreset: (presetId: string) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setCanvasSize: (width: number, height: number) => void;
  setMediaMode: (mode: 'photo' | 'video') => void;
  setVideoState: React.Dispatch<React.SetStateAction<VideoState>>;
  updateVideoState: (partial: Partial<VideoState>) => void;
  setCursorPos: (pos: { x: number; y: number }) => void;
  setHoveredColor: (color: string) => void;
  setIsExportModalOpen: (open: boolean) => void;
  setIsAiModalOpen: (open: boolean) => void;
  setIsAboutModalOpen: (open: boolean) => void;
  setIsSamplePickerOpen: (open: boolean) => void;
  setIsCommandPaletteOpen: (open: boolean) => void;
  setIsPresetManagerOpen: (open: boolean) => void;
  setIsBatchModalOpen: (open: boolean) => void;
  setIsLutModalOpen: (open: boolean) => void;
  setActiveRightPanel: (panel: RightPanelTab) => void;
  setProjectName: (name: string) => void;
  setIsRecordingVideo: (recording: boolean) => void;

  // Layer CRUD
  addLayer: (layer: Partial<Layer>) => string;
  updateLayer: (id: string, partial: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  setLayerBlendMode: (id: string, mode: BlendMode) => void;
  setLayerOpacity: (id: string, opacity: number) => void;
  updateLayerStyles: (id: string, styles: Partial<LayerStyleEffects>) => void;
  removeBackgroundAi: (layerId?: string) => Promise<void>;

  // Add specific layer helpers
  addImageLayer: (src: string, name?: string) => Promise<string>;
  addVideoLayer: (src: string, name?: string) => Promise<string>;
  addTextLayer: (text?: string, options?: Partial<TextProperties> & { x?: number; y?: number; opacity?: number }) => string;
  addShapeLayer: (shapeType?: ShapeType) => string;
  addDrawingLayer: () => string;

  // History Actions
  pushHistory: (actionName: string) => void;
  undo: () => void;
  redo: () => void;
  jumpToHistory: (index: number) => void;

  // Media Loading
  loadSampleMedia: (item: SampleMediaItem) => Promise<void>;
  loadUserFile: (file: File) => Promise<void>;
  resetProject: () => void;
}

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Canvas & Project
  const [projectName, setProjectName] = useState('Untitled Project - PhotoPower');
  const [canvasWidth, setCanvasWidth] = useState(1200);
  const [canvasHeight, setCanvasHeight] = useState(800);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo');

  // Layers & Selection
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Tools & Properties
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [brushColor, setBrushColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(16);
  const [brushOpacity, setBrushOpacity] = useState(1);
  const [brushMode, setBrushMode] = useState<BrushMode>('round');
  const [retouchMode, setRetouchMode] = useState<RetouchMode>('heal');
  const [retouchRadius, setRetouchRadius] = useState(25);

  // Shape properties
  const [activeShape, setActiveShape] = useState<ShapeType>('rectangle');
  const [shapeFill, setShapeFill] = useState('#3b82f6');
  const [shapeStroke, setShapeStroke] = useState('#ffffff');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);
  const [shapeCornerRadius, setShapeCornerRadius] = useState(16);

  // Adjustments & Filters
  const [globalAdjustments, setGlobalAdjustments] = useState<Adjustments>(DEFAULT_ADJUSTMENTS);
  const [toneCurves, setToneCurves] = useState<ToneCurvesState>(DEFAULT_TONE_CURVES);
  const [colorWheels, setColorWheels] = useState<ColorWheelsState>(DEFAULT_COLOR_WHEELS);
  const [hslState, setHslState] = useState<HslColorState>(DEFAULT_HSL_STATE);
  const [opticalVfx, setOpticalVfx] = useState<OpticalVfxState>(DEFAULT_OPTICAL_VFX);
  const [splitCompare, setSplitCompare] = useState<SplitCompareState>({ active: false, position: 0.5 });
  const [activeFilterId, setActiveFilterId] = useState<string>('original');

  // Video state
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 10,
    playbackRate: 1,
    loop: true,
    volume: 1,
    muted: false,
    trimStart: 0,
    trimEnd: 10,
    fps: 30,
  });

  // UI state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredColor, setHoveredColor] = useState('#14171d');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSamplePickerOpen, setIsSamplePickerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isPresetManagerOpen, setIsPresetManagerOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isLutModalOpen, setIsLutModalOpen] = useState(false);
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelTab>('layers');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);

  // History stack
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  // Push history snapshot
  const pushHistory = useCallback((actionName: string) => {
    setLayers((currLayers) => {
      setGlobalAdjustments((currAdj) => {
        setToneCurves((currCurves) => {
          setColorWheels((currWheels) => {
            setHslState((currHsl) => {
              setOpticalVfx((currVfx) => {
                const snapshot: HistoryState = {
                  id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  actionName,
                  timestamp: Date.now(),
                  layers: JSON.parse(JSON.stringify(currLayers)),
                  selectedLayerId,
                  canvasWidth,
                  canvasHeight,
                  globalAdjustments: { ...currAdj },
                  toneCurves: JSON.parse(JSON.stringify(currCurves)),
                  colorWheels: JSON.parse(JSON.stringify(currWheels)),
                  hslState: JSON.parse(JSON.stringify(currHsl)),
                  opticalVfx: JSON.parse(JSON.stringify(currVfx)),
                };

                setHistory((prev) => {
                  const truncated = prev.slice(0, historyIndex + 1);
                  const next = [...truncated, snapshot].slice(-40);
                  setHistoryIndex(next.length - 1);
                  return next;
                });

                return currVfx;
              });
              return currHsl;
            });
            return currWheels;
          });
          return currCurves;
        });
        return currAdj;
      });
      return currLayers;
    });
  }, [canvasHeight, canvasWidth, historyIndex, selectedLayerId]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      if (targetState) {
        setLayers(JSON.parse(JSON.stringify(targetState.layers)));
        setGlobalAdjustments({ ...targetState.globalAdjustments });
        if (targetState.toneCurves) setToneCurves(JSON.parse(JSON.stringify(targetState.toneCurves)));
        if (targetState.colorWheels) setColorWheels(JSON.parse(JSON.stringify(targetState.colorWheels)));
        if (targetState.hslState) setHslState(JSON.parse(JSON.stringify(targetState.hslState)));
        if (targetState.opticalVfx) setOpticalVfx(JSON.parse(JSON.stringify(targetState.opticalVfx)));
        setSelectedLayerId(targetState.selectedLayerId);
        setHistoryIndex(historyIndex - 1);
      }
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      if (targetState) {
        setLayers(JSON.parse(JSON.stringify(targetState.layers)));
        setGlobalAdjustments({ ...targetState.globalAdjustments });
        if (targetState.toneCurves) setToneCurves(JSON.parse(JSON.stringify(targetState.toneCurves)));
        if (targetState.colorWheels) setColorWheels(JSON.parse(JSON.stringify(targetState.colorWheels)));
        if (targetState.hslState) setHslState(JSON.parse(JSON.stringify(targetState.hslState)));
        if (targetState.opticalVfx) setOpticalVfx(JSON.parse(JSON.stringify(targetState.opticalVfx)));
        setSelectedLayerId(targetState.selectedLayerId);
        setHistoryIndex(historyIndex + 1);
      }
    }
  }, [history, historyIndex]);

  // Jump to specific history state
  const jumpToHistory = useCallback((index: number) => {
    if (index >= 0 && index < history.length) {
      const targetState = history[index];
      if (targetState) {
        setLayers(JSON.parse(JSON.stringify(targetState.layers)));
        setGlobalAdjustments({ ...targetState.globalAdjustments });
        if (targetState.toneCurves) setToneCurves(JSON.parse(JSON.stringify(targetState.toneCurves)));
        if (targetState.colorWheels) setColorWheels(JSON.parse(JSON.stringify(targetState.colorWheels)));
        if (targetState.hslState) setHslState(JSON.parse(JSON.stringify(targetState.hslState)));
        if (targetState.opticalVfx) setOpticalVfx(JSON.parse(JSON.stringify(targetState.opticalVfx)));
        setSelectedLayerId(targetState.selectedLayerId);
        setHistoryIndex(index);
      }
    }
  }, [history]);

  // Color State Updaters
  const updateGlobalAdjustments = useCallback((partial: Partial<Adjustments>) => {
    setGlobalAdjustments((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetGlobalAdjustments = useCallback(() => {
    setGlobalAdjustments(DEFAULT_ADJUSTMENTS);
    setActiveFilterId('original');
    pushHistory('Reset Adjustments');
  }, [pushHistory]);

  const updateToneCurves = useCallback((partial: Partial<ToneCurvesState>) => {
    setToneCurves((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetToneCurves = useCallback(() => {
    setToneCurves(DEFAULT_TONE_CURVES);
    pushHistory('Reset Tone Curves');
  }, [pushHistory]);

  const updateColorWheels = useCallback((partial: Partial<ColorWheelsState>) => {
    setColorWheels((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetColorWheels = useCallback(() => {
    setColorWheels(DEFAULT_COLOR_WHEELS);
    pushHistory('Reset Color Wheels');
  }, [pushHistory]);

  const updateHslState = useCallback((partial: Partial<HslColorState>) => {
    setHslState((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetHslState = useCallback(() => {
    setHslState(DEFAULT_HSL_STATE);
    pushHistory('Reset Selective HSL');
  }, [pushHistory]);

  const updateOpticalVfx = useCallback((partial: Partial<OpticalVfxState>) => {
    setOpticalVfx((prev) => ({ ...prev, ...partial }));
  }, []);

  const resetOpticalVfx = useCallback(() => {
    setOpticalVfx(DEFAULT_OPTICAL_VFX);
    pushHistory('Reset Optical VFX');
  }, [pushHistory]);

  const updateSplitCompare = useCallback((partial: Partial<SplitCompareState>) => {
    setSplitCompare((prev) => ({ ...prev, ...partial }));
  }, []);

  const applyFilterPreset = useCallback((presetId: string) => {
    const preset = FILTER_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    setActiveFilterId(presetId);
    setGlobalAdjustments((prev) => ({
      ...DEFAULT_ADJUSTMENTS,
      ...preset.adjustments,
    }));
    pushHistory(`Apply Filter: ${preset.name}`);
  }, [pushHistory]);

  const setCanvasSize = useCallback((w: number, h: number) => {
    setCanvasWidth(w);
    setCanvasHeight(h);
    pushHistory(`Resize Canvas to ${w}x${h}`);
  }, [pushHistory]);

  const updateVideoState = useCallback((partial: Partial<VideoState>) => {
    setVideoState((prev) => ({ ...prev, ...partial }));
  }, []);

  // Layer Operations
  const addLayer = useCallback((layerData: Partial<Layer>): string => {
    const id = `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLayer: Layer = {
      id,
      name: layerData.name || `Layer ${layers.length + 1}`,
      type: layerData.type || 'image',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: layerData.x ?? 0,
      y: layerData.y ?? 0,
      width: layerData.width || canvasWidth,
      height: layerData.height || canvasHeight,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      ...layerData,
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
    pushHistory(`Add ${newLayer.name}`);
    return id;
  }, [canvasHeight, canvasWidth, layers.length, pushHistory]);

  const updateLayer = useCallback((id: string, partial: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...partial } : layer))
    );
  }, []);

  const deleteLayer = useCallback((id: string) => {
    setLayers((prev) => {
      const next = prev.filter((l) => l.id !== id);
      if (selectedLayerId === id) {
        setSelectedLayerId(next.length > 0 ? next[next.length - 1].id : null);
      }
      return next;
    });
    pushHistory('Delete Layer');
  }, [pushHistory, selectedLayerId]);

  const duplicateLayer = useCallback((id: string) => {
    const target = layers.find((l) => l.id === id);
    if (!target) return;

    const dupId = `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLayer: Layer = {
      ...JSON.parse(JSON.stringify(target)),
      id: dupId,
      name: `${target.name} Copy`,
      x: target.x + 20,
      y: target.y + 20,
      imageElement: target.imageElement,
      videoElement: target.videoElement,
    };

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(dupId);
    pushHistory(`Duplicate ${target.name}`);
  }, [layers, pushHistory]);

  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
    pushHistory('Reorder Layers');
  }, [pushHistory]);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  }, []);

  const toggleLayerLock = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l))
    );
  }, []);

  const setLayerBlendMode = useCallback((id: string, mode: BlendMode) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, blendMode: mode } : l))
    );
    pushHistory(`Change Blend Mode: ${mode}`);
  }, [pushHistory]);

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, opacity } : l))
    );
  }, []);

  // Add Image Layer
  const addImageLayer = useCallback((src: string, name?: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const id = addLayer({
          name: name || `Image ${layers.length + 1}`,
          type: 'image',
          imageUrl: src,
          imageElement: img,
          width: img.width || canvasWidth,
          height: img.height || canvasHeight,
          x: 0,
          y: 0,
        });
        resolve(id);
      };
      img.onerror = () => {
        const id = addLayer({
          name: name || `Image ${layers.length + 1}`,
          type: 'image',
          imageUrl: src,
          width: canvasWidth,
          height: canvasHeight,
        });
        resolve(id);
      };
      img.src = src;
    });
  }, [addLayer, canvasHeight, canvasWidth, layers.length]);

  // Add Video Layer
  const addVideoLayer = useCallback((src: string, name?: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = src;
      video.muted = true;
      video.playsInline = true;
      video.loop = true;

      video.onloadedmetadata = () => {
        const dur = video.duration || 10;
        setVideoState((prev) => ({
          ...prev,
          duration: dur,
          trimEnd: dur,
          isPlaying: false,
        }));
        setMediaMode('video');

        const id = addLayer({
          name: name || `Video ${layers.length + 1}`,
          type: 'video',
          videoUrl: src,
          videoElement: video,
          width: video.videoWidth || canvasWidth,
          height: video.videoHeight || canvasHeight,
          x: 0,
          y: 0,
        });
        resolve(id);
      };

      video.onerror = () => {
        setMediaMode('video');
        const id = addLayer({
          name: name || `Video ${layers.length + 1}`,
          type: 'video',
          videoUrl: src,
          width: canvasWidth,
          height: canvasHeight,
        });
        resolve(id);
      };
    });
  }, [addLayer, canvasHeight, canvasWidth, layers.length]);

  // Add Text Layer
  const addTextLayer = useCallback((text: string = 'PhotoPower', options?: Partial<TextProperties> & { x?: number; y?: number; opacity?: number }): string => {
    const fontSize = options?.fontSize ?? 56;
    const layerW = 480;
    const layerH = 140;
    const x = options?.x ?? Math.max(0, (canvasWidth - layerW) / 2);
    const y = options?.y ?? Math.max(0, (canvasHeight - layerH) / 2);

    const id = addLayer({
      name: `Text ${layers.length + 1}`,
      type: 'text',
      x,
      y,
      opacity: options?.opacity ?? 1,
      width: layerW,
      height: layerH,
      textProps: {
        text,
        fontFamily: options?.fontFamily ?? 'Inter, sans-serif',
        fontSize,
        fontWeight: options?.fontWeight ?? '800',
        fontStyle: 'normal',
        textAlign: options?.textAlign ?? 'center',
        fillColor: options?.fillColor ?? '#ffffff',
        strokeColor: options?.strokeColor ?? '#000000',
        strokeWidth: options?.strokeWidth ?? 0,
        shadowColor: options?.shadowColor ?? 'rgba(0,0,0,0.7)',
        shadowBlur: options?.shadowBlur ?? 10,
        shadowOffsetX: 2,
        shadowOffsetY: 4,
        letterSpacing: 1,
        lineHeight: 1.2,
        arcAngle: 0,
        backgroundPill: false,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backgroundPadding: 24,
        textTransform: 'none',
        animation: 'fade',
        startTime: 0,
        endTime: videoState.duration,
        ...options,
      },
    });

    setActiveRightPanel('text');
    setActiveTool('select');
    return id;
  }, [addLayer, canvasHeight, canvasWidth, layers.length, videoState.duration]);

  // Add Shape Layer
  const addShapeLayer = useCallback((shapeType: ShapeType = activeShape): string => {
    const shapeW = 280;
    const shapeH = 200;
    const x = Math.max(0, (canvasWidth - shapeW) / 2);
    const y = Math.max(0, (canvasHeight - shapeH) / 2);

    const id = addLayer({
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} ${layers.length + 1}`,
      type: 'shape',
      x,
      y,
      width: shapeW,
      height: shapeH,
      shapeProps: {
        shapeType,
        fillColor: shapeFill,
        strokeColor: shapeStroke,
        strokeWidth: shapeStrokeWidth,
        cornerRadius: shapeCornerRadius,
        points: 5,
        opacity: 1,
        shadowColor: 'rgba(0,0,0,0.4)',
        shadowBlur: 8,
      },
    });

    setActiveRightPanel('shape');
    setActiveTool('select');
    return id;
  }, [activeShape, addLayer, canvasHeight, canvasWidth, layers.length, shapeCornerRadius, shapeFill, shapeStroke, shapeStrokeWidth]);

  // Add Drawing Layer
  const addDrawingLayer = useCallback((): string => {
    const id = addLayer({
      name: `Paint Layer ${layers.length + 1}`,
      type: 'drawing',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      drawingStrokes: [],
    });
    return id;
  }, [addLayer, canvasHeight, canvasWidth, layers.length]);

  // Update Layer Styles (Drop Shadow, Outer Glow, Stroke)
  const updateLayerStyles = useCallback((id: string, styles: Partial<LayerStyleEffects>) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        return {
          ...l,
          styles: {
            ...l.styles,
            ...styles,
          },
        };
      })
    );
    pushHistory('Update Layer Styles');
  }, [pushHistory]);

  // Remove Background AI (Intelligent Cutout Algorithm)
  const removeBackgroundAi = useCallback(async (layerId?: string) => {
    const targetId = layerId || selectedLayerId;
    const target = layers.find((l) => l.id === targetId);
    if (!target || !target.imageElement) return;

    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = target.width;
      offscreen.height = target.height;
      const oCtx = offscreen.getContext('2d');
      if (!oCtx) return;

      oCtx.drawImage(target.imageElement, 0, 0, target.width, target.height);
      const imgData = oCtx.getImageData(0, 0, target.width, target.height);
      const data = imgData.data;

      // Sample 4 corner backgrounds
      const corners = [
        [0, 0],
        [target.width - 1, 0],
        [0, target.height - 1],
        [target.width - 1, target.height - 1]
      ];
      let bgR = 0, bgG = 0, bgB = 0;
      for (const [cx, cy] of corners) {
        const idx = (cy * target.width + cx) * 4;
        bgR += data[idx];
        bgG += data[idx + 1];
        bgB += data[idx + 2];
      }
      bgR /= 4;
      bgG /= 4;
      bgB /= 4;

      const tolerance = 48;
      const feather = 24;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt(
          (r - bgR) ** 2 +
          (g - bgG) ** 2 +
          (b - bgB) ** 2
        );

        if (dist < tolerance) {
          data[i + 3] = 0;
        } else if (dist < tolerance + feather) {
          const factor = (dist - tolerance) / feather;
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }

      oCtx.putImageData(imgData, 0, 0);
      const cutoutUrl = offscreen.toDataURL('image/png');

      const cutoutImg = new Image();
      cutoutImg.crossOrigin = 'anonymous';
      cutoutImg.src = cutoutUrl;
      await new Promise<void>((resolve) => {
        cutoutImg.onload = () => resolve();
        cutoutImg.onerror = () => resolve();
      });

      setLayers((prev) =>
        prev.map((l) => {
          if (l.id !== targetId) return l;
          return {
            ...l,
            imageUrl: cutoutUrl,
            imageElement: cutoutImg,
            name: `${l.name} (Cutout AI)`,
          };
        })
      );
      pushHistory('AI Background Cutout');
    } catch (e) {
      console.warn('AI Cutout error:', e);
    }
  }, [layers, pushHistory, selectedLayerId]);

  // Load sample media
  const loadSampleMedia = useCallback(async (item: SampleMediaItem) => {
    setLayers([]);
    setGlobalAdjustments(DEFAULT_ADJUSTMENTS);
    setToneCurves(DEFAULT_TONE_CURVES);
    setColorWheels(DEFAULT_COLOR_WHEELS);
    setHslState(DEFAULT_HSL_STATE);
    setOpticalVfx(DEFAULT_OPTICAL_VFX);
    setActiveFilterId('original');
    setCanvasWidth(item.width);
    setCanvasHeight(item.height);
    setProjectName(`${item.title} — PhotoPower by Alen Pepa`);

    if (item.type === 'video') {
      await addVideoLayer(item.mediaUrl, item.title);
      setMediaMode('video');
    } else {
      await addImageLayer(item.mediaUrl, item.title);
      setMediaMode('photo');
    }
  }, [addImageLayer, addVideoLayer]);

  // Load user uploaded file (image or video)
  const loadUserFile = useCallback(async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);

    setLayers([]);
    setGlobalAdjustments(DEFAULT_ADJUSTMENTS);
    setToneCurves(DEFAULT_TONE_CURVES);
    setColorWheels(DEFAULT_COLOR_WHEELS);
    setHslState(DEFAULT_HSL_STATE);
    setOpticalVfx(DEFAULT_OPTICAL_VFX);
    setActiveFilterId('original');
    setProjectName(`${file.name.replace(/\.[^/.]+$/, '')} — PhotoPower by Alen Pepa`);

    if (isVideo) {
      setMediaMode('video');
      await addVideoLayer(url, file.name);
    } else {
      setMediaMode('photo');
      await addImageLayer(url, file.name);
    }
  }, [addImageLayer, addVideoLayer]);

  // Reset project
  const resetProject = useCallback(() => {
    setLayers([]);
    setGlobalAdjustments(DEFAULT_ADJUSTMENTS);
    setToneCurves(DEFAULT_TONE_CURVES);
    setColorWheels(DEFAULT_COLOR_WHEELS);
    setHslState(DEFAULT_HSL_STATE);
    setOpticalVfx(DEFAULT_OPTICAL_VFX);
    setActiveFilterId('original');
    setCanvasWidth(1200);
    setCanvasHeight(800);
    setProjectName('Untitled Project — PhotoPower by Alen Pepa');
    setMediaMode('photo');
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  // Load initial sample media on mount
  const initialLoadedRef = useRef(false);
  useEffect(() => {
    if (!initialLoadedRef.current) {
      initialLoadedRef.current = true;
      const timer = setTimeout(() => {
        loadSampleMedia(SAMPLE_MEDIA_LIST[0]);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [loadSampleMedia]);

  return (
    <EditorContext.Provider
      value={{
        layers,
        selectedLayerId,
        selectedLayer,
        activeTool,
        brushColor,
        brushSize,
        brushOpacity,
        brushMode,
        retouchMode,
        retouchRadius,
        activeShape,
        shapeFill,
        shapeStroke,
        shapeStrokeWidth,
        shapeCornerRadius,
        globalAdjustments,
        toneCurves,
        colorWheels,
        hslState,
        opticalVfx,
        splitCompare,
        activeFilterId,
        canvasWidth,
        canvasHeight,
        zoom,
        pan,
        history,
        historyIndex,
        mediaMode,
        videoState,
        cursorPos,
        hoveredColor,
        isExportModalOpen,
        isAiModalOpen,
        isAboutModalOpen,
        isSamplePickerOpen,
        isCommandPaletteOpen,
        isPresetManagerOpen,
        activeRightPanel,
        projectName,
        isRecordingVideo,

        setLayers,
        setSelectedLayerId,
        setActiveTool,
        setBrushColor,
        setBrushSize,
        setBrushOpacity,
        setBrushMode,
        setRetouchMode,
        setRetouchRadius,
        setActiveShape,
        setShapeFill,
        setShapeStroke,
        setShapeStrokeWidth,
        setShapeCornerRadius,
        setGlobalAdjustments,
        updateGlobalAdjustments,
        resetGlobalAdjustments,
        setToneCurves,
        updateToneCurves,
        resetToneCurves,
        setColorWheels,
        updateColorWheels,
        resetColorWheels,
        setHslState,
        updateHslState,
        resetHslState,
        setOpticalVfx,
        updateOpticalVfx,
        resetOpticalVfx,
        setSplitCompare,
        updateSplitCompare,
        applyFilterPreset,
        setZoom,
        setPan,
        setCanvasSize,
        setMediaMode,
        setVideoState,
        updateVideoState,
        setCursorPos,
        setHoveredColor,
        setIsExportModalOpen,
        setIsAiModalOpen,
        setIsAboutModalOpen,
        setIsSamplePickerOpen,
        setIsCommandPaletteOpen,
        setIsPresetManagerOpen,
        isBatchModalOpen,
        setIsBatchModalOpen,
        isLutModalOpen,
        setIsLutModalOpen,
        setActiveRightPanel,
        setProjectName,
        setIsRecordingVideo,

        addLayer,
        updateLayer,
        deleteLayer,
        duplicateLayer,
        reorderLayers,
        toggleLayerVisibility,
        toggleLayerLock,
        setLayerBlendMode,
        setLayerOpacity,
        updateLayerStyles,
        removeBackgroundAi,

        addImageLayer,
        addVideoLayer,
        addTextLayer,
        addShapeLayer,
        addDrawingLayer,

        pushHistory,
        undo,
        redo,
        jumpToHistory,

        loadSampleMedia,
        loadUserFile,
        resetProject,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
