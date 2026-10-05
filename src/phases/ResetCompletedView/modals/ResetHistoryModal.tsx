import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShiftFeedback, UserProfile, Language, SHIFT_RESULT } from '../../../types';
import { Award, X, Activity, Sparkles } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../../../design-system/tokens';
import { getTranslation } from '../../../locales';
import { renderBilingualNodes } from '../../../components/BilingualText';

export interface ResetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  history: ShiftFeedback[];
  lang: Language;
}

export const ResetHistoryModal: React.FC<ResetHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  lang,
}) => {
  const t = getTranslation(lang);
  const h = t.modals.history;

  const mockDefaultHistory: ShiftFeedback[] = [
    {
      shiftResult: SHIFT_RESULT.EMPOWERED,
      preHeartRate: 106,
      postHeartRate: 82,
      timestamp: '08:15',
    },
    {
      shiftResult: SHIFT_RESULT.GROUNDED,
      preHeartRate: 102,
      postHeartRate: 80,
      timestamp: h.today,
    },
  ];

  const displayHistory = history.length > 0 ? history : mockDefaultHistory;

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
                <Award size={16} color="#DF8900" strokeWidth={2.4} />
              </View>
              <View>
                <Text style={styles.headerTitle}>
                  {renderBilingualNodes(h.resetHistoryTitle, typography.fontPromptBold, typography.fontGothamBold)}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {renderBilingualNodes(h.subtitle, typography.fontPromptRegular, typography.fontGothamBook)}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color={colors.textMuted} strokeWidth={2.4} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {displayHistory.map((item, idx) => {
              const drop = item.preHeartRate - item.postHeartRate;
              return (
                <View key={idx} style={styles.historyCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.badgeShift}>
                      <Sparkles size={12} color={colors.primary} />
                      <Text style={styles.badgeShiftText}>
                        {renderBilingualNodes(item.shiftResult.toUpperCase(), typography.fontPromptBold, typography.fontGothamBold)}
                      </Text>
                    </View>
                    <Text style={styles.timestampText}>
                      {renderBilingualNodes(item.timestamp ? item.timestamp.split('T')[0] : h.today, typography.fontPromptMedium, typography.fontGotham)}
                    </Text>
                  </View>

                  <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>{renderBilingualNodes(h.preLabel, typography.fontPromptBold, typography.fontGothamBold)}</Text>
                      <Text style={styles.metricVal}>{item.preHeartRate} BPM</Text>
                    </View>

                    <View style={styles.deltaBox}>
                      <Activity size={12} color={colors.primary} />
                      <Text style={styles.deltaVal}>-{drop} BPM</Text>
                    </View>

                    <View style={styles.metricItem}>
                      <Text style={styles.metricLabel}>{renderBilingualNodes(h.postLabel, typography.fontPromptBold, typography.fontGothamBold)}</Text>
                      <Text style={[styles.metricVal, { color: colors.primary }]}>
                        {item.postHeartRate} BPM
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
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
    backgroundColor: '#FCF4E0',
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
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#fbfbfb',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#f1f1f1',
    ...shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeShift: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F8F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 4,
  },
  badgeShiftText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  timestampText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricVal: {
    fontFamily: typography.fontGothamBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  deltaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F8F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4,
  },
  deltaVal: {
    fontFamily: typography.fontGothamBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
});
