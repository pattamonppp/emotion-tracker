import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UserProfile, ShiftFeedback, SKY, LANG } from '../../types';
import { BilingualText } from '../../components/BilingualText';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../../components/MoocaMascot';
import { FeedbackModal } from './modals/FeedbackModal';
import { useSky } from '../../components/DynamicSkyEngine';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
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
  MessageSquareHeart,
} from 'lucide-react-native';
import { colors, radii, typography } from '../../design-system/tokens';
import { getTranslation } from '../../locales';

export interface ResetCompletedViewProps {
  profile: UserProfile;
  feedback: ShiftFeedback | null;
  onRestart: () => void;
  onOpenProfile?: () => void;
  onOpenHistory: () => void;
}

export const ResetCompletedView: React.FC<ResetCompletedViewProps> = ({
  profile,
  feedback,
  onRestart,
  onOpenHistory,
}) => {
  const { activePeriod } = useSky();
  const isNight = activePeriod === SKY.NIGHT;
  const lang = profile.language;
  const t = getTranslation(lang);
  const c = t.phases.completed;

  const bpmDrop = feedback ? feedback.preHeartRate - feedback.postHeartRate : 18;
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleShareKeepsake = async () => {
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
    try {
      const shareMessage = c.shareKeepsakeTemplate
        .replace('{name}', profile.name)
        .replace('{bpm}', String(bpmDrop));
      await Share.share({ message: shareMessage });
    } catch {
      // Ignore
    }
  };

  const currentDate = new Date().toLocaleDateString(
    lang === LANG.TH ? 'th-TH' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Completion Header */}
      <View style={styles.topBadge}>
        <Award size={15} color="#DF8900" />
        <BilingualText
          style={styles.topBadgeText}
          fontPrompt={typography.fontPromptBold}
          fontGotham={typography.fontGothamBold}
        >
          {c.somaticResetComplete}
        </BilingualText>
      </View>

      <BilingualText
        style={[styles.headline, isNight && { color: '#FFFFFF' }]}
        fontPrompt={typography.fontPromptExtraBold}
        fontGotham={typography.fontGothamBold}
      >
        {c.congratsTitle.replace('{name}', profile.name)}
      </BilingualText>

      {/* Polaroid Keepsake Card */}
      <View style={styles.polaroidFrame}>
        {/* Photo Viewport with Rainbow Celebration */}
        <LinearGradient
          colors={['#FCF4E0', '#FDEFEE', '#E4EFFB', '#E0F8F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.photoViewport}
        >
          <View style={[styles.sparkleItem, { top: 8, left: 12 }]}>
            <Sparkles size={16} color="#F9A000" fill="#F8E4B3" />
          </View>
          <View style={[styles.sparkleItem, { top: 12, right: 14 }]}>
            <PartyPopper size={16} color="#EF7773" />
          </View>
          <View style={[styles.sparkleItem, { bottom: 12, left: 16 }]}>
            <Star size={15} color="#F9A000" fill="#F8E4B3" />
          </View>
          <View style={[styles.sparkleItem, { bottom: 10, right: 16 }]}>
            <Heart size={16} color="#EF7773" fill="#EF7773" />
          </View>

          {/* Rainbow Arc Badge */}
          <View style={styles.rainbowArcPill}>
            <Sparkles size={11} color="#DF8900" />
            <Text style={styles.rainbowText}>
              {c.rainbowCelebration}
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

          {/* Golden Badge */}
          <View style={styles.goldMedalContainer}>
            <View style={styles.goldMedal}>
              <Award size={14} color="#DF8900" />
              <Text style={styles.goldMedalText}>
                {c.goldMedalTitle}
              </Text>
            </View>
            <View style={styles.ribbonTailLeft} />
            <View style={styles.ribbonTailRight} />
          </View>
        </LinearGradient>

        {/* Polaroid Wide Bottom Chin */}
        <View style={styles.polaroidChin}>
          <BilingualText
            style={styles.handwrittenCaption}
            fontPrompt={typography.fontPromptBold}
            fontGotham={typography.fontGothamBold}
          >
            {c.caption}
          </BilingualText>

          <View style={styles.chinFooterRow}>
            <BilingualText
              style={styles.chinDateText}
              fontPrompt={typography.fontPromptMedium}
              fontGotham={typography.fontGotham}
            >
              {currentDate}
            </BilingualText>
            <View style={styles.chinBpmDrop}>
              <Leaf size={11} color={colors.primary} style={{ marginRight: 2 }} />
              <Text style={styles.chinBpmText} numberOfLines={1}>
                {`-${bpmDrop} BPM`}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Metrics Mini Summary */}
      <View style={styles.metricsSummary}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{c.preLabel}</Text>
          <Text style={styles.metricVal} numberOfLines={1}>
            {`${feedback?.preHeartRate || 105} BPM`}
          </Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>{c.nowLabel}</Text>
          <Text style={[styles.metricVal, { color: colors.primary }]} numberOfLines={1}>
            {`${feedback?.postHeartRate || 87} BPM`}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Feedback Button */}
        <MarshmallowButton
          variant={MARSHMALLOW_VARIANT.MINT}
          size={MARSHMALLOW_SIZE.MD}
          onPress={() => setIsFeedbackModalOpen(true)}
          icon={<MessageSquareHeart size={18} color={colors.primaryDark} />}
          title={c.feedbackBtn}
        />

        {/* Share Keepsake Button */}
        <MarshmallowButton
          variant={MARSHMALLOW_VARIANT.SECONDARY}
          size={MARSHMALLOW_SIZE.MD}
          onPress={handleShareKeepsake}
          icon={<Share2 size={16} color="#FFFFFF" />}
          title={c.sharePolaroidBtn}
        />

        {/* Start New Session */}
        <MarshmallowButton
          variant={MARSHMALLOW_VARIANT.PRIMARY}
          size={MARSHMALLOW_SIZE.MD}
          onPress={onRestart}
          icon={<RotateCcw size={18} color="#FFFFFF" />}
          title={c.restartSessionBtn}
        />

        {/* View History Button */}
        <MarshmallowButton
          variant={MARSHMALLOW_VARIANT.SOFT_CREAM}
          size={MARSHMALLOW_SIZE.MD}
          onPress={onOpenHistory}
          icon={<History size={16} color={colors.primaryDark} />}
          title={c.viewHistoryBtn}
        />
      </View>

      {/* AI Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        lang={lang}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 0,
    alignItems: 'center',
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCF4E0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#F8E4B3',
    gap: 6,
    marginBottom: 6,
  },
  topBadgeText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: '#D97800',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
    borderWidth: 1.5,
    borderColor: '#f1f1f1',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 12,
  },
  photoViewport: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  sparkleItem: {
    position: 'absolute',
  },
  rainbowArcPill: {
    position: 'absolute',
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#F8E4B3',
  },
  rainbowText: {
    fontFamily: typography.fontGothamBold,
    fontSize: 10,
    color: '#DF8900',
  },
  mascotHolder: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  goldMedalContainer: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
  },
  goldMedal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FCF4E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.24,
    borderColor: '#F9A000',
    zIndex: 2,
  },
  goldMedalText: {
    fontFamily: typography.fontGothamBold,
    fontSize: 9,
    color: '#DF8900',
    letterSpacing: 0.3,
  },
  ribbonTailLeft: {
    position: 'absolute',
    bottom: -6,
    left: 8,
    width: 8,
    height: 10,
    backgroundColor: '#F9A000',
    transform: [{ rotate: '15deg' }],
  },
  ribbonTailRight: {
    position: 'absolute',
    bottom: -6,
    right: 8,
    width: 8,
    height: 10,
    backgroundColor: '#F9A000',
    transform: [{ rotate: '-15deg' }],
  },
  polaroidChin: {
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  handwrittenCaption: {
    fontFamily: typography.fontPromptBold,
    fontSize: 13,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 6,
  },
  chinFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
    paddingTop: 8,
  },
  chinDateText: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10,
    color: colors.textMuted,
  },
  chinBpmDrop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  chinBpmText: {
    fontFamily: typography.fontGothamBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  metricsSummary: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    marginBottom: 16,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    width: '50%',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  metricLabel: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: 2,
  },
  metricVal: {
    fontFamily: typography.fontGothamBold,
    fontSize: 13,
    color: colors.textPrimary,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
});

export * from './modals/ResetHistoryModal';
export * from './modals/FeedbackModal';

