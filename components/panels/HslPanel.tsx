/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { HslChannelName, HslChannelValue, HslColorState } from '@/types/editor';
import {
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Palette,
  Droplets,
  SunMedium,
  Compass,
} from 'lucide-react';

const CHANNELS: { id: HslChannelName; label: string; color: string }[] = [
  { id: 'red', label: 'Reds', color: '#ef4444' },
  { id: 'orange', label: 'Oranges', color: '#f97316' },
  { id: 'yellow', label: 'Yellows', color: '#eab308' },
  { id: 'green', label: 'Greens', color: '#22c55e' },
  { id: 'cyan', label: 'Cyans', color: '#06b6d4' },
  { id: 'blue', label: 'Blues', color: '#3b82f6' },
  { id: 'purple', label: 'Purples', color: '#a855f7' },
  { id: 'magenta', label: 'Magentas', color: '#ec4899' },
];

const HSL_PRESETS = [
  {
    name: 'Vibrant Foliage & Flora',
    desc: 'Lush enriched greens and warm floral highlights',
    channels: {
      green: { hue: -5, saturation: 40, luminance: 10 },
      yellow: { hue: -10, saturation: 30, luminance: 5 },
      cyan: { hue: 10, saturation: 20, luminance: 0 },
    },
  },
  {
    name: 'Deep Atmospheric Sky',
    desc: 'Polarized deep blues and rich azure tones',
    channels: {
      blue: { hue: -15, saturation: 45, luminance: -20 },
      cyan: { hue: -10, saturation: 35, luminance: -10 },
    },
  },
  {
    name: 'Skin Tone Radiant Glow',
    desc: 'Softened warmth for glowing portrait skin',
    channels: {
      orange: { hue: -5, saturation: 15, luminance: 10 },
      red: { hue: 5, saturation: 10, luminance: 5 },
      yellow: { hue: -8, saturation: 12, luminance: 8 },
    },
  },
  {
    name: 'Teal & Orange HSL Isolation',
    desc: 'Pushed cyan blues and enhanced warm tones',
    channels: {
      blue: { hue: -40, saturation: 50, luminance: -10 },
      cyan: { hue: -15, saturation: 45, luminance: -5 },
      orange: { hue: -10, saturation: 35, luminance: 10 },
      red: { hue: 10, saturation: 25, luminance: 5 },
      green: { hue: 0, saturation: -60, luminance: -20 },
    },
  },
];

export const HslPanel: React.FC = () => {
  const {
    hslState,
    updateHslState,
    resetHslState,
    pushHistory,
  } = useEditor();

  const [selectedChannel, setSelectedChannel] = useState<HslChannelName>('red');
  const currentVal = hslState[selectedChannel] || { hue: 0, saturation: 0, luminance: 0 };

  const updateChannel = (partial: Partial<HslChannelValue>) => {
    updateHslState({
      enabled: true,
      [selectedChannel]: {
        ...currentVal,
        ...partial,
      },
    });
  };

  const resetCurrentChannel = () => {
    updateChannel({ hue: 0, saturation: 0, luminance: 0 });
    pushHistory(`Reset ${selectedChannel.toUpperCase()} HSL`);
  };

  const applyHslPreset = (preset: typeof HSL_PRESETS[0]) => {
    const updatedState: Partial<HslColorState> = { enabled: true };
    for (const [k, v] of Object.entries(preset.channels)) {
      const chan = k as HslChannelName;
      updatedState[chan] = { ...hslState[chan], ...v };
    }
    updateHslState(updatedState);
    pushHistory(`HSL Preset: ${preset.name}`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0d14] text-slate-200 text-xs p-4 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Palette size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Selective HSL</h3>
            <p className="text-[10px] text-slate-400">8-Channel targeted color tuning</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateHslState({ enabled: !hslState.enabled })}
            title={hslState.enabled ? 'Disable Selective HSL' : 'Enable Selective HSL'}
            className={`p-1.5 rounded-lg border transition-all ${
              hslState.enabled
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {hslState.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={resetHslState}
            title="Reset All HSL Channels"
            className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 8 Color Channel Buttons */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-slate-900/60 rounded-2xl border border-white/5">
        {CHANNELS.map((ch) => {
          const isSelected = selectedChannel === ch.id;
          const val = hslState[ch.id];
          const hasAdjustment = val && (val.hue !== 0 || val.saturation !== 0 || val.luminance !== 0);

          return (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch.id)}
              className={`relative flex flex-col items-center py-2 px-1 rounded-xl transition-all ${
                isSelected
                  ? 'bg-slate-800 text-white border border-white/20 shadow-md scale-[1.02]'
                  : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full shadow-inner mb-1 border border-white/20"
                style={{ backgroundColor: ch.color }}
              />
              <span className="text-[10px] font-medium leading-none">{ch.label}</span>
              {hasAdjustment && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Channel Sliders Card */}
      <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full border border-white/20"
              style={{
                backgroundColor: CHANNELS.find((c) => c.id === selectedChannel)?.color,
              }}
            />
            <span className="font-semibold text-slate-100 uppercase tracking-wider text-[11px]">
              {selectedChannel} Channel
            </span>
          </div>

          <button
            onClick={resetCurrentChannel}
            className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
          >
            Reset Channel
          </button>
        </div>

        {/* Hue Shift Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1 text-slate-400">
              <Compass size={12} className="text-slate-500" />
              <span>Hue Shift</span>
            </span>
            <span className="font-mono text-slate-200">
              {currentVal.hue > 0 ? `+${currentVal.hue}°` : `${currentVal.hue}°`}
            </span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            value={currentVal.hue}
            onChange={(e) => updateChannel({ hue: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Saturation Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1 text-slate-400">
              <Droplets size={12} className="text-slate-500" />
              <span>Saturation</span>
            </span>
            <span className="font-mono text-slate-200">
              {currentVal.saturation > 0 ? `+${currentVal.saturation}%` : `${currentVal.saturation}%`}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={currentVal.saturation}
            onChange={(e) => updateChannel({ saturation: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        {/* Luminance Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center space-x-1 text-slate-400">
              <SunMedium size={12} className="text-slate-500" />
              <span>Luminance</span>
            </span>
            <span className="font-mono text-slate-200">
              {currentVal.luminance > 0 ? `+${currentVal.luminance}%` : `${currentVal.luminance}%`}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={currentVal.luminance}
            onChange={(e) => updateChannel({ luminance: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
        </div>
      </div>

      {/* Preset HSL Recipes */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium text-[11px]">
          <Sparkles size={12} className="text-amber-400" />
          <span>HSL Tuning Recipes</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {HSL_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyHslPreset(preset)}
              className="w-full p-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 transition-all text-left group"
            >
              <div className="font-medium text-slate-200 group-hover:text-sky-300 transition-colors">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
