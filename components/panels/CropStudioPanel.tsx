/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI Precision Crop, Aspect Ratio & Straighten Studio Panel
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Check,
  Grid,
  Zap,
  RefreshCw,
  Lock,
  Unlock,
  Sliders,
  Maximize2,
  Instagram,
  Youtube,
  Tv,
  Smartphone,
  Sparkles,
  Compass,
} from 'lucide-react';

export interface AspectRatioPreset {
  id: string;
  name: string;
  ratio: number | null; // null for freeform
  label: string;
  category: 'Social' | 'Standard' | 'Print' | 'Pro';
  icon?: React.ElementType;
}

export const ASPECT_PRESETS: AspectRatioPreset[] = [
  { id: 'free', name: 'Freeform', ratio: null, label: 'Custom', category: 'Standard' },
  { id: '1:1', name: 'Square 1:1', ratio: 1, label: 'Instagram / Avatar', category: 'Social', icon: Instagram },
  { id: '4:5', name: 'Portrait 4:5', ratio: 0.8, label: 'Instagram Feed', category: 'Social', icon: Instagram },
  { id: '9:16', name: 'Story 9:16', ratio: 0.5625, label: 'TikTok / IG Reels', category: 'Social', icon: Smartphone },
  { id: '16:9', name: 'Landscape 16:9', ratio: 1.7777, label: 'YouTube / HD TV', category: 'Social', icon: Youtube },
  { id: '4:3', name: 'Standard 4:3', ratio: 1.3333, label: 'Digital Camera', category: 'Standard' },
  { id: '3:2', name: 'Classic 3:2', ratio: 1.5, label: 'DSLR 35mm', category: 'Standard' },
  { id: '2:3', name: 'Portrait 2:3', ratio: 0.6666, label: 'Poster Print', category: 'Print' },
  { id: '1.91:1', name: 'Header 1.91:1', ratio: 1.91, label: 'Twitter / X Banner', category: 'Social' },
  { id: '1.618:1', name: 'Golden 1.618:1', ratio: 1.618, label: 'Phi Ratio', category: 'Pro', icon: Sparkles },
];

