import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { Sparkles, Flame, CheckCircle, Volume2, Sun, Star } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';

interface SomaticAbsorptionProps {
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const SomaticAbsorption: React.FC<SomaticAbsorptionProps> = ({
  onComplete,
  lang,
}) => {
  const [rubProgress, setRubProgress] = useState(0); // 0 to 100
  const [handTemp, setHandTemp] = useState(28.0); // cold 28.0 to warm 36.8
  const [isFinished, setIsFinished] = useState(false);
  const [isRubbing, setIsRubbing] = useState(false);

  const lastSoundTick = useRef(0);
  const stardustRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Stardust rotation animation loop
  useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(stardustRotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    rotateLoop.start();
    return () => rotateLoop.stop();
  }, [stardustRotateAnim]);

  // Breathing pulse for the Golden Sigil
  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  const playBlessingVoice = () => {
    const text =
      lang === 'th'
        ? 'ความรู้และแรงพยายามทั้งหมดที่คุณสะสมมา กำลังรวมอยู่ในมือคู่นี้แล้ว... สูดไออุ่นนี้ไว้ แล้วก้าวไปทำหน้าที่ของคุณนะ'
        : 'All the preparation and strength you have built are right here in your hands. Absorb this warmth and shine.';
    audioService.playVoiceSanctuary(text, lang, 0.84);
  };

