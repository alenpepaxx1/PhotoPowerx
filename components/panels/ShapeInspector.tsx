/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { ShapeType, ShapeProperties } from '@/types/editor';
import {
  Square,
  Circle,
  Triangle,
  Star,
  ArrowRight,
  Minus,
  Heart,
  MessageSquare,
  Plus
} from 'lucide-react';

export const ShapeInspector: React.FC = () => {
  const {
    selectedLayer,
    updateLayer,
    addShapeLayer,
    activeShape,
    setActiveShape,
    shapeFill,
    setShapeFill,
    shapeStroke,
    setShapeStroke,
    shapeStrokeWidth,
    setShapeStrokeWidth,
    shapeCornerRadius,
    setShapeCornerRadius,
  } = useEditor();

  const isShapeLayer = selectedLayer && selectedLayer.type === 'shape' && selectedLayer.shapeProps;
  const props = selectedLayer?.shapeProps;

  const handleUpdate = (partial: Partial<ShapeProperties>) => {
    if (!selectedLayer || !props) return;
    updateLayer(selectedLayer.id, {
      shapeProps: { ...props, ...partial },
    });
  };

  const shapesList: { id: ShapeType; label: string; icon: React.ElementType }[] = [
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'rounded-rect', label: 'Rounded Rect', icon: Square },
    { id: 'circle', label: 'Circle / Oval', icon: Circle },
    { id: 'triangle', label: 'Triangle', icon: Triangle },
    { id: 'star', label: 'Star', icon: Star },
    { id: 'arrow', label: 'Arrow', icon: ArrowRight },
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'heart', label: 'Heart', icon: Heart },
    { id: 'callout', label: 'Speech Bubble', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-xs select-none p-3 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
          <Square className="w-3.5 h-3.5 text-emerald-400" />
          <span>Vector Shape Inspector</span>
        </span>
      </div>

      {/* Preset Shape Selector */}
      <div className="space-y-1.5">
        <label className="text-[#666] text-[11px]">Choose Shape:</label>
        <div className="grid grid-cols-3 gap-1.5">
          {shapesList.map((s) => {
            const Icon = s.icon;
            const isCurrent = (props?.shapeType || activeShape) === s.id;

            return (
              <button
                key={s.id}
                onClick={() => {
                  setActiveShape(s.id);
                  if (isShapeLayer) {
                    handleUpdate({ shapeType: s.id });
                  } else {
                    addShapeLayer(s.id);
                  }
                }}
                className={`p-2 rounded border flex flex-col items-center gap-1 transition-all ${
                  isCurrent
                    ? 'bg-[#1A1A1A] border-blue-500 text-blue-400'
                    : 'bg-[#151515] border-[#222] text-[#888] hover:border-[#333] hover:bg-[#1A1A1A] hover:text-[#E0E0E0]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] truncate max-w-full">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shape Properties Form */}
      <div className="space-y-3 p-2.5 bg-[#151515] rounded border border-[#222]">
        <span className="text-[11px] font-semibold text-[#E0E0E0]">Fill & Stroke</span>

        {/* Fill Color */}
        <div className="flex items-center justify-between">
          <label className="text-[#666] text-[11px]">Fill Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={props?.fillColor || shapeFill}
              onChange={(e) => {
                setShapeFill(e.target.value);
                if (isShapeLayer) handleUpdate({ fillColor: e.target.value });
              }}
              className="w-6 h-6 rounded border border-[#333] bg-transparent cursor-pointer"
            />
            <span className="font-mono text-[10px] text-[#aaa]">
              {props?.fillColor || shapeFill}
            </span>
          </div>
        </div>

        {/* Stroke Color & Width */}
        <div className="space-y-1.5 pt-1 border-t border-[#222]">
          <div className="flex items-center justify-between">
            <label className="text-[#666] text-[11px]">Stroke Color:</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={props?.strokeColor || shapeStroke}
                onChange={(e) => {
                  setShapeStroke(e.target.value);
                  if (isShapeLayer) handleUpdate({ strokeColor: e.target.value });
                }}
                className="w-6 h-6 rounded border border-[#333] bg-transparent cursor-pointer"
              />
              <span className="font-mono text-[10px] text-[#aaa]">
                {props?.strokeColor || shapeStroke}
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[#666] text-[11px]">
              <span>Stroke Width:</span>
              <span className="font-mono text-[#aaa]">
                {props?.strokeWidth ?? shapeStrokeWidth}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={props?.strokeWidth ?? shapeStrokeWidth}
              onChange={(e) => {
                const val = Number(e.target.value);
                setShapeStrokeWidth(val);
                if (isShapeLayer) handleUpdate({ strokeWidth: val });
              }}
              className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Corner Radius (for rounded rects) */}
        <div className="space-y-1 pt-1 border-t border-[#222]">
          <div className="flex justify-between text-[#666] text-[11px]">
            <span>Corner Radius:</span>
            <span className="font-mono text-[#aaa]">
              {props?.cornerRadius ?? shapeCornerRadius}px
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="60"
            value={props?.cornerRadius ?? shapeCornerRadius}
            onChange={(e) => {
              const val = Number(e.target.value);
              setShapeCornerRadius(val);
              if (isShapeLayer) handleUpdate({ cornerRadius: val });
            }}
            className="w-full accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
          />
        </div>
      </div>

      <button
        onClick={() => addShapeLayer(activeShape)}
        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold shadow-md shadow-blue-900/20 transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Shape to Canvas</span>
      </button>
    </div>
  );
};
