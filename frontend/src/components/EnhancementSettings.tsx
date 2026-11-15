import React from 'react';
import { Sparkles, Info, Wand2, Palette } from 'lucide-react';
import type { EnhanceSettingsState, Language, AIModelType } from '../types';
import { translations } from '../i18n/translations';

interface EnhancementSettingsProps {
  settings: EnhanceSettingsState;
  onChange: (updated: Partial<EnhanceSettingsState>) => void;
  onStartEnhancement: () => void;
  isProcessing: boolean;
  canStart: boolean;
  lang: Language;
}

export const EnhancementSettings: React.FC<EnhancementSettingsProps> = ({
  settings,
  onChange,
  onStartEnhancement,
  isProcessing,
  canStart,
  lang,
}) => {
  const t = translations[lang];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-navy-900 text-base flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <span>{t.settings_title}</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upscale Factor Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            {t.scale_label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* 2x Option */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onChange({ scale: 2 })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.scale === 2
                  ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-navy-900">2x</span>
                {settings.scale === 2 && (
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.scale_2x_desc}</p>
            </button>

            {/* 4x Option */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onChange({ scale: 4 })}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                settings.scale === 4
                  ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-navy-900">4x Ultra HD</span>
                {settings.scale === 4 && (
                  <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{t.scale_4x_desc}</p>
            </button>
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">
            {t.format_label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['png', 'jpg'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                disabled={isProcessing}
                onClick={() => onChange({ outputFormat: fmt })}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  settings.outputFormat === fmt
                    ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20 font-bold text-brand-600'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700 font-semibold'
                }`}
              >
                <span className="uppercase text-sm">{fmt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">
          {t.model_label}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* General Model */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onChange({ model: 'realesrgan-x4plus' as AIModelType })}
            className={`p-4 rounded-2xl border text-left transition-all ${
              settings.model === 'realesrgan-x4plus'
                ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center space-x-2 text-navy-900 font-bold text-sm">
              <Wand2 className="w-4 h-4 text-brand-600" />
              <span>{t.model_general}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-snug">
              {t.model_general_desc}
            </p>
          </button>

          {/* Anime Model */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => onChange({ model: 'realesrgan-x4plus-anime' as AIModelType })}
            className={`p-4 rounded-2xl border text-left transition-all ${
              settings.model === 'realesrgan-x4plus-anime'
                ? 'border-brand-500 bg-red-50/60 ring-2 ring-brand-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
            }`}
          >
            <div className="flex items-center space-x-2 text-navy-900 font-bold text-sm">
              <Palette className="w-4 h-4 text-brand-600" />
              <span>{t.model_anime}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 leading-snug">
              {t.model_anime_desc}
            </p>
          </button>
        </div>
      </div>

      {/* Face Enhancement Toggle */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-navy-900">{t.face_enhance}</span>
          <p className="text-[11px] text-slate-500">{t.face_enhance_desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.faceEnhance}
            disabled={isProcessing}
            onChange={(e) => onChange({ faceEnhance: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
        </label>
      </div>

      {/* AI Reconstruction Disclaimer */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">{t.ai_disclaimer_title}:</span>{' '}
          <span className="text-amber-800 leading-relaxed">{t.ai_disclaimer_text}</span>
        </div>
      </div>

      {/* Start Button */}
      <div className="pt-2">
        <button
          onClick={onStartEnhancement}
          disabled={!canStart || isProcessing}
          className={`w-full py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 transition-all duration-200 ${
            canStart && !isProcessing
              ? 'bg-gradient-to-r from-brand-600 to-red-600 hover:from-brand-500 hover:to-red-500 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/35 hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isProcessing ? t.processing_btn : t.start_enhancement_btn}</span>
        </button>
      </div>
    </div>
  );
};
