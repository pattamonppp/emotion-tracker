import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { GoalType } from '../types';
import { REFRAMING_INSIGHTS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { MoocaMascot } from './MoocaMascot';
import { Heart, Dna, ArrowRight, Sparkles, HeartHandshake, Sprout } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

interface Phase3CognitiveReframingProps {
  goal: GoalType;
  onProceed: () => void;
  lang: 'th' | 'en';
}

export const Phase3CognitiveReframing: React.FC<Phase3CognitiveReframingProps> = ({
  goal,
  onProceed,
  lang,
}) => {
  const [isActionCommitted, setIsActionCommitted] = useState(false);
  const insight = REFRAMING_INSIGHTS[goal];

  const stampAnim = useRef(new Animated.Value(0)).current;

  const handleCommitAction = () => {
    setIsActionCommitted(true);
    audioService.triggerHaptic('success');
    audioService.playJarDrop();

    stampAnim.setValue(0);
    Animated.spring(stampAnim, {
      toValue: 1,
      friction: 4,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const stampScale = stampAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2.2, 1],
  });

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header & Mascot */}
        <View style={styles.header}>
          <MoocaMascot
            mood={isActionCommitted ? 'celebrating' : 'comforting'}
            size="sm"
            speakingBubble={
              isActionCommitted
                ? lang === 'th'
                  ? 'ประทับตราสัญญาใจแล้ว! Mooca อยู่เคียงข้างเสมอ สู้ไปด้วยกันนะ!'
                  : 'Pinky promise sealed! Mooca is right beside you!'
                : lang === 'th'
                  ? 'เปิดอ่านจดหมายจากใจ Mooca แล้วทำสัญญาใจ 1 ก้าวด้วยกันนะ'
                  : 'Read Mooca’s heartfelt letter and make a pinky promise!'
            }
          />

          <View style={styles.phaseBadge}>
            <Sparkles size={12} color={colors.primary} />
            <Text style={styles.phaseBadgeText}>
              {lang === 'th' ? 'จดหมายอบอุ่นจากใจ Mooca' : 'Heartfelt Letter from Mooca'}
            </Text>
          </View>
        </View>

        {/* Washi-Tape Letter Card */}
        <View style={styles.letterWrapper}>
          {/* Pastel Washi Tape - Top Left */}
          <View style={styles.washiTapeLeft}>
            <View style={styles.washiTapePattern} />
          </View>

          {/* Pastel Washi Tape - Top Right */}
          <View style={styles.washiTapeRight}>
            <View style={styles.washiTapePattern} />
          </View>

          {/* Cozy Cream Letter Paper */}
          <View style={styles.letterPaper}>
            {/* Cute Decorative Stamp in Corner */}
            <View style={styles.letterStamp}>
              <Heart size={11} color="#EC4899" fill="#FCE7F3" />
              <Text style={styles.letterStampText}>MOOCA</Text>
            </View>

            <View style={styles.letterHeader}>
              <Heart size={14} color="#F43F5E" />
              <Text style={styles.letterGreeting}>
                {lang === 'th' ? 'ถึงเธอ... คนเก่งที่กำลังพยายามอยู่' : 'Dearest Brave Friend,'}
              </Text>
            </View>

            {/* Emotional Reframing Message */}
            <Text style={styles.letterBody}>
              {lang === 'th' ? insight.reflectionTh : insight.reflectionEn}
            </Text>

            {/* Biological Reassurance Note */}
            <View style={styles.biologyNote}>
              <Dna size={15} color={colors.primaryDark} style={{ marginTop: 2 }} />
              <Text style={styles.biologyText}>
                {lang === 'th' ? insight.biologyFactTh : insight.biologyFactEn}
              </Text>
            </View>
          </View>
        </View>

        {/* Pinky-Promise Action Box */}
        <View style={styles.promiseCard}>
          <View style={styles.promiseHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <HeartHandshake size={16} color={colors.primary} strokeWidth={2.4} />
              <Text style={styles.promiseTitle}>
                {lang === 'th' ? 'กล่องสัญญาใจ 1 ก้าวถัดไป' : 'Pinky-Promise Action'}
              </Text>
            </View>
            <View style={styles.promiseBadge}>
              <Text style={styles.promiseBadgeText}>
                {lang === 'th' ? 'ก้าวเล็ก ๆ ชนะใจ' : 'Micro Step'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCommitAction}
            style={[
              styles.commitBox,
              isActionCommitted && styles.commitBoxActive,
            ]}
          >
            <View style={styles.commitContent}>
              <View style={{ marginRight: 8 }}>
                <Sprout size={20} color={colors.primary} strokeWidth={2.4} />
              </View>
              <Text style={[styles.commitActionText, isActionCommitted && { color: colors.primaryDark }]}>
                {lang === 'th' ? insight.microActionTh : insight.microActionEn}
              </Text>
            </View>

            {/* Mint Wax Seal Heart Stamp */}
            {isActionCommitted ? (
              <Animated.View
                style={[
                  styles.mintSealStamp,
                  { transform: [{ scale: stampScale }, { rotate: '-8deg' }] },
                ]}
              >
                <View style={styles.mintSealInner}>
                  <Heart size={14} color="#00C4B3" fill="#00C4B3" />
                  <Text style={styles.mintSealText}>PROMISED</Text>
                </View>
              </Animated.View>
            ) : (
              <View style={styles.stampPlaceholder}>
                <Text style={styles.stampPrompt}>
                  {lang === 'th' ? 'แตะเพื่อ\nประทับตรา' : 'Tap to\nSeal'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.commitHint}>
            {isActionCommitted
              ? lang === 'th'
                ? 'สัญญาใจถูกประทับเรียบร้อยแล้ว มีพลังก้าวต่อไปได้เลย!'
                : 'Sealed with a mint heart! You have got this!'
              : lang === 'th'
                ? 'แตะที่กล่องเพื่อประทับตราสัญญาใจสีมิ้นต์กับ Mooca'
                : 'Tap box to stamp your pinky-promise mint heart.'}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Pinned Proceed Button */}
      <View style={styles.bottomBar}>
        <MarshmallowButton
          variant="primary"
          size="lg"
          onPress={onProceed}
          icon={<ArrowRight size={18} color="#FFFFFF" />}
          title={
            lang === 'th'
              ? 'วัดผลลัพธ์การฟื้นตัวของใจ (Phase 4)'
              : 'Measure Emotional Shift (Phase 4)'
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
    paddingTop: 14,
    paddingBottom: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 6,
    marginTop: 6,
    ...shadows.card,
  },
  phaseBadgeText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  letterWrapper: {
    width: '100%',
    position: 'relative',
    marginVertical: 6,
    paddingTop: 10,
  },
  washiTapeLeft: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 68,
    height: 20,
    backgroundColor: 'rgba(167, 243, 208, 0.88)',
    borderRadius: 2,
    transform: [{ rotate: '-4deg' }],
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderStyle: 'dashed',
    ...shadows.card,
  },
  washiTapeRight: {
    position: 'absolute',
    top: 2,
    right: 20,
    width: 68,
    height: 20,
    backgroundColor: 'rgba(254, 205, 211, 0.88)',
    borderRadius: 2,
    transform: [{ rotate: '4deg' }],
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(251, 113, 133, 0.4)',
    borderStyle: 'dashed',
    ...shadows.card,
  },
  washiTapePattern: {
    flex: 1,
  },
  letterPaper: {
    backgroundColor: '#FFFDF8',
    borderRadius: 18,
    padding: 16,
    paddingTop: 18,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    position: 'relative',
    ...shadows.soft,
  },
  letterStamp: {
    position: 'absolute',
    top: 12,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECDD3',
    borderStyle: 'dashed',
  },
  letterStampText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 8,
    color: '#E11D48',
    letterSpacing: 0.5,
  },
  letterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  letterGreeting: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: '#9A3412',
  },
  letterBody: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  biologyNote: {
    flexDirection: 'row',
    backgroundColor: '#F0FDFA',
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 8,
  },
  biologyText: {
    flex: 1,
    fontFamily: typography.fontPromptRegular,
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 17,
  },
  promiseCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    marginTop: 8,
    ...shadows.soft,
  },
  promiseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  promiseTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  promiseBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  promiseBadgeText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 9,
    color: '#B45309',
  },
  commitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  commitBoxActive: {
    backgroundColor: '#F0FDFA',
    borderColor: colors.primary,
  },
  commitContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionEmoji: {
    fontSize: 20,
  },
  commitActionText: {
    flex: 1,
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  stampPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampPrompt: {
    fontFamily: typography.fontPromptBold,
    fontSize: 8,
    color: colors.textMuted,
    textAlign: 'center',
  },
  mintSealStamp: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
    ...shadows.card,
  },
  mintSealInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mintSealText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 6,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  commitHint: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    width: '100%',
  },
});
