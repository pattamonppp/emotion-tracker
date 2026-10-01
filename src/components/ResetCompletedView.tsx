import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserProfile, ShiftFeedback } from '../types';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { 
  Sparkles, 
  RotateCcw, 
  History, 
  Heart, 
  BookOpen, 
  Layers,
  Award 
} from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';

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
  onOpenDesignSystem,
  onOpenProfile,
  onOpenHistory,
  onOpenStory,
}) => {
  const lang = profile.language;
  const bpmDrop = feedback ? feedback.preHeartRate - feedback.postHeartRate : 16;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Celebration Mascot */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood="celebrating"
          size="lg"
          speakingBubble={
            lang === 'th'
              ? `เก่งมากเลยนะ ${profile.name}! 120 วินาทีนี้เธอทำได้เยี่ยมมากเลย!`
              : `Wonderful job, ${profile.name}! You mastered your 120s reset!`
          }
          onHug={onOpenStory}
        />
      </View>

      {/* Completion Shield Badge */}
      <View style={styles.badgeWrapper}>
        <Award size={16} color={colors.secondary} />
        <Text style={styles.badgeText}>
          {lang === 'th' ? 'กอดใจและรีเซ็ตสำเร็จ 120 วินาที' : '120s Somatic Reset Complete'}
        </Text>
      </View>

      <Text style={styles.heroTitle}>
        {lang === 'th' ? 'จิตใจและร่างกายของคุณพร้อมแล้ว' : 'Your Mind & Body Are Primed'}
      </Text>

      {/* Metrics Summary Card */}
      <View style={styles.metricsCard}>
        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>{lang === 'th' ? 'ก่อนเริ่ม' : 'Initial BPM'}</Text>
          <Text style={styles.metricValue}>{feedback?.preHeartRate || 105}</Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>{lang === 'th' ? 'ตอนนี้' : 'Current BPM'}</Text>
          <Text style={[styles.metricValue, { color: colors.primary }]}>
            {feedback?.postHeartRate || 87}
          </Text>
        </View>

        <View style={styles.metricDivider} />

        <View style={styles.metricCol}>
          <Text style={styles.metricLabel}>{lang === 'th' ? 'ลดลง' : 'Delta Drop'}</Text>
          <Text style={[styles.metricValue, { color: colors.secondary }]}>
            -{bpmDrop}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={onRestart}
          icon={<RotateCcw size={18} color="#FFFFFF" />}
        >
          {lang === 'th' ? 'เริ่มเซสชันใหม่ (Start New Reset)' : 'Start New Session'}
        </Button>

        <View style={styles.secondaryActionsRow}>
          <Button
            variant="secondary"
            size="md"
            style={{ flex: 1 }}
            onPress={onOpenHistory}
            icon={<History size={16} color={colors.primaryDark} />}
          >
            {lang === 'th' ? 'ประวัติ' : 'History'}
          </Button>

          <Button
            variant="secondary"
            size="md"
            style={{ flex: 1 }}
            onPress={onOpenStory}
            icon={<BookOpen size={16} color={colors.primaryDark} />}
          >
            {lang === 'th' ? 'เรื่องราว Mooca' : 'Mooca Story'}
          </Button>
        </View>

        <Button
          variant="ghost"
          size="sm"
          onPress={onOpenDesignSystem}
          icon={<Layers size={14} color={colors.textMuted} />}
        >
          {lang === 'th' ? 'ดู Design System Tokens' : 'Inspect Design Tokens'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 10,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FDE047',
    gap: 6,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 16,
  },
  metricsCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 20,
    ...shadows.soft,
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 34,
    backgroundColor: colors.borderSubtle,
  },
  metricLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});
