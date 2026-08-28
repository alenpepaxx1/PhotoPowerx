/**
 * PhotoPower - Advanced Photo & Video Studio
 * Format Studio & Color Space Converter Panel
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { ColorSpaceProfile, ExportFormat } from '@/types/editor';
import { FormatMatrix, canvasToSvgFormat, canvasToHdrFormat, transformColorSpace } from '@/lib/colorSpaceConverter';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  FileCheck,
  FileType,
  Download,
  Sliders,
  Sparkles,
  ShieldCheck,
  Check,
  RefreshCw,
  HardDrive,
  Cpu,
  Zap,
  Layers,
  Info,
} from 'lucide-react';

export const FormatStudioPanel: React.FC = () => {
  const { canvasWidth, canvasHeight, pushHistory, setIsExportModalOpen } = useEditor();

  const [selectedFormatId, setSelectedFormatId] = useState<string>('webp');
  const [selectedColorSpace, setSelectedColorSpace] = useState<ColorSpaceProfile>('sRGB');
  const [bitDepth, setBitDepth] = useState<8 | 10 | 16>(8);
  const [quality, setQuality] = useState<number>(0.90);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [convertSuccess, setConvertSuccess] = useState<boolean>(false);

  const selectedSpec = FormatMatrix.SUPPORTED_FORMATS.find((f) => f.id === selectedFormatId) || FormatMatrix.SUPPORTED_FORMATS[0];

  // Calculate estimated file sizes
  const rawPixelBytes = canvasWidth * canvasHeight * 4;
  const estimatedPngSize = (rawPixelBytes * 0.7) / (1024 * 1024);
  const estimatedJpgSize = (rawPixelBytes * 0.25 * quality) / (1024 * 1024);
  const estimatedWebpSize = (rawPixelBytes * 0.18 * quality) / (1024 * 1024);
  const estimatedAvifSize = (rawPixelBytes * 0.12 * quality) / (1024 * 1024);

  let currentEstSize = '1.2 MB';
  if (selectedFormatId === 'png') currentEstSize = `${estimatedPngSize.toFixed(2)} MB`;
  else if (selectedFormatId === 'jpeg') currentEstSize = `${estimatedJpgSize.toFixed(2)} MB`;
  else if (selectedFormatId === 'webp') currentEstSize = `${estimatedWebpSize.toFixed(2)} MB`;
  else if (selectedFormatId === 'avif') currentEstSize = `${estimatedAvifSize.toFixed(2)} MB`;
  else if (selectedFormatId === 'bmp') currentEstSize = `${(rawPixelBytes / (1024 * 1024)).toFixed(2)} MB`;
  else if (selectedFormatId === 'tiff') currentEstSize = `${((rawPixelBytes * 2) / (1024 * 1024)).toFixed(2)} MB`;
  else if (selectedFormatId === 'svg') currentEstSize = '~150 KB (Vector XML)';
  else if (selectedFormatId === 'hdr') currentEstSize = `${((rawPixelBytes * 4) / (1024 * 1024)).toFixed(2)} MB Float`;
  else currentEstSize = 'Variable';

  // Apply Color Space Profile to Live Canvas
  const handleApplyColorSpace = () => {
    const canvasObj = getCanvasContextData();
    if (!canvasObj?.canvas) return;
    const canvas = canvasObj.canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const converted = transformColorSpace(imgData, selectedColorSpace, bitDepth);
    ctx.putImageData(converted, 0, 0);

    pushHistory(`Converted Color Space to ${selectedColorSpace} (${bitDepth}-bit)`);
  };

  // Convert & Download directly in chosen format
  const handleDirectConvertDownload = () => {
    setIsConverting(true);
    setConvertSuccess(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const canvas = canvasObj.canvas;

        if (selectedFormatId === 'svg') {
          const svgContent = canvasToSvgFormat(canvas, 'PhotoPower Studio Graphic');
          const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `PhotoPower_Master_${canvasWidth}x${canvasHeight}.svg`;
          a.click();
          URL.revokeObjectURL(url);
        } else if (selectedFormatId === 'hdr') {
          const hdrContent = canvasToHdrFormat(canvas);
          const blob = new Blob([hdrContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `PhotoPower_Master_32bit.hdr`;
          a.click();
          URL.revokeObjectURL(url);
        } else {
          let mime = 'image/png';
          if (selectedFormatId === 'jpeg') mime = 'image/jpeg';
          if (selectedFormatId === 'webp') mime = 'image/webp';
          if (selectedFormatId === 'avif') mime = 'image/avif';
          if (selectedFormatId === 'bmp') mime = 'image/bmp';

          const dataUrl = canvas.toDataURL(mime, quality);
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = `PhotoPower_Converted_${selectedFormatId.toUpperCase()}.${selectedSpec.extension.replace('.', '')}`;
          a.click();
        }

        setConvertSuccess(true);
      } catch (e) {
        console.error('Format conversion failed:', e);
      } finally {
        setIsConverting(false);
      }
    }, 300);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <FileType className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm">Format Studio & Color Profiles</h3>
        </div>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
          13 Supported Formats
        </span>
      </div>

      {/* Color Space Profile Selector */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Target Color Space Profile</span>
          </h4>
          <span className="font-mono text-[10px] text-cyan-400">{selectedColorSpace}</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {(
            [
              { id: 'sRGB', label: 'sRGB IEC61966', desc: 'Standard Web & Displays' },
              { id: 'Display-P3', label: 'Display P3', desc: 'Apple Wide Gamut Retina' },
              { id: 'Adobe-RGB', label: 'Adobe RGB (1998)', desc: 'Pro Print Publishing' },
              { id: 'ProPhoto-RGB', label: 'ProPhoto RGB', desc: 'Ultra-Wide RAW Master' },
              { id: 'DCI-P3', label: 'DCI-P3 Cinema', desc: 'Digital Cinema Theater' },
              { id: 'Rec-2020', label: 'Rec. 2020', desc: 'UHD 4K/8K TV Broadcast' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedColorSpace(item.id)}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedColorSpace === item.id
                  ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold shadow-sm'
                  : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/10'
              }`}
            >
              <div className="text-xs">{item.label}</div>
              <div className="text-[9px] text-slate-500 truncate">{item.desc}</div>
            </button>
          ))}
        </div>

        {/* Bit Depth Selector */}
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <span className="text-[11px] text-slate-400">Color Bit Depth Precision:</span>
          <div className="flex gap-1.5">
            {[8, 10, 16].map((b) => (
              <button
                key={b}
                onClick={() => setBitDepth(b as any)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono transition-colors ${
                  bitDepth === b
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {b}-Bit {b === 10 ? 'HDR' : b === 16 ? 'Pro' : ''}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleApplyColorSpace}
          className="w-full py-1.5 bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/40 text-cyan-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Transform Canvas Color Gamut</span>
        </button>
      </div>

      {/* Format Matrix Grid Inspector */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Supported Format Engine Matrix</span>
        </h4>

        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
          {FormatMatrix.SUPPORTED_FORMATS.map((spec) => (
            <button
              key={spec.id}
              onClick={() => setSelectedFormatId(spec.id)}
              className={`p-2 rounded-xl border text-left transition-all ${
                selectedFormatId === spec.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md'
                  : 'bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs">{spec.extension}</span>
                <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-slate-400">
                  {spec.category}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{spec.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Specification Card */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-100 text-xs">{selectedSpec.name}</span>
          <span className="font-mono text-[11px] text-cyan-400">{selectedSpec.extension}</span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">{selectedSpec.description}</p>

        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-white/5">
          <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500 block">Alpha Transparency:</span>
            <span className={selectedSpec.supportsAlpha ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
              {selectedSpec.supportsAlpha ? 'Yes (8-bit Alpha)' : 'No (Opaque)'}
            </span>
          </div>

          <div className="bg-slate-950 p-2 rounded-lg border border-white/5">
            <span className="text-slate-500 block">Estimated File Size:</span>
            <span className="font-mono text-cyan-300 font-semibold">{currentEstSize}</span>
          </div>
        </div>

        {/* Quality Slider for lossy formats */}
        {(selectedFormatId === 'jpeg' || selectedFormatId === 'webp' || selectedFormatId === 'avif') && (
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Encoding Quality Ratio:</span>
              <span className="font-mono text-cyan-400">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-950 rounded cursor-pointer"
            />
          </div>
        )}

        {/* Quick Convert Button */}
        <button
          onClick={handleDirectConvertDownload}
          disabled={isConverting}
          className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {isConverting ? (
            <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
          ) : (
            <Download className="w-4 h-4 text-slate-950" />
          )}
          <span>Convert & Export to {selectedSpec.extension.toUpperCase()}</span>
        </button>

        {convertSuccess && (
          <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-[11px] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Format conversion completed successfully!</span>
          </div>
        )}
      </div>

      {/* Advanced Batch Export Link */}
      <button
        onClick={() => setIsExportModalOpen(true)}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Sliders className="w-4 h-4 text-cyan-400" />
        <span>Open Master Multi-Format Studio Render</span>
      </button>
    </div>
  );
};
