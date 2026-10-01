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
import { Layers, X, Sparkles, Check } from 'lucide-react-native';
import { colors, radii, shadows } from './tokens';

interface DesignSystemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

const PALETTE = [
  { name: 'Mindfull Brand Turquoise', hex: '#00C4B3', role: 'Primary calm & restorative' },
  { name: 'Deep Vagal Teal', hex: '#004D40', role: 'Anchoring text & structure' },
  { name: 'Warm Sunshade Orange', hex: '#FA8C3D', role: 'Energy & sympathetic discharge' },
  { name: 'Flamingo Pink', hex: '#F26E6E', role: 'Soft emotional warmth' },
  { name: 'Acoustic Solfeggio Blue', hex: '#3B82F6', role: 'Alpha wave sanctuary' },
  { name: 'Gentle Cloud White', hex: '#FFFFFF', role: 'Base card & clean space' },
];

export const DesignSystemDrawer: React.FC<DesignSystemDrawerProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
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
            <Layers size={18} color={colors.primary} />
            <Text style={styles.headerTitle}>
              {lang === 'th' ? 'ระบบดีไซน์ Mindfull CI & Tokens' : 'Mindfull Design System'}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionHeading}>
            {lang === 'th' ? 'จานสีหลัก (Color Palette)' : 'Color Palette'}
          </Text>

          <View style={styles.paletteGrid}>
            {PALETTE.map((item, idx) => (
              <View key={idx} style={styles.colorCard}>
                <View style={[styles.colorSwatch, { backgroundColor: item.hex }]} />
                <View style={styles.colorMeta}>
                  <Text style={styles.colorName}>{item.name}</Text>
                  <Text style={styles.colorHex}>{item.hex}</Text>
                  <Text style={styles.colorRole}>{item.role}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionHeading, { marginTop: 16 }]}>
            {lang === 'th' ? 'สถาปัตยกรรมเวลา 120 วินาที' : '120-Second Architecture'}
          </Text>

          <View style={styles.phaseTimeline}>
            <View style={styles.timelineItem}>
              <Text style={styles.phaseTime}>0:00 - 0:15</Text>
              <Text style={styles.phaseLabel}>
                {lang === 'th' ? 'Phase 1: โหลเก็บความกังวล (Emotion Jar)' : 'Phase 1: Emotion Jar Capture'}
              </Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.phaseTime}>0:15 - 1:20</Text>
              <Text style={styles.phaseLabel}>
                {lang === 'th' ? 'Phase 2: กายกรรมรีเซ็ต (Somatic Shift)' : 'Phase 2: Somatic Intervention'}
              </Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.phaseTime}>1:20 - 1:45</Text>
              <Text style={styles.phaseLabel}>
                {lang === 'th' ? 'Phase 3: ปลดล็อกความคิด (Cognitive Insight)' : 'Phase 3: Cognitive Reframing'}
              </Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.phaseTime}>1:45 - 2:00</Text>
              <Text style={styles.phaseLabel}>
                {lang === 'th' ? 'Phase 4: วัดผลลัพธ์ใจ (Bio Feedback Delta)' : 'Phase 4: Bio-Delta Check'}
              </Text>
            </View>
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
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primaryDark,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  paletteGrid: {
    gap: 10,
  },
  colorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 12,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  colorMeta: {
    flex: 1,
  },
  colorName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  colorHex: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 1,
  },
  colorRole: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  phaseTimeline: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 10,
  },
  timelineItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    paddingBottom: 8,
  },
  phaseTime: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
  },
  phaseLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: 2,
  },
});
