import React from 'react';
import { AlertCircle, RefreshCw, FolderSearch } from 'lucide-react';
import type { HealthInfo, Language } from '../types';
import { translations } from '../i18n/translations';

interface StatusBannerProps {
  health: HealthInfo | null;
  lang: Language;
  onRefreshHealth: () => void;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ health, lang, onRefreshHealth }) => {
  const t = translations[lang];

  if (!health || health.engine_available) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="p-2.5 bg-red-100 rounded-xl text-brand-600 mt-0.5">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-navy-900 text-base">{t.banner_engine_title}</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {t.banner_engine_desc}
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs font-semibold text-slate-700 bg-white/80 p-3 rounded-lg border border-red-100">
              <div className="flex items-center space-x-1.5">
                <FolderSearch className="w-4 h-4 text-brand-600" />
                <span>Beklenen Konum:</span>
              </div>
              <code className="text-navy-900 font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                {health.engine_path}
              </code>
            </div>
          </div>
        </div>

        <button
          onClick={onRefreshHealth}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 rounded-xl shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-brand-600" />
          <span>Yeniden Kontrol Et</span>
        </button>
      </div>
    </div>
  );
};
