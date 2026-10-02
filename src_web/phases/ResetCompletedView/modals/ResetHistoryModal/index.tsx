import React from 'react';
import { ShiftFeedback, UserProfile } from '../../../../types';
import { Button } from '../../../../components/Button';
import { X, Share2, CheckCircle2, Award } from 'lucide-react';
import styles from './styles.module.scss';

export interface ResetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  history: ShiftFeedback[];
  lang: 'th' | 'en';
}

export const ResetHistoryModal: React.FC<ResetHistoryModalProps> = ({
  isOpen,
  onClose,
  profile,
  history,
  lang,
}) => {
  if (!isOpen) return null;

  const mockDefaultHistory: ShiftFeedback[] = [
    {
      shiftResult: 'empowered',
      preHeartRate: 106,
      postHeartRate: 82,
      timestamp: '08:15',
    },
    {
      shiftResult: 'grounded',
      preHeartRate: 102,
      postHeartRate: 80,
      timestamp: 'Yesterday',
    },
  ];

  const displayHistory = history.length > 0 ? history : mockDefaultHistory;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.awardIconBox}>
              <Award />
            </div>
            <div className={styles.headerTextCol}>
              <h3 className={styles.headerTitle}>
                {lang === 'th' ? 'บันทึกการรีเซ็ตใจกับ Mooca' : 'Reset History & Bio-Delta'}
              </h3>
              <p className={styles.headerSubtitle}>
                {lang === 'th' ? 'บันทึกการฟื้นฟูระบบประสาท' : 'Somatic recovery logs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            <X />
          </button>
        </div>

        {/* Scrollable list */}
        <div className={styles.scrollContent}>
          {/* Shareable Sanctuary Card */}
          <div className={styles.sanctuaryCard}>
            <div className={styles.sanctuaryCardHeader}>
              <span className={styles.sanctuaryTitle}>
                <span>🐑</span>
                <span>MOOCA SANCTUARY CARD</span>
              </span>
              <span className={styles.mbtiTag}>
                MBTI: {profile.mbti}
              </span>
            </div>

            <p className={styles.sanctuaryQuote}>
              {lang === 'th'
                ? `“${profile.name} ได้ฟื้นฟูสภาวะประสาท และพร้อมก้าวสู่ภารกิจตรงหน้าด้วยใจที่มั่นคง โดยมีเพื่อน Mooca เคียงข้างเสมอ”`
                : `“${profile.name} has re-centered their nervous equilibrium and stands ready for their arena with Mooca by their side.”`}
            </p>

            <div className={styles.sanctuaryFooter}>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 /> 120s Verified
              </span>
              <span className={styles.brandSignature}>mindfull / Ooca</span>
            </div>
          </div>

          {/* Past Sessions List */}
          <div className={styles.sessionsList}>
            <span className={styles.sessionsHeading}>
              {lang === 'th' ? 'เซสชันที่ผ่านมา' : 'Previous Sessions'}
            </span>

            {displayHistory.map((item, idx) => {
              const delta = item.preHeartRate - item.postHeartRate;
              return (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyLeft}>
                    <span className={styles.historyEmoji}>
                      {item.shiftResult === 'empowered' ? '⚡' : item.shiftResult === 'grounded' ? '🌿' : '⚖️'}
                    </span>
                    <div>
                      <div className={styles.historyStateTitle}>
                        {item.shiftResult === 'empowered'
                          ? (lang === 'th' ? 'มั่นใจ / พร้อมลุย' : 'Empowered')
                          : item.shiftResult === 'grounded'
                          ? (lang === 'th' ? 'นิ่ง มีสติ' : 'Grounded')
                          : (lang === 'th' ? 'คืนสมดุล' : 'Stabilized')}
                      </div>
                      <div className={styles.historyTimestamp}>
                        {item.timestamp} • {item.preHeartRate} bpm → {item.postHeartRate} bpm
                      </div>
                    </div>
                  </div>

                  <span className={styles.historyDeltaPill}>
                    -{delta} bpm
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footerArea}>
          <Button
            variant="secondary"
            colorTheme="blue"
            size="sm"
            onClick={onClose}
            label={lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
          />

          <Button
            variant="primary"
            colorTheme="turquoise"
            size="sm"
            leadingIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'KINETIC VIBE with Mooca',
                  text: `${profile.name} completed a 120s somatic reset with Mooca!`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(`${profile.name} completed a 120s reset with Mooca!`);
                alert(lang === 'th' ? 'คัดลอกข้อความแชร์แล้ว!' : 'Copied share text!');
              }
            }}
            label={lang === 'th' ? 'แชร์การฟื้นฟู' : 'Share Sanctuary'}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetHistoryModal;
