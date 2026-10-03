
import React, { useState } from 'react';
import {
  UserProfile,
  ShiftFeedback,
  Feedback,
} from '../../../../types';
import { Button } from '../../../../components/Button';
import { audioService } from '../../../../services/audioService';
import { getTranslation, getTagLabel } from '../../../../locales';
import {
  CloseIcon,
  StarIcon,
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
  MessageHeartIcon,
} from '../../../../icons';
import {
  FEEDBACK_ASPECTS,
  ACCURACY_OPTIONS,
  RATING_LEVELS,
} from './constants';
import styles from './styles.module.scss';

export interface AiFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  lang: 'th' | 'en';
}

const STAR_COLORS = [
  '#F43F5E',
  '#F97316',
  '#F59E0B',
  '#84CC16',
  '#10B981',
];

const getStyle = (className: string): string =>
  (styles as Record<string, string>)[className] || '';

export const AiFeedbackModal: React.FC<AiFeedbackModalProps> = ({
  isOpen,
  onClose,
  profile,
  feedback,
  lang,
}) => {
  const strings = getTranslation(lang).feedback;

  const [rating, setRating] = useState<number>(5);
  const [accuracy, setAccuracy] =
    useState<'spot_on' | 'helpful' | 'needs_work'>('spot_on');

  const [selectedAspects, setSelectedAspects] = useState<string[]>([
    'audio_binaural',
    'cognitive_reframe',
  ]);

  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [savedRecord, setSavedRecord] = useState<Feedback | null>(null);

  if (!isOpen) return null;

  const toggleAspect = (id: string) => {
    setSelectedAspects((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );

    audioService.triggerHaptic('selection');
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    audioService.triggerHaptic('selection');
  };

  const handleAccuracyChange = (
    value: 'spot_on' | 'helpful' | 'needs_work',
  ) => {
    setAccuracy(value);
    audioService.triggerHaptic('selection');
  };

  const handleSubmit = () => {
    const record: Feedback = {
      id: `feedback-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      rating,
      accuracy,
      aspects: selectedAspects,
      comment: comment.trim() || undefined,
      context: {
        mbti: profile.mbti,
        goal: profile.goal,
        shiftResult: feedback?.shiftResult || 'grounded',
        deltaBpm: feedback
          ? feedback.preHeartRate - feedback.postHeartRate
          : 22,
      },
    };

    try {
      const existing = localStorage.getItem('mooca_feedback_dataset');
      const list: Feedback[] = existing ? JSON.parse(existing) : [];

      list.push(record);

      localStorage.setItem(
        'mooca_feedback_dataset',
        JSON.stringify(list, null, 2),
      );
    } catch {
      // Ignore localStorage errors.
    }

    setSavedRecord(record);
    setSubmitted(true);

    audioService.triggerHaptic('success');
    audioService.playJarDrop();
  };

  const handleCopyJson = async () => {
    if (!savedRecord) return;

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(savedRecord, null, 2),
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Ignore clipboard errors.
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setCopied(false);
    setShowJson(false);
    onClose();
  };

  const currentRatingInfo =
    RATING_LEVELS[rating] || RATING_LEVELS[5];

  const RatingIcon = currentRatingInfo.Icon;
  const ratingColor = STAR_COLORS[rating - 1];

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
              <MessageHeartIcon className={styles.headerIcon} />

              <h3 className={styles.headerTitle}>
                {strings.modalTitle}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className={styles.closeBtn}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          <div className={styles.scrollContent}>
            {!submitted ? (
              <>
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>
                    {strings.ratingQuestion}
                  </div>

                  <div className={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isSelected = rating >= star;
                      const starColor = STAR_COLORS[star - 1];

                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className={styles.starTouch}
                          aria-label={`Rating ${star}`}
                        >
                          <StarIcon
                            style={{
                              width: 32,
                              height: 32,
                              color: isSelected
                                ? starColor
                                : '#CBD5E1',
                              fill: isSelected
                                ? starColor
                                : 'transparent',
                              strokeWidth: 2.2,
                            }}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={styles.starDescBadge}
                    style={{
                      backgroundColor: `${ratingColor}14`,
                      borderColor: `${ratingColor}55`,
                    }}
                  >
                    <RatingIcon
                      style={{
                        width: 14,
                        height: 14,
                        marginRight: 4,
                        color: ratingColor,
                        strokeWidth: 2.3,
                      }}
                    />

                    <span
                      className={styles.starDescText}
                      style={{ color: ratingColor }}
                    >
                      {getTagLabel(currentRatingInfo, lang)}
                    </span>
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionLabel}>
                    {strings.accuracyQuestion}
                  </div>

                  <div className={styles.accuracyRow}>
                    {ACCURACY_OPTIONS.map((option) => {
                      const isSelected = accuracy === option.id;
                      const IconComponent = option.Icon;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() =>
                            handleAccuracyChange(option.id)
                          }
                          className={`${styles.accuracyCard} ${isSelected
                            ? getStyle(
                              `accuracy_${option.id}`,
                            )
                            : ''
                            }`}
                        >
                          <IconComponent
                            style={{
                              width: 18,
                              height: 18,
                              marginBottom: 4,
                              color: isSelected
                                ? option.colorTheme
                                : '#64748B',
                              strokeWidth: 2.3,
                            }}
                          />

                          <span
                            className={`${styles.accuracyText} ${isSelected
                              ? styles.accuracyTextSelected
                              : ''
                              }`}
                          >
                            {getTagLabel(option, lang)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionLabel}>
                    {strings.aspectsQuestion}
                  </div>

                  <div className={styles.chipsWrap}>
                    {FEEDBACK_ASPECTS.map((aspect) => {
                      const isSelected =
                        selectedAspects.includes(aspect.id);

                      const AspectIcon = aspect.Icon;

                      return (
                        <button
                          key={aspect.id}
                          type="button"
                          onClick={() =>
                            toggleAspect(aspect.id)
                          }
                          className={`${styles.chip} ${isSelected
                            ? styles.chipActive
                            : ''
                            }`}
                        >
                          <AspectIcon
                            style={{
                              width: 14,
                              height: 14,
                              marginRight: 6,
                              color: isSelected
                                ? '#00695C'
                                : '#64748B',
                            }}
                          />

                          <span
                            className={`${styles.chipText} ${isSelected
                              ? styles.chipTextActive
                              : ''
                              }`}
                          >
                            {getTagLabel(aspect, lang)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionLabel}>
                    {strings.commentQuestion}
                  </div>

                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    placeholder={strings.commentPlaceholder}
                    className={styles.textInput}
                  />
                </div>

                <div className={styles.submitWrap}>
                  <Button
                    variant="primary"
                    colorTheme="turquoise"
                    size="md"
                    onClick={handleSubmit}
                    leadingIcon={<CheckCircleIcon />}
                    label={strings.submitButton}
                  />
                </div>
              </>
            ) : (
              <div className={styles.successCard}>
                <div className={styles.successIconCircle}>
                  <CheckCircleIcon />
                </div>

                <h4 className={styles.successTitle}>
                  {strings.successTitle}
                </h4>

                <p className={styles.successDesc}>
                  {strings.successDesc}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowJson((prev) => !prev)
                  }
                  className={styles.jsonToggleBtn}
                >
                  {showJson
                    ? strings.hideJson
                    : strings.inspectJson}
                </button>

                {showJson && savedRecord && (
                  <pre className={styles.jsonPreviewBox}>
                    {JSON.stringify(savedRecord, null, 2)}
                  </pre>
                )}

                <div className={styles.successButtonWrap}>
                  <Button
                    variant="primary"
                    colorTheme="turquoise"
                    size="md"
                    onClick={handleClose}
                    label={strings.doneButton}
                  />
                </div>

                {savedRecord && (
                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className={styles.copyJsonBtn}
                  >
                    {copied ? (
                      <CheckIcon />
                    ) : (
                      <CopyIcon />
                    )}

                    <span>
                      {copied
                        ? strings.copiedJson
                        : strings.copyJson}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeedbackModal;
