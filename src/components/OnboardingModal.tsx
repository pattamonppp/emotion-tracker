import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile, GoalType } from '../types';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import {
  GraduationCap,
  Mic,
  Briefcase,
  BatteryCharging,
  Check,
  X,
  User,
} from 'lucide-react-native';
import { colors, radii, typography } from '../design-system/tokens';
import { audioService } from '../services/audioService';
import { getTranslation } from '../locales';
import { MODAL_CONFIG } from '../constants';

export interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSave,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const lang = profile.language;
  const t = getTranslation(lang);
  const o = t.modals.onboarding;

  const GOALS: { id: GoalType; label: string; icon: any; color: string }[] = [
    {
      id: 'exam',
      label: o.goalExam,
      icon: GraduationCap,
      color: colors.primary,
    },
    {
      id: 'stage',
      label: o.goalStage,
      icon: Mic,
      color: colors.secondary,
    },
    {
      id: 'work',
      label: o.goalWork,
      icon: Briefcase,
      color: colors.accentBlue,
    },
    {
      id: 'burnout',
      label: o.goalBurnout,
      icon: BatteryCharging,
      color: colors.success,
    },
  ];

  const handleSave = () => {
    audioService.triggerHaptic('success');
    onSave(profile);
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>
            {o.profileTitle}
          </Text>
          {onClose && (
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Mascot Greeting */}
          <View style={styles.mascotBox}>
            <MoocaMascot
              mood="happy"
              size="sm"
              speakingBubble={o.tailoredBubble}
            />
          </View>

          {/* Name Field */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {o.yourName}
            </Text>
            <View style={styles.inputRow}>
              <User size={16} color={colors.primary} style={{ marginLeft: 12 }} />
              <TextInput
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder={o.namePlaceholder}
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Goal Selector */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {o.primaryContext}
            </Text>
            <View style={styles.goalsGrid}>
              {GOALS.map((g) => {
                const isSelected = profile.goal === g.id;
                const IconComponent = g.icon;
                return (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => {
                      audioService.triggerHaptic('selection');
                      setProfile({ ...profile, goal: g.id });
                    }}
                    style={[
                      styles.goalCard,
                      isSelected && { borderColor: g.color, backgroundColor: g.color + '15' },
                    ]}
                  >
                    <IconComponent size={20} color={g.color} />
                    <Text style={[styles.goalLabel, isSelected && { color: colors.primaryDark, fontWeight: '800' }]}>
                      {g.label}
                    </Text>
                    {isSelected && <Check size={14} color={g.color} strokeWidth={3} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* MBTI Selector */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {o.mbtiSpecific}
            </Text>
            <View style={styles.mbtiGrid}>
              {MODAL_CONFIG.mbtiOptions.map((m) => {
                const isSelected = profile.mbti === m;
                return (
                  <TouchableOpacity
                    key={m}
                    onPress={() => {
                      audioService.triggerHaptic('selection');
                      setProfile({ ...profile, mbti: m });
                    }}
                    style={[
                      styles.mbtiChip,
                      isSelected && styles.mbtiChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.mbtiChipText,
                        isSelected && styles.mbtiChipTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Save Button */}
          <View style={styles.saveSection}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleSave}
              icon={<Check size={18} color="#FFFFFF" />}
            >
              {o.saveSettings}
            </Button>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  headerTitle: {
    fontFamily: typography.fontPromptExtraBold,
    fontSize: 16,
    color: colors.primaryDark,
    ...(Platform.OS !== 'android' ? { fontWeight: '800' } : {}),
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  mascotBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 145,
    paddingBottom: 4,
    marginVertical: 4,
    overflow: 'visible',
  },
  fieldSection: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 2,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: typography.fontPromptSemiBold,
    ...(Platform.OS !== 'android' ? { fontWeight: '600' } : {}),
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#fbfbfb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    gap: 8,
  },
  goalLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mbtiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  mbtiChip: {
    width: '23%',
    paddingVertical: 8,
    borderRadius: radii.md,
    backgroundColor: '#fbfbfb',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mbtiChipActive: {
    backgroundColor: '#E0F8F6',
    borderColor: colors.primary,
  },
  mbtiChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  mbtiChipTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  saveSection: {
    marginTop: 8,
    paddingBottom: 24,
  },
});
