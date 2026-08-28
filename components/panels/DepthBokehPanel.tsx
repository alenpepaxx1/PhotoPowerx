/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI DSLR F-Stop Depth of Field & Bokeh Lens Blur Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  Camera,
  Aperture,
  Sparkles,
  RefreshCw,
  Check,
  Circle,
  Eye,
  Focus,
  Sun,
  Zap,
  Sliders,
  Layers,
} from 'lucide-react';

export interface FStopPreset {
  id: string;
  name: string;
  fstop: string;
  blurRadius: number;
  label: string;
}

export const FSTOP_PRESETS: FStopPreset[] = [
  { id: 'f1.2', name: 'Ultra Bokeh', fstop: 'f/1.2', blurRadius: 35, label: 'Dreamy Portrait' },
  { id: 'f1.4', name: 'Prime Lens', fstop: 'f/1.4', blurRadius: 26, label: 'Shallow DOF' },
  { id: 'f1.8', name: 'Classic 50mm', fstop: 'f/1.8', blurRadius: 18, label: 'Standard Bokeh' },
  { id: 'f2.8', name: 'Zoom Telephoto', fstop: 'f/2.8', blurRadius: 12, label: 'Event Portrait' },
  { id: 'f5.6', name: 'Group Photo', fstop: 'f/5.6', blurRadius: 6, label: 'Medium Focus' },
  { id: 'f22', name: 'Deep Landscape', fstop: 'f/22', blurRadius: 1, label: 'Pin Sharp' },
];

export const BOKEH_SHAPES = [
  { id: 'circular', label: 'Circular' },
  { id: 'hexagon', label: '6-Blade Hex' },
  { id: 'pentagon', label: '5-Blade Pent' },
  { id: 'anamorphic', label: 'Anamorphic Oval' },
];

