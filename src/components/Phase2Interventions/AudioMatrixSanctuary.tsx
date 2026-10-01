import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MBTIType } from '../../types';
import { MBTI_SANCTUARY_SCRIPTS, getMBTIArchetype } from '../../data/matrixData';
import { audioService } from '../../services/audioService';
import { Button } from '../../design-system/Button';
import { MoocaMascot } from '../MoocaMascot';
import { Volume2, VolumeX, Sparkles, Check, Headphones } from 'lucide-react-native';
import { colors, radii, shadows } from '../../design-system/tokens';

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
          style={styles.soundToggle}
        >
          {isPlaying ? (
            <Volume2 size={16} color={colors.primary} />
          ) : (
            <VolumeX size={16} color={colors.textMuted} />
          )}
        </TouchableOpacity>
      </View>

      {/* Mascot in Listening Mode */}
      <View style={styles.mascotWrapper}>
        <MoocaMascot
          mood="listening"
          size="md"
          speakingBubble={
            isPlaying
              ? lang === 'th'
                ? 'หลับตาลง แล้วฟังเสียงคลื่นอัลฟา...'
                : 'Close your eyes and let the Alpha waves steady you...'
              : lang === 'th'
              ? 'แตะไอคอนลำโพงเพื่อเริ่มฟังเสียง'
              : 'Tap the speaker to play voice'
          }
        />
      </View>

      {/* Voice Affirmation Script Card */}
      <View style={styles.scriptCard}>
        <View style={styles.scriptHeader}>
          <Sparkles size={14} color={colors.secondary} />
          <Text style={styles.scriptCategory}>
            {lang === 'th' ? 'ข้อความปลอบประโลมเฉพาะคุณ' : 'Personalized Sanctuary Voice'}
          </Text>
        </View>

        <Text style={styles.scriptText}>
          "{lang === 'th' ? script.th : script.en}"
        </Text>

        {/* Ambient Neural Wave Visualizer Bar */}
        <View style={styles.waveBar}>
          <View style={[styles.wavePill, { height: 18 }]} />
          <View style={[styles.wavePill, { height: 28 }]} />
          <View style={[styles.wavePill, { height: 14 }]} />
          <View style={[styles.wavePill, { height: 32 }]} />
          <View style={[styles.wavePill, { height: 22 }]} />
          <View style={[styles.wavePill, { height: 12 }]} />
        </View>
        <Text style={styles.waveSubtext}>10Hz Alpha Calm Wave Neural Entrainment</Text>
      </View>

      {/* Complete Button */}
      <View style={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => {
            audioService.stopAllVoice();
            onComplete();
          }}
          icon={<Check size={18} color="#FFFFFF" />}
        >
          {countdown > 0
            ? `${lang === 'th' ? 'พักใจอีก' : 'Breathe for'} ${countdown}s`
            : lang === 'th'
            ? 'เสร็จสิ้นการบำบัดเสียง'
            : 'Complete Acoustic Sanctuary'}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  mbtiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 6,
    ...shadows.card,
  },
  mbtiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  soundToggle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderTeal,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  mascotWrapper: {
    alignItems: 'center',
    marginVertical: 4,
  },
  scriptCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    alignItems: 'center',
    ...shadows.soft,
  },
  scriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scriptCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  scriptText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.primaryDark,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  waveBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    height: 36,
  },
  wavePill: {
    width: 5,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  waveSubtext: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: 4,
  },
  actionSection: {
    width: '100%',
    marginTop: 6,
  },
});
