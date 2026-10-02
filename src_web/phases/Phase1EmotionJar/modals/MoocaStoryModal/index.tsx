import React, { useState } from 'react';
import cn from 'classnames';
import { MoocaMascot } from '../../../../components/MoocaMascot';
import { Button } from '../../../../components/Button';
import { audioService } from '../../../../services/audioService';
import {
  Heart,
  Sparkles,
  X,
  Sun,
  Wind,
  BookOpen,
} from 'lucide-react';
import { getTranslation } from '../../../../locales';
import styles from './styles.module.scss';

export interface MoocaStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
  userName: string;
}

export const MoocaStoryModal: React.FC<MoocaStoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  userName,
}) => {
  const t = getTranslation(lang);
  const strings = t.modals.story;
  const [activeTab, setActiveTab] = useState<'story' | 'breath' | 'comfort'>('story');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isBreathing, setIsBreathing] = useState(false);
  const [hugCount, setHugCount] = useState(0);

  if (!isOpen) return null;

  const handleGiveHug = () => {
    setHugCount((prev) => prev + 1);
    audioService.triggerHaptic([30, 50, 40]);
    audioService.playJarDrop();
  };

  const handleStartBreathing = () => {
    setIsBreathing(true);
    let cycle = 0;
    const interval = setInterval(() => {
      cycle = (cycle + 1) % 3;
      if (cycle === 0) setBreathPhase('inhale');
      else if (cycle === 1) setBreathPhase('hold');
      else setBreathPhase('exhale');
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setIsBreathing(false);
    }, 24000);
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.heartCircle}>
              <Heart />
            </span>
            <div>
              <h2 className={styles.headerTitle}>
                {strings.headerTitle}
              </h2>
              <p className={styles.headerSubtitle}>
                {strings.headerSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
          >
            <X />
          </button>
        </div>

        {/* Cozy Tabs */}
        <div className={styles.tabsRow}>
          <button
            type="button"
            onClick={() => setActiveTab('story')}
            className={cn(styles.tabBtn, {
              [styles.active]: activeTab === 'story',
            })}
          >
            <BookOpen />
            <span>{strings.tabStory}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breath')}
            className={cn(styles.tabBtn, {
              [styles.active]: activeTab === 'breath',
            })}
          >
            <Wind />
            <span>{strings.tabBreath}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comfort')}
            className={cn(styles.tabBtn, {
              [styles.active]: activeTab === 'comfort',
            })}
          >
            <Heart />
            <span>{strings.tabComfort}</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className={styles.contentArea}>
          {/* TAB 1: STORY OF MOOCA */}
          {activeTab === 'story' && (
            <div className={styles.tabWrapper}>
              <MoocaMascot
                mood="hugging"
                size="md"
                showSunny={true}
                speakingBubble={strings.storyBubble.replace('{name}', userName || 'Friend')}
              />

              <div className={styles.storyCard}>
                <p className={styles.storyLead}>
                  {strings.storyLead}
                </p>
                <p className={styles.storyParagraph}>
                  {strings.storyParagraph}
                </p>
                <p className={styles.storyHighlight}>
                  <Sparkles />
                  {strings.storyHighlight}
                </p>
              </div>

              {/* Sunny Companion note */}
              <div className={styles.sunnyCard}>
                <Sun />
                <span>
                  {strings.sunnyCard}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: BREATHE WITH MOOCA */}
          {activeTab === 'breath' && (
            <div className={styles.tabWrapper}>
              <MoocaMascot
                mood={breathPhase === 'inhale' ? 'comforting' : breathPhase === 'hold' ? 'praying' : 'sleepy'}
                size="md"
                showSunny={false}
              />

              <div className={styles.breathContainer}>
                <div
                  className={cn(styles.breathCircle, styles[breathPhase])}
                >
                  <Wind />
                  <span className={styles.breathPhaseText}>
                    {breathPhase === 'inhale' && strings.breatheIn}
                    {breathPhase === 'hold' && strings.breatheHold}
                    {breathPhase === 'exhale' && strings.breatheExhale}
                  </span>
                  <span className={styles.breathSeconds}>{strings.secondsUnit.replace('{sec}', '4')}</span>
                </div>

                <p className={styles.breathHint}>
                  {strings.breatheHint}
                </p>

                <div className={styles.breathActionRow}>
                  <Button
                    variant="primary"
                    colorTheme="turquoise"
                    size="sm"
                    fullWidth
                    onClick={handleStartBreathing}
                    label={
                      isBreathing
                        ? strings.breathingTogether
                        : strings.breatheBtn
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WARM HUG & AFFIRMATIONS */}
          {activeTab === 'comfort' && (
            <div className={styles.tabWrapper}>
              <MoocaMascot
                mood="hugging"
                size="md"
                showSunny={true}
                speakingBubble={
                  hugCount > 0
                    ? strings.hugCount.replace('{count}', String(hugCount))
                    : strings.hugSubtitle
                }
              />

              <div className={styles.hugSection}>
                <div className={styles.affirmationBox}>
                  <div className={styles.affirmationHeader}>
                    <Heart />
                    <span>{strings.dailyReassurance}</span>
                  </div>
                  <p className={styles.affirmationBody}>
                    {strings.dailyReassuranceBody}
                  </p>
                </div>

                <div className={styles.hugWarmthCard}>
                  <span className={styles.hugWarmthTitle}>
                    {strings.hugLead}
                  </span>
                  <div className={styles.hugCounterRow}>
                    <span>{hugCount}</span>
                    <Heart />
                  </div>
                </div>

                <Button
                  variant="primary"
                  colorTheme="turquoise"
                  size="md"
                  fullWidth
                  onClick={handleGiveHug}
                  leadingIcon={<Heart className="w-4 h-4 text-white fill-white" />}
                  label={strings.hugBtn}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footerArea}>
          <Button
            variant="secondary"
            colorTheme="blue"
            size="sm"
            onClick={onClose}
            label={strings.thankYouMooca}
          />
        </div>
      </div>
    </div>
  );
};

export default MoocaStoryModal;
