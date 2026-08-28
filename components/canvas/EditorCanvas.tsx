/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useEditor } from '@/context/EditorContext';
import { CanvasRenderer } from '@/lib/canvasRenderer';
import { Point, BrushStroke, Layer } from '@/types/editor';
import { CropOverlay } from './CropOverlay';

let activeCanvasElement: HTMLCanvasElement | null = null;

export function getCanvasContextData(): { canvas: HTMLCanvasElement | null } {
  return { canvas: activeCanvasElement };
}

export const EditorCanvas: React.FC = () => {
  const {
    layers,
    selectedLayerId,
    selectedLayer,
    activeTool,
    brushColor,
    setBrushColor,
    brushSize,
    brushOpacity,
    brushMode,
    retouchMode,
    retouchRadius,
    activeShape,
    globalAdjustments,
    toneCurves,
    colorWheels,
    hslState,
    opticalVfx,
    splitCompare,
    updateSplitCompare,
    canvasWidth,
    canvasHeight,
    zoom,
    setZoom,
    pan,
    setPan,
    mediaMode,
    videoState,
    updateVideoState,
    setCursorPos,
    setHoveredColor,
    setSelectedLayerId,
    updateLayer,
    addDrawingLayer,
    addTextLayer,
    addShapeLayer,
    pushHistory,
  } = useEditor();

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking state
  const isInteractingRef = useRef(false);
  const strokeCounterRef = useRef(0);
  const activeStrokeRef = useRef<BrushStroke | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; layerX: number; layerY: number; handle?: string } | null>(null);
  const isSpacePressedRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);
  const isDraggingSplitRef = useRef(false);

  // Convert client viewport coordinates to Canvas internal pixel coordinates
  const getCanvasCoords = useCallback(
    (e: React.MouseEvent | MouseEvent): Point => {
      if (!canvasRef.current || !containerRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasWidth / rect.width;
      const scaleY = canvasHeight / rect.height;

      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      return { x: Math.max(0, Math.min(canvasWidth, x)), y: Math.max(0, Math.min(canvasHeight, y)) };
    },
    [canvasHeight, canvasWidth]
  );

  // Main Render Routine
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    activeCanvasElement = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    CanvasRenderer.renderScene(
      ctx,
      canvasWidth,
      canvasHeight,
      layers,
      globalAdjustments,
      videoState.currentTime,
      {
        renderSelectionOutline: activeTool === 'select',
        selectedLayerId,
        toneCurves,
        colorWheels,
        hslState,
        opticalVfx,
        splitCompare,
      }
    );
  }, [activeTool, canvasHeight, canvasWidth, colorWheels, globalAdjustments, hslState, layers, opticalVfx, selectedLayerId, splitCompare, toneCurves, videoState.currentTime]);

  // Video Animation & Render Loop
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      // If video is playing, advance time and sync video elements
      if (videoState.isPlaying && mediaMode === 'video') {
        const videoLayer = layers.find((l) => l.type === 'video' && l.videoElement);
        if (videoLayer && videoLayer.videoElement) {
          const vid = videoLayer.videoElement;
          if (vid.paused) {
            vid.play().catch(() => {});
          }
          vid.playbackRate = videoState.playbackRate || 1;
          vid.volume = videoState.muted ? 0 : videoState.volume;

          const curr = vid.currentTime;
          if (curr >= videoState.trimEnd) {
            if (videoState.loop) {
              vid.currentTime = videoState.trimStart;
            } else {
              vid.pause();
              updateVideoState({ isPlaying: false });
            }
          } else {
            updateVideoState({ currentTime: curr });
          }
        }
      }

      renderCanvas();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [layers, mediaMode, renderCanvas, updateVideoState, videoState.isPlaying, videoState.loop, videoState.muted, videoState.playbackRate, videoState.trimEnd, videoState.trimStart, videoState.volume]);

  // Listen to Spacebar for quick hand tool pan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        isSpacePressedRef.current = true;
        setIsPanning(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom((z) => Math.max(0.2, Math.min(4, z * zoomFactor)));
    } else {
      // Pan canvas
      setPan((p) => ({
        x: p.x - e.deltaX * 0.8,
        y: p.y - e.deltaY * 0.8,
      }));
    }
  };

  // Mouse Down handler
  const handleMouseDown = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    isInteractingRef.current = true;

    // Split Compare divider dragging
    if (splitCompare.active) {
      const splitX = canvasWidth * splitCompare.position;
      if (Math.abs(coords.x - splitX) < 32 || e.shiftKey) {
        isDraggingSplitRef.current = true;
        updateSplitCompare({ position: Math.max(0.01, Math.min(0.99, coords.x / canvasWidth)) });
        return;
      }
    }

    // Pan with Hand tool or spacebar
    if (activeTool === 'hand' || isSpacePressedRef.current || e.button === 1) {
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        layerX: pan.x,
        layerY: pan.y,
      };
      return;
    }

    // Eyedropper Tool
    if (activeTool === 'eyedropper') {
      sampleColor(coords.x, coords.y);
      return;
    }

    // Brush & Eraser Tools
    if (activeTool === 'brush' || activeTool === 'eraser') {
      let drawingLayer = layers.find(
        (l) => l.id === selectedLayerId && l.type === 'drawing' && !l.locked
      );

      if (!drawingLayer) {
        // Automatically create drawing layer if not active
        const newLayerId = addDrawingLayer();
        drawingLayer = layers.find((l) => l.id === newLayerId);
      }

      if (drawingLayer) {
        strokeCounterRef.current += 1;
        const strokeId = `stroke-${strokeCounterRef.current}`;
        const newStroke: BrushStroke = {
          id: strokeId,
          points: [coords],
          color: activeTool === 'eraser' ? '#14171d' : brushColor,
          size: brushSize,
          opacity: brushOpacity,
          brushMode: activeTool === 'eraser' ? 'round' : brushMode,
        };

        activeStrokeRef.current = newStroke;
        const currentStrokes = drawingLayer.drawingStrokes || [];
        updateLayer(drawingLayer.id, {
          drawingStrokes: [...currentStrokes, newStroke],
        });
      }
      return;
    }

    // Retouch Tool (Healing, Smoothing, Dodge, Burn)
    if (activeTool === 'retouch') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          CanvasRenderer.applyRetouch(ctx, coords.x, coords.y, retouchRadius, retouchMode);
        }
      }
      return;
    }

    // Text Tool - Click to spawn text box
    if (activeTool === 'text') {
      addTextLayer('PhotoPower');
      return;
    }

    // Shape Tool - Click to spawn shape
    if (activeTool === 'shape') {
      addShapeLayer(activeShape);
      return;
    }

    // Move & Transform Tool (Selection)
    if (activeTool === 'select') {
      // Find top-most layer under click
      let hitLayer: Layer | null = null;
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        if (!l.visible || l.locked) continue;
        if (
          coords.x >= l.x &&
          coords.x <= l.x + l.width &&
          coords.y >= l.y &&
          coords.y <= l.y + l.height
        ) {
          hitLayer = l;
          break;
        }
      }

      if (hitLayer) {
        setSelectedLayerId(hitLayer.id);
        dragStartRef.current = {
          x: coords.x,
          y: coords.y,
          layerX: hitLayer.x,
          layerY: hitLayer.y,
        };
      } else {
        setSelectedLayerId(null);
      }
    }
  };

  // Mouse Move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const coords = getCanvasCoords(e);
    setCursorPos(coords);

    // Live color inspector preview
    sampleColor(coords.x, coords.y, true);

    if (!isInteractingRef.current) return;

    // Split Compare wiping
    if (isDraggingSplitRef.current && splitCompare.active) {
      updateSplitCompare({ position: Math.max(0.01, Math.min(0.99, coords.x / canvasWidth)) });
      return;
    }

    // Pan with Hand
    if (activeTool === 'hand' || isSpacePressedRef.current) {
      if (dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        setPan({
          x: dragStartRef.current.layerX + dx,
          y: dragStartRef.current.layerY + dy,
        });
      }
      return;
    }

    // Brush Stroke appending
    if (
      (activeTool === 'brush' || activeTool === 'eraser') &&
      activeStrokeRef.current &&
      selectedLayer &&
      selectedLayer.type === 'drawing'
    ) {
      activeStrokeRef.current.points.push(coords);
      const strokes = selectedLayer.drawingStrokes || [];
      const updatedStrokes = strokes.map((s) =>
        s.id === activeStrokeRef.current?.id ? { ...activeStrokeRef.current } : s
      );
      updateLayer(selectedLayer.id, { drawingStrokes: updatedStrokes });
      return;
    }

    // Retouch continuous stroke
    if (activeTool === 'retouch') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          CanvasRenderer.applyRetouch(ctx, coords.x, coords.y, retouchRadius, retouchMode, 0.25);
        }
      }
      return;
    }

    // Move Layer
    if (activeTool === 'select' && selectedLayer && dragStartRef.current) {
      const dx = coords.x - dragStartRef.current.x;
      const dy = coords.y - dragStartRef.current.y;

      updateLayer(selectedLayer.id, {
        x: Math.round(dragStartRef.current.layerX + dx),
        y: Math.round(dragStartRef.current.layerY + dy),
      });
    }
  };

  // Mouse Up handler
  const handleMouseUp = () => {
    if (isInteractingRef.current) {
      if (activeTool === 'brush' || activeTool === 'eraser') {
        pushHistory(`Brush Stroke (${brushMode})`);
      } else if (activeTool === 'select' && selectedLayer && dragStartRef.current) {
        pushHistory(`Move ${selectedLayer.name}`);
      } else if (activeTool === 'retouch') {
        pushHistory(`Retouch ${retouchMode}`);
      }
    }

    isInteractingRef.current = false;
    isDraggingSplitRef.current = false;
    activeStrokeRef.current = null;
    dragStartRef.current = null;
  };

  // Color sampling helper
  const sampleColor = (x: number, y: number, isHoverOnly = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)}`;

      setHoveredColor(hex);
      if (!isHoverOnly) {
        // Set as active brush color
        setBrushColor(hex);
      }
    } catch {
      // Cross-origin fallback
    }
  };

  // Cursor style generator
  const getCursorStyle = () => {
    if (isPanning || activeTool === 'hand') return 'cursor-grab active:cursor-grabbing';
    if (activeTool === 'brush' || activeTool === 'eraser' || activeTool === 'retouch') return 'cursor-crosshair';
    if (activeTool === 'eyedropper') return 'cursor-crosshair';
    if (activeTool === 'text') return 'cursor-text';
    if (activeTool === 'zoom') return 'cursor-zoom-in';
    return 'cursor-default';
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`flex-1 bg-[#111111] overflow-hidden relative flex items-center justify-center select-none ${getCursorStyle()}`}
      style={{
        backgroundImage: `
          radial-gradient(#262626 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      {/* Zoom / Pan Container */}
      <div
        className="transition-transform duration-75 origin-center shadow-2xl relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {/* Transparent grid backing behind canvas */}
        <div
          className="absolute inset-0 z-0 pointer-events-none rounded border border-[#222] shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(45deg, #141414 25%, transparent 25%), linear-gradient(-45deg, #141414 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #141414 75%), linear-gradient(-45deg, transparent 75%, #141414 75%)`,
            backgroundSize: `20px 20px`,
            backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`,
            backgroundColor: `#0A0A0A`,
          }}
        />

        {/* Master Canvas */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="relative z-10 block rounded shadow-2xl"
        />

        {/* Interactive Crop Overlay */}
        <CropOverlay canvasRef={canvasRef} />
      </div>

      {/* Floating Canvas Overlay Helpers (Resolution Tag & Zoom HUD) */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
        <span className="px-2.5 py-1 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#333] rounded text-[10px] font-mono text-[#888] shadow">
          {canvasWidth} × {canvasHeight}px
        </span>
        <span className="px-2 py-1 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#333] rounded text-[10px] font-mono text-blue-400 shadow">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
};
