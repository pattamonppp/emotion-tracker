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

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: UserProfile;
  feedback?: ShiftFeedback | null;
  lang: 'th' | 'en';
}

const ASPECTS = [
  { id: 'audio', labelTh: 'คลื่นเสียงบำบัดตรงจุด', labelEn: 'Binaural Audio', icon: Headphones },
  { id: 'reframe', labelTh: 'คำพูดรีเฟรมความคิดโดนใจ', labelEn: 'Cognitive Reframing', icon: MessageSquareHeart },
  { id: 'haptics', labelTh: 'แรงสั่นและสลัดมือ', labelEn: 'Haptics & Movement', icon: Activity },
  { id: 'sip', labelTh: 'จังหวะจิบน้ำผ่อนคลาย', labelEn: 'Sip Breathing Rhythm', icon: GlassWater },
  { id: 'mbti', labelTh: 'เข้าใจลักษณะนิสัย', labelEn: 'Personality Resonance', icon: Heart },
];

const ACCURACY = [
  { id: 'spot_on', labelTh: 'ตรงใจมาก', labelEn: 'Spot On', icon: Target },
  { id: 'helpful', labelTh: 'ช่วยได้ดี', labelEn: 'Helpful', icon: Lightbulb },
  { id: 'needs_work', labelTh: 'ยังไม่ตรงจุด', labelEn: 'Needs Work', icon: RotateCcw },
] as const;

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
    if (rating === 5) return lang === 'th' ? 'โล่ง สบายใจขึ้นมาก' : 'Deeply relaxed and relieved';
    if (rating === 4) return lang === 'th' ? 'ผ่อนคลายขึ้นดีมาก' : 'Noticeably calmer and better';
    if (rating === 3) return lang === 'th' ? 'รู้สึกดีขึ้นปานกลาง' : 'Moderately refreshed';
    return lang === 'th' ? 'ยังตึงเครียดอยู่' : 'Still holding tension';
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
              {lang === 'th' ? 'บอกความรู้สึกถึง Mooca' : 'Feedback to Mooca'}
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
                  {lang === 'th' 
                    ? 'เซสชันนี้ช่วยให้เธอรู้สึกผ่อนคลายแค่ไหน?' 
                    : 'How much did this session help relieve tension?'}
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
                  {lang === 'th' 
                    ? 'คำปลอบและกิจกรรมตรงกับความต้องการไหม?' 
                    : 'Did the comforting advice and exercises fit your state?'}
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
                          {lang === 'th' ? opt.labelTh : opt.labelEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Aspect Chips */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {lang === 'th' 
                    ? 'จุดที่ทำได้ดีเป็นพิเศษ (เลือกได้หลายข้อ):' 
                    : 'Key highlights that felt especially good:'}
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
                          {lang === 'th' ? aspect.labelTh : aspect.labelEn}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Qualitative Comment */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  {lang === 'th' 
                    ? 'อยากบอกอะไรกับ Mooca เพื่อให้ดูแลใจเธอได้ดียิ่งขึ้น? (ถ้ามี)' 
                    : 'Anything you want to tell Mooca to support you better? (Optional)'}
                </Text>
                <TextInput
                  style={styles.textInput}
                  multiline
                  numberOfLines={3}
                  value={comment}
                  onChangeText={setComment}
                  placeholder={
                    lang === 'th' 
                      ? 'เช่น ชอบดนตรีมาก, อยากให้จังหวะหายใจช้าลง...' 
                      : 'e.g. Loved the soundscape, breath pace was great...'
                  }
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
                  title={lang === 'th' ? 'ส่งความรู้สึก' : 'Submit Feedback'}
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
                {lang === 'th' ? 'บันทึกความคิดเห็นสำเร็จ!' : 'Feedback Saved!'}
              </Text>
              <Text style={styles.successDesc}>
                {lang === 'th'
                  ? 'ขอบคุณมากนะ! ความคิดเห็นของเธอช่วยให้ Mooca เข้าใจและปลอบประโลมใจทุกคนได้ดียิ่งขึ้น'
                  : 'Thank you so much! Your thoughts help make Mooca gentler, warmer, and more supportive for everyone.'}
              </Text>
              <View style={{ marginTop: 24, width: '100%' }}>
                <MarshmallowButton
                  variant="primary"
                  size="md"
                  onPress={handleClose}
                  title={lang === 'th' ? 'เสร็จสิ้น' : 'Done'}
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
    backgroundColor: '#FFFDF9',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
    gap: 18,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  starTouch: {
    padding: 4,
  },
  starDescBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  starDescText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  accuracyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  accuracyCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accuracyCardActive: {
    backgroundColor: '#E6F9F7',
    borderColor: colors.primary,
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
  },
  accuracyTextActive: {
    color: colors.primaryDark,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#DBF0EE',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitWrap: {
    marginTop: 6,
    marginBottom: 20,
  },
  successCard: {
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#E6F9F7',
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 196, 179, 0.4)',
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBF0EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default FeedbackModal;
