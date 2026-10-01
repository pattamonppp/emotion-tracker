import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { Sparkles, Flame, CheckCircle, Volume2 } from 'lucide-react-native';
import { colors, radii, shadows } from '../../design-system/tokens';

interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
}) => {
  const [rubProgress, setRubProgress] = useState(0); // 0 to 100
  const [handTemp, setHandTemp] = useState(28.4); // starts cold, warms to 36.6
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);

  const lastSoundTick = useRef(0);

  const playBlessingVoice = () => {
    const text = lang === 'th'
      ? 'ความรู้และแรงพยายามทั้งหมดที่คุณสะสมมา กำลังอยู่ในมือคู่นี้แล้ว... รับพลังนี้ไว้ แล้วก้าวเข้าไปทำหน้าที่ของคุณ'
      : 'All the knowledge and preparation you have built are right here in your hands. Absorb this certainty, and step forward.';
    audioService.playVoiceSanctuary(text, lang, 0.84);
  };

  const advanceProgress = (amount = 4) => {
    if (isFinished) return;

    setRubProgress((prev) => {
      const next = Math.min(100, prev + amount);
      const newTemp = +(28.4 + (next / 100) * 8.2).toFixed(1);
      setHandTemp(newTemp);

      const now = Date.now();
      if (now - lastSoundTick.current > 120) {
        lastSoundTick.current = now;
        audioService.playFrictionTick(next / 100);
      }

      if (next >= 100 && !isFinished) {
        setIsFinished(true);
        audioService.playChimeShockwave();
        playBlessingVoice();
        setTimeout(() => {
          onComplete();
        }, 3200);
      }
      return next;
    });
  };

  // Pan Responder for rubbing gesture on mobile screen
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsRubbing(true);
        advanceProgress(2);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const movement = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
        if (movement > 6) {
          advanceProgress(2.5);
        }
      },
      onPanResponderRelease: () => {
        setIsRubbing(false);
      },
      onPanResponderTerminate: () => {
        setIsRubbing(false);
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {/* Top Blessing Whisper Trigger */}
      <TouchableOpacity
        onPress={playBlessingVoice}
        style={styles.voiceBadge}
      >
        <Volume2 size={13} color={colors.primary} />
        <Text style={styles.voiceBadgeText}>
          {lang === 'th' ? 'แตะฟังเสียงอวยพรจาก Mooca' : 'Listen to Mooca Blessing'}
        </Text>
      </TouchableOpacity>

      {/* Mascot View */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : isRubbing ? 'rubbing' : 'praying'}
          size="md"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'ฝ่ามืออบอุ่นแล้ว! พลังความมั่นใจพร้อมแล้ว'
                : 'Your hands are warm and ready!'
              : lang === 'th'
              ? 'ถูกระจกหรือถูฝ่ามือของคุณเพื่อเพิ่มความอบอุ่น'
              : 'Rub the pad or rub your palms together!'
          }
        />
      </View>

      {/* Warmth & Temperature Card */}
      <View style={styles.tempRow}>
        <View style={styles.tempBadge}>
          <Flame size={14} color="#EA580C" />
          <Text style={styles.tempLabel}>{lang === 'th' ? 'อุณหภูมิฝ่ามือ:' : 'Palm Temp:'}</Text>
          <Text style={styles.tempValue}>{handTemp}°C</Text>
        </View>

        <View style={styles.sigilBadge}>
          <Sparkles size={14} color="#F59E0B" />
          <Text style={styles.sigilText}>{Math.round(rubProgress)}% Warm</Text>
        </View>
      </View>

      {/* Interactive Rubbing Surface Pad */}
      <View
        {...panResponder.panHandlers}
        style={styles.padWrapper}
      >
        <LinearGradient
          colors={
            isFinished
              ? ['#FEF3C7', '#FDE68A', '#FCD34D']
              : isRubbing
              ? ['#FFEDD5', '#FED7AA', '#E0F2FE']
              : ['#FFFFFF', '#F8FAFC', '#E2E8F0']
          }
          style={styles.rubPad}
        >
          <View style={styles.padInner}>
            <Flame
              size={36}
              color={rubProgress > 60 ? '#EA580C' : colors.primary}
            />
            <Text style={styles.padActionPrompt}>
              {isFinished
                ? lang === 'th'
                  ? '✨ กักเก็บความมั่นใจเรียบร้อย!'
                  : '✨ Sigil of Certainty Absorbed!'
                : lang === 'th'
                ? 'ใช้นิ้วถูวนที่นี่ หรือถูมือจริง ๆ'
                : 'Rub in circles here to generate warmth'}
            </Text>
            <Text style={styles.padSubPrompt}>
              {lang === 'th'
                ? 'กระตุ้นการไหลเวียนเลือดกลับสู่มือที่สั่น'
                : 'Boosts circulation to cold trembling hands'}
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Tap Rub Helper Button */}
      <View style={styles.actionSection}>
        <Button
          variant={isFinished ? 'primary' : 'amber'}
          size="md"
          fullWidth
          onPress={() => advanceProgress(8)}
          disabled={isFinished}
          icon={isFinished ? <CheckCircle size={18} color="#FFFFFF" /> : <Flame size={18} color="#FFFFFF" />}
        >
          {isFinished
            ? lang === 'th'
              ? 'ดูดซับพลังความมั่นใจสำเร็จ!'
              : 'Completed!'
            : lang === 'th'
            ? 'แตะเพื่อเพิ่มความอุ่น (+8%)'
            : 'Tap to Rub Hands (+8%)'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voiceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 6,
    ...shadows.card,
  },
  voiceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  tempRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 6,
  },
  tempBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FDBA74',
    gap: 6,
  },
  tempLabel: {
    fontSize: 11,
    color: '#9A3412',
    fontWeight: '600',
  },
  tempValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#EA580C',
  },
  sigilBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: '#FDE047',
    gap: 6,
  },
  sigilText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  padWrapper: {
    width: '100%',
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.borderTeal,
    ...shadows.soft,
  },
  rubPad: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  padInner: {
    alignItems: 'center',
    gap: 6,
  },
  padActionPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 4,
  },
  padSubPrompt: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actionSection: {
    width: '100%',
    marginTop: 6,
  },
});
