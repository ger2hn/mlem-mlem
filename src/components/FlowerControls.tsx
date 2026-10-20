import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Palette,
  Image as ImageIcon,
  Music
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface FlowerControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  progress: number;
  onSeek: (value: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onShowerPetals: () => void;
  onOpenThemes: () => void;
  onOpenMemories: () => void;
}

export const FlowerControls: React.FC<FlowerControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onReplay,
  progress,
  onSeek,
  speed,
  onSpeedChange,
  isMuted,
  onToggleMute,
  isPlayingMusic,
  onToggleMusic,
  onShowerPetals,
  onOpenThemes,
  onOpenMemories
}) => {
  // Stage name helper
  const getStageName = () => {
    if (progress < 0.18) return 'Hạt Mầm Ngủ Say';
    if (progress < 0.45) return 'Nảy Mầm Vươn Lên';
    if (progress < 0.65) return 'Nụ Hoa E Ấp';
    if (progress < 0.95) return 'Bắt Đầu Hé Nở';
    return 'Rực Rỡ Nở Hoa';
  };

  return (
    <div className="relative z-20 mx-auto w-full max-w-3xl px-4 pb-6">
      {/* Container with soft cute glassmorphism and pastel rim */}
      <div className="rounded-2xl border border-rose-100/80 bg-white/85 p-3.5 shadow-lg shadow-rose-100/50 backdrop-blur-md sm:p-5">
        
        {/* TOP ROW: Progress label & Stage indicator */}
        <div className="mb-2.5 flex items-center justify-between text-xs font-semibold text-rose-900/80">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            <span className="font-bold text-rose-800">{getStageName()}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-rose-500">
            <span>{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* SCRUBBER SLIDER */}
        <div className="relative mb-4 flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progress}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-rose-100 accent-rose-500 hover:accent-rose-600 transition-colors"
          />
        </div>

        {/* STAGE MILESTONES (Clickable shortcuts) */}
        <div className="mb-4 grid grid-cols-5 gap-1 text-center">
          {[
            { label: 'Hạt mầm', val: 0.05 },
            { label: 'Nảy mầm', val: 0.25 },
            { label: 'Vươn cao', val: 0.50 },
            { label: 'Nụ hoa', val: 0.65 },
            { label: 'Nở rộ', val: 1.0 }
          ].map((stg) => {
            const isActive = Math.abs(progress - stg.val) < 0.12;
            return (
              <button
                key={stg.label}
                onClick={() => onSeek(stg.val)}
                className={`rounded-lg py-1 text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'bg-rose-50/70 text-rose-700 hover:bg-rose-100'
                }`}
              >
                {stg.label}
              </button>
            );
          })}
        </div>

        {/* CONTROLS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-rose-100/60">
          {/* Left group: Play, Replay, Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md shadow-rose-300/40 transition-transform hover:scale-105 active:scale-95"
              title={isPlaying ? 'Tạm dừng' : 'Xem hoa nở'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>

            <button
              onClick={onReplay}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-700 shadow-xs transition-transform hover:bg-rose-50 hover:scale-105 active:scale-95"
              title="Nở lại từ hạt mầm"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Speed toggle */}
            <div className="flex items-center rounded-xl border border-rose-200 bg-rose-50/50 p-0.5 text-xs font-semibold text-rose-700">
              {[0.5, 1, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`rounded-lg px-2 py-1 transition-all ${
                    speed === s ? 'bg-white text-rose-800 shadow-xs font-bold' : 'hover:text-rose-900'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Right group: Magic effects, Sounds, Modal triggers */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Shower Petals */}
            <button
              onClick={() => {
                sounds.playShowerPetalsSound();
                onShowerPetals();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs font-semibold text-amber-800 transition-all hover:bg-amber-100 active:scale-95"
              title="Tung cánh hoa lãng mạn"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">Tung Cánh Hoa</span>
            </button>

            {/* Ambient Music Box */}
            <button
              onClick={onToggleMusic}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
                isPlayingMusic
                  ? 'border-pink-300 bg-pink-100 text-pink-700 shadow-xs'
                  : 'border-rose-200 bg-white text-rose-500 hover:bg-rose-50'
              }`}
              title={isPlayingMusic ? 'Tắt nhạc hộp nhạc' : 'Bật nhạc hộp nhạc nhẹ nhàng'}
            >
              <Music className={`h-4 w-4 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
            </button>

            {/* Sound FX Mute */}
            <button
              onClick={onToggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-white text-rose-600 transition-colors hover:bg-rose-50"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Photos & Memories Manager */}
            <button
              onClick={onOpenMemories}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 active:scale-95"
              title="Quản lý các bức ảnh trên cánh hoa"
            >
              <ImageIcon className="h-3.5 w-3.5 text-rose-500" />
              <span>Ảnh Cánh Hoa</span>
            </button>

            {/* Themes Selector */}
            <button
              onClick={onOpenThemes}
              className="flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-xs font-bold text-purple-700 transition-all hover:bg-purple-100 active:scale-95"
              title="Thay đổi màu sắc và loại hoa"
            >
              <Palette className="h-3.5 w-3.5 text-purple-600" />
              <span className="hidden sm:inline">Màu Hoa</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
