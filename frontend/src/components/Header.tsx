import React from 'react';
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
    </header>
  );
};
