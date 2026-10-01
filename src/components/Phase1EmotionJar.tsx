import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { GlassEmotionJar } from './GlassEmotionJar';
import { MoocaMascot } from './MoocaMascot';
import { MapPin, Activity, ArrowRight, Check } from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';

interface Phase1EmotionJarProps {
  currentLocation: string;
  heartRate: number;
  selectedEmotions: EmotionTagId[];
  onSelectEmotions: (ids: EmotionTagId[]) => void;
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
  const toggleEmotion = (id: EmotionTagId) => {
    if (selectedEmotions.includes(id)) {
      audioService.triggerHaptic('light');
      onSelectEmotions(selectedEmotions.filter((item) => item !== id));
    } else {
      audioService.triggerHaptic('medium');
      audioService.playJarDrop();
      onSelectEmotions([...selectedEmotions, id]);
    }
  };

  const handleClearAll = () => {
    onSelectEmotions([]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Status Indicators (Location & Live Pulse) */}
      <View style={styles.statusRow}>
        <View style={styles.badgePill}>
          <MapPin size={12} color={colors.primary} />
          <Text style={styles.badgeText}>{currentLocation}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('selection');
            if (onOpenPulseSensor) onOpenPulseSensor();
          }}
          style={styles.pulsePill}
        >
          <Activity size={12} color={colors.secondary} />
          <Text style={styles.pulseText}>{heartRate} BPM</Text>
        </TouchableOpacity>
      </View>

      {/* Hero Mascot Greeting */}
      <View style={styles.mascotSection}>
        <MoocaMascot
          mood={selectedEmotions.length > 0 ? 'comforting' : 'happy'}
          size="sm"
          speakingBubble={
            selectedEmotions.length > 0
              ? lang === 'th'
                ? 'Mooca จะช่วยดูแลความรู้สึกนี้เองนะ!'
                : 'Mooca will hold this safe for you!'
              : lang === 'th'
              ? 'สวัสดี! วันนี้รู้สึกหนักใจเรื่องอะไรบ้าง?'
              : 'Hello! What is weighing on your mind?'
          }
          onHug={onOpenStory}
        />
      </View>

      {/* The Glass Emotion Jar */}
      <GlassEmotionJar
        selectedEmotions={selectedEmotions}
        onRemoveEmotion={(id) => toggleEmotion(id)}
        onClearAll={handleClearAll}
        lang={lang}
      />

      {/* Emotion Selection Matrix Chips */}
      <View style={styles.selectorSection}>
        <Text style={styles.sectionTitle}>
          {lang === 'th' ? 'เลือกความรู้สึกที่เกิดขึ้นตอนนี้:' : 'Identify your current state:'}
        </Text>

        <View style={styles.chipsGrid}>
          {EMOTION_TAGS.map((tag) => {
            const isSelected = selectedEmotions.includes(tag.id);
            return (
              <TouchableOpacity
                key={tag.id}
                activeOpacity={0.8}
                onPress={() => toggleEmotion(tag.id)}
                style={[
                  styles.chip,
                  {
                    borderColor: isSelected ? tag.color : colors.borderSubtle,
                    backgroundColor: isSelected ? tag.color + '18' : '#FFFFFF',
                  },
                ]}
              >
                <View
                  style={[
                    styles.chipIndicator,
                    {
                      backgroundColor: tag.color,
                      borderColor: isSelected ? tag.color : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                </View>

                <View style={styles.chipTextWrapper}>
                  <Text
                    style={[
                      styles.chipLabel,
                      { color: isSelected ? colors.primaryDark : colors.textPrimary },
                    ]}
                  >
                    {lang === 'th' ? tag.labelTh : tag.labelEn}
                  </Text>
                  <Text style={styles.chipSub}>{tag.weightDescription}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Proceed CTA */}
      <View style={styles.ctaContainer}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={() => {
            if (selectedEmotions.length === 0) {
              // auto-select first one if none selected
              toggleEmotion(EMOTION_TAGS[0].id);
            }
            onProceed();
          }}
          icon={<ArrowRight size={18} color="#FFFFFF" />}
        >
          {lang === 'th' ? 'เริ่มกระบวนการรีเซ็ตใจ (120 วินาที)' : 'Begin 120s Reset Engine'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  pulsePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(250, 140, 61, 0.3)',
    gap: 4,
  },
  pulseText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
  },
  mascotSection: {
    marginVertical: 4,
    alignItems: 'center',
  },
  selectorSection: {
    width: '100%',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  chipsGrid: {
    gap: 7,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    ...shadows.card,
  },
  chipIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  chipTextWrapper: {
    flex: 1,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 1,
  },
  chipSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  ctaContainer: {
    width: '100%',
    marginTop: 20,
  },
});
