'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { Check } from 'lucide-react';

interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const CropOverlay: React.FC<{ canvasRef: React.RefObject<HTMLCanvasElement | null> }> = ({ canvasRef }) => {
  const { activeTool, canvasWidth, canvasHeight, setCanvasSize, setLayers, pushHistory, setActiveTool } = useEditor();

  const [cropBox, setCropBox] = useState<CropBox>(() => ({
    x: Math.round(canvasWidth * 0.05),
    y: Math.round(canvasHeight * 0.05),
    width: Math.round(canvasWidth * 0.9),
    height: Math.round(canvasHeight * 0.9),
  }));

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; box: CropBox } | null>(null);

  // Sync crop box size when canvas dimensions change externally
  const prevDimRef = useRef({ w: canvasWidth, h: canvasHeight });
  useEffect(() => {
    if (prevDimRef.current.w !== canvasWidth || prevDimRef.current.h !== canvasHeight) {
      prevDimRef.current = { w: canvasWidth, h: canvasHeight };
      setCropBox({
        x: Math.round(canvasWidth * 0.05),
        y: Math.round(canvasHeight * 0.05),
        width: Math.round(canvasWidth * 0.9),
        height: Math.round(canvasHeight * 0.9),
      });
    }
  }, [canvasWidth, canvasHeight]);

  const handleMouseDown = (e: React.MouseEvent, handleName: string | null = null) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setActiveHandle(handleName);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      box: { ...cropBox },
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;

      const deltaX = (e.clientX - dragStartRef.current.mouseX) * scaleX;
      const deltaY = (e.clientY - dragStartRef.current.mouseY) * scaleY;
      const origBox = dragStartRef.current.box;

      let newX = origBox.x;
      let newY = origBox.y;
      let newW = origBox.width;
      let newH = origBox.height;

      if (activeHandle === 'move') {
        newX = Math.max(0, Math.min(canvasWidth - origBox.width, origBox.x + deltaX));
        newY = Math.max(0, Math.min(canvasHeight - origBox.height, origBox.y + deltaY));
      } else if (activeHandle === 'nw') {
        newX = Math.max(0, Math.min(origBox.x + origBox.width - 20, origBox.x + deltaX));
        newY = Math.max(0, Math.min(origBox.y + origBox.height - 20, origBox.y + deltaY));
        newW = origBox.width + (origBox.x - newX);
        newH = origBox.height + (origBox.y - newY);
      } else if (activeHandle === 'ne') {
        newY = Math.max(0, Math.min(origBox.y + origBox.height - 20, origBox.y + deltaY));
        newW = Math.max(20, Math.min(canvasWidth - origBox.x, origBox.width + deltaX));
        newH = origBox.height + (origBox.y - newY);
      } else if (activeHandle === 'se') {
        newW = Math.max(20, Math.min(canvasWidth - origBox.x, origBox.width + deltaX));
        newH = Math.max(20, Math.min(canvasHeight - origBox.y, origBox.height + deltaY));
      } else if (activeHandle === 'sw') {
        newX = Math.max(0, Math.min(origBox.x + origBox.width - 20, origBox.x + deltaX));
        newW = origBox.width + (origBox.x - newX);
        newH = Math.max(20, Math.min(canvasHeight - origBox.y, origBox.height + deltaY));
      } else if (activeHandle === 'n') {
        newY = Math.max(0, Math.min(origBox.y + origBox.height - 20, origBox.y + deltaY));
        newH = origBox.height + (origBox.y - newY);
      } else if (activeHandle === 's') {
        newH = Math.max(20, Math.min(canvasHeight - origBox.y, origBox.height + deltaY));
      } else if (activeHandle === 'w') {
        newX = Math.max(0, Math.min(origBox.x + origBox.width - 20, origBox.x + deltaX));
        newW = origBox.width + (origBox.x - newX);
      } else if (activeHandle === 'e') {
        newW = Math.max(20, Math.min(canvasWidth - origBox.x, origBox.width + deltaX));
      }

      setCropBox({
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newW),
        height: Math.round(newH),
      });
    },
    [activeHandle, canvasHeight, canvasRef, canvasWidth, isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const commitCrop = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cropX = cropBox.x;
    const cropY = cropBox.y;
    const cropW = cropBox.width;
    const cropH = cropBox.height;

    const croppedData = ctx.getImageData(cropX, cropY, cropW, cropH);

    setCanvasSize(cropW, cropH);

    setLayers((prev) =>
      prev.map((l) => ({
        ...l,
        x: l.x - cropX,
        y: l.y - cropY,
      }))
    );

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.width = cropW;
        canvasRef.current.height = cropH;
        const newCtx = canvasRef.current.getContext('2d');
        if (newCtx) newCtx.putImageData(croppedData, 0, 0);
      }
    }, 50);

    pushHistory(`Cropped Canvas to ${cropW} × ${cropH} px`);
    setActiveTool('select');
  };

  if (activeTool !== 'crop') return null;

  // Percentages for absolute positioning
  const leftPct = (cropBox.x / canvasWidth) * 100;
  const topPct = (cropBox.y / canvasHeight) * 100;
  const widthPct = (cropBox.width / canvasWidth) * 100;
  const heightPct = (cropBox.height / canvasHeight) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-30">
      {/* Dimmed Vignette Mask Outside Crop Box */}
      <svg className="w-full h-full absolute inset-0">
        <defs>
          <mask id="crop-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={`${leftPct}%`}
              y={`${topPct}%`}
              width={`${widthPct}%`}
              height={`${heightPct}%`}
              fill="black"
            />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.65)" mask="url(#crop-mask)" />
      </svg>

      {/* Interactive Crop Box Container */}
      <div
        className="absolute border-2 border-cyan-400 shadow-2xl pointer-events-auto cursor-move"
        style={{
          left: `${leftPct}%`,
          top: `${topPct}%`,
          width: `${widthPct}%`,
          height: `${heightPct}%`,
        }}
        onMouseDown={(e) => handleMouseDown(e, 'move')}
      >
        {/* Rule of Thirds Gridlines */}
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none border border-cyan-400/40">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-white/25" />
          ))}
        </div>

        {/* Live Dimension Badge & Quick Action Pill */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] px-3 py-1 rounded-full shadow-lg flex items-center gap-2 backdrop-blur-md">
          <span className="font-bold text-white">
            {cropBox.width} × {cropBox.height} px
          </span>
          <span className="text-[10px] text-cyan-400">
            ({(cropBox.width / cropBox.height).toFixed(2)}:1)
          </span>
          <button
            onClick={commitCrop}
            className="ml-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 transition-all"
          >
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Apply</span>
          </button>
        </div>

        {/* Corner Handles (NW, NE, SE, SW) */}
        <div
          className="w-4 h-4 bg-white border-2 border-cyan-500 absolute -top-2 -left-2 cursor-nwse-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'nw')}
        />
        <div
          className="w-4 h-4 bg-white border-2 border-cyan-500 absolute -top-2 -right-2 cursor-nesw-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'ne')}
        />
        <div
          className="w-4 h-4 bg-white border-2 border-cyan-500 absolute -bottom-2 -right-2 cursor-nwse-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'se')}
        />
        <div
          className="w-4 h-4 bg-white border-2 border-cyan-500 absolute -bottom-2 -left-2 cursor-nesw-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'sw')}
        />

        {/* Edge Handles (N, E, S, W) */}
        <div
          className="w-6 h-2 bg-white border border-cyan-500 absolute -top-1 left-1/2 -translate-x-1/2 cursor-ns-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'n')}
        />
        <div
          className="w-2 h-6 bg-white border border-cyan-500 absolute top-1/2 -right-1 -translate-y-1/2 cursor-ew-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'e')}
        />
        <div
          className="w-6 h-2 bg-white border border-cyan-500 absolute -bottom-1 left-1/2 -translate-x-1/2 cursor-ns-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 's')}
        />
        <div
          className="w-2 h-6 bg-white border border-cyan-500 absolute top-1/2 -left-1 -translate-y-1/2 cursor-ew-resize rounded-sm shadow-md pointer-events-auto"
          onMouseDown={(e) => handleMouseDown(e, 'w')}
        />
      </div>
    </div>
  );
};
