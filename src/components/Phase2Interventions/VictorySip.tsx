import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gyroscope } from 'expo-sensors';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { Heart, Check, Wind, GlassWater, Sparkles } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';

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

  // Boba bubble bobbing animation
  const bobbingAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bobLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(bobbingAnim, {
          toValue: -5,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bobbingAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop.start();

    const waveLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 4,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: -4,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    waveLoop.start();

    return () => {
      bobLoop.stop();
      waveLoop.stop();
    };
  }, [bobbingAnim, waveAnim]);

  // Gyroscope tilt listener
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Gyroscope.setUpdateInterval(150);
      subscription = Gyroscope.addListener(({ x }) => {
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

    // Vagus Nerve cycle
    setBreathPhase('inhale');
    setTimeout(() => setBreathPhase('swallow'), 900);
    setTimeout(() => setBreathPhase('exhale'), 2100);
    setTimeout(() => setBreathPhase('ready'), 3500);

    const newLevel = Math.max(0, 100 - nextSip * 33.3);
    setLiquidLevel(newLevel);

    if (nextSip >= 3) {
      setIsFinished(true);
      audioService.triggerHaptic('success');
      setTimeout(() => {
        onComplete();
      }, 1800);
    }
  };

  return (
    <View style={styles.container}>
      {/* Vagus Nerve Badge */}
      <View style={styles.instructionBadge}>
        <GlassWater size={14} color="#F43F5E" />
        <Text style={styles.instructionText}>
          {lang === 'th'
            ? '🥤 จิบน้ำชัยชนะ • กระตุ้น Vagus Nerve ลดอัตราชีพจร'
            : '🥤 Victory Sip • Vagal Breath to slow heart rate'}
        </Text>
      </View>

      {/* Mascot View */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'drinking'}
          size="sm"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'จิบครบแล้วนะ! เส้นประสาท Vagus Nerve ผ่อนคลายเต็มที่แล้ว'
                : 'All 3 sips complete! Your nervous system is settled.'
              : lang === 'th'
              ? `เอียงโทรศัพท์ทำท่าจิบน้ำช้าๆ แล้วหายใจลึกควบคู่ ${sipCount + 1}/3`
              : `Tilt to sip slowly, exhale deeply ${sipCount + 1}/3`
          }
        />
      </View>

      {/* Smiling Boba Cup Visual Container */}
      <View style={styles.cupContainer}>
        {/* Pastel Striped Straw */}
        <View style={styles.straw}>
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#A7F3D0' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#A7F3D0' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
        </View>

        {/* Cup Dome Rim */}
        <View style={styles.cupDome} />

        {/* Boba Cup Glass Body */}
        <View style={styles.cupBody}>
          {/* Glass Highlight */}
          <View style={styles.glassReflection} />

          {/* Liquid Fill with Wave */}
          <Animated.View
            style={[
              styles.liquidContainer,
              {
                height: `${liquidLevel}%`,
                transform: [{ translateX: waveAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['#A7F3D0', '#5EEAD4', '#2DD4BF']}
              style={styles.liquidGradient}
            >
              {/* Liquid Wave Ripple Highlight */}
              <View style={styles.liquidWaveTop} />
            </LinearGradient>
          </Animated.View>

          {/* Smiling Boba Pearls inside Cup */}
          <Animated.View
            style={[
              styles.pearlsContainer,
              { transform: [{ translateY: bobbingAnim }] },
            ]}
          >
            {/* Pearl 1 */}
            <View style={[styles.pearl, { left: 14, bottom: 8 }]}>
              <Text style={styles.pearlFace}>•‿•</Text>
            </View>
            {/* Pearl 2 */}
            <View style={[styles.pearl, { left: 40, bottom: 12 }]}>
              <Text style={styles.pearlFace}>◕‿◕</Text>
            </View>
            {/* Pearl 3 */}
            <View style={[styles.pearl, { right: 14, bottom: 8 }]}>
              <Text style={styles.pearlFace}>^‿^</Text>
            </View>
            {/* Floating Bubble 4 (NO EMOJI) */}
            <View style={[styles.floatingBubble, { left: 24, bottom: 38 }]}>
              <Sparkles size={11} color="#FDE047" fill="#FDE047" />
            </View>
            {/* Floating Bubble 5 (NO EMOJI) */}
            <View style={[styles.floatingBubble, { right: 26, bottom: 44 }]}>
              <Heart size={10} color="#F472B6" fill="#F472B6" />
            </View>
          </Animated.View>

          {/* Cup Front Smiling Face */}
          <View style={styles.cupFaceContainer}>
            <Text style={styles.cupEyes}>◕   ◕</Text>
            <Text style={styles.cupMouth}>‿</Text>
          </View>
        </View>

        {/* Counter Badge */}
        <View style={styles.sipCounterBadge}>
          <GlassWater size={12} color={colors.primary} />
          <Text style={styles.sipCounterText}>
            {sipCount} / 3 {lang === 'th' ? 'อึกแห่งชัยชนะ' : 'Victory Sips'}
          </Text>
        </View>
      </View>

      {/* Vagus Nerve Breathing Rhythm Guide */}
      <View style={styles.breathCard}>
        <Wind size={15} color={colors.primary} />
        <Text style={styles.breathStatus}>
          {breathPhase === 'inhale'
            ? lang === 'th'
              ? '1. สูดหายใจเข้า แล้วแตะจิบน้ำ...'
              : '1. Inhale gently and sip...'
            : breathPhase === 'swallow'
            ? lang === 'th'
              ? '2. ค่อยๆ กลืนน้ำ... กระตุ้นเส้นประสาทเวกัส'
              : '2. Swallow slowly... activating vagal tone'
            : breathPhase === 'exhale'
            ? lang === 'th'
              ? '3. ผ่อนลมหายใจออกยาวๆ สบายๆ...'
              : '3. Exhale fully and relax muscles...'
            : lang === 'th'
            ? 'พร้อมจิบน้ำอึกถัดไปเพื่อเพิ่มความสดชื่น'
            : 'Ready for next restorative sip'}
        </Text>
      </View>

      {/* Marshmallow Tap Button */}
      <View style={styles.actionSection}>
        <MarshmallowButton
          variant={isFinished ? 'mint' : 'primary'}
          size="lg"
          onPress={triggerSip}
          disabled={isFinished}
          icon={
            isFinished ? (
              <Check size={18} color="#004D40" />
            ) : (
              <GlassWater size={18} color="#FFFFFF" />
            )
          }
          title={
            isFinished
              ? lang === 'th'
                ? 'จิบน้ำชัยชนะสำเร็จแล้ว!'
                : 'Victory Sip Achieved!'
              : lang === 'th'
              ? `จิบน้ำชัยชนะคำที่ ${sipCount + 1} (Tap to Sip)`
              : `Drink Victory Sip ${sipCount + 1} of 3`
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
  instructionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 6,
    ...shadows.card,
  },
  instructionText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: '#9F1239',
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 2,
  },
  cupContainer: {
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  straw: {
    width: 14,
    height: 38,
    borderRadius: 7,
    overflow: 'hidden',
    marginBottom: -4,
    zIndex: 2,
    flexDirection: 'column',
    transform: [{ rotate: '12deg' }],
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  strawStripe: {
    flex: 1,
    width: '100%',
  },
  cupDome: {
    width: 104,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 2,
    borderColor: '#BFEFEB',
    zIndex: 3,
  },
  cupBody: {
    width: 96,
    height: 124,
    backgroundColor: 'rgba(240, 253, 250, 0.65)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 2.5,
    borderColor: colors.primary,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    ...shadows.soft,
  },
  glassReflection: {
    position: 'absolute',
    left: 6,
    top: 8,
    width: 4,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 2,
    zIndex: 5,
  },
  liquidContainer: {
    width: '100%',
    overflow: 'hidden',
  },
  liquidGradient: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  liquidWaveTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  pearlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 4,
  },
  pearl: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#78350F',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FEF3C7',
    ...shadows.card,
  },
  pearlFace: {
    fontSize: 7,
    color: '#FEF3C7',
    fontWeight: '800',
  },
  floatingBubble: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupFaceContainer: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 6,
  },
  cupEyes: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '900',
    letterSpacing: 4,
  },
  cupMouth: {
    fontSize: 8,
    color: colors.primaryDark,
    fontWeight: '900',
    marginTop: -4,
  },
  sipCounterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 4,
    marginTop: 6,
  },
  sipCounterText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  breathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 8,
  },
  breathStatus: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  actionSection: {
    width: '100%',
    marginTop: 4,
  },
});
