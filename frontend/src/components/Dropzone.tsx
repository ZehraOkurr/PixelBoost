import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  lang: Language;
  isUploading: boolean;
  disabled?: boolean;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  lang,
  isUploading,
  disabled
}) => {
  const t = translations[lang];
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled && !isUploading) {
          fileInputRef.current?.click();
        }
      }}
      className={`relative group border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-200 cursor-pointer ${
        isDragOver
          ? 'border-brand-500 bg-red-50/50 scale-[1.005]'
          : 'border-slate-200 hover:border-brand-400 bg-white hover:bg-slate-50/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
          isDragOver
            ? 'bg-brand-500 text-white shadow-lg shadow-red-500/30 rotate-3'
            : 'bg-red-50 text-brand-600 group-hover:scale-105'
        }`}>
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        {/* Text Content */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-navy-900">
            {isUploading ? t.drop_uploading : t.drop_title}
          </h3>
          <p className="text-sm text-slate-500 font-medium">
            {t.drop_subtitle}
          </p>
        </div>

        {/* Browse Button */}
        <button
          type="button"
          disabled={disabled || isUploading}
          className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm shadow-navy-950/20 transition-all hover:shadow"
        >
          {t.drop_btn_browse}
        </button>

        {/* Supported Format Tags */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          {['JPG', 'JPEG', 'PNG', 'WEBP'].map((fmt) => (
            <span
              key={fmt}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200/60"
            >
              <ImageIcon className="w-3 h-3 mr-1 text-slate-400" />
              {fmt}
            </span>
          ))}
          <span className="text-xs text-slate-400 font-medium ml-2">
            • {t.drop_batch_limit}
          </span>
        </div>
      </div>
    </div>
  );
};
