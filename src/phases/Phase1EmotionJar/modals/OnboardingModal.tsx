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
import { UserProfile, GoalType } from '../../../types';
import { Button } from '../../../design-system/Button';
import { MOOCA_MOOD, MoocaMascot } from '../../../components/MoocaMascot';
import {
  GraduationCap,
  Mic,
  Briefcase,
  BatteryCharging,
  Check,
  X,
  User,
} from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../../design-system/tokens';
import { audioService, HAPTIC_STYLE } from '../../../services/audioService';
import { getTranslation } from '../../../locales';
import { MODAL_CONFIG } from '../../../constants';
import { GOAL } from '../../../../src_web/types';
import { renderBilingualNodes } from '../../../components/BilingualText';
import { MarshmallowButton, MARSHMALLOW_VARIANT, MARSHMALLOW_SIZE } from '../../../design-system/MarshmallowButton';

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
  const [isFocused, setIsFocused] = useState(false);
  const lang = profile.language;
  const t = getTranslation(lang);
  const o = t.modals.onboarding;

  const GOALS: { id: GoalType; label: string; icon: any; color: string }[] = [
    {
      id: GOAL.EXAM,
      label: o.goalExam,
      icon: GraduationCap,
      color: colors.primary,
    },
    {
      id: GOAL.STAGE,
      label: o.goalStage,
      icon: Mic,
      color: colors.secondary,
    },
    {
      id: GOAL.WORK,
      label: o.goalWork,
      icon: Briefcase,
      color: colors.accentBlue,
    },
    {
      id: GOAL.BURNOUT,
      label: o.goalBurnout,
      icon: BatteryCharging,
      color: colors.success,
    },
  ];

  const handleSave = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.SUCCESS);
    onSave(profile);
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.modalCard}>
          <View style={styles.headerBar}>
            <View style={styles.headerTitleRow}>
              <View style={styles.iconCircle}>
                <User size={16} color="#00C4B3" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {renderBilingualNodes(o.profileTitle, typography.fontPromptBold, typography.fontGothamBold)}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {renderBilingualNodes(o.subtitle, typography.fontPromptRegular, typography.fontGothamBook)}
                </Text>
              </View>
            </View>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={18} color="#79ADA9" strokeWidth={2.4} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Mascot Greeting */}
            <View style={styles.mascotBox}>
              <MoocaMascot
                mood={MOOCA_MOOD.HAPPY}
                size="sm"
                speakingBubble={o.tailoredBubble}
              />
            </View>

            {/* Name Field */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>
                {renderBilingualNodes(o.yourName)}
              </Text>
              <View style={[styles.inputRow, isFocused && styles.inputRowFocused]}>
                <User size={16} color={isFocused ? colors.primary : '#79ADA9'} style={{ marginLeft: 12 }} />
                <TextInput
                  value={profile.name}
                  onChangeText={(text) => setProfile({ ...profile, name: text })}
                  placeholder={o.namePlaceholder}
                  placeholderTextColor="#637b91"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  style={styles.textInput}
                />
              </View>
            </View>

            {/* Goal Selector */}
            <View style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>
                {renderBilingualNodes(o.primaryContext)}
              </Text>
              <View style={styles.goalsGrid}>
                {GOALS.map((g) => {
                  const isSelected = profile.goal === g.id;
                  const IconComponent = g.icon;
                  return (
                    <TouchableOpacity
                      key={g.id}
                      onPress={() => {
                        audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
                        setProfile({ ...profile, goal: g.id });
                      }}
                      style={[
                        styles.goalCard,
                        isSelected && { borderColor: g.color, backgroundColor: g.color + '15' },
                      ]}
                    >
                      <IconComponent size={20} color={g.color} />
                      <Text style={[styles.goalLabel, isSelected && { color: colors.primaryDark }]}>
                        {renderBilingualNodes(g.label)}
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
                {renderBilingualNodes(o.mbtiSpecific)}
              </Text>
              <View style={styles.mbtiGrid}>
                {MODAL_CONFIG.mbtiOptions.map((m) => {
                  const isSelected = profile.mbti === m;
                  return (
                    <TouchableOpacity
                      key={m}
                      onPress={() => {
                        audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
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
          </ScrollView>
          {/* Save Button */}
          <View style={styles.saveSection}>
            <MarshmallowButton
              title={o.saveSettings}
              onPress={handleSave}
              icon={<Check size={18} color="#FFFFFF" />}
              variant={MARSHMALLOW_VARIANT.PRIMARY}
              size={MARSHMALLOW_SIZE.MD}
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
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
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
    fontFamily: typography.fontPromptBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.primaryDark,
    ...(Platform.OS !== 'android' ? { fontWeight: '700' } : {}),
  },
  headerSubtitle: {
    fontFamily: typography.fontPromptRegular,
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
  content: {
    paddingHorizontal: 0,
    paddingVertical: 4,
    gap: 16,
  },
  mascotBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 135,
    paddingBottom: 4,
    marginVertical: 4,
    overflow: 'visible',
  },
  fieldSection: {
    gap: 8,
  },
  fieldLabel: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 2,
    ...(Platform.OS !== 'android' ? { fontWeight: '400' } : {}),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#cdd8e1',
    height: 44,
  },
  inputRowFocused: {
    borderColor: '#00C4B3',
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#26313c',
    fontFamily: typography.fontPromptMedium,
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
    gap: 12,
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
    fontFamily: typography.fontGothamBook,
    fontSize: 11,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  mbtiChipTextActive: {
    fontFamily: typography.fontGothamBook,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  saveSection: {
    marginTop: 16,
  },
});
