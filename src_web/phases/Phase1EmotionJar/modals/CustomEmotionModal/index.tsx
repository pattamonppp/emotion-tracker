import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  X,
  ArrowDown,
  MessageCircleHeart,
  RotateCcw,
} from 'lucide-react';
import classNames from 'classnames';
import { audioService, HAPTIC_STYLE } from '../../../../services/audioService';
import { MOOCA_MOOD, MoocaMascot } from '../../../../components/MoocaMascot';
import { DESIGN_TOKENS } from '../../../../design-system/tokens';
import { getTranslation } from '../../../../locales';
import { MODAL_CONFIG } from '../../../../constants';
import { Language } from '../../../../types';
import styles from './styles.module.scss';

export interface CustomEmotionModalProps {
  isOpen: boolean;
  editingId?: string | null;
  initialText: string;
  onSave: (
    text: string,
    putInJarImmediately: boolean,
    editingId?: string | null,
  ) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  lang: Language;
  isJarFull: boolean;
}

export const CustomEmotionModal: React.FC<CustomEmotionModalProps> = ({
  isOpen,
  editingId,
  initialText,
  onSave,
  onDelete,
  onClose,
  lang,
  isJarFull,
}) => {
  const [inputText, setInputText] = useState(initialText);

  const t = getTranslation(lang);
  const ce = t.modals.customEmotion;

  useEffect(() => {
    if (isOpen) {
      setInputText(initialText);
    }
  }, [isOpen, initialText]);

  const handleSuggestionPress = (suggestion: string) => {
    audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);
    setInputText(suggestion);
  };

  const handleSaveToJar = () => {
    const trimmed = inputText.trim();

    if (!trimmed) return;

    audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
    audioService.playJarDrop();

    onSave(trimmed, !isJarFull, editingId);
    onClose();
  };

  const handleSaveToSky = () => {
    const trimmed = inputText.trim();

    if (!trimmed) return;

    audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);

    onSave(trimmed, false, editingId);
    onClose();
  };

  const handleDelete = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);

    if (editingId && onDelete) {
      onDelete(editingId);
    }

    onClose();
  };

  if (!isOpen) return null;

  const suggestions = ce.quickSuggestions || [];
  const isEmpty = !inputText.trim();

  return (
    <div className={styles.modal}>
      <button
        type="button"
        className={styles.backdrop}
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-emotion-modal-title"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleRow}>
            <div className={styles.iconCircle}>
              <MessageCircleHeart
                size={16}
                color="#EC4899"
                strokeWidth={2.4}
              />
            </div>

            <div>
              <h2
                id="custom-emotion-modal-title"
                className={styles.title}
              >
                {editingId ? ce.editTitle : ce.newTitle}
              </h2>

              <p className={styles.subtitle}>
                {ce.tellMoocaSub}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <X
              size={18}
              color={DESIGN_TOKENS.color.gray.muted}
              strokeWidth={2.4}
            />
          </button>
        </div>

        {/* Mooca */}
        <div className={styles.mascotSpeech}>
          <div className={styles.mascot}>
            <MoocaMascot
              size="xs"
              mood={MOOCA_MOOD.COMFORTING}
              interactive={false}
            />
          </div>

          <div className={styles.mascotBubble}>
            <p className={styles.mascotBubbleText}>
              {ce.mascotBubble}
            </p>
          </div>
        </div>

        {/* Input */}
        <div className={styles.inputWrapper}>
          <textarea
            className={styles.textInput}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={ce.inputPlaceholder}
            maxLength={MODAL_CONFIG.customEmotion.maxLength}
            autoFocus
          />

          <span className={styles.charCount}>
            {inputText.length}/{MODAL_CONFIG.customEmotion.maxLength}
          </span>
        </div>

        {/* Suggestions */}
        <div className={styles.suggestions}>
          <p className={styles.suggestionsLabel}>
            {ce.quickTapLabel}
          </p>

          <div className={styles.suggestionsList}>
            {suggestions.map((item, index) => {
              const isActive = inputText === item;

              return (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  className={classNames(styles.suggestionChip, {
                    [styles.suggestionChipActive]: isActive,
                  })}
                  onClick={() => handleSuggestionPress(item)}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {editingId && (
            <button
              type="button"
              className={styles.delete}
              onClick={handleDelete}
            >
              <RotateCcw
                size={12}
                strokeWidth={2.4}
              />
              <span>{ce.deleteBtn}</span>
            </button>
          )}

          <button
            type="button"
            className={classNames(styles.saveSky, {
              [styles.buttonDisabled]: isEmpty,
            })}
            disabled={isEmpty}
            onClick={handleSaveToSky}
          >
            <Sparkles
              size={13}
              color={DESIGN_TOKENS.color.brand.turquoise.text}
              strokeWidth={2.4}
            />

            <span>{ce.keepOnSky}</span>
          </button>

          <button
            type="button"
            className={classNames(styles.saveJar, {
              [styles.buttonDisabled]: isEmpty,
            })}
            disabled={isEmpty}
            onClick={handleSaveToJar}
          >
            <ArrowDown
              size={14}
              color="#FFFFFF"
              strokeWidth={2.6}
            />

            <span>
              {isJarFull
                ? ce.saveCloud
                : ce.dropIntoJar}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomEmotionModal;
