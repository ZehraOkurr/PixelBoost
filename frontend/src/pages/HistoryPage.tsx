import React from 'react';
import { Archive, Clock, CheckCircle2, XCircle, Wand2 } from 'lucide-react';
import type { Job, Language, NavItem } from '../types';
import { translations } from '../i18n/translations';

interface HistoryPageProps {
  jobs: Job[];
  lang: Language;
  onNavigate: (nav: NavItem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ jobs, lang, onNavigate }) => {
  const t = translations[lang];

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
        <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-navy-900 text-lg">{t.history_title}</h3>
          <p className="text-xs text-slate-500">{t.history_empty}</p>
        </div>
        <button
          onClick={() => onNavigate('enhancer')}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/20"
        >
          <Wand2 className="w-3.5 h-3.5 inline-block mr-1.5" />
          <span>{t.dash_quick_action}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <h3 className="font-bold text-navy-900 text-lg">{t.history_title}</h3>
        <span className="text-xs text-slate-500 font-semibold">{jobs.length} işlem kaydı</span>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const isCompleted = job.status === 'completed';
          const dateStr = new Date(job.created_at).toLocaleString();

          return (
            <div
              key={job.job_id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-slate-300"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-navy-900 bg-slate-100 px-2 py-0.5 rounded">
                    #{job.job_id.substring(0, 8)}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <XCircle className="w-3 h-3 mr-1" />
                    )}
                    {isCompleted ? 'Tamamlandı' : 'Hata'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span>📅 {dateStr}</span>
                  <span>🖼️ {job.completed_images} / {job.total_images} görsel</span>
                  <span>🚀 Model: {job.images[0]?.model_name || 'Real-ESRGAN'}</span>
                  <span>🔍 {job.images[0]?.scale || 4}x Büyütme</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3">
                {isCompleted && job.completed_images > 0 && (
                  <a
                    href={`/api/download-zip/${job.job_id}`}
                    download
                    className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-navy-900 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5 text-slate-500" />
                    <span>ZIP İndir</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
