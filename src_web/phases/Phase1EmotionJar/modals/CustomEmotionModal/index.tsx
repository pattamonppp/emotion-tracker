import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  X,
  ArrowDown,
  Check,
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
import { renderBilingual } from '../../../../components/BilingualText';
import MarshmallowButton, { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT } from '../../../../components/MarshmallowButton';
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

  return createPortal(
    <div className={styles.modal}>
      <div className={styles.backdrop} />

      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.container}>
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
                {renderBilingual(editingId ? ce.editTitle : ce.newTitle)}
              </h2>

              <p className={styles.subtitle}>
                {renderBilingual(ce.tellMoocaSub)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className={styles.close}
            onClick={onClose}
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
              {renderBilingual(ce.mascotBubble)}
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
            {renderBilingual(`${inputText.length}/${MODAL_CONFIG.customEmotion.maxLength}`)}
          </span>
        </div>

        {/* Suggestions */}
        <div className={styles.suggestions}>
          <p className={styles.suggestionsLabel}>
            {renderBilingual(ce.quickTapLabel)}
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
                  {renderBilingual(item)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {editingId && (
            <div className={styles.deleteWrapper}>
              <MarshmallowButton
                variant={MARSHMALLOW_VARIANT.PINK}
                size={MARSHMALLOW_SIZE.MD}
                onPress={handleDelete}
                icon={<RotateCcw size={14} strokeWidth={2.4} />}
                title={ce.deleteBtn}
              />
            </div>
          )}

          <div className={styles.actionBtn}>
            <MarshmallowButton
              variant={MARSHMALLOW_VARIANT.MINT}
              size={MARSHMALLOW_SIZE.MD}
              disabled={isEmpty}
              onPress={handleSaveToSky}
              icon={<Sparkles size={14} strokeWidth={2.4} />}
              title={ce.keepOnSky}
            />
          </div>

          <div className={styles.actionBtn}>
            <MarshmallowButton
              variant={MARSHMALLOW_VARIANT.PRIMARY}
              size={MARSHMALLOW_SIZE.MD}
              disabled={isEmpty}
              onPress={handleSaveToJar}
              icon={isJarFull ? <Check size={16} strokeWidth={2.4} /> : <ArrowDown size={14} strokeWidth={2.6} />}
              title={isJarFull ? ce.saveCloud : ce.dropIntoJar}
            />
          </div>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomEmotionModal;
