import React from 'react';
import {
  Wand2,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import type { NavItem, Language, HealthInfo } from '../types';
import { translations } from '../i18n/translations';

interface DashboardPageProps {
  onNavigate: (nav: NavItem) => void;
  lang: Language;
  health: HealthInfo | null;
  historyCount: number;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  lang,
  health,
  historyCount
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-elevated">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-red-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Real-ESRGAN NCNN Vulkan AI Core</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t.dash_welcome_title}
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            {t.dash_welcome_subtitle}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('enhancer')}
              className="flex items-center space-x-2 px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Wand2 className="w-4 h-4" />
              <span>{t.dash_quick_action}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center space-x-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-2xl font-semibold text-sm transition-colors"
            >
              <span>{t.nav_settings}</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 text-brand-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase">{t.dash_stat_upscaled}</span>
            <h4 className="text-2xl font-extrabold text-navy-900 mt-0.5">{historyCount}</h4>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase">{t.dash_stat_models}</span>
            <h4 className="text-2xl font-extrabold text-navy-900 mt-0.5">
              {health?.models_available.length || 2}
            </h4>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase">{t.dash_stat_gpu}</span>
            <h4 className="text-sm font-bold text-navy-900 mt-1 truncate" title={health?.gpu_info}>
              NVIDIA RTX 4050
            </h4>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase">Gizlilik</span>
            <h4 className="text-sm font-bold text-navy-900 mt-1">
              %100 Yerel İşleme
            </h4>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-brand-600 flex items-center justify-center font-bold text-lg">
            4x
          </div>
          <h3 className="font-bold text-navy-900 text-base">Ultra HD Büyütme</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Standart interpolasyon (Bicubic/Lanczos) yerine Real-ESRGAN derin evrişimli sinir ağları ile pikselleri yeniden oluşturur.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-navy-900 flex items-center justify-center">
            <Wand2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">Anime & İllüstrasyon</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Çizgi ve manga çizimlerine özel eğitilmiş özel model ile hatları pürüzsüzleştirir, halelenmeyi ortadan kaldırır.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-navy-900 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-navy-900 text-base">Toplu İşlem & ZIP</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aynı anda birden fazla fotoğraf yükleyin; sistem GPU belleğini aşmamak için görselleri sırayla işler ve tek tıkla ZIP olarak indirir.
          </p>
        </div>
      </div>
    </div>
  );
};
