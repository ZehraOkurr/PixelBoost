import React from 'react';
import { Trash2, X, Image as ImageIcon } from 'lucide-react';
import type { UploadedImage, Language } from '../types';
import { translations } from '../i18n/translations';

interface ImageQueueProps {
  images: UploadedImage[];
  onRemoveImage: (id: string) => void;
  onClearAll: () => void;
  lang: Language;
  disabled?: boolean;
}

export const ImageQueue: React.FC<ImageQueueProps> = ({
  images,
  onRemoveImage,
  onClearAll,
  lang,
  disabled
}) => {
  const t = translations[lang];

  if (images.length === 0) {
    return null;
  }

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-navy-900 text-base">{t.queue_title}</h3>
          <span className="bg-red-50 text-brand-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
            {images.length} {t.queue_count}
          </span>
        </div>

        <button
          onClick={onClearAll}
          disabled={disabled}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 disabled:opacity-40 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t.queue_clear_all}</span>
        </button>
      </div>

      {/* Grid of Image Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-sm"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-200 mb-2.5 flex items-center justify-center">
              {img.preview_url ? (
                <img
                  src={img.preview_url}
                  alt={img.original_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}

              {/* Remove button overlay */}
              {!disabled && (
                <button
                  onClick={() => onRemoveImage(img.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-navy-900/80 hover:bg-brand-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow"
                  title={t.queue_remove}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Metadata */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-navy-900 truncate" title={img.original_name}>
                {img.original_name}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{img.width} × {img.height} px</span>
                <span>{formatSize(img.file_size)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
