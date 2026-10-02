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
import {
  Sparkles,
  X,
  Heart,
  Cloud,
  ShieldCheck,
  Smile,
  Wind,
  RotateCcw,
} from 'lucide-react-native';
import { getEmotionIcon } from './FloatingEmotionCloud';
import { MoocaMascot } from './MoocaMascot';
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Circle as SvgCircle } from 'react-native-svg';
import { colors, radii, shadows, typography } from '../design-system/tokens';

interface SpeechMessage {
  text: string;
  iconType: 'sparkles' | 'wind' | 'heart' | 'shield' | 'smile' | 'cloud';
}

const renderSpeechIcon = (iconType: SpeechMessage['iconType']) => {
  switch (iconType) {
    case 'sparkles':
      return <Sparkles size={11} color={colors.primary} strokeWidth={2.4} />;
    case 'wind':
      return <Wind size={11} color="#4A90E2" strokeWidth={2.4} />;
    case 'heart':
      return <Heart size={11} color="#FF6B8B" fill="#FF6B8B" strokeWidth={1.5} />;
    case 'shield':
      return <ShieldCheck size={11} color={colors.primary} strokeWidth={2.4} />;
    case 'smile':
      return <Smile size={11} color="#FA8C3D" strokeWidth={2.4} />;
    case 'cloud':
    default:
      return <Cloud size={11} color={colors.primary} strokeWidth={2.4} />;
  }
};

interface GlassEmotionJarProps {
  selectedEmotions: EmotionTagId[];
  onRemoveEmotion: (id: EmotionTagId) => void;
  onClearAll?: () => void;
  lang: 'th' | 'en';
  onMoocaHug?: () => void;
  customEmotionText?: string;
  customMessages?: Array<{ id: string; text: string }>;
  skyPeriod?: 'dawn' | 'day' | 'sunset' | 'night';
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
  const jarSquishAnim = useRef(new Animated.Value(1)).current;
  const moocaOrbitX = useRef(new Animated.Value(-58)).current;
  const moocaOrbitY = useRef(new Animated.Value(-18)).current;
  const puffBobAnim = useRef(new Animated.Value(0)).current;

  // Speech bubble dynamic appear & disappear animation (like Mooca is talking to user)
  const bubbleOpacityAnim = useRef(new Animated.Value(1)).current;
  const bubbleScaleAnim = useRef(new Animated.Value(1)).current;
  const [speechIndex, setSpeechIndex] = useState(0);

