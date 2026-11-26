import React from 'react';
import {
  Wand2,
  History,
  Settings as SettingsIcon,
  Cpu,
  Globe,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import type { NavItem, Language, HealthInfo } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  currentNav: NavItem;
  onNavigate: (nav: NavItem) => void;
  lang: Language;
  onToggleLang: () => void;
  health: HealthInfo | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentNav,
  onNavigate,
  lang,
  onToggleLang,
  health
}) => {
  const t = translations[lang];

  const navItems = [
    { id: 'enhancer' as NavItem, label: t.nav_enhancer, icon: Wand2 },
    { id: 'history' as NavItem, label: t.nav_history, icon: History },
    { id: 'settings' as NavItem, label: t.nav_settings, icon: SettingsIcon },
  ];

  const engineReady = health?.engine_available ?? false;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shadow-sm z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="PixelBoost AI" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-bold text-lg tracking-tight text-navy-900 leading-tight">
                PixelBoost <span className="text-brand-600 font-extrabold">AI</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Real-ESRGAN</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-red-50 text-brand-600 shadow-sm shadow-red-500/10'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-navy-900'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Widget */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        {/* AI Engine Status Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span>AI Engine</span>
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
              engineReady
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {engineReady ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Hazır
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Eksik
                </>
              )}
            </span>
          </div>
          <p className="text-slate-500 truncate text-[11px]" title={health?.gpu_info || 'NVIDIA RTX 4050 Vulkan'}>
            {health?.gpu_info || 'NVIDIA RTX 4050 Vulkan'}
          </p>
        </div>

        {/* Language Switcher */}
        <button
          onClick={onToggleLang}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
        >
          <span className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Dil / Language</span>
          </span>
          <span className="uppercase text-[11px] bg-slate-100 px-2 py-0.5 rounded font-bold text-navy-900">
            {lang === 'tr' ? 'Türkçe' : 'English'}
          </span>
        </button>
      </div>
    </aside>
  );
};
