import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EmotionTagId } from '../types';
import { EMOTION_TAGS } from '../data/matrixData';
import { audioService } from '../services/audioService';
import { Sparkles, X } from 'lucide-react-native';
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
  const handleJarTap = () => {
    audioService.triggerHaptic('light');
  };

  const firstTag = selectedEmotions.length > 0
    ? EMOTION_TAGS.find((t) => t.id === selectedEmotions[0])
    : null;
  const jarAmbientColor = firstTag?.color || colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handleJarTap}
      style={styles.container}
    >
      {/* Background Glow */}
      <View
        style={[
          styles.glow,
          {
            backgroundColor: selectedEmotions.length > 0 ? jarAmbientColor : colors.primaryMuted,
            opacity: selectedEmotions.length > 0 ? 0.35 : 0.18,
          },
        ]}
      />

      {/* Jar Lid / Cork */}
      <View style={styles.jarLidWrapper}>
        <View style={styles.corkTop} />
        <View style={styles.jarNeck} />
      </View>

      {/* Main Glass Jar Body */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(230, 249, 247, 0.85)', 'rgba(255, 255, 255, 0.92)']}
        style={styles.jarBody}
      >
        {/* Reflection Highlight on Left Glass Wall */}
        <View style={styles.reflection} />

        {/* Content Inside Jar */}
        <View style={styles.jarContent}>
          {selectedEmotions.length === 0 ? (
            <View style={styles.emptyPrompt}>
              <Sparkles size={20} color={colors.primary} />
              <Text style={styles.emptyPromptText}>
                {lang === 'th'
                  ? 'แตะเลือกความกังวลด้านล่าง\nเพื่อกักเก็บไว้ในโหลใบนี้'
                  : 'Tap worries below\nto safely seal inside the jar'}
              </Text>
            </View>
          ) : (
            <View style={styles.tagsContainer}>
              {selectedEmotions.map((id) => {
                const tag = EMOTION_TAGS.find((t) => t.id === id);
                if (!tag) return null;
                return (
                  <View
                    key={tag.id}
                    style={[styles.tagPill, { backgroundColor: tag.color + '22', borderColor: tag.color }]}
                  >
                    <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                    <Text style={[styles.tagText, { color: colors.textPrimary }]}>
                      {lang === 'th' ? tag.labelTh : tag.labelEn}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        audioService.triggerHaptic('light');
                        onRemoveEmotion(tag.id);
                      }}
                      style={styles.tagRemoveBtn}
                    >
                      <X size={13} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Liquid Bottom Glow */}
        {selectedEmotions.length > 0 && (
          <LinearGradient
            colors={[jarAmbientColor + '44', jarAmbientColor + '11']}
            style={styles.liquidBase}
          />
        )}
      </LinearGradient>

      {/* Clear All Button */}
      {selectedEmotions.length > 0 && onClearAll && (
        <TouchableOpacity
          onPress={() => {
            audioService.triggerHaptic('medium');
            onClearAll();
          }}
          style={styles.clearBtn}
        >
          <Text style={styles.clearBtnText}>
            {lang === 'th' ? 'เทโหลทั้งหมด' : 'Clear Jar'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  jarLidWrapper: {
    alignItems: 'center',
  },
  corkTop: {
    width: 90,
    height: 12,
    backgroundColor: '#D97706',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderWidth: 1.5,
    borderColor: '#B45309',
  },
  jarNeck: {
    width: 110,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.borderTeal,
  },
  jarBody: {
    width: 210,
    minHeight: 180,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: colors.borderTeal,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.soft,
  },
  reflection: {
    position: 'absolute',
    left: 12,
    top: 14,
    bottom: 14,
    width: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  jarContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  emptyPrompt: {
    alignItems: 'center',
    gap: 8,
  },
  emptyPromptText: {
    fontSize: 12,
    color: colors.primaryDark,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    borderWidth: 1.5,
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagRemoveBtn: {
    marginLeft: 6,
    padding: 2,
  },
  liquidBase: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
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
