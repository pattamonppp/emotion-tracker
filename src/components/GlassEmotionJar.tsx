import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Sparkles, X } from 'lucide-react-native';
import { getEmotionIcon } from './FloatingEmotionCloud';
import { MoocaMascot } from './MoocaMascot';
import { colors, radii, shadows, typography } from '../design-system/tokens';

interface GlassEmotionJarProps {
  selectedEmotions: EmotionTagId[];
  onRemoveEmotion: (id: EmotionTagId) => void;
  onClearAll?: () => void;
  lang: 'th' | 'en';
  onMoocaHug?: () => void;
}

export const GlassEmotionJar: React.FC<GlassEmotionJarProps> = ({
  selectedEmotions,
  onRemoveEmotion,
  onClearAll,
  lang,
  onMoocaHug,
}) => {
  const jarSquishAnim = useRef(new Animated.Value(1)).current;
  const moocaFloatAnim = useRef(new Animated.Value(0)).current;
  const moocaSwayAnim = useRef(new Animated.Value(0)).current;
  const puffBobAnim = useRef(new Animated.Value(0)).current;

  // Speech bubble dynamic appear & disappear animation (like Mooca is talking to user)
  const bubbleOpacityAnim = useRef(new Animated.Value(1)).current;
  const bubbleScaleAnim = useRef(new Animated.Value(1)).current;
  const [speechIndex, setSpeechIndex] = useState(0);

  // Pool of comforting messages that cycle dynamically
  const getSpeechPool = () => {
    if (selectedEmotions.length >= 3) {
      return lang === 'th'
        ? [
            'รับฝากครบ 3 อารมณ์แล้วนะ พร้อมเริ่มรีเซ็ตใจเลย! 🌿',
            'หายใจเข้าลึก ๆ แล้วกดปุ่มเริ่มด้านล่างได้เลยนะ 💫',
            'Mooca จะอยู่ข้าง ๆ เธอเสมอ สู้ ๆ นะ! 💖',
          ]
        : [
            '3 feelings kept safely! Ready to reset! 🌿',
            'Take a deep breath & tap start below 💫',
            'Mooca is always right here with you! 💖',
          ];
    }
    if (selectedEmotions.length > 0) {
      return lang === 'th'
        ? [
            `Mooca ช่วยดูแลให้แล้ว ${selectedEmotions.length} ก้อนนะ สบายใจได้เลย! ☁️`,
            'เก่งมากเลยนะ ที่กล้าเปิดใจยอมรับความรู้สึกตัวเอง 🌸',
            'ฝากไว้ในโหลแก้วใส ปลอดภัยแน่นอน ✨',
            'อยากฝากเพิ่มอีกไหมนะ (ได้สูงสุด 3 ก้อน) 🫧',
          ]
        : [
            `Holding ${selectedEmotions.length} feelings safely for you! ☁️`,
            'Proud of you for embracing your feelings 🌸',
            'Safe inside your clear glass jar ✨',
            'Want to store more? (up to 3 feelings) 🫧',
          ];
    }
    return lang === 'th'
      ? [
          'พาความกังวลมาฝากไว้กับ Mooca นะ ☁️',
          'แตะหรือลากก้อนเมฆอารมณ์ลงโหลได้เลยนะ ✨',
          'วันนี้ใจเธอเป็นยังไงบ้าง เล่าให้ฟังได้นะ 💖',
          'เลือกฝากได้สูงสุด 3 อารมณ์น้า 🫧',
        ]
      : [
          'Rest your worries here with Mooca ☁️',
          'Tap or drag emotion clouds into the jar ✨',
          'How is your heart feeling today? 💖',
          'Choose up to 3 feelings to store 🫧',
        ];
  };

  const speechPool = getSpeechPool();
  const currentMessage = speechPool[speechIndex % speechPool.length];

  // Dynamic speech bubble cycle: Appear -> Stay 4.5s -> Fade out -> Wait 2s -> Fade in with next message
  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setTimeout>;

    const cycleBubble = () => {
      timer = setTimeout(() => {
        if (!isMounted) return;
        // Fade out gently
        Animated.parallel([
          Animated.timing(bubbleOpacityAnim, {
            toValue: 0,
            duration: 380,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleScaleAnim, {
            toValue: 0.88,
            duration: 380,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (!isMounted) return;
          // Stay hidden briefly as if pausing speech
          timer = setTimeout(() => {
            if (!isMounted) return;
            setSpeechIndex((prev) => prev + 1);
            // Fade in with gentle spring bounce
            Animated.parallel([
              Animated.timing(bubbleOpacityAnim, {
                toValue: 1,
                duration: 420,
                useNativeDriver: true,
              }),
              Animated.spring(bubbleScaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 160,
                useNativeDriver: true,
              }),
            ]).start(() => {
              if (!isMounted) return;
              cycleBubble();
            });
          }, 2000);
        });
      }, 4200);
    };

    // When emotions count changes: trigger an immediate fresh fade-in
    bubbleOpacityAnim.setValue(0);
    bubbleScaleAnim.setValue(0.85);
    Animated.parallel([
      Animated.timing(bubbleOpacityAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(bubbleScaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();

    cycleBubble();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedEmotions.length, lang]);

  // Gentle floating & smooth drifting motion for Mooca (drifting around the jar)
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(moocaFloatAnim, {
          toValue: -5,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moocaFloatAnim, {
          toValue: 4,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    // Drifts smoothly back and forth across the upper jar
    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(moocaSwayAnim, {
          toValue: 18,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moocaSwayAnim, {
          toValue: -18,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const puffLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(puffBobAnim, {
          toValue: -3.5,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(puffBobAnim, {
          toValue: 2.5,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    swayLoop.start();
    puffLoop.start();

    return () => {
      floatLoop.stop();
      swayLoop.stop();
      puffLoop.stop();
    };
  }, [moocaFloatAnim, moocaSwayAnim, puffBobAnim]);

  const handleJarTap = () => {
    audioService.triggerHaptic('light');
    Animated.sequence([
      Animated.timing(jarSquishAnim, {
        toValue: 0.97,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.spring(jarSquishAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const firstTag = selectedEmotions.length > 0
    ? EMOTION_TAGS.find((t) => t.id === selectedEmotions[0])
    : null;
  const jarAmbientColor = firstTag?.color || '#00C4B3';

  return (
    <Animated.View style={{ transform: [{ scale: jarSquishAnim }] }}>
      <View style={styles.container}>
        {/* Soft Magic Ambient Floor Glow */}
        <View
          style={[
            styles.glow,
            {
              backgroundColor: jarAmbientColor,
              opacity: selectedEmotions.length > 0 ? 0.28 : 0.12,
            },
          ]}
        />

        {/* Mooca Companion floating & drifting back and forth around the jar */}
        <Animated.View
          style={[
            styles.moocaPerchContainer,
            {
              transform: [
                { translateY: moocaFloatAnim },
                { translateX: moocaSwayAnim },
              ],
            },
          ]}
        >
          {/* Sweet Dynamic Speech Bubble (Appears & Disappears Periodically) */}
          <Animated.View
            style={[
              styles.moocaSpeechBubble,
              {
                opacity: bubbleOpacityAnim,
                transform: [{ scale: bubbleScaleAnim }],
              },
            ]}
          >
            <Text style={styles.moocaSpeechText}>{currentMessage}</Text>
            <View style={styles.moocaBubbleTail} />
          </Animated.View>

          {/* Interactive Mooca Mascot */}
          <View style={styles.moocaMascotWrapper}>
            <MoocaMascot
              mood={selectedEmotions.length > 0 ? 'comforting' : 'happy'}
              size="xs"
              interactive={true}
              onHug={onMoocaHug}
            />
          </View>
        </Animated.View>

        <TouchableOpacity
          activeOpacity={0.96}
          onPress={handleJarTap}
          style={{ alignItems: 'center' }}
        >
          {/* Reference Lid Section: Wooden Knob Handle, Cork Lid with Turquoise Seal & Hanging Charm */}
          <View style={styles.lidSection}>
            {/* Top Wooden Knob Handle */}
            <View style={styles.corkKnob} />

            {/* Main Wooden Cork Lid with Turquoise Inner Pool & Specular Shine */}
            <View style={styles.corkLid}>
              <View style={styles.corkTealPool}>
                <View style={styles.corkReflectionDot} />
              </View>
            </View>

            {/* Glass Neck & Tied Twine Cord with Hanging Charm */}
            <View style={styles.neckWrapper}>
              <View style={styles.glassNeck} />
              {/* Tied Twine Cord Line around Neck */}
              <View style={styles.twineCordLine} />

              {/* Hanging String & Round Charm Tag on Right */}
              <View style={styles.charmHanger}>
                <View style={styles.charmString} />
                <View style={styles.charmCircle}>
                  <View style={styles.charmInnerDot} />
                </View>
              </View>
            </View>
          </View>

          {/* True Transparent Storybook Apothecary Glass Body (Scaled & Compact) */}
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.28)',
              'rgba(230, 250, 248, 0.08)',
              'rgba(255, 255, 255, 0.18)',
            ]}
            style={styles.jarBody}
          >
            {/* Glass Wall Curved Reflection Highlights */}
            <View style={styles.glassReflectionLeft} />
            <View style={styles.glassReflectionTop} />
            <View style={styles.glassReflectionRight} />
            <View style={styles.glassReflectionBottom} />

            {/* Contents Inside the Transparent Glass Jar */}
            <View style={styles.jarInner}>
              {selectedEmotions.length === 0 ? (
                /* Empty State: Matching Reference Image (Center Sparkle Badge + Subtitle) */
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyCircleBadge}>
                    <Sparkles size={22} color="#00C4B3" strokeWidth={2.4} />
                  </View>
                  <Text style={styles.emptyBadgeTitle}>
                    {lang === 'th' ? 'โหลแก้วว่างพร้อมรับฝาก' : 'Sanctuary Jar Ready'}
                  </Text>
                  <Text style={styles.emptyBadgeSubtitle}>
                    {lang === 'th'
                      ? 'ลากหรือแตะอารมณ์จากด้านบน'
                      : 'Drag or tap feelings from above'}
                  </Text>
                </View>
              ) : (
                /* Filled State: Floating Marshmallow Emotion Pills (1 to 3) */
                <Animated.View
                  style={[
                    styles.puffsContainer,
                    { transform: [{ translateY: puffBobAnim }] },
                  ]}
                >
                  {selectedEmotions.map((id) => {
                    const tag = EMOTION_TAGS.find((t) => t.id === id);
                    if (!tag) return null;
                    return (
                      <View
                        key={tag.id}
                        style={[
                          styles.marshmallowPuff,
                          {
                            borderColor: tag.color,
                            shadowColor: tag.color,
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.puffIconWrapper,
                            { backgroundColor: tag.color + '20' },
                          ]}
                        >
                          {getEmotionIcon(tag.id, tag.color, 12)}
                        </View>
                        <Text style={[styles.puffText, { color: colors.primaryDark }]}>
                          {lang === 'th' ? tag.labelTh : tag.labelEn}
                        </Text>
                        <TouchableOpacity
                          hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
                          onPress={() => {
                            audioService.triggerHaptic('light');
                            onRemoveEmotion(tag.id);
                          }}
                          style={styles.removePuffBtn}
                        >
                          <X size={10} color={colors.textMuted} strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </Animated.View>
              )}

              {/* Glowing Liquid Base inside Jar */}
              {selectedEmotions.length > 0 && (
                <LinearGradient
                  colors={['transparent', jarAmbientColor + '20', jarAmbientColor + '44']}
                  style={styles.liquidBase}
                />
              )}
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Clear All Link Button */}
        {selectedEmotions.length > 0 && onClearAll && (
          <TouchableOpacity onPress={onClearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>
              {lang === 'th' ? 'เทโหลทิ้งทั้งหมด' : 'Clear Jar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
    width: 240,
  },
  moocaPerchContainer: {
    position: 'absolute',
    top: -22,
    left: -16,
    alignItems: 'flex-start',
    zIndex: 25,
  },
  moocaSpeechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    ...shadows.soft,
    position: 'relative',
    marginBottom: 3,
    maxWidth: 195,
  },
  moocaSpeechText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 9.5,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 13.5,
  },
  moocaBubbleTail: {
    position: 'absolute',
    bottom: -5,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 4.5,
    borderRightWidth: 4.5,
    borderTopWidth: 5,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 196, 179, 0.35)',
  },
  moocaMascotWrapper: {
    marginLeft: 10,
    zIndex: 30,
  },
  glow: {
    position: 'absolute',
    bottom: 10,
    width: 230,
    height: 95,
    borderRadius: 70,
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 3,
    zIndex: 0,
  },
  lidSection: {
    alignItems: 'center',
    zIndex: 10,
  },
  corkKnob: {
    width: 30,
    height: 12,
    backgroundColor: '#C0783E',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 2.5,
    borderBottomRightRadius: 2.5,
    borderWidth: 1.6,
    borderColor: '#7C3F13',
    zIndex: 3,
  },
  corkLid: {
    width: 108,
    height: 22,
    backgroundColor: '#B87239',
    borderRadius: 11,
    borderWidth: 1.8,
    borderColor: '#7C3F13',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
    zIndex: 2,
    shadowColor: '#7C3F13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.5,
    elevation: 3,
  },
  corkTealPool: {
    width: 92,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00A896',
    borderWidth: 1,
    borderColor: '#008577',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corkReflectionDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  neckWrapper: {
    width: 98,
    alignItems: 'center',
    marginTop: -2,
    position: 'relative',
    zIndex: 1,
  },
  glassNeck: {
    width: 94,
    height: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1.3,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    borderRadius: 2.5,
  },
  twineCordLine: {
    position: 'absolute',
    top: 2.5,
    width: 86,
    height: 2,
    backgroundColor: '#9A5826',
    borderRadius: 1,
  },
  charmHanger: {
    position: 'absolute',
    right: 15,
    top: 3,
    alignItems: 'center',
    zIndex: 6,
  },
  charmString: {
    width: 1.5,
    height: 20,
    backgroundColor: '#9A5826',
  },
  charmCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.8,
    borderColor: '#00BFA5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00BFA5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  charmInnerDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#00BFA5',
  },
  jarBody: {
    width: 236,
    height: 168,
    borderTopLeftRadius: 62,
    borderTopRightRadius: 62,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    marginTop: -2,
    padding: 8,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 4,
  },
  glassReflectionLeft: {
    position: 'absolute',
    top: 12,
    left: 8,
    width: 4,
    height: 105,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 2,
  },
  glassReflectionTop: {
    position: 'absolute',
    top: 7,
    left: 24,
    right: 24,
    height: 2.8,
    borderRadius: 1.4,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    zIndex: 2,
  },
  glassReflectionRight: {
    position: 'absolute',
    top: 18,
    right: 8,
    width: 3,
    height: 75,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    zIndex: 2,
  },
  glassReflectionBottom: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    right: 20,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    zIndex: 2,
  },
  jarInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  emptyCircleBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#99F6E4',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 3,
  },
  emptyBadgeTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12.5,
    color: '#064E3B',
    textAlign: 'center',
  },
  emptyBadgeSubtitle: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 9.5,
    color: '#475569',
    textAlign: 'center',
    marginTop: 1,
  },
  puffsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 6,
    paddingVertical: 4,
    maxWidth: 215,
  },
  marshmallowPuff: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: radii.full,
    borderWidth: 1.4,
    gap: 4,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  puffIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puffText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10.5,
  },
  removePuffBtn: {
    padding: 1.5,
    marginLeft: 1,
  },
  liquidBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    zIndex: 1,
  },
  clearBtn: {
    marginTop: 2,
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 196, 179, 0.25)',
    ...shadows.soft,
  },
  clearBtnText: {
    fontSize: 9.5,
    fontFamily: typography.fontPromptMedium,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
