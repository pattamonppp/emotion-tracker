import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoocaMascot } from './MoocaMascot';
import { audioService } from '../services/audioService';
import { Heart, Sparkles, X, Sun } from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';
import { getTranslation } from '../locales';

export interface MoocaStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
  userName: string;
}

export const MoocaStoryModal: React.FC<MoocaStoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  userName,
}) => {
  const [hugCount, setHugCount] = useState(0);
  const t = getTranslation(lang);
  const s = t.modals.story;

  const handleGiveHug = () => {
    setHugCount((prev) => prev + 1);
    audioService.triggerHaptic('success');
    audioService.playJarDrop();
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
          <View style={styles.headerTitleRow}>
            <Heart size={18} color={colors.accentPink} />
            <Text style={styles.headerTitle}>
              {s.companionLore}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Hero Mascot */}
          <View style={styles.mascotBox}>
            <MoocaMascot
              mood="hugging"
              size="lg"
              speakingBubble={s.greetingBubble.replace('{name}', userName)}
              onHug={handleGiveHug}
            />
          </View>

          {/* Hug Counter Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleGiveHug}
            style={styles.hugButton}
          >
            <Heart size={16} color="#FFFFFF" />
            <Text style={styles.hugButtonText}>
              {s.giveHugBtn.replace('{count}', String(hugCount))}
            </Text>
          </TouchableOpacity>

          {/* Story Card */}
          <View style={styles.storyCard}>
            <View style={styles.storyCardHeader}>
              <Sun size={16} color="#F59E0B" />
              <Text style={styles.storyCardTitle}>
                {s.originTitle}
              </Text>
            </View>
            <Text style={styles.storyParagraph}>
              {s.originParagraph}
            </Text>
          </View>

          {/* Calming Mantra Card */}
          <View style={styles.mantraCard}>
            <View style={styles.storyCardHeader}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={[styles.storyCardTitle, { color: colors.primaryDark }]}>
                {s.dailyMantraTitle}
              </Text>
            </View>
            <Text style={styles.mantraText}>
              {s.dailyMantraQuote}
            </Text>
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
    gap: 16,
  },
  mascotBox: {
    alignItems: 'center',
    marginVertical: 10,
  },
  hugButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentPink,
    paddingVertical: 12,
    borderRadius: radii.full,
    gap: 8,
    ...shadows.soft,
  },
  hugButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  storyCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  storyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  storyCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    textTransform: 'uppercase',
  },
  storyParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#78350F',
    fontWeight: '500',
  },
  mantraCard: {
    backgroundColor: '#E6F9F7',
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
  },
  mantraText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.primaryDark,
    fontStyle: 'italic',
    fontWeight: '700',
  },
});
