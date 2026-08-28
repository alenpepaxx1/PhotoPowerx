/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI Denoise, Dehaze & Texture Clarity Panel
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { applyDenoise, applyDehaze } from '@/lib/denoiseEngine';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  Sparkles,
  CloudOff,
  Sun,
  ShieldAlert,
  Zap,
  RefreshCw,
  Check,
  Eye,
  Layers,
  Activity,
  Sliders,
} from 'lucide-react';

export const DenoisePanel: React.FC = () => {
  const { pushHistory } = useEditor();

  const [lumDenoise, setLumDenoise] = useState<number>(30);
  const [colorDenoise, setColorDenoise] = useState<number>(45);
  const [dehazeAmount, setDehazeAmount] = useState<number>(25);
  const [sharpenAmount, setSharpenAmount] = useState<number>(20);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  // Apply Denoise & Dehaze to Canvas
  const handleApplyDenoiseDehaze = () => {
    setIsProcessing(true);
    setAppliedNotice(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const canvas = canvasObj.canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // 1. Denoise
        imgData = applyDenoise(imgData, lumDenoise, colorDenoise);

        // 2. Dehaze
        imgData = applyDehaze(imgData, dehazeAmount);

        ctx.putImageData(imgData, 0, 0);

        pushHistory(`Applied Denoise (${lumDenoise}/${colorDenoise}) & Dehaze (${dehazeAmount})`);
        setAppliedNotice(true);
      } catch (e) {
        console.error('Denoise process failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 300);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">AI Denoise & Dehaze Studio</h3>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
          Wavelet v2.4
        </span>
      </div>

      {/* 1. Luminance & Color Noise Reduction */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Spatial Noise Reduction</span>
        </h4>

        {/* Luminance Noise Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Luminance Grain Smooth:</span>
            <span className="font-mono text-amber-400">{lumDenoise}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={lumDenoise}
            onChange={(e) => setLumDenoise(Number(e.target.value))}
            className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>

        {/* Color Chrominance Noise Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Chrominance Color Noise:</span>
            <span className="font-mono text-amber-400">{colorDenoise}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={colorDenoise}
            onChange={(e) => setColorDenoise(Number(e.target.value))}
            className="w-full accent-amber-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 2. Atmospheric Dehaze & Fog Removal */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <CloudOff className="w-4 h-4 text-sky-400" />
          <span>Atmospheric Dehaze & Clarity</span>
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Recovers contrast and micro-details obscured by fog, smoke, or atmospheric haze.
        </p>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Dehaze Intensity:</span>
            <span className="font-mono text-sky-400">+{dehazeAmount}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={dehazeAmount}
            onChange={(e) => setDehazeAmount(Number(e.target.value))}
            className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApplyDenoiseDehaze}
        disabled={isProcessing}
        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
        ) : (
          <Zap className="w-4 h-4 text-slate-950 fill-current" />
        )}
        <span>Run AI Denoise & Dehaze Pass</span>
      </button>

      {appliedNotice && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Noise reduction & dehaze successfully applied!</span>
        </div>
      )}
    </div>
  );
};
