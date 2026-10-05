import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Sparkles, X, ArrowDown, MessageCircleHeart, RotateCcw } from 'lucide-react-native';
import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { MOOCA_MOOD, MoocaMascot } from '../../../components/MoocaMascot';
import { colors, shadows, typography } from '../../../design-system/tokens';
import { getTranslation } from '../../../locales';
import { MODAL_CONFIG } from '../../../constants';
import { Language } from '../../../types';
import { renderBilingualNodes } from '../../../components/BilingualText';
import { MarshmallowButton, MARSHMALLOW_VARIANT, MARSHMALLOW_SIZE } from '../../../design-system/MarshmallowButton';

export interface CustomEmotionModalProps {
  isOpen: boolean;
  editingId?: string | null;
  initialText: string;
  onSave: (text: string, putInJarImmediately: boolean, editingId?: string | null) => void;
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
  const [isFocused, setIsFocused] = useState(false);
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

  const suggestions = ce.quickSuggestions || [];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={styles.cardContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <MessageCircleHeart size={16} color="#EC4899" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {renderBilingualNodes(editingId ? ce.editTitle : ce.newTitle, typography.fontPromptBold, typography.fontGothamBold)}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {renderBilingualNodes(ce.tellMoocaSub, typography.fontPromptRegular, typography.fontGothamBook)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <X size={18} color={colors.textMuted} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          {/* Mooca Mascot Speaking */}
          <View style={styles.mascotSpeechRow}>
            <View style={{ width: 54, height: 54, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MoocaMascot size="xs" mood={MOOCA_MOOD.COMFORTING} interactive={false} />
            </View>
            <View style={styles.mascotBubble}>
              <Text style={styles.mascotBubbleText}>
                {renderBilingualNodes(ce.mascotBubble, typography.fontPromptSemiBold, typography.fontGotham)}
              </Text>
            </View>
          </View>

          {/* Text Input Container */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={[
                styles.textInput,
                isFocused && styles.textInputFocused,
              ]}
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={ce.inputPlaceholder}
              placeholderTextColor="#637b91"
              maxLength={MODAL_CONFIG.customEmotion.maxLength}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              autoFocus
              returnKeyType="done"
            />
            <Text style={styles.charCount}>
              {renderBilingualNodes(`${inputText.length}/${MODAL_CONFIG.customEmotion.maxLength}`, typography.fontPromptRegular, typography.fontGothamBook)}
            </Text>
          </View>

          {/* Quick Suggestions Chips */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>
              {renderBilingualNodes(ce.quickTapLabel)}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsList}
            >
              {suggestions.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSuggestionPress(item)}
                  style={[
                    styles.suggestionChip,
                    inputText === item && styles.suggestionChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.suggestionText,
                      inputText === item && styles.suggestionTextActive,
                    ]}
                  >
                    {renderBilingualNodes(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            {editingId ? (
              <View style={styles.deleteWrapper}>
                <MarshmallowButton
                  variant={MARSHMALLOW_VARIANT.PINK}
                  size={MARSHMALLOW_SIZE.MD}
                  title={ce.deleteBtn}
                  icon={<RotateCcw size={12} color="#EF4444" strokeWidth={2.4} />}
                  onPress={handleDelete}
                />
              </View>
            ) : null}

            <View style={styles.actionBtn}>
              <MarshmallowButton
                variant={MARSHMALLOW_VARIANT.MINT}
                size={MARSHMALLOW_SIZE.MD}
                title={ce.keepOnSky}
                icon={<Sparkles size={13} color={colors.primaryDark} strokeWidth={2.4} />}
                disabled={!inputText.trim()}
                style={{ width: '100%' }}
                onPress={handleSaveToSky}
              />
            </View>

            <View style={styles.actionBtn}>
              <MarshmallowButton
                variant={MARSHMALLOW_VARIANT.PRIMARY}
                size={MARSHMALLOW_SIZE.MD}
                title={isJarFull ? ce.saveCloud : ce.dropIntoJar}
                icon={<ArrowDown size={14} color="#FFFFFF" strokeWidth={2.6} />}
                disabled={!inputText.trim()}
                style={{ width: '100%' }}
                onPress={handleSaveToJar}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(239, 119, 115, 0.3)',
    ...shadows.card,
    zIndex: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDEFEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primaryDark,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  headerSubtitle: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 11,
    lineHeight: 16,
    color: '#637b91',
    ...(Platform.OS !== 'android' ? { fontWeight: '400' } : {}),
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotSpeechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDEFEE',
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FAD6D5',
  },
  mascotBubble: {
    flex: 1,
  },
  mascotBubbleText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: '#EB6460',
    lineHeight: 16,
    ...(Platform.OS !== 'android' ? { fontWeight: '600' } : {}),
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fbfbfb',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 26,
    minHeight: 90,
    fontSize: 13,
    color: '#26313c',
    fontFamily: typography.fontPromptMedium,
    borderWidth: 1.5,
    borderColor: '#cdd8e1',
  },
  textInputFocused: {
    borderColor: '#00c4b3',
    backgroundColor: '#ffffff',
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 10,
    color: '#637b91',
    fontFamily: typography.fontGothamBook,
    ...(Platform.OS !== 'android' ? { fontWeight: '400' } : {}),
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsLabel: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#566d80',
    marginBottom: 8,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  suggestionsList: {
    gap: 6,
    paddingVertical: 2,
  },
  suggestionChip: {
    backgroundColor: '#eaeff5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cdd8e1',
  },
  suggestionChipActive: {
    backgroundColor: '#FDEFEE',
    borderColor: '#EF7773',
  },
  suggestionText: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 11,
    color: colors.textSecondary,
    ...(Platform.OS !== 'android' ? { fontWeight: '400' } : {}),
  },
  suggestionTextActive: {
    fontFamily: typography.fontPromptMedium,
    color: '#EB6460',
    ...(Platform.OS !== 'android' ? { fontWeight: '500' } : {}),
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  actionBtn: {
    flex: 1,
    minWidth: 0,
  },
  deleteWrapper: {
    flexShrink: 0,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FAD6D5',
  },
  clearBtnText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#EF7773',
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  saveSkyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: '#E0F8F6',
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
  },
  saveSkyText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primaryDark,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  saveJarBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: colors.primary,
  },
  saveJarText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: '#FFFFFF',
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
