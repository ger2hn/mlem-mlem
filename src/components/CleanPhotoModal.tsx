import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface CleanPhotoModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const CleanPhotoModal: React.FC<CleanPhotoModalProps> = ({ imageSrc, onClose }) => {
  if (!imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Lightbox Container */}
      <div
        className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-3xl border-4 border-white bg-white p-2 shadow-2xl transition-transform duration-300 scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-rose-600 shadow-lg hover:bg-white transition-all active:scale-95"
          title="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Enlarged Photo */}
        <div className="overflow-hidden rounded-2xl bg-rose-50">
          <img
            src={imageSrc}
            alt="Phóng to ảnh bông hoa"
            className="max-h-[80vh] w-auto max-w-full object-contain"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Subtle decorative bottom glow */}
        <div className="flex items-center justify-center py-2 text-xs font-semibold text-rose-400">
          <Sparkles className="mr-1 h-3.5 w-3.5 text-amber-400" />
          <span>Nhấp ra ngoài hoặc bấm dấu X để đóng ảnh</span>
        </div>
      </div>
    </div>
  );
};
