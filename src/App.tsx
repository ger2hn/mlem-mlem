import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GardenCanvas } from './components/GardenCanvas';
import { FloatingCelebrationItems } from './components/FloatingCelebrationItems';
import { BloomingFlowerBouquet } from './components/BloomingFlowerBouquet';
import { CuteLetterCard } from './components/CuteLetterCard';
import { CleanPhotoModal } from './components/CleanPhotoModal';
import { FLOWER_THEMES, DEFAULT_PHOTO_PETALS } from './data/flowerPresets';
import { FlowerTheme, PhotoPetal } from './types/flower';
import { sounds } from './utils/audio';
import { RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function App() {
  const theme: FlowerTheme = FLOWER_THEMES[0];
  const photoPetals: PhotoPetal[] = DEFAULT_PHOTO_PETALS;

  // Animation timeline starts at 0 (underground) when web opens!
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBursting, setIsBursting] = useState<boolean>(false);

  // Enlarged photo state (clean lightbox without text clutter)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const prevProgressRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Auto-play blooming animation from soil when opening web
  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    prevProgressRef.current = 0;

    const timeout = setTimeout(() => {
      sounds.playSproutSound();
    }, 400);

    return () => clearTimeout(timeout);
  }, []);

  // Growth animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const step = () => {
      setProgress((prev) => {
        const increment = 0.0038;
        const next = Math.min(1.0, prev + increment);

        // Sound milestones
        const oldP = prevProgressRef.current;
        if (oldP < 0.15 && next >= 0.15) {
          sounds.playSproutSound();
        } else if (oldP < 0.45 && next >= 0.45) {
          sounds.playGrowthSound(2);
        } else if (oldP < 0.70 && next >= 0.70) {
          sounds.playGrowthSound(4);
        } else if (oldP < 0.98 && next >= 0.98) {
          sounds.playBloomChimes();
          setIsBursting(true);
        }
        prevProgressRef.current = next;

        if (next >= 1.0) {
          setIsPlaying(false);
          return 1.0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleReplay = () => {
    setProgress(0);
    prevProgressRef.current = 0;
    setIsPlaying(true);
    sounds.playSproutSound();
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  const handleShowerPetals = useCallback(() => {
    setIsBursting(true);
    sounds.playShowerPetalsSound();
  }, []);

  return (
    <div
      className="relative flex h-screen max-h-screen w-full flex-col justify-between overflow-hidden select-none"
      style={{ background: theme.bgGradient }}
    >
      {/* 1. Interactive Garden Canvas with floating petals and sparkles */}
      <GardenCanvas
        theme={theme}
        isBursting={isBursting}
        onBurstComplete={() => setIsBursting(false)}
      />

      {/* 2. 2 Ảnh to gấp đôi (p5, p6) & 6 lon bia Huda, Tiger, Larue bay qua lại từ trái sang phải */}
      <FloatingCelebrationItems
        photos={photoPetals}
        onSelectItem={(img) => setEnlargedImage(img)}
      />

      {/* 3. Nút Nở Lại & Âm Thanh nhỏ gọn góc trên bên phải */}
      <div className="fixed right-3 top-3 z-40 flex items-center gap-1.5 sm:right-4 sm:top-4">
        <button
          onClick={handleReplay}
          className="flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-white/90 px-3 py-1 text-xs font-bold text-rose-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95"
          title="Nở lại từ hạt mầm"
        >
          <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
          <span>Nở Lại</span>
        </button>

        <button
          onClick={handleToggleMute}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-rose-200/80 bg-white/90 text-rose-600 shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105"
          title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* 4. Khung cảnh chính: Toàn bộ nằm gọn trong màn hình mà không cần cuộn */}
      <main className="relative z-20 flex h-full w-full flex-1 flex-col items-center justify-between px-2 pt-2 pb-1.5 overflow-hidden">
        
        {/* Lá thư chúc mừng 20/10 có animation tự mở ra khi vào web */}
        <CuteLetterCard bloomProgress={progress} />

        {/* Bó hoa mọc từ dưới đất (tự động co giãn theo chiều cao màn hình) */}
        <div className="relative flex w-full flex-1 items-center justify-center min-h-0 overflow-visible">
          <BloomingFlowerBouquet
            progress={progress}
            theme={theme}
            photoPetals={photoPetals}
            onSelectPhoto={(photo) => setEnlargedImage(photo.image)}
            onFlowerClick={handleShowerPetals}
          />
        </div>

        {/* Chú thích nhỏ tinh tế */}
        {progress >= 0.85 && (
          <div className="z-20 mb-1 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-rose-700/85 bg-white/80 px-3 py-0.5 rounded-full shadow-xs backdrop-blur-xs transition-opacity duration-700">
            <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
            <span>Chạm vào hoa, ảnh kỷ niệm hoặc lon bia để phóng to xem</span>
          </div>
        )}
      </main>

      {/* 5. Phóng to ảnh hoặc lon bia không có chữ thừa (Clean Photo Lightbox) */}
      <CleanPhotoModal
        imageSrc={enlargedImage}
        onClose={() => setEnlargedImage(null)}
      />
    </div>
  );
}
