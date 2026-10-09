import React from 'react';
import { Home, ArrowLeftRight, ShoppingBag, Clock, User as UserIcon } from 'lucide-react';

export type NavTab = 'beranda' | 'transfer' | 'shopee' | 'riwayat' | 'profil';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'beranda' as NavTab,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'transfer' as NavTab,
      label: 'Transfer',
      icon: ArrowLeftRight,
    },
    {
      id: 'shopee' as NavTab,
      label: 'Shopee',
      icon: ShoppingBag,
      highlight: true,
    },
    {
      id: 'riwayat' as NavTab,
      label: 'Riwayat',
      icon: Clock,
    },
    {
      id: 'profil' as NavTab,
      label: 'Profil',
      icon: UserIcon,
    },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-all"
    >
      <div className="max-w-md mx-auto px-2 flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          if (tab.highlight) {
            // Shopee distinctive middle button styling
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative -top-2 flex flex-col items-center justify-center group focus:outline-none"
                aria-label={tab.label}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md ${
                    isActive
                      ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white scale-105 shadow-orange-500/30 ring-2 ring-orange-200'
                      : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white hover:scale-105 shadow-orange-500/20'
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[11px] font-semibold mt-0.5 tracking-tight transition-colors ${
                    isActive ? 'text-orange-600 font-bold' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center py-1 min-h-[48px] relative group focus:outline-none"
              aria-label={tab.label}
            >
              <div
                className={`p-1 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-red-600 bg-red-50 scale-105'
                    : 'text-slate-500 group-hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] sm:text-[11px] tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'text-red-600 font-bold' : 'text-slate-500 font-medium group-hover:text-slate-800'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 absolute bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
