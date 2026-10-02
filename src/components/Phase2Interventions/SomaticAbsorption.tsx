import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import {
  Sparkles, CheckCircle, Wind, Star, Hand, Heart,
  Eye, Ear, Zap, ArrowRight,
} from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';

interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

const { width: SCREEN_W } = Dimensions.get('window');

// ── Breath cycle: 4s inhale → 2s hold → 6s exhale ──────────────────
const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

// ── 5-sense body scan checkpoints ───────────────────────────────────
const BODY_SCAN_TH = ['5 สิ่งที่มองเห็น', '4 สิ่งที่สัมผัส', '3 เสียงที่ได้ยิน', '2 กลิ่นที่รู้สึก', '1 รสที่รับรู้'];
const BODY_SCAN_EN = ['5 things you see', '4 things you touch', '3 sounds you hear', '2 scents you sense', '1 taste you notice'];
const BODY_SCAN_ICONS = [Eye, Hand, Ear, Wind, Sparkles];

type BreathPhase = 'inhale' | 'hold' | 'exhale';
type ActivityStage = 'rub' | 'bodyscan' | 'final';

// ────────────────────────────────────────────────────────────────────
export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
}) => {
  // ── Stage / progress ─────────────────────────────────────────────
  const [stage, setStage] = useState<ActivityStage>('rub');
  const [rubProgress, setRubProgress] = useState(0);
  const [scanStep, setScanStep] = useState(0);     // 0-4 for body scan
  const [finalProgress, setFinalProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);

  // ── Animated values ──────────────────────────────────────────────
  const breathScaleAnim = useRef(new Animated.Value(0.72)).current;
  const breathOpacityAnim = useRef(new Animated.Value(0.7)).current;
  const orbitRotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rubGlowAnim = useRef(new Animated.Value(0)).current;
  const completePop = useRef(new Animated.Value(1)).current;
  const stageSlideAnim = useRef(new Animated.Value(0)).current;
  const scanCheckAnim = useRef(new Animated.Value(1)).current;
  const finalOrbAnim = useRef(new Animated.Value(0.8)).current;

  const lastHapticTick = useRef(0);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const breathCycleStart = useRef(Date.now());
  const lastPos = useRef({ x: 0, y: 0 });

  // ── Breath engine ────────────────────────────────────────────────
  const advanceBreathCycle = useCallback(() => {
    const elapsed = (Date.now() - breathCycleStart.current) % CYCLE_MS;
    let phase: BreathPhase;
    let targetScale: number;
    let targetOpacity: number;
    let duration: number;

    if (elapsed < INHALE_MS) {
      phase = 'inhale'; targetScale = 1.0; targetOpacity = 1; duration = INHALE_MS - elapsed;
    } else if (elapsed < INHALE_MS + HOLD_MS) {
      phase = 'hold'; targetScale = 1.0; targetOpacity = 1; duration = INHALE_MS + HOLD_MS - elapsed;
    } else {
      phase = 'exhale'; targetScale = 0.72; targetOpacity = 0.7; duration = CYCLE_MS - elapsed;
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
        toValue: targetScale, duration,
        easing: Easing.inOut(Easing.sin), useNativeDriver: true,
      }),
      Animated.timing(breathOpacityAnim, {
        toValue: targetOpacity, duration,
        easing: Easing.inOut(Easing.sin), useNativeDriver: true,
      }),
    ]).start();
  }, [breathScaleAnim, breathOpacityAnim]);

  useEffect(() => {
    breathCycleStart.current = Date.now();
    advanceBreathCycle();
    breathTimerRef.current = setInterval(() => {
      advanceBreathCycle();
      setCycleCount(Math.floor((Date.now() - breathCycleStart.current) / CYCLE_MS));
    }, 800);
    return () => { if (breathTimerRef.current) clearInterval(breathTimerRef.current); };
  }, [advanceBreathCycle]);

  // ── Orbit ring spin ──────────────────────────────────────────────
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(orbitRotateAnim, {
        toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [orbitRotateAnim]);

  // ── Final orb pulse loop ─────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'final') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(finalOrbAnim, { toValue: 1.08, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(finalOrbAnim, { toValue: 0.88, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [stage, finalOrbAnim]);

  // ── Stage transition animation ───────────────────────────────────
  const transitionToStage = (next: ActivityStage) => {
    Animated.sequence([
      Animated.timing(stageSlideAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(stageSlideAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]).start(() => setStage(next));
    audioService.triggerHaptic('success');
  };

  // ── Progress / rub ───────────────────────────────────────────────
  const animateProgressTo = (value: number) => {
    Animated.timing(progressAnim, {
      toValue: value / 100, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: false,
    }).start();
  };

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

  const advanceRubProgress = (amount = 4) => {
    if (stage !== 'rub') return;
    setRubProgress((prev) => {
      const next = Math.min(100, prev + amount);
      animateProgressTo(next);
      const now = Date.now();
      if (now - lastHapticTick.current > 120) {
        lastHapticTick.current = now;
        audioService.playFrictionTick(next / 100);
      }
      if (next >= 100) {
        setTimeout(() => transitionToStage('bodyscan'), 600);
      }
      return next;
    });
  };

  const advanceFinalProgress = (amount = 12) => {
    if (stage !== 'final') return;
    setFinalProgress((prev) => {
      const next = Math.min(100, prev + amount);
      animateProgressTo(next);
      const now = Date.now();
      if (now - lastHapticTick.current > 120) {
        lastHapticTick.current = now;
        audioService.playFrictionTick(next / 100);
      }
      if (next >= 100 && !isFinished) {
        setIsFinished(true);
        audioService.playChimeShockwave();
        Animated.spring(completePop, { toValue: 1.2, friction: 3, tension: 180, useNativeDriver: true })
          .start(() => Animated.spring(completePop, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start());
        setTimeout(() => onComplete(), 2200);
      }
      return next;
    });
  };

  // ── Body scan step tap ───────────────────────────────────────────
  const handleScanTap = (idx: number) => {
    if (idx !== scanStep) return;
    audioService.triggerHaptic('medium');
    Animated.sequence([
      Animated.timing(scanCheckAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.spring(scanCheckAnim, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
    const next = scanStep + 1;
    if (next >= 5) {
      setTimeout(() => {
        animateProgressTo(0);
        setFinalProgress(0);
        transitionToStage('final');
      }, 500);
    } else {
      setScanStep(next);
    }
  };

  // ── PanResponder ─────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        setIsRubbing(true);
        startRubGlow();
        const { locationX, locationY } = evt.nativeEvent;
        lastPos.current = { x: locationX, y: locationY };
        if (stage === 'rub') advanceRubProgress(2.5);
        if (stage === 'final') advanceFinalProgress(4);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        const dx = locationX - lastPos.current.x;
        const dy = locationY - lastPos.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 5) {
          lastPos.current = { x: locationX, y: locationY };
          const contribution = Math.min(5, dist * 0.22);
          if (stage === 'rub') advanceRubProgress(contribution);
          if (stage === 'final') advanceFinalProgress(contribution * 0.8);
        }
        const velocity = Math.sqrt(gestureState.vx ** 2 + gestureState.vy ** 2);
        if (velocity > 0.8) {
          if (stage === 'rub') advanceRubProgress(1.2);
          if (stage === 'final') advanceFinalProgress(1.0);
        }
      },
      onPanResponderRelease: () => { setIsRubbing(false); stopRubGlow(); },
      onPanResponderTerminate: () => { setIsRubbing(false); stopRubGlow(); },
    })
  ).current;

  // ── Interpolations ───────────────────────────────────────────────
  const orbitRotate = orbitRotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressBorderColor = progressAnim.interpolate({
    inputRange: [0, 0.5, 1], outputRange: ['#A5B4FC', '#818CF8', '#6366F1'],
  });
  const rubGlowOpacity = rubGlowAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.45] });
  const slideOpacity = stageSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  // ── Breath label ─────────────────────────────────────────────────
  const breathLabel = () => {
    if (isFinished) return lang === 'th' ? 'สติกลับมาแล้ว' : 'Grounded';
    switch (breathPhase) {
      case 'inhale': return lang === 'th' ? '↑ สูดเข้า 4 วิ' : '↑ Inhale 4s';
      case 'hold':   return lang === 'th' ? '◆ กลั้น 2 วิ' : '◆ Hold 2s';
      case 'exhale': return lang === 'th' ? '↓ ผ่อนออก 6 วิ' : '↓ Exhale 6s';
    }
  };

  // ── Overall % for step indicator ─────────────────────────────────
  const overallPct = stage === 'rub'
    ? Math.round(rubProgress / 3)
    : stage === 'bodyscan'
    ? Math.round(33 + (scanStep / 5) * 34)
    : Math.round(67 + (finalProgress / 3));

  // ── Mooca bubble text ─────────────────────────────────────────────
  const getMoocaBubble = () => {
    if (isFinished) return lang === 'th' ? 'สติกลับสู่ร่างกายแล้ว สงบดีมากนะ' : 'Fully grounded. Well done.';
    if (stage === 'rub') {
      if (isRubbing) return lang === 'th' ? 'รู้สึกการสั่นไหม? ถูวนต่อเลย' : 'Feel the haptic? Keep going!';
      return breathPhase === 'inhale'
        ? lang === 'th' ? 'สูดเข้าช้าๆ แล้วถูวงกลมตามลมหายใจ' : 'Inhale... rub the circle with your breath'
        : breathPhase === 'hold'
        ? lang === 'th' ? 'กลั้นไว้... นิ้วยังอยู่บนจอ' : 'Hold... fingers on the orb'
        : lang === 'th' ? 'ผ่อนออกยาวๆ รู้สึกการสั่นตามจังหวะ' : 'Exhale slowly... follow the vibration';
    }
    if (stage === 'bodyscan') {
      const items = lang === 'th' ? BODY_SCAN_TH : BODY_SCAN_EN;
      return lang === 'th'
        ? `แตะหัวข้อนี้เมื่อนึกออกแล้ว: ${items[scanStep]}`
        : `Tap when you've noticed: ${items[scanStep]}`;
    }
    // final
    if (isRubbing) return lang === 'th' ? 'ดีมากเลย! ถูวนต่ออีกนิด' : 'Almost there! Keep rubbing';
    return lang === 'th' ? 'ถูวงกลมอีกครั้ง ปิดผนึกความสงบ' : 'Rub once more to seal your calm';
  };

  // ── RENDER ────────────────────────────────────────────────────────
  return (
    <Animated.View style={[styles.container, { opacity: slideOpacity }]}>

      {/* Step indicator + overall % */}
      <View style={styles.stepRow}>
        {(['rub', 'bodyscan', 'final'] as ActivityStage[]).map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, stage === s && styles.stepDotActive,
              (stage === 'bodyscan' && i === 0 || stage === 'final' && i <= 1) && styles.stepDotDone]}>
              {(stage === 'bodyscan' && i === 0 || stage === 'final' && i <= 1) && (
                <CheckCircle size={10} color="#FFFFFF" />
              )}
            </View>
            {i < 2 && <View style={[styles.stepLine, (stage === 'final' && i === 0 || stage !== 'rub' && i === 0) && styles.stepLineDone]} />}
          </View>
        ))}
        <Text style={styles.overallPct}>{overallPct}%</Text>
      </View>

      {/* Mooca Mascot */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : isRubbing ? 'rubbing' : 'comforting'}
          size="sm"
          speakingBubble={getMoocaBubble()}
        />
      </View>

      {/* ── STAGE: RUB ─────────────────────────────────────────── */}
      {stage === 'rub' && (
        <View style={styles.padSection}>
          {/* Progress ring */}
          <View style={styles.progressRingOuter}>
            <Animated.View style={[styles.progressRingFill, {
              borderColor: progressBorderColor,
              opacity: progressAnim.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 1, 1] }),
              transform: [{ scale: progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
            }]} />
          </View>

          {/* Orbit ring */}
          <Animated.View style={[styles.orbitRing, { transform: [{ rotate: orbitRotate }] }]} pointerEvents="none">
            {[0, 90, 180, 270].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r = 94;
              return (
                <View key={i} style={[styles.orbitStar, {
                  left: 100 + Math.cos(rad) * r - 8,
                  top: 100 + Math.sin(rad) * r - 8,
                  opacity: 0.55 + i * 0.1,
                }]}>
                  {i % 2 === 0
                    ? <Sparkles size={13} color="#A5B4FC" />
                    : <Star size={10} color="#C4B5FD" fill="#C4B5FD" />}
                </View>
              );
            })}
          </Animated.View>

          {/* Breath halo */}
          <Animated.View style={[styles.breathHalo, {
            opacity: breathOpacityAnim.interpolate({ inputRange: [0.7, 1], outputRange: [0.1, 0.24] }),
            transform: [{ scale: breathScaleAnim }],
          }]} pointerEvents="none" />

          {/* Rub glow */}
          <Animated.View style={[styles.rubGlow, { opacity: rubGlowOpacity }]} pointerEvents="none" />

          {/* Touch orb */}
          <Animated.View style={[styles.orb, { transform: [{ scale: breathScaleAnim }] }]} {...panResponder.panHandlers}>
            <LinearGradient
              colors={isRubbing ? ['#EDE9FE', '#A5B4FC', '#818CF8'] : ['#F5F3FF', '#DDD6FE', '#C4B5FD']}
              style={styles.orbGradient}
            >
              <Text style={styles.breathArrowText}>{breathPhase === 'inhale' ? '↑' : breathPhase === 'hold' ? '◆' : '↓'}</Text>
              <Text style={styles.orbProgressText}>{Math.round(rubProgress)}%</Text>
              <Text style={styles.orbSubtext}>{lang === 'th' ? 'ถูวนที่นี่' : 'Rub here'}</Text>
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* ── STAGE: BODY SCAN ───────────────────────────────────── */}
      {stage === 'bodyscan' && (
        <View style={styles.bodyScanSection}>
          <Text style={styles.bodyScanTitle}>
            {lang === 'th' ? '5-4-3-2-1 สแกนร่างกาย' : '5-4-3-2-1 Body Scan'}
          </Text>
          <Text style={styles.bodyScanSub}>
            {lang === 'th' ? 'แตะหัวข้อเพื่อยืนยันแต่ละข้อ' : 'Tap each item as you notice it'}
          </Text>
          <View style={styles.scanGrid}>
            {(lang === 'th' ? BODY_SCAN_TH : BODY_SCAN_EN).map((label, idx) => {
              const IconComp = BODY_SCAN_ICONS[idx];
              const isDone = idx < scanStep;
              const isCurrent = idx === scanStep;
              return (
                <Animated.View
                  key={idx}
                  style={[{ transform: [{ scale: isCurrent ? scanCheckAnim : 1 }] }]}
                >
                  <TouchableOpacity
                    onPress={() => handleScanTap(idx)}
                    activeOpacity={0.75}
                    style={[
                      styles.scanItem,
                      isDone && styles.scanItemDone,
                      isCurrent && styles.scanItemCurrent,
                      !isCurrent && !isDone && styles.scanItemLocked,
                    ]}
                  >
                    <IconComp
                      size={18}
                      color={isDone ? '#FFFFFF' : isCurrent ? '#4C1D95' : '#94A3B8'}
                      strokeWidth={2.2}
                    />
                    <Text style={[
                      styles.scanLabel,
                      isDone && styles.scanLabelDone,
                      isCurrent && styles.scanLabelCurrent,
                    ]}>
                      {label}
                    </Text>
                    {isDone && <CheckCircle size={14} color="#FFFFFF" />}
                    {isCurrent && <ArrowRight size={13} color="#6D28D9" />}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>
      )}

      {/* ── STAGE: FINAL RUB ──────────────────────────────────── */}
      {stage === 'final' && (
        <View style={styles.padSection}>
          {/* Progress ring */}
          <View style={styles.progressRingOuter}>
            <Animated.View style={[styles.progressRingFill, {
              borderColor: isFinished ? '#4ADE80' : progressBorderColor,
              opacity: progressAnim.interpolate({ inputRange: [0, 0.01, 1], outputRange: [0, 1, 1] }),
              transform: [{ scale: progressAnim.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] }) }],
            }]} />
          </View>

          {/* Orbit ring (faster when near finish) */}
          <Animated.View style={[styles.orbitRing, { transform: [{ rotate: orbitRotate }] }]} pointerEvents="none">
            {[0, 72, 144, 216, 288].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const r = 94;
              return (
                <View key={i} style={[styles.orbitStar, {
                  left: 100 + Math.cos(rad) * r - 8,
                  top: 100 + Math.sin(rad) * r - 8,
                }]}>
                  {i % 2 === 0
                    ? <Sparkles size={13} color={isFinished ? '#FDE047' : '#A5B4FC'} />
                    : <Star size={10} color={isFinished ? '#FDE047' : '#C4B5FD'} fill={isFinished ? '#FDE047' : '#C4B5FD'} />}
                </View>
              );
            })}
          </Animated.View>

          {/* Breath halo */}
          <Animated.View style={[styles.breathHalo, {
            opacity: breathOpacityAnim.interpolate({ inputRange: [0.7, 1], outputRange: [0.1, 0.24] }),
            transform: [{ scale: breathScaleAnim }],
            backgroundColor: isFinished ? '#86EFAC' : '#818CF8',
          }]} pointerEvents="none" />

          {/* Rub glow */}
          <Animated.View style={[styles.rubGlow, { opacity: rubGlowOpacity, backgroundColor: isFinished ? '#4ADE80' : '#A5B4FC' }]} pointerEvents="none" />

          {/* Final touch orb */}
          <Animated.View
            style={[styles.orb, {
              transform: [
                { scale: Animated.multiply(finalOrbAnim, completePop) },
              ],
            }]}
            {...(!isFinished ? panResponder.panHandlers : {})}
          >
            <LinearGradient
              colors={
                isFinished
                  ? ['#D1FAE5', '#6EE7B7', '#10B981']
                  : isRubbing
                  ? ['#EDE9FE', '#A5B4FC', '#818CF8']
                  : ['#F5F3FF', '#DDD6FE', '#C4B5FD']
              }
              style={styles.orbGradient}
            >
              {isFinished
                ? <CheckCircle size={36} color="#FFFFFF" />
                : <>
                    <Heart size={22} color="#6D28D9" />
                    <Text style={styles.orbProgressText}>{Math.round(finalProgress)}%</Text>
                    <Text style={styles.orbSubtext}>{lang === 'th' ? 'ปิดผนึก' : 'Seal it'}</Text>
                  </>
              }
            </LinearGradient>
          </Animated.View>
        </View>
      )}

      {/* Breath phase card (always visible) */}
      <View style={[styles.breathCard, isRubbing && stage !== 'bodyscan' && styles.breathCardActive]}>
        <Wind size={13} color={isRubbing ? colors.primary : colors.textMuted} />
        <Text style={[styles.breathLabel, isRubbing && { color: colors.primaryDark }]}>
          {breathLabel()}
        </Text>
        {/* Mini progress bar */}
        <View style={styles.miniProgressBg}>
          <Animated.View style={[styles.miniProgressFill, {
            width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            backgroundColor: isFinished ? '#10B981' : '#818CF8',
          }]} />
        </View>
      </View>

      {/* Action button */}
      <View style={styles.actionSection}>
        {stage === 'bodyscan' ? (
          <MarshmallowButton
            variant="outline"
            size="lg"
            onPress={() => {
              // Allow skipping current scan step
              handleScanTap(scanStep);
            }}
            icon={<ArrowRight size={18} color={colors.primary} />}
            title={lang === 'th' ? `แตะที่รายการข้างบน หรือข้ามขั้นนี้ (${scanStep + 1}/5)` : `Tap item above, or skip (${scanStep + 1}/5)`}
          />
        ) : (
          <MarshmallowButton
            variant={isFinished ? 'mint' : 'secondary'}
            size="lg"
            onPress={() => {
              if (stage === 'rub') advanceRubProgress(10);
              else if (stage === 'final') advanceFinalProgress(12);
            }}
            disabled={isFinished}
            icon={isFinished ? <CheckCircle size={18} color="#004D40" /> : <Sparkles size={18} color="#FFFFFF" />}
            title={
              isFinished
                ? lang === 'th' ? 'เหนี่ยวสติสำเร็จแล้ว!' : 'Grounding Complete!'
                : stage === 'rub'
                ? lang === 'th' ? `แตะรับ Haptic Pulse (+10%) • รอบ ${cycleCount + 1}` : `Haptic Pulse (+10%) • Cycle ${cycleCount + 1}`
                : lang === 'th' ? 'แตะเพื่อปิดผนึกความสงบ (+12%)' : 'Seal your calm (+12%)'
            }
          />
        )}
      </View>
    </Animated.View>
  );
};

// ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ── Step indicator ───────────────────────────────────────────────
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#E0E7FF',
    borderWidth: 2,
    borderColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#818CF8',
    borderColor: '#6366F1',
  },
  stepDotDone: {
    backgroundColor: '#10B981',
    borderColor: '#6EE7B7',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E7FF',
    borderRadius: 1,
  },
  stepLineDone: {
    backgroundColor: '#10B981',
  },
  overallPct: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: 4,
  },

  // ── Mascot ───────────────────────────────────────────────────────
  mascotWrapper: {
    alignItems: 'center',
  },

  // ── Pad (shared rub + final) ─────────────────────────────────────
  padSection: {
    width: 214,
    height: 214,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressRingOuter: {
    position: 'absolute',
    width: 210, height: 210, borderRadius: 105,
    borderWidth: 3.5, borderColor: 'rgba(196, 181, 253, 0.18)',
  },
  progressRingFill: {
    position: 'absolute',
    width: 210, height: 210, borderRadius: 105,
    borderWidth: 3.5, borderColor: '#818CF8',
  },
  orbitRing: {
    position: 'absolute',
    width: 214, height: 214, borderRadius: 107,
  },
  orbitStar: {
    position: 'absolute',
    width: 16, height: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  breathHalo: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#818CF8',
  },
  rubGlow: {
    position: 'absolute',
    width: 155, height: 155, borderRadius: 77.5,
    backgroundColor: '#A5B4FC',
  },
  orb: {
    width: 138, height: 138, borderRadius: 69,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 18, elevation: 10,
  },
  orbGradient: {
    flex: 1, borderRadius: 69,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  breathArrowText: {
    fontSize: 20, color: '#4C1D95', fontWeight: '900', lineHeight: 26,
  },
  orbProgressText: {
    fontFamily: typography.fontPromptBold, fontSize: 22, color: '#4C1D95', lineHeight: 26,
  },
  orbSubtext: {
    fontFamily: typography.fontPromptMedium, fontSize: 10, color: '#6D28D9', textAlign: 'center',
  },

  // ── Body scan ────────────────────────────────────────────────────
  bodyScanSection: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  bodyScanTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 14,
    color: '#4C1D95',
    textAlign: 'center',
    marginBottom: 2,
  },
  bodyScanSub: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 8,
  },
  scanGrid: {
    gap: 6,
    flex: 1,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.lg,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  scanItemCurrent: {
    backgroundColor: '#EDE9FE',
    borderColor: '#A5B4FC',
    ...shadows.soft,
  },
  scanItemDone: {
    backgroundColor: '#10B981',
    borderColor: '#6EE7B7',
  },
  scanItemLocked: {
    opacity: 0.45,
  },
  scanLabel: {
    flex: 1,
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  scanLabelCurrent: {
    color: '#4C1D95',
  },
  scanLabelDone: {
    color: '#FFFFFF',
  },

  // ── Breath card ──────────────────────────────────────────────────
  breathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1.5, borderColor: '#C4B5FD',
    gap: 8, width: '100%',
  },
  breathCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F5F3FF',
  },
  breathLabel: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11, color: colors.textMuted, flex: 1,
  },
  miniProgressBg: {
    width: 48, height: 5, backgroundColor: '#E0E7FF',
    borderRadius: 2.5, overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%', backgroundColor: '#818CF8', borderRadius: 2.5,
  },

  // ── Action ───────────────────────────────────────────────────────
  actionSection: {
    width: '100%', marginTop: 4,
  },
});