export const CropStudioPanel: React.FC = () => {
  const { canvasWidth, canvasHeight, setCanvasSize, layers, setLayers, pushHistory } = useEditor();

  const [selectedPresetId, setSelectedPresetId] = useState<string>('free');
  const [cropWidth, setCropWidth] = useState<number>(canvasWidth);
  const [cropHeight, setCropHeight] = useState<number>(canvasHeight);
  const [straightenAngle, setStraightenAngle] = useState<number>(0);
  const [gridOverlay, setGridOverlay] = useState<'thirds' | 'phi' | 'diagonal' | 'none'>('thirds');
  const [lockRatio, setLockRatio] = useState<boolean>(false);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Select Preset and calculate crop dimensions
  const handleSelectPreset = (preset: AspectRatioPreset) => {
    setSelectedPresetId(preset.id);

    if (preset.ratio === null) {
      setCropWidth(canvasWidth);
      setCropHeight(canvasHeight);
      setLockRatio(false);
    } else {
      setLockRatio(true);
      const ratio = preset.ratio;
      let newW = canvasWidth;
      let newH = Math.round(newW / ratio);

      if (newH > canvasHeight) {
        newH = canvasHeight;
        newW = Math.round(newH * ratio);
      }

      setCropWidth(newW);
      setCropHeight(newH);
    }
  };

  // Flip Horizontal
  const handleFlipHorizontal = () => {
    const canvasObj = getCanvasContextData();
    if (!canvasObj?.canvas) return;
    const canvas = canvasObj.canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const temp = document.createElement('canvas');
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tCtx = temp.getContext('2d');
    if (!tCtx) return;

    tCtx.translate(canvas.width, 0);
    tCtx.scale(-1, 1);
    tCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(temp, 0, 0);

    pushHistory('Flip Canvas Horizontally');
  };

  // Flip Vertical
  const handleFlipVertical = () => {
    const canvasObj = getCanvasContextData();
    if (!canvasObj?.canvas) return;
    const canvas = canvasObj.canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const temp = document.createElement('canvas');
    temp.width = canvas.width;
    temp.height = canvas.height;
    const tCtx = temp.getContext('2d');
    if (!tCtx) return;

    tCtx.translate(0, canvas.height);
    tCtx.scale(1, -1);
    tCtx.drawImage(canvas, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(temp, 0, 0);

    pushHistory('Flip Canvas Vertically');
  };

  // Apply Crop to Canvas & Layers
  const handleApplyCrop = () => {
    setIsProcessing(true);
    setAppliedNotice(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const mainCanvas = canvasObj.canvas;
        const ctx = mainCanvas.getContext('2d');
        if (!ctx) return;

        // Calculate Crop Offset Box Centered
        const cropX = Math.round((canvasWidth - cropWidth) / 2);
        const cropY = Math.round((canvasHeight - cropHeight) / 2);

        // Crop pixel data from current canvas
        const croppedData = ctx.getImageData(cropX, cropY, cropWidth, cropHeight);

        // Resize Canvas Bounds
        setCanvasSize(cropWidth, cropHeight);

        // Re-center all active layers
        setLayers((prev) =>
          prev.map((l) => ({
            ...l,
            x: l.x - cropX,
            y: l.y - cropY,
          }))
        );

        // Draw cropped pixel data back onto resized canvas
        setTimeout(() => {
          if (mainCanvas) {
            mainCanvas.width = cropWidth;
            mainCanvas.height = cropHeight;
            const newCtx = mainCanvas.getContext('2d');
            if (newCtx) {
              newCtx.putImageData(croppedData, 0, 0);
            }
          }
        }, 50);

        pushHistory(`Cropped Canvas to ${cropWidth} × ${cropHeight} px (${selectedPresetId})`);
        setAppliedNotice(true);
      } catch (e) {
        console.error('Crop failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 200);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Crop className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">Crop & Aspect Ratio Studio</h3>
        </div>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
          Pro Crop v2.0
        </span>
      </div>

      {/* Aspect Ratio Preset Grid */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span>Social & Aspect Presets:</span>
          <span className="font-mono text-cyan-400 font-bold">{selectedPresetId}</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {ASPECT_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const IconComp = preset.icon || Crop;

            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-cyan-600/25 border-cyan-400 text-cyan-200 font-bold shadow-md'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{preset.name}</span>
                  <IconComp className="w-3 h-3 text-cyan-400 opacity-70" />
                </div>
                <div className="text-[9px] text-slate-500 truncate mt-1">{preset.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Pixel Size Readout & Custom Input */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4 text-cyan-400" />
            <span>Target Frame Dimensions</span>
          </h4>
          <button
            onClick={() => setLockRatio(!lockRatio)}
            className={`p-1 rounded-md transition-colors ${
              lockRatio ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-950 text-slate-500'
            }`}
            title="Lock Aspect Ratio"
          >
            {lockRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Width (px):</span>
            <input
              type="number"
              value={cropWidth}
              onChange={(e) => {
                const w = Math.max(10, Number(e.target.value));
                setCropWidth(w);
                if (lockRatio && cropWidth > 0) {
                  const ratio = cropHeight / cropWidth;
                  setCropHeight(Math.round(w * ratio));
                }
              }}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400">Height (px):</span>
            <input
              type="number"
              value={cropHeight}
              onChange={(e) => {
                const h = Math.max(10, Number(e.target.value));
                setCropHeight(h);
                if (lockRatio && cropHeight > 0) {
                  const ratio = cropWidth / cropHeight;
                  setCropWidth(Math.round(h * ratio));
                }
              }}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Horizon Angle Straighten */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Straighten Angle</span>
          </h4>
          <span className="font-mono text-purple-400">{straightenAngle}°</span>
        </div>

        <input
          type="range"
          min="-45"
          max="45"
          step="0.5"
          value={straightenAngle}
          onChange={(e) => setStraightenAngle(Number(e.target.value))}
          className="w-full accent-purple-400 h-1 bg-slate-950 rounded cursor-pointer"
        />
      </div>

      {/* Grid Overlay Mode Selector */}
      <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl space-y-2">
        <span className="text-[11px] text-slate-400 block font-medium">Composition Grid Overlay:</span>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'thirds', label: '3×3 Thirds' },
            { id: 'phi', label: 'Phi Golden' },
            { id: 'diagonal', label: 'Diagonal' },
            { id: 'none', label: 'Off' },
          ].map((g) => (
            <button
              key={g.id}
              onClick={() => setGridOverlay(g.id as any)}
              className={`py-1 rounded-lg text-[10px] font-mono transition-colors ${
                gridOverlay === g.id
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Flip Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleFlipHorizontal}
          className="py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <FlipHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flip Horizontal</span>
        </button>

        <button
          onClick={handleFlipVertical}
          className="py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <FlipVertical className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flip Vertical</span>
        </button>
      </div>

      {/* Apply Crop Button */}
      <button
        onClick={handleApplyCrop}
        disabled={isProcessing}
        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
        ) : (
          <Crop className="w-4 h-4 text-slate-950 stroke-[2.5]" />
        )}
        <span>Apply Crop & Resize Canvas</span>
      </button>

      {appliedNotice && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Canvas cropped to {cropWidth}×{cropHeight} px!</span>
        </div>
      )}
    </div>
  );
};
