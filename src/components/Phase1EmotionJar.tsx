import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { FloatingEmotionCloud } from './FloatingEmotionCloud';
import { GlassEmotionJar } from './GlassEmotionJar';
import { MapPin, Activity, Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

interface Phase1EmotionJarProps {
  currentLocation: string;
  heartRate: number;
  selectedEmotions: EmotionTagId[];
  onSelectEmotions: (emotions: EmotionTagId[]) => void;
  onProceed: () => void;
  onOpenPulseSensor?: () => void;
  onOpenStory?: () => void;
  lang: 'th' | 'en';
}

export const Phase1EmotionJar: React.FC<Phase1EmotionJarProps> = ({
  currentLocation,
  heartRate,
  selectedEmotions,
  onSelectEmotions,
  onProceed,
  onOpenPulseSensor,
  onOpenStory,
  lang,
}) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);

  useEffect(() => {
    // Start peaceful ambient music when entering emotion sanctuary
    audioService.startBackgroundMusic();
    const unsub = audioService.subscribeBgm((playing) => {
      setIsMusicPlaying(playing);
    });
    return () => {
      unsub();
    };
  }, []);

  const toggleEmotion = (id: EmotionTagId) => {
    audioService.playJarDrop();
    if (selectedEmotions.includes(id)) {
      onSelectEmotions(selectedEmotions.filter((item) => item !== id));
    } else {
      onSelectEmotions([...selectedEmotions, id]);
    }
  };

  const handleDropIntoJar = (id: EmotionTagId) => {
    if (!selectedEmotions.includes(id)) {
      onSelectEmotions([...selectedEmotions, id]);
    }
  };

  const handleClearAll = () => {
    audioService.triggerHaptic('medium');
    onSelectEmotions([]);
  };

  return (
    <View style={styles.root}>
      <View style={styles.viewportContent}>
        {/* Top Status Indicators (Location, Live Pulse, and Dreamscape Music Toggle) */}
        <View style={styles.statusRow}>
          <View style={styles.badgePill}>
            <MapPin size={11} color={colors.primary} />
            <Text style={styles.badgeText}>{currentLocation}</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              audioService.triggerHaptic('selection');
              if (onOpenPulseSensor) onOpenPulseSensor();
            }}
            style={styles.pulsePill}
          >
            <Activity size={11} color={colors.secondary} />
            <Text style={styles.pulseText}>{heartRate} BPM</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              audioService.toggleBackgroundMusic();
            }}
            style={[
              styles.musicPill,
              isMusicPlaying && styles.musicPillActive,
            ]}
          >
            {isMusicPlaying ? (
              <Volume2 size={11} color={colors.primaryDark} />
            ) : (
              <VolumeX size={11} color={colors.textMuted} />
            )}
            <Text style={[styles.musicText, isMusicPlaying && styles.musicTextActive]}>
              {lang === 'th'
                ? (isMusicPlaying ? 'ดนตรี' : 'ปิดเสียง')
                : (isMusicPlaying ? 'Music' : 'Mute')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Floating Emotion Clouds Section (Floating in the Sky) */}
        <View style={styles.skyCloudsSection}>
          <View style={styles.sectionHeaderRow}>
            <Sparkles size={11} color={colors.primary} />
            <Text style={styles.sectionTitle}>
              {lang === 'th' ? 'ก้อนเมฆอารมณ์ในใจ' : 'Emotion Clouds'}
            </Text>
          </View>

          <View style={styles.cloudsList}>
            {EMOTION_TAGS.map((tag, idx) => {
              const isSelected = selectedEmotions.includes(tag.id);
              return (
                <FloatingEmotionCloud
                  key={tag.id}
                  tag={tag}
                  index={idx}
                  isSelected={isSelected}
                  onToggle={toggleEmotion}
                  onDropIntoJar={handleDropIntoJar}
                  lang={lang}
                />
              );
            })}
          </View>
        </View>

        {/* The Sanctuary Apothecary Glass Emotion Jar with Perched Mooca */}
        <View style={styles.jarSection}>
          <GlassEmotionJar
            selectedEmotions={selectedEmotions}
            onRemoveEmotion={(id) => toggleEmotion(id)}
            onClearAll={handleClearAll}
            lang={lang}
            onMoocaHug={onOpenStory}
          />
        </View>
      </View>

      {/* Sticky Bottom Marshmallow 3D Proceed CTA */}
      <View style={styles.stickyBottomBar}>
        <MarshmallowButton
          variant="primary"
          size="md"
          onPress={() => {
            if (selectedEmotions.length === 0) {
              toggleEmotion(EMOTION_TAGS[0].id);
            }
            onProceed();
          }}
          title={lang === 'th' ? 'เริ่มกระบวนการรีเซ็ตใจกับ Mooca' : 'Begin Cozy Reset Engine'}
          icon={<ArrowRight size={17} color="#FFFFFF" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  viewportContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stickyBottomBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 196, 179, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.25)',
    gap: 4,
    ...shadows.soft,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  pulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(250, 140, 61, 0.3)',
    gap: 4,
    ...shadows.soft,
  },
  pulseText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
  },
  musicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(160, 174, 192, 0.3)',
    gap: 4,
    ...shadows.soft,
  },
  musicPillActive: {
    borderColor: 'rgba(0, 196, 179, 0.35)',
    backgroundColor: 'rgba(230, 249, 247, 0.6)',
  },
  musicText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
  },
  musicTextActive: {
    color: colors.primaryDark,
  },
  skyCloudsSection: {
    width: '100%',
    marginTop: 2,
    marginBottom: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 12,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  cloudsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 2,
  },
  jarSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
});
