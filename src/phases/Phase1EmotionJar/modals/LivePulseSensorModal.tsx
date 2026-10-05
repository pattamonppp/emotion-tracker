import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Easing,
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Activity,
  X,
  Heart,
  Leaf,
  Zap,
} from 'lucide-react-native';

import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { Button } from '../../../design-system/Button';
import { getTranslation } from '../../../locales';
import { colors, typography } from '../../../design-system/tokens';
import { Language } from '../../../types';
import { renderBilingualNodes } from '../../../components/BilingualText';
import { MARSHMALLOW_SIZE, MARSHMALLOW_VARIANT, MarshmallowButton } from '../../../design-system/MarshmallowButton';

export interface LivePulseSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBpm: number;
  onUpdateBpm: (bpm: number) => void;
  lang: Language;
}

export const LivePulseSensorModal: React.FC<
  LivePulseSensorModalProps
> = ({
  isOpen,
  onClose,
  currentBpm,
  onUpdateBpm,
  lang,
}) => {
    const strings =
      getTranslation(lang).modals.pulseSensor;

    const [isFingerOnSensor, setIsFingerOnSensor] =
      useState(false);

    const [scanProgress, setScanProgress] =
      useState(0);

    const [measuredBpm, setMeasuredBpm] =
      useState(currentBpm);

    const [isScanComplete, setIsScanComplete] =
      useState(false);

    const scanProgressRef =
      useRef(0);

    const pressScale = useRef(
      new Animated.Value(1),
    ).current;

    useEffect(() => {
      scanProgressRef.current =
        scanProgress;
    }, [scanProgress]);

    /* Reset */

    useEffect(() => {
      if (!isOpen) {
        setIsFingerOnSensor(false);
        setScanProgress(0);
        setIsScanComplete(false);

        scanProgressRef.current = 0;

        pressScale.stopAnimation();
        pressScale.setValue(1);
      }
    }, [
      isOpen,
      pressScale,
    ]);

    /* Scan */

    useEffect(() => {
      if (
        !isFingerOnSensor ||
        isScanComplete
      ) {
        return;
      }

      const interval =
        setInterval(() => {
          const current =
            scanProgressRef.current;

          if (current >= 100) {
            return;
          }

          const next = Math.min(
            current + 5,
            100,
          );

          scanProgressRef.current =
            next;

          setScanProgress(next);
        }, 120);

      return () => {
        clearInterval(interval);
      };
    }, [
      isFingerOnSensor,
      isScanComplete,
    ]);

    /* Haptic */

    useEffect(() => {
      if (
        isFingerOnSensor &&
        scanProgress > 0 &&
        scanProgress < 100 &&
        scanProgress % 20 === 0
      ) {
        audioService.triggerHaptic(
          HAPTIC_STYLE.LIGHT,
        );
      }
    }, [
      isFingerOnSensor,
      scanProgress,
    ]);

    /* Complete */

    useEffect(() => {
      if (
        scanProgress !== 100 ||
        isScanComplete
      ) {
        return;
      }

      const bpm =
        Math.floor(
          76 + Math.random() * 8,
        );

      setMeasuredBpm(bpm);
      setIsScanComplete(true);

      audioService.triggerHaptic(
        HAPTIC_STYLE.SUCCESS,
      );

      audioService.playPulseComplete();

      setTimeout(() => {
        onUpdateBpm(bpm);
      }, 0);
    }, [
      scanProgress,
      isScanComplete,
      onUpdateBpm,
    ]);

    /* Press */

    const handlePressIn = () => {
      Animated.timing(pressScale, {
        toValue: 0.98,
        duration: 80,
        easing: Easing.out(
          Easing.ease,
        ),
        useNativeDriver: true,
      }).start();

      if (isScanComplete) {
        scanProgressRef.current = 0;
        setScanProgress(0);
        setIsScanComplete(false);
      }

      setIsFingerOnSensor(true);

      audioService.triggerHaptic(
        HAPTIC_STYLE.MEDIUM,
      );
    };

    const handlePressOut = () => {
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }).start();

      setIsFingerOnSensor(false);
    };

    const handleClose = () => {
      setIsFingerOnSensor(false);

      scanProgressRef.current = 0;

      setScanProgress(0);
      setIsScanComplete(false);

      pressScale.stopAnimation();
      pressScale.setValue(1);

      onClose();
    };

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.backdrop}>
          <SafeAreaView style={styles.modalCard}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View
                  style={
                    styles.activityIconBox
                  }
                >
                  <Activity
                    size={17}
                    color="#00C4B3"
                  />
                </View>

                <View
                  style={
                    styles.headerTextCol
                  }
                >
                  <Text
                    style={
                      styles.headerTitle
                    }
                  >
                    {
                      renderBilingualNodes(strings.liveCalibrationTitle)
                    }
                  </Text>

                  <Text
                    style={
                      styles.headerSubtitle
                    }
                  >
                    {renderBilingualNodes(strings.headerSubtitle, typography.fontPromptRegular, typography.fontGothamBook)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleClose}
                style={styles.closeBtn}
                hitSlop={8}
              >
                <X
                  size={18}
                  color={colors.textMuted}
                  strokeWidth={2.4}
                />
              </Pressable>
            </View>

            {/* Sensor */}
            <View style={styles.touchpadZone}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <Animated.View
                  style={[
                    styles.touchpadPad,
                    isFingerOnSensor &&
                    styles.touchpadPadSensing,
                    {
                      transform: [
                        {
                          scale: pressScale,
                        },
                      ],
                    },
                  ]}
                >
                  {/* Web 0 0 0 6px rgba(239, 119, 115, 0.15) outer halo */}
                  {isFingerOnSensor && (
                    <View
                      pointerEvents="none"
                      style={styles.touchpadOuterHalo}
                    />
                  )}

                  {/* Web ::before equivalent (170x170px) */}
                  <View
                    pointerEvents="none"
                    style={[
                      styles.touchpadRing,
                      isFingerOnSensor &&
                      styles.touchpadRingSensing,
                    ]}
                  />

                  <Heart
                    size={44}
                    color={
                      isFingerOnSensor
                        ? '#EF7773'
                        : '#00C4B3'
                    }
                    fill={
                      isFingerOnSensor
                        ? '#EF7773'
                        : 'transparent'
                    }
                  />

                  <Text
                    style={
                      styles.touchpadProgress
                    }
                  >
                    {renderBilingualNodes(
                      isFingerOnSensor
                        ? `${scanProgress}%`
                        : isScanComplete
                          ? strings.calibrated
                          : strings.holdFinger,
                      typography.fontPromptMedium,
                      typography.fontGotham
                    )}
                  </Text>
                </Animated.View>
              </Pressable>

              <Text
                style={
                  styles.touchpadInstruction
                }
              >
                {renderBilingualNodes(strings.touchInstruction)}
              </Text>
            </View>

            {/* Metrics */}
            <View
              style={
                styles.metricsGrid
              }
            >
              <View
                style={styles.metricBox}
              >
                <Text
                  style={
                    styles.metricBoxLabel
                  }
                >
                  {renderBilingualNodes(strings.heartRate)}
                </Text>

                <Text
                  style={
                    styles.metricBoxValue
                  }
                >
                  {measuredBpm}

                  <Text
                    style={
                      styles.metricBoxUnit
                    }
                  >
                    {' '}
                    bpm
                  </Text>
                </Text>
              </View>

              <View
                style={
                  styles.metricDivider
                }
              />

              <View
                style={styles.metricBox}
              >
                <Text
                  style={
                    styles.metricBoxLabel
                  }
                >
                  {renderBilingualNodes(strings.autonomicState)}
                </Text>

                <View
                  style={
                    styles.stateBoxValue
                  }
                >
                  {measuredBpm < 85 ? (
                    <View
                      style={
                        styles.stateTagParasympathetic
                      }
                    >
                      <Leaf
                        size={13}
                        color="#047857"
                      />

                      <Text
                        style={
                          styles.stateTagParasympatheticText
                        }
                      >
                        {
                          renderBilingualNodes(strings.parasympathetic, typography.fontPromptMedium, typography.fontGotham)
                        }
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={
                        styles.stateTagSympathetic
                      }
                    >
                      <Zap
                        size={13}
                        color="#E44743"
                      />

                      <Text
                        style={
                          styles.stateTagSympatheticText
                        }
                      >
                        {
                          renderBilingualNodes(strings.sympathetic, typography.fontPromptMedium, typography.fontGotham)
                        }
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Footer */}
            <View
              style={
                styles.footerArea
              }
            >
              <MarshmallowButton
                variant={MARSHMALLOW_VARIANT.PRIMARY}
                size={MARSHMALLOW_SIZE.MD}
                title={strings.confirmBtn}
                onPress={handleClose}
              />
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    );
  };

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    padding: 16,

    backgroundColor:
      'rgba(15, 23, 42, 0.55)',
  },

  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '100%',

    display: 'flex',
    flexDirection: 'column',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 16,

    overflow: 'hidden',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.14,
    shadowRadius: 20,

    elevation: 10,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,

    gap: 12,
  },

  activityIconBox: {
    width: 32,
    height: 32,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 16,

    backgroundColor: '#E0F8F6',
  },

  headerTextCol: {
    flex: 1,

    flexDirection: 'column',

    gap: 1,
  },

  headerTitle: {
    margin: 0,

    fontFamily:
      typography.fontPromptBold,

    fontSize: 16,
    fontWeight: '700',

    lineHeight: 24,

    color: colors.primaryDark,
  },

  headerSubtitle: {
    margin: 0,

    fontFamily:
      typography.fontPromptRegular,

    fontSize: 11,
    fontWeight: '400',

    lineHeight: 16,

    color: '#637b91',
  },

  closeBtn: {
    width: 32,
    height: 32,

    padding: 6,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 16,
  },

  /* Sensor */

  touchpadZone: {
    flexDirection: 'column',

    alignItems: 'center',

    marginVertical: 24,
  },

  /*
   * Main 215px circle.
   * The web pseudo-element is represented by
   * touchpadRing inside this view.
   */
  touchpadPad: {
    position: 'relative',

    width: 215,
    height: 215,
    gap: 4,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 107.5,

    backgroundColor: '#FFFFFF',

    borderWidth: 1.5,
    borderColor: '#DBF0EE',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 2,
  },

  touchpadOuterHalo: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 227,
    height: 227,
    borderRadius: 113.5,
    borderWidth: 6,
    borderColor: 'rgba(239, 119, 115, 0.18)',
  },

  touchpadPadSensing: {
    borderColor: '#EF7773',

    backgroundColor: '#FDEFEE',

    shadowColor: '#EF7773',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,

    elevation: 4,
  },

  /*
   * Exact web ::before equivalent:
   *
   * width: 170px
   * height: 170px
   * border: 2px solid #B3EDE8
   */
  touchpadRing: {
    position: 'absolute',

    width: 170,
    height: 170,

    borderRadius: 85,

    borderWidth: 2,

    borderColor: '#B3EDE8',

    pointerEvents: 'none',
  },

  touchpadRingSensing: {
    borderColor: '#EF7773',
  },

  touchpadProgress: {
    marginTop: 8,

    fontFamily:
      typography.fontPromptMedium,

    fontSize: 11,
    fontWeight: '500',

    lineHeight: 14,

    color: '#355956',

    textAlign: 'center',

    zIndex: 1,
  },

  /*
   * Same normal-flow spacing as:
   *
   * margin-top: 14px
   */
  touchpadInstruction: {
    marginTop: 14,

    fontFamily:
      typography.fontPromptMedium,

    fontSize: 11,
    fontWeight: '500',

    lineHeight: 15,

    textAlign: 'center',

    color: colors.textSecondary,
  },

  /* Metrics */

  metricsGrid: {
    width: '100%',

    flexDirection: 'row',

    backgroundColor: '#fbfbfb',

    borderRadius: 16,

    borderWidth: 1,
    borderColor: '#f1f1f1',

    overflow: 'hidden',
  },

  metricBox: {
    flex: 1,

    minHeight: 96,

    flexDirection: 'column',

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  metricDivider: {
    width: 1,
    height: '100%',

    alignSelf: 'center',

    backgroundColor: '#f1f1f1',
  },

  metricBoxLabel: {
    marginBottom: 4,

    fontFamily:
      typography.fontPromptBold,

    fontSize: 11,
    fontWeight: '700',

    lineHeight: 16,

    textAlign: 'center',

    color: colors.textSecondary,
  },

  metricBoxValue: {
    fontFamily:
      typography.fontGothamBold,

    fontSize: 28,

    lineHeight: 34,

    color: '#355956',

    textAlign: 'center',
    textTransform: 'uppercase',
  },

  metricBoxUnit: {
    fontFamily:
      typography.fontGothamBold,

    fontSize: 11,
    fontWeight: '600',

    color: '#79ADA9',
  },

  stateBoxValue: {
    minHeight: 34,

    alignItems: 'center',
    justifyContent: 'center',
  },

  stateTagParasympathetic: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor: '#DCF3D1',
  },

  stateTagParasympatheticText: {
    fontFamily:
      typography.fontPromptMedium,

    fontSize: 9,
    fontWeight: '500',

    color: '#047857',
  },

  stateTagSympathetic: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor: '#FAD6D5',
  },

  stateTagSympatheticText: {
    fontFamily:
      typography.fontPromptMedium,

    fontSize: 9,
    fontWeight: '500',

    color: '#E44743',
  },

  /* Footer */

  footerArea: {
    width: '100%',
    paddingTop: 16,
  },
});

export default LivePulseSensorModal;