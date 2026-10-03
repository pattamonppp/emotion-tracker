import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MessageSquareHeart,
  X,
  Star,
  CheckCircle2,
  Sparkles,
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
  typography,
} from '../design-system/tokens';
import {
  MarshmallowButton,
} from '../design-system/MarshmallowButton';
import { audioService } from '../services/audioService';
import { getTranslation } from '../locales';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
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
      useState<
        'spot_on' | 'helpful' | 'needs_work'
      >('spot_on');

    const [selectedAspects, setSelectedAspects] =
      useState<string[]>([
        'audio',
        'reframe',
      ]);

    const [comment, setComment] =
      useState('');

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
        id: 'haptics',
        label: fb.aspectHaptics,
        icon: Activity,
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
    ];

    const ACCURACY = [
      {
        id: 'spot_on',
        label: fb.accuracySpotOn,
        icon: Target,
        color: '#00C4B3',
        bg: '#E6FAF8',
        border: '#00C4B3',
        text: '#00695C',
      },
      {
        id: 'helpful',
        label: fb.accuracyHelpful,
        icon: Lightbulb,
        color: '#F59E0B',
        bg: '#FFFBEB',
        border: '#FCD34D',
        text: '#B45309',
      },
      {
        id: 'needs_work',
        label: fb.accuracyNeedsWork,
        icon: RotateCcw,
        color: '#F43F5E',
        bg: '#FFF1F2',
        border: '#FDA4AF',
        text: '#BE123C',
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
        'success',
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
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <SafeAreaView
          style={styles.safeArea}
        >
          {/* Header */}
          <View style={styles.headerBar}>
            <View
              style={
                styles.headerTitleRow
              }
            >
              <MessageSquareHeart
                size={20}
                color={colors.primary}
              />

              <Text
                style={styles.headerTitle}
              >
                {fb.modalTitle}
              </Text>
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
              <X
                size={18}
                color="#64748B"
              />
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
                    {fb.ratingQuestion}
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
                                'selection',
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
                      size={14}
                      color={
                        STAR_COLORS[
                        rating - 1
                        ]
                      }
                      strokeWidth={2.3}
                      style={{
                        marginRight: 4,
                      }}
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
                      {getRatingText()}
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
                    {fb.accuracyQuestion}
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
                                'selection',
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
                                  : '#64748B'
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
                                    '800',
                                },
                              ]}
                            >
                              {option.label}
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
                    {fb.aspectsQuestion}
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
                                'selection',
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
                                  ? colors.primaryDark
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
                              {
                                aspect.label
                              }
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
                    {fb.commentQuestion}
                  </Text>

                  <TextInput
                    style={styles.textInput}
                    multiline
                    numberOfLines={3}
                    value={comment}
                    onChangeText={
                      setComment
                    }
                    placeholder={
                      fb.commentPlaceholder
                    }
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                {/* Submit */}
                <View
                  style={styles.submitWrap}
                >
                  <MarshmallowButton
                    variant="primary"
                    size="md"
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
                  {fb.successTitle}
                </Text>

                <Text
                  style={
                    styles.successDesc
                  }
                >
                  {fb.successDesc}
                </Text>

                <View
                  style={
                    styles.successButtonWrap
                  }
                >
                  <MarshmallowButton
                    variant="primary"
                    size="md"
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
      </Modal>
    );
  };

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',

    paddingHorizontal: 20,
    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 8,
  },

  headerTitle: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 16,
    fontWeight: '800',

    color: colors.primaryDark,
  },

  closeBtn: {
    padding: 4,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    gap: 20,
  },

  section: {
    gap: 8,
  },

  sectionLabel: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 13,
    fontWeight: '700',

    color: colors.textPrimary,
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

    borderRadius: 12,

    borderWidth: 1,
  },

  starDescText: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 12,
    fontWeight: '700',
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
    fontWeight: '600',

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

    borderColor:
      colors.primary,
  },

  chipText: {
    fontFamily:
      typography.fontPromptMedium,

    fontSize: 12,

    color: '#528984',

    fontWeight: '600',
  },

  chipTextActive: {
    color: colors.primaryDark,

    fontWeight: '700',
  },

  /* Comment */

  textInput: {
    backgroundColor: '#fbfbfb',

    borderRadius: 14,

    borderWidth: 1.5,
    borderColor: '#f1f1f1',

    padding: 12,

    fontFamily:
      typography.fontPromptMedium,

    fontSize: 13,

    color: colors.textPrimary,

    minHeight: 70,

    textAlignVertical: 'top',
  },

  /* Submit */

  submitWrap: {
    marginTop: 8,

    paddingBottom: 24,
  },

  /* Success */

  successCard: {
    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 40,
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
  },

  successButtonWrap: {
    marginTop: 24,

    width: '100%',
  },
});