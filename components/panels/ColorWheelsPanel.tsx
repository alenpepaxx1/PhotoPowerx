/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useRef, useCallback, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { ColorWheelBalance } from '@/types/editor';
import {
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Contrast,
  SlidersHorizontal,
} from 'lucide-react';

interface SingleWheelProps {
  label: string;
  icon: React.ReactNode;
  value: ColorWheelBalance;
  onChange: (val: Partial<ColorWheelBalance>) => void;
  accentColor?: string;
}

const SingleWheel: React.FC<SingleWheelProps> = ({
  label,
  icon,
  value,
  onChange,
  accentColor = '#38bdf8',
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const RADIUS = 44; // 88px diameter

  // Calculate thumb position from hue and saturation
  // hue in degrees (0..360), saturation in 0..100
  const rad = (value.hue * Math.PI) / 180;
  const dist = (value.saturation / 100) * RADIUS;
  const thumbX = RADIUS + dist * Math.cos(rad);
  const thumbY = RADIUS + dist * Math.sin(rad);

  const updateFromMouse = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!wheelRef.current) return;
      const rect = wheelRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const distance = Math.min(RADIUS, Math.sqrt(dx * dx + dy * dy));
      let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (angle < 0) angle += 360;

      const saturation = Math.round((distance / RADIUS) * 100);
      const hue = Math.round(angle);

      onChange({ hue, saturation });
    },
    [RADIUS, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateFromMouse(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      updateFromMouse(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetWheel = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ hue: 0, saturation: 0, luminance: 0 });
  };

  return (
    <div className="flex flex-col items-center bg-slate-900/60 p-3 rounded-2xl border border-white/5 space-y-2.5">
      {/* Title Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-1.5 font-semibold text-slate-200 text-[11px]">
          <span className="text-slate-400">{icon}</span>
          <span>{label}</span>
        </div>
        <button
          onClick={resetWheel}
          title={`Reset ${label}`}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <RotateCcw size={11} />
        </button>
      </div>

      {/* 2D Color Disc */}
      <div
        ref={wheelRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative w-[88px] h-[88px] rounded-full cursor-crosshair border border-white/15 shadow-inner touch-none select-none overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at center, #808080 0%, transparent 70%),
            conic-gradient(from 0deg at 50% 50%, #f00 0deg, #ff0 60deg, #0f0 120deg, #0ff 180deg, #00f 240deg, #f0f 300deg, #f00 360deg)
          `,
        }}
      >
        {/* Neutral target crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
          <div className="w-full h-[1px] bg-white/60" />
          <div className="absolute h-full w-[1px] bg-white/60" />
        </div>

        {/* Draggable thumb selector */}
        <div
          className="absolute w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full border-2 border-white bg-slate-950 shadow-md pointer-events-none transition-transform"
          style={{
            left: `${thumbX}px`,
            top: `${thumbY}px`,
            boxShadow: '0 0 6px rgba(0,0,0,0.8)',
          }}
        />
      </div>

      {/* Color readout */}
      <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-2">
        <span>H: {value.hue}°</span>
        <span>S: {value.saturation}%</span>
      </div>

      {/* Luminance Offset Slider */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Lum Offset</span>
          <span className="font-mono text-slate-300">
            {value.luminance > 0 ? `+${value.luminance}` : value.luminance}
          </span>
        </div>
        <input
          type="range"
          min="-100"
          max="100"
          value={value.luminance}
          onChange={(e) => onChange({ luminance: Number(e.target.value) })}
          className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />
      </div>
    </div>
  );
};

const COLOR_GRADE_PRESETS = [
  {
    name: 'Teal & Orange (Blockbuster)',
    desc: 'Cool shadows with warm skin-tone highlights',
    grade: {
      shadows: { hue: 195, saturation: 35, luminance: -10 },
      midtones: { hue: 35, saturation: 15, luminance: 0 },
      highlights: { hue: 30, saturation: 40, luminance: 5 },
    },
  },
  {
    name: 'Cyberpunk Neon',
    desc: 'Deep purple shadows with vibrant cyan highlights',
    grade: {
      shadows: { hue: 280, saturation: 45, luminance: -15 },
      midtones: { hue: 310, saturation: 25, luminance: 0 },
      highlights: { hue: 180, saturation: 50, luminance: 10 },
    },
  },
  {
    name: 'Golden Hour Film',
    desc: 'Warm sunset ambience throughout dynamic range',
    grade: {
      shadows: { hue: 40, saturation: 20, luminance: 5 },
      midtones: { hue: 35, saturation: 30, luminance: 5 },
      highlights: { hue: 45, saturation: 45, luminance: 10 },
    },
  },
  {
    name: 'Nordic Frost / Cold Mood',
    desc: 'Icy blues and desaturated midtones',
    grade: {
      shadows: { hue: 220, saturation: 35, luminance: -5 },
      midtones: { hue: 200, saturation: 20, luminance: -5 },
      highlights: { hue: 190, saturation: 25, luminance: 5 },
    },
  },
];

export const ColorWheelsPanel: React.FC = () => {
  const {
    colorWheels,
    updateColorWheels,
    resetColorWheels,
    pushHistory,
  } = useEditor();

  const applyGradePreset = (preset: typeof COLOR_GRADE_PRESETS[0]) => {
    updateColorWheels({
      enabled: true,
      shadows: { ...preset.grade.shadows },
      midtones: { ...preset.grade.midtones },
      highlights: { ...preset.grade.highlights },
    });
    pushHistory(`Color Grade: ${preset.name}`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0d14] text-slate-200 text-xs p-4 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <SlidersHorizontal size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">3-Way Color Wheels</h3>
            <p className="text-[10px] text-slate-400">Lift, Gamma, Gain color grading</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateColorWheels({ enabled: !colorWheels.enabled })}
            title={colorWheels.enabled ? 'Disable Color Wheels' : 'Enable Color Wheels'}
            className={`p-1.5 rounded-lg border transition-all ${
              colorWheels.enabled
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {colorWheels.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={resetColorWheels}
            title="Reset All Wheels"
            className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 3 Color Wheels (Lift, Gamma, Gain) */}
      <div className="grid grid-cols-1 gap-3">
        {/* Lift (Shadows) */}
        <SingleWheel
          label="Lift (Shadows)"
          icon={<Moon size={13} className="text-indigo-400" />}
          value={colorWheels.shadows}
          onChange={(val) => {
            updateColorWheels({
              enabled: true,
              shadows: { ...colorWheels.shadows, ...val },
            });
          }}
        />

        {/* Gamma (Midtones) */}
        <SingleWheel
          label="Gamma (Midtones)"
          icon={<Contrast size={13} className="text-amber-400" />}
          value={colorWheels.midtones}
          onChange={(val) => {
            updateColorWheels({
              enabled: true,
              midtones: { ...colorWheels.midtones, ...val },
            });
          }}
        />

        {/* Gain (Highlights) */}
        <SingleWheel
          label="Gain (Highlights)"
          icon={<Sun size={13} className="text-orange-400" />}
          value={colorWheels.highlights}
          onChange={(val) => {
            updateColorWheels({
              enabled: true,
              highlights: { ...colorWheels.highlights, ...val },
            });
          }}
        />
      </div>

      {/* Cinematic Color Grading Presets */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium text-[11px]">
          <Sparkles size={12} className="text-amber-400" />
          <span>Cinematic Color Grades</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {COLOR_GRADE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyGradePreset(preset)}
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
