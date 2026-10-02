import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile, ShiftFeedback } from '../types';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { MoocaMascot } from './MoocaMascot';
import { useSky } from './DynamicSkyEngine';
import { audioService } from '../services/audioService';
import {
  RotateCcw,
  History,
  Share2,
  Award,
  Sparkles,
  PartyPopper,
  Star,
  Heart,
  Leaf,
} from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

interface ResetCompletedViewProps {
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  onRestart: () => void;
  onOpenDesignSystem: () => void;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onOpenStory: () => void;
}

export const ResetCompletedView: React.FC<ResetCompletedViewProps> = ({
  profile,
  feedback,
  onRestart,
  onOpenHistory,
}) => {
  const { activePeriod } = useSky();
  const isNight = activePeriod === 'night';
  const lang = profile.language;
  const bpmDrop = feedback ? feedback.preHeartRate - feedback.postHeartRate : 18;

  const handleShareKeepsake = async () => {
    audioService.triggerHaptic('medium');
    try {
      await Share.share({
        message:
          lang === 'th'
            ? `Mooca Best Friend Badge: ${profile.name} รีเซ็ตใจและเอาชนะความกังวลสำเร็จแล้ว! อัตราการเต้นหัวใจลดลง ${bpmDrop} BPM`
            : `Mooca Best Friend Keepsake: ${profile.name} mastered the 120s reset! BPM calmed by -${bpmDrop} BPM`,
      });
    } catch {
      // Ignore
    }
  };

  const currentDate = new Date().toLocaleDateString(
    lang === 'th' ? 'th-TH' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Completion Header */}
      <View style={styles.topBadge}>
        <Award size={15} color="#D97706" />
        <Text style={styles.topBadgeText}>
          {lang === 'th' ? 'กอดใจและรีเซ็ตสำเร็จ' : 'Somatic Reset Complete'}
        </Text>
      </View>

      <Text style={[styles.headline, isNight && { color: '#FFFFFF' }]}>
        {lang === 'th'
          ? `ยินดีด้วยนะ ${profile.name}!`
          : `Congratulations, ${profile.name}!`}
      </Text>

      {/* Polaroid Keepsake Card */}
      <View style={styles.polaroidFrame}>
        {/* Photo Viewport with Rainbow Celebration */}
        <LinearGradient
          colors={['#FDE68A', '#FBCFE8', '#BAE6FD', '#A7F3D0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.photoViewport}
        >
          {/* Confetti & Rainbow Sparkles (NO EMOJI - ALWAYS ICONS) */}
          <View style={[styles.sparkleItem, { top: 8, left: 12 }]}>
            <Sparkles size={16} color="#F59E0B" fill="#FDE047" />
          </View>
          <View style={[styles.sparkleItem, { top: 12, right: 14 }]}>
            <PartyPopper size={16} color="#EC4899" />
          </View>
          <View style={[styles.sparkleItem, { bottom: 12, left: 16 }]}>
            <Star size={15} color="#F59E0B" fill="#FDE047" />
          </View>
          <View style={[styles.sparkleItem, { bottom: 10, right: 16 }]}>
            <Heart size={16} color="#F43F5E" fill="#F43F5E" />
          </View>

          {/* Rainbow Arc Badge */}
          <View style={styles.rainbowArcPill}>
            <Sparkles size={13} color="#D97706" />
            <Text style={styles.rainbowText}>
              {lang === 'th' ? 'Mooca Rainbow Celebration' : 'Rainbow Keepsake'}
            </Text>
          </View>

          {/* Mascot in Celebration Mode */}
          <View style={styles.mascotHolder}>
            <MoocaMascot
              mood="celebrating"
              size="md"
              showSunny={true}
              interactive={true}
            />
          </View>

          {/* Golden Badge: "เหรียญตรา Mooca Best Friend" */}
          <View style={styles.goldMedalContainer}>
            <View style={styles.goldMedal}>
              <Award size={16} color="#78350F" />
              <Text style={styles.goldMedalText}>
                {lang === 'th' ? 'เหรียญตรา Mooca Best Friend' : 'Mooca Best Friend'}
              </Text>
            </View>
            {/* Satin Ribbons under medal */}
            <View style={styles.ribbonTailLeft} />
            <View style={styles.ribbonTailRight} />
          </View>
        </LinearGradient>

        {/* Polaroid Wide Bottom Chin */}
        <View style={styles.polaroidChin}>
          <Text style={styles.handwrittenCaption}>
            {lang === 'th'
              ? 'เธอเก่งที่สุดในโลกเลย! พักใจแล้วก้าวไปต่อนะ'
              : 'You are so brave and wonderful! Keep shining'}
          </Text>

          <View style={styles.chinFooterRow}>
            <Text style={styles.chinDateText}>
              {currentDate} • 120s Reset
            </Text>
            <View style={styles.chinBpmDrop}>
              <Leaf size={11} color="#00C4B3" style={{ marginRight: 2 }} />
              <Text style={styles.chinBpmText} numberOfLines={1}>
                {`-${bpmDrop}\u00A0BPM`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Metrics Mini Summary */}
      <View style={styles.metricsSummary}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{lang === 'th' ? 'ก่อนเริ่ม' : 'Initial'}</Text>
          <Text style={styles.metricVal} numberOfLines={1}>
            {`${feedback?.preHeartRate || 105}\u00A0BPM`}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{lang === 'th' ? 'ตอนนี้' : 'Current'}</Text>
          <Text style={[styles.metricVal, { color: colors.primary }]} numberOfLines={1}>
            {`${feedback?.postHeartRate || 87}\u00A0BPM`}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{lang === 'th' ? 'ความผ่อนคลาย' : 'Calm Shift'}</Text>
          <Text style={[styles.metricVal, { color: colors.secondary }]} numberOfLines={1}>
            {`-${bpmDrop}\u00A0BPM`}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Share Keepsake Button */}
        <MarshmallowButton
          variant="secondary"
          size="md"
          onPress={handleShareKeepsake}
          icon={<Share2 size={16} color="#FFFFFF" />}
          title={
            lang === 'th'
              ? 'แชร์การ์ดโพลารอยด์แห่งความกล้าหาญ'
              : 'Share Polaroid Keepsake'
          }
        />

        {/* Start New Session */}
        <MarshmallowButton
          variant="primary"
          size="md"
          onPress={onRestart}
          icon={<RotateCcw size={18} color="#FFFFFF" />}
          title={
            lang === 'th'
              ? 'เริ่มรีเซ็ตครั้งใหม่ (New Reset)'
              : 'Start New Session'
          }
        />

        {/* View History Button */}
        <MarshmallowButton
          variant="softCream"
          size="md"
          onPress={onOpenHistory}
          icon={<History size={16} color={colors.primaryDark} />}
          title={
            lang === 'th' ? 'ดูประวัติการฟื้นตัวของใจ' : 'View Reset History'
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    alignItems: 'center',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 6,
    marginBottom: 6,
  },
  topBadgeText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#92400E',
  },
  headline: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 18,
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 10,
  },
  polaroidFrame: {
    width: '100%',
    backgroundColor: '#ffffffff',
    borderRadius: 16,
    padding: 12,
    paddingBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 12,
  },
  photoViewport: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  sparkleItem: {
    position: 'absolute',
    fontSize: 15,
  },
  rainbowArcPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 5,
    ...shadows.card,
  },
  rainbowText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 9,
    color: colors.primaryDark,
  },
  mascotHolder: {
    alignItems: 'center',
    marginVertical: -6,
  },
  goldMedalContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 5,
  },
  goldMedal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FBBF24',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 2,
    borderColor: '#FEF3C7',
    gap: 6,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  goldMedalText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#78350F',
  },
  ribbonTailLeft: {
    position: 'absolute',
    bottom: -8,
    left: 20,
    width: 10,
    height: 12,
    backgroundColor: '#F59E0B',
    transform: [{ rotate: '-18deg' }],
    zIndex: -1,
  },
  ribbonTailRight: {
    position: 'absolute',
    bottom: -8,
    right: 20,
    width: 10,
    height: 12,
    backgroundColor: '#F59E0B',
    transform: [{ rotate: '18deg' }],
    zIndex: -1,
  },
  polaroidChin: {
    paddingTop: 12,
    paddingHorizontal: 6,
  },
  handwrittenCaption: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 13,
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 20,
  },
  chinFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  chinDateText: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
  },
  chinBpmDrop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  chinBpmText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.primary,
  },
  metricsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    marginBottom: 14,
    ...shadows.soft,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricLabel: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
  },
  metricVal: {
    fontFamily: typography.fontPromptBold,
    fontSize: 14,
    color: colors.primaryDark,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  actionsContainer: {
    width: '100%',
    gap: 8,
  },
});
