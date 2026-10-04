import React, { useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  X,
  Heart,
  Cloud,
  ShieldCheck,
  Smile,
  Wind,
  RotateCcw,
} from 'lucide-react';
import classNames from 'classnames';

import { EmotionTagId, SPEECH_ICON, SpeechMessage, Language, SkyTimePeriod, INTERVENTION, SKY, EMOTION_TAG_ID } from '../../../../types';
import {
  EMOTION_TAGS,
  matchOptionFromKeywords,
} from '../../../../data/matrixData';
import { audioService, HAPTIC_STYLE } from '../../../../services/audioService';
import { getEmotionIcon } from '../FloatingEmotionCloud';
import { MOOCA_MOOD, MoocaMascot } from '../../../../components/MoocaMascot';
import { DESIGN_TOKENS } from '../../../../design-system/tokens';
import { getTranslation, getTagLabel } from '../../../../locales';
import { PHASE1_CONFIG } from '../../config';

import styles from './styles.module.scss';

const renderSpeechIcon = (
  iconType: SpeechMessage['iconType'],
) => {
  switch (iconType) {
    case SPEECH_ICON.SPARKLES:
      return (
        <Sparkles
          size={11}
          color={DESIGN_TOKENS.color.brand.turquoise.primary}
          strokeWidth={2.4}
        />
      );

    case SPEECH_ICON.WIND:
      return (
        <Wind
          size={11}
          color={DESIGN_TOKENS.color.accent.blue[500]}
          strokeWidth={2.4}
        />
      );

    case SPEECH_ICON.HEART:
      return (
        <Heart
          size={11}
          color={DESIGN_TOKENS.color.system.error[500]}
          fill={DESIGN_TOKENS.color.system.error[500]}
          strokeWidth={1.5}
        />
      );

    case SPEECH_ICON.SHIELD:
      return (
        <ShieldCheck
          size={11}
          color={DESIGN_TOKENS.color.brand.turquoise.primary}
          strokeWidth={2.4}
        />
      );

    case SPEECH_ICON.SMILE:
      return (
        <Smile
          size={11}
          color={DESIGN_TOKENS.color.feedback.warning}
          strokeWidth={2.4}
        />
      );

    case SPEECH_ICON.CLOUD:
    default:
      return (
        <Cloud
          size={11}
          color={DESIGN_TOKENS.color.brand.turquoise.primary}
          strokeWidth={2.4}
        />
      );
  }
};

interface GlassEmotionJarProps {
  selectedEmotions: EmotionTagId[];
  onRemoveEmotion: (id: EmotionTagId) => void;
  onClearAll?: () => void;
  lang: Language;
  onMoocaHug?: () => void;
  customEmotionText?: string;
  customMessages?: Array<{ id: string; text: string }>;
  skyPeriod?: SkyTimePeriod;
}

