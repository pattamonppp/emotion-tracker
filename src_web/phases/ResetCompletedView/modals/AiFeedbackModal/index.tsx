import React, { useState } from 'react';
import { UserProfile, ShiftFeedback, Feedback } from '../../../../types';
import { Button } from '../../../../components/Button';
import { audioService } from '../../../../services/audioService';
import {
  CloseIcon,
  SparklesIcon,
  StarIcon,
  CheckCircleIcon,
  CopyIcon,
  CheckIcon,
  MessageHeartIcon,
  LeafIcon,
  ScaleIcon,
  RotateCcwIcon,
  PenLineIcon,
  CelebrationIcon,
  TargetIcon,
} from '../../../../icons';
import { FEEDBACK_ASPECTS, ACCURACY_OPTIONS } from './constants';
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
      // Ignore quota errors
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

  const renderRatingLabel = () => {
    switch (rating) {
      case 5:
        return (
          <span className={styles.ratingBadge}>
            <SparklesIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'th' ? 'โล่ง สบายใจขึ้นมาก' : 'Deeply relaxed and relieved'}</span>
          </span>
        );
      case 4:
        return (
          <span className={styles.ratingBadge}>
            <LeafIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'th' ? 'ผ่อนคลายขึ้นดีมาก' : 'Noticeably calmer and better'}</span>
          </span>
        );
      case 3:
        return (
          <span className={styles.ratingBadge}>
            <ScaleIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'th' ? 'รู้สึกดีขึ้นปานกลาง' : 'Moderately refreshed'}</span>
          </span>
        );
      default:
        return (
          <span className={styles.ratingBadge}>
            <RotateCcwIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'th' ? 'ยังตึงเครียดอยู่' : 'Still holding tension'}</span>
          </span>
        );
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBox}>
              <MessageHeartIcon className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className={styles.headerTitle}>
                {lang === 'th' ? 'บอกความรู้สึกถึง Mooca' : 'Feedback to Mooca'}
              </h3>
              <p className={styles.headerSubtitle}>
                {lang === 'th'
                  ? 'ความคิดเห็นของเธอช่วยให้ Mooca ดูแลใจได้ดียิ่งขึ้น'
                  : 'Your thoughts help Mooca support you even better'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className={styles.scrollContent}>
          {!submitted ? (
            <>
              {/* 1. Star Rating */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <SparklesIcon className="w-4 h-4 text-amber-500" />
                  <span>
                    {lang === 'th'
                      ? 'เซสชันนี้ช่วยให้เธอรู้สึกผ่อนคลายแค่ไหน?'
                      : 'How much did this session help relieve tension?'}
                  </span>
                </label>

                <div className={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`${styles.starBtn} ${rating >= s ? styles.filled : styles.unfilled}`}
                    >
                      <StarIcon className="w-6 h-6" />
                    </button>
                  ))}
                </div>
                <div className={styles.starLabel}>
                  {renderRatingLabel()}
                </div>
              </div>

              {/* 2. Accuracy Evaluation */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <TargetIcon className="w-4 h-4 text-teal-500" />
                  <span>
                    {lang === 'th'
                      ? 'คำปลอบและกิจกรรมตรงกับความต้องการไหม?'
                      : 'Did the comforting advice and exercises fit your state?'}
                  </span>
                </label>

                <div className={styles.accuracyGrid}>
                  {ACCURACY_OPTIONS.map((opt) => {
                    const IconComponent = opt.Icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setAccuracy(opt.id)}
                        className={`${styles.accuracyBtn} ${accuracy === opt.id ? styles.selected : ''}`}
                      >
                        <span className={styles.accuracyIcon}>
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <span className={styles.accuracyText}>
                          {lang === 'th' ? opt.labelTh : opt.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Feature Tuning Aspects */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <MessageHeartIcon className="w-4 h-4 text-teal-500" />
                  <span>
                    {lang === 'th'
                      ? 'จุดที่ทำได้ดีเป็นพิเศษ (เลือกได้หลายข้อ):'
                      : 'Key highlights that felt especially good (choose any):'}
                  </span>
                </label>

                <div className={styles.chipsList}>
                  {FEEDBACK_ASPECTS.map((aspect) => {
                    const isSelected = selectedAspects.includes(aspect.id);
                    const AspectIcon = aspect.Icon;
                    return (
                      <button
                        key={aspect.id}
                        type="button"
                        onClick={() => toggleAspect(aspect.id)}
                        className={`${styles.chipBtn} ${isSelected ? styles.selected : ''}`}
                      >
                        <AspectIcon className="w-4 h-4 mr-1.5" />
                        <span>{lang === 'th' ? aspect.labelTh : aspect.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Qualitative Comments */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  <PenLineIcon className="w-4 h-4 text-teal-500" />
                  <span>
                    {lang === 'th'
                      ? 'อยากบอกอะไรกับ Mooca เพื่อให้ดูแลใจเธอได้ดียิ่งขึ้น? (ถ้ามี)'
                      : 'Anything you want to tell Mooca to support you better? (Optional)'}
                  </span>
                </label>

                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    lang === 'th'
                      ? 'เช่น ชอบเสียงคลื่นทะเลมาก, อยากให้มีจังหวะหายใจช้าลงอีกนิด...'
                      : 'e.g. Loved the ocean soundscape, would like a slightly slower breath pace...'
                  }
                  className={styles.textarea}
                />
              </div>
            </>
          ) : (
            /* Success Feedback View */
            <div className={styles.successBox}>
              <div className={styles.successIconBox}>
                <CelebrationIcon className="w-10 h-10 text-teal-500" />
              </div>
              <h4 className={styles.successTitle}>
                {lang === 'th' ? 'บันทึกความคิดเห็นสำเร็จ!' : 'Feedback Saved!'}
              </h4>
              <p className={styles.successDesc}>
                {lang === 'th'
                  ? 'ขอบคุณมากนะ! ความคิดเห็นของเธอช่วยให้ Mooca เข้าใจและปลอบประโลมใจทุกคนได้ดียิ่งขึ้น'
                  : 'Thank you so much! Your thoughts help make Mooca gentler, warmer, and more supportive for everyone.'}
              </p>

              <button
                type="button"
                onClick={() => setShowJson(!showJson)}
                className={styles.jsonToggleBtn}
              >
                {showJson
                  ? (lang === 'th' ? 'ซ่อน JSON' : 'Hide JSON')
                  : (lang === 'th' ? 'ดูโครงสร้างข้อมูล (JSON)' : 'Inspect Data Structure (JSON)')}
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
                label={lang === 'th' ? 'ข้าม' : 'Skip'}
              />

              <Button
                variant="primary"
                colorTheme="turquoise"
                size="sm"
                onClick={handleSubmit}
                leadingIcon={<CheckCircleIcon className="w-4 h-4" />}
                label={lang === 'th' ? 'ส่งความรู้สึก' : 'Submit Feedback'}
              />
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                colorTheme="blue"
                size="sm"
                onClick={handleCopyJson}
                leadingIcon={copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-500" /> : <CopyIcon className="w-3.5 h-3.5" />}
                label={copied ? (lang === 'th' ? 'คัดลอกแล้ว!' : 'Copied!') : (lang === 'th' ? 'คัดลอก JSON' : 'Copy JSON')}
              />

              <Button
                variant="primary"
                colorTheme="turquoise"
                size="sm"
                onClick={onClose}
                label={lang === 'th' ? 'เสร็จสิ้น' : 'Done'}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiFeedbackModal;
