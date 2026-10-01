import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import { 
  Wifi, 
  Battery, 
  Layers, 
  Languages, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';
import type { UserProfile, ResetPhase } from '@/types';
import { MindfullLogo } from '../MindfullLogo';
import styles from './styles.module.scss';

export interface MobileFrameProps {
  children: React.ReactNode;
  profile: UserProfile;
  currentPhase: ResetPhase;
  phaseTime: number; // in seconds
  onOpenDesignSystem: () => void;
  onOpenProfile: () => void;
  onToggleLanguage: () => void;
  onOpenStory?: () => void;
}

export function MobileFrame({
  children,
  profile,
  currentPhase,
  phaseTime,
  onOpenDesignSystem,
  onOpenProfile,
  onToggleLanguage,
  onOpenStory,
}: MobileFrameProps) {
  const [isFramed, setIsFramed] = useState(true);
  const [timeString, setTimeString] = useState('08:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={styles.container}>
      {/* Desktop External Helper Bar */}
      <div className={styles.desktopHelperBar}>
        <div className={styles.helperIndicator}>
          <span className={styles.pulseDot} />
          <span className={styles.helperTitle}>
            <span>Mooca & mindfull CI</span>
            <span className={styles.helperBadge}>♥ Best Friend Companion</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFramed(!isFramed)}
          className={styles.toggleFrameBtn}
          title="Toggle mobile device frame"
        >
          {isFramed ? <Maximize2 className="w-3 h-3 text-[#00C4B3]" /> : <Minimize2 className="w-3 h-3 text-[#00C4B3]" />}
          <span>{isFramed ? 'Full View' : 'Device Frame'}</span>
        </button>
      </div>

      {/* Main Mobile Screen Shell */}
      <div className={cn(styles.shell, isFramed ? styles.framed : styles.fullView)}>
        {/* Dynamic Island / Mobile Status Bar */}
        <div className={styles.statusBar}>
          <span className={styles.statusTime}>{timeString}</span>

          {/* Dynamic Island Pill with countdown */}
          <div className={styles.dynamicIslandPill}>
            <span className={styles.islandPing} />
            <span className={styles.islandText}>{formatSeconds(phaseTime)}</span>
          </div>

          <div className={styles.statusIcons}>
            <Wifi className="w-3.5 h-3.5 text-[#00C4B3]" />
            <Battery className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Top Bar Contract (1 row, 3 zones) */}
        <header className={styles.header}>
          {/* Zone 1: Mindfull Logo */}
          <div className={styles.brandZone}>
            <MindfullLogo size="md" />
            <span className={styles.brandBadge}>120s</span>
          </div>

          {/* Zone 2: Step & Story trigger */}
          {onOpenStory && (
            <button
              type="button"
              onClick={onOpenStory}
              className={styles.storyBtn}
              title="เรื่องราวของ Mooca"
            >
              <span>🐑</span>
              <span>{profile.language === 'th' ? 'เพื่อน Mooca' : 'Mooca'}</span>
            </button>
          )}

          {/* Zone 3: Primary Actions (Language, Profile, Inspector) */}
          <div className={styles.actionsZone}>
            {/* Design Tokens Inspector Trigger */}
            <button
              type="button"
              onClick={onOpenDesignSystem}
              className={styles.iconBtn}
              title="Design Tokens"
            >
              <Layers className="w-3 h-3" />
            </button>

            {/* Language Switch */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className={styles.langBtn}
              title="Toggle TH / EN"
            >
              <Languages className="w-2.5 h-2.5 text-[#00C4B3]" />
              <span>{profile.language.toUpperCase()}</span>
            </button>

            {/* User Profile Avatar */}
            <button
              type="button"
              onClick={onOpenProfile}
              className={styles.profileAvatar}
              title="Profile & Calibration"
            >
              {profile.name.charAt(0).toUpperCase() || 'M'}
            </button>
          </div>
        </header>

        {/* Mobile Viewport Body */}
        <main className={styles.viewportBody}>
          {children}
        </main>

        {/* Mobile Safe Home Indicator Bar */}
        <div className={styles.homeIndicatorBar}>
          <div className={styles.homePill} />
        </div>
      </div>
    </div>
  );
}
