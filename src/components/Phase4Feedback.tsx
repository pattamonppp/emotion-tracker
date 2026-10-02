import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { EmotionTagId, ShiftFeedback, MoodStampType } from '../types';
import { audioService } from '../services/audioService';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { MoocaMascot } from './MoocaMascot';
import { useSky } from './DynamicSkyEngine';
import { Activity, Check, Plus, Minus, ArrowRight, Zap, Leaf, Heart } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';
import { getTranslation } from '../locales';
import { PHASE4_CONFIG } from '../constants';

export interface Phase4FeedbackProps {
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
  const t = getTranslation(lang);
  const p4 = t.phases.phase4;

  const [postHeartRate, setPostHeartRate] = useState(
    Math.max(PHASE4_CONFIG.minPostHeartRateFloor, preHeartRate - PHASE4_CONFIG.defaultBpmDrop)
  );
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

  const getSpeakingBubble = () => {
    switch (shiftResult) {
      case 'hug':
        return p4.bubbleHug;
      case 'empowered':
        return p4.bubbleEmpoweredReady;
      case 'grounded':
      default:
        return p4.bubbleGroundedSteady;
    }
  };

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Mascot (Height: 145) */}
        <View style={styles.mascotWrapper}>
          <MoocaMascot
            mood={shiftResult === 'hug' ? 'hugging' : 'celebrating'}
            size="sm"
            speakingBubble={getSpeakingBubble()}
          />
        </View>

        <Text style={[styles.title, isNight && { color: '#FFFFFF' }]}>
          {p4.deltaCheckTitle}
        </Text>

        {/* Heart Rate Delta Comparison Card */}
        <View style={styles.bpmCard}>
          <View style={styles.bpmHeader}>
            <Activity size={15} color={colors.secondary} />
            <Text style={styles.bpmHeaderText}>
              {p4.bpmHeader}
            </Text>
          </View>

          <View style={styles.bpmComparisonRow}>
            {/* Pre BPM */}
            <View style={styles.bpmCol}>
              <Text style={styles.bpmColLabel}>{p4.bpmBefore}</Text>
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
              <Text style={styles.bpmColLabel}>{p4.bpmNow}</Text>
              <Text style={styles.bpmPostValue}>{postHeartRate}</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => {
                    audioService.triggerHaptic('selection');
                    setPostHeartRate((prev) => Math.max(PHASE4_CONFIG.minHeartRate, prev - 1));
                  }}
                  activeOpacity={0.7}
                  style={styles.stepperBtn}
                >
                  <Minus size={11} color={colors.primaryDark} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    audioService.triggerHaptic('selection');
                    setPostHeartRate((prev) => Math.min(PHASE4_CONFIG.maxHeartRate, prev + 1));
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
            {/* Stamp 1: Ready & Confident */}
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
                    {p4.empoweredTitle}
                  </Text>
                  <Text style={styles.stampSubLabel}>
                    {p4.empoweredSubAlt}
                  </Text>
                </View>
              </View>
              {shiftResult === 'empowered' ? (
                <View style={[styles.stampPill, { backgroundColor: '#F59E0B' }]}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.stampPillText}>{p4.stampedBadge}</Text>
                </View>
              ) : null}
            </TouchableOpacity>

            {/* Stamp 2: Calm & Grounded */}
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
                    {p4.groundedTitleShort}
                  </Text>
                  <Text style={styles.stampSubLabel}>
                    {p4.groundedSubAlt}
                  </Text>
                </View>
              </View>
              {shiftResult === 'grounded' ? (
                <View style={[styles.stampPill, { backgroundColor: colors.primary }]}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.stampPillText}>{p4.stampedBadge}</Text>
                </View>
              ) : null}
            </TouchableOpacity>

            {/* Stamp 3: Need Extra Warm Hug */}
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
                    {p4.hugTitle}
                  </Text>
                  <Text style={styles.stampSubLabel}>
                    {p4.hugSub}
                  </Text>
                </View>
              </View>
              {shiftResult === 'hug' ? (
                <View style={[styles.stampPill, { backgroundColor: '#F43F5E' }]}>
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.stampPillText}>{p4.stampedBadge}</Text>
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
          title={p4.claimPolaroid}
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
    paddingTop: 12,
    paddingBottom: 20,
    alignItems: 'center',
  },
  mascotWrapper: {
    height: PHASE4_CONFIG.mascotHeight,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    paddingBottom: 4,
    marginBottom: 6,
  },
  title: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 18,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 12,
  },
  bpmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    marginBottom: 14,
    ...shadows.soft,
  },
  bpmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  bpmHeaderText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  bpmComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bpmCol: {
    alignItems: 'center',
    flex: 1,
  },
  bpmColLabel: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  bpmPreValue: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  bpmPostValue: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 22,
    color: colors.primaryDark,
  },
  bpmUnit: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10,
    color: colors.textMuted,
  },
  deltaBadge: {
    backgroundColor: '#E6FAF8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  deltaText: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 14,
    color: colors.primaryDark,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  stepperBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: colors.borderTeal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampSection: {
    width: '100%',
    marginBottom: 14,
  },
  stampsList: {
    gap: 10,
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
    ...shadows.card,
  },
  stampBtnActiveAmber: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  stampBtnActiveTeal: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDFA',
  },
  stampBtnActivePink: {
    borderColor: '#F43F5E',
    backgroundColor: '#FFF1F2',
  },
  stampLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  stampSealIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampTextCol: {
    flex: 1,
  },
  stampMainLabel: {
    fontFamily: typography.fontPromptBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  stampSubLabel: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  stampPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  stampPillText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 9,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
    width: '100%',
  },
});
