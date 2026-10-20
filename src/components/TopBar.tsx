import React from 'react';
import { Sparkles } from 'lucide-react';

interface TopBarProps {
  onBloomClick: () => void;
  onMemoriesClick: () => void;
  onThemesClick: () => void;
  onDedicationClick: () => void;
  onActionClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onBloomClick,
  onMemoriesClick,
  onThemesClick,
  onDedicationClick,
  onActionClick
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between gap-8 border-b border-rose-100/80 bg-white/70 px-4 py-3.5 backdrop-blur-md sm:px-8">
      {/* Zone 1: Single text element Brand wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBloomClick();
        }}
        className="text-lg font-extrabold tracking-tight text-rose-950 whitespace-nowrap shrink-0 flex items-center gap-2"
      >
        <span className="text-xl">🌸</span>
        <span>Vườn Hoa Kỷ Niệm</span>
      </a>

      {/* Zone 2: 4 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-rose-700/90">
        <button
          onClick={onBloomClick}
          className="hover:text-rose-950 hover:underline transition-colors whitespace-nowrap shrink-0"
        >
          Nở Hoa
        </button>
        <button
          onClick={onMemoriesClick}
          className="hover:text-rose-950 hover:underline transition-colors whitespace-nowrap shrink-0"
        >
          Cánh Hoa Kỷ Niệm
        </button>
        <button
          onClick={onThemesClick}
          className="hover:text-rose-950 hover:underline transition-colors whitespace-nowrap shrink-0"
        >
          Sắc Hoa
        </button>
        <button
          onClick={onDedicationClick}
          className="hover:text-rose-950 hover:underline transition-colors whitespace-nowrap shrink-0"
        >
          Lời Chúc
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onActionClick}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-rose-200/60 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Nở Hoa Ngay</span>
        </button>
      </div>
    </header>
  );
};
