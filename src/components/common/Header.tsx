import React from 'react';
import { Bell, ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { PertaminaLogo } from './PertaminaLogo';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onOpenNotifications: () => void;
  onOpenProfile?: () => void;
  unreadCount?: number;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 2,
  isPhoneFrame,
  onTogglePhoneFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-3">
        {/* Left Slot: Back button or Pertamina Logo */}
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
              aria-label="Kembali"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          ) : null}

          {title ? (
            <h1 className="text-lg font-bold text-slate-900 truncate tracking-tight">
              {title}
            </h1>
          ) : (
            <PertaminaLogo size="md" />
          )}
        </div>

        {/* Right Slot: Desktop frame toggle, Notification Bell, User Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Mode Switcher for Desktop evaluators */}
          <button
            onClick={onTogglePhoneFrame}
            title={isPhoneFrame ? 'Ganti ke Tampilan Lebar' : 'Ganti ke Tampilan HP Android'}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors mr-1"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span>Layar Penuh</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>Mode HP</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white" />
            )}
          </button>

          {/* User Profile Trigger */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Menu Akun"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 border border-slate-300/80 flex items-center justify-center text-xs font-bold text-slate-700">
                BP
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
