import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gyroscope } from 'expo-sensors';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { GlassWater, Heart, Check, Wind } from 'lucide-react-native';
import { colors, radii, shadows } from '../../design-system/tokens';

interface VictorySipProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const VictorySip: React.FC<VictorySipProps> = ({
  onComplete,
  lang,
}) => {
  const [liquidLevel, setLiquidLevel] = useState(100); // 100 to 0
  const [sipCount, setSipCount] = useState(0); // 0 to 3
  const [breathPhase, setBreathPhase] = useState<'ready' | 'inhale' | 'swallow' | 'exhale'>('ready');
  const [isFinished, setIsFinished] = useState(false);

  // Real Gyroscope tilt listener
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Gyroscope.setUpdateInterval(150);
      subscription = Gyroscope.addListener(({ x }) => {
        // Tilting phone up/down
        if (Math.abs(x) > 2.5 && !isFinished) {
          triggerSip();
        }
      });
    } catch {
      // Simulator fallback
    }

    return () => {
      subscription?.remove();
    };
  }, [sipCount, isFinished]);

  const triggerSip = () => {
    if (isFinished) return;

    const nextSip = sipCount + 1;
    setSipCount(nextSip);
    audioService.playLiquidSip(nextSip);

    // Breathing Vagal cycle
    setBreathPhase('inhale');
    setTimeout(() => setBreathPhase('swallow'), 1000);
    setTimeout(() => setBreathPhase('exhale'), 2200);
    setTimeout(() => setBreathPhase('ready'), 3500);

    const newLevel = Math.max(0, 100 - nextSip * 34);
    setLiquidLevel(newLevel);

    if (nextSip >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic('success');
      setTimeout(() => {
        onComplete();
      }, 1600);
    }
  };

  return (
    <View style={styles.container}>
      {/* Vagus Nerve Vagal Instruction Badge */}
      <View style={styles.instructionBadge}>
        <Heart size={14} color={colors.accentPink} />
        <Text style={styles.instructionText}>
          {lang === 'th'
            ? 'การกลืนน้ำช่วยกระตุ้น Vagus Nerve ชะลอชีพจร'
            : 'Swallowing activates the Vagus Nerve to slow heart rate'}
        </Text>
      </View>

      {/* Mascot Drinking Pose */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'drinking'}
          size="md"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'จิบครบแล้ว! หัวใจเต้นช้าลงและสงบแล้ว'
                : 'All 3 sips complete! Your heart is resting.'
              : lang === 'th'
              ? `จิบน้ำอึกที่ ${sipCount + 1} แล้วค่อยๆ หายใจออกยาวๆ`
              : `Take sip ${sipCount + 1} of 3 and exhale slowly.`
          }
        />
      </View>

      {/* Glass of Water Container */}
      <View style={styles.glassContainer}>
        <View style={styles.glassOutline}>
          {/* Liquid Fill */}
          <LinearGradient
            colors={['#38BDF8', '#0284C7']}
            style={[styles.liquidFill, { height: `${liquidLevel}%` }]}
          />
          <View style={styles.glassOverlay}>
            <GlassWater size={28} color="#FFFFFF" opacity={0.8} />
            <Text style={styles.sipCounterText}>
              {sipCount} / 3 {lang === 'th' ? 'อึก' : 'sips'}
            </Text>
          </View>
        </View>

        {/* Breathing Rhythm Guide */}
        <View style={styles.breathCard}>
          <Wind size={16} color={colors.primary} />
          <Text style={styles.breathStatus}>
            {breathPhase === 'inhale'
              ? lang === 'th' ? '1. หายใจเข้าลึก...' : '1. Inhale...'
              : breathPhase === 'swallow'
              ? lang === 'th' ? '2. กลืนน้ำลงช้าๆ...' : '2. Swallow water...'
              : breathPhase === 'exhale'
              ? lang === 'th' ? '3. ผ่อนลมหายใจออกยาวๆ...' : '3. Exhale fully...'
              : lang === 'th' ? 'พร้อมจิบน้ำอึกถัดไป' : 'Ready for next sip'}
          </Text>
        </View>
      </View>

      {/* Sip Action Button */}
      <View style={styles.actionSection}>
        <Button
          variant={isFinished ? 'primary' : 'primary'}
          size="lg"
          fullWidth
          onPress={triggerSip}
          disabled={isFinished}
          icon={isFinished ? <Check size={18} color="#FFFFFF" /> : <GlassWater size={18} color="#FFFFFF" />}
        >
          {isFinished
            ? lang === 'th'
              ? 'สงบลงเรียบร้อย!'
              : 'Calm Achieved!'
            : lang === 'th'
            ? `จิบน้ำคำที่ ${sipCount + 1} (Tap to Sip)`
            : `Drink Sip ${sipCount + 1} of 3`}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  instructionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 6,
    ...shadows.card,
  },
  instructionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  glassContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  glassOutline: {
    width: 110,
    height: 140,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: '#F0FDFA',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    ...shadows.soft,
  },
  liquidFill: {
    width: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sipCounterText: {
    color: '#004D40',
    fontWeight: '800',
    fontSize: 13,
    marginTop: 4,
  },
  breathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 8,
  },
  breathStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  actionSection: {
    width: '100%',
    marginTop: 6,
  },
});
