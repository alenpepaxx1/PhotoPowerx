/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { TextProperties } from '@/types/editor';
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Sparkles,
  Layers,
  CircleDot,
  Plus
} from 'lucide-react';

const FONTS = [
  // Modern Sans-Serif
  { name: 'Inter (Modern Tech)', value: 'Inter, sans-serif', cat: 'Sans' },
  { name: 'Poppins (Geometric Clean)', value: 'Poppins, sans-serif', cat: 'Sans' },
  { name: 'Montserrat (Bold UI)', value: 'Montserrat, sans-serif', cat: 'Sans' },
  { name: 'Roboto (Google Standard)', value: 'Roboto, sans-serif', cat: 'Sans' },
  { name: 'Raleway (Elegant Thin)', value: 'Raleway, sans-serif', cat: 'Sans' },
  { name: 'Space Grotesk (Tech Display)', value: 'Space Grotesk, sans-serif', cat: 'Sans' },
  { name: 'Syne (Avant-Garde)', value: 'Syne, sans-serif', cat: 'Sans' },

  // Editorial & High Fashion Serif
  { name: 'Playfair Display (Luxury Serif)', value: 'Playfair Display, serif', cat: 'Serif' },
  { name: 'Bodoni Moda (Vogue Editorial)', value: 'Bodoni Moda, serif', cat: 'Serif' },
  { name: 'Cinzel (Roman Imperial)', value: 'Cinzel, serif', cat: 'Serif' },
  { name: 'Lora (Classic Book)', value: 'Lora, serif', cat: 'Serif' },
  { name: 'Cormorant Garamond (Graceful)', value: 'Cormorant Garamond, serif', cat: 'Serif' },
  { name: 'Georgia (Editorial Classic)', value: 'Georgia, serif', cat: 'Serif' },

  // Poster & Impact Display
  { name: 'Oswald (Condensed Impact)', value: 'Oswald, sans-serif', cat: 'Display' },
  { name: 'Bebas Neue (Poster Tall)', value: 'Bebas Neue, sans-serif', cat: 'Display' },
  { name: 'Anton (Ultra Heavy)', value: 'Anton, sans-serif', cat: 'Display' },
  { name: 'Abril Fatface (Vogue Heavy)', value: 'Abril Fatface, serif', cat: 'Display' },
  { name: 'Righteous (80s Synthwave)', value: 'Righteous, cursive', cat: 'Display' },
  { name: 'Orbitron (Sci-Fi Cyber)', value: 'Orbitron, sans-serif', cat: 'Display' },

  // Script & Calligraphy
  { name: 'Pacifico (Ocean Script)', value: 'Pacifico, cursive', cat: 'Script' },
  { name: 'Dancing Script (Calligraphy)', value: 'Dancing Script, cursive', cat: 'Script' },
  { name: 'Satisfy (Flowing Signature)', value: 'Satisfy, cursive', cat: 'Script' },
  { name: 'Caveat (Marker Note)', value: 'Caveat, cursive', cat: 'Script' },

  // Monospace & Arcade / Gothic
  { name: 'Fira Code (Developer Mono)', value: 'Fira Code, monospace', cat: 'Mono' },
  { name: 'Press Start 2P (8-Bit Arcade)', value: '"Press Start 2P", monospace', cat: 'Arcade' },
  { name: 'UnifrakturMaguntia (Gothic Blackletter)', value: 'UnifrakturMaguntia, serif', cat: 'Gothic' },
];

