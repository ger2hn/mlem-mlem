import React, { useState } from 'react';
import { PhotoPetal } from '../types/flower';
import { X, Plus, Trash2, RotateCcw, Upload, Check, Heart, Sparkles } from 'lucide-react';
import { DEFAULT_PHOTO_PETALS } from '../data/flowerPresets';

interface MemoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  petals: PhotoPetal[];
  onUpdatePetals: (petals: PhotoPetal[]) => void;
  onSelectPetalToInspect: (petal: PhotoPetal) => void;
}

export const MemoryManagerModal: React.FC<MemoryManagerModalProps> = ({
  isOpen,
  onClose,
  petals,
  onUpdatePetals,
  onSelectPetalToInspect
}) => {
  if (!isOpen) return null;

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newDate, setNewDate] = useState('20/10/2026');
  const [newTag, setNewTag] = useState('Kỷ Niệm');
  const [newNote, setNewNote] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);

  const handleAddNewPetal = () => {
    if (!newTitle) return;
    const newPetal: PhotoPetal = {
      id: `petal-${Date.now()}`,
      image: newImage || DEFAULT_PHOTO_PETALS[0].image,
      title: newTitle,
      caption: newCaption || 'Một khoảnh khắc đáng yêu',
      date: newDate,
      tag: newTag,
      note: newNote || 'Nở rộ dịu dàng trên cánh hoa.'
    };

    onUpdatePetals([...petals, newPetal]);
    setIsAdding(false);
    setNewTitle('');
    setNewCaption('');
    setNewImage(null);
    setNewNote('');
  };

  const handleRemovePetal = (id: string) => {
    if (petals.length <= 3) {
      alert('Đóa hoa cần ít nhất 3 cánh ảnh để bung nở trọn vẹn!');
      return;
    }
    onUpdatePetals(petals.filter((p) => p.id !== id));
  };

  const handleResetDefaults = () => {
    if (confirm('Khôi phục danh sách ảnh mẫu ban đầu?')) {
      onUpdatePetals(DEFAULT_PHOTO_PETALS);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-rose-100 bg-white p-5 shadow-2xl shadow-rose-200/50 sm:p-7">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-extrabold text-rose-950 sm:text-xl">
              Bộ Sưu Tập Cánh Hoa Ảnh ({petals.length} Cánh)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-rose-600">
            Các bức ảnh này sẽ đan xen tuần hoàn với những cánh hoa khi hoa nở rộ.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Ảnh mẫu ban đầu</span>
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:scale-102 transition-transform"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm ảnh mới</span>
            </button>
          </div>
        </div>

        {/* Scrollable list of photo petals */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* New petal form if adding */}
          {isAdding && (
            <div className="mb-4 rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 p-4">
              <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold text-rose-900">
                <Sparkles className="h-4 w-4 text-rose-500" />
                <span>Thêm cánh hoa kỷ niệm mới</span>
              </h4>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Image upload box */}
                <div className="relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-xl border border-rose-200 bg-white">
                  {newImage ? (
                    <img src={newImage} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                      <Upload className="mb-1 h-5 w-5 text-rose-400" />
                      <span className="text-[11px] font-semibold text-rose-600">Chọn ảnh</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>

                {/* Form fields */}
                <div className="space-y-2 sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Tiêu đề kỷ niệm (ví dụ: Ngày Mưa Rơi)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phụ đề ngắn"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Ngày tháng (VD: 20/10/2026)"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Thẻ (VD: Bạn Thân)"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setIsAdding(false)}
                      className="rounded-lg px-3 py-1 text-xs text-rose-600 hover:bg-rose-100"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleAddNewPetal}
                      className="flex items-center gap-1 rounded-lg bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-xs"
                    >
                      <Check className="h-3 w-3" />
                      <span>Thêm Vào Hoa</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid of existing petals */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {petals.map((petal, index) => (
              <div
                key={petal.id}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-white p-2.5 shadow-xs hover:border-rose-300 hover:shadow-md transition-all"
              >
                <div
                  className="flex flex-1 cursor-pointer items-center gap-3 overflow-hidden"
                  onClick={() => {
                    onSelectPetalToInspect(petal);
                    onClose();
                  }}
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-rose-100 bg-rose-50">
                    <img
                      src={petal.image}
                      alt={petal.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 rounded-tl-md bg-rose-500 px-1.5 text-[9px] font-bold text-white">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs font-bold text-rose-950">{petal.title}</h4>
                    <p className="truncate text-[11px] text-rose-600">{petal.caption}</p>
                    <span className="text-[10px] text-rose-400">{petal.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemovePetal(petal.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  title="Xóa cánh hoa này"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
