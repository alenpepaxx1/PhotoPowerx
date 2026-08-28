/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { useEditor } from '@/context/EditorContext';
import { SAMPLE_MEDIA } from '@/lib/sampleMedia';
import {
  X,
  Image as ImageIcon,
  Video,
  Upload,
  Sparkles,
  Check
} from 'lucide-react';

export const SamplePickerModal: React.FC = () => {
  const {
    isSamplePickerOpen,
    setIsSamplePickerOpen,
    loadSampleMedia,
    loadUserFile,
  } = useEditor();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSamplePickerOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadUserFile(file);
      setIsSamplePickerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="w-full max-w-2xl bg-[#101010] border border-[#222] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#222] bg-[#0D0D0D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#E0E0E0]">Media Library & Samples</h3>
              <p className="text-xs text-[#888]">Select professional stock assets or upload your own files</p>
            </div>
          </div>

          <button
            onClick={() => setIsSamplePickerOpen(false)}
            className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs bg-[#101010]">
          {/* Upload Custom File Banner */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-lg border border-dashed border-[#333] hover:border-blue-500 bg-[#151515] hover:bg-[#1A1A1A] cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] group-hover:bg-blue-600/20 text-[#888] group-hover:text-blue-400 flex items-center justify-center transition-colors border border-[#222]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-[#E0E0E0] text-xs block">
                  Upload Any Photo or Video from Your Device
                </span>
                <span className="text-[#888] text-[11px]">
                  Supports JPG, PNG, WEBP, GIF, MP4, WebM, MOV files
                </span>
              </div>
            </div>

            <button className="px-3.5 py-1.5 bg-blue-600 group-hover:bg-blue-500 text-white rounded font-medium transition-colors">
              Browse File...
            </button>
          </div>

          {/* Sample Presets Grid */}
          <div className="space-y-2">
            <span className="font-semibold text-[#888] uppercase tracking-wider text-[11px]">
              Curated Stock Presets
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {SAMPLE_MEDIA.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    loadSampleMedia(item);
                    setIsSamplePickerOpen(false);
                  }}
                  className="rounded-lg border border-[#222] hover:border-blue-500 bg-[#151515] hover:bg-[#1A1A1A] overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] shadow-sm flex flex-col"
                >
                  {/* Thumbnail */}
                  <div className="h-28 w-full bg-[#080808] relative overflow-hidden">
                    <Image
                      src={item.thumbnailUrl || item.mediaUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white flex items-center gap-1 border border-white/10">
                        {item.type === 'video' ? <Video className="w-3 h-3 text-purple-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                        <span className="capitalize">{item.type}</span>
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2.5 space-y-0.5">
                    <span className="font-semibold text-[#E0E0E0] block truncate group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-[#666] font-mono">
                      {item.width} × {item.height}px
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222] bg-[#0D0D0D] flex items-center justify-between">
          <span className="text-[11px] text-[#666]">
            PhotoPower Studio • Created by <strong className="text-[#E0E0E0]">Alen Pepa</strong>
          </span>
          <button
            onClick={() => setIsSamplePickerOpen(false)}
            className="px-4 py-1.5 bg-[#151515] hover:bg-[#1A1A1A] border border-[#222] text-[#888] hover:text-[#E0E0E0] rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