export const GlassEmotionJar: React.FC<GlassEmotionJarProps> = ({
  selectedEmotions,
  onRemoveEmotion,
  onClearAll,
  lang,
  onMoocaHug,
  customEmotionText,
  customMessages,
  skyPeriod,
}) => {
  const [speechIndex, setSpeechIndex] = useState(0);
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [isJarPressed, setIsJarPressed] = useState(false);
  const [isSpeechAnimating, setIsSpeechAnimating] = useState(false);

  const t = getTranslation(lang);
  const p1 = t.phases.phase1;
  const js = p1.jarSpeeches;

  const getSpeechPool = (): SpeechMessage[] => {
    if (
      selectedEmotions.length >=
      PHASE1_CONFIG.maxSelectedEmotions
    ) {
      return [
        { text: js.full1, iconType: SPEECH_ICON.CLOUD },
        { text: js.full2, iconType: SPEECH_ICON.SPARKLES },
        { text: js.full3, iconType: SPEECH_ICON.WIND },
        { text: js.full4, iconType: SPEECH_ICON.HEART },
      ];
    }

    if (selectedEmotions.length > 0) {
      const hasCustom = selectedEmotions.some((id) =>
        id.startsWith(EMOTION_TAG_ID.CUSTOM),
      );

      const customMsg: SpeechMessage[] = hasCustom
        ? [{ text: js.customHug, iconType: SPEECH_ICON.HEART }]
        : [];

      return [
        ...customMsg,
        {
          text: js.holdingCount.replace(
            '{count}',
            String(selectedEmotions.length),
          ),
          iconType: SPEECH_ICON.SHIELD,
        },
        {
          text: js.braveToFace,
          iconType: SPEECH_ICON.SMILE,
        },
        {
          text: js.safeInJar,
          iconType: SPEECH_ICON.SPARKLES,
        },
      ];
    }

    return [
      {
        text: js.restWorries,
        iconType: SPEECH_ICON.CLOUD,
      },
      {
        text: js.full1,
        iconType: SPEECH_ICON.CLOUD,
      },
      {
        text: js.tapOrDrag,
        iconType: SPEECH_ICON.SPARKLES,
      },
      {
        text: js.howIsHeart,
        iconType: SPEECH_ICON.HEART,
      },
    ];
  };

  const speechPool = getSpeechPool();

  const currentMessage =
    speechPool[speechIndex % speechPool.length];

  /*
   * Speech bubble cycle:
   * 4.8s visible
   * 380ms fade out
   * 900ms hidden
   * 420ms fade in
   */
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;
    let cycleTimer: ReturnType<typeof setTimeout>;
    let mounted = true;

    const showNextMessage = () => {
      if (!mounted) return;

      setSpeechIndex((prev) => prev + 1);
      setIsBubbleVisible(true);
      setIsSpeechAnimating(true);

      nextTimer = setTimeout(() => {
        if (!mounted) return;
        setIsSpeechAnimating(false);
        startCycle();
      }, 420);
    };

    const hideBubble = () => {
      if (!mounted) return;

      setIsSpeechAnimating(true);
      setIsBubbleVisible(false);

      hideTimer = setTimeout(() => {
        if (!mounted) return;

        nextTimer = setTimeout(() => {
          showNextMessage();
        }, 900);
      }, 380);
    };

    const startCycle = () => {
      cycleTimer = setTimeout(() => {
        hideBubble();
      }, 4800);
    };

    // Immediate fresh fade-in whenever emotion count/lang changes.
    setIsBubbleVisible(false);
    setIsSpeechAnimating(true);

    const initialTimer = setTimeout(() => {
      if (!mounted) return;

      setIsBubbleVisible(true);

      nextTimer = setTimeout(() => {
        if (!mounted) return;
        setIsSpeechAnimating(false);
        startCycle();
      }, 350);
    }, 0);

    return () => {
      mounted = false;
      clearTimeout(initialTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
      clearTimeout(cycleTimer);
    };
  }, [selectedEmotions.length, lang]);

  const handleJarTap = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);

    setIsJarPressed(true);

    setTimeout(() => {
      setIsJarPressed(false);
    }, 180);
  };

  const firstId = selectedEmotions[0];
  const isFirstCustom = firstId?.startsWith(EMOTION_TAG_ID.CUSTOM);

  const firstTag =
    selectedEmotions.length > 0
      ? isFirstCustom
        ? { color: '#EC4899' }
        : EMOTION_TAGS.find((tag) => tag.id === firstId)
      : null;

  const jarAmbientColor =
    firstTag?.color || DESIGN_TOKENS.color.brand.turquoise.primary;

  const jarSunAura = useMemo(() => {
    switch (skyPeriod) {
      case SKY.SUNSET:
        return {
          core: '#f597b0ff',
          mid: '#ffea94ff',
          outer: '#ffffffff',
        };

      case SKY.DAWN:
        return {
          core: '#FFFBEB',
          mid: '#FDE68A',
          outer: '#FED7AA',
        };

      case SKY.NIGHT:
        return {
          core: '#F0F9FF',
          mid: '#BAE6FD',
          outer: '#38BDF8',
        };

      default:
        return {
          core: '#F0FDFA',
          mid: '#CCFBF1',
          outer: '#E0F2FE',
        };
    }
  }, [skyPeriod]);

  return (
    <div
      className={classNames(
        styles.animatedJar,
        isJarPressed && styles.jarPressed,
      )}
    >
      <div className={styles.container}>

        {/* Soft Magic Ambient Floor Glow */}
        <div
          className={styles.glow}
          style={{
            backgroundColor: jarAmbientColor,
            opacity:
              selectedEmotions.length > 0 ? 0.28 : 0.12,
          }}
        />

        {/* Mooca Companion */}
        <div className={styles.moocaPerchContainer}>

          {/* Speech Bubble */}
          <div
            className={classNames(
              styles.moocaSpeechBubble,
              isBubbleVisible
                ? styles.speechVisible
                : styles.speechHidden,
              isSpeechAnimating &&
              styles.speechAnimating,
            )}
          >
            <div className={styles.speechRow}>
              <div className={styles.speechIconSlot}>
                {renderSpeechIcon(
                  currentMessage.iconType,
                )}
              </div>

              <span className={styles.moocaSpeechText}>
                {currentMessage.text}
              </span>
            </div>

            <div className={styles.moocaBubbleTail} />
          </div>

          {/* Interactive Mooca */}
          <div className={styles.mascotWrapper}>
            <MoocaMascot
              mood={
                selectedEmotions.length > 0
                  ? MOOCA_MOOD.COMFORTING
                  : MOOCA_MOOD.HAPPY
              }
              size="xs"
              interactive={true}
              onHug={onMoocaHug}
            />
          </div>
        </div>

        {/* Jar */}
        <button
          type="button"
          className={styles.jarButton}
          onClick={handleJarTap}
          aria-label="Emotion jar"
        >
          {/* Lid */}
          <div className={styles.lidSection}>

            <div className={styles.corkKnob} />

            <div className={styles.corkLid}>
              <div className={styles.corkTealPool}>
                <div className={styles.corkReflectionDot} />
              </div>
            </div>

            <div className={styles.neckWrapper}>
              <div className={styles.glassNeck} />

              <div className={styles.twineCordLine} />

              <div className={styles.charmHanger}>
                <div className={styles.charmString} />

                <div className={styles.charmCircle}>
                  <div className={styles.charmInnerDot} />
                </div>
              </div>
            </div>
          </div>

          {/* Sun Aura */}
          <div
            className={styles.jarAuraContainer}
            aria-hidden="true"
            style={{
              background: `radial-gradient(
                circle at center,
                ${jarSunAura.core}73 0%,
                ${jarSunAura.mid}38 42%,
                ${jarSunAura.outer}14 72%,
                transparent 100%
              )`,
            }}
          />

          {/* Glass Jar */}
          <div
            className={styles.jarBody}
            style={{
              background: `linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.28),
                rgba(68, 134, 127, 0.25),
                rgba(138, 227, 218, 0.18)
              )`,
            }}
          >
            {/* Glass Reflections */}
            <div className={styles.glassReflectionLeft} />
            <div className={styles.glassReflectionTop} />
            <div className={styles.glassReflectionRight} />
            <div className={styles.glassReflectionBottom} />

            {/* Jar Contents */}
            <div className={styles.jarInner}>

              {selectedEmotions.length === 0 ? (
                <div className={styles.emptyContainer}>

                  <div className={styles.emptyCircleBadge}>
                    <Sparkles
                      size={20}
                      color={DESIGN_TOKENS.color.brand.turquoise.primary}
                      strokeWidth={2.4}
                    />
                  </div>

                  <span
                    className={classNames(
                      styles.emptyBadgeTitle,
                      (skyPeriod === SKY.SUNSET ||
                        skyPeriod === SKY.NIGHT) &&
                      styles.emptyTitleLight,
                      skyPeriod === SKY.DAWN &&
                      styles.emptyTitleDawn,
                    )}
                  >
                    {p1.emptyTitle}
                  </span>

                  <span
                    className={classNames(
                      styles.emptyBadgeSubtitle,
                      (skyPeriod === SKY.SUNSET ||
                        skyPeriod === SKY.NIGHT) &&
                      styles.emptySubtitleLight,
                      skyPeriod === SKY.DAWN &&
                      styles.emptySubtitleDawn,
                    )}
                  >
                    {p1.emptySubtitleFromAbove}
                  </span>
                </div>
              ) : (
                <div className={styles.puffsContainer}>

                  {selectedEmotions.map((id) => {
                    const isCustom =
                      id.startsWith(EMOTION_TAG_ID.CUSTOM);

                    const customItem =
                      customMessages?.find(
                        (message) => message.id === id,
                      );

                    const tag = isCustom
                      ? {
                        id,
                        labelTh:
                          customItem?.text ||
                          customEmotionText ||
                          p1.noteToMoocaDefault,
                        labelEn:
                          customItem?.text ||
                          customEmotionText ||
                          p1.noteToMoocaDefault,
                        color: '#EC4899',
                        emoji: '',
                        weightDescription: '',
                        recommendedOption:
                          matchOptionFromKeywords(
                            customItem?.text ||
                            customEmotionText ||
                            '',
                            INTERVENTION.A,
                          ),
                      }
                      : EMOTION_TAGS.find(
                        (emotion) => emotion.id === id,
                      );

                    if (!tag) return null;

                    const emotionText = isCustom
                      ? customItem?.text ||
                      customEmotionText ||
                      tag.labelTh
                      : getTagLabel(tag, lang);

                    return (
                      <div
                        key={tag.id}
                        className={styles.miniCloudWrapper}
                      >
                        {/* Scallops */}
                        <div
                          className={
                            styles.miniCloudScallops
                          }
                        >
                          <div
                            className={
                              styles.miniScallopLeft
                            }
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderColor: tag.color,
                            }}
                          />

                          <div
                            className={
                              styles.miniScallopCenter
                            }
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderColor: tag.color,
                            }}
                          />

                          <div
                            className={
                              styles.miniScallopRight
                            }
                            style={{
                              backgroundColor: '#FFFFFF',
                              borderColor: tag.color,
                            }}
                          />
                        </div>

                        {/* Mini Cloud */}
                        <div
                          className={classNames(
                            styles.miniCloudBody,
                            isCustom &&
                            styles.customMiniCloudBody,
                          )}
                          style={{
                            borderColor: tag.color,
                            boxShadow: `0 2px 3px ${tag.color}26`,
                            background: isCustom
                              ? 'linear-gradient(180deg, #FFFFFF, #FDF2F8, #FCE7F3)'
                              : 'linear-gradient(180deg, #FFFFFF, #F0FDFA, #E6FAF8)',
                          }}
                        >
                          <div
                            className={
                              styles.miniPuffIconWrapper
                            }
                            style={{
                              backgroundColor:
                                `${tag.color}1A`,
                            }}
                          >
                            {getEmotionIcon(
                              isCustom
                                ? EMOTION_TAG_ID.CUSTOM
                                : tag.id,
                              tag.color,
                              11,
                            )}
                          </div>

                          <span
                            className={classNames(
                              styles.miniPuffText,
                              isCustom &&
                              styles.customMiniPuffText,
                            )}
                          >
                            {emotionText}
                          </span>

                          <button
                            type="button"
                            className={
                              styles.miniRemoveBtn
                            }
                            onClick={(event) => {
                              event.stopPropagation();

                              audioService.triggerHaptic(
                                HAPTIC_STYLE.LIGHT,
                              );

                              onRemoveEmotion(tag.id);
                            }}
                            aria-label={`Remove ${emotionText}`}
                          >
                            <X
                              size={9}
                              color={DESIGN_TOKENS.color.gray.muted}
                              strokeWidth={2.6}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Glowing Liquid Base */}
              {selectedEmotions.length > 0 && (
                <div
                  className={styles.liquidBase}
                  style={{
                    background: `linear-gradient(
                      to bottom,
                      transparent,
                      ${jarAmbientColor}20,
                      ${jarAmbientColor}44
                    )`,
                  }}
                />
              )}
            </div>
          </div>
        </button>

        {/* Clear Button */}
        <div className={styles.clearBtnSlot}>
          {selectedEmotions.length > 0 && onClearAll ? (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={onClearAll}
            >
              <RotateCcw
                size={10}
                color={DESIGN_TOKENS.color.brand.turquoise.text}
                strokeWidth={2.4}
              />

              <span className={styles.clearBtnText}>
                {p1.clearJar}
              </span>
            </button>
          ) : (
            <div className={styles.clearBtnPlaceholder} />
          )}
        </div>
      </div>
    </div>
  );
};