/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { FlareEffectType } from '@/types/editor';
import {
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Flame,
  Sun,
  Tv,
  Film,
  Zap,
  Sliders,
  Move,
} from 'lucide-react';

const EFFECT_TYPES: { id: FlareEffectType; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'anamorphic-blue',
    label: 'Anamorphic Blue Streak',
    desc: 'Cinematic horizontal sci-fi streak',
    icon: <Zap size={14} className="text-sky-400" />,
  },
  {
    id: 'golden-sunburst',
    label: 'Golden Sunburst Flare',
    desc: 'Warm multi-point solar flare rays',
    icon: <Sun size={14} className="text-amber-400" />,
  },
  {
    id: 'vintage-leak',
    label: '35mm Light Leak',
    desc: 'Authentic warm film canister exposure',
    icon: <Flame size={14} className="text-orange-400" />,
  },
  {
    id: 'prism-glint',
    label: 'Prism Star Glint',
    desc: 'Specular optical starburst glimmer',
    icon: <Sparkles size={14} className="text-emerald-400" />,
  },
  {
    id: 'film-dust',
    label: '35mm Film Dust & Grain',
    desc: 'Organic vintage flecks and scratches',
    icon: <Film size={14} className="text-slate-300" />,
  },
  {
    id: 'crt-scanlines',
    label: 'Retro CRT Scanlines',
    desc: 'Phosphor arcade monitor scan raster',
    icon: <Tv size={14} className="text-purple-400" />,
  },
  {
    id: 'chromatic-aberration',
    label: 'Chromatic Aberration',
    desc: 'RGB optical fringe displacement',
    icon: <Sliders size={14} className="text-rose-400" />,
  },
];

export const OpticalVfxPanel: React.FC = () => {
  const {
    opticalVfx,
    updateOpticalVfx,
    resetOpticalVfx,
    pushHistory,
  } = useEditor();

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0d14] text-slate-200 text-xs p-4 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Zap size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Optical VFX</h3>
            <p className="text-[10px] text-slate-400">Cinematic lens flares & retro glass</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateOpticalVfx({ enabled: !opticalVfx.enabled })}
            title={opticalVfx.enabled ? 'Disable Optical VFX' : 'Enable Optical VFX'}
            className={`p-1.5 rounded-lg border transition-all ${
              opticalVfx.enabled
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {opticalVfx.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={resetOpticalVfx}
            title="Reset Optical VFX"
            className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Optical Preset Library */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-slate-300">Optical Effect Model</label>
        <div className="grid grid-cols-1 gap-1.5">
          {EFFECT_TYPES.map((fx) => {
            const isSelected = opticalVfx.flareType === fx.id;
            return (
              <button
                key={fx.id}
                onClick={() => {
                  updateOpticalVfx({
                    enabled: true,
                    flareType: fx.id,
                  });
                  pushHistory(`Set Optical VFX: ${fx.label}`);
                }}
                className={`flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500/40 text-white shadow-sm'
                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-800/80 border border-white/10">
                  {fx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-200 text-[11px] leading-tight">
                    {fx.label}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">{fx.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optics Physics Parameters */}
      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3.5">
        <h4 className="font-semibold text-slate-200 text-[11px] flex items-center space-x-1.5">
          <Sliders size={13} className="text-sky-400" />
          <span>Optics Physics Controls</span>
        </h4>

        {/* Intensity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Flare Luminosity</span>
            <span className="font-mono text-slate-200">{opticalVfx.intensity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opticalVfx.intensity}
            onChange={(e) => updateOpticalVfx({ intensity: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Light Source Position X */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Light Position X</span>
            <span className="font-mono text-slate-200">{Math.round(opticalVfx.posX * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opticalVfx.posX}
            onChange={(e) => updateOpticalVfx({ posX: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Light Source Position Y */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Light Position Y</span>
            <span className="font-mono text-slate-200">{Math.round(opticalVfx.posY * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opticalVfx.posY}
            onChange={(e) => updateOpticalVfx({ posY: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Optical Spread / Scale</span>
            <span className="font-mono text-slate-200">{opticalVfx.scale.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="3"
            step="0.05"
            value={opticalVfx.scale}
            onChange={(e) => updateOpticalVfx({ scale: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Anamorphic Angle</span>
            <span className="font-mono text-slate-200">{opticalVfx.rotation}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={opticalVfx.rotation}
            onChange={(e) => updateOpticalVfx({ rotation: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Blend Mode */}
        <div className="space-y-1 pt-1">
          <label className="text-[11px] text-slate-400">Composite Blend</label>
          <select
            value={opticalVfx.blendMode}
            onChange={(e) => updateOpticalVfx({ blendMode: e.target.value as any })}
            className="w-full py-1.5 px-2 bg-slate-800 border border-white/10 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-sky-400"
          >
            <option value="screen">Screen (Natural Light)</option>
            <option value="lighter">Additive (Lighter / Glow)</option>
            <option value="color-dodge">Color Dodge (Intense Burn)</option>
            <option value="soft-light">Soft Light (Subtle Ambient)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
