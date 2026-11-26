import React, { useState } from 'react';
import {
  Cpu,
  Folder,
  RefreshCw,
  Globe,
  HardDrive,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import type { HealthInfo, Language } from '../types';
import { translations } from '../i18n/translations';

interface SettingsPageProps {
  health: HealthInfo | null;
  lang: Language;
  onSetLang: (lang: Language) => void;
  onRefreshHealth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  health,
  lang,
  onSetLang,
  onRefreshHealth
}) => {
  const t = translations[lang];
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isEngineAvailable = health?.engine_available ?? false;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h3 className="font-bold text-navy-900 text-lg">{t.config_title}</h3>
          <p className="text-xs text-slate-500">PixelBoost AI çalışma parametreleri ve donanım bağlantıları</p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-brand-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{t.config_save}</span>
        </button>
      </div>

      {/* AI Engine Status Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-brand-600" />
            <h4 className="font-bold text-navy-900 text-sm">Real-ESRGAN AI Motor Durumu</h4>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              isEngineAvailable
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {isEngineAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Aktif ve Çalışıyor
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                Yürütülebilir Dosya Eksik
              </>
            )}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
              {t.config_engine_path}
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-slate-700 flex items-center justify-between">
              <span className="truncate">{health?.engine_path || 'ai-engine/realesrgan-ncnn-vulkan.exe'}</span>
              <HardDrive className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
              {t.config_models_path}
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-mono text-slate-700 flex items-center justify-between">
              <span>ai-engine/models</span>
              <Folder className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>
          </div>

          <div>
            <label className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
              {t.config_active_gpu}
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-navy-900">
              {health?.gpu_info || 'NVIDIA GeForce RTX 4050 Laptop GPU (Vulkan Compute)'}
            </div>
          </div>
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-brand-600" />
          <h4 className="font-bold text-navy-900 text-sm">{t.config_language}</h4>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onSetLang('tr')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              lang === 'tr'
                ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20 font-bold text-brand-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="block text-sm">Türkçe (Varsayılan)</span>
            <span className="text-xs text-slate-400 font-normal mt-0.5 block">Tam Türkçe arayüz</span>
          </button>

          <button
            onClick={() => onSetLang('en')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              lang === 'en'
                ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20 font-bold text-brand-600'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            }`}
          >
            <span className="block text-sm">English</span>
            <span className="text-xs text-slate-400 font-normal mt-0.5 block">Full English interface</span>
          </button>
        </div>
      </div>
    </div>
  );
};
