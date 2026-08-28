/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { RetouchMode } from '@/types/editor';
import { HslPanel } from './HslPanel';
import {
  Sparkles,
  Sun,
  Moon,
  Droplet,
  Palette,
  Brush,
} from 'lucide-react';

export const RetouchInspector: React.FC = () => {
  const {
    retouchMode,
    setRetouchMode,
    retouchRadius,
    setRetouchRadius,
    setActiveTool,
  } = useEditor();

  const [retouchSubTab, setRetouchSubTab] = useState<'brush' | 'hsl'>('brush');

  const modes: { id: RetouchMode; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'heal',
      label: 'Spot Healing Brush',
      desc: 'Removes blemishes, dust, scratches and unwanted spots seamlessly.',
      icon: Sparkles,
    },
    {
      id: 'smooth',
      label: 'Skin Smoothing Blur',
      desc: 'Gently softens skin textures and uneven complexions.',
      icon: Droplet,
    },
    {
      id: 'dodge',
      label: 'Dodge (Lighten Tool)',
      desc: 'Brightens selective highlights, eyes, and contours like Photoshop Dodge.',
      icon: Sun,
    },
    {
      id: 'burn',
      label: 'Burn (Darken Tool)',
      desc: 'Deepens shadows, adds dramatic vignette and sculpts cheekbones.',
      icon: Moon,
    },
  ];

  if (retouchSubTab === 'hsl') {
    return (
      <div className="flex flex-col h-full bg-[#0a0d14]">
        <div className="p-2 border-b border-white/5 bg-[#0d111a] flex gap-1">
          <button
            onClick={() => setRetouchSubTab('brush')}
            className="flex-1 py-1 px-2 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 flex items-center justify-center space-x-1"
          >
            <Brush size={12} />
            <span>Brush Healing</span>
          </button>
          <button
            onClick={() => setRetouchSubTab('hsl')}
            className="flex-1 py-1 px-2 rounded-lg text-[11px] font-medium bg-slate-800 text-sky-300 border border-white/10 flex items-center justify-center space-x-1 shadow-sm"
          >
            <Palette size={12} />
            <span>Selective HSL</span>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <HslPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] text-xs select-none space-y-3 overflow-y-auto">
      {/* Subtab Switch */}
      <div className="p-2 border-b border-white/5 bg-[#0d111a] flex gap-1">
        <button
          onClick={() => setRetouchSubTab('brush')}
          className="flex-1 py-1 px-2 rounded-lg text-[11px] font-medium bg-slate-800 text-sky-300 border border-white/10 flex items-center justify-center space-x-1 shadow-sm"
        >
          <Brush size={12} />
          <span>Brush Healing</span>
        </button>
        <button
          onClick={() => setRetouchSubTab('hsl')}
          className="flex-1 py-1 px-2 rounded-lg text-[11px] font-medium text-slate-400 hover:text-slate-200 flex items-center justify-center space-x-1"
        >
          <Palette size={12} />
          <span>Selective HSL</span>
        </button>
      </div>

      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Retouch & Healing Brushes</span>
          </span>
        </div>

        {/* Retouch Modes List */}
        <div className="space-y-2">
          <label className="text-slate-400 text-[11px]">Select Retouching Mode:</label>
          <div className="space-y-2">
            {modes.map((m) => {
              const Icon = m.icon;
              const isSelected = retouchMode === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setRetouchMode(m.id);
                    setActiveTool('retouch');
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-sky-950/40 border-sky-500/40 text-white shadow'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:border-white/10 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected ? 'bg-sky-500 text-white shadow-sm' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold block text-slate-200 text-[11px]">{m.label}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{m.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Radius & Strength */}
        <div className="space-y-3 p-3 bg-slate-900/60 rounded-2xl border border-white/5">
          <span className="text-[11px] font-semibold text-slate-200">Brush Geometry</span>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Brush Radius:</span>
              <span className="font-mono text-slate-200">{retouchRadius}px</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              value={retouchRadius}
              onChange={(e) => setRetouchRadius(Number(e.target.value))}
              className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl text-[11px] text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Tip:</strong> Click and brush directly over the canvas photo areas to apply local spot healing, skin smoothing, or dodging/burning in real time.
        </div>
      </div>
    </div>
  );
};
