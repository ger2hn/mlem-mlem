import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Mail, MailOpen, DollarSign } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CuteLetterCardProps {
  bloomProgress: number;
}

export const CuteLetterCard: React.FC<CuteLetterCardProps> = ({ bloomProgress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // When web loads, after 1.2s or when flower starts growing, the letter automatically animates open!
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasAutoOpened(true);
      sounds.playBloomChimes();
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const toggleOpen = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      sounds.playBloomChimes();
    } else {
      sounds.playPetalClickSound();
    }
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-md px-3 pt-2">
      {/* 3D Perspective container */}
      <div
        className="relative mx-auto flex flex-col items-center cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        onClick={toggleOpen}
        title={isOpen ? 'Nhấp để đóng lá thư lại' : 'Nhấp để mở lá thư'}
      >
        {/* ENVELOPE BACKDROP & POCKET */}
        <div className="relative w-full max-w-sm sm:max-w-md">
          
          {/* THE LETTER SHEET THAT SLIDES OUT */}
          <div
            className={`relative z-20 mx-auto w-[94%] rounded-2xl border-2 border-rose-200 bg-white p-3 sm:p-4 shadow-xl transition-all duration-1000 ease-out ${
              isOpen
                ? 'translate-y-0 opacity-100 scale-100'
                : 'translate-y-12 opacity-0 scale-95 pointer-events-none'
            }`}
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #fffbfa 100%)',
              boxShadow: '0 10px 24px -4px rgba(244, 114, 182, 0.35)'
            }}
          >
            {/* Cute Top Washi Tape */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 w-20 -rotate-1 rounded-xs bg-rose-200/90 shadow-xs" />

            {/* Letter Header */}
            <div className="flex items-center justify-between border-b border-rose-100/80 pb-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-500">
                <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>Thư Gửi Chị Thảo 20/10</span>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span>Thân Thương</span>
              </div>
            </div>

            {/* Exact Letter Content requested by user */}
            <div className="pt-2 pb-0.5 text-center">
              <p className="text-sm font-extrabold leading-snug text-rose-950 sm:text-base">
                những thằng em thân thương chúc chị Thảo 20/10 zui zẻ, nhậu khỏe, mau giàu $$$
              </p>
            </div>

            {/* Cute celebration emojis */}
            <div className="mt-1.5 flex items-center justify-center gap-2 text-xs font-bold text-rose-400">
              <span className="text-sm">🍻</span>
              <span>✨</span>
              <span className="font-mono text-emerald-600 font-extrabold flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-xs text-[10px] sm:text-xs">
                <DollarSign className="h-3 w-3 inline -mr-0.5 text-emerald-600" />
                <DollarSign className="h-3 w-3 inline -mr-0.5 text-emerald-600" />
                <DollarSign className="h-3 w-3 inline text-emerald-600" />
                <span className="ml-1 text-[10px]">Mau Giàu</span>
              </span>
              <span>✨</span>
              <span className="text-sm">💖</span>
            </div>
          </div>

          {/* ENVELOPE BASE / POCKET (Visible before & during opening) */}
          <div
            className={`relative -mt-6 sm:-mt-8 w-full overflow-hidden rounded-2xl border-2 border-rose-200/90 bg-gradient-to-b from-rose-100 via-rose-50 to-pink-100 px-4 py-3 shadow-lg shadow-rose-200/40 backdrop-blur-md transition-all duration-700 ${
              isOpen ? 'pt-4 opacity-95' : 'pt-7 pb-6 opacity-100'
            }`}
          >
            {/* Top flap shape */}
            {!isOpen && (
              <div className="absolute inset-x-0 top-0 flex justify-center">
                <div
                  className="h-7 w-full bg-gradient-to-b from-rose-200 to-rose-100 transition-transform duration-700"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
                  }}
                />
              </div>
            )}

            {/* Envelope Heart Seal */}
            <div className="flex items-center justify-center gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  isOpen
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-rose-500 text-white shadow-md animate-bounce'
                }`}
              >
                {isOpen ? (
                  <>
                    <MailOpen className="h-3.5 w-3.5 text-rose-500" />
                    <span>Lá thư đã mở · Chạm để gấp lại</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5" />
                    <span>Lá thư bí mật · Chạm để mở quà</span>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
