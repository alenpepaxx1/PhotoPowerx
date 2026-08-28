/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { ToolType, BrushMode, RetouchMode, ShapeType } from '@/types/editor';
import {
  MousePointer2,
  Crop,
  Paintbrush,
  Eraser,
  Sparkles,
  Type,
  Square,
  Pipette,
  Wand2,
  Hand,
  Search,
  ChevronRight,
  CircleDot,
  Flame,
  Sun,
  Moon,
  Sparkle,
  PenTool,
  ArrowRight,
  Heart,
  MessageSquare,
  Star,
  Maximize2
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    brushOpacity,
    setBrushOpacity,
    brushMode,
    setBrushMode,
    retouchMode,
    setRetouchMode,
    retouchRadius,
    setRetouchRadius,
    activeShape,
    setActiveShape,
    shapeFill,
    setShapeFill,
    shapeStroke,
    setShapeStroke,
    shapeStrokeWidth,
    setShapeStrokeWidth,
    addTextLayer,
    addShapeLayer,
    setActiveRightPanel,
  } = useEditor();

  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [brushDropdownOpen, setBrushDropdownOpen] = useState(false);
  const [shapeDropdownOpen, setShapeDropdownOpen] = useState(false);
  const [retouchDropdownOpen, setRetouchDropdownOpen] = useState(false);

  // Swap primary and secondary color
  const swapColors = () => {
    const temp = brushColor;
    setBrushColor(secondaryColor);
    setSecondaryColor(temp);
  };

  // Reset colors to default black & white
  const resetColors = () => {
    setBrushColor('#3b82f6');
    setSecondaryColor('#ffffff');
  };

  const tools: { id: ToolType; label: string; icon: React.ElementType; shortcut: string }[] = [
    { id: 'select', label: 'Move & Transform', icon: MousePointer2, shortcut: 'V' },
    { id: 'crop', label: 'Crop & Straighten', icon: Crop, shortcut: 'C' },
    { id: 'brush', label: 'Brush Tool', icon: Paintbrush, shortcut: 'B' },
    { id: 'eraser', label: 'Eraser Tool', icon: Eraser, shortcut: 'E' },
    { id: 'retouch', label: 'Retouch & Healing', icon: Sparkles, shortcut: 'S' },
    { id: 'text', label: 'Text / Typography', icon: Type, shortcut: 'T' },
    { id: 'shape', label: 'Shape Tool', icon: Square, shortcut: 'U' },
    { id: 'eyedropper', label: 'Eyedropper Color Picker', icon: Pipette, shortcut: 'I' },
    { id: 'hand', label: 'Hand / Pan Tool', icon: Hand, shortcut: 'H' },
    { id: 'zoom', label: 'Zoom Tool', icon: Search, shortcut: 'Z' },
  ];

  return (
    <div className="w-12 bg-[#0A0A0A] border-r border-[#222] flex flex-col items-center py-2 justify-between select-none z-20 shrink-0">
      {/* Tool Icons */}
      <div className="flex flex-col items-center gap-1 w-full px-1">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;

          return (
            <div key={t.id} className="relative group w-full flex justify-center">
              <button
                onClick={() => {
                  setActiveTool(t.id);
                  if (t.id === 'crop') setActiveRightPanel('crop');
                  if (t.id === 'text') setActiveRightPanel('text');
                  if (t.id === 'shape') setActiveRightPanel('shape');
                  if (t.id === 'retouch') setActiveRightPanel('retouch');
                }}
                className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A]'
                }`}
                title={`${t.label} (${t.shortcut})`}
              >
                <Icon className="w-4 h-4" />
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1.5 px-2 py-1 bg-[#111111] text-[#E0E0E0] text-[11px] rounded shadow-xl border border-[#333] whitespace-nowrap z-50 pointer-events-none">
                <span>{t.label}</span>
                <kbd className="px-1 py-0.2 bg-[#1A1A1A] border border-[#333] rounded font-mono text-[9px] text-[#888]">
                  {t.shortcut}
                </kbd>
              </div>
            </div>
          );
        })}
      </div>

      {/* Photoshop Color Palette Swatch (Foreground / Background) */}
      <div className="flex flex-col items-center gap-2 mb-2 pt-2 border-t border-[#222] w-full">
        <div className="relative w-8 h-8">
          {/* Background Color Swatch */}
          <div
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = secondaryColor;
              input.onchange = (e: any) => setSecondaryColor(e.target.value);
              input.click();
            }}
            className="absolute bottom-0 right-0 w-5 h-5 rounded-xs border border-[#333] cursor-pointer shadow-sm z-0 hover:scale-105 transition-transform"
            style={{ backgroundColor: secondaryColor }}
            title="Secondary Color"
          />

          {/* Foreground / Active Brush Color Swatch */}
          <div
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'color';
              input.value = brushColor;
              input.onchange = (e: any) => setBrushColor(e.target.value);
              input.click();
            }}
            className="absolute top-0 left-0 w-5 h-5 rounded-xs border border-[#444] cursor-pointer shadow-md z-10 hover:scale-105 transition-transform"
            style={{ backgroundColor: brushColor }}
            title="Primary / Brush Color (Click to change)"
          />
        </div>

        {/* Swap & Reset buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={swapColors}
            className="text-[9px] text-[#666] hover:text-[#E0E0E0] px-1 py-0.5 hover:bg-[#1A1A1A] rounded"
            title="Swap Colors (X)"
          >
            ⇄
          </button>
          <button
            onClick={resetColors}
            className="text-[9px] text-[#666] hover:text-[#E0E0E0] px-1 py-0.5 hover:bg-[#1A1A1A] rounded font-mono"
            title="Reset Colors (D)"
          >
            ■
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Context-sensitive Tool Options Bar rendered above canvas
 */
export const ToolOptionsBar: React.FC = () => {
  const {
    activeTool,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    brushOpacity,
    setBrushOpacity,
    brushMode,
    setBrushMode,
    retouchMode,
    setRetouchMode,
    retouchRadius,
    setRetouchRadius,
    activeShape,
    setActiveShape,
    shapeFill,
    setShapeFill,
    shapeStroke,
    setShapeStroke,
    shapeStrokeWidth,
    setShapeStrokeWidth,
    shapeCornerRadius,
    setShapeCornerRadius,
    addTextLayer,
    addShapeLayer,
    addDrawingLayer,
    selectedLayer,
    updateLayer,
    splitCompare,
    setSplitCompare,
    toneCurves,
    updateToneCurves,
    colorWheels,
    updateColorWheels,
    opticalVfx,
    updateOpticalVfx,
    setActiveRightPanel,
    setCanvasSize,
    canvasWidth,
    canvasHeight,
    pushHistory,
  } = useEditor();

  return (
    <div className="h-9 bg-[#0d111a] border-b border-white/5 px-4 flex items-center justify-between text-xs text-slate-400 select-none z-10 overflow-x-auto shrink-0">
      <div className="flex items-center gap-4">
        {/* Tool Label */}
        <div className="flex items-center gap-1.5 pr-3 border-r border-white/5 font-semibold text-slate-200">
          <span className="capitalize">{activeTool} Tool</span>
        </div>

        {/* Crop & Aspect Ratio Tool Options */}
        {activeTool === 'crop' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Aspect Ratio:</span>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '1:1') setCanvasSize(1080, 1080);
                  if (val === '4:5') setCanvasSize(1080, 1350);
                  if (val === '9:16') setCanvasSize(1080, 1920);
                  if (val === '16:9') setCanvasSize(1920, 1080);
                  if (val === '3:2') setCanvasSize(1800, 1200);
                  if (val === '21:9') setCanvasSize(2560, 1080);
                  if (val === '4:3') setCanvasSize(1600, 1200);
                  pushHistory(`Resized Aspect Ratio (${val})`);
                }}
                className="bg-slate-900 border border-white/10 hover:border-white/20 text-slate-200 rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:border-sky-400 font-mono"
              >
                <option value="custom">Current ({canvasWidth} × {canvasHeight})</option>
                <option value="1:1">1:1 Square (Instagram)</option>
                <option value="4:5">4:5 Portrait (IG Post)</option>
                <option value="9:16">9:16 Reel / Story / TikTok</option>
                <option value="16:9">16:9 YouTube / HD</option>
                <option value="3:2">3:2 Photo Print</option>
                <option value="21:9">21:9 Ultrawide Cinema</option>
                <option value="4:3">4:3 Standard Display</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCanvasSize(canvasHeight, canvasWidth);
                  pushHistory('Swapped Canvas Dimensions');
                }}
                className="px-2.5 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded-lg text-xs transition-colors"
              >
                ↻ Swap W/H
              </button>
            </div>
          </div>
        )}

        {/* Brush Tool Options */}
        {activeTool === 'brush' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Brush Type:</span>
              <select
                value={brushMode}
                onChange={(e) => setBrushMode(e.target.value as BrushMode)}
                className="bg-slate-900 border border-white/10 hover:border-white/20 text-slate-200 rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:border-sky-400"
              >
                <option value="round">Smooth Round</option>
                <option value="soft">Soft Airbrush</option>
                <option value="neon">Neon Glow ✨</option>
                <option value="highlighter">Highlighter</option>
                <option value="calligraphy">Calligraphy</option>
                <option value="spray">Spray / Scatter</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Size:</span>
              <input
                type="range"
                min="2"
                max="120"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24 accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
              <span className="font-mono text-slate-300 w-8">{brushSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Opacity:</span>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={brushOpacity}
                onChange={(e) => setBrushOpacity(Number(e.target.value))}
                className="w-20 accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
              <span className="font-mono text-slate-300 w-9">
                {Math.round(brushOpacity * 100)}%
              </span>
            </div>

            <button
              onClick={addDrawingLayer}
              className="px-2.5 py-0.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-lg text-xs transition-colors"
            >
              + New Paint Layer
            </button>
          </div>
        )}

        {/* Retouch Tool Options */}
        {activeTool === 'retouch' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Retouch Mode:</span>
              <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => setRetouchMode('heal')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    retouchMode === 'heal' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Spot Healing
                </button>
                <button
                  onClick={() => setRetouchMode('smooth')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    retouchMode === 'smooth' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Skin Smooth
                </button>
                <button
                  onClick={() => setRetouchMode('dodge')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    retouchMode === 'dodge' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Dodge (Lighten)
                </button>
                <button
                  onClick={() => setRetouchMode('burn')}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    retouchMode === 'burn' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Burn (Darken)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Radius:</span>
              <input
                type="range"
                min="5"
                max="100"
                value={retouchRadius}
                onChange={(e) => setRetouchRadius(Number(e.target.value))}
                className="w-24 accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
              <span className="font-mono text-slate-300 w-8">{retouchRadius}px</span>
            </div>
          </div>
        )}

        {/* Shape Tool Options */}
        {activeTool === 'shape' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Shape:</span>
              <select
                value={activeShape}
                onChange={(e) => setActiveShape(e.target.value as ShapeType)}
                className="bg-slate-900 border border-white/10 hover:border-white/20 text-slate-200 rounded-lg px-2 py-0.5 text-xs focus:outline-none focus:border-sky-400"
              >
                <option value="rectangle">Rectangle</option>
                <option value="rounded-rect">Rounded Rectangle</option>
                <option value="circle">Circle / Ellipse</option>
                <option value="triangle">Triangle</option>
                <option value="star">Star ⭐</option>
                <option value="arrow">Arrow</option>
                <option value="heart">Heart ❤️</option>
                <option value="callout">Speech Bubble</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Fill:</span>
              <input
                type="color"
                value={shapeFill}
                onChange={(e) => setShapeFill(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border border-white/15 bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Stroke:</span>
              <input
                type="color"
                value={shapeStroke}
                onChange={(e) => setShapeStroke(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border border-white/15 bg-transparent"
              />
              <input
                type="number"
                min="0"
                max="20"
                value={shapeStrokeWidth}
                onChange={(e) => setShapeStrokeWidth(Number(e.target.value))}
                className="w-12 bg-slate-900 border border-white/10 text-slate-200 rounded px-1.5 py-0.5 text-xs"
              />
              <span className="text-slate-400">px</span>
            </div>

            <button
              onClick={() => addShapeLayer(activeShape)}
              className="px-3 py-0.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              Add Shape to Canvas
            </button>
          </div>
        )}

        {/* Text Tool Options */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => addTextLayer('PhotoPower Pro')}
              className="px-3 py-0.5 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              + Add Text Box
            </button>
            <span className="text-slate-400 text-[11px]">
              Click anywhere on the canvas or use the Text Inspector to customize typography & curved text.
            </span>
          </div>
        )}

        {/* Move / Transform Tool Options */}
        {activeTool === 'select' && selectedLayer && (
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Selected: <strong className="text-slate-100">{selectedLayer.name}</strong>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Opacity:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={selectedLayer.opacity}
                onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })}
                className="w-20 accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
              <span className="font-mono text-slate-300">
                {Math.round(selectedLayer.opacity * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => updateLayer(selectedLayer.id, { scaleX: (selectedLayer.scaleX || 1) * -1 })}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded text-xs"
                title="Flip Horizontal"
              >
                Flip H
              </button>
              <button
                onClick={() => updateLayer(selectedLayer.id, { scaleY: (selectedLayer.scaleY || 1) * -1 })}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded text-xs"
                title="Flip Vertical"
              >
                Flip V
              </button>
              <button
                onClick={() => updateLayer(selectedLayer.id, { rotation: ((selectedLayer.rotation || 0) + 90) % 360 })}
                className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 rounded text-xs"
                title="Rotate 90° Clockwise"
              >
                Rotate 90°
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Global Features: Split-Screen Comparison & Quick Grade Toggles */}
      <div className="flex items-center gap-2 pl-3 border-l border-white/5">
        {/* Split Screen Wipe Toggle */}
        <button
          onClick={() => {
            const nextState = !splitCompare.enabled;
            setSplitCompare({
              ...splitCompare,
              enabled: nextState,
              active: nextState,
            });
          }}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border font-medium text-[11px] transition-all ${
            splitCompare.enabled
              ? 'bg-sky-500/20 border-sky-400/50 text-sky-300 shadow-sm'
              : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Split-Screen Wipe: Compare Raw vs Graded Output"
        >
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>Before / After Split</span>
        </button>

        {/* Quick Curves Trigger */}
        <button
          onClick={() => {
            setActiveRightPanel('curves');
          }}
          className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${
            toneCurves.enabled
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
              : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Tone Curves LUT (Click to inspect)"
        >
          Curves {toneCurves.enabled && '✓'}
        </button>

        {/* Quick Wheels Trigger */}
        <button
          onClick={() => {
            setActiveRightPanel('colorwheels');
          }}
          className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${
            colorWheels.enabled
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
              : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="3-Way Color Wheels (Click to inspect)"
        >
          Grading {colorWheels.enabled && '✓'}
        </button>

        {/* Quick Optical VFX Trigger */}
        <button
          onClick={() => {
            setActiveRightPanel('vfx');
          }}
          className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-all ${
            opticalVfx.enabled
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-300'
              : 'bg-slate-900/60 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title="Optical VFX & Flares (Click to inspect)"
        >
          VFX {opticalVfx.enabled && '✓'}
        </button>
      </div>
    </div>
  );
};
