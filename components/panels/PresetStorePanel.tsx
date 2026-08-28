/**
 * PhotoPower - Advanced Photo & Video Studio
 * Presets Library & Custom LUT Preset Manager
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  CustomUserPreset,
  loadUserPresetsFromStorage,
  saveUserPresetToStorage,
  deleteUserPresetFromStorage,
} from '@/lib/userPresets';
import { FILTER_PRESETS } from '@/lib/filters';
import {
  Sparkles,
  Plus,
  Bookmark,
  Trash2,
  Download,
  Upload,
  Check,
  Film,
  Sun,
  Camera,
  Layers,
  RotateCcw,
} from 'lucide-react';

export const PresetStorePanel: React.FC = () => {
  const {
    globalAdjustments,
    updateGlobalAdjustments,
    toneCurves,
    updateToneCurves,
    colorWheels,
    updateColorWheels,
    hslState,
    updateHslState,
    opticalVfx,
    updateOpticalVfx,
    resetGlobalAdjustments,
    pushHistory,
  } = useEditor();

  const [userPresets, setUserPresets] = useState<CustomUserPreset[]>(() => loadUserPresetsFromStorage());
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState('Cinematic');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'store' | 'user'>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const handleSaveCurrentPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) return;

    const updated = saveUserPresetToStorage({
      name: newPresetName.trim(),
      category: newPresetCategory,
      adjustments: globalAdjustments,
      toneCurves,
      colorWheels,
      hslState,
      opticalVfx,
    });

    setUserPresets(updated);
    setNewPresetName('');
    setIsSaving(false);
    showNotify(`Preset "${newPresetName}" saved!`);
  };

  const handleDeleteUserPreset = (id: string, name: string) => {
    const updated = deleteUserPresetFromStorage(id);
    setUserPresets(updated);
    showNotify(`Deleted preset "${name}"`);
  };

  const applyUserPreset = (preset: CustomUserPreset) => {
    updateGlobalAdjustments(preset.adjustments);
    if (preset.toneCurves) updateToneCurves(preset.toneCurves);
    if (preset.colorWheels) updateColorWheels(preset.colorWheels);
    if (preset.hslState) updateHslState(preset.hslState);
    if (preset.opticalVfx) updateOpticalVfx(preset.opticalVfx);

    pushHistory(`Applied Preset: ${preset.name}`);
    showNotify(`Applied "${preset.name}"`);
  };

  const applyBuiltInPreset = (presetId: string, name: string) => {
    const found = FILTER_PRESETS.find((p) => p.id === presetId);
    if (!found) return;

    updateGlobalAdjustments(found.adjustments);
    pushHistory(`Applied LUT: ${name}`);
    showNotify(`Applied "${name}"`);
  };

  const exportPresetJson = (preset: CustomUserPreset) => {
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PhotoPower-Preset-${preset.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importPresetJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.name && parsed.adjustments) {
          const updated = saveUserPresetToStorage({
            name: parsed.name,
            category: parsed.category || 'Imported',
            adjustments: parsed.adjustments,
            toneCurves: parsed.toneCurves,
            colorWheels: parsed.colorWheels,
            hslState: parsed.hslState,
            opticalVfx: parsed.opticalVfx,
          });
          setUserPresets(updated);
          showNotify(`Imported preset "${parsed.name}"`);
        }
      } catch (err) {
        console.error('Invalid preset JSON', err);
      }
    };
    reader.readAsText(file);
  };

  const showNotify = (msg: string) => {
    setAppliedNotification(msg);
    setTimeout(() => setAppliedNotification(null), 2500);
  };

  const categories = ['All', 'Cinematic', 'Vintage', 'Creative', 'B&W', 'Modern', 'Moody'];
  const filteredBuiltIn = selectedCategory === 'All'
    ? FILTER_PRESETS
    : FILTER_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] text-slate-200 select-none overflow-y-auto p-3 space-y-4">
      {/* Toast notification */}
      {appliedNotification && (
        <div className="p-2 bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-semibold rounded-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-sky-400 stroke-[3]" />
            <span>{appliedNotification}</span>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
              activeTab === 'store' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pro LUT Library
          </button>
          <button
            onClick={() => setActiveTab('user')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
              activeTab === 'user' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>My Presets ({userPresets.length})</span>
          </button>
        </div>

        <button
          onClick={() => {
            resetGlobalAdjustments();
            showNotify('Reset to Original Grade');
          }}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset Grade"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* TAB 1: PRO LUT LIBRARY */}
      {activeTab === 'store' && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-slate-100 text-slate-900'
                    : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Preset Cards */}
          <div className="grid grid-cols-2 gap-2">
            {filteredBuiltIn.map((p) => (
              <button
                key={p.id}
                onClick={() => applyBuiltInPreset(p.id, p.name)}
                className="group p-2.5 bg-slate-900/80 hover:bg-slate-800/80 border border-white/5 hover:border-sky-500/40 rounded-xl text-left transition-all flex flex-col justify-between space-y-2 relative overflow-hidden"
              >
                <div
                  className="w-full h-12 rounded-lg mb-1 flex items-end p-1.5 justify-end shadow-inner"
                  style={{ backgroundColor: p.thumbnailColor || '#1e293b' }}
                >
                  <span className="text-[9px] font-mono px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-slate-300">
                    {p.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-slate-200 group-hover:text-sky-300 transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{p.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MY CUSTOM PRESETS */}
      {activeTab === 'user' && (
        <div className="space-y-4">
          {/* Create Preset Trigger */}
          {!isSaving ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsSaving(true)}
                className="flex-1 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-sky-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Save Current Look as Preset</span>
              </button>

              <label className="p-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-xl cursor-pointer transition-colors flex items-center justify-center">
                <Upload className="w-4 h-4" />
                <input type="file" accept=".json" onChange={importPresetJson} className="hidden" />
              </label>
            </div>
          ) : (
            <form onSubmit={handleSaveCurrentPreset} className="p-3 bg-slate-900 border border-sky-500/40 rounded-xl space-y-3">
              <h4 className="text-xs font-semibold text-sky-300">Save Custom Color Preset</h4>
              
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="e.g., Tokyo Neon Sunset"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-white/10 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-400"
                autoFocus
              />

              <div className="flex items-center justify-between">
                <select
                  value={newPresetCategory}
                  onChange={(e) => setNewPresetCategory(e.target.value)}
                  className="px-2 py-1 bg-slate-950 border border-white/10 rounded-lg text-[11px] text-slate-300"
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                  <option value="Creative">Creative</option>
                  <option value="B&W">B&W</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsSaving(false)}
                    className="px-2.5 py-1 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* User Preset List */}
          {userPresets.length === 0 ? (
            <div className="p-6 text-center bg-slate-950/50 rounded-xl border border-dashed border-white/10 space-y-2">
              <Bookmark className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No saved user presets yet.</p>
              <p className="text-[10px] text-slate-500">
                Adjust your photo grade and click &quot;Save Current Look&quot; to create your personal LUT library.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {userPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 bg-slate-900 border border-white/5 hover:border-white/20 rounded-xl flex items-center justify-between transition-colors group"
                >
                  <button
                    onClick={() => applyUserPreset(preset)}
                    className="flex-1 text-left space-y-0.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-200 group-hover:text-sky-300">
                        {preset.name}
                      </span>
                      <span className="px-1.5 py-0.2 bg-slate-950 text-slate-400 rounded text-[9px] font-mono">
                        {preset.category}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      Saved {new Date(preset.createdAt).toLocaleDateString()}
                    </span>
                  </button>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => exportPresetJson(preset)}
                      className="p-1.5 text-slate-400 hover:text-sky-300 rounded hover:bg-slate-800"
                      title="Export Preset JSON"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteUserPreset(preset.id, preset.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                      title="Delete Preset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
