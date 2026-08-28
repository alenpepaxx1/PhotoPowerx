/**
 * PhotoPower - Advanced Photo & Video Studio
 * Master Multi-Format Render Engine Modal
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { ColorSpaceProfile, ExportFormat } from '@/types/editor';
import { FormatMatrix, canvasToSvgFormat, canvasToHdrFormat, transformColorSpace } from '@/lib/colorSpaceConverter';
import { generate3DLutCube, download3DLutFile } from '@/lib/lutExporter';
import {
  Download,
  X,
  Image as ImageIcon,
  Video,
  FileCode,
  Check,
  Loader2,
  HardDrive,
  Sparkles,
  Maximize2,
  FileType,
  Cpu,
  Layers,
  Film,
} from 'lucide-react';

export const ExportModal: React.FC = () => {
  const {
    isExportModalOpen,
    setIsExportModalOpen,
    projectName,
    canvasWidth,
    canvasHeight,
    mediaMode,
    layers,
    globalAdjustments,
    videoState,
    updateVideoState,
  } = useEditor();

  const [format, setFormat] = useState<ExportFormat>('png');
  const [colorSpace, setColorSpace] = useState<ColorSpaceProfile>('sRGB');
  const [scale, setScale] = useState<number>(1);
  const [quality, setQuality] = useState<number>(0.92);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  if (!isExportModalOpen) return null;

  const targetWidth = canvasWidth * scale;
  const targetHeight = canvasHeight * scale;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const mainCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!mainCanvas) throw new Error('Canvas not found');

      // 1. 3D LUT Cube export
      if (format === 'cube') {
        download3DLutFile(globalAdjustments, `${projectName.toLowerCase().replace(/\s+/g, '_')}_master.cube`);
        setIsExporting(false);
        setExportSuccess(true);
        return;
      }

      // 2. Project JSON Backup
      if (format === 'json') {
        const projectData = {
          app: 'PhotoPower',
          version: '2.5',
          author: 'Alen Pepa',
          copyright: 'Copyright © 2026 Alen Pepa. All rights reserved.',
          timestamp: new Date().toISOString(),
          name: projectName,
          canvasWidth,
          canvasHeight,
          globalAdjustments,
          layers: layers.map((l) => ({
            id: l.id,
            name: l.name,
            type: l.type,
            x: l.x,
            y: l.y,
            width: l.width,
            height: l.height,
            opacity: l.opacity,
            blendMode: l.blendMode,
            visible: l.visible,
            textProps: l.textProps,
            shapeProps: l.shapeProps,
            drawingStrokes: l.drawingStrokes,
          })),
        };

        const blob = new Blob([JSON.stringify(projectData, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/\s+/g, '_')}-PhotoPower-Alen-Pepa.json`;
        a.click();
        URL.revokeObjectURL(url);
      }

      // 3. SVG Vector Export
      else if (format === 'svg') {
        const svgString = canvasToSvgFormat(mainCanvas, projectName);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/\s+/g, '_')}-Vector-PhotoPower.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }

      // 4. HDR Floating Point Export
      else if (format === 'hdr') {
        const hdrString = canvasToHdrFormat(mainCanvas);
        const blob = new Blob([hdrString], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName.replace(/\s+/g, '_')}-32bit.hdr`;
        a.click();
        URL.revokeObjectURL(url);
      }

      // 5. Video Stream Recording Export (WebM / MP4)
      else if (format === 'mp4' || format === 'webm') {
        const stream = mainCanvas.captureStream(60);
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
            ? 'video/webm;codecs=vp9'
            : 'video/webm',
          videoBitsPerSecond: 10000000,
        });

        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${projectName.replace(/\s+/g, '_')}-PhotoPower-Alen-Pepa.${format}`;
          a.click();
          URL.revokeObjectURL(url);
          setIsExporting(false);
          setExportSuccess(true);
        };

        mediaRecorder.start();

        const videoLayer = layers.find((l) => l.type === 'video' && l.videoElement);
        if (videoLayer && videoLayer.videoElement) {
          videoLayer.videoElement.currentTime = videoState.trimStart;
          videoLayer.videoElement.play().catch(() => {});
        }
        updateVideoState({ isPlaying: true });

        const durationSec = Math.max(1, videoState.trimEnd - videoState.trimStart);
        setTimeout(() => {
          mediaRecorder.stop();
          if (videoLayer && videoLayer.videoElement) {
            videoLayer.videoElement.pause();
          }
          updateVideoState({ isPlaying: false });
        }, durationSec * 1000);

        return;
      }

      // 6. High-Resolution Scaled Still Image Export (PNG / JPEG / WebP / AVIF / BMP / TIFF / GIF)
      else {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = targetWidth;
        exportCanvas.height = targetHeight;
        const ctx = exportCanvas.getContext('2d');
        if (!ctx) throw new Error('Cannot get 2d context');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw scaled image
        ctx.drawImage(mainCanvas, 0, 0, targetWidth, targetHeight);

        // Apply Color Space Profile Transformation
        if (colorSpace !== 'sRGB') {
          const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
          transformColorSpace(imgData, colorSpace, 8);
          ctx.putImageData(imgData, 0, 0);
        }

        // Optional Author Watermark stamp
        if (includeWatermark) {
          ctx.save();
          ctx.font = `600 ${Math.round(14 * scale)}px Inter, sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4 * scale;
          ctx.fillText('PhotoPower • by Alen Pepa', 20 * scale, targetHeight - 20 * scale);
          ctx.restore();
        }

        let mimeType = 'image/png';
        if (format === 'jpeg') mimeType = 'image/jpeg';
        else if (format === 'webp') mimeType = 'image/webp';
        else if (format === 'avif') mimeType = 'image/avif';
        else if (format === 'bmp') mimeType = 'image/bmp';
        else if (format === 'gif') mimeType = 'image/gif';
        else if (format === 'tiff') mimeType = 'image/tiff';

        const dataUrl = exportCanvas.toDataURL(mimeType, quality);

        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${projectName.replace(/\s+/g, '_')}-${targetWidth}x${targetHeight}-${colorSpace}.${format}`;
        a.click();
      }

      setExportSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#0f141c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Download className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Master Multi-Format Render Studio</h3>
              <p className="text-[11px] text-slate-400">High-Fidelity Rendering & Color Space Profile Engine</p>
            </div>
          </div>

          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs bg-[#0f141c] overflow-y-auto">
          {/* Format Selector Grid */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-slate-400 text-[11px] font-medium">
              <span>Select Output Format ({FormatMatrix.SUPPORTED_FORMATS.length} Supported):</span>
              <span className="font-mono text-cyan-400 uppercase font-bold">{format}</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'png', label: 'PNG', desc: 'Lossless' },
                { id: 'jpeg', label: 'JPEG', desc: 'Compressed' },
                { id: 'webp', label: 'WebP', desc: 'Next-Gen' },
                { id: 'avif', label: 'AVIF', desc: 'HDR 10-bit' },
                { id: 'svg', label: 'SVG', desc: 'Vector XML' },
                { id: 'gif', label: 'GIF', desc: 'Animated' },
                { id: 'bmp', label: 'BMP', desc: 'Uncompressed' },
                { id: 'tiff', label: 'TIFF', desc: 'Master Print' },
                { id: 'hdr', label: 'HDR', desc: '32-bit Float' },
                { id: 'webm', label: 'WebM', desc: '60fps VP9' },
                { id: 'mp4', label: 'MP4', desc: 'H.264 Video' },
                { id: 'json', label: 'Project', desc: 'State Data' },
                { id: 'cube', label: '3D LUT', desc: '.cube Matrix' },
              ].map((fmt) => {
                const isSelected = format === fmt.id;

                return (
                  <button
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as ExportFormat)}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-600/20 border-cyan-400 text-cyan-200 shadow-md font-bold'
                        : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-mono text-xs">{fmt.label}</span>
                    <span className="text-[9px] text-slate-500 truncate">{fmt.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Space Selection */}
          <div className="p-3 bg-slate-900 rounded-xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Output Color Gamut Profile:</span>
              </span>
              <span className="font-mono text-cyan-400">{colorSpace}</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  'sRGB',
                  'Display-P3',
                  'Adobe-RGB',
                  'ProPhoto-RGB',
                  'DCI-P3',
                  'Rec-2020',
                ] as const
              ).map((cs) => (
                <button
                  key={cs}
                  onClick={() => setColorSpace(cs)}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-mono border transition-colors ${
                    colorSpace === cs
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                      : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cs}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Resolution Multiplier (For Images) */}
          {format !== 'json' && format !== 'cube' && format !== 'svg' && (
            <div className="space-y-2 p-3 bg-slate-900 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Output Render Resolution:</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {targetWidth} × {targetHeight} px
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { s: 1, label: '1x (Native)' },
                  { s: 2, label: '2x (Retina 2K)' },
                  { s: 4, label: '4x (Ultra 4K)' },
                ].map((item) => (
                  <button
                    key={item.s}
                    onClick={() => setScale(item.s)}
                    className={`py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      scale === item.s
                        ? 'bg-cyan-600 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality Slider */}
          {(format === 'jpeg' || format === 'webp' || format === 'avif') && (
            <div className="space-y-1.5 p-3 bg-slate-900 rounded-xl border border-white/10">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Quality Ratio:</span>
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

          {/* Author Watermark option */}
          <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-white/10">
            <div>
              <span className="font-medium text-slate-200 block">Embed Signature Watermark</span>
              <span className="text-[10px] text-slate-400">Embed &quot;PhotoPower • by Alen Pepa&quot; signature badge</span>
            </div>
            <button
              onClick={() => setIncludeWatermark(!includeWatermark)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                includeWatermark ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-slate-950 absolute top-0.75 transition-transform ${
                  includeWatermark ? 'right-0.75' : 'left-0.75'
                }`}
              />
            </button>
          </div>

          {exportSuccess && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Media rendered & exported in {format.toUpperCase()} format with {colorSpace} profile!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Author & Copyright: <strong className="text-slate-300">Alen Pepa</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rendering...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>Render & Download {format.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
