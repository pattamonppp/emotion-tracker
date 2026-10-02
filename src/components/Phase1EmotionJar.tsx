import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { FloatingEmotionCloud } from './FloatingEmotionCloud';
import { GlassEmotionJar } from './GlassEmotionJar';
import { MoocaMascot } from './MoocaMascot';
import { MapPin, Activity, Sparkles, Check, ArrowRight, ArrowDown } from 'lucide-react-native';
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
      <ScrollView
        style={styles.container}
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

      {/* Hero Mascot Greeting with Interactive Petting Mode */}
      <View style={styles.mascotSection}>
        <MoocaMascot
          mood={selectedEmotions.length > 0 ? 'comforting' : 'happy'}
          size="sm"
          speakingBubble={
            selectedEmotions.length > 0
              ? lang === 'th'
                ? `เก็บลงโหลแล้ว ${selectedEmotions.length} ก้อน! ลากก้อนเมฆลงมาเพิ่มได้อีกนะ`
                : `${selectedEmotions.length} emotions in jar! Drag down more anytime`
              : lang === 'th'
              ? 'วันนี้มีเรื่องอะไรทำให้หนักใจบ้าง? ลากก้อนเมฆอารมณ์ลงมาใส่โหลด้านล่างได้เลยนะ'
              : 'What is weighing on your mind? Drag emotion clouds down into the jar below!'
          }
          onHug={onOpenStory}
        />
      </View>

      {/* Floating Emotion Clouds Section (Floating in the Sky at Top) */}
      <View style={styles.skyCloudsSection}>
        <View style={styles.sectionHeaderRow}>
          <Sparkles size={13} color={colors.primary} />
          <Text style={styles.sectionTitle}>
            {lang === 'th'
              ? 'ก้อนเมฆอารมณ์ลอยในใจ (แตะหรือลากลงโหลแก้วด้านล่าง ↓):'
              : 'Floating Emotion Clouds (Drag down into Jar ↓):'}
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

      {/* Target Section: The Storybook Apothecary Glass Emotion Jar (Placed Below Clouds) */}
      <View style={styles.jarSection}>
        <View style={styles.jarTargetHintRow}>
          <ArrowDown size={11} color={colors.primary} strokeWidth={2.4} />
          <Text style={styles.jarTargetHint}>
            {lang === 'th'
              ? 'โหลแก้วโอสถพักใจของ Mooca (ปล่อยก้อนเมฆลงตรงนี้)'
              : "Mooca's Apothecary Jar (Drop clouds here)"}
          </Text>
          <ArrowDown size={11} color={colors.primary} strokeWidth={2.4} />
        </View>

        <GlassEmotionJar
          selectedEmotions={selectedEmotions}
          onRemoveEmotion={(id) => toggleEmotion(id)}
          onClearAll={handleClearAll}
          lang={lang}
        />
      </View>
    </ScrollView>

    {/* Sticky Bottom Marshmallow 3D Proceed CTA */}
    <View style={styles.stickyBottomBar}>
      <MarshmallowButton
        variant="primary"
        size="lg"
        onPress={() => {
          if (selectedEmotions.length === 0) {
            toggleEmotion(EMOTION_TAGS[0].id);
          }
          onProceed();
        }}
        title={lang === 'th' ? 'เริ่มกระบวนการรีเซ็ตใจกับ Mooca' : 'Begin Cozy Reset Engine'}
        icon={<ArrowRight size={18} color="#FFFFFF" />}
      />
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    alignItems: 'center',
  },
  stickyBottomBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
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
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.25)',
    gap: 4,
    ...shadows.soft,
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
    borderWidth: 1.2,
    borderColor: 'rgba(250, 140, 61, 0.3)',
    gap: 4,
    ...shadows.soft,
  },
  pulseText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.secondary,
  },
  mascotSection: {
    marginVertical: 2,
    alignItems: 'center',
  },
  skyCloudsSection: {
    width: '100%',
    marginTop: 6,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12.5,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  cloudsList: {
    width: '100%',
    gap: 6,
  },
  jarSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  jarTargetHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(230, 249, 247, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.28)',
    marginBottom: 6,
    ...shadows.soft,
  },
  jarTargetHint: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 10.5,
    color: colors.primaryDark,
  },
});
