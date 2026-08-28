/**
 * PhotoPower - Advanced Photo & Video Studio
 * User Custom Presets Manager (LocalStorage + Export/Import)
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */

import { Adjustments, ToneCurvesState, ColorWheelsState, HslColorState, OpticalVfxState } from "@/types/editor";

export interface CustomUserPreset {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  adjustments: Adjustments;
  toneCurves?: ToneCurvesState;
  colorWheels?: ColorWheelsState;
  hslState?: HslColorState;
  opticalVfx?: OpticalVfxState;
}

const STORAGE_KEY = 'photopower_user_presets_v1';

export function loadUserPresetsFromStorage(): CustomUserPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load user presets:', err);
    return [];
  }
}

export function saveUserPresetToStorage(preset: Omit<CustomUserPreset, 'id' | 'createdAt'>): CustomUserPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = loadUserPresetsFromStorage();
    const newPreset: CustomUserPreset = {
      ...preset,
      id: `preset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPreset, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save user preset:', err);
    return [];
  }
}

export function deleteUserPresetFromStorage(id: string): CustomUserPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = loadUserPresetsFromStorage();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete user preset:', err);
    return [];
  }
}
