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
import { MBTIType } from '../../types';
import { MBTI_SANCTUARY_SCRIPTS, getMBTIArchetype } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { Volume2, VolumeX, Sparkles, Check, Headphones, Moon, Star } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';

interface AudioMatrixSanctuaryProps {
  mbti: MBTIType;
  onComplete: () => void;
  lang: 'th' | 'en';
}

export const AudioMatrixSanctuary: React.FC<AudioMatrixSanctuaryProps> = ({
  mbti,
  onComplete,
  lang,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [countdown, setCountdown] = useState(25);
  const archetype = getMBTIArchetype(mbti);
  const script = MBTI_SANCTUARY_SCRIPTS[archetype];

  // Star twinkling animations
  const starTwinkleAnim = useRef(new Animated.Value(0.4)).current;
  const moonGlowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const twinkle = Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkleAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starTwinkleAnim, {
          toValue: 0.35,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    twinkle.start();

    const moonPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(moonGlowAnim, {
          toValue: 1.08,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(moonGlowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    moonPulse.start();

    return () => {
      twinkle.stop();
      moonPulse.stop();
    };
  }, [starTwinkleAnim, moonGlowAnim]);

  useEffect(() => {
    audioService.startNeuralEntrainment('both');
    playSanctuaryVoice();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      audioService.stopAllVoice();
    };
  }, [mbti, lang]);

  const playSanctuaryVoice = () => {
    const text = lang === 'th' ? script.th : script.en;
    audioService.playVoiceSanctuary(text, lang, 0.86);
    setIsPlaying(true);
  };

  const toggleSound = () => {
    if (isPlaying) {
      audioService.stopAllVoice();
      setIsPlaying(false);
    } else {
      audioService.startNeuralEntrainment('both');
      playSanctuaryVoice();
    }
  };

  return (
    <View style={styles.container}>
      {/* MBTI Acoustic Profile Badge */}
      <View style={styles.badgeRow}>
        <View style={styles.mbtiBadge}>
          <Headphones size={13} color={colors.primary} />
          <Text style={styles.mbtiBadgeText}>
            MBTI {mbti} • {archetype.toUpperCase()} ARCHETYPE
          </Text>
        </View>

        <TouchableOpacity
          onPress={toggleSound}
          activeOpacity={0.8}
          style={styles.soundToggle}
        >
          {isPlaying ? (
            <Volume2 size={16} color={colors.primary} />
          ) : (
            <VolumeX size={16} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>

      {/* Cozy Night Sky with Crescent Moon & Twinkling Stars */}
      <LinearGradient
        colors={['#1E293B', '#0F172A', '#1E293B']}
        style={styles.nightSkyCard}
      >
        {/* Glowing Crescent Moon */}
        <Animated.View
          style={[
            styles.moonWrapper,
            { transform: [{ scale: moonGlowAnim }] },
          ]}
        >
          <Moon size={32} color="#FDE047" fill="#FDE047" />
          <View style={styles.moonHalo} />
        </Animated.View>

        {/* Twinkling Stars in Night Sky (NO EMOJI - ALWAYS ICONS) */}
        <Animated.View style={[styles.starsLayer, { opacity: starTwinkleAnim }]}>
          <View style={[styles.twinkleStar, { top: 12, left: 24 }]}>
            <Sparkles size={14} color="#FDE047" fill="#FDE047" />
          </View>
          <View style={[styles.twinkleStar, { top: 28, right: 38 }]}>
            <Star size={10} color="#FDE047" fill="#FDE047" />
          </View>
          <View style={[styles.twinkleStar, { bottom: 45, left: 34 }]}>
            <Star size={11} color="#FEF08A" fill="#FEF08A" />
          </View>
          <View style={[styles.twinkleStar, { bottom: 50, right: 48 }]}>
            <Sparkles size={12} color="#FDE047" fill="#FDE047" />
          </View>
        </Animated.View>

        {/* Cozy Mooca Wearing Turquoise Headphones Sleeping on Cloud */}
        <View style={styles.sleepingMoocaArea}>
          <MoocaMascot
            mood="listening"
            size="md"
            speakingBubble={
              isPlaying
                ? lang === 'th'
                  ? 'Mooca ใส่หูฟังเปิดคลื่นอัลฟาให้... หลับตาลงสบายๆ นะ'
                  : 'Mooca has your sanctuary waves ready... rest your eyes.'
                : lang === 'th'
                ? 'แตะไอคอนลำโพงเพื่อเริ่มฟังเสียงสมาธิ'
                : 'Tap the speaker to play sanctuary'
            }
          />

          {/* Turquoise Headphones Visual Accent Badge */}
          <View style={styles.headphonesBadge}>
            <Headphones size={12} color="#00C4B3" />
            <Text style={styles.headphonesBadgeText}>
              {lang === 'th' ? 'หูฟังสีเทอร์ควอยซ์เชื่อมต่อแล้ว' : 'Turquoise Headphones Connected'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Voice Affirmation Script Card */}
      <View style={styles.scriptCard}>
        <View style={styles.scriptHeader}>
          <Sparkles size={14} color={colors.secondary} />
          <Text style={styles.scriptCategory}>
            {lang === 'th' ? 'ถ้อยคำปลอบประโลมสำหรับคุณ' : 'Personalized Sanctuary Voice'}
          </Text>
        </View>

        <Text style={styles.scriptText}>
          "{lang === 'th' ? script.th : script.en}"
        </Text>

        {/* Ambient Neural Wave Visualizer */}
        <View style={styles.waveBar}>
          <View style={[styles.wavePill, { height: 16 }]} />
          <View style={[styles.wavePill, { height: 26 }]} />
          <View style={[styles.wavePill, { height: 14 }]} />
          <View style={[styles.wavePill, { height: 22 }]} />
          <View style={[styles.wavePill, { height: 28 }]} />
          <View style={[styles.wavePill, { height: 18 }]} />
          <View style={[styles.wavePill, { height: 24 }]} />
          <View style={[styles.wavePill, { height: 12 }]} />
        </View>
      </View>

      {/* Complete Button */}
      <View style={styles.actionSection}>
        <MarshmallowButton
          variant="primary"
          size="lg"
          onPress={() => {
            audioService.stopAllVoice();
            onComplete();
          }}
          icon={<Check size={18} color="#FFFFFF" />}
          title={
            countdown > 0
              ? lang === 'th'
                ? `ฟังเสียงสมาธิต่อ (${countdown}s) หรือแตะเพื่อไปต่อ`
                : `Listening (${countdown}s) • Tap to Proceed`
              : lang === 'th'
              ? 'สงบจิตใจเรียบร้อยแล้ว ก้าวต่อไป'
              : 'Sanctuary Complete • Step Forward'
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
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  mbtiBadge: {
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
  mbtiBadgeText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  soundToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderTeal,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  nightSkyCard: {
    width: '100%',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 196, 179, 0.3)',
    ...shadows.soft,
  },
  moonWrapper: {
    position: 'absolute',
    top: 14,
    right: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonHalo: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(253, 224, 71, 0.15)',
  },
  starsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  twinkleStar: {
    position: 'absolute',
    fontSize: 13,
  },
  sleepingMoocaArea: {
    alignItems: 'center',
    marginVertical: 4,
  },
  headphonesBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.full,
    gap: 5,
    marginTop: 6,
  },
  headphonesBadgeText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 9,
    color: colors.primaryDark,
  },
  scriptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    ...shadows.soft,
  },
  scriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  scriptCategory: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  scriptText: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  waveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
    height: 28,
  },
  wavePill: {
    width: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    opacity: 0.8,
  },
  actionSection: {
    width: '100%',
    marginTop: 4,
  },
});
