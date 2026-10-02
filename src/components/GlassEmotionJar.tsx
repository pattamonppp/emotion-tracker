import React, { useRef, useEffect } from 'react';
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

  // Gentle floating & swaying animation for Mooca playfully orbiting near the jar
  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(moocaFloatAnim, {
          toValue: -5,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moocaFloatAnim, {
          toValue: 4,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const swayLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(moocaSwayAnim, {
          toValue: 4,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(moocaSwayAnim, {
          toValue: -4,
          duration: 3400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const puffLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(puffBobAnim, {
          toValue: -4,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(puffBobAnim, {
          toValue: 3,
          duration: 2000,
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
              opacity: selectedEmotions.length > 0 ? 0.28 : 0.14,
            },
          ]}
        />

        {/* Mooca Companion playfully orbiting with speech bubble */}
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
          {/* Sweet Speech Bubble from Mooca */}
          <View style={styles.moocaSpeechBubble}>
            <Text style={styles.moocaSpeechText}>
              {selectedEmotions.length >= 3
                ? (lang === 'th'
                  ? 'รับฝากครบ 3 อารมณ์แล้วนะ พร้อมเริ่มรีเซ็ตใจเลย!'
                  : '3 feelings safely kept! Ready to reset!')
                : selectedEmotions.length > 0
                ? (lang === 'th'
                  ? `Mooca ช่วยดูแลให้แล้ว ${selectedEmotions.length} ก้อน!`
                  : `Holding ${selectedEmotions.length} feelings safely!`)
                : (lang === 'th'
                  ? 'พาความกังวลมาฝากไว้กับ Mooca นะ'
                  : 'Rest your worries here with Mooca')}
            </Text>
            <View style={styles.moocaBubbleTail} />
          </View>

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
          {/* Reference Lid Section: Wooden Knob Handle, Cork Lid with Teal Seal & Hanging Charm */}
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

          {/* True Transparent Storybook Apothecary Glass Body */}
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
                    <Sparkles size={26} color="#00C4B3" strokeWidth={2.4} />
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
                          {getEmotionIcon(tag.id, tag.color, 14)}
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
                          <X size={11} color={colors.textMuted} strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </Animated.View>
              )}

              {/* Glowing Liquid Base inside Jar */}
              {selectedEmotions.length > 0 && (
                <LinearGradient
                  colors={['transparent', jarAmbientColor + '22', jarAmbientColor + '48']}
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
    width: 280,
  },
  moocaPerchContainer: {
    position: 'absolute',
    top: -24,
    left: -20,
    alignItems: 'flex-start',
    zIndex: 25,
  },
  moocaSpeechBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    ...shadows.soft,
    position: 'relative',
    marginBottom: 4,
    maxWidth: 200,
  },
  moocaSpeechText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 10,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 14,
  },
  moocaBubbleTail: {
    position: 'absolute',
    bottom: -5,
    left: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 5,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 196, 179, 0.35)',
  },
  moocaMascotWrapper: {
    marginLeft: 14,
    zIndex: 30,
  },
  glow: {
    position: 'absolute',
    bottom: 15,
    width: 260,
    height: 110,
    borderRadius: 80,
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 4,
    zIndex: 0,
  },
  lidSection: {
    alignItems: 'center',
    zIndex: 10,
  },
  corkKnob: {
    width: 36,
    height: 14,
    backgroundColor: '#C0783E',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderWidth: 1.8,
    borderColor: '#7C3F13',
    zIndex: 3,
  },
  corkLid: {
    width: 128,
    height: 25,
    backgroundColor: '#B87239',
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#7C3F13',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
    zIndex: 2,
    shadowColor: '#7C3F13',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  corkTealPool: {
    width: 110,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00A896',
    borderWidth: 1,
    borderColor: '#008577',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corkReflectionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  neckWrapper: {
    width: 116,
    alignItems: 'center',
    marginTop: -2,
    position: 'relative',
    zIndex: 1,
  },
  glassNeck: {
    width: 112,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 196, 179, 0.38)',
    borderRadius: 3,
  },
  twineCordLine: {
    position: 'absolute',
    top: 3,
    width: 102,
    height: 2.2,
    backgroundColor: '#9A5826',
    borderRadius: 1,
  },
  charmHanger: {
    position: 'absolute',
    right: 20,
    top: 4,
    alignItems: 'center',
    zIndex: 6,
  },
  charmString: {
    width: 1.6,
    height: 24,
    backgroundColor: '#9A5826',
  },
  charmCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
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
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: '#00BFA5',
  },
  jarBody: {
    width: 270,
    height: 200,
    borderTopLeftRadius: 65,
    borderTopRightRadius: 65,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    borderWidth: 2.2,
    borderColor: 'rgba(255, 255, 255, 0.92)',
    marginTop: -2,
    padding: 10,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 22,
    elevation: 5,
  },
  glassReflectionLeft: {
    position: 'absolute',
    top: 14,
    left: 9,
    width: 4.5,
    height: 125,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 2,
  },
  glassReflectionTop: {
    position: 'absolute',
    top: 8,
    left: 28,
    right: 28,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    zIndex: 2,
  },
  glassReflectionRight: {
    position: 'absolute',
    top: 22,
    right: 9,
    width: 3.5,
    height: 90,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.52)',
    zIndex: 2,
  },
  glassReflectionBottom: {
    position: 'absolute',
    bottom: 6,
    left: 24,
    right: 24,
    height: 3.5,
    borderRadius: 2,
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
    gap: 4,
    paddingVertical: 8,
  },
  emptyCircleBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.2,
    borderColor: '#99F6E4',
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 4,
  },
  emptyBadgeTitle: {
    fontFamily: typography.fontPromptBold,
    fontSize: 13.5,
    color: '#064E3B',
    textAlign: 'center',
  },
  emptyBadgeSubtitle: {
    fontFamily: typography.fontPromptMedium,
    fontSize: 10.5,
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
  },
  puffsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxWidth: 245,
  },
  marshmallowPuff: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5.5,
    borderRadius: radii.full,
    borderWidth: 1.5,
    gap: 5,
    backgroundColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 3,
  },
  puffIconWrapper: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  puffText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
  },
  removePuffBtn: {
    padding: 2,
    marginLeft: 1,
  },
  liquidBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 38,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 1,
  },
  clearBtn: {
    marginTop: 3,
    paddingVertical: 2.5,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 196, 179, 0.25)',
    ...shadows.soft,
  },
  clearBtnText: {
    fontSize: 10,
    fontFamily: typography.fontPromptMedium,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
