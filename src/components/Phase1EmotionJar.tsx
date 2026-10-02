import React from 'react';
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
import { CustomEmotionModal } from './CustomEmotionModal';
import { MapPin, Activity, Sparkles, ArrowRight } from 'lucide-react-native';
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

const MAX_SELECTED_EMOTIONS = 3;

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
  const selectedEmotionsRef = React.useRef(selectedEmotions);
  selectedEmotionsRef.current = selectedEmotions;

  const [customEmotionText, setCustomEmotionText] = React.useState<string>('');
  const [isCustomModalOpen, setIsCustomModalOpen] = React.useState(false);

  const handleSaveCustomEmotion = (text: string, putInJarImmediately: boolean) => {
    setCustomEmotionText(text);
    if (putInJarImmediately) {
      handleDropIntoJar('custom');
    }
  };

  const handleClearCustomEmotion = () => {
    setCustomEmotionText('');
    if (selectedEmotionsRef.current.includes('custom')) {
      onSelectEmotions(selectedEmotionsRef.current.filter((id) => id !== 'custom'));
    }
  };

  const toggleEmotion = (id: EmotionTagId) => {
    const current = selectedEmotionsRef.current;
    if (current.includes(id)) {
      audioService.triggerHaptic('light');
      onSelectEmotions(current.filter((item) => item !== id));
    } else {
      if (current.length >= MAX_SELECTED_EMOTIONS) {
        audioService.triggerHaptic('warning');
        return;
      }
      audioService.playJarDrop();
      onSelectEmotions([...current, id]);
    }
  };

  const handleDropIntoJar = (id: EmotionTagId) => {
    const current = selectedEmotionsRef.current;
    if (!current.includes(id)) {
      if (current.length >= MAX_SELECTED_EMOTIONS) {
        audioService.triggerHaptic('warning');
        return;
      }
      audioService.playJarDrop();
      onSelectEmotions([...current, id]);
    }
  };

  const handleClearAll = () => {
    audioService.triggerHaptic('medium');
    onSelectEmotions([]);
  };

  const isJarFull = selectedEmotions.length >= MAX_SELECTED_EMOTIONS;

  return (
    <View style={styles.root}>
      <View style={styles.viewportContent}>
        {/* Top Status Indicators (Location & Live Pulse) */}
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
        </View>

        {/* Harmonious Main Stage: Clouds Sky + Apothecary Jar (Balanced Spacing) */}
        <View style={styles.contentBody}>
          {/* Floating Emotion Clouds Section (Floating in the Sky - Only Remaining Clouds) */}
          <View style={styles.skyCloudsSection}>
            <View style={styles.cloudsList}>
              {EMOTION_TAGS.filter((tag) => !selectedEmotions.includes(tag.id)).map((tag, idx) => {
                return (
                  <FloatingEmotionCloud
                    key={tag.id}
                    tag={tag}
                    index={idx}
                    isSelected={false}
                    isJarFull={isJarFull}
                    onToggle={toggleEmotion}
                    onDropIntoJar={handleDropIntoJar}
                    lang={lang}
                    customText={tag.id === 'custom' ? customEmotionText : undefined}
                    onEditCustom={() => setIsCustomModalOpen(true)}
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
              customEmotionText={customEmotionText}
            />
          </View>
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

      {/* Sweet Custom Emotion Input Modal (Message to Mooca) */}
      <CustomEmotionModal
        isOpen={isCustomModalOpen}
        initialText={customEmotionText}
        onSave={handleSaveCustomEmotion}
        onClear={handleClearCustomEmotion}
        onClose={() => setIsCustomModalOpen(false)}
        lang={lang}
        isJarFull={isJarFull}
      />
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
    paddingTop: 6,
    paddingBottom: 8,
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
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 4,
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
  contentBody: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 2,
  },
  skyCloudsSection: {
    width: '100%',
    minHeight: 154,
    justifyContent: 'flex-start',
  },
  cloudsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'flex-start',
    rowGap: 10,
    columnGap: 6,
    paddingHorizontal: 2,
    minHeight: 154,
  },
  jarSection: {
    width: '100%',
    alignItems: 'center',
  },
});
