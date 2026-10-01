import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GoalType } from '../types';
import { REFRAMING_INSIGHTS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { Heart, Dna, Footprints, Check, ArrowRight, Sparkles } from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';

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

  const handleCommitAction = () => {
    setIsActionCommitted(true);
    audioService.triggerHaptic('success');
    audioService.playJarDrop();
  };

  return (
    <ScrollView
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
                ? 'สัญญากันแล้วนะ! Mooca จะคอยเชียร์อยู่ข้างๆ เสมอ!'
                : 'Pinky promise! Mooca is right beside you!'
              : lang === 'th'
              ? 'รู้ไหม? ความตื่นเต้นนี้ คือร่างกายกำลังช่วยสูบฉีดความพร้อมนะ'
              : 'Physical surges are your body priming focus, not fear!'
          }
        />

        <View style={styles.phaseBadge}>
          <Sparkles size={12} color={colors.primary} />
          <Text style={styles.phaseBadgeText}>
            {lang === 'th' ? 'จดหมายสะท้อนใจจาก Mooca (Phase 3)' : 'Phase 3: Cognitive Insight'}
          </Text>
        </View>

        <Text style={styles.title}>
          {lang === 'th' ? 'ความจริงทางชีววิทยาที่ Mooca อยากบอก' : 'Biological Insight & 1 Action'}
        </Text>
      </View>

      {/* 1. Contextual Behavioral Reflection Card */}
      <View style={styles.reflectionCard}>
        <View style={styles.cardHeader}>
          <Heart size={14} color={colors.accentPink} />
          <Text style={styles.cardHeaderText}>
            {lang === 'th' ? 'ข้อความคลายใจจากเพื่อน Mooca' : 'Behavioral Reflection'}
          </Text>
        </View>

        <Text style={styles.reflectionText}>
          {lang === 'th' ? insight.reflectionTh : insight.reflectionEn}
        </Text>

        <View style={styles.biologyBox}>
          <Dna size={16} color="#1F77DF" style={{ marginTop: 2 }} />
          <Text style={styles.biologyText}>
            {lang === 'th' ? insight.biologyFactTh : insight.biologyFactEn}
          </Text>
        </View>
      </View>

      {/* 2. The 1 Micro-Action Next Step Card */}
      <View style={styles.microActionCard}>
        <View style={styles.microActionHeader}>
          <View style={styles.microTitleRow}>
            <Footprints size={14} color={colors.secondary} />
            <Text style={styles.microTitleText}>
              {lang === 'th' ? '1 ก้าวถัดไปที่ทำได้ทันที' : 'The 1 Micro-Action'}
            </Text>
          </View>
          <View style={styles.immediateBadge}>
            <Text style={styles.immediateText}>
              {lang === 'th' ? 'ทำทันที' : 'Immediate'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleCommitAction}
          style={[
            styles.commitBox,
            isActionCommitted && styles.commitBoxActive,
          ]}
        >
          <View style={styles.commitContent}>
            <Text style={styles.commitEmoji}>👉</Text>
            <Text style={[styles.commitActionText, isActionCommitted && { color: colors.primaryDark }]}>
              {lang === 'th' ? insight.microActionTh : insight.microActionEn}
            </Text>
          </View>

          <View
            style={[
              styles.checkboxCircle,
              isActionCommitted && styles.checkboxCircleActive,
            ]}
          >
            {isActionCommitted ? (
              <Check size={14} color="#FFFFFF" strokeWidth={3} />
            ) : (
              <Text style={styles.tapPrompt}>{lang === 'th' ? 'แตะ' : 'Tap'}</Text>
            )}
          </View>
        </TouchableOpacity>

        <Text style={styles.commitHint}>
          {lang === 'th'
            ? '♥ แตะที่กล่องเพื่อสัญญากับ Mooca แล้วเตรียมก้าวไปลุย'
            : '♥ Tap to commit this micro-action with Mooca.'}
        </Text>
      </View>

      {/* Proceed Button */}
      <View style={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={onProceed}
          icon={<ArrowRight size={18} color="#FFFFFF" />}
        >
          {lang === 'th' ? 'วัดผลการเปลี่ยนแปลงอารมณ์ (Phase 4)' : 'Measure Emotional Shift (Phase 4)'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
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
    marginTop: 8,
    marginBottom: 4,
    ...shadows.card,
  },
  phaseBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  reflectionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    marginBottom: 12,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
    textTransform: 'uppercase',
  },
  reflectionText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 20,
    fontWeight: '600',
  },
  biologyBox: {
    flexDirection: 'row',
    backgroundColor: '#E6F9F7',
    padding: 10,
    borderRadius: radii.md,
    marginTop: 10,
    gap: 8,
  },
  biologyText: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
  microActionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(250, 140, 61, 0.4)',
    marginBottom: 16,
    ...shadows.soft,
  },
  microActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  microTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  microTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  immediateBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  immediateText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  commitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  commitBoxActive: {
    backgroundColor: '#E6F9F7',
    borderColor: colors.primary,
  },
  commitContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    gap: 8,
  },
  commitEmoji: {
    fontSize: 16,
  },
  commitActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 17,
    flex: 1,
  },
  checkboxCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tapPrompt: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '700',
  },
  commitHint: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionSection: {
    width: '100%',
  },
});
