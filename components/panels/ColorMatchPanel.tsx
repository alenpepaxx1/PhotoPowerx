/* eslint-disable @next/next/no-img-element */
/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI Reference Color Match & Palette Transfer Panel
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { ColorMoments, extractColorMoments, applyColorMatch } from '@/lib/colorMatchEngine';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  Palette,
  Upload,
  Sparkles,
  Check,
  Zap,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Layers,
} from 'lucide-react';

export const ColorMatchPanel: React.FC = () => {
  const { pushHistory } = useEditor();

  const [refMoments, setRefMoments] = useState<ColorMoments | null>(null);
  const [refPreviewUrl, setRefPreviewUrl] = useState<string | null>(null);
  const [matchStrength, setMatchStrength] = useState<number>(0.85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Handle uploading reference photo
  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setRefPreviewUrl(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      const moments = extractColorMoments(img);
      setRefMoments(moments);
    };
  };

  // Run AI Color Match Transfer
  const handleRunColorMatch = () => {
    if (!refMoments) return;

    setIsProcessing(true);
    setSuccess(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const canvas = canvasObj.canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        imgData = applyColorMatch(imgData, refMoments, matchStrength);
        ctx.putImageData(imgData, 0, 0);

        pushHistory(`AI Reference Color Match Applied (${Math.round(matchStrength * 100)}% strength)`);
        setSuccess(true);
      } catch (e) {
        console.error('Color match failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 250);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-pink-400" />
          <h3 className="font-bold text-slate-100 text-sm">AI Color Match Studio</h3>
        </div>
        <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded-full border border-pink-500/30">
          Palette Match v1.2
        </span>
      </div>

      {/* Reference Image Upload Box */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-pink-400" />
          <span>Select Reference Style Image</span>
        </h4>

        {refPreviewUrl ? (
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-white/10 h-32 bg-black flex items-center justify-center">
              <img src={refPreviewUrl} alt="Reference Style" className="h-full w-full object-cover" />
            </div>

            {/* Dominant Palette Swatches */}
            {refMoments && refMoments.palette.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">Extracted Reference Color Palette:</span>
                <div className="flex gap-1.5">
                  {refMoments.palette.map((hex, i) => (
                    <div
                      key={i}
                      className="flex-1 h-6 rounded-md border border-white/20 shadow-inner"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            )}

            <label className="cursor-pointer block text-center py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] rounded-xl border border-white/10 transition-colors">
              Change Reference Image
              <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <label className="cursor-pointer border-2 border-dashed border-white/15 hover:border-pink-500/50 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-center bg-slate-950 transition-colors">
            <Upload className="w-6 h-6 text-pink-400" />
            <div>
              <span className="font-semibold text-slate-200 block text-xs">Upload Reference Image</span>
              <span className="text-[10px] text-slate-500">
                Extract color grading & transfer histogram distribution
              </span>
            </div>
            <input type="file" accept="image/*" onChange={handleReferenceUpload} className="hidden" />
          </label>
        )}
      </div>

      {/* Match Strength Slider */}
      {refMoments && (
        <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Color Match Transfer Strength:</span>
            <span className="font-mono text-pink-400">{Math.round(matchStrength * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={matchStrength}
            onChange={(e) => setMatchStrength(Number(e.target.value))}
            className="w-full accent-pink-400 h-1 bg-slate-800 rounded cursor-pointer"
          />

          <button
            onClick={handleRunColorMatch}
            disabled={isProcessing}
            className="w-full py-2.5 bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Zap className="w-4 h-4 text-slate-950 fill-current" />
            )}
            <span>Transfer Reference Color Tone</span>
          </button>
        </div>
      )}

      {success && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Reference color grading transferred to canvas!</span>
        </div>
      )}
    </div>
  );
};
