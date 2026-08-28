/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { CurveControlPoint, ToneCurveChannel } from '@/types/editor';
import { computeCurveLut } from '@/lib/filters';
import {
  RotateCcw,
  Sparkles,
  TrendingUp,
  Sliders,
  Eye,
  EyeOff,
  Plus,
  Trash2,
} from 'lucide-react';

const PRESETS: { name: string; desc: string; rgb: CurveControlPoint[] }[] = [
  {
    name: 'Linear (Default)',
    desc: 'Neutral 1:1 linear passthrough',
    rgb: [
      { x: 0, y: 0 },
      { x: 255, y: 255 },
    ],
  },
  {
    name: 'High Contrast S-Curve',
    desc: 'Deep blacks and punchy brights',
    rgb: [
      { x: 0, y: 0 },
      { x: 64, y: 42 },
      { x: 192, y: 216 },
      { x: 255, y: 255 },
    ],
  },
  {
    name: 'Matte Film / Faded Black',
    desc: 'Cinematic lifted toe and softened roll-off',
    rgb: [
      { x: 0, y: 35 },
      { x: 75, y: 65 },
      { x: 180, y: 195 },
      { x: 255, y: 235 },
    ],
  },
  {
    name: 'Bleach Bypass Look',
    desc: 'Compressed dynamic range with crisp midtones',
    rgb: [
      { x: 0, y: 10 },
      { x: 90, y: 55 },
      { x: 165, y: 200 },
      { x: 255, y: 245 },
    ],
  },
  {
    name: 'Shadow Recovery',
    desc: 'Lifts dark undertones without clipping highlights',
    rgb: [
      { x: 0, y: 0 },
      { x: 60, y: 95 },
      { x: 160, y: 185 },
      { x: 255, y: 255 },
    ],
  },
];

