import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { Zap, Activity, CheckCircle2, RotateCw, Star, Sparkles, Cloud } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';

interface KineticShakerProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const KineticShaker: React.FC<KineticShakerProps> = ({
  onComplete,
  lang,
}) => {
  const [mode, setMode] = useState<'shake' | 'bounce'>('shake');
  const [shakesLeft, setShakesLeft] = useState(15);
  const [bouncesLeft, setBouncesLeft] = useState(10);
  const [isFinished, setIsFinished] = useState(false);
  const [starBurstCount, setStarBurstCount] = useState(0);

  const lastShakeTime = useRef(0);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const starBurstAnim = useRef(new Animated.Value(0)).current;

  const triggerShakeVisual = () => {
    // Shake wiggle
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5, duration: 35, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 35, useNativeDriver: true }),
    ]).start();

    // Burst stars from shattered grumpy cloud
    setStarBurstCount((prev) => prev + 1);
    starBurstAnim.setValue(0);
    Animated.timing(starBurstAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  // Accelerometer listener
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const total = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        if (total > 1.8 && now - lastShakeTime.current > 250) {
          lastShakeTime.current = now;
          handleCycle();
        }
      });
    } catch {
      // Simulator fallback
    }

    return () => {
      subscription?.remove();
    };
  }, [shakesLeft, bouncesLeft, mode, isFinished]);

  const handleCycle = () => {
    if (isFinished) return;

    triggerShakeVisual();

    if (mode === 'shake') {
      const remaining = Math.max(0, shakesLeft - 1);
      setShakesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        finishIntervention();
      }
    } else {
      const remaining = Math.max(0, bouncesLeft - 1);
      setBouncesLeft(remaining);
      audioService.playShakerClick(remaining);

      if (remaining === 0) {
        finishIntervention();
      }
    }
  };

  const finishIntervention = () => {
    setIsFinished(true);
    audioService.triggerHaptic('success');
    audioService.playChimeShockwave();
    setTimeout(() => {
      onComplete();
    }, 1400);
  };

  const currentCount = mode === 'shake' ? shakesLeft : bouncesLeft;
  const maxCount = mode === 'shake' ? 15 : 10;
  const progressPercent = Math.round(((maxCount - currentCount) / maxCount) * 100);
  // Mercury height drops from 95% down to 15%
  const mercuryHeightPercent = Math.max(15, 95 - progressPercent * 0.8);

  const starBurstScale = starBurstAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.4],
  });

  const starBurstOpacity = starBurstAnim.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <View style={styles.container}>
      {/* Mode Switcher */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('selection');
            setMode('shake');
          }}
          activeOpacity={0.8}
          style={[styles.modeTab, mode === 'shake' && styles.modeTabActive]}
        >
          <Zap size={14} color={mode === 'shake' ? '#FFFFFF' : colors.primaryDark} />
          <Text style={[styles.modeTabText, mode === 'shake' && styles.modeTabTextActive]}>
            {lang === 'th' ? 'สะบัดข้อมือ (Wrist Shake)' : 'Hand Shake'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('selection');
            setMode('bounce');
          }}
          activeOpacity={0.8}
          style={[styles.modeTab, mode === 'bounce' && styles.modeTabActive]}
        >
          <Activity size={14} color={mode === 'bounce' ? '#FFFFFF' : colors.primaryDark} />
          <Text style={[styles.modeTabText, mode === 'bounce' && styles.modeTabTextActive]}>
            {lang === 'th' ? 'กระโดดดึ๋งๆ (Heel Bounce)' : 'Heel Bounce'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mascot View with Shake Feedback */}
      <Animated.View
        style={[
          styles.mascotWrapper,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'shaking'}
          size="sm"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'เมฆหน้าบึ้งแตกเป็นดาวหมดแล้ว! ตัวเบาสบายเลย'
                : 'All grumpy clouds shattered into shining stars!'
              : lang === 'th'
              ? `สะบัดข้อมือหรือกระโดดอีก ${currentCount} ครั้ง ให้เมฆแตกกระจาย!`
              : `Shake device or bounce ${currentCount} more times!`
          }
        />
      </Animated.View>

      {/* Stress Thermometer & Shattering Clouds Container */}
      <View style={styles.thermometerSection}>
        {/* Star Burst Particles overlay (NO EMOJI - ALWAYS ICONS) */}
        <Animated.View
          style={[
            styles.starBurstOverlay,
            {
              transform: [{ scale: starBurstScale }],
              opacity: starBurstOpacity,
            },
          ]}
          pointerEvents="none"
        >
          <View style={styles.burstStar1}><Star size={20} color="#F59E0B" fill="#FDE047" /></View>
          <View style={styles.burstStar2}><Sparkles size={18} color="#F59E0B" fill="#FDE047" /></View>
          <View style={styles.burstStar3}><Star size={24} color="#F59E0B" fill="#FDE047" /></View>
          <View style={styles.burstStar4}><Sparkles size={16} color="#F59E0B" fill="#FDE047" /></View>
        </Animated.View>

        {/* The Cute Glass Thermometer Tube */}
        <Animated.View
          style={[
            styles.thermometerWrapper,
            { transform: [{ translateX: shakeAnim }] },
          ]}
        >
          {/* Glass Stem */}
          <View style={styles.thermoStem}>
            {/* Tick Marks */}
            <View style={styles.tickMarks}>
              <View style={[styles.tick, { top: '15%' }]} />
              <View style={[styles.tick, { top: '35%' }]} />
              <View style={[styles.tick, { top: '55%' }]} />
              <View style={[styles.tick, { top: '75%' }]} />
            </View>

            {/* Mercury Liquid Fill */}
            <LinearGradient
              colors={
                progressPercent > 70
                  ? ['#2DD4BF', '#00C4B3']
                  : progressPercent > 40
                  ? ['#FBBF24', '#F59E0B']
                  : ['#FB7185', '#E11D48']
              }
              style={[styles.mercuryFill, { height: `${mercuryHeightPercent}%` }]}
            />
          </View>

          {/* Bulb Base with Grumpy Cloud / Stars */}
          <View style={styles.thermoBulb}>
            <LinearGradient
              colors={
                isFinished
                  ? ['#CCFBF1', '#99F6E4']
                  : progressPercent > 60
                  ? ['#FEF08A', '#FDE047']
                  : ['#FFE4E6', '#FECDD3']
              }
              style={styles.bulbGradient}
            >
              {isFinished ? (
                <Star size={24} color="#F59E0B" fill="#FDE047" />
              ) : (
                <View style={styles.grumpyCloud}>
                  <Cloud size={24} color="#94A3B8" fill="#E2E8F0" />
                  <Text style={styles.grumpyFace}>&gt;_&lt;</Text>
                </View>
              )}
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Tension Gauge Label */}
        <View style={styles.gaugeInfo}>
          <Text style={styles.gaugeTitle}>
            {lang === 'th' ? 'หลอดปรอทสะบัดความตึงเครียด' : 'Stress Discharge Mercury'}
          </Text>
          <Text style={styles.gaugeSub}>
            {isFinished
              ? lang === 'th'
                ? 'ความตึงเครียดแตกสลายหมดแล้ว 100%'
                : 'Tension fully discharged 100%'
              : lang === 'th'
              ? `เหลือเมฆหน้าบึ้งอีก ${currentCount} ก้อน`
              : `${currentCount} grumpy clouds remaining`}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={['#00C4B3', '#62A0E9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>
      </View>

      {/* Tactile Marshmallow Tap Action */}
      <View style={styles.actionSection}>
        <MarshmallowButton
          variant={isFinished ? 'mint' : 'secondary'}
          size="lg"
          onPress={handleCycle}
          disabled={isFinished}
          icon={
            isFinished ? (
              <CheckCircle2 size={18} color="#004D40" />
            ) : (
              <RotateCw size={18} color="#FFFFFF" />
            )
          }
          title={
            isFinished
              ? lang === 'th'
                ? 'สลัดพลังลบแตกกระจายสำเร็จ!'
                : 'Tension Discharged!'
              : lang === 'th'
              ? `แตะเพื่อสะบัดทิ้งพลังลบ (${currentCount} ครั้ง)`
              : `Tap to Shake / Discharge (${currentCount} left)`
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    width: '100%',
    gap: 4,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: radii.full,
    gap: 5,
  },
  modeTabActive: {
    backgroundColor: colors.secondary,
  },
  modeTabText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 2,
  },
  thermometerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    width: '100%',
    gap: 16,
    position: 'relative',
    ...shadows.soft,
  },
  starBurstOverlay: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 80,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  burstStar1: { position: 'absolute', top: 5, left: 10, fontSize: 18 },
  burstStar2: { position: 'absolute', top: 20, right: 10, fontSize: 16 },
  burstStar3: { position: 'absolute', bottom: 25, left: 15, fontSize: 20 },
  burstStar4: { position: 'absolute', bottom: 10, right: 15, fontSize: 16 },
  thermometerWrapper: {
    alignItems: 'center',
    width: 54,
  },
  thermoStem: {
    width: 20,
    height: 100,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  tickMarks: {
    position: 'absolute',
    left: 2,
    top: 0,
    bottom: 0,
    width: 4,
    zIndex: 2,
  },
  tick: {
    position: 'absolute',
    width: 5,
    height: 1.5,
    backgroundColor: '#9CA3AF',
  },
  mercuryFill: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  thermoBulb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
    marginTop: -8,
    zIndex: 3,
    ...shadows.card,
  },
  bulbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grumpyCloud: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cloudEmoji: {
    fontSize: 20,
  },
  grumpyFace: {
    fontSize: 7,
    fontWeight: '900',
    color: '#9F1239',
    marginTop: -8,
  },
  gaugeInfo: {
    flex: 1,
    gap: 4,
  },
  gaugeTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  gaugeSub: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionSection: {
    width: '100%',
    marginTop: 4,
  },
});
