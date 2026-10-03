import React, { useRef } from 'react';
import { EmotionTag, EmotionTagId, CustomMessageItem, Language, LANG, SkyTimePeriod, INTERVENTION } from '../../types';
import { EMOTION_TAGS, matchOptionFromKeywords } from '../../data/matrixData';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../design-system/MarshmallowButton';
import { FloatingEmotionCloud } from './components/FloatingEmotionCloud';
import { GlassEmotionJar } from './components/GlassEmotionJar';
import { CustomEmotionModal } from './modals/CustomEmotionModal';
import { MapPin, Activity, ArrowRight } from 'lucide-react';
import { DESIGN_TOKENS } from '../../design-system/tokens';
import { getTranslation } from '../../locales';
import { PHASE1_CONFIG } from '../../constants';
import styles from './Phase1EmotionJar.module.scss';

export type { CustomMessageItem };

export interface Phase1EmotionJarProps {
  currentLocation: string;
  heartRate: number;
  selectedEmotions: EmotionTagId[];
  onSelectEmotions: (emotions: EmotionTagId[]) => void;
  onProceed: () => void;
  onOpenPulseSensor?: () => void;
  onOpenStory?: () => void;
  lang?: Language;
  skyPeriod?: SkyTimePeriod;
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
  lang = LANG.TH,
  skyPeriod,
}) => {
  const selectedEmotionsRef = useRef(selectedEmotions);
  const jarRef = useRef<HTMLDivElement | null>(null);

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
      audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);
      onSelectEmotions(current.filter((item) => item !== id));
    } else {
      if (current.length >= MAX_SELECTED_EMOTIONS) {
        audioService.triggerHaptic(HAPTIC_STYLE.WARNING);
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
        audioService.triggerHaptic(HAPTIC_STYLE.WARNING);
        return;
      }
      audioService.playJarDrop();
      onSelectEmotions([...current, id]);
    }
  };

  const handleClearAll = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
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
      recommendedOption: matchOptionFromKeywords(m.text, INTERVENTION.A),
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
      ...presetsInSky.map((tagItem) => ({ id: tagItem.id, tag: tagItem })),
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
              recommendedOption: INTERVENTION.A,
            },
            isAddButton: true,
          },
        ]
        : []),
    ];

  // 4) STRICTLY MAXIMUM 3 CLOUDS PER ROW!
  const chunkedRows: typeof allSkyItems[] = [];
  for (let i = 0; i < allSkyItems.length; i += 3) {
    chunkedRows.push(allSkyItems.slice(i, i + 3));
  }

  return (
    <div className={styles.root}>
      <div className={styles.viewportContent}>
        {/* Top Status Indicators (Location & Live Pulse) */}
        <div className={styles.statusRow}>
          <div className={styles.badgePill}>
            <MapPin size={11} color={DESIGN_TOKENS.color.brand.turquoise.primary} />
            <span className={styles.badgeText}>{currentLocation}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
              if (onOpenPulseSensor) onOpenPulseSensor();
            }}
            className={styles.pulsePill}
          >
            <Activity size={11} color={DESIGN_TOKENS.color.feedback.warning} />
            <span className={styles.pulseText}>{heartRate} BPM</span>
          </button>
        </div>

        {/* Harmonious Main Stage: Clouds Sky + Apothecary Jar */}
        <div className={styles.contentBody}>
          {/* Floating Emotion Clouds Section (Strictly max 3 clouds per row) */}
          <div className={styles.skyCloudsSection}>
            <div className={styles.cloudsList}>
              {chunkedRows.map((row, rowIdx) => (
                <div key={`row-${rowIdx}`} className={styles.cloudRow}>
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
                          jarRef={jarRef}
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
                        jarRef={jarRef}
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
                </div>
              ))}
            </div>
          </div>

          {/* The Sanctuary Apothecary Glass Emotion Jar with Perched Mooca */}
          <div className={styles.jarSection} ref={jarRef}>
            <GlassEmotionJar
              selectedEmotions={selectedEmotions}
              onRemoveEmotion={(id) => toggleEmotion(id)}
              onClearAll={handleClearAll}
              lang={lang}
              onMoocaHug={onOpenStory}
              customMessages={customMessages}
              skyPeriod={skyPeriod}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Marshmallow 3D Proceed CTA */}
      <div className={styles.stickyBottomBar}>
        <MarshmallowButton
          variant={MARSHMALLOW_VARIANT.PRIMARY}
          size={MARSHMALLOW_SIZE.MD}
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
      </div>

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
    </div>
  );
};

export default Phase1EmotionJar;
export * from './modals/LivePulseSensorModal';
export * from './modals/OnboardingModal';
export * from './modals/CustomEmotionModal';
export * from './components/GlassEmotionJar';
export * from './components/FloatingEmotionCloud';
