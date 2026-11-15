import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SplitSquareHorizontal, Download, Layers } from 'lucide-react';
import type { ImageResult, Language } from '../types';
import { translations } from '../i18n/translations';

interface ComparisonSliderProps {
  result: ImageResult;
  lang: Language;
}

export const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ result, lang }) => {
  const t = translations[lang];
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatSize = (bytes?: number): string => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPercent = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(clampedPercent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseDown = () => setIsDragging(true);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const originalUrl = result.original_url;
  const enhancedUrl = result.enhanced_url || result.original_url;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-bold text-navy-900 text-sm">{result.original_name}</h4>
          <p className="text-xs text-slate-500">
            {result.scale}x Büyütme • Model: {result.model_name}
            {result.processing_time_ms ? ` • ${result.processing_time_ms} ms` : ''}
          </p>
        </div>

        {result.enhanced_url && (
          <a
            href={result.enhanced_url}
            download
            className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.btn_download_image}</span>
          </a>
        )}
      </div>

      {/* Comparison Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900 select-none cursor-ew-resize border border-slate-200 shadow-inner"
      >
        {/* Background Layer: Enhanced Image (revealed on right side) */}
        <img
          src={enhancedUrl}
          alt="Enhanced"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Foreground Layer: Original Image (clipped to sliderPosition on left) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={originalUrl}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain max-w-none"
            style={{
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              height: '100%'
            }}
          />
        </div>

        {/* Labels overlay */}
        <div className="absolute top-3 left-3 bg-navy-900/80 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none shadow">
          {t.compare_original}
        </div>
        <div className="absolute top-3 right-3 bg-brand-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-lg pointer-events-none shadow flex items-center space-x-1">
          <Layers className="w-3 h-3" />
          <span>{t.compare_enhanced}</span>
        </div>

        {/* Vertical Divider Line with Grab Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl flex items-center justify-center cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-300 flex items-center justify-center text-navy-900 -translate-x-1/2 hover:scale-110 active:scale-95 transition-transform">
            <SplitSquareHorizontal className="w-4 h-4 text-brand-600" />
          </div>
        </div>
      </div>

      {/* Hint text */}
      <p className="text-center text-[11px] text-slate-400 font-medium">
        ↔ {t.comparison_slider_hint}
      </p>

      {/* Dimension and Size Comparison Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">{t.details_orig_dim}</span>
          <span className="font-bold text-navy-900 text-xs">{result.original_width} × {result.original_height} px</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">{t.details_enh_dim}</span>
          <span className="font-bold text-brand-600 text-xs">
            {result.enhanced_width ? `${result.enhanced_width} × ${result.enhanced_height} px` : '-'}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">{t.details_orig_size}</span>
          <span className="font-bold text-navy-900 text-xs">{formatSize(result.original_size)}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] font-semibold uppercase">{t.details_enh_size}</span>
          <span className="font-bold text-brand-600 text-xs">{formatSize(result.enhanced_size)}</span>
        </div>
      </div>
    </div>
  );
};
