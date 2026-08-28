/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Stamp, Shield, Layers, AlignLeft, Check } from 'lucide-react';

export const WatermarkPanel: React.FC = () => {
  const { addTextLayer, canvasWidth, canvasHeight, pushHistory } = useEditor();

  const [stampText, setStampText] = useState('© PhotoPower • Alen Pepa');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState(24);
  const [stampColor, setStampColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(0.75);
  const [position, setPosition] = useState<'br' | 'bl' | 'tr' | 'tl' | 'center'>('br');
  const [addedNotice, setAddedNotice] = useState(false);

  const presets = [
    '© 2026 Alen Pepa. All rights reserved.',
    'PRO STUDIO • PROOF ONLY',
    'CONFIDENTIAL & PROPRIETARY',
    'SHOT ON HIGH RES • PHOTOPOWER',
    'DO NOT COPY / REPRODUCE',
  ];

  const [patternTile, setPatternTile] = useState(false);

  const fontsList = [
    'Inter, sans-serif',
    'Playfair Display, serif',
    'Montserrat, sans-serif',
    'Oswald, sans-serif',
    'Bodoni Moda, serif',
    'Cinzel, serif',
    'Orbitron, sans-serif',
    'Fira Code, monospace',
  ];

  const handleApplyWatermark = () => {
    if (patternTile) {
      // Create repeating diagonal security pattern
      const rows = 4;
      const cols = 3;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = Math.round((canvasWidth / cols) * c + 40);
          const posY = Math.round((canvasHeight / rows) * r + 50);
          addTextLayer(stampText, {
            fillColor: stampColor,
            opacity: opacity * 0.4,
            x: posX,
            y: posY,
            fontSize: Math.round(fontSize * 0.8),
            fontFamily,
          });
        }
      }
      pushHistory('Applied Tiled Security Watermark Pattern');
    } else {
      let posX = canvasWidth - 300;
      let posY = canvasHeight - 70;

      if (position === 'tl') {
        posX = 30;
        posY = 30;
      } else if (position === 'tr') {
        posX = canvasWidth - 310;
        posY = 30;
      } else if (position === 'bl') {
        posX = 30;
        posY = canvasHeight - 70;
      } else if (position === 'center') {
        posX = Math.max(0, Math.round(canvasWidth / 2 - 150));
        posY = Math.max(0, Math.round(canvasHeight / 2 - 35));
      }

      addTextLayer(stampText, {
        fillColor: stampColor,
        opacity,
        x: posX,
        y: posY,
        fontSize,
        fontFamily,
      });
      pushHistory('Added Watermark Stamp');
    }

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Stamp className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-sm">Watermark & Brand Stamp</h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Pro Protection</span>
      </div>

      <p className="text-[#888] text-[11px] leading-relaxed">
        Stamp your photos with custom copyright text, brand logos, or proof marks across grid alignment anchors.
      </p>

      {/* Preset Stamps */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-300">Quick Watermark Presets:</label>
        <div className="space-y-1">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setStampText(preset)}
              className="w-full text-left p-1.5 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded text-[11px] font-mono text-slate-300 truncate transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Watermark Text */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[11px] font-semibold text-slate-300">Watermark Text:</label>
        <input
          type="text"
          value={stampText}
          onChange={(e) => setStampText(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 hover:border-white/20 px-2.5 py-1.5 rounded-lg text-slate-100 focus:outline-none focus:border-sky-400 font-mono text-xs"
        />
      </div>

      {/* Security Pattern Toggle */}
      <div className="p-2.5 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-200 text-xs block">Full-Screen Security Grid Tile</span>
          <span className="text-[10px] text-slate-400">Tile watermark across image for anti-theft</span>
        </div>
        <button
          onClick={() => setPatternTile(!patternTile)}
          className={`w-9 h-5 rounded-full transition-colors relative ${patternTile ? 'bg-sky-500' : 'bg-slate-800'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${patternTile ? 'right-0.5' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Font Family Selector */}
      <div className="space-y-1">
        <label className="text-[11px] font-semibold text-slate-300">Typography Font:</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="w-full bg-slate-900 border border-white/10 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-sky-400"
        >
          {fontsList.map((f) => (
            <option key={f} value={f}>
              {f.split(',')[0]}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-slate-300">Grid Anchor Position:</label>
        <div className="grid grid-cols-3 gap-1.5 w-36 mx-auto bg-slate-950 p-2 rounded-xl border border-white/10">
          {[
            { id: 'tl', label: 'TL' },
            { id: 'tc', label: 'TC', disabled: true },
            { id: 'tr', label: 'TR' },
            { id: 'cl', label: 'CL', disabled: true },
            { id: 'center', label: 'MID' },
            { id: 'cr', label: 'CR', disabled: true },
            { id: 'bl', label: 'BL' },
            { id: 'bc', label: 'BC', disabled: true },
            { id: 'br', label: 'BR' },
          ].map((item) => (
            <button
              key={item.id}
              disabled={item.disabled}
              onClick={() => setPosition(item.id as any)}
              className={`h-7 rounded text-[10px] font-mono font-bold transition-all ${
                position === item.id
                  ? 'bg-sky-500 text-white shadow'
                  : item.disabled
                  ? 'opacity-20 cursor-not-allowed bg-slate-900 text-slate-600'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color, Opacity & Font Size Controls */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400">Stamp Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={stampColor}
              onChange={(e) => setStampColor(e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-white/10 bg-transparent"
            />
            <span className="font-mono text-[11px] text-slate-300">{stampColor}</span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Opacity:</span>
            <span className="font-mono text-sky-400">{Math.round(opacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Font Size:</span>
          <span className="font-mono text-sky-400">{fontSize}px</span>
        </div>
        <input
          type="range"
          min="14"
          max="72"
          step="2"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
        />
      </div>

      {/* Apply Watermark Button */}
      <button
        onClick={handleApplyWatermark}
        className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
      >
        <Stamp className="w-4 h-4" />
        <span>Add Stamp Layer to Project</span>
      </button>

      {addedNotice && (
        <div className="p-2.5 bg-emerald-950/50 border border-emerald-500/40 rounded-lg text-emerald-300 text-[11px] flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>Watermark stamp added as lockable text layer!</span>
        </div>
      )}
    </div>
  );
};
