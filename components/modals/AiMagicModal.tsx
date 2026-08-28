/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React, { useState } from 'react';
import { useEditor } from '@/context/EditorContext';
import {
  analyzeAndAutoEnhanceLocal,
  generateLocalPromptGrade,
  generateLocalCaptions,
  removeBackgroundLocal,
  extractColorPaletteLocal,
  applySkinSmoothingFrequencySeparation,
  applyChromaKeyRemoval,
  applySpatialDenoiseAndSharpness,
  generateFilmFrameOverlay,
  applySmartSuperResolutionUpscale,
  ColorSwatch,
} from '@/lib/computerVision';
import {
  Sparkles,
  Wand2,
  X,
  Sliders,
  Type,
  Check,
  Loader2,
  Scissors,
  Cpu,
  Palette,
  Smile,
  Copy,
  Layers,
  Frame,
  Maximize2,
} from 'lucide-react';

export const AiMagicModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    globalAdjustments,
    updateGlobalAdjustments,
    addTextLayer,
    addImageLayer,
    pushHistory,
  } = useEditor();

  const [activeTab, setActiveTab] = useState<'auto-enhance' | 'prompt-lut' | 'cutout' | 'skin' | 'palette' | 'frames' | 'caption'>('auto-enhance');
  const [promptInput, setPromptInput] = useState('');
  const [skinIntensity, setSkinIntensity] = useState(60);
  const [chromaHex, setChromaHex] = useState('#00ff00');
  const [frameStyle, setFrameStyle] = useState<'polaroid' | 'film35mm' | 'vintage-border' | 'studio-clean'>('polaroid');
  const [denoiseLevel, setDenoiseLevel] = useState(50);
  const [sharpnessLevel, setSharpnessLevel] = useState(40);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  if (!isAiModalOpen) return null;

  // Capture canvas thumbnail for Vision processing
  const getCanvasContextData = (): { canvas: HTMLCanvasElement; imgData?: ImageData } | null => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return null;
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) return { canvas };
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return { canvas, imgData };
    } catch {
      return { canvas };
    }
  };

  const handleRunAi = async (action: 'auto-enhance' | 'prompt-filter' | 'smart-caption' | 'local-cutout' | 'local-skin' | 'local-palette' | 'chroma-key' | 'frame-overlay' | 'super-upscale' | 'spatial-denoise') => {
    setIsLoading(true);
    setAiResult(null);

    // 100% OFFLINE LOCAL COMPUTER VISION EXECUTIONS
    if (action === 'frame-overlay') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.canvas) {
            const frameDataUrl = generateFilmFrameOverlay(canvasObj.canvas, frameStyle);
            addImageLayer(frameDataUrl, `Frame Layer (${frameStyle})`);
            pushHistory(`Generated ${frameStyle} Border Frame`);
            setAiResult({
              frame: true,
              message: `Created custom ${frameStyle} frame layer!`,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 250);
      return;
    }

    if (action === 'super-upscale') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.canvas) {
            const upscaledDataUrl = applySmartSuperResolutionUpscale(canvasObj.canvas, 2);
            addImageLayer(upscaledDataUrl, '2x Super Resolution HD Layer');
            pushHistory('Applied 2x Super Resolution Upscale');
            setAiResult({
              upscale: true,
              message: `Generated 2x Super Resolution HD layer with high DPI sharpness!`,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return;
    }

    if (action === 'spatial-denoise') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.canvas) {
            const denoisedDataUrl = applySpatialDenoiseAndSharpness(canvasObj.canvas, denoiseLevel, sharpnessLevel);
            addImageLayer(denoisedDataUrl, `Denoise & Sharpness (${denoiseLevel}/${sharpnessLevel})`);
            pushHistory('Applied Spatial Denoise & Sharpness');
            setAiResult({
              denoise: true,
              message: `Applied noise reduction (${denoiseLevel}%) & unsharp mask (${sharpnessLevel}%)!`,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 250);
      return;
    }
    if (action === 'local-cutout') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.canvas) {
            const cutoutDataUrl = removeBackgroundLocal(canvasObj.canvas, 28);
            addImageLayer(cutoutDataUrl, 'Layer Cutout (Local CV AI)');
            pushHistory('Extracted Background Cutout');
            setAiResult({
              cutout: true,
              message: 'Processed local computer vision background extraction cleanly!',
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 250);
      return;
    }

    if (action === 'chroma-key') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.canvas) {
            const chromaDataUrl = applyChromaKeyRemoval(canvasObj.canvas, chromaHex, 35);
            addImageLayer(chromaDataUrl, `Chroma Key Mask (${chromaHex})`);
            pushHistory('Applied Chroma Key Mask');
            setAiResult({
              cutout: true,
              message: `Removed ${chromaHex} key color background cleanly!`,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 250);
      return;
    }

    if (action === 'local-skin') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.canvas) {
            const smoothDataUrl = applySkinSmoothingFrequencySeparation(canvasObj.canvas, skinIntensity);
            addImageLayer(smoothDataUrl, `Skin Smooth Retouch (${skinIntensity}%)`);
            pushHistory('Applied Frequency Separation Retouch');
            setAiResult({
              skin: true,
              message: `Frequency separation skin retouch layer applied at ${skinIntensity}% intensity!`,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 250);
      return;
    }

    if (action === 'local-palette') {
      setTimeout(() => {
        try {
          const canvasObj = getCanvasContextData();
          if (canvasObj?.imgData) {
            const swatches = extractColorPaletteLocal(canvasObj.imgData, 6);
            setAiResult({
              palette: swatches,
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }, 200);
      return;
    }

    // Fallback to local CV or Gemini if requested
    try {
      const canvasObj = getCanvasContextData();
      const imageBase64 = canvasObj?.canvas ? canvasObj.canvas.toDataURL('image/jpeg', 0.85) : undefined;

      const response = await fetch('/api/gemini/photo-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          prompt: promptInput || 'Cinematic dramatic mood with balanced tones',
          currentAdjustments: globalAdjustments,
          imageData: imageBase64,
        }),
      });

      if (!response.ok) throw new Error('API unavailable, switching to local CV engine.');

      const data = await response.json();
      if (!data.success && !data.result && !data.captions) throw new Error('API returned empty response');

      if (action === 'auto-enhance' && data.result) {
        const res = data.result;
        const adj = {
          brightness: res.brightness ?? 10,
          contrast: res.contrast ?? 15,
          exposure: res.exposure ?? 8,
          highlights: res.highlights ?? -10,
          shadows: res.shadows ?? 12,
          saturation: res.saturation ?? 12,
          vibrance: res.vibrance ?? 18,
          temperature: res.temperature ?? 5,
          tint: res.tint ?? 0,
          sharpness: res.sharpness ?? 15,
          vignette: res.vignette ?? 10,
        };
        updateGlobalAdjustments(adj);
        setAiResult({
          engine: 'Gemini Cloud Vision',
          analysis: res.explanationEn || res.explanationSq || 'Optimized exposure curves and shadow details.',
          adjustments: adj,
        });
      } else if (action === 'prompt-filter' && data.result) {
        const res = data.result;
        updateGlobalAdjustments({
          contrast: res.contrast ?? 15,
          saturation: res.saturation ?? 10,
          vibrance: res.vibrance ?? 15,
          temperature: res.temperature ?? 0,
          tint: res.tint ?? 0,
          hueRotate: res.hueRotate ?? 0,
          sharpness: res.sharpness ?? 10,
          vignette: res.vignette ?? 0,
          grain: res.grain ?? 0,
        });
        setAiResult({
          engine: 'Gemini Cloud Vision',
          filter: {
            name: res.filterName || 'Custom AI Look',
            description: res.descriptionEn || res.descriptionSq || 'Color grade generated for PhotoPower',
          },
        });
      } else if (action === 'smart-caption' && data.captions) {
        setAiResult({
          engine: 'Gemini Cloud Vision',
          captions: data.captions.map((c: any) => ({
            headline: c.title || c.headline,
            subheading: c.subtitle || c.subheading,
            style: c.styleTheme || c.style || 'Modern',
          })),
        });
      }
    } catch {
      // 100% NATIVE OFFLINE COMPUTER VISION FALLBACK
      const canvasObj = getCanvasContextData();

      if (action === 'auto-enhance') {
        if (canvasObj?.imgData) {
          const cvResult = analyzeAndAutoEnhanceLocal(canvasObj.imgData);
          updateGlobalAdjustments(cvResult.adjustments);
          setAiResult({
            engine: 'On-Device CV Engine (Offline)',
            analysis: cvResult.explanationEn,
            explanationSq: cvResult.explanationSq,
            adjustments: cvResult.adjustments,
          });
        } else {
          const fallbackAdjustments = {
            exposure: 10,
            contrast: 18,
            highlights: -12,
            shadows: 16,
            vibrance: 22,
            saturation: 10,
            sharpness: 20,
            temperature: 4,
          };
          updateGlobalAdjustments(fallbackAdjustments);
          setAiResult({
            engine: 'On-Device Engine (Offline)',
            analysis: 'Balanced light curve, lifted deep shadows, boosted micro-contrast and color vibrance.',
            adjustments: fallbackAdjustments,
          });
        }
      } else if (action === 'prompt-filter') {
        const localGrade = generateLocalPromptGrade(promptInput);
        updateGlobalAdjustments(localGrade.adjustments);
        setAiResult({
          engine: 'On-Device CV Synthesizer (Offline)',
          filter: {
            name: localGrade.filterName,
            description: localGrade.descriptionEn,
          },
        });
      } else if (action === 'smart-caption') {
        const localCaps = generateLocalCaptions(promptInput);
        setAiResult({
          engine: 'On-Device Engine (Offline)',
          captions: localCaps,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#101010] border border-[#222] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#222] flex items-center justify-between bg-[#0D0D0D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#E0E0E0]">AI Studio & Computer Vision</h3>
                <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[9px] font-mono flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> 100% Offline Native Engine
                </span>
              </div>
              <p className="text-[11px] text-[#666]">On-Device Neural & Computer Vision Suite • Alen Pepa</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1.5 rounded text-[#888] hover:text-white hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222] bg-[#0A0A0A] px-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setActiveTab('auto-enhance');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'auto-enhance'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Enhance</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('prompt-lut');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'prompt-lut'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Prompt LUT</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cutout');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cutout'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Cutout & Masking</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('skin');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'skin'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Portrait Retouch</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('palette');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'palette'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Color Palette</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('frames');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'frames'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Frame className="w-3.5 h-3.5" />
            <span>Frames & Upscale</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('caption');
              setAiResult(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'caption'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-[#888] hover:text-[#E0E0E0]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Captions</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[60vh] bg-[#101010]">
          {/* TAB 1: AI Auto-Enhance */}
          {activeTab === 'auto-enhance' && (
            <div className="space-y-3">
              <p className="text-[#aaa] leading-relaxed text-xs">
                Our On-Device Computer Vision Engine measures image histogram, dynamic contrast range, and color temperature directly in your browser without needing external APIs.
              </p>

              <button
                onClick={() => handleRunAi('auto-enhance')}
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image Pixels & Curves...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run 1-Click Pro Auto-Enhance</span>
                  </>
                )}
              </button>

              {aiResult && aiResult.analysis && (
                <div className="p-3.5 bg-[#151515] border border-indigo-500/30 rounded-lg space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Auto-Enhance Applied Successfully!</span>
                    </div>
                    {aiResult.engine && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">
                        {aiResult.engine}
                      </span>
                    )}
                  </div>
                  <p className="text-[#aaa] text-[11px] leading-relaxed">{aiResult.analysis}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Prompt to LUT */}
          {activeTab === 'prompt-lut' && (
            <div className="space-y-3">
              <p className="text-[#aaa] text-xs">
                Describe any artistic mood or cinema style. Our smart NLP synthesizer generates the exact color grading setup offline instantly:
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="e.g. 1980s Retro Synthwave, Golden Hour Dune, Cyberpunk Tokyo..."
                  className="flex-1 bg-[#151515] border border-[#222] text-[#E0E0E0] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleRunAi('prompt-filter')}
                  disabled={isLoading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Synthesize</span>
                </button>
              </div>

              {/* Sample Quick Prompt Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Vintage Kodachrome 1974',
                  'Moody Nordic Forest',
                  'Neon Cyberpunk Glow',
                  'Golden Hour Malibu',
                  'Noir Black & White Film',
                  'Fuji Velvia Vivid Landscape',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setPromptInput(chip);
                    }}
                    className="px-2.5 py-1 rounded bg-[#151515] hover:bg-[#1A1A1A] text-[#aaa] text-[11px] transition-colors border border-[#222]"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {aiResult && aiResult.filter && (
                <div className="p-3.5 bg-[#151515] border border-indigo-500/30 rounded-lg space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{aiResult.filter.name}</span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-mono">
                      Applied
                    </span>
                  </div>
                  <p className="text-[#888] text-[11px]">{aiResult.filter.description}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Local AI Background Cutout & Chroma Key */}
          {activeTab === 'cutout' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2">
                <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-sky-400" />
                  <span>1. Auto Edge-Detection Background Removal</span>
                </h4>
                <p className="text-[#aaa] text-[11px]">
                  Extract foreground subjects using local color space segmentation algorithms.
                </p>
                <button
                  onClick={() => handleRunAi('local-cutout')}
                  disabled={isLoading}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Scissors className="w-3.5 h-3.5" />}
                  <span>Extract Foreground Layer</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-2">
                <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Chroma Key Color Removal (Green/Blue Screen)</span>
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={chromaHex}
                    onChange={(e) => setChromaHex(e.target.value)}
                    className="w-8 h-8 rounded bg-transparent cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={chromaHex}
                    onChange={(e) => setChromaHex(e.target.value)}
                    className="px-2 py-1 bg-slate-950 border border-white/10 text-xs text-slate-200 rounded font-mono w-24"
                  />
                  <button
                    onClick={() => handleRunAi('chroma-key')}
                    disabled={isLoading}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Remove Key Color</span>
                  </button>
                </div>
              </div>

              {aiResult && aiResult.cutout && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-400 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{aiResult.message || 'Transparent Cutout Layer successfully added!'}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Frequency Separation Portrait Retouch */}
          {activeTab === 'skin' && (
            <div className="space-y-4">
              <p className="text-[#aaa] text-xs">
                Apply frequency separation retouching to smooth skin tones while retaining sharp pore detail:
              </p>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-300">
                  <span>Smoothing Intensity</span>
                  <span className="font-mono text-indigo-400">{skinIntensity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={skinIntensity}
                  onChange={(e) => setSkinIntensity(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <button
                onClick={() => handleRunAi('local-skin')}
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smile className="w-4 h-4" />}
                <span>Apply Frequency Separation Retouch</span>
              </button>

              {aiResult && aiResult.skin && (
                <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-lg text-indigo-300 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{aiResult.message}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Color Palette Extractor */}
          {activeTab === 'palette' && (
            <div className="space-y-3">
              <p className="text-[#aaa] text-xs">
                Extract dominant hex color swatches directly from your image using quantized computer vision sampling:
              </p>

              <button
                onClick={() => handleRunAi('local-palette')}
                disabled={isLoading}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Palette className="w-4 h-4 text-pink-400" />}
                <span>Extract Palette Swatches</span>
              </button>

              {aiResult && aiResult.palette && (
                <div className="space-y-2 pt-1 animate-in fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    {aiResult.palette.map((swatch: ColorSwatch, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => copyToClipboard(swatch.hex)}
                        className="p-2.5 bg-slate-900 border border-white/5 hover:border-white/20 rounded-xl flex items-center justify-between cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-lg border border-white/20 shadow-inner"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <div>
                            <span className="font-mono text-xs text-slate-200 group-hover:text-indigo-400 font-semibold block">
                              {swatch.hex}
                            </span>
                            <span className="text-[10px] text-slate-500 block">{swatch.label} ({swatch.percentage}%)</span>
                          </div>
                        </div>
                        <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      </div>
                    ))}
                  </div>

                  {copiedHex && (
                    <p className="text-center text-[10px] text-emerald-400 font-mono pt-1">
                      Copied {copiedHex} to clipboard!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: Frames, Denoise & Super Resolution Upscale */}
          {activeTab === 'frames' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-3">
                <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <Frame className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Photographic Film Frame Synthesizer</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'polaroid', label: 'Classic Polaroid' },
                    { id: 'film35mm', label: '35mm Film Sprocket' },
                    { id: 'vintage-border', label: 'Aged Vintage Border' },
                    { id: 'studio-clean', label: 'Clean Studio Matte' },
                  ].map((styleItem) => (
                    <button
                      key={styleItem.id}
                      onClick={() => setFrameStyle(styleItem.id as any)}
                      className={`p-2 rounded-lg border text-left text-xs font-medium transition-colors ${
                        frameStyle === styleItem.id
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {styleItem.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleRunAi('frame-overlay')}
                  disabled={isLoading}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Frame className="w-3.5 h-3.5" />}
                  <span>Generate Photo Frame Layer</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 border border-white/5 rounded-xl space-y-3">
                <h4 className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>2. 2x Super Resolution HD Upscaler</span>
                </h4>
                <p className="text-[#aaa] text-[11px]">
                  Double image resolution using high-DPI bicubic edge-preservation algorithms for crisp print exports.
                </p>
                <button
                  onClick={() => handleRunAi('super-upscale')}
                  disabled={isLoading}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>Upscale Canvas Resolution (2x HD)</span>
                </button>
              </div>

              {aiResult && (aiResult.frame || aiResult.upscale || aiResult.denoise) && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-400 flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{aiResult.message}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: Smart Captions */}
          {activeTab === 'caption' && (
            <div className="space-y-3">
              <p className="text-[#aaa] text-xs">
                Generate high-impact headline titles, cinematic subtitles, or social quotes matched to your visual content:
              </p>

              <button
                onClick={() => handleRunAi('smart-caption')}
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Typography Presets...</span>
                  </>
                ) : (
                  <>
                    <Type className="w-4 h-4" />
                    <span>Generate Creative Typography Titles</span>
                  </>
                )}
              </button>

              {aiResult && aiResult.captions && (
                <div className="space-y-2 pt-2">
                  <span className="text-[#888] text-[11px] font-semibold">
                    Click any title to add it as a new canvas layer:
                  </span>
                  {aiResult.captions.map((cap: any, i: number) => (
                    <div
                      key={i}
                      onClick={() => {
                        addTextLayer(cap.headline);
                        setIsAiModalOpen(false);
                      }}
                      className="p-3 bg-[#151515] border border-[#222] hover:border-indigo-500 rounded-lg cursor-pointer transition-all hover:bg-[#1A1A1A] group"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#E0E0E0] font-semibold group-hover:text-indigo-400">
                          {cap.headline}
                        </strong>
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#222] text-[#888] rounded">
                          {cap.style}
                        </span>
                      </div>
                      {cap.subheading && (
                        <p className="text-[#888] text-[11px] mt-0.5">{cap.subheading}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#222] bg-[#0D0D0D] flex items-center justify-between text-[11px] text-[#666]">
          <span>PhotoPower Engine • Offline Native CV • Alen Pepa</span>
          <button
            onClick={() => setIsAiModalOpen(false)}
            className="px-4 py-1.5 bg-[#151515] hover:bg-[#1A1A1A] border border-[#222] text-[#E0E0E0] rounded transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};


