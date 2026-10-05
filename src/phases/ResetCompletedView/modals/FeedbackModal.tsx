import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MessageSquareHeart,
  X,
  Star,
  CheckCircle2,
  Headphones,
  Activity,
  Heart,
  Target,
  Lightbulb,
  RotateCcw,
  GlassWater,
  Frown,
  Meh,
  Smile,
  Laugh,
  PartyPopper,
} from 'lucide-react-native';
import {
  colors,
  shadows,
  typography,
} from '../../../design-system/tokens';
import {
  MARSHMALLOW_SIZE,
  MARSHMALLOW_VARIANT,
  MarshmallowButton,
} from '../../../design-system/MarshmallowButton';
import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { getTranslation } from '../../../locales';
import { FEEDBACK_ACCURACY, FeedbackAccuracy, Language } from '../../../types';
import { renderBilingualNodes } from '../../../components/BilingualText';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const FeedbackModal: React.FC<
  FeedbackModalProps
> = ({
  isOpen,
  onClose,
  lang,
}) => {
    const [rating, setRating] =
      useState<number>(5);

    const [accuracy, setAccuracy] =
      useState<FeedbackAccuracy>(FEEDBACK_ACCURACY.SPOT_ON);

    const [selectedAspects, setSelectedAspects] =
      useState<string[]>([
        'audio',
        'reframe',
      ]);

    const [comment, setComment] =
      useState('');

    const [isFocused, setIsFocused] =
      useState(false);

    const [submitted, setSubmitted] =
      useState(false);

    const t = getTranslation(lang);
    const fb = t.feedback;

    const ASPECTS = [
      {
        id: 'audio',
        label: fb.aspectAudio,
        icon: Headphones,
      },
      {
        id: 'reframe',
        label: fb.aspectReframe,
        icon: MessageSquareHeart,
      },
      {
        id: 'sip',
        label: fb.aspectSip,
        icon: GlassWater,
      },
      {
        id: 'mbti',
        label: fb.aspectMbti,
        icon: Heart,
      },
      {
        id: 'haptics',
        label: fb.aspectHaptics,
        icon: Activity,
      },
    ];

    const ACCURACY = [
      {
        id: FEEDBACK_ACCURACY.SPOT_ON,
        label: fb.accuracySpotOn,
        icon: Target,
        color: '#009688',
        bg: '#E0F8F6',
        border: '#00C4B3',
        text: '#009688',
      },
      {
        id: FEEDBACK_ACCURACY.HELPFUL,
        label: fb.accuracyHelpful,
        icon: Lightbulb,
        color: '#DF8900',
        bg: '#FCF4E0',
        border: '#F8E4B3',
        text: '#DF8900',
      },
      {
        id: FEEDBACK_ACCURACY.NEEDS_WORK,
        label: fb.accuracyNeedsWork,
        icon: RotateCcw,
        color: '#EF7773',
        bg: '#FDEFEE',
        border: '#FAD6D5',
        text: '#EF7773',
      },
    ] as const;

    const STAR_COLORS = [
      '#F43F5E',
      '#F97316',
      '#F59E0B',
      '#84CC16',
      '#10B981',
    ];

    const RATING_ICONS = [
      Frown,
      Meh,
      Smile,
      Laugh,
      PartyPopper,
    ];

    const toggleAspect = (
      id: string,
    ) => {
      setSelectedAspects((prev) =>
        prev.includes(id)
          ? prev.filter(
            (a) => a !== id,
          )
          : [...prev, id],
      );
    };

    const handleSubmit = () => {
      setSubmitted(true);

      audioService.triggerHaptic(
        HAPTIC_STYLE.SUCCESS,
      );

      audioService.playJarDrop();
    };

    const handleClose = () => {
      setSubmitted(false);
      onClose();
    };

    const getRatingText = () => {
      if (rating === 5) {
        return fb.rating5;
      }

      if (rating === 4) {
        return fb.rating4;
      }

      if (rating === 3) {
        return fb.rating3;
      }

      return fb.rating1;
    };

    const RatingIcon =
      RATING_ICONS[rating - 1];

    return (
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.backdrop}>
          <SafeAreaView
            style={styles.modalCard}
          >
            {/* Header */}
            <View style={styles.headerBar}>
              <View style={styles.headerTitleRow}>
                <View style={styles.iconCircle}>
                  <MessageSquareHeart size={16} color="#00C4B3" strokeWidth={2.4} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>
                    {renderBilingualNodes(fb.modalTitle, typography.fontPromptBold, typography.fontGothamBold)}
                  </Text>
                  <Text style={styles.headerSubtitle}>
                    {renderBilingualNodes(fb.modalSubtitle, typography.fontPromptRegular, typography.fontGothamBook)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeBtn}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >
                <X size={18} color="#79ADA9" strokeWidth={2.4} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={
                styles.scrollContent
              }
              showsVerticalScrollIndicator={
                false
              }
            >
              {!submitted ? (
                <>
                  {/* Rating */}
                  <View style={styles.section}>
                    <Text
                      style={
                        styles.sectionLabel
                      }
                    >
                      {renderBilingualNodes(fb.ratingQuestion, typography.fontPromptBold, typography.fontGothamBold)}
                    </Text>

                    <View
                      style={styles.starsRow}
                    >
                      {[1, 2, 3, 4, 5].map(
                        (star) => {
                          const isSelected =
                            rating >= star;

                          const starColor =
                            STAR_COLORS[
                            star - 1
                            ];

                          return (
                            <TouchableOpacity
                              key={star}
                              onPress={() => {
                                setRating(
                                  star,
                                );

                                audioService.triggerHaptic(
                                  HAPTIC_STYLE.SELECTION,
                                );
                              }}
                              activeOpacity={0.8}
                              style={
                                styles.starTouch
                              }
                            >
                              <Star
                                size={32}
                                color={
                                  isSelected
                                    ? starColor
                                    : '#CBD5E1'
                                }
                                fill={
                                  isSelected
                                    ? starColor
                                    : 'transparent'
                                }
                                strokeWidth={
                                  2.2
                                }
                              />
                            </TouchableOpacity>
                          );
                        },
                      )}
                    </View>

                    <View
                      style={[
                        styles.starDescBadge,
                        {
                          backgroundColor:
                            `${STAR_COLORS[rating - 1]}14`,
                          borderColor:
                            `${STAR_COLORS[rating - 1]}55`,
                        },
                      ]}
                    >
                      <RatingIcon
                        size={12}
                        color={
                          STAR_COLORS[
                          rating - 1
                          ]
                        }
                        strokeWidth={2}
                      />

                      <Text
                        style={[
                          styles.starDescText,
                          {
                            color:
                              STAR_COLORS[
                              rating - 1
                              ],
                          },
                        ]}
                      >
                        {renderBilingualNodes(getRatingText(), typography.fontPromptBold, typography.fontGothamBold)}
                      </Text>
                    </View>
                  </View>

                  {/* Accuracy */}
                  <View style={styles.section}>
                    <Text
                      style={
                        styles.sectionLabel
                      }
                    >
                      {renderBilingualNodes(fb.accuracyQuestion, typography.fontPromptBold, typography.fontGothamBold)}
                    </Text>

                    <View
                      style={styles.accuracyRow}
                    >
                      {ACCURACY.map(
                        (option) => {
                          const isSelected =
                            accuracy ===
                            option.id;

                          const IconComp =
                            option.icon;

                          return (
                            <TouchableOpacity
                              key={option.id}
                              activeOpacity={0.8}
                              onPress={() => {
                                setAccuracy(
                                  option.id,
                                );

                                audioService.triggerHaptic(
                                  HAPTIC_STYLE.SELECTION,
                                );
                              }}
                              style={[
                                styles.accuracyCard,
                                isSelected && {
                                  backgroundColor:
                                    option.bg,
                                  borderColor:
                                    option.border,
                                },
                              ]}
                            >
                              <IconComp
                                size={18}
                                color={
                                  isSelected
                                    ? option.color
                                    : '#79ADA9'
                                }
                                strokeWidth={
                                  2.3
                                }
                                style={{
                                  marginBottom: 4,
                                }}
                              />

                              <Text
                                style={[
                                  styles.accuracyText,
                                  isSelected && {
                                    color:
                                      option.text,
                                    fontWeight:
                                      '700',
                                  },
                                ]}
                              >
                                {renderBilingualNodes(
                                  option.label,
                                  isSelected ? typography.fontPromptBold : typography.fontPromptMedium,
                                  isSelected ? typography.fontGothamBold : typography.fontGotham
                                )}
                              </Text>
                            </TouchableOpacity>
                          );
                        },
                      )}
                    </View>
                  </View>

                  {/* Aspects */}
                  <View style={styles.section}>
                    <Text
                      style={
                        styles.sectionLabel
                      }
                    >
                      {renderBilingualNodes(fb.aspectsQuestion, typography.fontPromptBold, typography.fontGothamBold)}
                    </Text>

                    <View
                      style={styles.chipsWrap}
                    >
                      {ASPECTS.map(
                        (aspect) => {
                          const isSelected =
                            selectedAspects.includes(
                              aspect.id,
                            );

                          const AspectIcon =
                            aspect.icon;

                          return (
                            <TouchableOpacity
                              key={aspect.id}
                              activeOpacity={0.8}
                              onPress={() => {
                                toggleAspect(
                                  aspect.id,
                                );

                                audioService.triggerHaptic(
                                  HAPTIC_STYLE.SELECTION,
                                );
                              }}
                              style={[
                                styles.chip,
                                isSelected &&
                                styles.chipActive,
                              ]}
                            >
                              <AspectIcon
                                size={14}
                                color={
                                  isSelected
                                    ? '#009688'
                                    : '#64748B'
                                }
                                style={{
                                  marginRight: 6,
                                }}
                              />

                              <Text
                                style={[
                                  styles.chipText,
                                  isSelected &&
                                  styles.chipTextActive,
                                ]}
                              >
                                {renderBilingualNodes(
                                  aspect.label,
                                  isSelected ? typography.fontPromptSemiBold : typography.fontPromptMedium,
                                  isSelected ? typography.fontGothamBold : typography.fontGotham
                                )}
                              </Text>
                            </TouchableOpacity>
                          );
                        },
                      )}
                    </View>
                  </View>

                  {/* Comment */}
                  <View style={styles.section}>
                    <Text
                      style={
                        styles.sectionLabel
                      }
                    >
                      {renderBilingualNodes(fb.commentQuestion, typography.fontPromptBold, typography.fontGothamBold)}
                    </Text>

                    <TextInput
                      style={[
                        styles.textInput,
                        isFocused && styles.textInputFocused,
                      ]}
                      multiline
                      numberOfLines={3}
                      value={comment}
                      onChangeText={
                        setComment
                      }
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={
                        fb.commentPlaceholder
                      }
                      placeholderTextColor="#637b91"
                    />
                  </View>

                  {/* Submit */}
                  <View>
                    <MarshmallowButton
                      variant={MARSHMALLOW_VARIANT.PRIMARY}
                      size={MARSHMALLOW_SIZE.MD}
                      onPress={
                        handleSubmit
                      }
                      icon={
                        <CheckCircle2
                          size={16}
                          color="#FFFFFF"
                        />
                      }
                      title={
                        fb.submitButton
                      }
                    />
                  </View>
                </>
              ) : (
                <View
                  style={
                    styles.successCard
                  }
                >
                  <View
                    style={
                      styles.successIconCircle
                    }
                  >
                    <CheckCircle2
                      size={40}
                      color={colors.primary}
                    />
                  </View>

                  <Text
                    style={
                      styles.successTitle
                    }
                  >
                    {renderBilingualNodes(fb.successTitle, typography.fontPromptBold, typography.fontGothamBold)}
                  </Text>

                  <Text
                    style={
                      styles.successDesc
                    }
                  >
                    {renderBilingualNodes(fb.successDesc, typography.fontPromptLight, typography.fontGotham)}
                  </Text>

                  <View
                    style={
                      styles.successButtonWrap
                    }
                  >
                    <MarshmallowButton
                      variant={MARSHMALLOW_VARIANT.PRIMARY}
                      size={MARSHMALLOW_SIZE.MD}
                      onPress={
                        handleClose
                      }
                      title={
                        fb.doneButton
                      }
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    ...shadows.soft,
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F8F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 16,
    lineHeight: 24,

    color: colors.primaryDark,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },

  headerSubtitle: {
    fontFamily:
      typography.fontPromptRegular,

    fontSize: 11,
    lineHeight: 16,

    color: '#637b91',
    ...(Platform.OS !== 'android' ? { fontWeight: '400' } : {}),
  },

  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,

    gap: 20,
  },

  section: {
    gap: 8,
  },

  sectionLabel: {
    fontFamily:
      typography.fontPromptRegular,

    fontSize: 11,

    color: colors.textSecondary,
    ...(Platform.OS !== 'android' ? { fontWeight: '400' } : {}),
  },

  /* Stars */

  starsRow: {
    flexDirection: 'row',

    justifyContent: 'center',

    gap: 12,

    marginVertical: 4,
  },

  starTouch: {
    padding: 4,
  },

  starDescBadge: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    alignSelf: 'center',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 9999,

    borderWidth: 1,
    gap: 6,
  },

  starDescText: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 12,
    fontWeight: '500',
  },

  /* Accuracy */

  accuracyRow: {
    flexDirection: 'row',

    gap: 8,
  },

  accuracyCard: {
    flex: 1,

    minHeight: 76,

    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,

    paddingVertical: 12,
    paddingHorizontal: 6,

    borderRadius: 14,

    backgroundColor: '#fbfbfb',

    borderWidth: 1.5,
    borderColor: '#f1f1f1',
  },

  accuracyText: {
    fontFamily:
      typography.fontPromptMedium,

    fontSize: 11,
    fontWeight: '500',

    color: '#79ADA9',

    textAlign: 'center',
  },

  /* Aspect Chips */

  chipsWrap: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    gap: 8,
  },

  chip: {
    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
    paddingVertical: 8,

    borderRadius: 12,

    backgroundColor: '#fbfbfb',

    borderWidth: 1,
    borderColor: '#f1f1f1',
  },

  chipActive: {
    backgroundColor: '#E0F8F6',

    borderColor: '#00c4b3',
  },

  chipText: {
    fontFamily:
      typography.fontPromptMedium,

    fontSize: 12,

    color: '#528984',

    fontWeight: '500',
  },

  chipTextActive: {
    color: '#009688',
    fontWeight: '600',
  },

  /* Comment */

  textInput: {
    backgroundColor: '#fbfbfb',

    borderRadius: 14,

    borderWidth: 1.5,
    borderColor: '#cdd8e1',

    paddingVertical: 12,
    paddingHorizontal: 14,

    fontFamily:
      typography.fontPromptMedium,

    fontSize: 13,

    color: '#26313c',

    minHeight: 80,

    textAlignVertical: 'top',
  },

  textInputFocused: {
    borderColor: '#00c4b3',
    backgroundColor: '#ffffff',
  },

  /* Success */

  successCard: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 20,
    paddingHorizontal: 20,
  },

  successIconCircle: {
    width: 72,
    height: 72,

    borderRadius: 36,

    backgroundColor: '#E0F8F6',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 16,
  },

  successTitle: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 18,
    fontWeight: '800',

    color: colors.primaryDark,

    marginBottom: 8,
  },

  successDesc: {
    fontFamily:
      typography.fontPromptMedium,

    fontSize: 13,

    color: colors.textSecondary,

    textAlign: 'center',

    lineHeight: 20,
    maxWidth: '80%',
  },

  successButtonWrap: {
    marginTop: 24,

    width: '100%',
  },
});