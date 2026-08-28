/**
 * PhotoPower - Advanced Photo & Video Studio
 * AI Sky Replacement & Background Matte Isolator Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  CloudSun,
  Sparkles,
  RefreshCw,
  Check,
  Layers,
  Sun,
  Moon,
  Compass,
  Sliders,
  Maximize2,
  Trash2,
} from 'lucide-react';

export interface PresetSky {
  id: string;
  name: string;
  type: string;
  gradTop: string;
  gradBottom: string;
  warmth: number;
}

export const PRESET_SKIES: PresetSky[] = [
  { id: 'sunset', name: 'Golden Hour Sunset', type: 'Sunset', gradTop: '#3b0764', gradBottom: '#f97316', warmth: 25 },
  { id: 'galaxy', name: 'Deep Milky Way', type: 'Night', gradTop: '#09090b', gradBottom: '#1e1b4b', warmth: -20 },
  { id: 'aurora', name: 'Northern Aurora', type: 'Fantasy', gradTop: '#022c22', gradBottom: '#06b6d4', warmth: -15 },
  { id: 'cumulus', name: 'Fluffy Blue Sky', type: 'Daylight', gradTop: '#0284c7', gradBottom: '#e0f2fe', warmth: 5 },
  { id: 'stormy', name: 'Dramatic Thunderstorm', type: 'Dramatic', gradTop: '#111827', gradBottom: '#4b5563', warmth: -10 },
];

export const AiSkyReplacementPanel: React.FC = () => {
  const { pushHistory } = useEditor();

  const [selectedSkyId, setSelectedSkyId] = useState<string>('sunset');
  const [horizonHeight, setHorizonHeight] = useState<number>(45); // % from top
  const [horizonBlend, setHorizonBlend] = useState<number>(35);
  const [skyOpacity, setSkyOpacity] = useState<number>(90);
  const [warmthMatch, setWarmthMatch] = useState<number>(20);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  const selectedSky = PRESET_SKIES.find((s) => s.id === selectedSkyId) || PRESET_SKIES[0];

  // AI Sky Replacement Shader & Gradient Horizon Blending
  const handleApplySkyReplacement = () => {
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

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Parse sky top & bottom hex colors
        const parseHex = (hex: string) => {
          const clean = hex.replace('#', '');
          return {
            r: parseInt(clean.substring(0, 2), 16) || 0,
            g: parseInt(clean.substring(2, 4), 16) || 0,
            b: parseInt(clean.substring(4, 6), 16) || 0,
          };
        };

        const cTop = parseHex(selectedSky.gradTop);
        const cBot = parseHex(selectedSky.gradBottom);

        const horizonY = (horizonHeight / 100) * h;
        const blendPixels = (horizonBlend / 100) * (h / 2);

        // Blend replacement sky gradient into upper region of the canvas
        for (let y = 0; y < h; y++) {
          let skyAlpha = 0;
          if (y < horizonY - blendPixels) {
            skyAlpha = 1;
          } else if (y <= horizonY + blendPixels) {
            skyAlpha = 1 - (y - (horizonY - blendPixels)) / (blendPixels * 2);
          }

          if (skyAlpha <= 0) continue;

          // Sky gradient ratio (top to horizon)
          const gradT = Math.max(0, Math.min(1, y / horizonY));
          const skyR = cTop.r * (1 - gradT) + cBot.r * gradT;
          const skyG = cTop.g * (1 - gradT) + cBot.g * gradT;
          const skyB = cTop.b * (1 - gradT) + cBot.b * gradT;

          const effectiveAlpha = skyAlpha * (skyOpacity / 100);

          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;

            // Simple luminosity mask to protect foreground subjects
            const origR = data[idx];
            const origG = data[idx + 1];
            const origB = data[idx + 2];
            const lum = (origR + origG + origB) / 3;

            // Sky regions are usually lighter or blue-shifted
            let mask = effectiveAlpha;
            if (lum < 50) mask *= 0.2; // Protect dark foreground silhouettes

            data[idx] = Math.round(origR * (1 - mask) + skyR * mask);
            data[idx + 1] = Math.round(origG * (1 - mask) + skyG * mask);
            data[idx + 2] = Math.round(origB * (1 - mask) + skyB * mask);
          }
        }

        ctx.putImageData(imgData, 0, 0);

        pushHistory(`Replaced Sky with AI ${selectedSky.name}`);
        setAppliedNotice(true);
      } catch (e) {
        console.error('Sky replacement failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 250);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">AI Sky & Background Replacement</h3>
        </div>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
          SkyMatte v3.5
        </span>
      </div>

      {/* Preset Sky Atmosphere Selection */}
      <div className="space-y-2">
        <span className="text-[11px] text-slate-400 block font-medium">Sky Atmosphere Presets:</span>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_SKIES.map((sky) => {
            const isSelected = selectedSkyId === sky.id;
            return (
              <button
                key={sky.id}
                onClick={() => setSelectedSkyId(sky.id)}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'bg-cyan-600/20 border-cyan-400 text-cyan-200 font-bold shadow-md'
                    : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <div
                  className="w-full h-8 rounded-lg mb-2 shadow-inner border border-white/10"
                  style={{
                    background: `linear-gradient(to bottom, ${sky.gradTop}, ${sky.gradBottom})`,
                  }}
                />
                <span className="text-xs font-semibold text-slate-100 truncate">{sky.name}</span>
                <span className="text-[9px] text-slate-400">{sky.type}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sky Horizon & Blend Controls */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Horizon & Edge Matting Controls</span>
        </h4>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Horizon Position (Height):</span>
            <span className="font-mono text-cyan-300">{horizonHeight}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={horizonHeight}
            onChange={(e) => setHorizonHeight(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Horizon Edge Feathering:</span>
            <span className="font-mono text-cyan-300">{horizonBlend}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="80"
            value={horizonBlend}
            onChange={(e) => setHorizonBlend(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-400">Sky Overlay Opacity:</span>
            <span className="font-mono text-cyan-300">{skyOpacity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={skyOpacity}
            onChange={(e) => setSkyOpacity(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-950 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Render Button */}
      <button
        onClick={handleApplySkyReplacement}
        disabled={isProcessing}
        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
        ) : (
          <CloudSun className="w-4 h-4 text-slate-950" />
        )}
        <span>Render AI Sky Replacement</span>
      </button>

      {appliedNotice && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>AI Sky replaced and atmosphere matched!</span>
        </div>
      )}
    </div>
  );
};
