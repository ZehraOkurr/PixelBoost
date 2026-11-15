import React, { useState } from 'react';
import {
  Archive,
  RefreshCw,
  PlusCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import type { Job, Language } from '../types';
import { translations } from '../i18n/translations';
import { ComparisonSlider } from './ComparisonSlider';

interface ResultsGalleryProps {
  job: Job;
  lang: Language;
  onNewBatch: () => void;
  onProcessMore: () => void;
}

export const ResultsGallery: React.FC<ResultsGalleryProps> = ({
  job,
  lang,
  onNewBatch,
  onProcessMore
}) => {
  const t = translations[lang];
  const [selectedResultId, setSelectedResultId] = useState<string>(
    job.images[0]?.id || ''
  );

  const selectedResult = job.images.find((img) => img.id === selectedResultId) || job.images[0];
  const hasSuccessfulImages = job.completed_images > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Batch Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="font-bold text-navy-900 text-lg">{t.completed_title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {job.completed_images} / {job.total_images} görsel başarıyla işlendi.
          </p>
        </div>

        {/* Global Batch Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {hasSuccessfulImages && (
            <a
              href={`/api/download-zip/${job.job_id}`}
              download
              className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-500/20 transition-all hover:shadow"
            >
              <Archive className="w-4 h-4" />
              <span>{t.btn_download_zip}</span>
            </a>
          )}

          <button
            onClick={onProcessMore}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-slate-500" />
            <span>{t.btn_process_more}</span>
          </button>

          <button
            onClick={onNewBatch}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.btn_new_batch}</span>
          </button>
        </div>
      </div>

      {/* Batch Thumbnails Selector Bar (if more than 1 image) */}
      {job.images.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {job.images.map((img) => {
            const isSelected = img.id === selectedResult?.id;
            const isCompleted = img.status === 'completed';

            return (
              <button
                key={img.id}
                onClick={() => setSelectedResultId(img.id)}
                className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                  isSelected
                    ? 'border-brand-600 ring-2 ring-brand-500/20 scale-105 shadow-md'
                    : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img.enhanced_url || img.original_url}
                  alt={img.original_name}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute bottom-1 right-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 bg-white rounded-full" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500 bg-white rounded-full" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Comparison Slider for Selected Image */}
      {selectedResult && (
        <>
          {selectedResult.status === 'completed' ? (
            <ComparisonSlider result={selectedResult} lang={lang} />
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-2">
              <XCircle className="w-8 h-8 text-brand-600 mx-auto" />
              <h4 className="font-bold text-navy-900 text-sm">Görsel İyileştirilemedi</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                {selectedResult.error || 'Bilinmeyen bir hata oluştu.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
