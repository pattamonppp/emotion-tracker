import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { EmotionTag, EmotionTagId } from '../types';
import { EMOTION_TAGS, matchOptionFromKeywords } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { MarshmallowButton } from '../design-system/MarshmallowButton';
import { FloatingEmotionCloud } from './FloatingEmotionCloud';
import { GlassEmotionJar } from './GlassEmotionJar';
import { CustomEmotionModal } from './CustomEmotionModal';
import { MapPin, Activity, Sparkles, ArrowRight } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';
import { getTranslation } from '../locales';
import { PHASE1_CONFIG } from '../constants';

export interface CustomMessageItem {
  id: string;
  text: string;
}

interface Phase1EmotionJarProps {
  currentLocation: string;
  heartRate: number;
  selectedEmotions: EmotionTagId[];
  onSelectEmotions: (emotions: EmotionTagId[]) => void;
  onProceed: () => void;
  onOpenPulseSensor?: () => void;
  onOpenStory?: () => void;
  lang: 'th' | 'en';
  skyPeriod?: 'dawn' | 'day' | 'sunset' | 'night';
}

const MAX_SELECTED_EMOTIONS = PHASE1_CONFIG.maxSelectedEmotions;

export const Phase1EmotionJar: React.FC<Phase1EmotionJarProps> = ({
  currentLocation,
  heartRate,
  selectedEmotions,
  onSelectEmotions,
  onProceed,
  onOpenPulseSensor,
  onOpenStory,
  lang,
  skyPeriod,
}) => {
  const selectedEmotionsRef = React.useRef(selectedEmotions);
  selectedEmotionsRef.current = selectedEmotions;

  const [customMessages, setCustomMessages] = React.useState<CustomMessageItem[]>([]);
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = React.useState(false);

  const handleSaveCustomEmotion = (
    text: string,
    putInJarImmediately: boolean,
    editingId?: string | null
  ) => {
    if (editingId) {
      setCustomMessages((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, text } : m))
      );
      if (putInJarImmediately && !selectedEmotionsRef.current.includes(editingId)) {
        if (selectedEmotionsRef.current.length < MAX_SELECTED_EMOTIONS) {
          audioService.playJarDrop();
          onSelectEmotions([...selectedEmotionsRef.current, editingId]);
        }
      }
    } else {
      if (customMessages.length >= 3) return;
      const newId = `custom_${Date.now()}`;
      setCustomMessages((prev) => [...prev, { id: newId, text }]);
      if (putInJarImmediately && selectedEmotionsRef.current.length < MAX_SELECTED_EMOTIONS) {
        audioService.playJarDrop();
        onSelectEmotions([...selectedEmotionsRef.current, newId]);
      }
    }
  };

  const handleDeleteCustomEmotion = (id: string) => {
    setCustomMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedEmotionsRef.current.includes(id)) {
      onSelectEmotions(selectedEmotionsRef.current.filter((item) => item !== id));
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

  const t = getTranslation(lang);
  const p1 = t.phases.phase1;

  // 1) Preset emotions not yet in jar (exclude placeholder 'custom')
  const presetsInSky = EMOTION_TAGS.filter(
    (tag) => tag.id !== 'custom' && !selectedEmotions.includes(tag.id)
  );

  // 2) Custom messages not yet in jar
  const customInSky = customMessages
    .filter((m) => !selectedEmotions.includes(m.id))
    .map((m) => ({
      id: m.id,
      labelTh: m.text,
      labelEn: m.text,
      emoji: '',
      color: '#EC4899',
      weightDescription: '',
      recommendedOption: matchOptionFromKeywords(m.text, 'A'),
      isCustom: true,
      customText: m.text,
    }));

  // 3) Add button: show if customMessages.length < 3 AND selectedEmotions.length < MAX_SELECTED_EMOTIONS
  const showAddButton =
    customMessages.length < PHASE1_CONFIG.maxCustomMessages && selectedEmotions.length < MAX_SELECTED_EMOTIONS;

  const allSkyItems: Array<{
    id: string;
    tag: EmotionTag;
    isCustom?: boolean;
    customText?: string;
    isAddButton?: boolean;
  }> = [
      ...presetsInSky.map((t) => ({ id: t.id, tag: t })),
      ...customInSky.map((c) => ({
        id: c.id,
        tag: c,
        isCustom: true,
        customText: c.customText,
      })),
      ...(showAddButton
        ? [
          {
            id: 'btn_add_custom',
            tag: {
              id: 'custom',
              labelTh: p1.tellMoocaPlaceholder,
              labelEn: p1.tellMoocaPlaceholder,
              emoji: '',
              color: '#EC4899',
              weightDescription: '',
              recommendedOption: 'A' as const,
            },
            isAddButton: true,
          },
        ]
        : []),
    ];

  // 4) STRICTLY MAXIMUM 3 CLOUDS PER ROW! ("สูงสุดแถวละ 3 ก้อนอารมณ์ที")
  const chunkedRows: typeof allSkyItems[] = [];
  for (let i = 0; i < allSkyItems.length; i += 3) {
    chunkedRows.push(allSkyItems.slice(i, i + 3));
  }

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
          {/* Floating Emotion Clouds Section (Strictly max 3 clouds per row) */}
          <View style={styles.skyCloudsSection}>
            <View style={styles.cloudsList}>
              {chunkedRows.map((row, rowIdx) => (
                <View key={`row-${rowIdx}`} style={styles.cloudRow}>
                  {row.map((item, colIdx) => {
                    if (item.isAddButton) {
                      return (
                        <FloatingEmotionCloud
                          key={item.id}
                          tag={item.tag}
                          index={rowIdx * 3 + colIdx}
                          isSelected={false}
                          isJarFull={isJarFull}
                          onToggle={() => { }}
                          lang={lang}
                          isAddButton={true}
                          onEditCustom={() => {
                            setEditingMessageId(null);
                            setIsCustomModalOpen(true);
                          }}
                        />
                      );
                    }
                    return (
                      <FloatingEmotionCloud
                        key={item.id}
                        tag={item.tag}
                        index={rowIdx * 3 + colIdx}
                        isSelected={false}
                        isJarFull={isJarFull}
                        onToggle={toggleEmotion}
                        onDropIntoJar={handleDropIntoJar}
                        lang={lang}
                        customText={item.customText}
                        onEditCustom={
                          item.isCustom
                            ? () => {
                              setEditingMessageId(item.id);
                              setIsCustomModalOpen(true);
                            }
                            : undefined
                        }
                      />
                    );
                  })}
                </View>
              ))}
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
              customMessages={customMessages}
              skyPeriod={skyPeriod}
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
          title={p1.beginCozyReset}
          icon={<ArrowRight size={17} color="#FFFFFF" />}
          disabled={selectedEmotions.length === 0}
        />
      </View>

      {/* Sweet Custom Emotion Input Modal (Message to Mooca) */}
      <CustomEmotionModal
        isOpen={isCustomModalOpen}
        editingId={editingMessageId}
        initialText={
          editingMessageId
            ? customMessages.find((m) => m.id === editingMessageId)?.text || ''
            : ''
        }
        onSave={handleSaveCustomEmotion}
        onDelete={handleDeleteCustomEmotion}
        onClose={() => {
          setIsCustomModalOpen(false);
          setEditingMessageId(null);
        }}
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
    width: '100%',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 2,
    minHeight: 154,
  },
  cloudRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  jarSection: {
    width: '100%',
    alignItems: 'center',
  },
});
