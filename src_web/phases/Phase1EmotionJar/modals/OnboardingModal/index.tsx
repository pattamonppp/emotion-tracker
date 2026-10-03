import React, { useState } from 'react';
import { UserProfile, GoalType } from '../../../../types';
import { Button } from '../../../../components/Button';
import { MoocaMascot } from '../../../../components/MoocaMascot';
import {
  GraduationCap,
  Mic,
  Briefcase,
  BatteryCharging,
  Check,
  X,
  User,
} from 'lucide-react';
import { audioService } from '../../../../services/audioService';
import { getTranslation } from '../../../../locales';
import { MODAL_CONFIG } from '../../../../constants';
import styles from './styles.module.scss';

export interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSave,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const lang = profile.language;
  const t = getTranslation(lang);
  const o = t.modals.onboarding;

  if (!isOpen) return null;

  const GOALS: { id: GoalType; label: string; icon: any; color: string }[] = [
    {
      id: 'exam',
      label: o.goalExam,
      icon: GraduationCap,
      color: '#00C4B3',
    },
    {
      id: 'stage',
      label: o.goalStage,
      icon: Mic,
      color: '#FA8C3D',
    },
    {
      id: 'work',
      label: o.goalWork,
      icon: Briefcase,
      color: '#1F77DF',
    },
    {
      id: 'burnout',
      label: o.goalBurnout,
      icon: BatteryCharging,
      color: '#10B981',
    },
  ];

  const handleSave = () => {
    audioService.triggerHaptic('success');
    onSave(profile);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header Bar */}
        <div className={styles.headerBar}>
          <h2 className={styles.headerTitle}>{o.profileTitle}</h2>
          {onClose && (
            <button type="button" onClick={onClose} className={styles.closeBtn} title="Close">
              <X size={18} color="#64748B" />
            </button>
          )}
        </div>

        <div className={styles.content}>
          {/* Mascot Greeting */}
          <div className={styles.mascotBox}>
            <MoocaMascot
              mood="happy"
              size="sm"
              speakingBubble={o.tailoredBubble}
              interactive={true}
            />
          </div>

          {/* Name Field */}
          <div className={styles.fieldSection}>
            <label className={styles.fieldLabel}>{o.yourName}</label>
            <div className={styles.inputRow}>
              <User size={16} color="#00C4B3" className="ml-3 shrink-0" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder={o.namePlaceholder}
                className={styles.textInput}
              />
            </div>
          </div>

          {/* Goal Selector */}
          <div className={styles.fieldSection}>
            <label className={styles.fieldLabel}>{o.primaryContext}</label>
            <div className={styles.goalsGrid}>
              {GOALS.map((g) => {
                const isSelected = profile.goal === g.id;
                const IconComponent = g.icon;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      audioService.triggerHaptic('selection');
                      setProfile({ ...profile, goal: g.id });
                    }}
                    className={styles.goalCard}
                    style={{
                      borderColor: isSelected ? g.color : '#E2E8F0',
                      backgroundColor: isSelected ? `${g.color}15` : '#FFFFFF',
                    }}
                  >
                    <IconComponent size={20} color={g.color} />
                    <span
                      className={styles.goalLabel}
                      style={{
                        color: isSelected ? '#004D40' : '#1E293B',
                        fontWeight: isSelected ? 800 : 600,
                      }}
                    >
                      {g.label}
                    </span>
                    {isSelected && <Check size={14} color={g.color} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MBTI Selector */}
          <div className={styles.fieldSection}>
            <label className={styles.fieldLabel}>{o.mbtiSpecific}</label>
            <div className={styles.mbtiGrid}>
              {MODAL_CONFIG.mbtiOptions.map((m) => {
                const isSelected = profile.mbti === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      audioService.triggerHaptic('selection');
                      setProfile({ ...profile, mbti: m });
                    }}
                    className={`${styles.mbtiChip} ${isSelected ? styles.mbtiChipActive : ''}`}
                  >
                    <span className={`${styles.mbtiChipText} ${isSelected ? styles.mbtiChipTextActive : ''}`}>
                      {m}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div className={styles.saveSection}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleSave}
              icon={<Check size={18} color="#FFFFFF" />}
            >
              {o.saveSettings}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
