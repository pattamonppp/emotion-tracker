import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { Zap, Activity, CheckCircle2, RotateCw } from 'lucide-react-native';
import { colors, radii, shadows } from '../../design-system/tokens';

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
  const lastShakeTime = useRef(0);

  // Shake animation value
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShakeVisual = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  // Accelerometer subscription via expo-sensors
  useEffect(() => {
    let subscription: { remove: () => void } | null = null;
    try {
      Accelerometer.setUpdateInterval(100);
      subscription = Accelerometer.addListener(({ x, y, z }) => {
        const total = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();
        // G-force threshold: > 1.8 indicates physical shaking
        if (total > 1.8 && now - lastShakeTime.current > 250) {
          lastShakeTime.current = now;
          handleCycle();
        }
      });
    } catch {
      // Simulator or sensors disabled
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
    }, 1200);
  };

  const currentCount = mode === 'shake' ? shakesLeft : bouncesLeft;
  const maxCount = mode === 'shake' ? 15 : 10;
  const progressPercent = Math.round(((maxCount - currentCount) / maxCount) * 100);

  return (
    <View style={styles.container}>
      {/* Mode Switcher */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('selection');
            setMode('shake');
          }}
          style={[styles.modeTab, mode === 'shake' && styles.modeTabActive]}
        >
          <Zap size={14} color={mode === 'shake' ? '#FFFFFF' : colors.primaryDark} />
          <Text style={[styles.modeTabText, mode === 'shake' && styles.modeTabTextActive]}>
            {lang === 'th' ? 'เขย่าสะบัดมือ (Shake)' : 'Hand Shake'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('selection');
            setMode('bounce');
          }}
          style={[styles.modeTab, mode === 'bounce' && styles.modeTabActive]}
        >
          <Activity size={14} color={mode === 'bounce' ? '#FFFFFF' : colors.primaryDark} />
          <Text style={[styles.modeTabText, mode === 'bounce' && styles.modeTabTextActive]}>
            {lang === 'th' ? 'ย่ำเท้าอยู่กับที่ (Bounce)' : 'Heel Bounce'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Mascot Display with Shake Animation */}
      <Animated.View
        style={[
          styles.mascotWrapper,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <MoocaMascot
          mood={isFinished ? 'celebrating' : 'shaking'}
          size="lg"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'ยอดเยี่ยมมาก! ความตึงเครียดสลายตัวแล้ว'
                : 'Awesome! Tension successfully discharged!'
              : lang === 'th'
              ? `เขย่ามือถือหรือแตะปุ่มอีก ${currentCount} ครั้ง!`
              : `Shake device or tap ${currentCount} more times!`
          }
        />
      </Animated.View>

      {/* Circular Progress & Counter */}
      <View style={styles.counterCard}>
        <Text style={styles.counterTitle}>
          {mode === 'shake'
            ? lang === 'th'
              ? 'สลัดอะดรีนาลีนส่วนเกินออกจากแขน'
              : 'Discharging Excess Adrenaline'
            : lang === 'th'
            ? 'ทิ้งน้ำหนักลงส้นเท้าเพื่อ Grounding'
            : 'Heel Drops to Ground Nervous System'}
        </Text>

        <View style={styles.counterBadge}>
          <Text style={styles.counterNumber}>{currentCount}</Text>
          <Text style={styles.counterUnit}>{lang === 'th' ? 'ครั้ง' : 'left'}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressPercentText}>{progressPercent}% Discharged</Text>
      </View>

      {/* Manual Action Button for simulator or physical interaction */}
      <View style={styles.actionSection}>
        <Button
          variant="amber"
          size="lg"
          fullWidth
          onPress={handleCycle}
          disabled={isFinished}
          icon={isFinished ? <CheckCircle2 size={18} color="#FFFFFF" /> : <RotateCw size={18} color="#FFFFFF" />}
        >
          {isFinished
            ? lang === 'th'
              ? 'ปลดปล่อยสำเร็จ!'
              : 'Complete!'
            : lang === 'th'
            ? 'แตะตรงนี้เพื่อสลัดพลังงาน (Tap)'
            : 'Tap Here to Shake / Discharge'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.full,
    padding: 4,
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
    paddingVertical: 8,
    borderRadius: radii.full,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: colors.secondary,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  mascotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  counterCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    ...shadows.soft,
  },
  counterTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 4,
  },
  counterNumber: {
    fontSize: 44,
    fontWeight: '900',
    color: colors.secondary,
  },
  counterUnit: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 5,
  },
  progressPercentText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  actionSection: {
    width: '100%',
    marginTop: 8,
  },
});
