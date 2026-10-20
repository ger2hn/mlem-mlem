import React, { useState } from 'react';
import { FlowerTheme, DedicationMessage } from '../types/flower';
import { FLOWER_THEMES } from '../data/flowerPresets';
import { X, Palette, Heart, Check, Sparkles, MessageSquare } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: FlowerTheme;
  onSelectTheme: (theme: FlowerTheme) => void;
  dedication: DedicationMessage;
  onUpdateDedication: (dedication: DedicationMessage) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  dedication,
  onUpdateDedication
}) => {
  if (!isOpen) return null;

  const [to, setTo] = useState(dedication.to);
  const [message, setMessage] = useState(dedication.message);
  const [from, setFrom] = useState(dedication.from);
  const [enabled, setEnabled] = useState(dedication.enabled);

  const handleSaveDedication = () => {
    onUpdateDedication({
      enabled,
      to,
      message,
      from
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-rose-100 bg-white p-5 shadow-2xl shadow-rose-200/50 sm:p-7">
        
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-extrabold text-rose-950 sm:text-xl">
              Chủ Đề & Lời Nhắn Yêu Thương
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* THEME SELECTION */}
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-rose-500">
              Chọn Sắc Hoa & Tông Màu
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {FLOWER_THEMES.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme)}
                    className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50/80 shadow-sm ring-2 ring-rose-300/50'
                        : 'border-rose-100 bg-white hover:border-rose-200 hover:bg-rose-50/30'
                    }`}
                  >
                    <span className="text-2xl">{theme.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-950">{theme.name}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-rose-500" />}
                      </div>
                      <p className="mt-0.5 text-[11px] text-rose-600 line-clamp-1">
                        {theme.description}
                      </p>
                      {/* Color swatches */}
                      <div className="mt-2 flex items-center gap-1">
                        {theme.petalGradient.map((col, idx) => (
                          <span
                            key={idx}
                            className="h-3.5 w-3.5 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DEDICATION MESSAGE BANNER */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-bold text-rose-900">
                  Thông Điệp / Lời Chúc Bay Bổng
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-rose-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => {
                    setEnabled(e.target.checked);
                    onUpdateDedication({ ...dedication, enabled: e.target.checked });
                  }}
                  className="rounded text-rose-500 focus:ring-rose-400"
                />
                <span>Hiển thị</span>
              </label>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-rose-800">Người nhận</label>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="VD: Gửi người thương yêu"
                    className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-rose-800">Người gửi</label>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="VD: Từ trái tim tôi"
                    className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-rose-800">Lời nhắn</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Lời chúc ngọt ngào khi hoa hé nở..."
                  className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-1.5 text-xs text-rose-950 focus:border-rose-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveDedication}
                  className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-transform hover:scale-105"
                >
                  <Check className="h-3 w-3" />
                  <span>Áp Dụng Lời Nhắn</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