  const advanceProgress = (amount = 4) => {
    if (isFinished) return;

    setRubProgress((prev) => {
      const next = Math.min(100, prev + amount);
      // Cold 28.0°C up to optimal 36.8°C
      const newTemp = +(28.0 + (next / 100) * 8.8).toFixed(1);
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
        advanceProgress(2.5);
      },
      onPanResponderMove: (_evt, gestureState) => {
        const movement = Math.abs(gestureState.dx) + Math.abs(gestureState.dy);
        if (movement > 6) {
          advanceProgress(3);
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

  const rotateInterpolation = stardustRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* Top Blessing Whisper Trigger */}
      <TouchableOpacity
        onPress={playBlessingVoice}
        activeOpacity={0.8}
        style={styles.voiceBadge}
      >
        <Volume2 size={13} color={colors.primary} />
        <Text style={styles.voiceBadgeText}>
          {lang === 'th' ? 'แตะฟังเสียงกระซิบอวยพรจาก Mooca' : 'Listen to Mooca Blessing'}
        </Text>
      </TouchableOpacity>

      {/* Mascot View */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={isFinished ? 'celebrating' : isRubbing ? 'rubbing' : 'comforting'}
          size="sm"
          speakingBubble={
            isFinished
              ? lang === 'th'
                ? 'ฝ่ามืออุ่นครบ 36.8°C แล้ว! พลังใจพร้อมลุยแล้วนะ'
                : 'Fingertips are 36.8°C warm and ready!'
              : lang === 'th'
              ? 'ใช้นิ้วถูวนที่ดวงแก้วทองคำ เพื่อเพิ่มความอบอุ่นสู่ปลายนิ้ว'
              : 'Rub the Golden Stardust Sigil to generate warmth'
          }
        />
      </View>

      {/* Fingertip Warmth Gauge Card */}
      <View style={styles.gaugeCard}>
        <View style={styles.gaugeHeaderRow}>
          <View style={styles.tempBadge}>
            <Flame size={14} color="#EA580C" />
            <Text style={styles.tempLabel}>
              {lang === 'th' ? 'เกจวัดความอบอุ่นปลายนิ้ว:' : 'Fingertip Warmth:'}
            </Text>
            <Text style={styles.tempValue}>{handTemp}°C</Text>
          </View>

          <View style={styles.statusBadge}>
            <Sun size={13} color={handTemp >= 36.8 ? '#15803D' : '#D97706'} />
            <Text style={[styles.statusText, handTemp >= 36.8 && { color: '#15803D' }]}>
              {handTemp < 30
                ? lang === 'th'
                  ? 'มือเย็นเฉียบ'
                  : 'Freezing Cold'
                : handTemp < 34
                ? lang === 'th'
                  ? 'กำลังอุ่นขึ้น'
                  : 'Warming Up'
                : lang === 'th'
                ? 'อบอุ่นพร้อมลุย'
                : 'Optimally Warm'}
            </Text>
          </View>
        </View>

        {/* Temperature Progress Track */}
        <View style={styles.trackBg}>
          <LinearGradient
            colors={['#38BDF8', '#FBBF24', '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.trackFill, { width: `${rubProgress}%` }]}
          />
        </View>
      </View>

      {/* Golden Stardust Sigil Surface Pad */}
      <View {...panResponder.panHandlers} style={styles.sigilArea}>
        {/* Animated Stardust Orbit Ring (NO EMOJI - ALWAYS ICONS) */}
        <Animated.View
          style={[
            styles.stardustOrbit,
            { transform: [{ rotate: rotateInterpolation }] },
          ]}
        >
          <View style={[styles.starParticle, { top: 0, left: '50%', marginLeft: -7 }]}>
            <Sparkles size={14} color="#FDE047" fill="#FDE047" />
          </View>
          <View style={[styles.starParticle, { bottom: 0, left: '50%', marginLeft: -6 }]}>
            <Star size={12} color="#FDE047" fill="#FDE047" />
          </View>
          <View style={[styles.starParticle, { left: 0, top: '50%', marginTop: -6 }]}>
            <Sparkles size={12} color="#FDE047" />
          </View>
          <View style={[styles.starParticle, { right: 0, top: '50%', marginTop: -6 }]}>
            <Star size={11} color="#FDE047" fill="#FDE047" />
          </View>
        </Animated.View>

        {/* Central Glowing Sigil Orb */}
        <Animated.View
          style={[
            styles.sigilOrbContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <LinearGradient
            colors={
              isFinished
                ? ['#FEF08A', '#F59E0B', '#B45309']
                : isRubbing
                ? ['#FFFBEB', '#FDE68A', '#F59E0B']
                : ['#FFFDF9', '#FEF3C7', '#FCD34D']
            }
            style={styles.sigilOrb}
          >
            {/* Inner Sacred Star Emblem */}
            <View style={styles.sigilInner}>
              <Sparkles
                size={38}
                color={isFinished ? '#78350F' : '#D97706'}
              />
              <Text style={styles.sigilTitle}>
                {isFinished
                  ? lang === 'th'
                    ? 'พลังใจเต็มเปี่ยม!'
                    : 'Sigil Absorbed!'
                  : lang === 'th'
                  ? 'ดวงแก้วละอองดาวสีทอง'
                  : 'Golden Stardust Sigil'}
              </Text>
              <Text style={styles.sigilSubtitle}>
                {isFinished
                  ? lang === 'th'
                    ? '36.8°C อบอุ่นพร้อมก้าวต่อ'
                    : '36.8°C Warmth Secured'
                  : lang === 'th'
                  ? 'ใช้นิ้วถูวนเพื่อรับพลังใจ'
                  : 'Rub in circles to warm hands'}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Tactile Marshmallow Tap Action */}
      <View style={styles.actionSection}>
        <MarshmallowButton
          variant={isFinished ? 'mint' : 'secondary'}
          size="lg"
          onPress={() => advanceProgress(8)}
          disabled={isFinished}
          icon={
            isFinished ? (
              <CheckCircle size={18} color="#004D40" />
            ) : (
              <Flame size={18} color="#FFFFFF" />
            )
          }
          title={
            isFinished
              ? lang === 'th'
                ? 'ดูดซับพลังใจสำเร็จแล้ว!'
                : 'Warmth Fully Absorbed!'
              : lang === 'th'
              ? 'แตะดวงแก้วเพื่อเพิ่มไออุ่น (+8%)'
              : 'Tap to Add Warmth (+8%)'
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
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 2,
  },
  gaugeCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    ...shadows.soft,
  },
  gaugeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tempBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tempLabel: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: '#9A3412',
  },
  tempValue: {
    fontFamily: typography.fontPromptBold,
    fontSize: 14,
    color: '#EA580C',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 4,
  },
  statusText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: '#D97706',
  },
  trackBg: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  sigilArea: {
    width: 200,
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  stardustOrbit: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starParticle: {
    position: 'absolute',
  },
  sigilOrbContainer: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  sigilOrb: {
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  sigilInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigilTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: '#78350F',
    textAlign: 'center',
    marginTop: 4,
  },
  sigilSubtitle: {
    fontFamily: typography.fontPromptRegular,
    fontSize: 9,
    color: '#92400E',
    textAlign: 'center',
    marginTop: 2,
  },
  actionSection: {
    width: '100%',
    marginTop: 4,
  },
});
