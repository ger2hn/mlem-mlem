import React, { useEffect, useState } from 'react';
import { PhotoPetal } from '../types/flower';
import { ZoomIn, Heart, Sparkles, Beer } from 'lucide-react';
import { sounds } from '../utils/audio';

export interface FloatingItem {
  id: string;
  type: 'photo' | 'beer';
  image: string;
  name: string;
  badge?: string;
  baseY: number; // percentage from top 10% - 85%
  speedX: number; // speed of oscillation
  phase: number; // phase offset
  widthDesktop: number; // px
  widthMobile: number; // px
  rangeX: number; // percentage oscillation range
  centerX: number; // center percentage
}

interface FloatingCelebrationItemsProps {
  photos: PhotoPetal[];
  onSelectItem: (imageSrc: string) => void;
}

export const FloatingCelebrationItems: React.FC<FloatingCelebrationItemsProps> = ({
  photos,
  onSelectItem
}) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let animId: number;
    let t = 0;
    const loop = () => {
      t += 0.016; // ~60fps
      setTime(t);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const photo1 = photos[4] || photos[0];
  const photo2 = photos[5] || photos[1];

  // 2 large background photos (p5, p6) + 2 Huda, 2 Tiger, 2 Larue beers
  const items: FloatingItem[] = [
    // 1. Large Photo 1 (p5) (gliding across left to right)
    {
      id: 'big-photo-1',
      type: 'photo',
      image: photo1.image,
      name: photo1.title,
      badge: 'p5.jpg',
      baseY: 22,
      speedX: 0.28,
      phase: 0,
      widthDesktop: 195,
      widthMobile: 135,
      rangeX: 38,
      centerX: 48
    },
    // 2. Large Photo 2 (p6) (gliding across right to left)
    {
      id: 'big-photo-2',
      type: 'photo',
      image: photo2.image,
      name: photo2.title,
      badge: 'p6.jpg',
      baseY: 28,
      speedX: 0.25,
      phase: Math.PI,
      widthDesktop: 195,
      widthMobile: 135,
      rangeX: 38,
      centerX: 52
    },

    // 3. Bia Huda 1 (upper lane)
    {
      id: 'beer-huda-1',
      type: 'beer',
      image: '/images/huda.jpg',
      name: 'Bia Huda Đậm Tình Miền Trung',
      badge: 'Huda 🍻',
      baseY: 13,
      speedX: 0.42,
      phase: 0.5,
      widthDesktop: 110,
      widthMobile: 78,
      rangeX: 42,
      centerX: 50
    },
    // 4. Bia Huda 2 (lower lane)
    {
      id: 'beer-huda-2',
      type: 'beer',
      image: '/images/huda.jpg',
      name: 'Bia Huda Mát Lạnh',
      badge: 'Huda 🍻',
      baseY: 66,
      speedX: 0.38,
      phase: 3.5,
      widthDesktop: 115,
      widthMobile: 82,
      rangeX: 40,
      centerX: 50
    },

    // 5. Bia Tiger 1 (mid-upper lane)
    {
      id: 'beer-tiger-1',
      type: 'beer',
      image: '/images/tiger.jpg',
      name: 'Bia Tiger Bản Lĩnh',
      badge: 'Tiger 🐯',
      baseY: 42,
      speedX: 0.35,
      phase: 1.8,
      widthDesktop: 115,
      widthMobile: 82,
      rangeX: 44,
      centerX: 48
    },
    // 6. Bia Tiger 2 (top lane)
    {
      id: 'beer-tiger-2',
      type: 'beer',
      image: '/images/tiger.jpg',
      name: 'Bia Tiger Bạc Sảng Khoái',
      badge: 'Tiger 🐯',
      baseY: 11,
      speedX: 0.45,
      phase: 4.8,
      widthDesktop: 110,
      widthMobile: 78,
      rangeX: 42,
      centerX: 52
    },

    // 7. Bia Larue 1 (mid-lower lane)
    {
      id: 'beer-larue-1',
      type: 'beer',
      image: '/images/larue.jpg',
      name: 'Bia Larue Con Cọp Vàng',
      badge: 'Larue 🍺',
      baseY: 56,
      speedX: 0.40,
      phase: 2.6,
      widthDesktop: 115,
      widthMobile: 82,
      rangeX: 43,
      centerX: 50
    },
    // 8. Bia Larue 2 (center lane)
    {
      id: 'beer-larue-2',
      type: 'beer',
      image: '/images/larue.jpg',
      name: 'Bia Larue Nhậu Thả Ga',
      badge: 'Larue 🍺',
      baseY: 48,
      speedX: 0.36,
      phase: 5.6,
      widthDesktop: 115,
      widthMobile: 82,
      rangeX: 41,
      centerX: 52
    }
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {items.map((item) => {
        // Horizontal position gliding left and right across the screen
        const osc = Math.sin(time * item.speedX + item.phase);
        const posX = item.centerX + osc * item.rangeX;
        // Subtle vertical bobbing
        const posY = item.baseY + Math.cos(time * 0.9 + item.phase) * 3.5;
        // Tilting rotation while flying
        const rot = osc * 12 + Math.sin(time * 1.2 + item.phase) * 5;

        const isPhoto = item.type === 'photo';

        return (
          <div
            key={item.id}
            className="pointer-events-auto absolute transition-transform duration-200 ease-out hover:z-30 hover:scale-110 active:scale-95"
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: `translate(-50%, -50%) rotate(${rot}deg)`,
              cursor: 'pointer'
            }}
            onClick={() => {
              sounds.playPetalClickSound();
              onSelectItem(item.image);
            }}
            title={`Nhấp để phóng to ${item.name}`}
          >
            {isPhoto ? (
              /* 2x ENLARGED BACKGROUND PHOTO CARD */
              <div className="group relative w-36 sm:w-44 md:w-52 rounded-2xl border-4 border-white/95 bg-white p-1.5 shadow-xl shadow-rose-300/40 backdrop-blur-xs transition-shadow hover:shadow-2xl hover:shadow-rose-300/60">
                {/* Washi tape on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-5 w-16 -rotate-2 rounded-xs bg-rose-200/90 shadow-xs" />

                {/* Photo frame */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-rose-50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-pink-400/10 transition-opacity group-hover:opacity-0" />

                  {/* Zoom hint on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25">
                    <ZoomIn className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Bottom badge */}
                <div className="mt-1 flex items-center justify-between px-1 text-[11px] font-bold text-rose-800">
                  <span className="truncate max-w-[85%]">{item.name}</span>
                  <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 shrink-0" />
                </div>
              </div>
            ) : (
              /* FLOATING BEER CAN (HUDA / TIGER / LARUE) */
              <div className="group relative w-20 sm:w-24 md:w-28 rounded-2xl border-3 border-white/90 bg-white/95 p-1 shadow-lg shadow-amber-300/40 backdrop-blur-xs transition-shadow hover:shadow-xl hover:shadow-amber-400/60">
                {/* Frost / cold bubble badge */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-extrabold text-white shadow-xs whitespace-nowrap">
                  {item.badge}
                </div>

                {/* Beer Can Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-amber-50/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Zoom hint on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
                    <ZoomIn className="h-5 w-5 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Small playful label */}
                <div className="mt-0.5 text-center text-[10px] font-extrabold text-amber-900 line-clamp-1">
                  100% zui zẻ 🍻
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
