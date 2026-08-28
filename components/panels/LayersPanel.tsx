/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { BlendMode, Layer } from '@/types/editor';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Plus,
  Type,
  Square,
  Paintbrush,
  Image as ImageIcon,
  Video,
  Layers as LayersIcon,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Wand2,
  Sun,
  Palette,
} from 'lucide-react';

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply (Darken)' },
  { value: 'screen', label: 'Screen (Lighten)' },
  { value: 'overlay', label: 'Overlay (Contrast)' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'hard-light', label: 'Hard Light' },
  { value: 'color-dodge', label: 'Color Dodge (Glow)' },
  { value: 'color-burn', label: 'Color Burn' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'difference', label: 'Difference' },
  { value: 'exclusion', label: 'Exclusion' },
  { value: 'hue', label: 'Hue' },
  { value: 'saturation', label: 'Saturation' },
  { value: 'color', label: 'Color' },
  { value: 'luminosity', label: 'Luminosity' },
];

export const LayersPanel: React.FC = () => {
  const {
    layers,
    selectedLayerId,
    selectedLayer,
    setSelectedLayerId,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    reorderLayers,
    toggleLayerVisibility,
    toggleLayerLock,
    setLayerBlendMode,
    setLayerOpacity,
    updateLayerStyles,
    removeBackgroundAi,
    addTextLayer,
    addShapeLayer,
    addDrawingLayer,
  } = useEditor();

  const [isProcessingCutout, setIsProcessingCutout] = React.useState(false);
  const [showLayerStyles, setShowLayerStyles] = React.useState(false);

  const handleAiCutout = async () => {
    if (!selectedLayer || selectedLayer.type !== 'image') return;
    setIsProcessingCutout(true);
    await removeBackgroundAi(selectedLayer.id);
    setIsProcessingCutout(false);
  };

  const getLayerIcon = (type: Layer['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-blue-400" />;
      case 'video':
        return <Video className="w-3.5 h-3.5 text-purple-400" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-amber-400" />;
      case 'shape':
        return <Square className="w-3.5 h-3.5 text-emerald-400" />;
      case 'drawing':
        return <Paintbrush className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <LayersIcon className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full text-xs select-none bg-[#0a0d14] text-slate-200">
      {/* Blend Mode, Opacity & Layer Styles Trigger */}
      <div className="p-3 border-b border-white/5 bg-[#0d111a] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <label className="text-slate-400 text-[11px]">Blend Mode:</label>
          <select
            value={selectedLayer?.blendMode || 'source-over'}
            disabled={!selectedLayer}
            onChange={(e) => {
              if (selectedLayer) {
                setLayerBlendMode(selectedLayer.id, e.target.value as BlendMode);
              }
            }}
            className="flex-1 bg-slate-900 border border-white/10 hover:border-white/20 text-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-sky-400 disabled:opacity-30"
          >
            {BLEND_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="text-slate-400 text-[11px]">Opacity:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedLayer?.opacity ?? 1}
            disabled={!selectedLayer}
            onChange={(e) => {
              if (selectedLayer) {
                setLayerOpacity(selectedLayer.id, Number(e.target.value));
              }
            }}
            className="flex-1 accent-sky-400 h-1 bg-slate-800 rounded cursor-pointer disabled:opacity-30"
          />
          <span className="font-mono text-slate-400 w-10 text-right text-[11px]">
            {selectedLayer ? `${Math.round(selectedLayer.opacity * 100)}%` : '100%'}
          </span>
        </div>

        {/* Selected Layer Special Actions: AI Cutout & Layer Styles */}
        {selectedLayer && (
          <div className="pt-1.5 flex items-center gap-1.5 border-t border-white/5">
            {selectedLayer.type === 'image' && (
              <button
                onClick={handleAiCutout}
                disabled={isProcessingCutout}
                className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 font-medium text-[11px] transition-all disabled:opacity-50"
              >
                <Wand2 size={12} className={isProcessingCutout ? 'animate-spin' : ''} />
                <span>{isProcessingCutout ? 'Extracting...' : 'AI Cutout Mask'}</span>
              </button>
            )}

            <button
              onClick={() => setShowLayerStyles(!showLayerStyles)}
              className={`flex items-center justify-center space-x-1 py-1.5 px-2.5 rounded-lg border text-[11px] font-medium transition-all ${
                showLayerStyles
                  ? 'bg-slate-800 border-white/20 text-white'
                  : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Palette size={12} className="text-amber-400" />
              <span>Layer FX</span>
            </button>
          </div>
        )}

        {/* Layer Styles Panel Dropdown */}
        {selectedLayer && showLayerStyles && (
          <div className="p-2.5 bg-slate-950/80 rounded-xl border border-white/10 space-y-2 text-[11px] animate-fadeIn">
            {/* Drop Shadow */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-1.5 text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedLayer.styles?.dropShadow?.enabled || false}
                    onChange={(e) =>
                      updateLayerStyles(selectedLayer.id, {
                        dropShadow: {
                          enabled: e.target.checked,
                          blur: selectedLayer.styles?.dropShadow?.blur || 14,
                          offsetX: selectedLayer.styles?.dropShadow?.offsetX || 4,
                          offsetY: selectedLayer.styles?.dropShadow?.offsetY || 6,
                          color: selectedLayer.styles?.dropShadow?.color || 'rgba(0,0,0,0.75)',
                        },
                      })
                    }
                    className="accent-sky-400 rounded"
                  />
                  <span>Drop Shadow</span>
                </label>
                {selectedLayer.styles?.dropShadow?.enabled && (
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedLayer.styles.dropShadow.blur}px blur
                  </span>
                )}
              </div>

              {selectedLayer.styles?.dropShadow?.enabled && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500">Blur Radius</span>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={selectedLayer.styles.dropShadow.blur || 14}
                      onChange={(e) =>
                        updateLayerStyles(selectedLayer.id, {
                          dropShadow: {
                            ...selectedLayer.styles?.dropShadow,
                            enabled: true,
                            blur: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full h-1 bg-slate-800 accent-sky-400 rounded"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500">Offset Y</span>
                    <input
                      type="range"
                      min="-20"
                      max="30"
                      value={selectedLayer.styles.dropShadow.offsetY || 6}
                      onChange={(e) =>
                        updateLayerStyles(selectedLayer.id, {
                          dropShadow: {
                            ...selectedLayer.styles?.dropShadow,
                            enabled: true,
                            offsetY: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full h-1 bg-slate-800 accent-sky-400 rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Outer Glow */}
            <div className="space-y-1 pt-1.5 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-1.5 text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedLayer.styles?.outerGlow?.enabled || false}
                    onChange={(e) =>
                      updateLayerStyles(selectedLayer.id, {
                        outerGlow: {
                          enabled: e.target.checked,
                          blur: selectedLayer.styles?.outerGlow?.blur || 20,
                          color: selectedLayer.styles?.outerGlow?.color || '#38bdf8',
                        },
                      })
                    }
                    className="accent-sky-400 rounded"
                  />
                  <span>Neon Outer Glow</span>
                </label>
                {selectedLayer.styles?.outerGlow?.enabled && (
                  <input
                    type="color"
                    value={selectedLayer.styles.outerGlow.color || '#38bdf8'}
                    onChange={(e) =>
                      updateLayerStyles(selectedLayer.id, {
                        outerGlow: {
                          ...selectedLayer.styles?.outerGlow,
                          enabled: true,
                          color: e.target.value,
                        },
                      })
                    }
                    className="w-4 h-4 rounded cursor-pointer border-none bg-transparent"
                  />
                )}
              </div>
            </div>

            {/* Outline Stroke */}
            <div className="space-y-1 pt-1.5 border-t border-white/5">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-1.5 text-slate-300">
                  <input
                    type="checkbox"
                    checked={selectedLayer.styles?.strokeOutline?.enabled || false}
                    onChange={(e) =>
                      updateLayerStyles(selectedLayer.id, {
                        strokeOutline: {
                          enabled: e.target.checked,
                          width: selectedLayer.styles?.strokeOutline?.width || 3,
                          color: selectedLayer.styles?.strokeOutline?.color || '#ffffff',
                        },
                      })
                    }
                    className="accent-sky-400 rounded"
                  />
                  <span>Outline Border</span>
                </label>
                {selectedLayer.styles?.strokeOutline?.enabled && (
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="range"
                      min="1"
                      max="16"
                      value={selectedLayer.styles.strokeOutline.width || 3}
                      onChange={(e) =>
                        updateLayerStyles(selectedLayer.id, {
                          strokeOutline: {
                            ...selectedLayer.styles?.strokeOutline,
                            enabled: true,
                            width: Number(e.target.value),
                          },
                        })
                      }
                      className="w-12 h-1 bg-slate-800 accent-sky-400 rounded"
                    />
                    <input
                      type="color"
                      value={selectedLayer.styles.strokeOutline.color || '#ffffff'}
                      onChange={(e) =>
                        updateLayerStyles(selectedLayer.id, {
                          strokeOutline: {
                            ...selectedLayer.styles?.strokeOutline,
                            enabled: true,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-4 h-4 rounded cursor-pointer border-none bg-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layer List (Stack from Top to Bottom) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 bg-[#080808]">
        {layers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-[#555] text-center px-4">
            <LayersIcon className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-xs">No layers on canvas</p>
            <p className="text-[10px] mt-1 text-[#444]">Click below to add a text, shape or image</p>
          </div>
        ) : (
          [...layers].reverse().map((layer, reverseIndex) => {
            const actualIndex = layers.length - 1 - reverseIndex;
            const isSelected = layer.id === selectedLayerId;

            return (
              <div
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`flex items-center justify-between p-2 rounded border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1A1A1A] border-[#333] text-white shadow-sm'
                    : 'bg-[#151515] border-[#222] text-[#888] hover:bg-[#1A1A1A] hover:text-[#E0E0E0]'
                }`}
              >
                {/* Visibility Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className={`p-1 rounded hover:bg-[#222] transition-colors ${
                    layer.visible ? 'text-[#E0E0E0]' : 'text-[#444]'
                  }`}
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                {/* Layer Icon & Editable Name */}
                <div className="flex items-center gap-2 flex-1 min-w-0 px-1.5">
                  {getLayerIcon(layer.type)}
                  <input
                    type="text"
                    value={layer.name}
                    onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
                    className="bg-transparent border border-transparent hover:border-[#333] focus:border-blue-500 focus:bg-[#111111] rounded px-1 text-xs truncate focus:outline-none w-full text-[#E0E0E0]"
                  />
                </div>

                {/* Layer Quick Actions (Lock, Up, Down) */}
                <div className="flex items-center gap-0.5">
                  {/* Lock Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerLock(layer.id);
                    }}
                    className={`p-1 rounded hover:bg-[#222] ${
                      layer.locked ? 'text-amber-400' : 'text-[#555] hover:text-[#E0E0E0]'
                    }`}
                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                  >
                    {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                  </button>

                  {/* Reorder Up */}
                  <button
                    disabled={actualIndex >= layers.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderLayers(actualIndex, actualIndex + 1);
                    }}
                    className="p-1 rounded text-[#555] hover:text-[#E0E0E0] disabled:opacity-20 hover:bg-[#222]"
                    title="Bring Layer Forward"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    disabled={actualIndex <= 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderLayers(actualIndex, actualIndex - 1);
                    }}
                    className="p-1 rounded text-[#555] hover:text-[#E0E0E0] disabled:opacity-20 hover:bg-[#222]"
                    title="Send Layer Backward"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Layer Bottom Action Bar */}
      <div className="p-2.5 border-t border-[#222] bg-[#0A0A0A] flex items-center justify-between gap-1 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => addTextLayer('New Typography')}
            className="p-1.5 rounded bg-[#151515] border border-[#222] hover:border-[#333] text-[#E0E0E0] hover:bg-[#1A1A1A] transition-colors"
            title="Add Text Layer"
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => addShapeLayer('rectangle')}
            className="p-1.5 rounded bg-[#151515] border border-[#222] hover:border-[#333] text-[#E0E0E0] hover:bg-[#1A1A1A] transition-colors"
            title="Add Shape Layer"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={addDrawingLayer}
            className="p-1.5 rounded bg-[#151515] border border-[#222] hover:border-[#333] text-[#E0E0E0] hover:bg-[#1A1A1A] transition-colors"
            title="Add Paint / Drawing Layer"
          >
            <Paintbrush className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={!selectedLayer}
            onClick={() => selectedLayer && duplicateLayer(selectedLayer.id)}
            className="p-1.5 rounded bg-[#151515] border border-[#222] hover:border-[#333] text-[#E0E0E0] disabled:opacity-30 transition-colors"
            title="Duplicate Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!selectedLayer}
            onClick={() => selectedLayer && deleteLayer(selectedLayer.id)}
            className="p-1.5 rounded bg-red-950/30 border border-red-900/50 hover:bg-red-900/40 text-red-400 disabled:opacity-30 transition-colors"
            title="Delete Layer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
