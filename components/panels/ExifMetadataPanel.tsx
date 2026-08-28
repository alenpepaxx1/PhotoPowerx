/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Camera, HardDrive, Info, Shield, Copy, Check } from 'lucide-react';

export const ExifMetadataPanel: React.FC = () => {
  const { canvasWidth, canvasHeight, layers } = useEditor();
  const [copied, setCopied] = useState(false);

  const totalMegapixels = ((canvasWidth * canvasHeight) / 1000000).toFixed(2);
  const layerCount = layers.length;

  const mockExif = {
    camera: 'Sony Alpha α7R V',
    lens: 'FE 24-70mm F2.8 GM II',
    focalLength: '50mm',
    aperture: 'f/2.8',
    shutterSpeed: '1/250s',
    iso: 'ISO 100',
    colorSpace: 'sRGB / Rec.709 Wide Gamut',
    bitDepth: '16-bit Floating Precision',
    creator: 'Alen Pepa',
    copyright: '© 2026 Alen Pepa. PhotoPower Studio.',
  };

  const copyExifSummary = () => {
    const summary = `PhotoPower EXIF Info:
Resolution: ${canvasWidth} x ${canvasHeight} (${totalMegapixels} MP)
Camera: ${mockExif.camera}
Lens: ${mockExif.lens}
Focal Length: ${mockExif.focalLength} | Aperture: ${mockExif.aperture} | Shutter: ${mockExif.shutterSpeed} | ISO: ${mockExif.iso}
Color Space: ${mockExif.colorSpace}
Creator: ${mockExif.creator}
Copyright: ${mockExif.copyright}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-sky-400" />
          <h3 className="font-bold text-slate-100 text-sm">EXIF & Metadata Inspector</h3>
        </div>
        <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded font-mono">
          {totalMegapixels} MP
        </span>
      </div>

      {/* Canvas Dimensions & Technical Specs */}
      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2">
        <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
          <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
          <span>Canvas Specifications</span>
        </h4>
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="bg-slate-950 p-2 rounded border border-white/5">
            <span className="text-slate-500 block text-[9px]">DIMENSIONS</span>
            <span className="text-slate-200 font-bold">{canvasWidth} × {canvasHeight} px</span>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-white/5">
            <span className="text-slate-500 block text-[9px]">RESOLUTION</span>
            <span className="text-sky-400 font-bold">{totalMegapixels} Megapixels</span>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-white/5">
            <span className="text-slate-500 block text-[9px]">PROJECT LAYERS</span>
            <span className="text-emerald-400 font-bold">{layerCount} Active Layers</span>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-white/5">
            <span className="text-slate-500 block text-[9px]">BIT DEPTH</span>
            <span className="text-purple-400 font-bold">16-Bit Float</span>
          </div>
        </div>
      </div>

      {/* Camera Shot Parameters */}
      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2.5">
        <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-sky-400" />
          <span>Camera & Lens Profile</span>
        </h4>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Camera Body:</span>
            <span className="font-mono text-slate-200 font-semibold">{mockExif.camera}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Lens Glass:</span>
            <span className="font-mono text-slate-200">{mockExif.lens}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Focal Length:</span>
            <span className="font-mono text-sky-400">{mockExif.focalLength}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Aperture:</span>
            <span className="font-mono text-amber-400">{mockExif.aperture}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Shutter Speed:</span>
            <span className="font-mono text-emerald-400">{mockExif.shutterSpeed}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">ISO Speed:</span>
            <span className="font-mono text-indigo-400">{mockExif.iso}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Color Profile:</span>
            <span className="font-mono text-purple-400">{mockExif.colorSpace}</span>
          </div>
        </div>
      </div>

      {/* Author & Copyright Info */}
      <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2">
        <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Copyright & Rights Management</span>
        </h4>
        <div className="text-[11px] space-y-1 font-mono text-slate-400">
          <div>Author: <strong className="text-slate-200">{mockExif.creator}</strong></div>
          <div className="text-[10px] text-slate-500">{mockExif.copyright}</div>
        </div>
      </div>

      {/* Copy Metadata Action */}
      <button
        onClick={copyExifSummary}
        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors border border-white/10"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
        <span>{copied ? 'Metadata Summary Copied!' : 'Copy EXIF Metadata'}</span>
      </button>
    </div>
  );
};
