import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShiftFeedback, UserProfile } from '../types';
import { 
  MessageSquareHeart, 
  X, 
  Star, 
  CheckCircle2, 
  Sparkles,
  Headphones,
  Activity,
  Heart,
  Target,
  Lightbulb,
  RotateCcw,
  GlassWater
} from 'lucide-react-native';
import { colors } from '../design-system/tokens';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { audioService } from '../services/audioService';
import { getTranslation } from '../locales';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile;
  feedback?: ShiftFeedback | null;
  lang: 'th' | 'en';
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [accuracy, setAccuracy] = useState<'spot_on' | 'helpful' | 'needs_work'>('spot_on');
  const [selectedAspects, setSelectedAspects] = useState<string[]>(['audio', 'reframe']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const t = getTranslation(lang);
  const fb = t.feedback;

  const ASPECTS = [
    { id: 'audio', label: fb.aspectAudio, icon: Headphones },
    { id: 'reframe', label: fb.aspectReframe, icon: MessageSquareHeart },
    { id: 'haptics', label: fb.aspectHaptics, icon: Activity },
    { id: 'sip', label: fb.aspectSip, icon: GlassWater },
    { id: 'mbti', label: fb.aspectMbti, icon: Heart },
  ];

  const ACCURACY = [
    { id: 'spot_on', label: fb.accuracySpotOn, icon: Target },
    { id: 'helpful', label: fb.accuracyHelpful, icon: Lightbulb },
    { id: 'needs_work', label: fb.accuracyNeedsWork, icon: RotateCcw },
  ] as const;

  const toggleAspect = (id: string) => {
    setSelectedAspects((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    audioService.triggerHaptic('success');
    audioService.playJarDrop();
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const getRatingText = () => {
    if (rating === 5) return fb.rating5;
    if (rating === 4) return fb.rating4;
    if (rating === 3) return fb.rating3;
    return fb.rating1;
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View style={styles.headerTitleRow}>
            <MessageSquareHeart size={20} color={colors.primary} />
            <Text style={styles.headerTitle}>
              {fb.modalTitle}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleClose} 
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color="#64748B" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!submitted ? (
            <>
              {/* Star Rating Section */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {fb.ratingQuestion}
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => {
                        setRating(s);
                        audioService.triggerHaptic('selection');
                      }}
                      style={styles.starTouch}
                    >
                      <Star 
                        size={32} 
                        color={rating >= s ? '#FBBF24' : '#CBD5E1'} 
                        fill={rating >= s ? '#FBBF24' : 'transparent'} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.starDescBadge}>
                  <Sparkles size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                  <Text style={styles.starDescText}>{getRatingText()}</Text>
                </View>
              </View>

              {/* Accuracy Grid */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {fb.accuracyQuestion}
                </Text>
                <View style={styles.accuracyRow}>
                  {ACCURACY.map((opt) => {
                    const isSelected = accuracy === opt.id;
                    const IconComp = opt.icon;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => {
                          setAccuracy(opt.id);
                          audioService.triggerHaptic('selection');
                        }}
                        style={[styles.accuracyCard, isSelected && styles.accuracyCardActive]}
                      >
                        <IconComp 
                          size={18} 
                          color={isSelected ? colors.primaryDark : '#64748B'} 
                          style={{ marginBottom: 4 }} 
                        />
                        <Text style={[styles.accuracyText, isSelected && styles.accuracyTextActive]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Aspect Chips */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {fb.aspectsQuestion}
                </Text>
                <View style={styles.chipsWrap}>
                  {ASPECTS.map((aspect) => {
                    const isSelected = selectedAspects.includes(aspect.id);
                    const AspectIcon = aspect.icon;
                    return (
                      <TouchableOpacity
                        key={aspect.id}
                        onPress={() => {
                          toggleAspect(aspect.id);
                          audioService.triggerHaptic('selection');
                        }}
                        style={[styles.chip, isSelected && styles.chipActive]}
                      >
                        <AspectIcon 
                          size={14} 
                          color={isSelected ? colors.primaryDark : '#64748B'} 
                          style={{ marginRight: 6 }} 
                        />
                        <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                          {aspect.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Qualitative Comment */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {fb.commentQuestion}
                </Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={3}
                  value={comment}
                  onChangeText={setComment}
                  placeholder={fb.commentPlaceholder}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Submit Button */}
              <View style={styles.submitWrap}>
                <MarshmallowButton
                  variant="primary"
                  size="md"
                  onPress={handleSubmit}
                  icon={<CheckCircle2 size={16} color="#FFFFFF" />}
                  title={fb.submitButton}
                />
              </View>
            </>
          ) : (
            /* Success State */
            <View style={styles.successCard}>
              <View style={styles.successIconCircle}>
                <CheckCircle2 size={40} color={colors.primary} />
              </View>
              <Text style={styles.successTitle}>
                {fb.successTitle}
              </Text>
              <Text style={styles.successDesc}>
                {fb.successDesc}
              </Text>
              <View style={{ marginTop: 24, width: '100%' }}>
                <MarshmallowButton
                  variant="primary"
                  size="md"
                  onPress={handleClose}
                  title={fb.doneButton}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  starTouch: {
    padding: 4,
  },
  starDescBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starDescText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  accuracyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  accuracyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  accuracyCardActive: {
    backgroundColor: '#E6FAF8',
    borderColor: colors.primary,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  accuracyTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#E6FAF8',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13,
    color: colors.textPrimary,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitWrap: {
    marginTop: 8,
    paddingBottom: 24,
  },
  successCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6FAF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 8,
  },
  successDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
