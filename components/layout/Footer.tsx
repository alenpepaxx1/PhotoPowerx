/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Layers,
  Sparkles,
  Eye,
  Sliders,
  Maximize2,
  HardDrive,
  Heart
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    canvasWidth,
    canvasHeight,
    zoom,
    cursorPos,
    hoveredColor,
    layers,
    activeTool,
    mediaMode,
    setIsAboutModalOpen,
  } = useEditor();

  return (
    <footer className="h-7 bg-[#0A0A0A] border-t border-[#222] px-3 flex items-center justify-between text-[11px] text-[#666] select-none z-30">
      {/* Left: Author & Copyright Notice */}
      <div className="flex items-center gap-3">
        <div
          onClick={() => setIsAboutModalOpen(true)}
          className="flex items-center gap-1.5 cursor-pointer text-[#888] hover:text-[#E0E0E0] transition-colors"
          title="PhotoPower by Alen Pepa"
        >
          <span className="font-semibold text-blue-400">PhotoPower</span>
          <span>© 2026</span>
          <span className="text-[#E0E0E0] font-medium">Alen Pepa.</span>
          <span className="text-[#666]">All rights reserved.</span>
        </div>

        <span className="text-[#333]">|</span>

        <span className="text-[10px] text-[#666] flex items-center gap-1">
          <span>Created with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
          <span>by <strong className="text-[#E0E0E0] font-medium">Alen Pepa</strong></span>
        </span>
      </div>

      {/* Right: Technical Inspector (Dimensions, Coordinates, Zoom, Eyedropper, Layer Count) */}
      <div className="flex items-center gap-4 text-[11px]">
        {/* Active Tool */}
        <div className="flex items-center gap-1 text-[#666]">
          <span>Tool:</span>
          <span className="font-mono text-[#E0E0E0] uppercase text-[10px] bg-[#151515] border border-[#222] px-1.5 py-0.5 rounded">
            {activeTool}
          </span>
        </div>

        {/* Color Inspector */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-full border border-[#333] shadow-sm"
            style={{ backgroundColor: hoveredColor }}
          />
          <span className="font-mono text-[10px] text-[#888]">
            {hoveredColor.toUpperCase()}
          </span>
        </div>

        {/* Coordinates */}
        <div className="flex items-center gap-1 font-mono text-[#666]">
          <span>X: <span className="text-[#888]">{Math.round(cursorPos.x)}</span></span>
          <span>Y: <span className="text-[#888]">{Math.round(cursorPos.y)}</span></span>
        </div>

        {/* Canvas Size */}
        <div className="flex items-center gap-1 text-[#666]">
          <Maximize2 className="w-3 h-3 text-[#666]" />
          <span className="font-mono text-[#888]">
            {canvasWidth} × {canvasHeight}px
          </span>
        </div>

        {/* Layer Count */}
        <div className="flex items-center gap-1 text-[#666]">
          <Layers className="w-3 h-3 text-[#666]" />
          <span className="text-[#888]">
            {layers.length} {layers.length === 1 ? 'Layer' : 'Layers'}
          </span>
        </div>

        {/* Mode & Zoom */}
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.2 rounded bg-[#151515] border border-[#222] text-[10px] text-blue-400 font-medium">
            {mediaMode.toUpperCase()}
          </span>
          <span className="font-mono text-[#888] font-medium">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      </div>
    </footer>
  );
};
