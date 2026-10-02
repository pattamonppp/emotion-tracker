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
import { Heart, Sparkles, X, ArrowDown, PenLine, RotateCcw } from 'lucide-react-native';
import { audioService } from '../services/audioService';
import { MoocaMascot } from './MoocaMascot';
import { colors, radii, shadows, typography } from '../design-system/tokens';

interface CustomEmotionModalProps {
  isOpen: boolean;
  initialText: string;
  onSave: (text: string, putInJarImmediately: boolean) => void;
  onClear?: () => void;
  onClose: () => void;
  lang: 'th' | 'en';
  isJarFull: boolean;
}

const QUICK_SUGGESTIONS_TH = [
  'เหนื่อยกับการอ่านหนังสือ',
  'อยากพักสักแป๊บ',
  'ใจเต้นแรงมาก',
  'กลัวทำได้ไม่ดี',
  'ต้องการกำลังใจจัง',
  'กดดันจากความคาดหวัง',
  'รู้สึกเหงาแปลก ๆ',
];

const QUICK_SUGGESTIONS_EN = [
  'Exhausted from studying',
  'Need a gentle break',
  'Heart racing so fast',
  'Afraid of falling short',
  'Could use some warmth',
  'Feeling high pressure',
  'Feeling quietly lonely',
];

export const CustomEmotionModal: React.FC<CustomEmotionModalProps> = ({
  isOpen,
  initialText,
  onSave,
  onClear,
  onClose,
  lang,
  isJarFull,
}) => {
  const [inputText, setInputText] = useState(initialText);

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
    onSave(trimmed, !isJarFull);
    onClose();
  };

  const handleSaveToSky = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    audioService.triggerHaptic('light');
    onSave(trimmed, false);
    onClose();
  };

  const handleClear = () => {
    audioService.triggerHaptic('medium');
    setInputText('');
    if (onClear) onClear();
    onClose();
  };

  const suggestions = lang === 'th' ? QUICK_SUGGESTIONS_TH : QUICK_SUGGESTIONS_EN;

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
                <PenLine size={16} color="#EC4899" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {lang === 'th' ? 'ข้อความในใจถึง Mooca' : 'Heart Message to Mooca'}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {lang === 'th'
                    ? 'รู้สึกอะไรอยู่ เขียนฝาก Mooca ดูแลได้นะ'
                    : 'Tell Mooca what is weighing on you'}
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
            <MoocaMascot size="xs" mood="comforting" />
            <View style={styles.mascotBubble}>
              <Text style={styles.mascotBubbleText}>
                {lang === 'th'
                  ? 'เล่าให้ฉันฟังได้ทุกเรื่องเลยนะ ฉันจะคอยโอบกอดไว้ให้เอง!'
                  : 'Tell me anything at all. I will hold it gently for you!'}
              </Text>
            </View>
          </View>

          {/* Text Input Container */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                lang === 'th'
                  ? 'พิมพ์ความรู้สึกในใจตอนนี้...'
                  : 'Type how you are feeling right now...'
              }
              placeholderTextColor="#94A3B8"
              maxLength={35}
              autoFocus
              returnKeyType="done"
            />
            <Text style={styles.charCount}>
              {inputText.length}/35
            </Text>
          </View>

          {/* Quick Suggestions Chips */}
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsLabel}>
              {lang === 'th' ? 'หรือเลือกคำที่ตรงใจ:' : 'Or tap a quick feeling:'}
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
            {initialText ? (
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearBtn}
                activeOpacity={0.75}
              >
                <RotateCcw size={12} color="#EF4444" strokeWidth={2.4} />
                <Text style={styles.clearBtnText}>
                  {lang === 'th' ? 'ล้าง' : 'Clear'}
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
                {lang === 'th' ? 'ไว้บนฟ้า' : 'Keep on Sky'}
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
                {isJarFull
                  ? lang === 'th' ? 'บันทึกเมฆ' : 'Save Cloud'
                  : lang === 'th' ? 'ฝากลงโหลเลย' : 'Drop into Jar'}
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
    backgroundColor: 'rgba(236, 72, 153, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 14,
    color: colors.primaryDark,
  },
  headerSubtitle: {
    fontSize: 10.5,
    color: colors.textMuted,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  mascotSpeechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    backgroundColor: '#FDF2F8',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
  },
  mascotBubble: {
    flex: 1,
  },
  mascotBubbleText: {
    fontSize: 10.5,
    fontFamily: typography.fontPromptMedium,
    color: '#9D174D',
    lineHeight: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(236, 72, 153, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 12.5,
    fontFamily: typography.fontPromptMedium,
    color: colors.textPrimary,
    padding: 0,
  },
  charCount: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 6,
  },
  suggestionsContainer: {
    marginBottom: 14,
  },
  suggestionsLabel: {
    fontSize: 10,
    fontFamily: typography.fontPromptMedium,
    color: colors.textMuted,
    marginBottom: 6,
  },
  suggestionsList: {
    gap: 6,
    paddingBottom: 2,
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: radii.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  suggestionChipActive: {
    backgroundColor: '#FCE7F3',
    borderColor: '#EC4899',
  },
  suggestionText: {
    fontSize: 10.5,
    fontFamily: typography.fontPromptMedium,
    color: colors.textSecondary,
  },
  suggestionTextActive: {
    color: '#BE185D',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  clearBtnText: {
    fontSize: 11,
    fontFamily: typography.fontPromptSemiBold,
    color: '#DC2626',
  },
  saveSkyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: '#F0FDFA',
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.3)',
  },
  saveSkyText: {
    fontSize: 11.5,
    fontFamily: typography.fontPromptSemiBold,
    color: colors.primaryDark,
  },
  saveJarBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: '#EC4899',
    ...shadows.soft,
  },
  saveJarText: {
    fontSize: 11.5,
    fontFamily: typography.fontPromptSemiBold,
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.45,
  },
});
