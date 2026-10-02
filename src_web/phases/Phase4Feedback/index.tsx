import React, { useState } from 'react';
import cn from 'classnames';
import { ShiftFeedback, EmotionTagId } from '../../types';
import { EMOTION_TAGS } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { Button } from '../../components/Button';
import { MoocaMascot } from '../../components/MoocaMascot';
import {
  Activity,
  TrendingDown,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import styles from './styles.module.scss';

export interface Phase4FeedbackProps {
  preHeartRate: number;
  selectedEmotions: EmotionTagId[];
  onFinishReset: (feedback: ShiftFeedback) => void;
  onRestart: () => void;
  lang: 'th' | 'en';
}

export const Phase4Feedback: React.FC<Phase4FeedbackProps> = ({
  preHeartRate,
  selectedEmotions,
  onFinishReset,
  onRestart,
  lang,
}) => {
  const [selectedShift, setSelectedShift] = useState<'empowered' | 'grounded' | 'same' | null>(null);
  const [postHeartRate] = useState(() => Math.max(72, preHeartRate - Math.floor(Math.random() * 8 + 18)));

  const handleSelectShift = (shift: 'empowered' | 'grounded' | 'same') => {
    setSelectedShift(shift);
    audioService.triggerHaptic([40, 60]);
    audioService.playJarDrop();
  };

  const handleFinish = () => {
    if (!selectedShift) return;
    onFinishReset({
      shiftResult: selectedShift,
      preHeartRate,
      postHeartRate,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const hrDelta = preHeartRate - postHeartRate;
  const primaryEmotion = EMOTION_TAGS.find((e) => e.id === selectedEmotions[0]);

  return (
    <div className={styles.container}>
      {/* Mooca Mascot & Heading */}
      <div className={styles.headerSection}>
        <MoocaMascot
          mood={selectedShift === 'empowered' ? 'celebrating' : selectedShift === 'grounded' ? 'hugging' : 'happy'}
          size="sm"
          speakingBubble={
            selectedShift === 'empowered'
              ? lang === 'th'
                ? 'สุดยอดเลย! Mooca ส่งใจให้เต็มร้อย พร้อมลุยแล้ว!'
                : 'Empowered! Mooca is cheering for you!'
              : selectedShift === 'grounded'
                ? lang === 'th'
                  ? 'ใจนิ่งสงบแล้ว ดีใจด้วยนะคนเก่ง!'
                  : 'Calm and steady, wonderful!'
                : lang === 'th'
                  ? 'ตอนนี้รู้สึกอย่างไรบ้างแล้วจ๊ะ? บอก Mooca ได้เลยนะ'
                  : 'How does your heart feel now?'
          }
        />

        <div className={styles.phaseBadge}>
          <ShieldCheck />
          <span>
            {lang === 'th' ? 'Phase 4: วัดผลลัพธ์ใจ (1:45 - 2:00)' : 'Phase 4: Closed-Loop Shift'}
          </span>
        </div>

        <h2 className={styles.heading}>
          {lang === 'th' ? 'ตอนนี้รู้สึกอย่างไรเมื่อเทียบกับตอนเริ่ม?' : 'How Do You Feel Right Now?'}
        </h2>
      </div>

      {/* Main Single-Tap Scale Area */}
      <div className={styles.mainContentArea}>
        {/* The 3 Single-Tap Options */}
        <div className={styles.optionsList}>
          {/* Option 1: Empowered */}
          <button
            type="button"
            onClick={() => handleSelectShift('empowered')}
            className={cn(styles.optionCard, {
              [styles.activeEmpowered]: selectedShift === 'empowered',
            })}
          >
            <div className={styles.optionLeftRow}>
              <span className={styles.optionEmoji}>⚡</span>
              <div>
                <div
                  className={cn(styles.optionTitle, {
                    [styles.selectedWhite]: selectedShift === 'empowered',
                  })}
                >
                  {lang === 'th' ? 'พร้อมลุย / มั่นใจขึ้น' : 'Empowered & Confident'}
                </div>
                <div
                  className={cn(styles.optionSubtitle, {
                    [styles.selectedLight]: selectedShift === 'empowered',
                  })}
                >
                  {lang === 'th' ? 'อะดรีนาลีนเปลี่ยนเป็นสมาธิอันเฉียบคม' : 'Adrenaline converted to peak focus'}
                </div>
              </div>
            </div>
            {selectedShift === 'empowered' && <CheckCircle2 className={styles.checkIcon} />}
          </button>

          {/* Option 2: Grounded */}
          <button
            type="button"
            onClick={() => handleSelectShift('grounded')}
            className={cn(styles.optionCard, {
              [styles.activeGrounded]: selectedShift === 'grounded',
            })}
          >
            <div className={styles.optionLeftRow}>
              <span className={styles.optionEmoji}>🌿</span>
              <div>
                <div
                  className={cn(styles.optionTitle, {
                    [styles.selectedWhite]: selectedShift === 'grounded',
                  })}
                >
                  {lang === 'th' ? 'นิ่งขึ้น มีสติ สงบลง' : 'Grounded & Calmer'}
                </div>
                <div
                  className={cn(styles.optionSubtitle, {
                    [styles.selectedLight]: selectedShift === 'grounded',
                  })}
                >
                  {lang === 'th' ? 'ระบบประสาทผ่อนคลาย ชีพจรคืนสมดุล' : 'Parasympathetic restoration'}
                </div>
              </div>
            </div>
            {selectedShift === 'grounded' && <CheckCircle2 className={styles.checkIcon} />}
          </button>

          {/* Option 3: Same */}
          <button
            type="button"
            onClick={() => handleSelectShift('same')}
            className={cn(styles.optionCard, {
              [styles.activeSame]: selectedShift === 'same',
            })}
          >
            <div className={styles.optionLeftRow}>
              <span className={styles.optionEmoji}>⚖️</span>
              <div>
                <div className={styles.optionTitle}>
                  {lang === 'th' ? 'ยังกังวลอยู่บ้าง' : 'Still Somewhat Anxious'}
                </div>
                <div className={styles.optionSubtitle}>
                  {lang === 'th' ? 'ไม่เป็นไรนะ ทำซ้ำกับ Mooca อีกรอบได้' : 'Can run another quick loop with Mooca'}
                </div>
              </div>
            </div>
            {selectedShift === 'same' && <CheckCircle2 className={styles.checkIcon} style={{ color: '#475569' }} />}
          </button>
        </div>

        {/* Real-time Delta Display Card */}
        <div className={styles.deltaCard}>
          <div className={styles.deltaHeader}>
            <span className={styles.deltaLabel}>
              <Activity />
              {lang === 'th' ? 'ชีพจรลดลงอย่างสงบ:' : 'Objective Bio-Delta Feedback:'}
            </span>
            <span className={styles.deltaPill}>
              <TrendingDown /> -{hrDelta} bpm
            </span>
          </div>

          <div className={styles.deltaGrid}>
            <div className={styles.deltaPreCol}>
              <span className={styles.deltaColHeader}>
                {lang === 'th' ? 'ก่อนเริ่ม' : 'Pre-Reset'}
              </span>
              <div className={styles.deltaPreValue}>
                {preHeartRate} <span>bpm</span>
              </div>
              <div className={styles.deltaEmotionTag}>
                {primaryEmotion ? (lang === 'th' ? primaryEmotion.labelTh : primaryEmotion.labelEn) : 'High Alert'}
              </div>
            </div>

            <div className={styles.deltaPostCol}>
              <span className={styles.deltaColHeader} style={{ color: '#004D40' }}>
                {lang === 'th' ? 'ปัจจุบัน' : 'Post-Reset'}
              </span>
              <div className={styles.deltaPostValue}>
                {postHeartRate} <span>bpm</span>
              </div>
              <div className={styles.deltaShiftStatus}>
                {selectedShift === 'empowered'
                  ? lang === 'th'
                    ? 'มั่นใจสูงสุด'
                    : 'Peak Ready'
                  : lang === 'th'
                    ? 'นิ่ง & มีสติ'
                    : 'Restored Calm'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className={styles.footerArea}>
        <Button
          variant="primary"
          colorTheme="turquoise"
          size="lg"
          fullWidth
          isDisabled={!selectedShift}
          onClick={handleFinish}
          label={
            selectedShift
              ? lang === 'th'
                ? 'เสร็จสิ้น 120 วินาที — รับการ์ดใจฟูจาก Mooca'
                : 'Complete 120s — Receive Mooca Badge'
              : lang === 'th'
                ? 'แตะเลือกความรู้สึกด้านบนก่อนนะ'
                : 'Complete 120s — Receive Mooca Badge'
          }
        />

        <div className={styles.restartRow}>
          <Button
            variant="ghost"
            colorTheme="blue"
            size="sm"
            onClick={onRestart}
            leadingIcon={<RotateCcw className="w-3.5 h-3.5" />}
            label={lang === 'th' ? 'รีเซ็ตอีก 1 รอบกับ Mooca' : 'Restart Reset Cycle'}
          />
        </div>
      </div>
    </div>
  );
};

export default Phase4Feedback;
