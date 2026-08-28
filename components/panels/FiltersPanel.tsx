/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { FILTER_PRESETS } from '@/lib/filters';
import { FilterPreset } from '@/types/editor';
import { Sparkles, Check, Flame, Film, Wand2 } from 'lucide-react';

export const FiltersPanel: React.FC = () => {
  const { activeFilterId, applyFilterPreset, setIsAiModalOpen } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Cinematic', 'Vintage', 'Creative', 'B&W', 'Modern', 'Moody'];

  const filteredPresets = selectedCategory === 'All'
    ? FILTER_PRESETS
    : FILTER_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-xs select-none p-3 space-y-3 overflow-y-auto">
      {/* Header & AI Filter generator CTA */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
          <Film className="w-3.5 h-3.5 text-blue-400" />
          <span>Color Styles & LUTs</span>
        </span>

        <button
          onClick={() => setIsAiModalOpen(true)}
          className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-colors font-medium"
        >
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>AI Custom LUT</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1A1A1A] text-white border border-[#333]'
                : 'bg-[#141414] border border-[#222] text-[#888] hover:text-[#E0E0E0] hover:bg-[#1A1A1A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Presets Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredPresets.map((preset) => {
          const isActive = activeFilterId === preset.id;

          return (
            <div
              key={preset.id}
              onClick={() => applyFilterPreset(preset.id)}
              className={`p-2 rounded border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden group ${
                isActive
                  ? 'bg-[#1A1A1A] border-blue-500 shadow-md shadow-blue-500/10'
                  : 'bg-[#151515] border-[#222] hover:border-[#333] hover:bg-[#1A1A1A]'
              }`}
            >
              {/* Color Swatch Header */}
              <div
                className="h-10 w-full rounded mb-2 relative overflow-hidden shadow-inner flex items-center justify-center border border-[#333]"
                style={{
                  background: `linear-gradient(135deg, ${preset.thumbnailColor} 0%, #151515 100%)`,
                }}
              >
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-white text-blue-600 flex items-center justify-center shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
                <span className="absolute bottom-1 right-1 text-[9px] px-1 rounded bg-black/60 text-[#aaa] font-mono">
                  {preset.category}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-0.5">
                <span className="font-semibold text-[#E0E0E0] block truncate group-hover:text-blue-400 transition-colors">
                  {preset.name}
                </span>
                <p className="text-[10px] text-[#666] line-clamp-2 leading-snug">
                  {preset.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
