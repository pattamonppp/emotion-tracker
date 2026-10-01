import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { EmotionTagId, ShiftFeedback } from '../types';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { MoocaMascot } from './MoocaMascot';
import { Heart, Activity, Check, Plus, Minus, ArrowRight } from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';

interface Phase4FeedbackProps {
  preHeartRate: number;
  selectedEmotions: EmotionTagId[];
  onFinishReset: (feedback: ShiftFeedback) => void;
  onRestart: () => void;
  lang: 'th' | 'en';
}

export const Phase4Feedback: React.FC<Phase4FeedbackProps> = ({
  preHeartRate,
  onFinishReset,
  lang,
}) => {
  const [postHeartRate, setPostHeartRate] = useState(Math.max(65, preHeartRate - 18));
  const [shiftResult, setShiftResult] = useState<'empowered' | 'grounded' | 'same'>('grounded');

  const bpmDrop = preHeartRate - postHeartRate;

  const handleFinish = () => {
    audioService.triggerHaptic('success');
    audioService.playChimeShockwave();
    onFinishReset({
      shiftResult,
      preHeartRate,
      postHeartRate,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header & Mascot */}
      <View style={styles.header}>
        <MoocaMascot
          mood={shiftResult === 'same' ? 'comforting' : 'celebrating'}
          size="sm"
          speakingBubble={
            shiftResult === 'same'
              ? lang === 'th'
                ? 'ไม่เป็นไรเลยนะ การได้หยุดพัก 2 นาทีนี้ ร่างกายก็ได้ชะลอแล้ว'
                : 'That is completely okay. These 2 minutes gave your mind real rest.'
              : lang === 'th'
              ? 'เก่งมากเลย! ดูสิ หัวใจและร่างกายของเธอค่อยๆ สงบลงแล้ว'
              : 'Look at that! Your heart and mind have found their rhythm.'
          }
        />
        <Text style={styles.title}>
          {lang === 'th' ? 'วัดผลการฟื้นตัวของใจ (Delta Check)' : 'Post-Session Bio Feedback'}
        </Text>
      </View>

      {/* Heart Rate Delta Comparison Card */}
      <View style={styles.bpmCard}>
        <View style={styles.bpmHeader}>
          <Activity size={15} color={colors.secondary} />
          <Text style={styles.bpmHeaderText}>
            {lang === 'th' ? 'การเปลี่ยนแปลงของอัตราการเต้นของหัวใจ' : 'Heart Rate Delta'}
          </Text>
        </View>

        <View style={styles.bpmComparisonRow}>
          {/* Pre BPM */}
          <View style={styles.bpmCol}>
            <Text style={styles.bpmColLabel}>{lang === 'th' ? 'ก่อนเริ่ม' : 'Before'}</Text>
            <Text style={styles.bpmPreValue}>{preHeartRate}</Text>
            <Text style={styles.bpmUnit}>BPM</Text>
          </View>

          {/* Delta Arrow */}
          <View style={styles.deltaBadge}>
            <Text style={styles.deltaText}>
              {bpmDrop >= 0 ? `-${bpmDrop}` : `+${Math.abs(bpmDrop)}`} BPM
            </Text>
          </View>

          {/* Post BPM with Stepper */}
          <View style={styles.bpmCol}>
            <Text style={styles.bpmColLabel}>{lang === 'th' ? 'ตอนนี้' : 'Now'}</Text>
            <Text style={styles.bpmPostValue}>{postHeartRate}</Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                onPress={() => {
                  audioService.triggerHaptic('selection');
                  setPostHeartRate((prev) => Math.max(50, prev - 1));
                }}
                style={styles.stepperBtn}
              >
                <Minus size={12} color={colors.primaryDark} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  audioService.triggerHaptic('selection');
                  setPostHeartRate((prev) => Math.min(160, prev + 1));
                }}
                style={styles.stepperBtn}
              >
                <Plus size={12} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Subjective Shift Perception Options */}
      <View style={styles.shiftSection}>
        <Text style={styles.shiftTitle}>
          {lang === 'th' ? 'ตอนนี้คุณรู้สึกอย่างไรบ้าง?' : 'How do you feel right now?'}
        </Text>

        <View style={styles.optionsList}>
          {/* Option 1: Grounded */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              audioService.triggerHaptic('selection');
              setShiftResult('grounded');
            }}
            style={[
              styles.optionCard,
              shiftResult === 'grounded' && styles.optionCardActive,
            ]}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>🌊</Text>
              <View>
                <Text style={styles.optionLabel}>
                  {lang === 'th' ? 'นิ่งสงบ หายใจทั่วท้องขึ้น' : 'Grounded & Calmer'}
                </Text>
                <Text style={styles.optionSub}>
                  {lang === 'th' ? 'ระบบประสาทพาราซิมพาเทติกทำงาน' : 'Parasympathetic vagal activation'}
                </Text>
              </View>
            </View>
            {shiftResult === 'grounded' && <Check size={18} color={colors.primary} strokeWidth={3} />}
          </TouchableOpacity>

          {/* Option 2: Empowered */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              audioService.triggerHaptic('selection');
              setShiftResult('empowered');
            }}
            style={[
              styles.optionCard,
              shiftResult === 'empowered' && styles.optionCardActive,
            ]}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>✨</Text>
              <View>
                <Text style={styles.optionLabel}>
                  {lang === 'th' ? 'โล่งโปร่ง มั่นใจขึ้น พร้อมลุย' : 'Empowered & Ready'}
                </Text>
                <Text style={styles.optionSub}>
                  {lang === 'th' ? 'ออกซิเจนกลับสู่สมองส่วนหน้า' : 'Prefrontal clarity restored'}
                </Text>
              </View>
            </View>
            {shiftResult === 'empowered' && <Check size={18} color={colors.primary} strokeWidth={3} />}
          </TouchableOpacity>

          {/* Option 3: Same */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              audioService.triggerHaptic('selection');
              setShiftResult('same');
            }}
            style={[
              styles.optionCard,
              shiftResult === 'same' && styles.optionCardActive,
            ]}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionEmoji}>🍃</Text>
              <View>
                <Text style={styles.optionLabel}>
                  {lang === 'th' ? 'ยังรู้สึกตึงเท่าเดิม' : 'Still Feel Tense'}
                </Text>
                <Text style={styles.optionSub}>
                  {lang === 'th' ? 'สามารถทำซ้ำอีกรอบหรือพักจิบน้ำ' : 'May repeat or rest deeper'}
                </Text>
              </View>
            </View>
            {shiftResult === 'same' && <Check size={18} color={colors.primary} strokeWidth={3} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* CTA Button */}
      <View style={styles.actionSection}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleFinish}
          icon={<ArrowRight size={18} color="#FFFFFF" />}
        >
          {lang === 'th' ? 'บันทึกผลและสรุปการรีเซ็ต' : 'Complete Reset & View Summary'}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
    marginTop: 8,
  },
  bpmCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    marginBottom: 16,
    ...shadows.soft,
  },
  bpmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  bpmHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.secondary,
    textTransform: 'uppercase',
  },
  bpmComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bpmCol: {
    alignItems: 'center',
  },
  bpmColLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  bpmPreValue: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.textSecondary,
  },
  bpmPostValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
  },
  bpmUnit: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  deltaBadge: {
    backgroundColor: '#E6F9F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  deltaText: {
    fontSize: 12,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  stepperBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  shiftSection: {
    width: '100%',
    marginBottom: 16,
  },
  shiftTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 10,
    textAlign: 'center',
  },
  optionsList: {
    gap: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    ...shadows.card,
  },
  optionCardActive: {
    backgroundColor: '#E6F9F7',
    borderColor: colors.primary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optionSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 1,
  },
  actionSection: {
    width: '100%',
  },
});