  // Pool of comforting messages that cycle dynamically (Zero emojis - Pure Lucide icons)
  const getSpeechPool = (): SpeechMessage[] => {
    if (selectedEmotions.length >= 3) {
      return lang === 'th'
        ? [
          { text: 'ฉันดูแลอารมณ์ได้มากที่สุดครั้งละ 3 ก้อนเลยนะ', iconType: 'cloud' },
          { text: 'ฉันดูแลอารมณ์ได้มากที่สุดครั้งละ 3 ก้อนเลยนะ พร้อมเริ่มรีเซ็ตใจเลย!', iconType: 'sparkles' },
          { text: 'หายใจเข้าลึก ๆ แล้วกดปุ่มเริ่มด้านล่างได้เลยนะ', iconType: 'wind' },
          { text: 'Mooca จะอยู่ข้าง ๆ เธอเสมอ สู้ ๆ นะ!', iconType: 'heart' },
        ]
        : [
          { text: 'I can look after up to 3 feelings at a time!', iconType: 'cloud' },
          { text: 'I can look after up to 3 feelings at a time! Ready to reset!', iconType: 'sparkles' },
          { text: 'Take a deep breath & tap start below', iconType: 'wind' },
          { text: 'Mooca is always right here with you!', iconType: 'heart' },
        ];
    }
    if (selectedEmotions.length > 0) {
      const hasCustom = selectedEmotions.some((id) => id.startsWith('custom'));
      const customMsg: SpeechMessage[] = hasCustom
        ? (lang === 'th'
          ? [{ text: 'Mooca ได้รับข้อความในใจของเธอแล้วนะ จะคอยกอดไว้อย่างดีเลย!', iconType: 'heart' }]
          : [{ text: 'Mooca received your heart note! Holding it close and safe!', iconType: 'heart' }])
        : [];
      return lang === 'th'
        ? [
          ...customMsg,
          { text: `Mooca ช่วยดูแลให้แล้ว ${selectedEmotions.length} ก้อนนะ สบายใจได้เลย!`, iconType: 'shield' },
          { text: 'เก่งมากเลยนะ ที่กล้าเปิดใจยอมรับความรู้สึกตัวเอง', iconType: 'smile' },
          { text: 'ฉันดูแลอารมณ์ได้มากที่สุดครั้งละ 3 ก้อนเลยนะ', iconType: 'cloud' },
          { text: 'ฝากไว้ในโหลแก้วใส ปลอดภัยแน่นอน', iconType: 'sparkles' },
        ]
        : [
          ...customMsg,
          { text: `Holding ${selectedEmotions.length} feelings safely for you!`, iconType: 'shield' },
          { text: 'Proud of you for embracing your feelings', iconType: 'smile' },
          { text: 'I can look after up to 3 feelings at a time!', iconType: 'cloud' },
          { text: 'Safe inside your clear glass jar', iconType: 'sparkles' },
        ];
    }
    return lang === 'th'
      ? [
        { text: 'พาความกังวลมาฝากไว้กับ Mooca นะ', iconType: 'cloud' },
        { text: 'ฉันดูแลอารมณ์ได้มากที่สุดครั้งละ 3 ก้อนเลยนะ', iconType: 'cloud' },
        { text: 'แตะหรือลากก้อนเมฆอารมณ์ลงโหลได้เลยนะ', iconType: 'sparkles' },
        { text: 'วันนี้ใจเธอเป็นยังไงบ้าง เล่าให้ฟังได้นะ', iconType: 'heart' },
      ]
      : [
        { text: 'Rest your worries here with Mooca', iconType: 'cloud' },
        { text: 'I can look after up to 3 feelings at a time!', iconType: 'cloud' },
        { text: 'Tap or drag emotion clouds into the jar', iconType: 'sparkles' },
        { text: 'How is your heart feeling today?', iconType: 'heart' },
      ];
  };

  const speechPool = getSpeechPool();
  const currentMessage = speechPool[speechIndex % speechPool.length];

