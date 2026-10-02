import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Sparkles, X } from 'lucide-react-native';
import { getEmotionIcon } from './FloatingEmotionCloud';
import { colors, radii, shadows } from '../design-system/tokens';

interface GlassEmotionJarProps {
  selectedEmotions: EmotionTagId[];
  onRemoveEmotion: (id: EmotionTagId) => void;
  onClearAll?: () => void;
  lang: 'th' | 'en';
}

export const GlassEmotionJar: React.FC<GlassEmotionJarProps> = ({
  selectedEmotions,
  onRemoveEmotion,
  onClearAll,
  lang,
}) => {
  const jarSquishAnim = useRef(new Animated.Value(1)).current;

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
      <TouchableOpacity
        activeOpacity={0.96}
        onPress={handleJarTap}
        style={styles.container}
      >
        {/* Soft Magic Ambient Glow */}
        <View
          style={[
            styles.glow,
            {
              backgroundColor: jarAmbientColor,
              opacity: selectedEmotions.length > 0 ? 0.32 : 0.16,
            },
          ]}
        />

        {/* Storybook Apothecary Jar: Cork Lid & Knitted Scarf Bow */}
        <View style={styles.lidSection}>
          {/* Wooden Cork Stopper */}
          <View style={styles.corkCap}>
            <View style={styles.corkWoodGrain1} />
            <View style={styles.corkWoodGrain2} />
          </View>
          <View style={styles.corkBase} />

          {/* Jar Glass Lip / Rim */}
          <View style={styles.glassRim} />

          {/* Mooca's Knitted Scarf Ribbon Bow Tied Around Neck */}
          <View style={styles.bowContainer}>
            <View style={styles.bowKnot}>
              <View style={styles.bowLeftLoop} />
              <View style={styles.bowRightLoop} />
              <View style={styles.bowCenterRibbon} />
              <View style={styles.bowTailLeft} />
              <View style={styles.bowTailRight} />
            </View>
          </View>
        </View>

        {/* Curvy Apothecary Glass Body */}
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.96)',
            'rgba(230, 249, 247, 0.88)',
            'rgba(255, 255, 255, 0.94)',
          ]}
          style={styles.jarBody}
        >
          {/* Glass Wall Reflection Highlights */}
          <View style={styles.glassReflectionLeft} />
          <View style={styles.glassReflectionRight} />

          {/* Magical Contents Inside Jar */}
          <View style={styles.jarInner}>
            {selectedEmotions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.sparkleIconWrapper}>
                  <Sparkles size={22} color={colors.primary} />
                </View>
                <Text style={styles.emptyTitle}>
                  {lang === 'th' ? 'โหลแก้วเวทมนตร์ของ Mooca' : "Mooca's Magic Jar"}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {lang === 'th'
                    ? 'แตะก้อนเมฆอารมณ์ด้านล่าง\nเพื่อกักเก็บความกังวลไว้ที่นี่น้า'
                    : 'Tap emotion puffs below\nto safely store worries here'}
                </Text>
              </View>
            ) : (
              <View style={styles.puffsContainer}>
                {selectedEmotions.map((id) => {
                  const tag = EMOTION_TAGS.find((t) => t.id === id);
                  if (!tag) return null;
                  return (
                    <View
                      key={tag.id}
                      style={[
                        styles.marshmallowPuff,
                        {
                          backgroundColor: tag.color + '22',
                          borderColor: tag.color,
                        },
                      ]}
                    >
                      <View style={{ marginRight: 6 }}>
                        {getEmotionIcon(tag.id, tag.color, 16)}
                      </View>
                      <Text style={[styles.puffText, { color: colors.primaryDark }]}>
                        {lang === 'th' ? tag.labelTh : tag.labelEn}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          audioService.triggerHaptic('light');
                          onRemoveEmotion(tag.id);
                        }}
                        style={styles.removePuffBtn}
                      >
                        <X size={12} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Glowing Liquid Base */}
            {selectedEmotions.length > 0 && (
              <LinearGradient
                colors={['transparent', jarAmbientColor + '30', jarAmbientColor + '55']}
                style={styles.liquidBase}
              />
            )}
          </View>
        </LinearGradient>

        {/* Clear All Link Button */}
        {selectedEmotions.length > 0 && onClearAll && (
          <TouchableOpacity onPress={onClearAll} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>
              {lang === 'th' ? 'เทโหลทิ้งทั้งหมด' : 'Clear Jar'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  glow: {
    position: 'absolute',
    width: 250,
    height: 180,
    borderRadius: 90,
    shadowColor: '#00C4B3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 6,
    zIndex: 0,
  },
  lidSection: {
    alignItems: 'center',
    zIndex: 10,
  },
  corkCap: {
    width: 68,
    height: 18,
    backgroundColor: '#C68347',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1.5,
    borderColor: '#8E5323',
    position: 'relative',
    overflow: 'hidden',
  },
  corkWoodGrain1: {
    position: 'absolute',
    left: 12,
    top: 3,
    width: 20,
    height: 1.5,
    backgroundColor: '#8E5323',
    borderRadius: 1,
    opacity: 0.6,
  },
  corkWoodGrain2: {
    position: 'absolute',
    right: 14,
    top: 9,
    width: 16,
    height: 1.5,
    backgroundColor: '#8E5323',
    borderRadius: 1,
    opacity: 0.6,
  },
  corkBase: {
    width: 58,
    height: 8,
    backgroundColor: '#B57438',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#8E5323',
  },
  glassRim: {
    width: 78,
    height: 10,
    backgroundColor: '#E0F7F5',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 196, 179, 0.4)',
    marginTop: -2,
    zIndex: 5,
  },
  bowContainer: {
    position: 'absolute',
    bottom: -10,
    zIndex: 15,
    alignItems: 'center',
  },
  bowKnot: {
    position: 'relative',
    width: 44,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bowCenterRibbon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FA8C3D',
    borderWidth: 1.5,
    borderColor: '#D97706',
    zIndex: 4,
  },
  bowLeftLoop: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 18,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#FA8C3D',
    borderWidth: 1.5,
    borderColor: '#D97706',
    transform: [{ rotate: '-18deg' }],
    zIndex: 2,
  },
  bowRightLoop: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 18,
    height: 14,
    borderRadius: 8,
    backgroundColor: '#FA8C3D',
    borderWidth: 1.5,
    borderColor: '#D97706',
    transform: [{ rotate: '18deg' }],
    zIndex: 2,
  },
  bowTailLeft: {
    position: 'absolute',
    left: 10,
    bottom: -8,
    width: 6,
    height: 12,
    backgroundColor: '#FA8C3D',
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderRadius: 3,
    transform: [{ rotate: '-24deg' }],
    zIndex: 1,
  },
  bowTailRight: {
    position: 'absolute',
    right: 10,
    bottom: -8,
    width: 6,
    height: 12,
    backgroundColor: '#FA8C3D',
    borderWidth: 1.2,
    borderColor: '#D97706',
    borderRadius: 3,
    transform: [{ rotate: '24deg' }],
    zIndex: 1,
  },
  jarBody: {
    width: 250,
    minHeight: 180,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(0, 196, 179, 0.35)',
    marginTop: -4,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.tealGlow,
  },
  glassReflectionLeft: {
    position: 'absolute',
    top: 14,
    left: 12,
    width: 8,
    height: 120,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    zIndex: 2,
  },
  glassReflectionRight: {
    position: 'absolute',
    top: 20,
    right: 14,
    width: 4,
    height: 80,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
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
    gap: 6,
    paddingVertical: 12,
  },
  sparkleIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E6F9F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#B3EDE8',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
  puffsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  marshmallowPuff: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1.5,
    gap: 6,
    backgroundColor: '#FFFFFF',
    ...shadows.soft,
  },
  puffEmoji: {
    fontSize: 15,
  },
  puffText: {
    fontSize: 12,
    fontWeight: '700',
  },
  removePuffBtn: {
    padding: 2,
    marginLeft: 2,
  },
  liquidBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    zIndex: 1,
  },
  clearBtn: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  clearBtnText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
