import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserProfile, GoalType, MBTIType } from '../types';
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
  Sparkles,
  Heart
} from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';
import { audioService } from '../services/audioService';

interface OnboardingModalProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

const MBTI_OPTIONS: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onSave,
  isOpen,
  onClose,
}) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const lang = profile.language;

  const GOALS: { id: GoalType; labelTh: string; labelEn: string; icon: any; color: string }[] = [
    {
      id: 'exam',
      labelTh: 'สอบ / แข่งขันวิชาการ',
      labelEn: 'Exam & Academic',
      icon: GraduationCap,
      color: colors.primary,
    },
    {
      id: 'stage',
      labelTh: 'ขึ้นเวที / พรีเซนต์',
      labelEn: 'Stage & Presentation',
      icon: Mic,
      color: colors.secondary,
    },
    {
      id: 'work',
      labelTh: 'ทำงาน / ตื้อตัน',
      labelEn: 'Deep Work & Freeze',
      icon: Briefcase,
      color: colors.accentBlue,
    },
    {
      id: 'burnout',
      labelTh: 'เหนื่อยล้า / หมดไฟ',
      labelEn: 'Chronic Burnout',
      icon: BatteryCharging,
      color: '#10B981',
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
            {lang === 'th' ? 'ข้อมูลโปรไฟล์ & การปรับแต่ง' : 'Profile & Calibration'}
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
              speakingBubble={
                lang === 'th'
                  ? 'บอก Mooca เพิ่มเติม เพื่อให้การดูแลตรงจุดที่สุด!'
                  : 'Tell Mooca about yourself for tailored care!'
              }
            />
          </View>

          {/* Name Field */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {lang === 'th' ? 'ชื่อของคุณ (Name)' : 'Your Name'}
            </Text>
            <View style={styles.inputRow}>
              <User size={16} color={colors.primary} style={{ marginLeft: 12 }} />
              <TextInput
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="Name"
                style={styles.textInput}
              />
            </View>
          </View>

          {/* Goal Selector */}
          <View style={styles.fieldSection}>
            <Text style={styles.fieldLabel}>
              {lang === 'th' ? 'สถานการณ์หลักที่ต้องเผชิญ (Current Context)' : 'Primary Context'}
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
                      {lang === 'th' ? g.labelTh : g.labelEn}
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
              {lang === 'th' ? 'บุคลิกภาพ MBTI (สำหรับเสียงบำบัดเฉพาะ)' : 'MBTI Personality'}
            </Text>
            <View style={styles.mbtiGrid}>
              {MBTI_OPTIONS.map((m) => {
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
              {lang === 'th' ? 'บันทึกการตั้งค่า' : 'Save Profile Settings'}
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
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  mascotBox: {
    height: 155,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    marginBottom: 16,
  },
  fieldSection: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  goalsGrid: {
    gap: 8,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  goalLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  mbtiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  mbtiChip: {
    width: '22%',
    paddingVertical: 8,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  mbtiChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  mbtiChipText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  mbtiChipTextActive: {
    color: '#FFFFFF',
  },
  saveSection: {
    marginTop: 12,
  },
});
