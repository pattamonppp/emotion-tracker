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
import { typography } from '../../../design-system/tokens';
import { Language } from '../../../types';

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

    const pulseScale = useRef(
      new Animated.Value(1),
    ).current;

    const pulseAnimationRef =
      useRef<Animated.CompositeAnimation | null>(
        null,
      );

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

        pulseScale.stopAnimation();
        pulseScale.setValue(1);

        pulseAnimationRef.current?.stop();
      }
    }, [
      isOpen,
      pressScale,
      pulseScale,
    ]);

    /* Active ring animation */

    useEffect(() => {
      pulseAnimationRef.current?.stop();

      if (!isFingerOnSensor) {
        Animated.spring(pulseScale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 80,
        }).start();

        return;
      }

      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.03,
            duration: 700,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 700,
            easing: Easing.inOut(
              Easing.ease,
            ),
            useNativeDriver: true,
          }),
        ]),
      );

      pulseAnimationRef.current =
        animation;

      animation.start();

      return () => {
        animation.stop();
      };
    }, [
      isFingerOnSensor,
      pulseScale,
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

      pulseScale.stopAnimation();
      pulseScale.setValue(1);

      pulseAnimationRef.current?.stop();

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
                      strings.liveCalibrationTitle
                    }
                  </Text>

                  <Text
                    style={
                      styles.headerSubtitle
                    }
                  >
                    {strings.headerSubtitle}
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
                  color="#64748B"
                />
              </Pressable>
            </View>

            {/* Sensor */}
            <View style={styles.touchpadZone}>
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
                onStartShouldSetResponder={() =>
                  true
                }
                onResponderGrant={
                  handlePressIn
                }
                onResponderRelease={
                  handlePressOut
                }
                onResponderTerminate={
                  handlePressOut
                }
                onResponderTerminationRequest={() =>
                  false
                }
              >
                {/* Web ::before equivalent */}
                <Animated.View
                  pointerEvents="none"
                  style={[
                    styles.touchpadRing,
                    isFingerOnSensor &&
                    styles.touchpadRingSensing,
                    {
                      transform: [
                        {
                          scale: pulseScale,
                        },
                      ],
                    },
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
                  {isFingerOnSensor
                    ? `${scanProgress}%`
                    : isScanComplete
                      ? strings.calibrated
                      : strings.holdFinger}
                </Text>
              </Animated.View>

              <Text
                style={
                  styles.touchpadInstruction
                }
              >
                {strings.touchInstruction}
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
                  {strings.heartRate}
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
                  {strings.autonomicState}
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
                          strings.parasympathetic
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
                        color="#BE123C"
                      />

                      <Text
                        style={
                          styles.stateTagSympatheticText
                        }
                      >
                        {
                          strings.sympathetic
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
              <Button
                variant="primary"
                size="md"
                fullWidth
                onPress={handleClose}
              >
                {strings.confirmBtn}
              </Button>
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

    padding: 20,

    backgroundColor:
      'rgba(15, 23, 42, 0.38)',
  },

  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '100%',

    display: 'flex',
    flexDirection: 'column',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

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
    minHeight: 56,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 20,
    paddingVertical: 14,

    borderBottomWidth: 1,
    borderBottomColor: '#cdd8e1',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,

    gap: 10,
  },

  activityIconBox: {
    width: 32,
    height: 32,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 9,

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

    fontSize: 15,
    fontWeight: '800',

    lineHeight: 20,

    color: '#009688',
  },

  headerSubtitle: {
    margin: 0,

    fontFamily:
      typography.fontPromptMedium,

    fontSize: 10,
    fontWeight: '500',

    lineHeight: 14,

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

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 107.5,

    backgroundColor: '#FFFFFF',

    borderWidth: 1.5,
    borderColor: '#cdd8e1',

    shadowColor: '#355956',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 1.5,

    overflow: 'hidden',
  },

  touchpadPadSensing: {
    borderColor: '#EF7773',

    backgroundColor:
      'rgba(239, 119, 115, 0.08)',

    shadowColor: '#EF7773',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
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
    fontWeight: '700',

    lineHeight: 14,

    color: '#637b91',

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

    fontSize: 10,
    fontWeight: '500',

    lineHeight: 15,

    textAlign: 'center',

    color: '#79ADA9',
  },

  /* Metrics */

  metricsGrid: {
    marginHorizontal: 24,

    flexDirection: 'row',

    backgroundColor: '#fbfbfb',

    borderRadius: 16,

    borderWidth: 1,
    borderColor: '#cdd8e1',

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
    height: 36,

    alignSelf: 'center',

    backgroundColor: '#cdd8e1',
  },

  metricBoxLabel: {
    marginBottom: 4,

    fontFamily:
      typography.fontPromptMedium,

    fontSize: 12,
    fontWeight: '600',

    lineHeight: 16,

    textAlign: 'center',

    color: '#637b91',
  },

  metricBoxValue: {
    fontFamily:
      typography.fontGothamBold,

    fontSize: 28,

    lineHeight: 34,

    color: '#009688',

    textAlign: 'center',
  },

  metricBoxUnit: {
    fontFamily:
      typography.fontGothamBold,

    fontSize: 11,

    color: '#637b91',
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
      typography.fontPromptBold,

    fontSize: 9,
    fontWeight: '700',

    color: '#047857',
  },

  stateTagSympathetic: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 5,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 999,

    backgroundColor: '#FDEFEE',
  },

  stateTagSympatheticText: {
    fontFamily:
      typography.fontPromptBold,

    fontSize: 9,
    fontWeight: '700',

    color: '#EB6460',
  },

  /* Footer */

  footerArea: {
    width: '100%',

    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
});

export default LivePulseSensorModal;