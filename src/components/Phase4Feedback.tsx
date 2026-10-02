import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { EmotionTagId, ShiftFeedback } from '../types';
import { audioService } from '../services/audioService';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { MoocaMascot } from './MoocaMascot';
import { useSky } from './DynamicSkyEngine';
import { Activity, Check, Plus, Minus, ArrowRight, Zap, Leaf, Heart } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

export type MoodStampType = 'empowered' | 'grounded' | 'hug';

interface Phase4FeedbackProps {
  preHeartRate: number;
  selectedEmotions: EmotionTagId[];
  onFinishReset: (feedback: ShiftFeedback) => void;
  onRestart: () => void;
  lang: 'th' | 'en';
}

export const Phase4Feedback: React.FC<Phase4FeedbackProps> = ({
  preHeartRate,
  onFinishReset,
  lang,
}) => {
  const { activePeriod } = useSky();
  const isNight = activePeriod === 'night';
  const [postHeartRate, setPostHeartRate] = useState(Math.max(65, preHeartRate - 18));
  const [shiftResult, setShiftResult] = useState<MoodStampType>('empowered');

  const bpmDrop = preHeartRate - postHeartRate;

  const handleSelectStamp = (stamp: MoodStampType) => {
    audioService.triggerHaptic('medium');
    audioService.playJarDrop();
    setShiftResult(stamp);
  };

  const handleFinish = () => {
    audioService.triggerHaptic('success');
    audioService.playChimeShockwave();
    onFinishReset({
      shiftResult: shiftResult === 'hug' ? 'same' : shiftResult,
      preHeartRate,
      postHeartRate,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Mascot */}
        <View style={styles.mascotWrapper}>
          <MoocaMascot
            mood={shiftResult === 'hug' ? 'hugging' : 'celebrating'}
            size="sm"
            speakingBubble={
              shiftResult === 'hug'
                ? lang === 'th'
                  ? 'มากอดกันแน่น ๆ นะ! Mooca อยู่ตรงนี้เสมอ ไม่ต้องกลัวเลย'
                  : 'Big warm hugs! Mooca is always by your side'
                : shiftResult === 'empowered'
                  ? lang === 'th'
                    ? 'เย้! พลังใจมาเต็มแล้ว ลุยได้สบายเลย!'
                    : 'Awesome! Confidence restored and ready to conquer!'
                  : lang === 'th'
                    ? 'ลมหายใจนิ่งขึ้น จิตใจสงบแล้วนะคนเก่ง'
                    : 'Mind is steady and peaceful now'
            }
          />
        </View>
        <Text style={[styles.title, isNight && { color: '#FFFFFF' }]}>
          {lang === 'th' ? 'ตราประทับวัดผลลัพธ์ใจ' : 'Mind & Body Delta Check'}
        </Text>

      {/* Heart Rate Delta Comparison Card */}
      <View style={styles.bpmCard}>
        <View style={styles.bpmHeader}>
          <Activity size={15} color={colors.secondary} />
          <Text style={styles.bpmHeaderText}>
            {lang === 'th' ? 'การเปลี่ยนแปลงของอัตราการเต้นหัวใจ' : 'Heart Rate Delta'}
          </Text>
        </View>

        <View style={styles.bpmComparisonRow}>
          {/* Pre BPM */}
          <View style={styles.bpmCol}>
            <Text style={styles.bpmColLabel}>{lang === 'th' ? 'ก่อนเริ่ม' : 'Before'}</Text>
            <Text style={styles.bpmPreValue}>{preHeartRate}</Text>
            <Text style={styles.bpmUnit}>BPM</Text>
          </View>

          {/* Delta Arrow */}
          <View style={styles.deltaBadge}>
            <Text style={styles.deltaText} numberOfLines={1}>
              {`${bpmDrop >= 0 ? `-${bpmDrop}` : `+${Math.abs(bpmDrop)}`}\u00A0BPM`}
            </Text>
          </View>

          {/* Post BPM with Stepper */}
          <View style={styles.bpmCol}>
            <Text style={styles.bpmColLabel}>{lang === 'th' ? 'ตอนนี้' : 'Now'}</Text>
            <Text style={styles.bpmPostValue}>{postHeartRate}</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                onPress={() => {
                  audioService.triggerHaptic('selection');
                  setPostHeartRate((prev) => Math.max(50, prev - 1));
                }}
                activeOpacity={0.7}
                style={styles.stepperBtn}
              >
                <Minus size={11} color={colors.primaryDark} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  audioService.triggerHaptic('selection');
                  setPostHeartRate((prev) => Math.min(160, prev + 1));
                }}
                activeOpacity={0.7}
                style={styles.stepperBtn}
              >
                <Plus size={11} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Soft-Touch Mood Stamp Buttons Section */}
      <View style={styles.stampSection}>
        <View style={styles.stampsList}>
          {/* Stamp 1: ⚡ พร้อมลุย/มั่นใจขึ้น */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleSelectStamp('empowered')}
            style={[
              styles.stampBtn,
              shiftResult === 'empowered' && styles.stampBtnActiveAmber,
            ]}
          >
            <View style={styles.stampLeftRow}>
              <View
                style={[
                  styles.stampSealIcon,
                  { backgroundColor: '#FEF3C7', borderColor: '#F59E0B' },
                ]}
              >
                <Zap size={18} color="#D97706" fill="#D97706" />
              </View>
              <View style={styles.stampTextCol}>
                <Text style={styles.stampMainLabel}>
                  {lang === 'th' ? 'พร้อมลุย / มั่นใจขึ้น' : 'Ready & Confident'}
                </Text>
                <Text style={styles.stampSubLabel}>
                  {lang === 'th' ? 'สมองปลอดโปร่ง มีพลังลุยงาน' : 'Clarity restored, ready to win'}
                </Text>
              </View>
            </View>
            {shiftResult === 'empowered' ? (
              <View style={[styles.stampPill, { backgroundColor: '#F59E0B' }]}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.stampPillText}>STAMPED</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          {/* Stamp 2: 🌿 นิ่งขึ้น มีสติ */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleSelectStamp('grounded')}
            style={[
              styles.stampBtn,
              shiftResult === 'grounded' && styles.stampBtnActiveTeal,
            ]}
          >
            <View style={styles.stampLeftRow}>
              <View
                style={[
                  styles.stampSealIcon,
                  { backgroundColor: '#CCFBF1', borderColor: '#00C4B3' },
                ]}
              >
                <Leaf size={18} color="#00C4B3" fill="#00C4B3" />
              </View>
              <View style={styles.stampTextCol}>
                <Text style={styles.stampMainLabel}>
                  {lang === 'th' ? 'นิ่งขึ้น มีสติ' : 'Calm & Grounded'}
                </Text>
                <Text style={styles.stampSubLabel}>
                  {lang === 'th' ? 'หายใจทั่วท้อง ชีพจรชะลอลง' : 'Steady breath, centered focus'}
                </Text>
              </View>
            </View>
            {shiftResult === 'grounded' ? (
              <View style={[styles.stampPill, { backgroundColor: colors.primary }]}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.stampPillText}>STAMPED</Text>
              </View>
            ) : null}
          </TouchableOpacity>

          {/* Stamp 3: 🧸 ขอกอดเพิ่มหน่อย */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleSelectStamp('hug')}
            style={[
              styles.stampBtn,
              shiftResult === 'hug' && styles.stampBtnActivePink,
            ]}
          >
            <View style={styles.stampLeftRow}>
              <View
                style={[
                  styles.stampSealIcon,
                  { backgroundColor: '#FFE4E6', borderColor: '#F43F5E' },
                ]}
              >
                <Heart size={18} color="#F43F5E" fill="#F43F5E" />
              </View>
              <View style={styles.stampTextCol}>
                <Text style={styles.stampMainLabel}>
                  {lang === 'th' ? 'ขอกอดเพิ่มหน่อย' : 'Need Extra Warm Hug'}
                </Text>
                <Text style={styles.stampSubLabel}>
                  {lang === 'th' ? 'ไม่เป็นไรเลย Mooca อยู่กอดตรงนี้เสมอ' : 'Mooca is here to cuddle you'}
                </Text>
              </View>
            </View>
            {shiftResult === 'hug' ? (
              <View style={[styles.stampPill, { backgroundColor: '#F43F5E' }]}>
                <Check size={12} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.stampPillText}>STAMPED</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      </ScrollView>

      {/* Pinned Bottom CTA Button */}
      <View style={styles.bottomBar}>
        <MarshmallowButton
          variant="primary"
          size="lg"
          onPress={handleFinish}
          icon={<ArrowRight size={18} color="#FFFFFF" />}
          title={
            lang === 'th'
              ? 'รับการ์ดโพลารอยด์แห่งความกล้าหาญ'
              : 'Claim Polaroid Keepsake'
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    width: '100%',
  },
  mascotWrapper: {
    height: 155,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    marginBottom: 6,
  },
  title: {
    fontFamily: typography.fontPromptBold,
    fontSize: 14,
    color: colors.primaryDark,
    marginBottom: 8,
  },
  bpmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    marginBottom: 10,
    ...shadows.soft,
  },
  bpmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  bpmHeaderText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  bpmComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bpmCol: {
    alignItems: 'center',
  },
  bpmColLabel: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  bpmPreValue: {
    fontFamily: typography.fontPromptBold,
    fontSize: 22,
    color: colors.textMuted,
  },
  bpmPostValue: {
    fontFamily: typography.fontPromptBold,
    fontSize: 24,
    color: colors.primary,
  },
  bpmUnit: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 9,
    color: colors.textMuted,
  },
  deltaBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  deltaText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primary,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  stepperBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampSection: {
    width: '100%',
    marginBottom: 10,
  },
  stampsList: {
    gap: 8,
  },
  stampBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3.5,
    borderBottomColor: '#CBD5E1',
    ...shadows.card,
  },
  stampBtnActiveAmber: {
    borderColor: '#F59E0B',
    borderBottomColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  stampBtnActiveTeal: {
    borderColor: colors.primary,
    borderBottomColor: colors.primaryDark,
    backgroundColor: '#F0FDFA',
  },
  stampBtnActivePink: {
    borderColor: '#F43F5E',
    borderBottomColor: '#E11D48',
    backgroundColor: '#FFF1F2',
  },
  stampLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  stampSealIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampTextCol: {
    flex: 1,
  },
  stampMainLabel: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  stampSubLabel: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 14,
  },
  stampPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 3,
  },
  stampPillText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 8,
    color: '#FFFFFF',
  },
});
