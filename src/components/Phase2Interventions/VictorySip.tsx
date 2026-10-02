import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { Heart, Check, Wind, GlassWater, Sparkles, Compass } from 'lucide-react-native';
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
  const [tiltAngle, setTiltAngle] = useState(0);
  const [isTiltingToDrink, setIsTiltingToDrink] = useState(false);

  // Boba bubble bobbing animation
  const bobbingAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const tiltHoldTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Real Accelerometer inclination angle detection with low-pass smoothing
  const smoothedTilt = useRef(0);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Accelerometer.setUpdateInterval(80);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Physical pitch inclination angle when held in portrait:
        // y is vertical (-1 when upright), z is screen perpendicular (+1/-1)
        const rad = Math.atan2(z, -y);
        const rawDeg = Math.max(0, Math.min(90, Math.round(rad * (180 / Math.PI))));
        // Exponential moving average for buttery smooth sensory display
        smoothedTilt.current = Math.round(smoothedTilt.current * 0.65 + rawDeg * 0.35);
        setTiltAngle(smoothedTilt.current);

        // When tilted past 28° like drinking from a glass
        if (smoothedTilt.current >= 28 && !isFinished) {
          setIsTiltingToDrink(true);
          if (!tiltHoldTimer.current) {
            tiltHoldTimer.current = setTimeout(() => {
              triggerSip();
              tiltHoldTimer.current = null;
            }, 900);
          }
        } else {
          setIsTiltingToDrink(false);
          if (tiltHoldTimer.current) {
            clearTimeout(tiltHoldTimer.current);
            tiltHoldTimer.current = null;
          }
        }
      });
    } catch {
      // Simulator fallback
    }

    return () => {
      subscription?.remove();
      if (tiltHoldTimer.current) clearTimeout(tiltHoldTimer.current);
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
      // No auto-advance: require user to tap proceed button
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Mascot View - Standardized 140px Height */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'drinking'}
          size="sm"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'จิบน้ำครบ 3 อึกแล้วนะ! ร่างกายได้รับความสดชื่นเต็มเปี่ยม หัวใจเต้นช้าลงแล้ว'
                : 'All 3 sips complete! Your body is refreshed and heart rate is calm.'
              : lang === 'th'
                ? `ยกมือถือทำท่าจิบน้ำช้าๆ แล้วค่อยๆ กลืนนะคนเก่ง (${sipCount + 1}/3)`
                : `Raise phone gently like drinking water & swallow slowly (${sipCount + 1}/3)`
          }
        />
      </View>

      {/* 2. Fantasy Crystal Potion Tumbler Container */}
      <View style={styles.cupContainer}>
        {/* Soft Ambient Radiating Halo behind the tumbler */}
        <View style={styles.cupAuraHalo} pointerEvents="none" />

        {/* Straw Top Star Topper */}
        <View style={styles.strawStarTopper}>
          <Sparkles size={14} color="#F59E0B" fill="#FDE047" />
        </View>

        {/* Iridescent Striped Straw */}
        <View style={styles.straw}>
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#5EEAD4' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#FDE047' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#5EEAD4' }]} />
          <View style={[styles.strawStripe, { backgroundColor: '#F472B6' }]} />
        </View>

        {/* Cup Dome Rim */}
        <View style={styles.cupDome} />

        {/* Crystal Potion Cup Glass Body */}
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

        {/* Real Accelerometer Inclinometer & Sip Counter */}
        <View
          style={[
            styles.inclinometerBadge,
            isTiltingToDrink && styles.inclinometerBadgeActive,
          ]}
        >
          <Compass size={13} color={isTiltingToDrink ? '#004D40' : colors.primaryDark} />
          <Text
            style={[
              styles.inclinometerText,
              isTiltingToDrink && styles.inclinometerTextActive,
            ]}
          >
            {lang === 'th'
              ? `${sipCount}/3 อึก • เอียงแก้ว ${tiltAngle}° / 28° ${isTiltingToDrink ? '• กำลังจิบ...' : ''}`
              : `${sipCount}/3 Sips • Tilt ${tiltAngle}° / 28° ${isTiltingToDrink ? '• Sipping...' : ''}`}
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
                ? '2. ค่อย ๆ กลืนน้ำ... กระตุ้นเส้นประสาทเวกัส'
                : '2. Swallow slowly... activating vagal tone'
              : breathPhase === 'exhale'
                ? lang === 'th'
                  ? '3. ผ่อนลมหายใจออกยาว ๆ สบาย ๆ ...'
                  : '3. Exhale fully and relax muscles...'
                : lang === 'th'
                  ? 'พร้อมจิบน้ำอึกถัดไปเพื่อเพิ่มความสดชื่น'
                  : 'Ready for next restorative sip'}
        </Text>
      </View>

      {/* Action / Sensor Status Section (No tap substitution allowed) */}
      <View style={styles.actionSection}>
        {isFinished ? (
          <MarshmallowButton
            variant="primary"
            size="lg"
            onPress={onComplete}
            icon={<Check size={18} color="#FFFFFF" />}
            title={
              lang === 'th'
                ? 'เข้าสู่หน้าสะท้อนความคิด'
                : 'Proceed to Cognitive Reframing'
            }
          />
        ) : (
          <View style={styles.sensorStatusPill}>
            <GlassWater size={14} color={colors.primary} />
            <Text style={styles.sensorStatusPillText}>
              {lang === 'th'
                ? `ยกโทรศัพท์ทำท่าจิบน้ำจริง (เอียง > 28° • อึกที่ ${sipCount + 1}/3)`
                : `Tilt phone to sip for real (> 28° • Sip ${sipCount + 1}/3)`}
            </Text>
          </View>
        )}
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
    height: 140,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cupContainer: {
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  cupAuraHalo: {
    position: 'absolute',
    top: 20,
    width: 130,
    height: 150,
    borderRadius: 65,
    backgroundColor: 'rgba(94, 234, 212, 0.18)',
    shadowColor: '#2DD4BF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
  },
  strawStarTopper: {
    marginBottom: -8,
    zIndex: 5,
    transform: [{ translateX: 6 }],
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#99F6E4',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },
  pearlFace: {
    fontSize: 7,
    color: '#004D40',
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
  inclinometerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 6,
    marginTop: 8,
    ...shadows.soft,
  },
  inclinometerBadgeActive: {
    backgroundColor: '#CCFBF1',
    borderColor: colors.primary,
  },
  inclinometerText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 10.5,
    color: colors.primaryDark,
  },
  inclinometerTextActive: {
    fontFamily: typography.fontPromptBold,
    color: '#004D40',
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
    alignItems: 'center',
  },
  sensorStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 8,
    ...shadows.soft,
  },
  sensorStatusPillText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
