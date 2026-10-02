import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { Sparkles, CheckCircle, Wind, Star } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';

interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

// Breath cycle: 4s inhale → 2s hold → 6s exhale  (total 12s)
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

type BreathPhase = 'inhale' | 'hold' | 'exhale';

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
}) => {
  const [rubProgress, setRubProgress] = useState(0); // 0-100
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0); // how many full breath cycles

  // ---- Animated values -----------------------------------------------
  const breathScaleAnim = useRef(new Animated.Value(0.72)).current;   // orb scale
  const breathOpacityAnim = useRef(new Animated.Value(0.7)).current;  // outer glow
  const orbitRotateAnim = useRef(new Animated.Value(0)).current;      // ring rotation
  const progressAnim = useRef(new Animated.Value(0)).current;         // 0-1 arc fill
  const rubGlowAnim = useRef(new Animated.Value(0)).current;          // rub glow pulse
  const completePop = useRef(new Animated.Value(1)).current;

  const lastHapticTick = useRef(0);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathCycleStart = useRef(Date.now());

  // ---- Breath cycle engine ------------------------------------------
  const advanceBreathCycle = useCallback(() => {
    const elapsed = (Date.now() - breathCycleStart.current) % CYCLE_MS;
    let phase: BreathPhase;
    let targetScale: number;
    let targetOpacity: number;
    let duration: number;

    if (elapsed < INHALE_MS) {
      phase = 'inhale';
      targetScale = 1.0;
      targetOpacity = 1;
      duration = INHALE_MS - elapsed;
    } else if (elapsed < INHALE_MS + HOLD_MS) {
      phase = 'hold';
      targetScale = 1.0;
      targetOpacity = 1;
      duration = INHALE_MS + HOLD_MS - elapsed;
    } else {
      phase = 'exhale';
      targetScale = 0.72;
      targetOpacity = 0.7;
      duration = CYCLE_MS - elapsed;
    }

    setBreathPhase((prev) => {
      if (prev !== phase) {
        const hapticPhase: 'in' | 'hold' | 'out' =
          phase === 'inhale' ? 'in' : phase === 'hold' ? 'hold' : 'out';
        audioService.playGroundingRhythm(hapticPhase);
      }
      return phase;
    });

    Animated.parallel([
      Animated.timing(breathScaleAnim, {
        toValue: targetScale,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
      Animated.timing(breathOpacityAnim, {
        toValue: targetOpacity,
        duration,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    ]).start();
  }, [breathScaleAnim, breathOpacityAnim]);

  useEffect(() => {
    breathCycleStart.current = Date.now();
    advanceBreathCycle();
    breathTimerRef.current = setInterval(() => {
      advanceBreathCycle();
      // Count full cycle every CYCLE_MS
      const elapsed = Date.now() - breathCycleStart.current;
      setCycleCount(Math.floor(elapsed / CYCLE_MS));
    }, 800); // check every 800ms for smooth transitions
    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
    };
  }, [advanceBreathCycle]);

  // ---- Orbit ring spin -----------------------------------------------
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(orbitRotateAnim, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [orbitRotateAnim]);

  // ---- Progress arc animation ----------------------------------------
  const animateProgressTo = (value: number) => {
    Animated.timing(progressAnim, {
      toValue: value / 100,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  // ---- Rub glow pulse when touching ----------------------------------
  const startRubGlow = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rubGlowAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(rubGlowAnim, { toValue: 0.4, duration: 220, useNativeDriver: true }),
      ])
    ).start();
  };
  const stopRubGlow = () => {
    rubGlowAnim.stopAnimation();
    Animated.timing(rubGlowAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  // ---- Progress update -----------------------------------------------
  const advanceProgress = (amount = 4) => {
    if (isFinished) return;
    setRubProgress((prev) => {
      const next = Math.min(100, prev + amount);
      animateProgressTo(next);

      const now = Date.now();
      if (now - lastHapticTick.current > 120) {
        lastHapticTick.current = now;
        audioService.playFrictionTick(next / 100);
      }

      if (next >= 100) {
        setIsFinished(true);
        // Completion celebration haptic
        audioService.playChimeShockwave();
        Animated.spring(completePop, { toValue: 1.18, friction: 3, tension: 180, useNativeDriver: true }).start(() => {
          Animated.spring(completePop, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
        });
        setTimeout(() => onComplete(), 2000);
      }
      return next;
    });
  };

  // ---- PanResponder: detect circular rubbing motion ------------------
  const lastPos = useRef({ x: 0, y: 0 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsRubbing(true);
        startRubGlow();
        const { locationX, locationY } = evt.nativeEvent;
        lastPos.current = { x: locationX, y: locationY };
        advanceProgress(2.5);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        // Measure movement distance from last point
        const dx = locationX - lastPos.current.x;
        const dy = locationY - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
          lastPos.current = { x: locationX, y: locationY };
          // Clamp contribution by speed (dist) — max 5 per event
          const contribution = Math.min(5, dist * 0.22);
          advanceProgress(contribution);
        }

        // Also honor gesture velocity
        const velocity = Math.sqrt(gestureState.vx ** 2 + gestureState.vy ** 2);
        if (velocity > 0.8) {
          advanceProgress(1.2);
        }
      },
      onPanResponderRelease: () => {
        setIsRubbing(false);
        stopRubGlow();
      },
      onPanResponderTerminate: () => {
        setIsRubbing(false);
        stopRubGlow();
      },
    })
  ).current;

  // ---- Interpolations ------------------------------------------------
  const orbitRotate = orbitRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressBorderColor = progressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#A5B4FC', '#818CF8', '#6366F1'],
  });

  const rubGlowOpacity = rubGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  // ---- Breath phase label --------------------------------------------
  const breathLabel = () => {
    if (isFinished) return lang === 'th' ? 'สติกลับมาแล้ว ✨' : 'Grounded ✨';
    switch (breathPhase) {
      case 'inhale': return lang === 'th' ? 'สูดหายใจเข้า (4 วินาที)' : 'Inhale (4s)';
      case 'hold':   return lang === 'th' ? 'กลั้นหายใจ (2 วินาที)' : 'Hold (2s)';
      case 'exhale': return lang === 'th' ? 'ผ่อนออกยาวๆ (6 วินาที)' : 'Exhale slowly (6s)';
    }
  };

  const breathIcon = breathPhase === 'inhale' ? '↑' : breathPhase === 'hold' ? '◆' : '↓';

  // ---- Render --------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Top badge */}
      <View style={styles.topBadge}>
        <Wind size={13} color={colors.primary} />
        <Text style={styles.topBadgeText}>
          {lang === 'th'
            ? `🌟 สัมผัสเหนี่ยวสติ • รอบหายใจที่ ${cycleCount + 1}`
            : `🌟 Tactile Grounding • Breath Cycle ${cycleCount + 1}`}
        </Text>
      </View>

      {/* Mooca Mascot */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : isRubbing ? 'rubbing' : 'comforting'}
          size="sm"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'ประสาทสัมผัสกลับสู่ร่างกายแล้ว สงบดีนะ'
                : 'Your senses are back in your body. Calm now.'
              : isRubbing
              ? lang === 'th'
                ? 'ดีมาก! รู้สึกการสั่นของโทรศัพท์ไหม'
                : 'Nice! Feel the haptic rhythm?'
              : breathPhase === 'inhale'
              ? lang === 'th'
                ? 'สูดหายใจเข้าช้าๆ แล้วถูวงกลมไปด้วยนะ'
                : 'Inhale slowly... rub the circle'
              : breathPhase === 'hold'
              ? lang === 'th'
                ? 'กลั้นหายใจไว้... สัมผัสนิ้วบนจอ'
                : 'Hold... keep fingers on screen'
              : lang === 'th'
              ? 'ผ่อนออกยาวๆ ตามจังหวะการสั่น'
              : 'Exhale... follow the vibration rhythm'
          }
        />
      </View>

      {/* ── Central Haptic Grounding Pad ───────────────────────────── */}
      <View style={styles.padSection}>

        {/* Progress ring (Animated border simulation with nested Views) */}
        <View style={styles.progressRingOuter}>
          <Animated.View
            style={[
              styles.progressRingFill,
              {
                borderColor: progressBorderColor,
                // Arc fill trick: show only the portion completed
                opacity: progressAnim.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 1, 1] }),
                transform: [{
                  scale: progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }),
                }],
              },
            ]}
          />
        </View>

        {/* Orbit ring with stars */}
        <Animated.View
          style={[styles.orbitRing, { transform: [{ rotate: orbitRotate }] }]}
          pointerEvents="none"
        >
          {[0, 90, 180, 270].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const r = 94; // orbit radius
            return (
              <View
                key={i}
                style={[
                  styles.orbitStar,
                  {
                    left: 100 + Math.cos(rad) * r - 8,
                    top: 100 + Math.sin(rad) * r - 8,
                    opacity: isFinished ? 1 : 0.55 + i * 0.1,
                  },
                ]}
              >
                {i % 2 === 0 ? (
                  <Sparkles size={13} color={isFinished ? '#FDE047' : '#A5B4FC'} />
                ) : (
                  <Star size={10} color={isFinished ? '#FDE047' : '#C4B5FD'} fill={isFinished ? '#FDE047' : '#C4B5FD'} />
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Breath glow halo behind orb */}
        <Animated.View
          style={[
            styles.breathHalo,
            {
              opacity: breathOpacityAnim.interpolate({ inputRange: [0.7, 1], outputRange: [0.12, 0.28] }),
              transform: [{ scale: breathScaleAnim }],
            },
          ]}
          pointerEvents="none"
        />

        {/* Rub glow pulse when touching */}
        <Animated.View
          style={[styles.rubGlow, { opacity: rubGlowOpacity }]}
          pointerEvents="none"
        />

        {/* The actual touch-sensitive orb */}
        <Animated.View
          style={[
            styles.orb,
            {
              transform: [
                { scale: Animated.multiply(breathScaleAnim, completePop) },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <LinearGradient
            colors={
              isFinished
                ? ['#DDD6FE', '#818CF8', '#6366F1']
                : isRubbing
                ? ['#EDE9FE', '#A5B4FC', '#818CF8']
                : ['#F5F3FF', '#DDD6FE', '#C4B5FD']
            }
            style={styles.orbGradient}
          >
            {/* Breath phase icon */}
            <Text style={styles.breathArrow}>{breathIcon}</Text>
            <Text style={styles.orbProgressText}>{Math.round(rubProgress)}%</Text>
            <Text style={styles.orbSubtext}>
              {isFinished
                ? lang === 'th' ? 'สติกลับมา' : 'Grounded'
                : lang === 'th' ? 'ถูวนที่นี่' : 'Rub here'}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Breath phase card */}
      <View style={[styles.breathCard, isRubbing && styles.breathCardActive]}>
        <Wind size={14} color={isRubbing ? colors.primary : colors.textMuted} />
        <Text style={[styles.breathLabel, isRubbing && { color: colors.primaryDark }]}>
          {breathLabel()}
        </Text>
        {/* Mini progress bar */}
        <View style={styles.miniProgressBg}>
          <Animated.View
            style={[
              styles.miniProgressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>

      {/* Action button */}
      <View style={styles.actionSection}>
        <MarshmallowButton
          variant={isFinished ? 'mint' : 'secondary'}
          size="lg"
          onPress={() => advanceProgress(10)}
          disabled={isFinished}
          icon={
            isFinished ? (
              <CheckCircle size={18} color="#004D40" />
            ) : (
              <Sparkles size={18} color="#FFFFFF" />
            )
          }
          title={
            isFinished
              ? lang === 'th'
                ? 'เหนี่ยวสติสำเร็จแล้ว!'
                : 'Grounding Complete!'
              : lang === 'th'
              ? `แตะเพื่อรับจังหวะ Haptic (+10%)`
              : `Tap for Haptic Pulse (+10%)`
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
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    gap: 6,
    ...shadows.card,
  },
  topBadgeText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: '#4C1D95',
  },
  mascotWrapper: {
    alignItems: 'center',
  },

  // ── Pad Section ──────────────────────────────────────────────────────
  padSection: {
    width: 214,
    height: 214,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 2,
  },
  progressRingOuter: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 3.5,
    borderColor: 'rgba(196, 181, 253, 0.18)',
  },
  progressRingFill: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 3.5,
    borderColor: '#818CF8',
  },
  orbitRing: {
    position: 'absolute',
    width: 214,
    height: 214,
    borderRadius: 107,
  },
  orbitStar: {
    position: 'absolute',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathHalo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#818CF8',
  },
  rubGlow: {
    position: 'absolute',
    width: 155,
    height: 155,
    borderRadius: 77.5,
    backgroundColor: '#A5B4FC',
  },
  orb: {
    width: 138,
    height: 138,
    borderRadius: 69,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 69,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  breathArrow: {
    fontSize: 22,
    color: '#4C1D95',
    fontWeight: '900',
    lineHeight: 28,
  },
  orbProgressText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 22,
    color: '#4C1D95',
    lineHeight: 26,
  },
  orbSubtext: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10,
    color: '#6D28D9',
    textAlign: 'center',
  },

  // ── Breath card ──────────────────────────────────────────────────────
  breathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: '#C4B5FD',
    gap: 8,
    width: '100%',
  },
  breathCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F5F3FF',
  },
  breathLabel: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  miniProgressBg: {
    width: 48,
    height: 5,
    backgroundColor: '#E0E7FF',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#818CF8',
    borderRadius: 2.5,
  },
  actionSection: {
    width: '100%',
    marginTop: 4,
  },
});
