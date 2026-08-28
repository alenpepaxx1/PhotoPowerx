/**
 * PhotoPower - Advanced Photo & Video Studio
 * 3D LUT (.cube) & Custom Preset Exporter Modal
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Download,
  Film,
  FileCode,
  X,
  Check,
  Sparkles,
  Layers,
  Sliders,
} from 'lucide-react';
import { download3DLutFile, generate3DLutCube } from '@/lib/lutExporter';

interface LutExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LutExportModal: React.FC<LutExportModalProps> = ({ isOpen, onClose }) => {
  const { globalAdjustments } = useEditor();

  const [lutTitle, setLutTitle] = useState('PhotoPower_Cinematic_Grade');
  const [lutGridSize, setLutGridSize] = useState<number>(17);
  const [downloadNotice, setDownloadNotice] = useState(false);

  if (!isOpen) return null;

  const handleExportCube = () => {
    const filename = `${lutTitle.toLowerCase().replace(/\s+/g, '_')}.cube`;
    download3DLutFile(globalAdjustments, filename);
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  const handleExportJsonPreset = () => {
    const presetObj = {
      title: lutTitle,
      author: 'Alen Pepa',
      version: '2026.1',
      created: new Date().toISOString(),
      adjustments: globalAdjustments,
    };

    const jsonStr = JSON.stringify(presetObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lutTitle.toLowerCase().replace(/\s+/g, '_')}.photopower`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f141c] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">3D LUT & Preset Exporter</h3>
              <p className="text-[#888] text-[11px]">Export grading as .cube 3D LUT or .photopower Preset</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs text-slate-300">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Preset / LUT Title:</label>
            <input
              type="text"
              value={lutTitle}
              onChange={(e) => setLutTitle(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-400 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">3D LUT Matrix Grid Size:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLutGridSize(17)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  lutGridSize === 17
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs">17 × 17 × 17 Standard</div>
                <div className="text-[10px] text-slate-500">Fast, lightweight (.cube)</div>
              </button>

              <button
                onClick={() => setLutGridSize(33)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  lutGridSize === 33
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs">33 × 33 × 33 High Precision</div>
                <div className="text-[10px] text-slate-500">Maximum color fidelity</div>
              </button>
            </div>
          </div>

          {/* Compatibility Notice */}
          <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-1 text-[11px] text-slate-400">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Industry Software Compatibility</span>
            </div>
            <p>
              Exported .cube 3D LUT files can be loaded directly into DaVinci Resolve, Adobe Premiere Pro, Final Cut Pro X, Adobe Photoshop, and OBS Studio.
            </p>
          </div>

          {downloadNotice && (
            <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>3D LUT file successfully exported to downloads!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <button
            onClick={handleExportJsonPreset}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-colors border border-white/10"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export Preset (.photopower)</span>
          </button>

          <button
            onClick={handleExportCube}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download .CUBE 3D LUT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
