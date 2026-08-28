/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor, RightPanelTab } from '@/context/EditorContext';
import { LayersPanel } from './LayersPanel';
import { AdjustmentsPanel } from './AdjustmentsPanel';
import { ToneCurvesPanel } from './ToneCurvesPanel';
import { ColorWheelsPanel } from './ColorWheelsPanel';
import { OpticalVfxPanel } from './OpticalVfxPanel';
import { HslPanel } from './HslPanel';
import { FiltersPanel } from './FiltersPanel';
import { TextInspector } from './TextInspector';
import { ShapeInspector } from './ShapeInspector';
import { RetouchInspector } from './RetouchInspector';
import { HistoryPanel } from './HistoryPanel';
import { HistogramPanel } from './HistogramPanel';
import { PresetStorePanel } from './PresetStorePanel';
import { WatermarkPanel } from './WatermarkPanel';
import { ExifMetadataPanel } from './ExifMetadataPanel';
import { ScopeMonitorPanel } from './ScopeMonitorPanel';
import { MaskingPanel } from './MaskingPanel';
import { AudioTimelinePanel } from './AudioTimelinePanel';
import { FormatStudioPanel } from './FormatStudioPanel';
import { DenoisePanel } from './DenoisePanel';
import { PerspectivePanel } from './PerspectivePanel';
import { ColorMatchPanel } from './ColorMatchPanel';
import { CropStudioPanel } from './CropStudioPanel';
import { RelightingPanel } from './RelightingPanel';
import { DepthBokehPanel } from './DepthBokehPanel';
import { AiObjectEraserPanel } from './AiObjectEraserPanel';
import { AiSkyReplacementPanel } from './AiSkyReplacementPanel';
import {
  Layers,
  Crop as CropIcon,
  Sliders,
  TrendingUp,
  SlidersHorizontal,
  Zap,
  Palette,
  Sparkles,
  Type,
  Square,
  History,
  Film,
  Bookmark,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Stamp,
  Camera,
  Gauge,
  Focus,
  Music,
  FileType,
  CloudOff,
  Maximize2,
  Lightbulb,
  Aperture,
  Wand2,
  CloudSun,
} from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const { activeRightPanel, setActiveRightPanel } = useEditor();
  const [showHistogram, setShowHistogram] = useState(true);

  const tabs: { id: RightPanelTab; label: string; icon: React.ElementType }[] = [
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'crop', label: 'Crop', icon: CropIcon },
    { id: 'adjustments', label: 'Adjust', icon: Sliders },
    { id: 'eraser', label: 'AI Eraser', icon: Wand2 },
    { id: 'sky', label: 'AI Sky', icon: CloudSun },
    { id: 'relighting', label: '3D Light', icon: Lightbulb },
    { id: 'bokeh', label: 'Bokeh', icon: Aperture },
    { id: 'denoise', label: 'Denoise', icon: CloudOff },
    { id: 'perspective', label: '3D Lens', icon: Maximize2 },
    { id: 'colormatch', label: 'Color Match', icon: Palette },
    { id: 'formats', label: 'Formats', icon: FileType },
    { id: 'masking', label: 'AI Mask', icon: Focus },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'curves', label: 'Curves', icon: TrendingUp },
    { id: 'colorwheels', label: 'Grading', icon: SlidersHorizontal },
    { id: 'scopes', label: 'Scopes', icon: Gauge },
    { id: 'vfx', label: 'VFX', icon: Zap },
    { id: 'filters', label: 'LUTs', icon: Film },
    { id: 'presets', label: 'Presets', icon: Bookmark },
    { id: 'retouch', label: 'Retouch', icon: Sparkles },
    { id: 'watermark', label: 'Stamp', icon: Stamp },
    { id: 'exif', label: 'EXIF', icon: Camera },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'shape', label: 'Shapes', icon: Square },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="w-80 bg-[#0a0d14] border-l border-white/5 flex flex-col h-full select-none z-20 shrink-0">
      {/* Top Tab Bar */}
      <div className="flex items-center border-b border-white/5 bg-[#0d111a] px-1 overflow-x-auto no-scrollbar scroll-smooth">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRightPanel === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveRightPanel(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-2.5 text-[11px] font-medium transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-sky-400 text-sky-300 bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
              title={tab.label}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span className="font-mono text-[10px] uppercase tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Collapsible Live Scopes Header Toggle */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#080a0f] border-b border-white/5 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
          <span>Real-time Scopes</span>
        </div>
        <button
          onClick={() => setShowHistogram(!showHistogram)}
          className="p-0.5 hover:text-white rounded transition-colors"
        >
          {showHistogram ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showHistogram && <HistogramPanel />}

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-hidden bg-[#0a0d14]">
        {activeRightPanel === 'layers' && <LayersPanel />}
        {activeRightPanel === 'crop' && <CropStudioPanel />}
        {activeRightPanel === 'adjustments' && <AdjustmentsPanel />}
        {activeRightPanel === 'eraser' && <AiObjectEraserPanel />}
        {activeRightPanel === 'sky' && <AiSkyReplacementPanel />}
        {activeRightPanel === 'relighting' && <RelightingPanel />}
        {activeRightPanel === 'bokeh' && <DepthBokehPanel />}
        {activeRightPanel === 'denoise' && <DenoisePanel />}
        {activeRightPanel === 'perspective' && <PerspectivePanel />}
        {activeRightPanel === 'colormatch' && <ColorMatchPanel />}
        {activeRightPanel === 'formats' && <FormatStudioPanel />}
        {activeRightPanel === 'masking' && <MaskingPanel />}
        {activeRightPanel === 'audio' && <AudioTimelinePanel />}
        {activeRightPanel === 'curves' && <ToneCurvesPanel />}
        {activeRightPanel === 'colorwheels' && <ColorWheelsPanel />}
        {activeRightPanel === 'scopes' && <ScopeMonitorPanel />}
        {activeRightPanel === 'vfx' && <OpticalVfxPanel />}
        {activeRightPanel === 'filters' && <FiltersPanel />}
        {activeRightPanel === 'presets' && <PresetStorePanel />}
        {activeRightPanel === 'retouch' && <RetouchInspector />}
        {activeRightPanel === 'watermark' && <WatermarkPanel />}
        {activeRightPanel === 'exif' && <ExifMetadataPanel />}
        {activeRightPanel === 'text' && <TextInspector />}
        {activeRightPanel === 'shape' && <ShapeInspector />}
        {activeRightPanel === 'history' && <HistoryPanel />}
      </div>
    </aside>
  );
};
