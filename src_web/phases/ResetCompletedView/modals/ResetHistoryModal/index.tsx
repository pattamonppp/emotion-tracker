import React from 'react';
import { ShiftFeedback, UserProfile } from '../../../../types';
import { Button } from '../../../../components/Button';
import { getTranslation } from '../../../../locales';
import { X, Share2, CheckCircle2, Award } from 'lucide-react';
import { HeartIcon, ZapIcon, LeafIcon, ScaleIcon } from '../../../../icons';
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
  const strings = getTranslation(lang).modals.history;
  const completedStrings = getTranslation(lang).phases.completed;
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
                {strings.title}
              </h3>
              <p className={styles.headerSubtitle}>
                {strings.subtitle}
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
                <HeartIcon />
                <span>{strings.sanctuaryCardTitle}</span>
              </span>
              <span className={styles.mbtiTag}>
                MBTI: {profile.mbti}
              </span>
            </div>

            <p className={styles.sanctuaryQuote}>
              {strings.quoteTemplate.replace('{name}', profile.name)}
            </p>

            <div className={styles.sanctuaryFooter}>
              <span className={styles.verifiedBadge}>
                <CheckCircle2 /> {strings.verifiedText}
              </span>
              <span className={styles.brandSignature}>mindfull / Ooca</span>
            </div>
          </div>

          {/* Past Sessions List */}
          <div className={styles.sessionsList}>
            <span className={styles.sessionsHeading}>
              {strings.previousSessions}
            </span>

            {displayHistory.map((item, idx) => {
              const delta = item.preHeartRate - item.postHeartRate;
              const resultClass = item.shiftResult === 'empowered'
                ? styles.historyEmpowered
                : item.shiftResult === 'grounded'
                ? styles.historyGrounded
                : styles.historySame;

              return (
                <div key={idx} className={styles.historyItem}>
                  <div className={styles.historyLeft}>
                    <span className={`${styles.historyEmoji} ${resultClass}`}>
                      {item.shiftResult === 'empowered' ? (
                        <ZapIcon />
                      ) : item.shiftResult === 'grounded' ? (
                        <LeafIcon />
                      ) : (
                        <ScaleIcon />
                      )}
                    </span>
                    <div>
                      <div className={styles.historyStateTitle}>
                        {item.shiftResult === 'empowered'
                          ? completedStrings.stateEmpowered
                          : item.shiftResult === 'grounded'
                            ? completedStrings.stateGrounded
                            : completedStrings.stateStabilized}
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
            label={strings.closeButton}
          />

          <Button
            variant="primary"
            colorTheme="turquoise"
            size="sm"
            leadingIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: strings.sanctuaryCardTitle,
                  text: strings.quoteTemplate.replace('{name}', profile.name),
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(strings.quoteTemplate.replace('{name}', profile.name));
                alert(strings.copiedAlert);
              }
            }}
            label={strings.shareSanctuary}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetHistoryModal;
