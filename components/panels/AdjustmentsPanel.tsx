/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useRef, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Adjustments } from '@/types/editor';
import {
  Sun,
  Contrast,
  Thermometer,
  Sparkles,
  Sliders,
  RotateCcw,
  Activity,
  Droplets,
  Eye,
  Camera
} from 'lucide-react';

export const AdjustmentsPanel: React.FC = () => {
  const {
    globalAdjustments,
    updateGlobalAdjustments,
    resetGlobalAdjustments,
    pushHistory,
  } = useEditor();

  const histogramCanvasRef = useRef<HTMLCanvasElement>(null);

  // Generate dynamic aesthetic RGB Histogram preview
  useEffect(() => {
    const canvas = histogramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Dark grid background
    ctx.fillStyle = '#11141b';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#1e2330';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, w, h);

    // Grid dividers
    ctx.beginPath();
    ctx.moveTo(w * 0.25, 0); ctx.lineTo(w * 0.25, h);
    ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.5, h);
    ctx.moveTo(w * 0.75, 0); ctx.lineTo(w * 0.75, h);
    ctx.stroke();

    // Generate dynamic histogram curves influenced by active adjustments
    const drawChannel = (color: string, peakPos: number, spread: number, alpha: number) => {
      ctx.beginPath();
      ctx.moveTo(0, h);

      for (let x = 0; x < w; x++) {
        const normalizedX = (x / w) * 255;
        const dist = Math.abs(normalizedX - peakPos);
        const heightVal = Math.exp(-Math.pow(dist / spread, 2)) * (h * 0.85);
        ctx.lineTo(x, h - heightVal);
      }

      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
    };

    // Calculate peaks based on current adjustments
    const exposureOffset = globalAdjustments.exposure * 0.8 + globalAdjustments.brightness * 0.5;
    const rPeak = Math.max(10, Math.min(245, 128 + exposureOffset + globalAdjustments.temperature * 0.6));
    const gPeak = Math.max(10, Math.min(245, 128 + exposureOffset - globalAdjustments.tint * 0.4));
    const bPeak = Math.max(10, Math.min(245, 128 + exposureOffset - globalAdjustments.temperature * 0.6));

    const contrastSpread = Math.max(25, 65 - globalAdjustments.contrast * 0.3);

    ctx.globalCompositeOperation = 'screen';
    drawChannel('rgba(239, 68, 68, 0.7)', rPeak, contrastSpread, 0.5);
    drawChannel('rgba(34, 197, 94, 0.7)', gPeak, contrastSpread, 0.5);
    drawChannel('rgba(59, 130, 246, 0.7)', bPeak, contrastSpread, 0.6);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }, [globalAdjustments]);

  const handleSliderChange = (key: keyof Adjustments, value: number) => {
    updateGlobalAdjustments({ [key]: value });
  };

  const handleSliderCommit = (key: keyof Adjustments) => {
    pushHistory(`Adjust ${key}`);
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-xs select-none overflow-y-auto p-3 space-y-4">
      {/* Histogram & Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>RGB Histogram & Scopes</span>
          </span>
          <button
            onClick={resetGlobalAdjustments}
            className="flex items-center gap-1 text-[11px] text-[#888] hover:text-red-400 hover:bg-[#1A1A1A] px-2 py-0.5 rounded transition-colors"
            title="Reset all adjustments to zero"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        <canvas
          ref={histogramCanvasRef}
          width={260}
          height={64}
          className="w-full h-16 rounded border border-[#222] shadow-inner block"
        />

        {/* 1-Click AI Smart Auto Enhance */}
        <button
          onClick={() => {
            updateGlobalAdjustments({
              exposure: 8,
              contrast: 15,
              highlights: -12,
              shadows: 18,
              vibrance: 20,
              saturation: 5,
              sharpness: 15,
              temperature: 4,
            });
            pushHistory('Applied 1-Click AI Smart Auto Enhance');
          }}
          className="w-full py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
          <span>1-Click AI Smart Auto Enhance</span>
        </button>
      </div>

      {/* Section 1: Lighting & Exposure */}
      <div className="space-y-3 p-2.5 bg-[#151515] rounded border border-[#222]">
        <span className="text-[11px] font-semibold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span>Light & Exposure</span>
        </span>

        {/* Exposure */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Exposure</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.exposure > 0 ? `+${globalAdjustments.exposure}` : globalAdjustments.exposure}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.exposure}
            onChange={(e) => handleSliderChange('exposure', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('exposure')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Brightness */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Brightness</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.brightness > 0 ? `+${globalAdjustments.brightness}` : globalAdjustments.brightness}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.brightness}
            onChange={(e) => handleSliderChange('brightness', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('brightness')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Contrast</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.contrast > 0 ? `+${globalAdjustments.contrast}` : globalAdjustments.contrast}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.contrast}
            onChange={(e) => handleSliderChange('contrast', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('contrast')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Highlights */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Highlights</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.highlights > 0 ? `+${globalAdjustments.highlights}` : globalAdjustments.highlights}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.highlights}
            onChange={(e) => handleSliderChange('highlights', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('highlights')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Shadows */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Shadows</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.shadows > 0 ? `+${globalAdjustments.shadows}` : globalAdjustments.shadows}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.shadows}
            onChange={(e) => handleSliderChange('shadows', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('shadows')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Section 2: Color & White Balance */}
      <div className="space-y-3 p-2.5 bg-[#151515] rounded border border-[#222]">
        <span className="text-[11px] font-semibold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
          <span>Color & White Balance</span>
        </span>

        {/* Temperature (Cool vs Warm) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Temperature (Cool / Warm)</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.temperature > 0 ? `+${globalAdjustments.temperature}` : globalAdjustments.temperature}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.temperature}
            onChange={(e) => handleSliderChange('temperature', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('temperature')}
            className="w-full accent-amber-500 h-1 bg-gradient-to-r from-blue-500 via-[#333] to-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* Tint (Green vs Magenta) */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Tint (Green / Magenta)</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.tint > 0 ? `+${globalAdjustments.tint}` : globalAdjustments.tint}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.tint}
            onChange={(e) => handleSliderChange('tint', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('tint')}
            className="w-full accent-fuchsia-500 h-1 bg-gradient-to-r from-emerald-500 via-[#333] to-fuchsia-500 rounded cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Saturation</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.saturation > 0 ? `+${globalAdjustments.saturation}` : globalAdjustments.saturation}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.saturation}
            onChange={(e) => handleSliderChange('saturation', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('saturation')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Vibrance */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Vibrance</span>
            <span className="font-mono text-[#aaa]">
              {globalAdjustments.vibrance > 0 ? `+${globalAdjustments.vibrance}` : globalAdjustments.vibrance}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={globalAdjustments.vibrance}
            onChange={(e) => handleSliderChange('vibrance', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('vibrance')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Hue Rotate */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Hue Rotate</span>
            <span className="font-mono text-[#aaa]">{globalAdjustments.hueRotate}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            value={globalAdjustments.hueRotate}
            onChange={(e) => handleSliderChange('hueRotate', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('hueRotate')}
            className="w-full h-1 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 rounded cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Section 3: Detail & Effects */}
      <div className="space-y-3 p-2.5 bg-[#151515] rounded border border-[#222]">
        <span className="text-[11px] font-semibold text-[#E0E0E0] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Detail & Effects</span>
        </span>

        {/* Sharpness */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Sharpness</span>
            <span className="font-mono text-[#aaa]">{globalAdjustments.sharpness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={globalAdjustments.sharpness}
            onChange={(e) => handleSliderChange('sharpness', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('sharpness')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Gaussian Blur */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Gaussian Blur</span>
            <span className="font-mono text-[#aaa]">{globalAdjustments.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={globalAdjustments.blur}
            onChange={(e) => handleSliderChange('blur', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('blur')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Vignette */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Vignette</span>
            <span className="font-mono text-[#aaa]">{globalAdjustments.vignette}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={globalAdjustments.vignette}
            onChange={(e) => handleSliderChange('vignette', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('vignette')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Film Grain */}
        <div className="space-y-1">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Film Grain / Noise</span>
            <span className="font-mono text-[#aaa]">{globalAdjustments.grain}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={globalAdjustments.grain}
            onChange={(e) => handleSliderChange('grain', Number(e.target.value))}
            onMouseUp={() => handleSliderCommit('grain')}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>

        {/* Sepia & Invert Toggles */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              const newVal = globalAdjustments.sepia > 0 ? 0 : 80;
              handleSliderChange('sepia', newVal);
              pushHistory('Toggle Sepia');
            }}
            className={`py-1 px-2 rounded border text-xs font-medium transition-colors ${
              globalAdjustments.sepia > 0
                ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                : 'bg-[#181818] border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A]'
            }`}
          >
            Sepia Vintage
          </button>
          <button
            onClick={() => {
              const newVal = globalAdjustments.invert > 0 ? 0 : 100;
              handleSliderChange('invert', newVal);
              pushHistory('Toggle Invert');
            }}
            className={`py-1 px-2 rounded border text-xs font-medium transition-colors ${
              globalAdjustments.invert > 0
                ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                : 'bg-[#181818] border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A]'
            }`}
          >
            Invert Colors
          </button>
        </div>
      </div>
    </div>
  );
};
