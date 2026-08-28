/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState, useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Sparkles,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Image as ImageIcon,
  Video,
  FolderOpen,
  HelpCircle,
  Wand2,
  Layers,
  Sliders,
  Palette,
  FileCode,
  RotateCcw,
  Sparkle,
  Film,
  FileType,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    projectName,
    setProjectName,
    undo,
    redo,
    historyIndex,
    history,
    zoom,
    setZoom,
    setPan,
    mediaMode,
    setMediaMode,
    setIsExportModalOpen,
    setIsAiModalOpen,
    setIsAboutModalOpen,
    setIsSamplePickerOpen,
    loadUserFile,
    resetProject,
    addTextLayer,
    addShapeLayer,
    addDrawingLayer,
    activeRightPanel,
    setActiveRightPanel,
    setIsBatchModalOpen,
    setIsLutModalOpen,
  } = useEditor();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadUserFile(file);
    }
    if (e.target) e.target.value = '';
    setActiveMenu(null);
  };

  const toggleMenu = (name: string) => {
    setActiveMenu(activeMenu === name ? null : name);
  };

  return (
    <header className="h-11 bg-[#0A0A0A] border-b border-[#222] px-3 flex items-center justify-between text-xs text-[#E0E0E0] select-none z-30 relative shrink-0">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Left: Brand + Menus */}
      <div className="flex items-center gap-3">
        {/* Brand Logo & Author badge */}
        <div
          onClick={() => setIsAboutModalOpen(true)}
          className="flex items-center gap-2.5 pr-3 border-r border-[#222] cursor-pointer group"
          title="PhotoPower by Alen Pepa — Click for About & Shortcuts"
        >
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
            <span className="font-bold text-white text-xs tracking-tighter">P</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-tighter text-blue-500 text-sm group-hover:text-blue-400 transition-colors">
                PhotoPower
              </span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[#1A1A1A] text-[#888] border border-[#333] font-mono font-medium">
                v2.5
              </span>
            </div>
            <span className="text-[9px] text-[#666] group-hover:text-[#888] leading-none">
              by <strong className="text-[#888] font-medium">Alen Pepa</strong>
            </span>
          </div>
        </div>

        {/* Top Menubar */}
        <nav className="flex items-center space-x-1 text-xs font-medium text-[#888]">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('file')}
              className={`px-2.5 py-1 rounded hover:bg-[#1A1A1A] hover:text-white transition-colors ${
                activeMenu === 'file' ? 'bg-[#1A1A1A] text-white' : ''
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div
                className="absolute top-full left-0 mt-1 w-52 bg-[#111111] border border-[#333] rounded shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setActiveMenu(null)}
              >
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                  <span>Open Image / Video...</span>
                </button>
                <button
                  onClick={() => setIsSamplePickerOpen(true)}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Browse Sample Media...</span>
                </button>
                <button
                  onClick={() => setIsBatchModalOpen(true)}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Batch Processing Studio...</span>
                </button>
                <button
                  onClick={() => setIsLutModalOpen(true)}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <Film className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Export 3D LUT (.cube)...</span>
                </button>
                <button
                  onClick={() => setActiveRightPanel('formats')}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <FileType className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Format Studio & Color Profiles...</span>
                </button>
                <div className="my-1 border-t border-[#222]" />
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-blue-500" />
                    <span>Export / Save Media...</span>
                  </span>
                  <kbd className="text-[10px] text-[#666]">Ctrl+E</kbd>
                </button>
                <div className="my-1 border-t border-[#222]" />
                <button
                  onClick={resetProject}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-red-950/40 text-[#888] hover:text-red-400"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New / Reset Canvas</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('edit')}
              className={`px-2.5 py-1 rounded hover:bg-[#1A1A1A] hover:text-white transition-colors ${
                activeMenu === 'edit' ? 'bg-[#1A1A1A] text-white' : ''
              }`}
            >
              Edit
            </button>
            {activeMenu === 'edit' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-[#111111] border border-[#333] rounded shadow-2xl py-1 z-50"
                onClick={() => setActiveMenu(null)}
              >
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white disabled:opacity-30"
                >
                  <span>Undo</span>
                  <kbd className="text-[10px] text-[#666]">Ctrl+Z</kbd>
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className="w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white disabled:opacity-30"
                >
                  <span>Redo</span>
                  <kbd className="text-[10px] text-[#666]">Ctrl+Y</kbd>
                </button>
              </div>
            )}
          </div>

          {/* Layer Menu */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('layer')}
              className={`px-2.5 py-1 rounded hover:bg-[#1A1A1A] hover:text-white transition-colors ${
                activeMenu === 'layer' ? 'bg-[#1A1A1A] text-white' : ''
              }`}
            >
              Layer
            </button>
            {activeMenu === 'layer' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-[#111111] border border-[#333] rounded shadow-2xl py-1 z-50"
                onClick={() => setActiveMenu(null)}
              >
                <button
                  onClick={() => addTextLayer('PhotoPower Text')}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <span>New Text Layer</span>
                </button>
                <button
                  onClick={() => addShapeLayer('rectangle')}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <span>New Shape Layer</span>
                </button>
                <button
                  onClick={addDrawingLayer}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#1A1A1A] text-[#E0E0E0] hover:text-white"
                >
                  <span>New Paint Layer</span>
                </button>
              </div>
            )}
          </div>

          {/* Filter Menu */}
          <button
            onClick={() => setActiveRightPanel('filters')}
            className="px-2.5 py-1 rounded hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            Filters
          </button>

          {/* AI Tools Menu */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-2.5 py-1 rounded bg-blue-950/40 text-blue-400 hover:bg-blue-900/40 border border-blue-800/50 flex items-center gap-1.5 transition-colors font-medium ml-1"
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>AI Studio</span>
          </button>
        </nav>
      </div>

      {/* Center: Project Title & Mode Toggle & Live Sync Badge */}
      <div className="flex items-center gap-3">
        {/* Live Sync Badge matching Sophisticated Dark Spec */}
        <div className="h-6 px-2 bg-[#1A1A1A] rounded flex items-center border border-[#333]">
          <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-2 shadow-[0_0_6px_rgba(59,130,246,0.8)]"></div>
          <span className="text-[10px] text-[#aaa]">Live Sync</span>
        </div>

        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-[#151515] border border-[#222] hover:border-[#333] focus:border-blue-500/80 rounded px-2.5 py-0.5 text-xs text-[#E0E0E0] text-center font-medium focus:outline-none max-w-[200px] truncate"
          title="Click to rename project"
        />

        {/* Media Mode Tabs */}
        <div className="flex items-center bg-[#151515] p-0.5 rounded border border-[#222]">
          <button
            onClick={() => setMediaMode('photo')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mediaMode === 'photo'
                ? 'bg-blue-600 text-white shadow'
                : 'text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Photo</span>
          </button>
          <button
            onClick={() => setMediaMode('video')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              mediaMode === 'video'
                ? 'bg-purple-600 text-white shadow'
                : 'text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>Video</span>
          </button>
        </div>
      </div>

      {/* Right: History, Zoom, Sample Presets & Export CTA */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center border border-[#222] rounded bg-[#151515]">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1.5 hover:bg-[#1A1A1A] text-[#888] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 hover:bg-[#1A1A1A] text-[#888] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors border-l border-[#222]"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[#151515] border border-[#222] rounded px-1.5 py-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.25, z - 0.15))}
            className="p-0.5 hover:bg-[#1A1A1A] rounded text-[#888] hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="text-[10px] font-mono text-[#aaa] cursor-pointer px-1 hover:text-blue-400"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(4, z + 0.15))}
            className="p-0.5 hover:bg-[#1A1A1A] rounded text-[#888] hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Batch Processing Studio */}
        <button
          onClick={() => setIsBatchModalOpen(true)}
          className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-sky-400 hover:text-sky-300 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
          title="Batch Processing Studio for multiple photos"
        >
          <Layers className="w-3 h-3" />
          <span>Batch</span>
        </button>

        {/* Sample Library */}
        <button
          onClick={() => setIsSamplePickerOpen(true)}
          className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#222] border border-[#333] text-[#E0E0E0] rounded text-xs font-medium transition-colors"
          title="Choose high-res sample photos & videos"
        >
          Samples
        </button>

        {/* Export Button CTA */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold shadow-lg shadow-blue-900/20 transition-all hover:scale-102"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* About / Help */}
        <button
          onClick={() => setIsAboutModalOpen(true)}
          className="p-1 text-[#888] hover:text-white hover:bg-[#1A1A1A] border border-transparent hover:border-[#333] rounded transition-colors"
          title="About PhotoPower & Author Alen Pepa"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
