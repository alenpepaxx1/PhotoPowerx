/**
 * PhotoPower - Advanced Photo & Video Studio
 * Real-Time RGB Histogram & Color Scopes Panel
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { BarChart2, Eye, Activity, ShieldAlert } from 'lucide-react';

export const HistogramPanel: React.FC = () => {
  const { layers, activeFilterId, globalAdjustments, toneCurves, colorWheels, hslState } = useEditor();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stats, setStats] = useState({
    avgLuma: 0,
    shadowClipping: 0,
    highlightClipping: 0,
  });

  const [mode, setMode] = useState<'histogram' | 'waveform'>('histogram');

  useEffect(() => {
    const mainCanvas = document.querySelector('canvas') as HTMLCanvasElement;
    const scopeCanvas = canvasRef.current;
    if (!mainCanvas || !scopeCanvas) return;

    const ctx = scopeCanvas.getContext('2d');
    if (!ctx) return;

    const renderScope = () => {
      const w = scopeCanvas.width;
      const h = scopeCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // Dark scope background with grid lines
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      // 25%, 50%, 75% horizontal grid lines
      for (const pct of [0.25, 0.5, 0.75]) {
        const y = Math.round(h * pct);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      try {
        const mctx = mainCanvas.getContext('2d');
        if (!mctx) return;

        // Downsample main canvas for scope performance
        const sampleW = Math.min(200, mainCanvas.width);
        const sampleH = Math.min(150, mainCanvas.height);
        if (sampleW <= 0 || sampleH <= 0) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sampleW;
        tempCanvas.height = sampleH;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(mainCanvas, 0, 0, sampleW, sampleH);
        const imgData = tempCtx.getImageData(0, 0, sampleW, sampleH);
        const data = imgData.data;

        const rHist = new Uint32Array(256);
        const gHist = new Uint32Array(256);
        const bHist = new Uint32Array(256);
        const lHist = new Uint32Array(256);

        let totalLuma = 0;
        let shadowClip = 0;
        let highlightClip = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const l = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          rHist[r]++;
          gHist[g]++;
          bHist[b]++;
          lHist[l]++;

          totalLuma += l;

          if (r === 0 && g === 0 && b === 0) shadowClip++;
          if (r === 255 || g === 255 || b === 255) highlightClip++;
        }

        setStats({
          avgLuma: Math.round(totalLuma / totalPixels),
          shadowClipping: Math.round((shadowClip / totalPixels) * 100),
          highlightClipping: Math.round((highlightClip / totalPixels) * 100),
        });

        if (mode === 'histogram') {
          // Find max frequency
          let maxCount = 1;
          for (let i = 0; i < 256; i++) {
            if (rHist[i] > maxCount) maxCount = rHist[i];
            if (gHist[i] > maxCount) maxCount = gHist[i];
            if (bHist[i] > maxCount) maxCount = bHist[i];
          }

          // Draw Channel Curves with Additive / Screen blending
          const drawChannel = (hist: Uint32Array, color: string) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, h);

            for (let i = 0; i < 256; i++) {
              const x = (i / 255) * w;
              const valH = (hist[i] / maxCount) * (h * 0.85);
              const y = h - valH;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(w, h);
            ctx.closePath();
            ctx.fill();
          };

          ctx.globalCompositeOperation = 'screen';
          drawChannel(rHist, 'rgba(239, 68, 68, 0.45)');
          drawChannel(gHist, 'rgba(34, 197, 94, 0.45)');
          drawChannel(bHist, 'rgba(56, 189, 248, 0.45)');
          drawChannel(lHist, 'rgba(255, 255, 255, 0.25)');
          ctx.globalCompositeOperation = 'source-over';
        } else {
          // Luma Waveform Scope
          ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
          for (let x = 0; x < sampleW; x++) {
            const scopeX = (x / sampleW) * w;
            for (let y = 0; y < sampleH; y++) {
              const idx = (y * sampleW + x) * 4;
              const luma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
              const scopeY = h - (luma / 255) * h;
              ctx.fillRect(scopeX, scopeY, 1.5, 1.5);
            }
          }
        }
      } catch {
        // Safe cross origin fallback
      }
    };

    renderScope();
    const timer = setInterval(renderScope, 300);
    return () => clearInterval(timer);
  }, [layers, activeFilterId, globalAdjustments, toneCurves, colorWheels, hslState, mode]);

  return (
    <div className="p-4 bg-slate-900/60 border-b border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-slate-200">
          <BarChart2 className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-semibold">Live Color & Luma Scopes</h3>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => setMode('histogram')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              mode === 'histogram' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            RGB Histogram
          </button>
          <button
            onClick={() => setMode('waveform')}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              mode === 'waveform' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Waveform
          </button>
        </div>
      </div>

      {/* Scope Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-inner">
        <canvas ref={canvasRef} width={280} height={110} className="w-full h-28 block bg-slate-950" />
      </div>

      {/* Analytics Readout */}
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        <div className="p-2 bg-slate-950/80 rounded-lg border border-white/5 text-center">
          <span className="text-slate-400 block">Avg Luma</span>
          <span className="font-mono text-sky-300 font-bold">{stats.avgLuma} / 255</span>
        </div>

        <div className="p-2 bg-slate-950/80 rounded-lg border border-white/5 text-center">
          <span className="text-slate-400 block">Shadow Clip</span>
          <span className={`font-mono font-bold ${stats.shadowClipping > 5 ? 'text-amber-400' : 'text-slate-300'}`}>
            {stats.shadowClipping}%
          </span>
        </div>

        <div className="p-2 bg-slate-950/80 rounded-lg border border-white/5 text-center">
          <span className="text-slate-400 block">Highlight Clip</span>
          <span className={`font-mono font-bold ${stats.highlightClipping > 5 ? 'text-rose-400' : 'text-slate-300'}`}>
            {stats.highlightClipping}%
          </span>
        </div>
      </div>
    </div>
  );
};
