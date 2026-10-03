import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MBTIType } from '../../types';
import { MBTI_SANCTUARY_SCRIPTS, getMBTIArchetype } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { MarshmallowButton } from '../../design-system/MarshmallowButton';
import { MoocaMascot } from '../MoocaMascot';
import { useSky } from '../DynamicSkyEngine';
import { Sparkles, Headphones, Play, Pause, ArrowRight, RotateCcw } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { AudioMatrixSanctuaryProps } from './types';
import { AUDIO_SANCTUARY_CONFIG } from './constants';

export const AudioMatrixSanctuary: React.FC<AudioMatrixSanctuaryProps> = ({
  mbti = 'INFP',
  onComplete,
  lang,
}) => {
  const t = getTranslation(lang);
  const strings = t.phases.phase2.audioMatrix;
  const { activePeriod } = useSky();
  const [isPlaying, setIsPlaying] = useState(true);
  const [countdown, setCountdown] = useState(25);
  const archetype = getMBTIArchetype(mbti);
  const script = MBTI_SANCTUARY_SCRIPTS[archetype];

  // 10 dynamic equalizer voice wave bars
  const waveBars = useRef(
    [0.4, 0.7, 0.5, 0.9, 0.6, 0.85, 0.45, 0.8, 0.55, 0.35].map(
      (init) => new Animated.Value(init)
    )
  ).current;

  // Staggered undulating wave animation that actively moves while audio is playing
  useEffect(() => {
    if (!isPlaying) {
      waveBars.forEach((val) => {
        Animated.timing(val, {
          toValue: 0.2,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
      return;
    }

    const waveAnimations = waveBars.map((val, i) => {
      const dur = 380 + (i % 5) * 120;
      return Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 0.25 + ((i * 4) % 6) * 0.12,
            duration: dur,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0.98 - ((i * 3) % 4) * 0.08,
            duration: dur * 1.15,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    });

    waveAnimations.forEach((a) => a.start());

    return () => {
      waveAnimations.forEach((a) => a.stop());
    };
  }, [isPlaying]);

  // Play / Pause toggle
  const togglePlayback = () => {
    if (isPlaying) {
      audioService.stopAllVoice();
      audioService.triggerHaptic('selection');
      setIsPlaying(false);
    } else {
      audioService.triggerHaptic('medium');
      audioService.startNeuralEntrainment('both');
      const text = lang === 'th' ? script.th : script.en;
      audioService.playVoiceSanctuary(text, lang, 0.86);
      setIsPlaying(true);
    }
  };

  // Replay audio guidance and restart session
  const handleReplay = () => {
    audioService.stopAllVoice();
    audioService.triggerHaptic('medium');
    audioService.startNeuralEntrainment('both');
    const text = script[lang];
    audioService.playVoiceSanctuary(text, lang, 0.86);
    setCountdown(25);
    setIsPlaying(true);
  };

  useEffect(() => {
    audioService.startNeuralEntrainment('both');
    const text = script[lang];
    audioService.playVoiceSanctuary(text, lang, 0.86);
    setIsPlaying(true);

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

  // Sky period theme mapping for optimal contrast & aesthetic harmony
  const getSkyColors = () => {
    switch (activePeriod) {
      case 'sunset':
        return {
          cardBg: 'rgba(255, 255, 255, 0.90)',
          cardBorder: '#FAD6D5',
          badgeBg: '#FDEFEE',
          badgeBorder: '#FAD6D5',
          badgeText: '#E44743',
          scriptTitle: '#E85A56',
          scriptText: '#EB6460',
          waveColor: '#EF7773',
          hintText: '#ffffffff',
          progressTrack: 'rgba(255, 255, 255, 0.85)',
          progressFill: ['#EF7773', '#F4A09D'] as const,
        };
      case 'night':
        return {
          cardBg: 'rgba(38, 49, 60, 0.92)',
          cardBorder: 'rgba(143, 187, 239, 0.4)',
          badgeBg: 'rgba(0, 0, 0, 0.85)',
          badgeBorder: 'rgba(143, 187, 239, 0.4)',
          badgeText: '#8FBBEF',
          scriptTitle: '#62A0E9',
          scriptText: '#FFFFFF',
          waveColor: '#1F77DF',
          hintText: '#79ADA9',
          progressTrack: 'rgba(255, 255, 255, 0.25)',
          progressFill: ['#1F77DF', '#62A0E9'] as const,
        };
      case 'dawn':
        return {
          cardBg: 'rgba(255, 255, 255, 0.92)',
          cardBorder: '#F8E4B3',
          badgeBg: '#FCF4E0',
          badgeBorder: '#F8E4B3',
          badgeText: '#D97800',
          scriptTitle: '#DF8900',
          scriptText: '#E39200',
          waveColor: '#F9A000',
          hintText: '#D97800',
          progressTrack: 'rgba(255, 255, 255, 0.65)',
          progressFill: ['#F9A000', '#F0BF4D'] as const,
        };
      default:
        return {
          cardBg: 'rgba(255, 255, 255, 0.92)',
          cardBorder: colors.borderTeal,
          badgeBg: colors.primaryLight,
          badgeBorder: colors.borderTeal,
          badgeText: colors.primaryDark,
          scriptTitle: colors.secondary,
          scriptText: colors.textPrimary,
          waveColor: colors.primary,
          hintText: colors.textMuted,
          progressTrack: colors.ringTrack,
          progressFill: [colors.primary, colors.accentBlue] as const,
        };
    }
  };
  const skyTheme = getSkyColors();

  return (
    <View style={styles.container}>
      {/* 1. Mascot View - Free & Unboxed, Standardized 140px Height Matching Screens A-F */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood={countdown === 0 ? 'celebrating' : 'listening'}
          size="sm"
          speakingBubble={
            countdown === 0
              ? strings.bubbleDone
              : strings.bubblePlaying
          }
        />
      </View>

      {/* 2. MBTI Acoustic Profile Pill (No duplicate audio toggle - header already has it) */}
      <View style={[styles.mbtiBadge, { backgroundColor: skyTheme.badgeBg, borderColor: skyTheme.badgeBorder }]}>
        <Headphones size={13} color={skyTheme.badgeText} />
        <Text style={[styles.mbtiBadgeText, { color: skyTheme.badgeText }]}>
          {strings.binauralAlpha}
        </Text>
      </View>

      {/* 3. Center Stage: Moving Voice Wave Bars + Play/Pause/Replay Controls */}
      <View style={styles.centerStage}>
        {/* Dynamic undulating voice wave visualizer (Enlarged) */}
        <View style={styles.waveformContainer}>
          {waveBars.map((val, idx) => (
            <Animated.View
              key={idx}
              style={[
                styles.wavePill,
                {
                  backgroundColor: skyTheme.waveColor,
                  transform: [{ scaleY: val }],
                  height: [26, 48, 22, 64, 40, 58, 30, 52, 36, 20][idx],
                },
              ]}
            />
          ))}
        </View>

        {/* Tactile Control Buttons Row */}
        <View style={styles.controlsRow}>
          {/* Play/Pause Button (Smaller size) */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={togglePlayback}
            style={[styles.playPauseBtn, { backgroundColor: colors.primary }]}
          >
            {isPlaying ? (
              <Pause size={18} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={18} color="#FFFFFF" fill="#FFFFFF" style={{ marginLeft: 2 }} />
            )}
          </TouchableOpacity>

          {/* Replay Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleReplay}
            style={[
              styles.replayBtn,
              {
                backgroundColor: skyTheme.cardBg,
                borderColor: skyTheme.cardBorder,
              },
            ]}
          >
            <RotateCcw size={18} color={skyTheme.scriptTitle} />
          </TouchableOpacity>
        </View>

        {/* Audio State Label */}
        <Text style={[styles.audioStatusHint, { color: skyTheme.hintText }]}>
          {isPlaying
            ? strings.playingHint
            : strings.tapResumeHint}
        </Text>
      </View>

      {/* 4. Celestial Voice Affirmation Script Box */}
      <View style={[styles.scriptCard, { backgroundColor: skyTheme.cardBg, borderColor: skyTheme.cardBorder }]}>
        <View style={styles.scriptHeader}>
          <Sparkles size={14} color={skyTheme.scriptTitle} />
          <Text style={[styles.scriptCategory, { color: skyTheme.scriptTitle }]}>
            {strings.voiceLabel}
          </Text>
        </View>

        <Text
          style={[styles.scriptText, { color: skyTheme.scriptText }]}
          textBreakStrategy="balanced"
        >
          "{lang === 'th' ? script.th : script.en}"
        </Text>
      </View>

      {/* 5. Action Section (Preserved space for proceed button, smaller button size) */}
      <View style={styles.actionSection}>
        {countdown > 0 ? (
          <Text style={[styles.organicSensorHint, { color: skyTheme.hintText }]}>
            {strings.alphaTherapy.replace('{countdown}', String(countdown))}
          </Text>
        ) : (
          <MarshmallowButton
            variant="primary"
            size="md"
            onPress={() => {
              audioService.stopAllVoice();
              onComplete();
            }}
            icon={<ArrowRight size={16} color="#FFFFFF" />}
            title={strings.proceed}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mascotWrapper: {
    overflow: 'visible',
    height: 145,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  mbtiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1.2,
    gap: 6,
    ...shadows.soft,
  },
  mbtiBadgeText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
  },
  scriptCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.2,
    ...shadows.soft,
  },
  scriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  scriptCategory: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scriptText: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'left',
  },
  centerStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    gap: 8,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 68,
  },
  wavePill: {
    width: 6,
    borderRadius: 3,
    opacity: 0.9,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  playPauseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  replayBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    ...shadows.soft,
  },
  audioStatusHint: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11,
    textAlign: 'center',
  },
  actionSection: {
    width: '100%',
    minHeight: 52, // Always preserve exact height for proceed button!
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 6,
  },
  organicSensorHint: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 11.5,
    textAlign: 'center',
  },
});
