/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Layers,
  Upload,
  Download,
  Check,
  X,
  Play,
  Loader2,
  Stamp,
  Sliders,
  Sparkles,
  Maximize2,
  FileImage,
} from 'lucide-react';
import { applyFilterToCanvas } from '@/lib/filters';
import { applySmartSuperResolutionUpscale } from '@/lib/computerVision';

interface BatchFileItem {
  id: string;
  file: File;
  name: string;
  previewUrl: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  processedUrl?: string;
}

export const BatchProcessingModal: React.FC = () => {
  const { isBatchModalOpen, setIsBatchModalOpen, globalAdjustments, activeFilterId } = useEditor();
  const [files, setFiles] = useState<BatchFileItem[]>([]);
  const [applyGrade, setApplyGrade] = useState(true);
  const [applyWatermark, setApplyWatermark] = useState(false);
  const [watermarkText, setWatermarkText] = useState('© 2026 PhotoPower • Alen Pepa');
  const [applyUpscale, setApplyUpscale] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isBatchModalOpen) return null;

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const newItems: BatchFileItem[] = selectedFiles.map((f, idx) => ({
      id: `${Date.now()}-${idx}`,
      file: f,
      name: f.name,
      previewUrl: URL.createObjectURL(f),
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...newItems]);
    if (e.target) e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const runBatchProcess = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    for (let i = 0; i < files.length; i++) {
      const item = files[i];
      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'processing' } : f))
      );

      try {
        // Load image into HTMLImageElement
        const img = new Image();
        img.src = item.previewUrl;
        await new Promise((resolve) => (img.onload = resolve));

        // Create offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0);

          // 1. Apply active filter / adjustments if enabled
          if (applyGrade) {
            applyFilterToCanvas(canvas, activeFilterId, globalAdjustments);
          }

          // 2. Apply watermark stamp if enabled
          if (applyWatermark && watermarkText) {
            ctx.save();
            ctx.font = 'bold 24px Inter, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 8;
            ctx.fillText(watermarkText, canvas.width - 320, canvas.height - 40);
            ctx.restore();
          }

          let finalDataUrl = canvas.toDataURL('image/png');

          // 3. Apply 2x Super Resolution Upscale if enabled
          if (applyUpscale) {
            finalDataUrl = applySmartSuperResolutionUpscale(canvas, 2);
          }

          setFiles((prev) =>
            prev.map((f) =>
              f.id === item.id ? { ...f, status: 'done', processedUrl: finalDataUrl } : f
            )
          );
        }
      } catch (err) {
        console.error(err);
        setFiles((prev) =>
          prev.map((f) => (f.id === item.id ? { ...f, status: 'error' } : f))
        );
      }

      // Small delay for smooth UI feedback
      await new Promise((res) => setTimeout(res, 100));
    }

    setIsProcessing(false);
  };

  const downloadAllProcessed = () => {
    files.forEach((item, idx) => {
      if (item.processedUrl) {
        const a = document.createElement('a');
        a.href = item.processedUrl;
        a.download = `photopower_batch_${idx + 1}_${item.name}`;
        a.click();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f141c] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Batch Processing Studio</h3>
              <p className="text-[#888] text-[11px]">Apply color grading, watermarks & HD upscaling to multiple images</p>
            </div>
          </div>
          <button
            onClick={() => setIsBatchModalOpen(false)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Options Matrix */}
          <div className="grid grid-cols-3 gap-3">
            {/* Option 1: Apply Grade */}
            <div
              onClick={() => setApplyGrade(!applyGrade)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                applyGrade
                  ? 'bg-sky-500/15 border-sky-500/50 text-sky-300'
                  : 'bg-slate-900 border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-xs mb-1">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Color Grade & LUT</span>
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${applyGrade ? 'bg-sky-500 border-sky-400 text-white' : 'border-white/20'}`}>
                  {applyGrade && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-[10px] text-[#aaa]">Apply active adjustments & filter presets</p>
            </div>

            {/* Option 2: Apply Watermark */}
            <div
              onClick={() => setApplyWatermark(!applyWatermark)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                applyWatermark
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                  : 'bg-slate-900 border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-xs mb-1">
                <span className="flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5" />
                  <span>Watermark Stamp</span>
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${applyWatermark ? 'bg-amber-500 border-amber-400 text-white' : 'border-white/20'}`}>
                  {applyWatermark && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-[10px] text-[#aaa]">Stamp copyright text on bottom corner</p>
            </div>

            {/* Option 3: Apply 2x Upscale */}
            <div
              onClick={() => setApplyUpscale(!applyUpscale)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                applyUpscale
                  ? 'bg-purple-500/15 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900 border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between font-semibold text-xs mb-1">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>2x HD Upscaling</span>
                </span>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${applyUpscale ? 'bg-purple-500 border-purple-400 text-white' : 'border-white/20'}`}>
                  {applyUpscale && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-[10px] text-[#aaa]">Double resolution via HD edge filter</p>
            </div>
          </div>

          {applyWatermark && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-300">Custom Watermark Text:</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          )}

          {/* Upload Drop Area */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleAddFiles}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-sky-500/50 bg-slate-950 p-6 rounded-2xl text-center cursor-pointer transition-all group"
          >
            <Upload className="w-8 h-8 text-slate-500 group-hover:text-sky-400 mx-auto mb-2 transition-colors" />
            <h4 className="font-semibold text-slate-200 text-xs">Click to select photos for Batch Processing</h4>
            <p className="text-slate-500 text-[11px] mt-0.5">Supports PNG, JPG, WEBP formats</p>
          </div>

          {/* Files List Queue */}
          {files.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Batch Queue ({files.length} items)</span>
                {files.some((f) => f.status === 'done') && (
                  <button
                    onClick={downloadAllProcessed}
                    className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download All Processed</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {files.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 bg-slate-900 border border-white/5 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Thumbnail */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.processedUrl || item.previewUrl}
                        alt={item.name}
                        className="w-8 h-8 rounded object-cover border border-white/10"
                      />
                      <div className="truncate max-w-xs">
                        <div className="font-medium text-slate-200 truncate">{item.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{item.status}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.status === 'processing' && <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />}
                      {item.status === 'done' && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                      {item.status === 'done' && item.processedUrl && (
                        <a
                          href={item.processedUrl}
                          download={`processed_${item.name}`}
                          className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                          title="Download item"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            {files.filter((f) => f.status === 'done').length} of {files.length} Completed
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBatchModalOpen(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={runBatchProcess}
              disabled={files.length === 0 || isProcessing}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>Start Batch Execution</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
