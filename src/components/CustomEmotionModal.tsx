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
import { audioService } from '../services/audioService';
import { MoocaMascot } from './MoocaMascot';
import { colors, shadows, typography, radii } from '../design-system/tokens';
import { getTranslation } from '../locales';
import { MODAL_CONFIG } from '../constants';

export interface CustomEmotionModalProps {
  isOpen: boolean;
  editingId?: string | null;
  initialText: string;
  onSave: (text: string, putInJarImmediately: boolean, editingId?: string | null) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  lang: 'th' | 'en';
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
    audioService.triggerHaptic('light');
    setInputText(suggestion);
  };

  const handleSaveToJar = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    audioService.triggerHaptic('success');
    audioService.playJarDrop();
    onSave(trimmed, !isJarFull, editingId);
    onClose();
  };

  const handleSaveToSky = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    audioService.triggerHaptic('light');
    onSave(trimmed, false, editingId);
    onClose();
  };

  const handleDelete = () => {
    audioService.triggerHaptic('medium');
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
                  {editingId ? ce.editTitle : ce.newTitle}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {ce.tellMoocaSub}
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
              <MoocaMascot size="xs" mood="comforting" />
            </View>
            <View style={styles.mascotBubble}>
              <Text style={styles.mascotBubbleText}>
                {ce.mascotBubble}
              </Text>
            </View>
          </View>

          {/* Text Input Container */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={ce.inputPlaceholder}
              placeholderTextColor="#94A3B8"
              maxLength={MODAL_CONFIG.customEmotion.maxLength}
              autoFocus
              returnKeyType="done"
            />
            <Text style={styles.charCount}>
              {inputText.length}/{MODAL_CONFIG.customEmotion.maxLength}
            </Text>
          </View>

          {/* Quick Suggestions Chips */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>
              {ce.quickTapLabel}
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
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            {editingId ? (
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.clearBtn}
                activeOpacity={0.75}
              >
                <RotateCcw size={12} color="#EF4444" strokeWidth={2.4} />
                <Text style={styles.clearBtnText}>
                  {ce.deleteBtn}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={handleSaveToSky}
              disabled={!inputText.trim()}
              style={[
                styles.saveSkyBtn,
                !inputText.trim() && styles.btnDisabled,
              ]}
              activeOpacity={0.8}
            >
              <Sparkles size={13} color={colors.primaryDark} strokeWidth={2.4} />
              <Text style={styles.saveSkyText}>
                {ce.keepOnSky}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveToJar}
              disabled={!inputText.trim()}
              style={[
                styles.saveJarBtn,
                !inputText.trim() && styles.btnDisabled,
              ]}
              activeOpacity={0.85}
            >
              <ArrowDown size={14} color="#FFFFFF" strokeWidth={2.6} />
              <Text style={styles.saveJarText}>
                {isJarFull ? ce.saveCloud : ce.dropIntoJar}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 26, 43, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(236, 72, 153, 0.25)',
    ...shadows.card,
    zIndex: 10,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 14,
    color: colors.primaryDark,
    ...(Platform.OS !== 'android' ? { fontWeight: '800' } : {}),
  },
  headerSubtitle: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: colors.textMuted,
    ...(Platform.OS !== 'android' ? { fontWeight: '500' } : {}),
  },
  closeBtn: {
    padding: 4,
  },
  mascotSpeechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF0F5',
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FCE7F3',
  },
  mascotBubble: {
    flex: 1,
  },
  mascotBubbleText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: '#9D174D',
    lineHeight: 16,
    ...(Platform.OS !== 'android' ? { fontWeight: '600' } : {}),
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 26,
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: typography.fontPromptMedium,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  charCount: {
    position: 'absolute',
    bottom: 8,
    right: 12,
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontPromptSemiBold,
    ...(Platform.OS !== 'android' ? { fontWeight: '600' } : {}),
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsLabel: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  suggestionsList: {
    gap: 6,
    paddingVertical: 2,
  },
  suggestionChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestionChipActive: {
    backgroundColor: '#FCE7F3',
    borderColor: '#F472B6',
  },
  suggestionText: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: colors.textSecondary,
    ...(Platform.OS !== 'android' ? { fontWeight: '600' } : {}),
  },
  suggestionTextActive: {
    fontFamily: typography.fontPromptBold,
    color: '#BE185D',
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
  },
  clearBtnText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#EF4444',
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
    backgroundColor: '#F0FDFA',
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
