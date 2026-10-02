import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShiftFeedback, UserProfile } from '../types';
import { Award, X, Activity, Sparkles } from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';
import { getTranslation } from '../locales';

export interface ResetHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  history: ShiftFeedback[];
  lang: 'th' | 'en';
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
      shiftResult: 'empowered',
      preHeartRate: 106,
      postHeartRate: 82,
      timestamp: '08:15',
    },
    {
      shiftResult: 'grounded',
      preHeartRate: 102,
      postHeartRate: 80,
      timestamp: h.today,
    },
  ];

  const displayHistory = history.length > 0 ? history : mockDefaultHistory;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <View style={styles.headerTitleRow}>
            <Award size={18} color={colors.secondary} />
            <Text style={styles.headerTitle}>
              {h.resetHistoryTitle}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={colors.textSecondary} />
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
                      {item.shiftResult.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.timestampText}>
                    {item.timestamp ? item.timestamp.split('T')[0] : h.today}
                  </Text>
                </View>

                <View style={styles.metricRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{h.preLabel}</Text>
                    <Text style={styles.metricVal}>{item.preHeartRate} BPM</Text>
                  </View>

                  <View style={styles.deltaBox}>
                    <Activity size={12} color={colors.primary} />
                    <Text style={styles.deltaVal}>-{drop} BPM</Text>
                  </View>

                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{h.postLabel}</Text>
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    gap: 12,
  },
  historyCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
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
    backgroundColor: '#E6F9F7',
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
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  deltaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 4,
  },
  deltaVal: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
});
