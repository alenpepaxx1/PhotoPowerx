/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import { Activity, Gauge, Eye, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ScopeMonitorPanel: React.FC = () => {
  const { globalAdjustments, layers, activeRightPanel } = useEditor();

  const rgbParadeCanvasRef = useRef<HTMLCanvasElement>(null);
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null);
  const vectorscopeCanvasRef = useRef<HTMLCanvasElement>(null);

  const [clippingInfo, setClippingInfo] = useState({ shadows: 0, highlights: 0 });
  const [scopeMode, setScopeMode] = useState<'parade' | 'waveform' | 'vectorscope'>('parade');

  const updateScopes = () => {
    const canvasObj = getCanvasContextData();
    if (!canvasObj?.canvas) return;

    const canvas = canvasObj.canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return;

    // Sample step for fast real-time rendering
    const step = Math.max(1, Math.floor(w / 160));
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let clippedLow = 0;
    let clippedHigh = 0;
    const totalPixels = Math.floor((w * h) / (step * step));

    // 1. DRAW RGB PARADE
    if (rgbParadeCanvasRef.current) {
      const pCanvas = rgbParadeCanvasRef.current;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx) {
        const pw = pCanvas.width;
        const ph = pCanvas.height;
        pCtx.fillStyle = '#05070a';
        pCtx.fillRect(0, 0, pw, ph);

        // Divide into 3 vertical columns for Red, Green, Blue
        const colW = pw / 3;

        // Draw background grid lines (0%, 25%, 50%, 75%, 100%)
        pCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        pCtx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          const y = (ph * i) / 4;
          pCtx.beginPath();
          pCtx.moveTo(0, y);
          pCtx.lineTo(pw, y);
          pCtx.stroke();
        }

        // Draw Dividers
        pCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        pCtx.beginPath();
        pCtx.moveTo(colW, 0);
        pCtx.lineTo(colW, ph);
        pCtx.moveTo(colW * 2, 0);
        pCtx.lineTo(colW * 2, ph);
        pCtx.stroke();

        pCtx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // Red
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const px = (x / w) * colW;
            const py = ph - (r / 255) * ph;
            pCtx.fillRect(px, py, 1.2, 1.2);
          }
        }

        pCtx.fillStyle = 'rgba(34, 197, 94, 0.4)'; // Green
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const idx = (y * w + x) * 4;
            const g = data[idx + 1];
            const px = colW + (x / w) * colW;
            const py = ph - (g / 255) * ph;
            pCtx.fillRect(px, py, 1.2, 1.2);
          }
        }

        pCtx.fillStyle = 'rgba(59, 130, 246, 0.4)'; // Blue
        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const idx = (y * w + x) * 4;
            const b = data[idx + 2];
            const px = colW * 2 + (x / w) * colW;
            const py = ph - (b / 255) * ph;
            pCtx.fillRect(px, py, 1.2, 1.2);
          }
        }
      }
    }

    // 2. DRAW LUMINANCE WAVEFORM
    if (waveformCanvasRef.current) {
      const wCanvas = waveformCanvasRef.current;
      const wCtx = wCanvas.getContext('2d');
      if (wCtx) {
        const ww = wCanvas.width;
        const wh = wCanvas.height;
        wCtx.fillStyle = '#05070a';
        wCtx.fillRect(0, 0, ww, wh);

        // Grids
        wCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        wCtx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          const y = (wh * i) / 4;
          wCtx.beginPath();
          wCtx.moveTo(0, y);
          wCtx.lineTo(ww, y);
          wCtx.stroke();
        }

        wCtx.fillStyle = 'rgba(56, 189, 248, 0.35)';

        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            if (lum < 5) clippedLow++;
            if (lum > 250) clippedHigh++;

            const px = (x / w) * ww;
            const py = wh - (lum / 255) * wh;
            wCtx.fillRect(px, py, 1.2, 1.2);
          }
        }
      }
    }

    // 3. DRAW VECTORSCOPE
    if (vectorscopeCanvasRef.current) {
      const vCanvas = vectorscopeCanvasRef.current;
      const vCtx = vCanvas.getContext('2d');
      if (vCtx) {
        const vw = vCanvas.width;
        const vh = vCanvas.height;
        const radius = vw / 2 - 10;
        const cx = vw / 2;
        const cy = vh / 2;

        vCtx.fillStyle = '#05070a';
        vCtx.fillRect(0, 0, vw, vh);

        // Draw polar circles & crosshairs
        vCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        vCtx.beginPath();
        vCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        vCtx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
        vCtx.moveTo(cx - radius, cy);
        vCtx.lineTo(cx + radius, cy);
        vCtx.moveTo(cx, cy - radius);
        vCtx.lineTo(cx, cy + radius);
        vCtx.stroke();

        vCtx.fillStyle = 'rgba(234, 179, 8, 0.5)'; // Yellow dots

        for (let y = 0; y < h; y += step) {
          for (let x = 0; x < w; x += step) {
            const idx = (y * w + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Convert RGB to Cb Cr coordinates
            const cb = -0.168736 * r - 0.331264 * g + 0.5 * b;
            const cr = 0.5 * r - 0.418688 * g - 0.081312 * b;

            const px = cx + (cb / 128) * radius;
            const py = cy - (cr / 128) * radius;
            vCtx.fillRect(px, py, 1.2, 1.2);
          }
        }
      }
    }

    setClippingInfo({
      shadows: Math.round((clippedLow / totalPixels) * 100),
      highlights: Math.round((clippedHigh / totalPixels) * 100),
    });
  };

  useEffect(() => {
    if (activeRightPanel === 'scopes') {
      const timer = setTimeout(updateScopes, 150);
      return () => clearTimeout(timer);
    }
  }, [globalAdjustments, layers, activeRightPanel]);

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">Studio Scope Monitors</h3>
        </div>
        <button
          onClick={updateScopes}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors border border-white/5"
          title="Refresh Scopes"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scope Mode Switcher */}
      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[11px]">
        {[
          { id: 'parade', label: 'RGB Parade' },
          { id: 'waveform', label: 'Waveform' },
          { id: 'vectorscope', label: 'Vectorscope' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setScopeMode(tab.id as any)}
            className={`py-1.5 rounded-lg font-semibold transition-colors ${
              scopeMode === tab.id
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RGB Parade Monitor */}
      {scopeMode === 'parade' && (
        <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-red-400" />
              <span>RGB Channel Parade</span>
            </span>
            <span className="text-slate-500 font-mono text-[10px]">R | G | B</span>
          </div>
          <canvas
            ref={rgbParadeCanvasRef}
            width={280}
            height={160}
            className="w-full h-40 bg-slate-950 rounded-xl border border-white/5 block"
          />
        </div>
      )}

      {/* Luminance Waveform Monitor */}
      {scopeMode === 'waveform' && (
        <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span>Luminance Waveform (0 - 255 IRE)</span>
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Brightness</span>
          </div>
          <canvas
            ref={waveformCanvasRef}
            width={280}
            height={160}
            className="w-full h-40 bg-slate-950 rounded-xl border border-white/5 block"
          />
        </div>
      )}

      {/* Vectorscope Monitor */}
      {scopeMode === 'vectorscope' && (
        <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Vectorscope Chrominance Plot</span>
            </span>
            <span className="text-slate-500 font-mono text-[10px]">Cb / Cr</span>
          </div>
          <div className="flex justify-center">
            <canvas
              ref={vectorscopeCanvasRef}
              width={180}
              height={180}
              className="w-44 h-44 bg-slate-950 rounded-full border border-white/10 block shadow-inner"
            />
          </div>
        </div>
      )}

      {/* Dynamic Range & Clipping Alerts */}
      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2">
        <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dynamic Range Clipping Monitor</span>
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className={`p-2 rounded border ${clippingInfo.shadows > 5 ? 'bg-amber-950/40 border-amber-500/40 text-amber-300' : 'bg-slate-950 border-white/5 text-slate-300'}`}>
            <div className="text-[9px] text-slate-500 flex items-center gap-1">
              <span>BLACK CLIPPING</span>
              {clippingInfo.shadows > 5 && <AlertTriangle className="w-3 h-3 text-amber-400" />}
            </div>
            <div className="font-bold text-xs">{clippingInfo.shadows}% Crushed</div>
          </div>

          <div className={`p-2 rounded border ${clippingInfo.highlights > 5 ? 'bg-red-950/40 border-red-500/40 text-red-300' : 'bg-slate-950 border-white/5 text-slate-300'}`}>
            <div className="text-[9px] text-slate-500 flex items-center gap-1">
              <span>WHITE CLIPPING</span>
              {clippingInfo.highlights > 5 && <AlertTriangle className="w-3 h-3 text-red-400" />}
            </div>
            <div className="font-bold text-xs">{clippingInfo.highlights}% Blown</div>
          </div>
        </div>
      </div>
    </div>
  );
};
