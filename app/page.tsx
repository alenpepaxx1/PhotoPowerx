/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useEffect } from 'react';
import { EditorProvider, useEditor } from '@/context/EditorContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toolbar, ToolOptionsBar } from '@/components/toolbar/Toolbar';
import { EditorCanvas } from '@/components/canvas/EditorCanvas';
import { RightSidebar } from '@/components/panels/RightSidebar';
import { VideoTimeline } from '@/components/timeline/VideoTimeline';
import { AiMagicModal } from '@/components/modals/AiMagicModal';
import { ExportModal } from '@/components/modals/ExportModal';
import { AboutModal } from '@/components/modals/AboutModal';
import { SamplePickerModal } from '@/components/modals/SamplePickerModal';
import { BatchProcessingModal } from '@/components/modals/BatchProcessingModal';
import { LutExportModal } from '@/components/modals/LutExportModal';

const PhotoPowerStudio: React.FC = () => {
  const {
    setActiveTool,
    undo,
    redo,
    selectedLayer,
    deleteLayer,
    setIsExportModalOpen,
    setIsAboutModalOpen,
    setZoom,
    setBrushColor,
    mediaMode,
    isLutModalOpen,
    setIsLutModalOpen,
  } = useEditor();

  // Master Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger tool shortcuts when typing in inputs or textareas
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      // Undo / Redo (Ctrl+Z / Ctrl+Y)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      // Export Shortcut (Ctrl+E)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
        return;
      }

      // Delete selected layer
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayer) {
          e.preventDefault();
          deleteLayer(selectedLayer.id);
        }
        return;
      }

      // Tool Switch Keys
      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('select');
          break;
        case 'c':
          setActiveTool('crop');
          break;
        case 'b':
          setActiveTool('brush');
          break;
        case 'e':
          setActiveTool('eraser');
          break;
        case 's':
          setActiveTool('retouch');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'u':
          setActiveTool('shape');
          break;
        case 'i':
          setActiveTool('eyedropper');
          break;
        case 'h':
          setActiveTool('hand');
          break;
        case 'z':
          setActiveTool('zoom');
          break;
        case 'd':
          setBrushColor('#3b82f6');
          break;
        case '?':
          setIsAboutModalOpen(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteLayer, redo, selectedLayer, setActiveTool, setBrushColor, setIsAboutModalOpen, setIsExportModalOpen, undo]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050505] text-[#E0E0E0] overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header />

      {/* Tool Context Options Bar */}
      <ToolOptionsBar />

      {/* Main Workspace Area: Left Toolbar + Viewport Canvas + Right Sidebar */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Vertical Left Toolbar */}
        <Toolbar />

        {/* Center Editing Viewport & Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <EditorCanvas />
          <VideoTimeline />
        </main>

        {/* Right Inspector & Layers Sidebar */}
        <RightSidebar />
      </div>

      {/* Footer with Status & Alen Pepa Copyright */}
      <Footer />

      {/* Global Studio Modals */}
      <AiMagicModal />
      <ExportModal />
      <AboutModal />
      <SamplePickerModal />
      <BatchProcessingModal />
      <LutExportModal isOpen={isLutModalOpen} onClose={() => setIsLutModalOpen(false)} />
    </div>
  );
};

export default function Page() {
  return (
    <EditorProvider>
      <PhotoPowerStudio />
    </EditorProvider>
  );
}
