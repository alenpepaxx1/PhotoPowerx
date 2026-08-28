/**
 * PhotoPower - Advanced Photo & Video Studio
 * Created by Alen Pepa. All rights reserved.
 * Copyright © 2026 Alen Pepa.
 */
'use client';

import React from 'react';
import { useEditor } from '@/context/EditorContext';
import { History, Undo2, Redo2, Clock, CheckCircle2 } from 'lucide-react';

export const HistoryPanel: React.FC = () => {
  const { history, historyIndex, jumpToHistory, undo, redo } = useEditor();

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-xs select-none p-3 space-y-3">
      {/* Header with Undo / Redo */}
      <div className="flex items-center justify-between">
        <span className="font-semibold text-[#E0E0E0] flex items-center gap-1.5">
          <History className="w-3.5 h-3.5 text-blue-400" />
          <span>History Stack</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1 rounded bg-[#151515] border border-[#222] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E0E0E0] disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 rounded bg-[#151515] border border-[#222] hover:bg-[#1A1A1A] text-[#888] hover:text-[#E0E0E0] disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* History Stack List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 bg-[#080808] p-1.5 rounded border border-[#222]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[#555] text-center">
            <Clock className="w-6 h-6 mb-1 opacity-30" />
            <p>Initial Canvas State</p>
          </div>
        ) : (
          history.map((state, idx) => {
            const isCurrent = idx === historyIndex;
            const isUndone = idx > historyIndex;

            return (
              <div
                key={state.id}
                onClick={() => jumpToHistory(idx)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#1A1A1A] text-white border border-[#333] font-medium shadow-sm'
                    : isUndone
                    ? 'text-[#555] hover:bg-[#121212] line-through opacity-50'
                    : 'text-[#888] hover:text-[#E0E0E0] hover:bg-[#151515]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#444] shrink-0" />
                  )}
                  <span className="truncate">{state.actionName}</span>
                </div>
                <span className="font-mono text-[10px] opacity-60 shrink-0 text-[#888]">
                  {new Date(state.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="text-[10px] text-[#666] text-center">
        Click any historical step to instantly jump back in time.
      </div>
    </div>
  );
};