  // Dynamic speech bubble cycle: Appear -> Stay 4.8s -> Fade out -> Wait 0.9s -> Fade in with next message
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
          }, 900);
        });
      }, 4800);
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

  // Mooca 360-degree orbital wandering flight all around the jar
  useEffect(() => {
    const orbitLoop = Animated.loop(
      Animated.sequence([
        // Stage 1: Float from Left (-58, -18) to Top-Right (66, -22)
        Animated.parallel([
          Animated.timing(moocaOrbitX, {
            toValue: 66,
            duration: 2700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(moocaOrbitY, {
            toValue: -22,
            duration: 2700,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Stage 2: Drift down wide past the Right Shoulder of the Jar (80, 14)
        Animated.parallel([
          Animated.timing(moocaOrbitX, {
            toValue: 80,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(moocaOrbitY, {
            toValue: 14,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Stage 3: Float across the Front Rim / Neck to Center (0, 6)
        Animated.parallel([
          Animated.timing(moocaOrbitX, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(moocaOrbitY, {
            toValue: 6,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Stage 4: Drift down wide past the Left Shoulder of the Jar (-80, 14)
        Animated.parallel([
          Animated.timing(moocaOrbitX, {
            toValue: -80,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(moocaOrbitY, {
            toValue: 14,
            duration: 2300,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Stage 5: Rise back up along the Left Rim to Top-Left (-58, -18)
        Animated.parallel([
          Animated.timing(moocaOrbitX, {
            toValue: -58,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(moocaOrbitY, {
            toValue: -18,
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    const puffLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(puffBobAnim, {
          toValue: -3,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(puffBobAnim, {
          toValue: 2,
          duration: 1900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    orbitLoop.start();
    puffLoop.start();

    return () => {
      orbitLoop.stop();
      puffLoop.stop();
    };
  }, [moocaOrbitX, moocaOrbitY, puffBobAnim]);

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

  const firstId = selectedEmotions[0];
  const isFirstCustom = firstId?.startsWith('custom');
  const firstTag = selectedEmotions.length > 0
    ? (isFirstCustom ? { color: '#EC4899' } : EMOTION_TAGS.find((t) => t.id === firstId))
    : null;
  const jarAmbientColor = firstTag?.color || '#00C4B3';

  const getJarSunAuraColors = () => {
    switch (skyPeriod) {
      case 'sunset':
        return {
          core: '#f597b0ff',
          mid: '#ffea94ff',
          outer: '#ffffffff',
        };
      case 'dawn':
        return {
          core: '#FFFBEB',
          mid: '#FDE68A',
          outer: '#FED7AA',
        };
      case 'night':
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
  };
  const jarSunAura = getJarSunAuraColors();

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

        {/* Mooca Companion orbiting all around the jar */}
        <Animated.View
          style={[
            styles.moocaPerchContainer,
            {
              transform: [
                { translateX: moocaOrbitX },
                { translateY: moocaOrbitY },
              ],
            },
          ]}
        >
          {/* Sweet Dynamic Speech Bubble (Appears & Disappears Periodically with Lucide Icon) */}
          <Animated.View
            style={[
              styles.moocaSpeechBubble,
              {
                opacity: bubbleOpacityAnim,
                transform: [{ scale: bubbleScaleAnim }],
              },
            ]}
          >
            <View style={styles.speechRow}>
              <View style={styles.speechIconSlot}>
                {renderSpeechIcon(currentMessage.iconType)}
              </View>
              <Text style={styles.moocaSpeechText}>{currentMessage.text}</Text>
            </View>
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

          {/* Soft Diffused Sun-like Aura Halo Feathered to 0% Opacity */}
          <View style={styles.jarAuraContainer} pointerEvents="none">
            <Svg width={280} height={250} style={{ position: 'absolute' }}>
              <Defs>
                <SvgRadialGradient
                  id="jarSunGlow"
                  cx="50%"
                  cy="50%"
                  rx="50%"
                  ry="50%"
                  fx="50%"
                  fy="50%"
                >
                  <Stop offset="0%" stopColor={jarSunAura.core} stopOpacity="0.45" />
                  <Stop offset="42%" stopColor={jarSunAura.mid} stopOpacity="0.22" />
                  <Stop offset="72%" stopColor={jarSunAura.outer} stopOpacity="0.08" />
                  <Stop offset="100%" stopColor={jarSunAura.outer} stopOpacity="0" />
                </SvgRadialGradient>
              </Defs>
              <SvgCircle cx={140} cy={125} r={120} fill="url(#jarSunGlow)" />
            </Svg>
          </View>

          {/* True Transparent Storybook Apothecary Glass Body (Slender Silhouette) */}
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
                    <Sparkles size={20} color="#00C4B3" strokeWidth={2.4} />
                  </View>
                  <Text
                    style={[
                      styles.emptyBadgeTitle,
                      (skyPeriod === 'sunset' || skyPeriod === 'night') && { color: '#ffffffff' },
                      skyPeriod === 'dawn' && { color: '#78350F' },
                    ]}
                  >
                    {lang === 'th' ? 'โหลแก้วว่างพร้อมรับฝาก' : 'Sanctuary Jar Ready'}
                  </Text>
                  <Text
                    style={[
                      styles.emptyBadgeSubtitle,
                      (skyPeriod === 'sunset' || skyPeriod === 'night') && { color: '#fafcffff' },
                      skyPeriod === 'dawn' && { color: '#92400E' },
                    ]}
                  >
                    {lang === 'th'
                      ? 'ลากหรือแตะอารมณ์จากด้านบน'
                      : 'Drag or tap feelings from above'}
                  </Text>
                </View>
              ) : (
                /* Filled State: Floating Cloud Emotions Inside Jar (1 to 3) */
                <Animated.View
                  style={[
                    styles.puffsContainer,
                    { transform: [{ translateY: puffBobAnim }] },
                  ]}
                >
                  {selectedEmotions.map((id) => {
                    const isCustom = id.startsWith('custom');
                    const customItem = customMessages?.find((m) => m.id === id);
                    const tag = isCustom
                      ? {
                        id,
                        labelTh: customItem?.text || customEmotionText || 'ข้อความถึง Mooca',
                        labelEn: customItem?.text || customEmotionText || 'Note to Mooca',
                        color: '#EC4899',
                        emoji: '',
                        weightDescription: '',
                        recommendedOption: 'A' as const,
                      }
                      : EMOTION_TAGS.find((t) => t.id === id);
                    if (!tag) return null;
                    return (
                      <View key={tag.id} style={styles.miniCloudWrapper}>
                        {/* Mini Fluffy Scallop Puffs on top of each in-jar cloud */}
                        <View style={styles.miniCloudScallops}>
                          <View
                            style={[
                              styles.miniScallopLeft,
                              { backgroundColor: '#FFFFFF', borderColor: tag.color },
                            ]}
                          />
                          <View
                            style={[
                              styles.miniScallopCenter,
                              { backgroundColor: '#FFFFFF', borderColor: tag.color },
                            ]}
                          />
                          <View
                            style={[
                              styles.miniScallopRight,
                              { backgroundColor: '#FFFFFF', borderColor: tag.color },
                            ]}
                          />
                        </View>

                        {/* Mini Cloud Body */}
                        <LinearGradient
                          colors={
                            isCustom
                              ? ['#FFFFFF', '#FDF2F8', '#FCE7F3']
                              : ['#FFFFFF', '#F0FDFA', '#E6FAF8']
                          }
                          style={[
                            styles.miniCloudBody,
                            isCustom && styles.customMiniCloudBody,
                            {
                              borderColor: tag.color,
                              shadowColor: tag.color,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.miniPuffIconWrapper,
                              { backgroundColor: tag.color + '1A' },
                            ]}
                          >
                            {getEmotionIcon(isCustom ? 'custom' : tag.id, tag.color, 11)}
                          </View>
                          <Text
                            style={[
                              styles.miniPuffText,
                              isCustom && styles.customMiniPuffText,
                              { color: colors.primaryDark },
                            ]}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {isCustom
                              ? (customItem?.text || customEmotionText || tag.labelTh)
                              : (lang === 'th' ? tag.labelTh : tag.labelEn)}
                          </Text>
                          <TouchableOpacity
                            hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
                            onPress={() => {
                              audioService.triggerHaptic('light');
                              onRemoveEmotion(tag.id);
                            }}
                            style={styles.miniRemoveBtn}
                          >
                            <X size={9} color={colors.textMuted} strokeWidth={2.6} />
                          </TouchableOpacity>
                        </LinearGradient>
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

        {/* Preserved Clear Jar Slot (No Vertical Layout Shift) */}
        <View style={styles.clearBtnSlot}>
          {selectedEmotions.length > 0 && onClearAll ? (
            <TouchableOpacity
              onPress={onClearAll}
              style={styles.clearBtn}
              activeOpacity={0.75}
            >
              <RotateCcw size={10} color={colors.primaryDark} strokeWidth={2.4} />
              <Text style={styles.clearBtnText}>
                {lang === 'th' ? 'เทโหลทิ้งทั้งหมด' : 'Clear Jar'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.clearBtnPlaceholder} />
          )}
        </View>
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
    width: 204,
  },
  moocaPerchContainer: {
    position: 'absolute',
    top: -24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 25,
  },
  moocaSpeechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 11,
    paddingVertical: 4.5,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    ...shadows.soft,
    position: 'relative',
    marginBottom: 4,
    maxWidth: 232,
  },
  speechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4.5,
  },
  speechIconSlot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moocaSpeechText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 9.5,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 13,
  },
  moocaBubbleTail: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -4.5,
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
    alignItems: 'center',
    zIndex: 30,
  },
  glow: {
    position: 'absolute',
    bottom: 8,
    width: 195,
    height: 85,
    borderRadius: 60,
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 3,
    zIndex: 0,
  },
  lidSection: {
    alignItems: 'center',
    zIndex: 10,
  },
  corkKnob: {
    width: 26,
    height: 11,
    backgroundColor: '#C0783E',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderWidth: 1.5,
    borderColor: '#7C3F13',
    zIndex: 3,
  },
  corkLid: {
    width: 94,
    height: 18,
    backgroundColor: '#B87239',
    borderRadius: 9,
    borderWidth: 1.6,
    borderColor: '#7C3F13',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
    zIndex: 2,
    shadowColor: '#7C3F13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2,
    elevation: 3,
  },
  corkTealPool: {
    width: 78,
    height: 9.5,
    borderRadius: 5,
    backgroundColor: '#00A896',
    borderWidth: 1,
    borderColor: '#008577',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corkReflectionDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  neckWrapper: {
    width: 86,
    alignItems: 'center',
    marginTop: -2,
    position: 'relative',
    zIndex: 1,
  },
  glassNeck: {
    width: 80,
    height: 6.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1.3,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    borderRadius: 2.5,
  },
  twineCordLine: {
    position: 'absolute',
    top: 2.2,
    width: 72,
    height: 2,
    backgroundColor: '#9A5826',
    borderRadius: 1,
  },
  charmHanger: {
    position: 'absolute',
    right: 10,
    top: 2.5,
    alignItems: 'center',
    zIndex: 6,
  },
  charmString: {
    width: 1.5,
    height: 18,
    backgroundColor: '#9A5826',
  },
  charmCircle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.6,
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
    width: 2.8,
    height: 2.8,
    borderRadius: 1.4,
    backgroundColor: '#00BFA5',
  },
  jarAuraContainer: {
    position: 'absolute',
    top: 25,
    width: 280,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jarBody: {
    width: 200,
    height: 172,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    marginTop: -2,
    padding: 7,
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
    left: 7,
    width: 3.5,
    height: 108,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 2,
  },
  glassReflectionTop: {
    position: 'absolute',
    top: 6,
    left: 20,
    right: 20,
    height: 2.6,
    borderRadius: 1.3,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    zIndex: 2,
  },
  glassReflectionRight: {
    position: 'absolute',
    top: 18,
    right: 7,
    width: 3,
    height: 75,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    zIndex: 2,
  },
  glassReflectionBottom: {
    position: 'absolute',
    bottom: 5,
    left: 16,
    right: 16,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#99F6E4',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 3,
  },
  emptyBadgeTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11.5,
    color: '#064E3B',
    textAlign: 'center',
  },
  emptyBadgeSubtitle: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 9,
    color: '#475569',
    textAlign: 'center',
    marginTop: 1,
  },
  puffsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingVertical: 4,
    maxWidth: 185,
  },
  miniCloudWrapper: {
    position: 'relative',
    marginVertical: 2,
    alignItems: 'center',
  },
  miniCloudScallops: {
    position: 'absolute',
    top: -4,
    left: 8,
    right: 8,
    height: 8,
    flexDirection: 'row',
    zIndex: 1,
  },
  miniScallopLeft: {
    position: 'absolute',
    left: 4,
    top: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  miniScallopCenter: {
    position: 'absolute',
    left: 12,
    top: -2.5,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  miniScallopRight: {
    position: 'absolute',
    left: 22,
    top: 1.5,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  miniCloudBody: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderBottomWidth: 2,
    gap: 4,
    zIndex: 2,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
    maxWidth: 165,
  },
  customMiniCloudBody: {
    maxWidth: 155,
  },
  miniPuffIconWrapper: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniPuffText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 10.5,
    flexShrink: 1,
  },
  customMiniPuffText: {
    maxWidth: 95,
  },
  miniRemoveBtn: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  liquidBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    zIndex: 1,
  },
  clearBtnSlot: {
    height: 34,
    marginTop: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3.5,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 196, 179, 0.28)',
    ...shadows.soft,
  },
  clearBtnText: {
    fontSize: 9.5,
    fontFamily: typography.fontPromptSemiBold,
    color: colors.primaryDark,
  },
  clearBtnPlaceholder: {
    height: 28,
  },
});
