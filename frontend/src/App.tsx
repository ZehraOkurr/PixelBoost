import React, { useState, useEffect } from 'react';
import type { NavItem, Language, HealthInfo, Job } from './types';
import { api } from './services/api';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { EnhancerPage } from './pages/EnhancerPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  const [currentNav, setCurrentNav] = useState<NavItem>('dashboard');
  const [lang, setLang] = useState<Language>('tr'); // Turkish by default
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [historyJobs, setHistoryJobs] = useState<Job[]>([]);

  // Initial health check
  const refreshHealth = async () => {
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      console.error('Could not connect to PixelBoost backend:', err);
      // Fallback state if backend is booting
      setHealth({
        status: 'offline',
        engine_available: false,
        engine_path: 'ai-engine/realesrgan-ncnn-vulkan.exe',
        models_available: [],
        gpu_info: 'NVIDIA RTX 4050 (Vulkan)',
        vulkan_supported: true,
        system_time: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    refreshHealth();
    const interval = setInterval(refreshHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  const handleJobCompleted = (job: Job) => {
    setHistoryJobs((prev) => [job, ...prev.filter((j) => j.job_id !== job.job_id)]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-navy-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentNav={currentNav}
        onNavigate={setCurrentNav}
        lang={lang}
        onToggleLang={handleToggleLang}
        health={health}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header currentNav={currentNav} lang={lang} health={health} />

        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          {currentNav === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentNav}
              lang={lang}
              health={health}
              historyCount={historyJobs.reduce((sum, j) => sum + j.completed_images, 0)}
            />
          )}

          {currentNav === 'enhancer' && (
            <EnhancerPage
              lang={lang}
              health={health}
              onRefreshHealth={refreshHealth}
              onJobCompleted={handleJobCompleted}
            />
          )}

          {currentNav === 'history' && (
            <HistoryPage
              jobs={historyJobs}
              lang={lang}
              onNavigate={setCurrentNav}
            />
          )}

          {currentNav === 'settings' && (
            <SettingsPage
              health={health}
              lang={lang}
              onSetLang={setLang}
              onRefreshHealth={refreshHealth}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
