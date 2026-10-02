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
                {lang === 'th' ? 'เรื่องราวของ Mooca' : 'The Story of Mooca'}
              </h2>
              <p className={styles.headerSubtitle}>
                {lang === 'th' ? 'เพื่อนแท้ที่จะอยู่เคียงข้างเธอเสมอ' : 'Your best friend who is always by your side'}
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
            <span>{lang === 'th' ? 'นิทาน Mooca' : 'Story'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breath')}
            className={cn(styles.tabBtn, {
              [styles.active]: activeTab === 'breath',
            })}
          >
            <Wind />
            <span>{lang === 'th' ? 'หายใจกับ Mooca' : 'Breathe'}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comfort')}
            className={cn(styles.tabBtn, {
              [styles.active]: activeTab === 'comfort',
            })}
          >
            <Heart />
            <span>{lang === 'th' ? 'อ้อมกอด' : 'Warm Hug'}</span>
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
                speakingBubble={
                  lang === 'th'
                    ? `ไม่ต้องกลัวนะ ${userName}... Mooca อยู่นี่แล้ว!`
                    : `Don’t be afraid, ${userName}... Mooca is here!`
                }
              />

              <div className={styles.storyCard}>
                <p className={styles.storyLead}>
                  {lang === 'th'
                    ? 'Mooca คือเพื่อนตัวนุ่มที่ถักทอขึ้นมาจากความเข้าใจและความอบอุ่น...'
                    : 'Mooca was born from boundless empathy and cozy warmth...'}
                </p>
                <p className={styles.storyParagraph}>
                  {lang === 'th'
                    ? 'ในวันที่โลกภายนอกหมุนเร็วเกินไป วันที่เธอต้องเข้าห้องสอบด้วยมือที่เย็นเฉียบ วันที่ต้องขึ้นเวทีด้วยหัวใจที่เต้นรัว หรือวันที่สมองล้าจนก้าวต่อไปไม่ไหว...'
                    : 'On days when the world spins too fast, when your hands tremble before a big test, when your heart races before going on stage, or when your mind feels completely frozen...'}
                </p>
                <p className={styles.storyHighlight}>
                  <Sparkles />
                  {lang === 'th'
                    ? 'Mooca จะไม่บอกให้เธอหยุดกลัว แต่จะนั่งลงข้าง ๆ จับมือเธอไว้ ถือความกังวลใส่ขวดโหลแก้ว และพาเธอหายใจจนกว่าแสงอาทิตย์ในใจจะกลับมาส่องสว่างอีกครั้ง!'
                    : 'Mooca won’t tell you to "just relax". Mooca will sit right by your side, hold your hands, put your heavy thoughts in a safe jar, and breathe with you until your inner sunshine glows!'}
                </p>
              </div>

              {/* Sunny Companion note */}
              <div className={styles.sunnyCard}>
                <Sun />
                <span>
                  {lang === 'th'
                    ? 'เจ้าก้อน Sunny พระอาทิตย์ดวงจิ๋วข้าง ๆ Mooca คือตัวแทนของรอยยิ้มที่กำลังจะกลับมาหาเธอนะ!'
                    : 'Sunny, the tiny sun beside Mooca, represents the warm smile that is returning to you!'}
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
                    {breathPhase === 'inhale' && (lang === 'th' ? 'สูดลมหายใจ...' : 'Breathe In...')}
                    {breathPhase === 'hold' && (lang === 'th' ? 'กลั้นไว้เบา ๆ...' : 'Hold Softly...')}
                    {breathPhase === 'exhale' && (lang === 'th' ? 'ผ่อนลมออกช้า ๆ...' : 'Exhale Slowly...')}
                  </span>
                  <span className={styles.breathSeconds}>4 วินาที</span>
                </div>

                <p className={styles.breathHint}>
                  {lang === 'th'
                    ? 'มอง Mooca ขยับตามจังหวะ หายใจลึก ๆ 4-4-4 จังหวะ'
                    : 'Follow Mooca’s breathing tempo (Box 4-4-4 method)'}
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
                        ? lang === 'th' ? 'กำลังหายใจร่วมกับ Mooca...' : 'Breathing Together...'
                        : lang === 'th' ? 'เริ่มฝึกหายใจกับ Mooca (24s)' : 'Start 24s Breathing'
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
                    ? lang === 'th'
                      ? `Mooca ส่งกอดให้แล้ว ${hugCount} ครั้ง! อุ่นขึ้นไหมจ๊ะ?`
                      : `Mooca gave you ${hugCount} hugs! Feel warmer?`
                    : lang === 'th'
                      ? 'แตะปุ่มด้านล่างเพื่อรับกอดนุ่ม ๆ นะ'
                      : 'Tap below for a warm Mooca hug!'
                }
              />

              <div className={styles.hugSection}>
                <div className={styles.affirmationBox}>
                  <div className={styles.affirmationHeader}>
                    <Heart />
                    <span>{lang === 'th' ? 'ข้อความปลอบใจประจำวัน' : 'Mooca’s Daily Reassurance'}</span>
                  </div>
                  <p className={styles.affirmationBody}>
                    {lang === 'th'
                      ? '“ไม่ต้องสมบูรณ์แบบก็ได้นะ แค่เธอพยายามอย่างเต็มที่ในแบบของเธอ นั่นคือสิ่งที่ยอดเยี่ยมที่สุดแล้ว Mooca อยู่ข้างเธอเสมอ!”'
                      : '“You don’t have to be perfect. Trying your best in your own unique way is already wonderful. Mooca is forever by your side!”'}
                  </p>
                </div>

                <div className={styles.hugWarmthCard}>
                  <span className={styles.hugWarmthTitle}>
                    {lang === 'th' ? 'สะสมไออุ่นจาก Mooca' : 'Accumulated Hug Warmth'}
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
                  label={lang === 'th' ? 'ขอกอด Mooca แน่น ๆ อีกครั้ง!' : 'Send a Big Hug to Mooca!'}
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
            label={lang === 'th' ? 'เข้าใจแล้ว ขอบคุณนะ Mooca' : 'Thank you, Mooca!'}
          />
        </div>
      </div>
    </div>
  );
};

export default MoocaStoryModal;
