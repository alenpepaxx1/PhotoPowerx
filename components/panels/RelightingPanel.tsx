/**
 * PhotoPower - Advanced Photo & Video Studio
 * 3D Virtual Studio Lighting & Relighting Engine
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  Sun,
  Lightbulb,
  Zap,
  Sparkles,
  RefreshCw,
  Check,
  Plus,
  Trash2,
  Sliders,
  Compass,
  CircleDot,
  Maximize2,
  Eye,
} from 'lucide-react';

export interface StudioLight {
  id: string;
  name: string;
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  z: number; // Height elevation 1 - 100
  color: string;
  intensity: number; // 0 - 100
  radius: number; // 10 - 300%
  ambient: number; // 0 - 100
  type: 'point' | 'spot' | 'sun';
}

export const PRESET_LIGHTING_RIGS: { name: string; lights: StudioLight[] }[] = [
  {
    name: 'Cyberpunk Neon Studio',
    lights: [
      { id: '1', name: 'Cyan Key Light', x: 25, y: 35, z: 60, color: '#00f0ff', intensity: 75, radius: 120, ambient: 20, type: 'point' },
      { id: '2', name: 'Magenta Rim Light', x: 80, y: 65, z: 40, color: '#ff007f', intensity: 85, radius: 100, ambient: 10, type: 'spot' },
    ],
  },
  {
    name: 'Golden Hour Sunset',
    lights: [
      { id: '1', name: 'Warm Sun', x: 85, y: 20, z: 90, color: '#ffaa33', intensity: 90, radius: 200, ambient: 30, type: 'sun' },
      { id: '2', name: 'Soft Fill', x: 20, y: 70, z: 30, color: '#ffddaa', intensity: 40, radius: 150, ambient: 25, type: 'point' },
    ],
  },
  {
    name: 'Hollywood Rembrandt',
    lights: [
      { id: '1', name: 'Key Spotlight', x: 30, y: 25, z: 80, color: '#ffffff', intensity: 80, radius: 110, ambient: 15, type: 'spot' },
      { id: '2', name: 'Hair Light', x: 75, y: 15, z: 90, color: '#ffeecc', intensity: 50, radius: 90, ambient: 10, type: 'point' },
    ],
  },
];

export const RelightingPanel: React.FC = () => {
  const { pushHistory } = useEditor();

  const [lights, setLights] = useState<StudioLight[]>([
    {
      id: 'l1',
      name: 'Key Studio Light',
      x: 35,
      y: 30,
      z: 70,
      color: '#ffeedd',
      intensity: 75,
      radius: 120,
      ambient: 25,
      type: 'point',
    },
  ]);

  const [activeLightId, setActiveLightId] = useState<string>('l1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  const activeLight = lights.find((l) => l.id === activeLightId) || lights[0];

  const updateActiveLight = (key: keyof StudioLight, val: any) => {
    setLights((prev) =>
      prev.map((l) => (l.id === activeLightId ? { ...l, [key]: val } : l))
    );
  };

  const handleAddLight = () => {
    const newId = `l_${Date.now()}`;
    const newLight: StudioLight = {
      id: newId,
      name: `Studio Light ${lights.length + 1}`,
      x: 50,
      y: 50,
      z: 50,
      color: '#00f0ff',
      intensity: 60,
      radius: 100,
      ambient: 20,
      type: 'point',
    };
    setLights((prev) => [...prev, newLight]);
    setActiveLightId(newId);
  };

  const handleRemoveLight = (id: string) => {
    if (lights.length <= 1) return;
    setLights((prev) => prev.filter((l) => l.id !== id));
    if (activeLightId === id) {
      const remaining = lights.filter((l) => l.id !== id);
      setActiveLightId(remaining[0].id);
    }
  };

  const handleApplyPresetRig = (rig: typeof PRESET_LIGHTING_RIGS[0]) => {
    setLights(rig.lights);
    if (rig.lights.length > 0) setActiveLightId(rig.lights[0].id);
  };

  // 3D Relighting Pixel Shader Calculation
  const handleApplyRelighting = () => {
    setIsProcessing(true);
    setAppliedNotice(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const canvas = canvasObj.canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Process each light contribution
        for (let i = 0; i < data.length; i += 4) {
          const pixelX = (i / 4) % w;
          const pixelY = Math.floor(i / 4 / w);

          let addR = 0;
          let addG = 0;
          let addB = 0;

          const normX = (pixelX / w) * 100;
          const normY = (pixelY / h) * 100;

          for (const light of lights) {
            const dx = normX - light.x;
            const dy = normY - light.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxRad = light.radius;
            if (dist > maxRad && light.type !== 'sun') continue;

            // Hex color to RGB
            const hex = light.color.replace('#', '');
            const lr = parseInt(hex.substring(0, 2), 16) || 255;
            const lg = parseInt(hex.substring(2, 4), 16) || 255;
            const lb = parseInt(hex.substring(4, 6), 16) || 255;

            // Falloff factor
            let factor = 1 - dist / maxRad;
            if (light.type === 'sun') factor = Math.max(0.3, 1 - dist / (maxRad * 2));
            factor = Math.max(0, factor);

            // Specular curve
            const intensityNorm = (light.intensity / 100) * factor;

            addR += (lr * intensityNorm) / 2;
            addG += (lg * intensityNorm) / 2;
            addB += (lb * intensityNorm) / 2;
          }

          data[i] = Math.min(255, Math.max(0, data[i] + addR));
          data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + addG));
          data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + addB));
        }

        ctx.putImageData(imgData, 0, 0);
        pushHistory(`Applied 3D Studio Relighting (${lights.length} Lights)`);
        setAppliedNotice(true);
      } catch (e) {
        console.error('Relighting failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 250);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-slate-100 text-sm">3D Studio Relighting Engine</h3>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
          Ray Studio v3.0
        </span>
      </div>

      {/* Preset Lighting Rigs */}
      <div className="space-y-2">
        <span className="text-[11px] text-slate-400 block font-medium">Studio Lighting Rigs:</span>
        <div className="grid grid-cols-3 gap-1.5">
          {PRESET_LIGHTING_RIGS.map((rig) => (
            <button
              key={rig.name}
              onClick={() => handleApplyPresetRig(rig)}
              className="p-2 bg-slate-900 border border-white/5 hover:border-amber-400/40 hover:bg-slate-800 text-slate-300 rounded-xl text-left flex flex-col justify-between transition-colors"
            >
              <span className="font-semibold text-[11px] text-amber-200 truncate">{rig.name}</span>
              <span className="text-[9px] text-slate-500 mt-1">{rig.lights.length} Lights</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Lights List Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Active Light Sources:</span>
          <button
            onClick={handleAddLight}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Light</span>
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {lights.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLightId(l.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all ${
                l.id === activeLightId
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-semibold shadow-md'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: l.color }} />
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Light Controls */}
      {activeLight && (
        <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={activeLight.name}
              onChange={(e) => updateActiveLight('name', e.target.value)}
              className="bg-transparent border-b border-white/10 text-slate-100 font-semibold focus:outline-none focus:border-amber-400 text-xs py-0.5"
            />
            {lights.length > 1 && (
              <button
                onClick={() => handleRemoveLight(activeLight.id)}
                className="text-slate-500 hover:text-red-400 p-1"
                title="Remove Light Source"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Light Color & Type Picker */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Light Color:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeLight.color}
                  onChange={(e) => updateActiveLight('color', e.target.value)}
                  className="w-7 h-7 rounded-lg bg-transparent border border-white/20 cursor-pointer"
                />
                <span className="font-mono text-[11px] text-amber-300 uppercase">{activeLight.color}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-400">Light Type:</span>
              <select
                value={activeLight.type}
                onChange={(e) => updateActiveLight('type', e.target.value as any)}
                className="w-full bg-slate-950 border border-white/10 text-slate-200 rounded-xl px-2 py-1 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="point">Point Light</option>
                <option value="spot">Spotlight</option>
                <option value="sun">Sunlight</option>
              </select>
            </div>
          </div>

          {/* X and Y Canvas Position Sliders */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Position X (Horizontal):</span>
              <span className="font-mono text-amber-400">{activeLight.x}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={activeLight.x}
              onChange={(e) => updateActiveLight('x', Number(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-950 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Position Y (Vertical):</span>
              <span className="font-mono text-amber-400">{activeLight.y}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={activeLight.y}
              onChange={(e) => updateActiveLight('y', Number(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-950 rounded cursor-pointer"
            />
          </div>

          {/* Intensity & Radius */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Intensity:</span>
              <span className="font-mono text-amber-400">{activeLight.intensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={activeLight.intensity}
              onChange={(e) => updateActiveLight('intensity', Number(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-950 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Falloff Radius:</span>
              <span className="font-mono text-amber-400">{activeLight.radius}px</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              value={activeLight.radius}
              onChange={(e) => updateActiveLight('radius', Number(e.target.value))}
              className="w-full accent-amber-400 h-1 bg-slate-950 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Render Relighting Button */}
      <button
        onClick={handleApplyRelighting}
        disabled={isProcessing}
        className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
        ) : (
          <Zap className="w-4 h-4 text-slate-950 fill-current" />
        )}
        <span>Render 3D Relighting Shader</span>
      </button>

      {appliedNotice && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>3D Studio Light Shader rendered successfully!</span>
        </div>
      )}
    </div>
  );
};
