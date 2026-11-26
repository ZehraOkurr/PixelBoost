import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Loader2, AlertCircle } from 'lucide-react';
import type {
  UploadedImage,
  EnhanceSettingsState,
  Job,
  Language,
  HealthInfo
} from '../types';
import { translations } from '../i18n/translations';
import { api } from '../services/api';
import { StatusBanner } from '../components/StatusBanner';
import { Dropzone } from '../components/Dropzone';
import { ImageQueue } from '../components/ImageQueue';
import { EnhancementSettings } from '../components/EnhancementSettings';
import { ResultsGallery } from '../components/ResultsGallery';

interface EnhancerPageProps {
  lang: Language;
  health: HealthInfo | null;
  onRefreshHealth: () => void;
  onJobCompleted: (job: Job) => void;
}

export const EnhancerPage: React.FC<EnhancerPageProps> = ({
  lang,
  health,
  onRefreshHealth,
  onJobCompleted
}) => {
  const t = translations[lang];

  // State
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [settings, setSettings] = useState<EnhanceSettingsState>(() => {
    const defaults: EnhanceSettingsState = {
      scale: 4,
      model: 'realesrgan-x4plus',
      minHeightEnabled: true,
      minHeight: 768
    };
    try {
      const saved = JSON.parse(localStorage.getItem('pixelboost_min_height') || 'null');
      if (saved && typeof saved.minHeight === 'number') {
        return { ...defaults, minHeightEnabled: !!saved.minHeightEnabled, minHeight: saved.minHeight };
      }
    } catch {
      // ignore unavailable or corrupt storage
    }
    return defaults;
  });

  // Remember the minimum height preference between sessions
  useEffect(() => {
    try {
      localStorage.setItem(
        'pixelboost_min_height',
        JSON.stringify({ minHeightEnabled: settings.minHeightEnabled, minHeight: settings.minHeight })
      );
    } catch {
      // ignore unavailable storage
    }
  }, [settings.minHeightEnabled, settings.minHeight]);

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [viewState, setViewState] = useState<'edit' | 'processing' | 'results'>('edit');

  const pollIntervalRef = useRef<number | null>(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  // Handle files selected via dropzone
  const handleFilesSelected = async (files: File[]) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const newUploaded = await api.uploadImages(files);
      setUploadedImages((prev) => [...prev, ...newUploaded]);
    } catch (err: any) {
      setUploadError(err.message || 'Görsel yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClearAll = () => {
    setUploadedImages([]);
  };

  // Start enhancement job
  const handleStartEnhancement = async () => {
    if (uploadedImages.length === 0 || isProcessing) return;

    setJobError(null);
    setIsProcessing(true);
    setViewState('processing');

    try {
      const imageIds = uploadedImages.map((img) => img.id);
      const initialJob = await api.startEnhancement(imageIds, settings);
      setActiveJob(initialJob);

      // Start polling job status
      pollIntervalRef.current = window.setInterval(async () => {
        try {
          const updatedJob = await api.getJob(initialJob.job_id);
          setActiveJob(updatedJob);

          if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
              pollIntervalRef.current = null;
            }
            setIsProcessing(false);
            setViewState('results');
            onJobCompleted(updatedJob);

            if (updatedJob.status === 'completed') {
              try {
                confetti({
                  particleCount: 80,
                  spread: 60,
                  origin: { y: 0.6 }
                });
              } catch (_) {}
            } else if (updatedJob.status === 'failed') {
              setJobError(updatedJob.error || 'İşlem başarısız oldu.');
            }
          }
        } catch (pollErr: any) {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setIsProcessing(false);
          setJobError(pollErr.message || 'İşlem durumu kontrol edilirken hata oluştu.');
          setViewState('edit');
        }
      }, 1000);
    } catch (err: any) {
      setIsProcessing(false);
      setJobError(err.message || 'İyileştirme başlatılamadı.');
      setViewState('edit');
    }
  };

  const handleNewBatch = () => {
    setUploadedImages([]);
    setActiveJob(null);
    setViewState('edit');
  };

  const handleProcessMore = () => {
    setViewState('edit');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Engine Missing Notice */}
      <StatusBanner health={health} lang={lang} onRefreshHealth={onRefreshHealth} />

      {/* Global Error Notice */}
      {(uploadError || jobError) && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between text-xs text-brand-600">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError || jobError}</span>
          </div>
          <button
            onClick={() => {
              setUploadError(null);
              setJobError(null);
            }}
            className="font-bold underline ml-4"
          >
            Kapat
          </button>
        </div>
      )}

      {/* VIEW STATE: EDIT WORKSPACE */}
      {viewState === 'edit' && (
        <div className="space-y-6">
          <Dropzone
            onFilesSelected={handleFilesSelected}
            lang={lang}
            isUploading={isUploading}
            disabled={isProcessing}
          />

          <ImageQueue
            images={uploadedImages}
            onRemoveImage={handleRemoveImage}
            onClearAll={handleClearAll}
            lang={lang}
            disabled={isProcessing}
          />

          <EnhancementSettings
            settings={settings}
            onChange={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
            onStartEnhancement={handleStartEnhancement}
            isProcessing={isProcessing}
            canStart={uploadedImages.length > 0 && (health?.engine_available ?? true)}
            lang={lang}
          />
        </div>
      )}

      {/* VIEW STATE: REAL-TIME PROCESSING */}
      {viewState === 'processing' && activeJob && (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm text-center max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-navy-900 text-xl">{t.processing_title}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{t.processing_subtitle}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-brand-600 to-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${activeJob.progress_percent || 5}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-semibold px-1">
              <span>%{activeJob.progress_percent}</span>
              <span>
                {activeJob.completed_images + activeJob.failed_images} / {activeJob.total_images} görsel
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW STATE: RESULTS */}
      {viewState === 'results' && activeJob && (
        <ResultsGallery
          job={activeJob}
          lang={lang}
          onNewBatch={handleNewBatch}
          onProcessMore={handleProcessMore}
        />
      )}
    </div>
  );
};
