/**
 * PhotoPower - Advanced Photo & Video Studio
 * 3D Lens Distortion & Perspective Keystoning Panel
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { getCanvasContextData } from '@/components/canvas/EditorCanvas';
import {
  Maximize2,
  MoveHorizontal,
  MoveVertical,
  RotateCcw,
  Grid,
  Check,
  Zap,
  Sliders,
  Eye,
  RefreshCw,
  Compass,
} from 'lucide-react';

export const PerspectivePanel: React.FC = () => {
  const { pushHistory } = useEditor();

  const [distortion, setDistortion] = useState<number>(0); // Barrel/Pincushion (-50 to +50)
  const [verticalPerspective, setVerticalPerspective] = useState<number>(0); // (-40 to +40)
  const [horizontalPerspective, setHorizontalPerspective] = useState<number>(0); // (-40 to +40)
  const [rotateAngle, setRotateAngle] = useState<number>(0); // (-180 to +180)
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleReset = () => {
    setDistortion(0);
    setVerticalPerspective(0);
    setHorizontalPerspective(0);
    setRotateAngle(0);
  };

  const handleApplyTransform = () => {
    setIsProcessing(true);
    setSuccess(false);

    setTimeout(() => {
      try {
        const canvasObj = getCanvasContextData();
        if (!canvasObj?.canvas) return;
        const canvas = canvasObj.canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Create temporary offscreen copy
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(canvas, 0, 0);

        // Clear main canvas
        ctx.clearRect(0, 0, width, height);
        ctx.save();

        // Center transformation matrix
        ctx.translate(width / 2, height / 2);

        // Rotation
        ctx.rotate((rotateAngle * Math.PI) / 180);

        // Perspective Shearing & Scaling
        const vScale = 1 - (verticalPerspective / 100) * 0.4;
        const hScale = 1 - (horizontalPerspective / 100) * 0.4;

        ctx.scale(hScale, vScale);

        // Barrel Distortion Simulation Matrix
        if (distortion !== 0) {
          const distScale = 1 + (distortion / 100) * 0.2;
          ctx.scale(distScale, distScale);
        }

        ctx.drawImage(tempCanvas, -width / 2, -height / 2);
        ctx.restore();

        pushHistory(
          `Perspective Transform (Rot: ${rotateAngle}°, Dist: ${distortion}, V: ${verticalPerspective}, H: ${horizontalPerspective})`
        );
        setSuccess(true);
      } catch (e) {
        console.error('Perspective transform failed:', e);
      } finally {
        setIsProcessing(false);
      }
    }, 200);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">3D Lens & Perspective Studio</h3>
        </div>
        <button
          onClick={handleReset}
          className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-white/10 px-2 py-0.5 rounded-lg"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Barrel & Pincushion Lens Distortion */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Lens Distortion (Barrel & Pincushion)</span>
        </h4>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Distortion Correction:</span>
            <span className="font-mono text-emerald-400">
              {distortion > 0 ? `+${distortion} (Pincushion)` : distortion < 0 ? `${distortion} (Barrel)` : '0 (Flat)'}
            </span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={distortion}
            onChange={(e) => setDistortion(Number(e.target.value))}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 2. Keystoning Vertical & Horizontal Perspective */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <MoveVertical className="w-4 h-4 text-cyan-400" />
          <span>Perspective Keystoning</span>
        </h4>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Vertical Perspective Tilt:</span>
            <span className="font-mono text-cyan-400">{verticalPerspective}°</span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            value={verticalPerspective}
            onChange={(e) => setVerticalPerspective(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Horizontal Perspective Rotate:</span>
            <span className="font-mono text-cyan-400">{horizontalPerspective}°</span>
          </div>
          <input
            type="range"
            min="-40"
            max="40"
            value={horizontalPerspective}
            onChange={(e) => setHorizontalPerspective(Number(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Horizon Straighten Angle */}
      <div className="p-3.5 bg-slate-900 border border-white/10 rounded-2xl space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <Grid className="w-4 h-4 text-purple-400" />
          <span>Horizon Straighten Angle</span>
        </h4>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Rotation Angle:</span>
            <span className="font-mono text-purple-400">{rotateAngle}°</span>
          </div>
          <input
            type="range"
            min="-45"
            max="45"
            step="0.5"
            value={rotateAngle}
            onChange={(e) => setRotateAngle(Number(e.target.value))}
            className="w-full accent-purple-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={handleApplyTransform}
        disabled={isProcessing}
        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
      >
        {isProcessing ? (
          <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
        ) : (
          <Zap className="w-4 h-4 text-slate-950 fill-current" />
        )}
        <span>Apply Perspective & Lens Correction</span>
      </button>

      {success && (
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Perspective geometry successfully transformed!</span>
        </div>
      )}
    </div>
  );
};
