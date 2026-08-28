/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Sparkles,
  X,
  Layers,
  Sliders,
  Film,
  Type,
  Video,
  Keyboard,
  ShieldCheck,
  Heart,
  Award
} from 'lucide-react';

export const AboutModal: React.FC = () => {
  const { isAboutModalOpen, setIsAboutModalOpen } = useEditor();

  if (!isAboutModalOpen) return null;

  const shortcuts = [
    { key: 'V', desc: 'Select / Move & Transform Layer' },
    { key: 'B', desc: 'Brush Paint Tool' },
    { key: 'E', desc: 'Eraser Tool' },
    { key: 'S', desc: 'Retouch / Spot Healing Brush' },
    { key: 'T', desc: 'Text & Typography Tool' },
    { key: 'U', desc: 'Vector Shape Tool' },
    { key: 'I', desc: 'Eyedropper Color Picker' },
    { key: 'H / Space', desc: 'Hand Tool (Pan Canvas)' },
    { key: 'Z', desc: 'Zoom In / Out' },
    { key: 'Ctrl + Z', desc: 'Undo' },
    { key: 'Ctrl + Y', desc: 'Redo' },
    { key: 'Ctrl + E', desc: 'Export Media' },
    { key: 'X', desc: 'Swap Primary / Secondary Colors' },
    { key: 'D', desc: 'Reset Colors to Default' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#101010] border border-[#222] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#222] bg-[#0D0D0D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-black text-white text-xl tracking-tighter">P</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-[#E0E0E0]">PhotoPower Studio</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold border border-blue-500/30">
                  v2.5 Pro
                </span>
              </div>
              <p className="text-xs text-[#888]">
                Advanced Photo & Video Editor created by <strong className="text-[#E0E0E0]">Alen Pepa</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs bg-[#101010]">
          {/* Author Badge & Copyright Statement */}
          <div className="p-4 rounded-lg bg-[#151515] border border-[#333] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#E0E0E0] text-sm flex items-center gap-1.5">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Official Copyright & Author Statement</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                Alen Pepa
              </span>
            </div>
            <p className="text-[#aaa] leading-relaxed text-xs">
              <strong>PhotoPower</strong> is an advanced, modern photo and video creative studio engineered with Photoshop-grade precision. All rights, software architecture, designs, and codebases are authored by <strong>Alen Pepa</strong>.
            </p>
            <div className="text-[11px] text-blue-300 font-mono pt-1 border-t border-[#222]">
              Copyright © 2026 Alen Pepa. All rights reserved.
            </div>
          </div>

          {/* Core Feature Highlights */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-[#888] uppercase tracking-wider text-[11px]">
              Studio Capabilities
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-[#151515] rounded border border-[#222] space-y-1">
                <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Layer Compositions</span>
                </span>
                <p className="text-[#888] text-[11px] leading-snug">
                  16 blend modes, opacity controls, transformations, drag-and-drop stacking.
                </p>
              </div>

              <div className="p-2.5 bg-[#151515] rounded border border-[#222] space-y-1">
                <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Color Grading & Scopes</span>
                </span>
                <p className="text-[#888] text-[11px] leading-snug">
                  Exposure, temperature, highlights, shadows, sharpness, dynamic RGB histogram.
                </p>
              </div>

              <div className="p-2.5 bg-[#151515] rounded border border-[#222] space-y-1">
                <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Retouch & Healing</span>
                </span>
                <p className="text-[#888] text-[11px] leading-snug">
                  Spot blemish healing, skin smoothing, dodge and burn brushes.
                </p>
              </div>

              <div className="p-2.5 bg-[#151515] rounded border border-[#222] space-y-1">
                <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>Video Suite</span>
                </span>
                <p className="text-[#888] text-[11px] leading-snug">
                  Frame scrubber, playback speeds, in/out trim points, full WebM video recording.
                </p>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-[#888] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-blue-400" />
              <span>Photoshop Keyboard Shortcuts</span>
            </h3>

            <div className="grid grid-cols-2 gap-1.5 bg-[#151515] p-3 rounded border border-[#222]">
              {shortcuts.map((sc, i) => (
                <div key={i} className="flex items-center justify-between text-[11px] pr-2">
                  <span className="text-[#888]">{sc.desc}</span>
                  <kbd className="px-1.5 py-0.5 bg-[#0D0D0D] border border-[#333] rounded font-mono text-[10px] text-[#aaa]">
                    {sc.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222] bg-[#0D0D0D] flex items-center justify-between">
          <div className="text-[11px] text-[#666] flex items-center gap-1">
            <span>Authored by</span>
            <strong className="text-[#E0E0E0]">Alen Pepa</strong>
          </div>

          <button
            onClick={() => setIsAboutModalOpen(false)}
            className="px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