export const ToneCurvesPanel: React.FC = () => {
  const {
    toneCurves,
    updateToneCurves,
    resetToneCurves,
    pushHistory,
  } = useEditor();

  const [activeChannel, setActiveChannel] = useState<ToneCurveChannel>('rgb');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingPointRef = useRef<number | null>(null);

  const currentPoints = toneCurves[activeChannel];
  const lut = computeCurveLut(currentPoints);

  // Build SVG path string from 256 LUT points
  const svgPath = Array.from(lut)
    .map((val, idx) => {
      // SVG viewport 0..256 where 0,0 is top-left, so y = 255 - val
      const x = idx;
      const y = 255 - val;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const getChannelColor = (chan: ToneCurveChannel) => {
    switch (chan) {
      case 'red':
        return '#ef4444';
      case 'green':
        return '#22c55e';
      case 'blue':
        return '#3b82f6';
      default:
        return '#f8fafc';
    }
  };

  // Convert client mouse coordinates to 0..255 SVG unit coords
  const getSvgCoords = useCallback((e: React.MouseEvent): { x: number; y: number } => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(255, ((e.clientX - rect.left) / rect.width) * 255)));
    const y = Math.round(Math.max(0, Math.min(255, 255 - ((e.clientY - rect.top) / rect.height) * 255)));
    return { x, y };
  }, []);

  const handleMouseDownOnPoint = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    draggingPointRef.current = index;
    setSelectedPointIndex(index);
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    if (draggingPointRef.current !== null) return;
    const { x, y } = getSvgCoords(e);

    // Don't add if already exists near x
    const closePoint = currentPoints.findIndex((p) => Math.abs(p.x - x) < 12);
    if (closePoint >= 0) {
      setSelectedPointIndex(closePoint);
      return;
    }

    const newPoints = [...currentPoints, { x, y }].sort((a, b) => a.x - b.x);
    updateToneCurves({
      enabled: true,
      [activeChannel]: newPoints,
    });
    const newIdx = newPoints.findIndex((p) => p.x === x);
    setSelectedPointIndex(newIdx);
    pushHistory(`Add Curve Point (${activeChannel.toUpperCase()})`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingPointRef.current === null) return;
    const idx = draggingPointRef.current;
    const { x, y } = getSvgCoords(e);

    const updated = [...currentPoints];
    const pt = updated[idx];
    if (!pt) return;

    // Endpoints lock on X axis
    if (idx === 0) {
      updated[idx] = { x: 0, y };
    } else if (idx === updated.length - 1) {
      updated[idx] = { x: 255, y };
    } else {
      const prevX = updated[idx - 1].x + 4;
      const nextX = updated[idx + 1].x - 4;
      const clampedX = Math.max(prevX, Math.min(nextX, x));
      updated[idx] = { x: clampedX, y };
    }

    updateToneCurves({
      enabled: true,
      [activeChannel]: updated,
    });
  };

  const handleMouseUp = () => {
    if (draggingPointRef.current !== null) {
      draggingPointRef.current = null;
      pushHistory(`Adjust Curve Point (${activeChannel.toUpperCase()})`);
    }
  };

  const removeSelectedPoint = () => {
    if (selectedPointIndex === null) return;
    if (selectedPointIndex === 0 || selectedPointIndex === currentPoints.length - 1) return;
    const updated = currentPoints.filter((_, i) => i !== selectedPointIndex);
    updateToneCurves({
      [activeChannel]: updated,
    });
    setSelectedPointIndex(null);
    pushHistory(`Delete Curve Point (${activeChannel.toUpperCase()})`);
  };

  const applyCurvePreset = (preset: typeof PRESETS[0]) => {
    updateToneCurves({
      enabled: true,
      rgb: JSON.parse(JSON.stringify(preset.rgb)),
    });
    pushHistory(`Tone Curve: ${preset.name}`);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-[#0a0d14] text-slate-200 text-xs p-4 space-y-4 select-none">
      {/* Header & Global Master Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <TrendingUp size={14} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">Tone Curves LUT</h3>
            <p className="text-[10px] text-slate-400">Spline-interpolated tonal grading</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateToneCurves({ enabled: !toneCurves.enabled })}
            title={toneCurves.enabled ? 'Disable Tone Curves' : 'Enable Tone Curves'}
            className={`p-1.5 rounded-lg border transition-all ${
              toneCurves.enabled
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            {toneCurves.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={resetToneCurves}
            title="Reset All Curves"
            className="p-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 transition-all"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Channel Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/60 rounded-xl border border-white/5">
        {(['rgb', 'red', 'green', 'blue'] as ToneCurveChannel[]).map((chan) => {
          const isActive = activeChannel === chan;
          return (
            <button
              key={chan}
              onClick={() => {
                setActiveChannel(chan);
                setSelectedPointIndex(null);
              }}
              className={`py-1.5 px-2 rounded-lg font-medium text-[11px] capitalize transition-all flex items-center justify-center space-x-1.5 ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-white/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getChannelColor(chan) }}
              />
              <span>{chan.toUpperCase()}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive SVG Tone Curve Editor */}
      <div className="relative flex flex-col items-center bg-slate-950/80 rounded-2xl p-3 border border-white/10 shadow-inner">
        <svg
          ref={svgRef}
          viewBox="0 0 256 256"
          className="w-full aspect-square max-w-[260px] cursor-crosshair rounded-xl overflow-hidden touch-none"
          onClick={handleSvgClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Subtle Grid Lines (Quarters) */}
          <line x1="64" y1="0" x2="64" y2="256" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="128" y1="0" x2="128" y2="256" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="192" y1="0" x2="192" y2="256" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />

          <line x1="0" y1="64" x2="256" y2="64" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="128" x2="256" y2="128" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="0" y1="192" x2="256" y2="192" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Neutral 45-degree Reference Line */}
          <line x1="0" y1="256" x2="256" y2="0" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Evaluated Smooth Spline Path */}
          <path
            d={svgPath}
            fill="none"
            stroke={getChannelColor(activeChannel)}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.3)]"
          />

          {/* Interactive Control Points */}
          {currentPoints.map((pt, idx) => {
            const isSelected = selectedPointIndex === idx;
            const svgX = pt.x;
            const svgY = 255 - pt.y;

            return (
              <g
                key={idx}
                onMouseDown={(e) => handleMouseDownOnPoint(e, idx)}
                className="cursor-pointer group"
              >
                <circle
                  cx={svgX}
                  cy={svgY}
                  r="7"
                  fill={isSelected ? '#38bdf8' : getChannelColor(activeChannel)}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />
                {isSelected && (
                  <circle
                    cx={svgX}
                    cy={svgY}
                    r="11"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Point Inspector & Delete Action */}
        <div className="w-full flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
          {selectedPointIndex !== null && currentPoints[selectedPointIndex] ? (
            <div className="flex items-center space-x-3">
              <span>
                In: <strong className="text-slate-200">{currentPoints[selectedPointIndex].x}</strong>
              </span>
              <span>
                Out: <strong className="text-slate-200">{currentPoints[selectedPointIndex].y}</strong>
              </span>
              {selectedPointIndex > 0 && selectedPointIndex < currentPoints.length - 1 && (
                <button
                  onClick={removeSelectedPoint}
                  className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 transition-colors ml-2"
                >
                  <Trash2 size={12} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          ) : (
            <span className="text-[10px] text-slate-500">Click anywhere on curve to add point</span>
          )}

          <button
            onClick={() => {
              updateToneCurves({
                [activeChannel]: [
                  { x: 0, y: 0 },
                  { x: 255, y: 255 },
                ],
              });
              setSelectedPointIndex(null);
            }}
            className="text-[10px] text-sky-400 hover:text-sky-300 transition-colors"
          >
            Reset {activeChannel.toUpperCase()}
          </button>
        </div>
      </div>

      {/* Preset Curve Styles */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center space-x-1.5 text-slate-400 font-medium text-[11px]">
          <Sparkles size={12} className="text-amber-400" />
          <span>Cinematic Curve Presets</span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyCurvePreset(preset)}
              className="w-full p-2 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 hover:border-white/10 transition-all text-left group"
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
