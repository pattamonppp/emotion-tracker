import React from 'react';
import { Language, ShiftFeedback, UserProfile } from '../../../../types';
import { getTranslation } from '../../../../locales';
import {
  X,
  Award,
  Activity,
  Sparkles,
} from 'lucide-react';
import styles from './styles.module.scss';

export interface ResetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  history: ShiftFeedback[];
  lang: Language;
}

export const ResetHistoryModal: React.FC<ResetHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  lang,
}) => {
  const t = getTranslation(lang);
  const h = t.modals.history;

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
      timestamp: h.today,
    },
  ];

  const displayHistory =
    history.length > 0 ? history : mockDefaultHistory;

  return (
    <div className={styles.backdrop}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.safeArea}>
          <div className={styles.headerBar}>
            <div className={styles.headerTitleRow}>
              <Award className={styles.headerIcon} />

              <h3 className={styles.headerTitle}>
                {h.resetHistoryTitle}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <X />
            </button>
          </div>

          <div className={styles.content}>
            {displayHistory.map((item, idx) => {
              const drop =
                item.preHeartRate - item.postHeartRate;

              return (
                <div
                  key={idx}
                  className={styles.historyCard}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.badgeShift}>
                      <Sparkles />

                      <span className={styles.badgeShiftText}>
                        {item.shiftResult.toUpperCase()}
                      </span>
                    </div>

                    <span className={styles.timestampText}>
                      {item.timestamp
                        ? item.timestamp.split('T')[0]
                        : h.today}
                    </span>
                  </div>

                  <div className={styles.metricRow}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>
                        {h.preLabel}
                      </span>

                      <span className={styles.metricVal}>
                        {item.preHeartRate} BPM
                      </span>
                    </div>

                    <div className={styles.deltaBox}>
                      <Activity />

                      <span className={styles.deltaVal}>
                        -{drop} BPM
                      </span>
                    </div>

                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>
                        {h.postLabel}
                      </span>

                      <span
                        className={`${styles.metricVal} ${styles.metricValPost}`}
                      >
                        {item.postHeartRate} BPM
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetHistoryModal;
