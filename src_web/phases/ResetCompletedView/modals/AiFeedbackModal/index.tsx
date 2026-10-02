import React, { useState } from 'react';
import { UserProfile, ShiftFeedback, Feedback } from '../../../../types';
import { Button } from '../../../../components/Button';
import { audioService } from '../../../../services/audioService';
import { getTranslation } from '../../../../locales';
import {
  CloseIcon,
  SparklesIcon,
  StarIcon,
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
  MessageHeartIcon,
  PenLineIcon,
  CelebrationIcon,
  TargetIcon,
} from '../../../../icons';
import { FEEDBACK_ASPECTS, ACCURACY_OPTIONS, RATING_LEVELS } from './constants';
import styles from './styles.module.scss';

export interface AiFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  lang: 'th' | 'en';
}

export const AiFeedbackModal: React.FC<AiFeedbackModalProps> = ({
  isOpen,
  onClose,
  profile,
  feedback,
  lang,
}) => {
  const strings = getTranslation(lang).feedback;
  const [rating, setRating] = useState<number>(5);
  const [accuracy, setAccuracy] = useState<'spot_on' | 'helpful' | 'needs_work'>('spot_on');
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
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const record: Feedback = {
      id: `feedback-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      rating,
      accuracy,
      aspects: selectedAspects,
      comment: comment.trim() || undefined,
      context: {
        mbti: profile.mbti,
        goal: profile.goal,
        shiftResult: feedback?.shiftResult || 'grounded',
        deltaBpm: feedback ? feedback.preHeartRate - feedback.postHeartRate : 22,
      },
    };

    try {
      const existing = localStorage.getItem('mooca_feedback_dataset');
      const list = existing ? JSON.parse(existing) : [];
      list.push(record);
      localStorage.setItem('mooca_feedback_dataset', JSON.stringify(list, null, 2));
    } catch {
      // quota
    }

    setSavedRecord(record);
    setSubmitted(true);
    audioService.triggerHaptic([40, 80]);
    audioService.playJarDrop();
  };

  const handleCopyJson = () => {
    if (!savedRecord) return;
    navigator.clipboard.writeText(JSON.stringify(savedRecord, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentRatingInfo = RATING_LEVELS[rating] || RATING_LEVELS[5];
  const RatingIcon = currentRatingInfo.Icon;

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBox}>
              <MessageHeartIcon />
            </div>
            <div className={styles.headerTitleGroup}>
              <h3 className={styles.headerTitle}>
                {strings.modalTitle}
              </h3>
              <p className={styles.headerSubtitle}>
                {strings.modalSubtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Scroll Content */}
        <div className={styles.scrollContent}>
          {!submitted ? (
            <>
              {/* 1. Star Rating with Distinct Contextual Icon per Star */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <span className={styles.sectionLabelIcon}>
                    <SparklesIcon />
                  </span>
                  <span>
                    {strings.ratingQuestion}
                  </span>
                </label>

                <div className={styles.starsContainer}>
                  <div className={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className={`${styles.starBtn} ${rating >= s ? styles.filled : styles.unfilled}`}
                      >
                        <StarIcon />
                      </button>
                    ))}
                  </div>

                  {/* Contextual description badge with unique icon per level */}
                  <div className={`${styles.ratingBadge} ${styles[currentRatingInfo.themeClass]}`}>
                    <RatingIcon />
                    <span>{lang === 'th' ? currentRatingInfo.labelTh : currentRatingInfo.labelEn}</span>
                  </div>
                </div>
              </div>

              {/* 2. Accuracy Evaluation with Colorful Cards */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <span className={styles.sectionLabelIcon}>
                    <TargetIcon />
                  </span>
                  <span>
                    {strings.accuracyQuestion}
                  </span>
                </label>

                <div className={styles.accuracyGrid}>
                  {ACCURACY_OPTIONS.map((opt) => {
                    const IconComponent = opt.Icon;
                    const isSelected = accuracy === opt.id;
                    const themeClass = isSelected ? styles[`accuracy_${opt.colorTheme}`] : '';

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAccuracy(opt.id)}
                        className={`${styles.accuracyBtn} ${themeClass}`}
                      >
                        <span className={styles.accuracyIcon}>
                          <IconComponent />
                        </span>
                        <span className={styles.accuracyText}>
                          {lang === 'th' ? opt.labelTh : opt.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Feature Tuning Aspects with Playful Pastel Chips */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <span className={styles.sectionLabelIcon}>
                    <MessageHeartIcon />
                  </span>
                  <span>
                    {strings.aspectsQuestion}
                  </span>
                </label>

                <div className={styles.chipsList}>
                  {FEEDBACK_ASPECTS.map((aspect) => {
                    const isSelected = selectedAspects.includes(aspect.id);
                    const AspectIcon = aspect.Icon;
                    const activeTheme = isSelected ? styles[`theme_${aspect.colorTheme}`] : '';

                    return (
                      <button
                        key={aspect.id}
                        type="button"
                        onClick={() => toggleAspect(aspect.id)}
                        className={`${styles.chipBtn} ${activeTheme}`}
                      >
                        <AspectIcon />
                        <span>{lang === 'th' ? aspect.labelTh : aspect.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Qualitative Comments with Applied App Font & Generous Height */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <span className={styles.sectionLabelIcon}>
                    <PenLineIcon />
                  </span>
                  <span>
                    {strings.commentQuestion}
                  </span>
                </label>

                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={strings.commentPlaceholder}
                  className={styles.textarea}
                />
              </div>
            </>
          ) : (
            /* Success Feedback View */
            <div className={styles.successBox}>
              <div className={styles.successIconBox}>
                <CelebrationIcon />
              </div>
              <h4 className={styles.successTitle}>
                {strings.successTitle}
              </h4>
              <p className={styles.successDesc}>
                {strings.successDesc}
              </p>

              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
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
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className={styles.footerArea}>
          {!submitted ? (
            <>
              <Button
                variant="ghost"
                colorTheme="turquoise"
                size="sm"
                onClick={onClose}
                label={strings.skipButton}
              />

              <Button
                variant="primary"
                colorTheme="turquoise"
                size="sm"
                onClick={handleSubmit}
                leadingIcon={<CheckCircleIcon />}
                label={strings.submitButton}
              />
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                colorTheme="blue"
                size="sm"
                onClick={handleCopyJson}
                leadingIcon={copied ? <CheckIcon /> : <CopyIcon />}
                label={copied ? strings.copiedJson : strings.copyJson}
              />

              <Button
                variant="primary"
                colorTheme="turquoise"
                size="sm"
                onClick={onClose}
                label={strings.doneButton}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiFeedbackModal;
