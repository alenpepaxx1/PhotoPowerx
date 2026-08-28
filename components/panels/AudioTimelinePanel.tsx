/**
 * PhotoPower - Advanced Photo & Video Studio
 * Audio Timeline & Sound FX Generator
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Plus,
  Trash2,
  Sliders,
  Disc,
  Upload,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react';

interface AudioTrackItem {
  id: string;
  name: string;
  category: 'music' | 'sfx' | 'ambient' | 'voice';
  src?: string;
  isPlaying: boolean;
  volume: number; // 0 to 1
  isMuted: boolean;
}

export const AudioTimelinePanel: React.FC = () => {
  const { pushHistory } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tracks, setTracks] = useState<AudioTrackItem[]>([
    {
      id: 'track-1',
      name: 'Cinematic Atmosphere Ambient',
      category: 'ambient',
      isPlaying: false,
      volume: 0.8,
      isMuted: false,
    },
    {
      id: 'track-2',
      name: 'Lo-Fi Chill Hop Beat',
      category: 'music',
      isPlaying: false,
      volume: 0.7,
      isMuted: false,
    },
    {
      id: 'track-3',
      name: 'Vintage Vinyl Crackle & Rain',
      category: 'sfx',
      isPlaying: false,
      volume: 0.4,
      isMuted: false,
    },
  ]);

  const [masterVolume, setMasterVolume] = useState(0.85);
  const [isMasterMuted, setIsMasterMuted] = useState(false);

  // Web Audio Context Synthesizer Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeOscillatorRef = useRef<OscillatorNode | null>(null);

  const toggleTrackPlay = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.isPlaying;
          if (nextState) {
            playSynthTone(440);
          } else {
            stopSynthTone();
          }
          return { ...t, isPlaying: nextState };
        }
        return t;
      })
    );
  };

  const playSynthTone = (freq: number = 440) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (activeOscillatorRef.current) {
        activeOscillatorRef.current.stop();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15 * masterVolume, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      activeOscillatorRef.current = osc;
    } catch (e) {
      console.warn('AudioContext initialized:', e);
    }
  };

  const stopSynthTone = () => {
    if (activeOscillatorRef.current) {
      activeOscillatorRef.current.stop();
      activeOscillatorRef.current = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);

    selected.forEach((file) => {
      const newTrack: AudioTrackItem = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'music',
        src: URL.createObjectURL(file),
        isPlaying: false,
        volume: 0.8,
        isMuted: false,
      };
      setTracks((prev) => [...prev, newTrack]);
    });
    pushHistory('Uploaded Audio Track');
  };

  const removeTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full text-slate-300 text-xs select-none">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-slate-100 text-sm">Audio Timeline & Sound FX</h3>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
          Stereo 48kHz
        </span>
      </div>

      {/* Master Volume Controls */}
      <div className="p-3 bg-slate-900 border border-white/10 rounded-2xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-xs">
            {isMasterMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>Master Output Gain</span>
          </span>
          <span className="font-mono text-emerald-400 font-bold">
            {isMasterMuted ? 'MUTED' : `${Math.round(masterVolume * 100)}%`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMasterMuted ? 0 : masterVolume}
            onChange={(e) => {
              setMasterVolume(Number(e.target.value));
              if (isMasterMuted) setIsMasterMuted(false);
            }}
            className="w-full accent-emerald-400 h-1 bg-slate-800 rounded cursor-pointer"
          />
          <button
            onClick={() => setIsMasterMuted(!isMasterMuted)}
            className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
              isMasterMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-slate-950 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {isMasterMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>

      {/* Upload Audio File */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-3 border border-dashed border-white/15 hover:border-emerald-500/50 bg-slate-950 rounded-xl text-center cursor-pointer transition-all flex items-center justify-center gap-2 group"
      >
        <Upload className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
        <span className="font-semibold text-slate-300 text-xs">Import Audio Track (MP3, WAV, AAC)</span>
      </div>

      {/* Track List */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">
          Timeline Audio Layers ({tracks.length})
        </h4>

        <div className="space-y-2">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`p-3 rounded-xl border transition-all space-y-2 ${
                track.isPlaying
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-900 border-white/5 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 truncate max-w-[180px]">
                  <button
                    onClick={() => toggleTrackPlay(track.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      track.isPlaying
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {track.isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>
                  <div className="truncate">
                    <div className="font-semibold text-xs truncate">{track.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{track.category}</div>
                  </div>
                </div>

                <button
                  onClick={() => removeTrack(track.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Volume Slider for track */}
              <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                <Volume2 className="w-3 h-3 text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={track.volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setTracks((prev) =>
                      prev.map((t) => (t.id === track.id ? { ...t, volume: v } : t))
                    );
                  }}
                  className="w-full accent-emerald-400 h-1 bg-slate-950 rounded cursor-pointer"
                />
                <span className="font-mono text-[10px] text-slate-400 w-8 text-right">
                  {Math.round(track.volume * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
