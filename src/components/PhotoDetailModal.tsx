import React, { useState } from 'react';
import { PhotoPetal } from '../types/flower';
import { X, ChevronLeft, ChevronRight, Edit3, Check, Calendar, Heart, Sparkles, Upload } from 'lucide-react';

interface PhotoDetailModalProps {
  petal: PhotoPetal | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onUpdatePetal: (updated: PhotoPetal) => void;
  totalPetals: number;
  currentIndex: number;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  petal,
  onClose,
  onNext,
  onPrev,
  onUpdatePetal,
  totalPetals,
  currentIndex
}) => {
  if (!petal) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(petal.title);
  const [caption, setCaption] = useState(petal.caption);
  const [date, setDate] = useState(petal.date);
  const [note, setNote] = useState(petal.note || '');
  const [customImage, setCustomImage] = useState<string | null>(null);

  const handleSave = () => {
    onUpdatePetal({
      ...petal,
      title,
      caption,
      date,
      note,
      image: customImage || petal.image
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs transition-opacity duration-300">
      {/* Outer Click Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Polaroid-style Modal Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 shadow-2xl shadow-rose-200/50 sm:p-7 border border-rose-100">
        
        {/* Cute Top Washi Tape Sticker Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-28 -rotate-1 rounded-sm bg-rose-200/80 shadow-xs" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Navigation Indicator */}
        <div className="mb-3 flex items-center justify-between text-xs font-semibold text-rose-400">
          <div className="flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
            <span>Cánh hoa kỷ niệm {currentIndex + 1} / {totalPetals}</span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors"
          >
            {isEditing ? <Check className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            <span>{isEditing ? 'Hủy sửa' : 'Chỉnh sửa'}</span>
          </button>
        </div>

        {/* Image Frame */}
        <div className="group relative mb-4 overflow-hidden rounded-2xl border-4 border-white bg-rose-50 shadow-md">
          <img
            src={customImage || petal.image}
            alt={petal.title}
            className="h-64 w-full object-cover sm:h-72 transition-transform duration-500 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />

          {isEditing && (
            <label className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center bg-black/45 text-white backdrop-blur-xs transition-opacity">
              <Upload className="mb-1 h-6 w-6 animate-bounce" />
              <span className="text-xs font-bold">Tải ảnh mới từ máy</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Tag badge */}
          {petal.tag && !isEditing && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-rose-700 shadow-sm backdrop-blur-xs">
              {petal.tag}
            </span>
          )}
        </div>

        {/* Content details */}
        {!isEditing ? (
          <div>
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-rose-950">{petal.title}</h3>
              <div className="flex items-center gap-1 text-xs font-semibold text-rose-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{petal.date}</span>
              </div>
            </div>
            <p className="mb-3 text-sm font-medium text-rose-700/90">{petal.caption}</p>
            {petal.note && (
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3 text-xs leading-relaxed text-rose-900">
                <Sparkles className="mb-1 inline-block h-3.5 w-3.5 text-rose-400 mr-1" />
                <span>{petal.note}</span>
              </div>
            )}
          </div>
        ) : (
          /* Editing form */
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-rose-800">Tiêu đề cánh hoa</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-800">Phụ đề ngắn</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-rose-800">Ngày kỷ niệm</label>
                <input
                  type="text"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-rose-800">Ghi chú yêu thương</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={handleSave}
                className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        )}

        {/* Prev & Next Buttons */}
        <div className="mt-5 flex items-center justify-between border-t border-rose-100 pt-3">
          <button
            onClick={onPrev}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Cánh trước</span>
          </button>
          <button
            onClick={onNext}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-900 transition-colors"
          >
            <span>Cánh tiếp theo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
