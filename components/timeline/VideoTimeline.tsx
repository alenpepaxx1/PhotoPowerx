/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useRef } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Camera,
  Scissors,
  Download,
  Film,
  Sparkles,
  Gauge
} from 'lucide-react';

export const VideoTimeline: React.FC = () => {
  const {
    mediaMode,
    videoState,
    updateVideoState,
    layers,
    canvasWidth,
    canvasHeight,
    isRecordingVideo,
    setIsRecordingVideo,
    setIsExportModalOpen,
  } = useEditor();

  const timelineTrackRef = useRef<HTMLDivElement>(null);

  // If in photo mode, don't show or show collapsed bar
  if (mediaMode !== 'video') return null;

  // Format seconds to 00:00.00
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    const nextPlay = !videoState.isPlaying;
    const videoLayer = layers.find((l) => l.type === 'video' && l.videoElement);
    if (videoLayer && videoLayer.videoElement) {
      if (nextPlay) {
        videoLayer.videoElement.play().catch(() => {});
      } else {
        videoLayer.videoElement.pause();
      }
    }
    updateVideoState({ isPlaying: nextPlay });
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineTrackRef.current) return;
    const rect = timelineTrackRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const targetTime = Math.max(0, Math.min(videoState.duration, pos * videoState.duration));

    const videoLayer = layers.find((l) => l.type === 'video' && l.videoElement);
    if (videoLayer && videoLayer.videoElement) {
      videoLayer.videoElement.currentTime = targetTime;
    }
    updateVideoState({ currentTime: targetTime });
  };

  const stepFrame = (frames: number) => {
    const fps = videoState.fps || 30;
    const delta = frames / fps;
    const targetTime = Math.max(0, Math.min(videoState.duration, videoState.currentTime + delta));

    const videoLayer = layers.find((l) => l.type === 'video' && l.videoElement);
    if (videoLayer && videoLayer.videoElement) {
      videoLayer.videoElement.currentTime = targetTime;
    }
    updateVideoState({ currentTime: targetTime });
  };

  // Capture current canvas frame as high-res photo download
  const captureFrameSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `PhotoPower-Frame-${Math.round(videoState.currentTime)}s-by-Alen-Pepa.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="h-28 bg-[#0A0A0A] border-t border-[#222] px-4 py-2 flex flex-col justify-between select-none z-20">
      {/* Top Controls Row */}
      <div className="flex items-center justify-between text-xs">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back 1 Frame */}
          <button
            onClick={() => stepFrame(-1)}
            className="p-1.5 rounded bg-[#151515] border border-[#222] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E0E0E0] transition-colors"
            title="Step Back 1 Frame"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Master Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            title="Play / Pause (Space)"
          >
            {videoState.isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          {/* Step Forward 1 Frame */}
          <button
            onClick={() => stepFrame(1)}
            className="p-1.5 rounded bg-[#151515] border border-[#222] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E0E0E0] transition-colors"
            title="Step Forward 1 Frame"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Timecode Readout */}
          <div className="font-mono text-xs bg-[#151515] px-2.5 py-1 rounded border border-[#222] text-[#E0E0E0]">
            <span className="text-blue-400 font-bold">{formatTime(videoState.currentTime)}</span>
            <span className="text-[#555] mx-1">/</span>
            <span className="text-[#888]">{formatTime(videoState.duration)}</span>
          </div>

          {/* Loop Toggle */}
          <button
            onClick={() => updateVideoState({ loop: !videoState.loop })}
            className={`p-1.5 rounded border text-xs flex items-center gap-1 transition-colors ${
              videoState.loop
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-[#151515] border-[#222] text-[#888] hover:text-[#E0E0E0]'
            }`}
            title="Loop Playback"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[10px]">Loop</span>
          </button>
        </div>

        {/* Center: Playback Speed */}
        <div className="flex items-center gap-2">
          <span className="text-[#666] text-[11px] flex items-center gap-1">
            <Gauge className="w-3 h-3 text-[#666]" />
            <span>Speed:</span>
          </span>
          <div className="flex items-center bg-[#151515] p-0.5 rounded border border-[#222]">
            {[0.5, 1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                onClick={() => updateVideoState({ playbackRate: spd })}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                  videoState.playbackRate === spd
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-[#888] hover:text-[#E0E0E0]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Right: Audio Volume & Snapshot */}
        <div className="flex items-center gap-3">
          {/* Audio Volume */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateVideoState({ muted: !videoState.muted })}
              className="text-[#888] hover:text-[#E0E0E0]"
            >
              {videoState.muted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={videoState.muted ? 0 : videoState.volume}
              onChange={(e) => updateVideoState({ volume: Number(e.target.value), muted: false })}
              className="w-16 accent-blue-500 h-1 bg-[#222] rounded cursor-pointer"
            />
          </div>

          {/* Capture Snapshot Frame Button */}
          <button
            onClick={captureFrameSnapshot}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#151515] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E0E0E0] rounded border border-[#222] text-xs transition-colors"
            title="Export exact current video frame as PNG"
          >
            <Camera className="w-3.5 h-3.5 text-blue-400" />
            <span>Snapshot Frame</span>
          </button>

          {/* Export Video CTA */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-medium shadow-md shadow-purple-500/20 text-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Video</span>
          </button>
        </div>
      </div>

      {/* Timeline Scrubber Track */}
      <div className="space-y-1 mt-2">
        <div
          ref={timelineTrackRef}
          onClick={handleSeek}
          className="relative h-10 bg-[#080808] rounded border border-[#222] cursor-pointer overflow-hidden group shadow-inner"
        >
          {/* Filmstrip Ticks pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, #38bdf8 0, #38bdf8 2px, transparent 0, transparent 20px)`,
            }}
          />

          {/* In-Out Trim Range Indicator */}
          <div
            className="absolute top-0 bottom-0 bg-blue-500/15 border-x-2 border-blue-400 pointer-events-none"
            style={{
              left: `${(videoState.trimStart / videoState.duration) * 100}%`,
              width: `${((videoState.trimEnd - videoState.trimStart) / videoState.duration) * 100}%`,
            }}
          />

          {/* Played Progress Bar */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600/30 to-blue-500/50 pointer-events-none"
            style={{
              width: `${(videoState.currentTime / videoState.duration) * 100}%`,
            }}
          />

          {/* Playhead Red Needle Scrubber */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10"
            style={{
              left: `${(videoState.currentTime / videoState.duration) * 100}%`,
            }}
          >
            <div className="w-3 h-3 bg-red-500 rounded-full -translate-x-[5px] -translate-y-1 shadow border border-white" />
          </div>
        </div>

        {/* Trim Markers Info */}
        <div className="flex justify-between text-[10px] text-[#555] font-mono px-1">
          <span>Start: {formatTime(videoState.trimStart)}</span>
          <span className="text-[#666]">Click anywhere on the timeline to scrub frames</span>
          <span>End: {formatTime(videoState.trimEnd)}</span>
        </div>
      </div>
    </div>
  );
};
