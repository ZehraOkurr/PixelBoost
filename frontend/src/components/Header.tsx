import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import type { NavItem, Language, HealthInfo } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  currentNav: NavItem;
  lang: Language;
  health: HealthInfo | null;
}

export const Header: React.FC<HeaderProps> = ({ currentNav, lang }) => {
  const t = translations[lang];

  const getPageMeta = () => {
    switch (currentNav) {
      case 'dashboard':
        return { title: t.nav_dashboard, subtitle: t.dash_welcome_subtitle };
      case 'enhancer':
        return { title: t.nav_enhancer, subtitle: t.app_subtitle };
      case 'history':
        return { title: t.nav_history, subtitle: 'Geçmiş iyileştirme oturumlarınız ve dosya çıktıları' };
      case 'settings':
        return { title: t.nav_settings, subtitle: t.config_title };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-xl font-bold text-navy-900 tracking-tight">{meta.title}</h2>
        <p className="text-xs text-slate-500 mt-0.5 max-w-xl truncate">{meta.subtitle}</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Vulkan Hardware Acceleration Badge */}
        <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Vulkan GPU Hızlandırma</span>
        </div>

        {/* Local AI Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 bg-red-50 text-brand-600 border border-red-100 px-3 py-1.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>%100 Yerel AI (Gizlilik Güvenceli)</span>
        </div>
      </div>
    </header>
  );
};
