import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { 
  Languages, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import type { UserProfile, ResetPhase, SkyTimePeriod } from '@/types';
import { MindfullLogo } from '../MindfullLogo';
import { DynamicSkyEngine, SkyPeriodSwitcher } from '../DynamicSkyEngine';
import { audioService } from '@/services/audioService';
import styles from './styles.module.scss';

export interface MobileFrameProps {
  children: React.ReactNode;
  profile: UserProfile;
  currentPhase: ResetPhase;
  phaseTime: number; // in seconds
  onOpenProfile: () => void;
  onToggleLanguage: () => void;
  onOpenStory?: () => void;
  onTimePeriodChange?: (period: SkyTimePeriod) => void;
}

export function MobileFrame({
  children,
  profile,
  currentPhase,
  phaseTime,
  onOpenProfile,
  onToggleLanguage,
  onTimePeriodChange,
}: MobileFrameProps) {
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);

  useEffect(() => {
    const unsub = audioService.subscribeBgm(setIsMusicPlaying);
    return () => unsub();
  }, []);

  const getPhaseName = () => {
    if (profile.language === 'th') {
      switch (currentPhase) {
        case 'phase1_jar': return '1. โหลเก็บความกังวล';
        case 'phase2_intervention': return '2. กายกรรมรีเซ็ต';
        case 'phase3_reframing': return '3. ปลดล็อกความคิด';
        case 'phase4_feedback': return '4. วัดผลลัพธ์ใจ';
        case 'completed': return 'กอดใจสำเร็จ';
        default: return 'เริ่มรีเซ็ต';
      }
    } else {
      switch (currentPhase) {
        case 'phase1_jar': return '1. Emotion Jar';
        case 'phase2_intervention': return '2. Somatic Shift';
        case 'phase3_reframing': return '3. Cognitive Insight';
        case 'phase4_feedback': return '4. Bio Feedback';
        case 'completed': return 'Reset Complete';
        default: return 'Start Reset';
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={styles.container} data-lang={profile.language} lang={profile.language}>
      <DynamicSkyEngine onTimePeriodChange={onTimePeriodChange} lang={profile.language}>
        <div className={styles.appShell}>
          {/* Top Bar (Wordmark, Language Actions, Music Toggle, Profile Avatar) - Full width responsive */}
          <header className={styles.topBar}>
            <div className={styles.topBarInner}>
              {/* Zone 1: Logo */}
              <div className={styles.logoRow}>
                <MindfullLogo size="sm" />
              </div>

              {/* Zone 2: Actions */}
              <div className={styles.actionsRow}>
                {/* Language Switch */}
                <button
                  type="button"
                  onClick={onToggleLanguage}
                  className={styles.langBtn}
                  title="Toggle TH / EN"
                >
                  <Languages size={13} color="#00C4B3" />
                  <span className={styles.langText}>{profile.language.toUpperCase()}</span>
                </button>

                {/* Sound / Music Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    audioService.triggerHaptic('selection');
                    audioService.toggleBackgroundMusic();
                  }}
                  className={classNames(styles.soundBtn, {
                    [styles.soundBtnActive]: isMusicPlaying,
                  })}
                  title="Toggle Background Music"
                >
                  {isMusicPlaying ? (
                    <Volume2 size={13} color="#004D40" />
                  ) : (
                    <VolumeX size={13} color="#64748B" />
                  )}
                </button>

                {/* User Profile Avatar with rounded turquoise-blue gradient */}
                <button
                  type="button"
                  onClick={() => {
                    audioService.triggerHaptic('selection');
                    onOpenProfile();
                  }}
                  className={styles.avatarWrapper}
                  title="Profile & Calibration"
                >
                  <div className={styles.avatarGradient}>
                    <span className={styles.avatarText}>
                      {profile.name.charAt(0).toUpperCase() || 'M'}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </header>

          {/* Dynamic Island Session Pill with Countdown & Sky Atmosphere Switcher - Aligned with Mobile RN App.tsx */}
          <div className={styles.dynamicIslandContainer}>
            <div className={styles.dynamicIslandRow}>
              <div className={styles.dynamicPill}>
                <span className={styles.pingDot} />
                <span className={styles.phaseLabelText}>{getPhaseName()}</span>
                <div className={styles.timerChip}>
                  <span className={styles.timerChipText}>{formatSeconds(phaseTime)}</span>
                </div>
              </div>

              {/* Dynamic Sky Period Switcher */}
              <SkyPeriodSwitcher />
            </div>
          </div>

          {/* Main Mobile Viewport */}
          <main className={styles.viewport}>
            {children}
          </main>
        </div>
      </DynamicSkyEngine>
    </div>
  );
}

export default MobileFrame;