export const DepthBokehPanel: React.FC = () => {
  const { pushHistory } = useEditor();

  const [selectedFstopId, setSelectedFstopId] = useState<string>('f1.8');
  const [blurRadius, setBlurRadius] = useState<number>(18);
  const [focusX, setFocusX] = useState<number>(50); // 0-100%
  const [focusY, setFocusY] = useState<number>(50); // 0-100%
  const [focusDepthRange, setFocusDepthRange] = useState<number>(30); // Subject sharp radius
  const [bokehShape, setBokehShape] = useState<string>('hexagon');
  const [highlightBloom, setHighlightBloom] = useState<number>(40);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  const handleSelectFstop = (preset: FStopPreset) => {
    setSelectedFstopId(preset.id);
    setBlurRadius(preset.blurRadius);
  };

  // AI Depth Bokeh Simulation Algorithm
  const handleApplyBokeh = () => {
    setIsProcessing(true);
    setAppliedNotice(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const mainCanvas = canvasObj.canvas;
        const ctx = mainCanvas.getContext('2d');
        if (!ctx) return;

        const w = mainCanvas.width;
        const h = mainCanvas.height;

        // Create blurred copy offscreen
        const blurCanvas = document.createElement('canvas');
        blurCanvas.width = w;
        blurCanvas.height = h;
        const bCtx = blurCanvas.getContext('2d');
        if (!bCtx) return;

        bCtx.filter = `blur(${blurRadius}px)`;
        bCtx.drawImage(mainCanvas, 0, 0);
        bCtx.filter = 'none';

        const sharpData = ctx.getImageData(0, 0, w, h);
        const blurredData = bCtx.getImageData(0, 0, w, h);

        const sData = sharpData.data;
        const bData = blurredData.data;

        const focusPixelX = (focusX / 100) * w;
        const focusPixelY = (focusY / 100) * h;
        const sharpRadiusPixels = (focusDepthRange / 100) * Math.min(w, h);

        // Blend sharp center vs blurred background based on focal distance
        for (let i = 0; i < sData.length; i += 4) {
          const px = (i / 4) % w;
          const py = Math.floor(i / 4 / w);

          const dx = px - focusPixelX;
          const dy = py - focusPixelY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Alpha transition factor (0 = sharp focus, 1 = full bokeh)
          let t = (dist - sharpRadiusPixels) / (sharpRadiusPixels * 0.8);
          t = Math.max(0, Math.min(1, t));

          // Smooth step curve
          t = t * t * (3 - 2 * t);

          let finalR = sData[i] * (1 - t) + bData[i] * t;
          let finalG = sData[i + 1] * (1 - t) + bData[i + 1] * t;
          let finalB = sData[i + 2] * (1 - t) + bData[i + 2] * t;

          // Highlight Bloom Boost on blurred areas
          if (t > 0.3) {
            const lum = (finalR + finalG + finalB) / 3;
            if (lum > 200) {
              const boost = ((lum - 200) / 55) * (highlightBloom / 100) * t;
              finalR = Math.min(255, finalR * (1 + boost));
              finalG = Math.min(255, finalG * (1 + boost));
              finalB = Math.min(255, finalB * (1 + boost));
            }
          }

          sData[i] = finalR;
          sData[i + 1] = finalG;
          sData[i + 2] = finalB;
        }

        ctx.putImageData(sharpData, 0, 0);

        pushHistory(`Applied DSLR Depth Bokeh (${FSTOP_PRESETS.find(f => f.id === selectedFstopId)?.fstop})`);
        setAppliedNotice(true);
      } catch (e) {
        console.error('Bokeh application failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 250);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Aperture className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-slate-100 text-sm">AI DSLR Depth Bokeh Studio</h3>
        </div>
        <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded-full border border-pink-500/30">
          Lens DOF v2.5
        </span>
      </div>

      {/* F-Stop Aperture Preset Selector */}
      <div className="space-y-2">
        <span className="text-[11px] text-slate-400 block font-medium">Aperture F-Stop Presets:</span>
        <div className="grid grid-cols-3 gap-1.5">
          {FSTOP_PRESETS.map((preset) => {
            const isSelected = selectedFstopId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectFstop(preset)}
                className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-pink-600/25 border-pink-400 text-pink-200 font-bold shadow-md'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs">{preset.fstop}</span>
                  <Camera className="w-3 h-3 text-pink-400 opacity-70" />
                </div>
                <div className="text-[9px] text-slate-500 truncate mt-1">{preset.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Point & Depth Range Controls */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Focus className="w-4 h-4 text-pink-400" />
            <span>Subject Focus Point</span>
          </h4>
          <span className="font-mono text-pink-400">({focusX}%, {focusY}%)</span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Focus Position X:</span>
            <span className="font-mono text-pink-300">{focusX}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={focusX}
            onChange={(e) => setFocusX(Number(e.target.value))}
            className="w-full accent-pink-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Focus Position Y:</span>
            <span className="font-mono text-pink-300">{focusY}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={focusY}
            onChange={(e) => setFocusY(Number(e.target.value))}
            className="w-full accent-pink-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Sharp Focus Zone Radius:</span>
            <span className="font-mono text-pink-300">{focusDepthRange}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={focusDepthRange}
            onChange={(e) => setFocusDepthRange(Number(e.target.value))}
            className="w-full accent-pink-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Bokeh Aperture Shape & Highlight Bloom */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <span className="text-[11px] text-slate-400 block font-medium">Aperture Bokeh Blade Shape:</span>
        <div className="grid grid-cols-2 gap-1.5">
          {BOKEH_SHAPES.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setBokehShape(shape.id)}
              className={`py-1.5 px-2 rounded-xl border text-[10px] text-center font-mono transition-colors ${
                bokehShape === shape.id
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300 font-bold'
                  : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {shape.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Specular Highlight Bloom:</span>
            <span className="font-mono text-pink-400">{highlightBloom}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={highlightBloom}
            onChange={(e) => setHighlightBloom(Number(e.target.value))}
            className="w-full accent-pink-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Apply Depth Bokeh Button */}
      <button
        onClick={handleApplyBokeh}
        disabled={isProcessing}
        className="w-full py-2.5 bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all"
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
        ) : (
          <Aperture className="w-4 h-4 text-slate-950" />
        )}
        <span>Render Lens Bokeh & DOF</span>
      </button>

      {appliedNotice && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>DSLR Depth Bokeh rendered successfully!</span>
        </div>
      )}
    </div>
  );
};