export const TextInspector: React.FC = () => {
  const {
    selectedLayer,
    updateLayer,
    addTextLayer,
    videoState,
    pushHistory,
  } = useEditor();

  const isTextLayer = selectedLayer && selectedLayer.type === 'text' && selectedLayer.textProps;
  const props = selectedLayer?.textProps;

  const handleUpdate = (partial: Partial<TextProperties>) => {
    if (!selectedLayer || !props) return;
    updateLayer(selectedLayer.id, {
      textProps: { ...props, ...partial },
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-xs select-none p-3 space-y-4 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-blue-400" />
          <span>Typography Inspector</span>
        </span>

        <button
          onClick={() => addTextLayer('New Headline')}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors font-medium"
        >
          <Plus className="w-3 h-3" />
          <span>Add Text</span>
        </button>
      </div>

      {!isTextLayer || !props ? (
        <div className="flex flex-col items-center justify-center h-48 text-[#555] text-center px-4">
          <Type className="w-8 h-8 mb-2 opacity-30" />
          <p>No text layer selected</p>
          <button
            onClick={() => addTextLayer('PhotoPower')}
            className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-md shadow-blue-900/20 transition-all"
          >
            Create Text Layer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1-Click Studio Typography Style Presets */}
          <div className="space-y-1.5 p-2.5 bg-[#151515] rounded border border-[#222]">
            <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio Typography Styles:</span>
            </span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() =>
                  handleUpdate({
                    fontFamily: 'Orbitron, sans-serif',
                    fillColor: '#00f0ff',
                    strokeColor: '#ff007f',
                    strokeWidth: 2,
                    textTransform: 'uppercase',
                    fontSize: 48,
                    shadowBlur: 15,
                    shadowColor: '#00f0ff',
                  })
                }
                className="p-1.5 bg-[#111] hover:bg-cyan-950/40 border border-cyan-500/30 rounded text-[10px] text-cyan-300 font-mono text-left transition-all truncate"
              >
                ⚡ Cyber Neon
              </button>
              <button
                onClick={() =>
                  handleUpdate({
                    fontFamily: 'Bodoni Moda, serif',
                    fillColor: '#ffffff',
                    strokeWidth: 0,
                    textTransform: 'uppercase',
                    fontSize: 52,
                    fontWeight: '300',
                    letterSpacing: 8,
                  })
                }
                className="p-1.5 bg-[#111] hover:bg-slate-800 border border-white/20 rounded text-[10px] text-slate-100 font-serif text-left transition-all truncate"
              >
                👑 Vogue Editorial
              </button>
              <button
                onClick={() =>
                  handleUpdate({
                    fontFamily: 'Bebas Neue, sans-serif',
                    fillColor: '#facc15',
                    strokeColor: '#000000',
                    strokeWidth: 4,
                    textTransform: 'uppercase',
                    fontSize: 64,
                  })
                }
                className="p-1.5 bg-[#111] hover:bg-amber-950/40 border border-yellow-500/30 rounded text-[10px] text-yellow-400 font-sans text-left transition-all truncate"
              >
                🔥 Poster Impact
              </button>
              <button
                onClick={() =>
                  handleUpdate({
                    fontFamily: '"Press Start 2P", monospace',
                    fillColor: '#ef4444',
                    strokeColor: '#ffffff',
                    strokeWidth: 1,
                    fontSize: 28,
                  })
                }
                className="p-1.5 bg-[#111] hover:bg-red-950/40 border border-red-500/30 rounded text-[9px] text-red-400 font-mono text-left transition-all truncate"
              >
                👾 8-Bit Arcade
              </button>
            </div>
          </div>

          {/* Text String Input */}
          <div className="space-y-1.5">
            <label className="text-[#666] text-[11px] font-medium">Text Content:</label>
            <textarea
              rows={2}
              value={props.text}
              onChange={(e) => handleUpdate({ text: e.target.value })}
              className="w-full bg-[#151515] border border-[#222] text-[#E0E0E0] rounded p-2 text-xs focus:outline-none focus:border-blue-500 resize-none font-medium"
              placeholder="Enter text..."
            />
          </div>

          {/* Font Family & Weight */}
          <div className="space-y-2 p-2.5 bg-[#151515] rounded border border-[#222]">
            <div className="space-y-1">
              <label className="text-[#666] text-[11px]">Font Family:</label>
              <select
                value={props.fontFamily}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full bg-[#111111] border border-[#222] hover:border-[#333] text-[#E0E0E0] rounded px-2 py-1 text-xs focus:outline-none"
              >
                {FONTS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size & Weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[#666] text-[11px]">Size ({props.fontSize}px):</label>
                <input
                  type="range"
                  min="12"
                  max="160"
                  value={props.fontSize}
                  onChange={(e) => handleUpdate({ fontSize: Number(e.target.value) })}
                  className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#666] text-[11px]">Weight:</label>
                <select
                  value={props.fontWeight}
                  onChange={(e) => handleUpdate({ fontWeight: e.target.value })}
                  className="w-full bg-[#111111] border border-[#222] hover:border-[#333] text-[#E0E0E0] rounded px-2 py-1 text-xs focus:outline-none"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Regular (400)</option>
                  <option value="600">Semi-Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            {/* Alignment & Style Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center bg-[#111111] p-0.5 rounded border border-[#222]">
                <button
                  onClick={() => handleUpdate({ textAlign: 'left' })}
                  className={`p-1 rounded ${props.textAlign === 'left' ? 'bg-[#1A1A1A] text-white' : 'text-[#666] hover:text-[#888]'}`}
                >
                  <AlignLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleUpdate({ textAlign: 'center' })}
                  className={`p-1 rounded ${props.textAlign === 'center' ? 'bg-[#1A1A1A] text-white' : 'text-[#666] hover:text-[#888]'}`}
                >
                  <AlignCenter className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleUpdate({ textAlign: 'right' })}
                  className={`p-1 rounded ${props.textAlign === 'right' ? 'bg-[#1A1A1A] text-white' : 'text-[#666] hover:text-[#888]'}`}
                >
                  <AlignRight className="w-3 h-3" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleUpdate({ fontStyle: props.fontStyle === 'italic' ? 'normal' : 'italic' })}
                  className={`px-2 py-1 rounded border text-[11px] ${
                    props.fontStyle === 'italic'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-[#111111] border-[#222] text-[#888] hover:text-[#E0E0E0]'
                  }`}
                >
                  <Italic className="w-3 h-3" />
                </button>
                <button
                  onClick={() =>
                    handleUpdate({
                      textTransform: props.textTransform === 'uppercase' ? 'none' : 'uppercase',
                    })
                  }
                  className={`px-2 py-1 rounded border text-[11px] font-bold ${
                    props.textTransform === 'uppercase'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-[#111111] border-[#222] text-[#888] hover:text-[#E0E0E0]'
                  }`}
                >
                  AA
                </button>
              </div>
            </div>
          </div>

          {/* Color & Stroke / Outline */}
          <div className="space-y-3 p-2.5 bg-[#151515] rounded border border-[#222]">
            <span className="text-[11px] font-semibold text-[#E0E0E0]">Color & Stroke</span>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[#666] text-[11px]">Fill Color:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={props.fillColor}
                    onChange={(e) => handleUpdate({ fillColor: e.target.value })}
                    className="w-6 h-6 rounded border border-[#333] bg-transparent cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-[#aaa]">{props.fillColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#666] text-[11px]">Stroke / Outline:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={props.strokeColor}
                    onChange={(e) => handleUpdate({ strokeColor: e.target.value })}
                    className="w-6 h-6 rounded border border-[#333] bg-transparent cursor-pointer"
                  />
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={props.strokeWidth}
                    onChange={(e) => handleUpdate({ strokeWidth: Number(e.target.value) })}
                    className="w-12 bg-[#111111] border border-[#222] hover:border-[#333] text-[#E0E0E0] rounded px-1.5 py-0.5 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Curved Text / Arc Angle */}
          <div className="space-y-2 p-2.5 bg-[#151515] rounded border border-[#222]">
            <div className="flex justify-between text-[#666] text-[11px]">
              <span>Arc / Curved Text Angle:</span>
              <span className="font-mono text-[#aaa]">{props.arcAngle}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={props.arcAngle}
              onChange={(e) => handleUpdate({ arcAngle: Number(e.target.value) })}
              className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
            />
          </div>

          {/* Background Capsule / Pill */}
          <div className="space-y-2 p-2.5 bg-[#151515] rounded border border-[#222]">
            <div className="flex items-center justify-between">
              <label className="text-[#E0E0E0] text-[11px] font-medium">Background Pill:</label>
              <button
                onClick={() => handleUpdate({ backgroundPill: !props.backgroundPill })}
                className={`w-8 h-4 rounded-full transition-colors relative ${
                  props.backgroundPill ? 'bg-blue-600' : 'bg-[#222]'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                    props.backgroundPill ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {props.backgroundPill && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="color"
                  value={props.backgroundColor}
                  onChange={(e) => handleUpdate({ backgroundColor: e.target.value })}
                  className="w-6 h-6 rounded border border-[#333] bg-transparent cursor-pointer"
                />
                <input
                  type="range"
                  min="8"
                  max="48"
                  value={props.backgroundPadding}
                  onChange={(e) => handleUpdate({ backgroundPadding: Number(e.target.value) })}
                  className="flex-1 accent-blue-500 h-1 bg-[#222] rounded"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
