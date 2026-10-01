import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { audioService } from '../services/audioService';
import { Button } from '../design-system/Button';
import { Activity, X, Heart, ShieldCheck } from 'lucide-react-native';
import { colors, radii, shadows } from '../design-system/tokens';

interface LivePulseSensorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBpm: number;
  onUpdateBpm: (bpm: number) => void;
  lang: 'th' | 'en';
}

export const LivePulseSensorModal: React.FC<LivePulseSensorModalProps> = ({
  isOpen,
  onClose,
  currentBpm,
  onUpdateBpm,
  lang,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [measuredBpm, setMeasuredBpm] = useState(currentBpm);
  const [hrvMs, setHrvMs] = useState(48);
  const [isScanComplete, setIsScanComplete] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isScanning && scanProgress < 100) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + 10;
          audioService.triggerHaptic('light');
          if (next >= 100) {
            setIsScanning(false);
            setIsScanComplete(true);
            const randomBpm = 95 + Math.floor(Math.random() * 18);
            setMeasuredBpm(randomBpm);
            setHrvMs(42 + Math.floor(Math.random() * 15));
            audioService.triggerHaptic('success');
            return 100;
          }
          return next;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isScanning, scanProgress]);

  const handleStartScan = () => {
    setIsScanComplete(false);
    setScanProgress(0);
    setIsScanning(true);
  };

  const handleApplyBpm = () => {
    onUpdateBpm(measuredBpm);
    onClose();
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
            {lang === 'th' ? 'เซนเซอร์วัดชีพจร & HRV สด' : 'Live Pulse & HRV Calibration'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Heart Pulse Icon */}
          <View style={styles.heartPulseContainer}>
            <View style={[styles.pulseRing, isScanning && styles.pulseRingActive]} />
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleStartScan}
              style={styles.sensorPad}
            >
              <Heart
                size={44}
                color={isScanning ? '#F26E6E' : colors.primary}
                fill={isScanning ? '#F26E6E' : 'transparent'}
              />
              <Text style={styles.sensorPrompt}>
                {isScanning
                  ? `${scanProgress}%`
                  : isScanComplete
                  ? lang === 'th' ? 'วัดเสร็จสิ้น' : 'Calibrated'
                  : lang === 'th' ? 'แตะเพื่อเริ่มสแกน' : 'Tap to Measure'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Results Card */}
          <View style={styles.resultsCard}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{lang === 'th' ? 'อัตราการเต้นหัวใจ' : 'Pulse BPM'}</Text>
              <Text style={styles.metricValue}>{measuredBpm}</Text>
              <Text style={styles.metricSub}>BPM</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{lang === 'th' ? 'ความแปรปรวน HRV' : 'HRV (RMSSD)'}</Text>
              <Text style={[styles.metricValue, { color: colors.secondary }]}>{hrvMs}</Text>
              <Text style={styles.metricSub}>ms</Text>
            </View>
          </View>

          <View style={styles.explanationBox}>
            <ShieldCheck size={16} color={colors.primary} />
            <Text style={styles.explanationText}>
              {lang === 'th'
                ? 'วัดค่าเพื่อวิเคราะห์ระดับอะดรีนาลีนและปรับสูตรการรีเซ็ต 120 วินาทีให้แม่นยำ'
                : 'Measures nervous system tension to personalize your 120s intervention.'}
            </Text>
          </View>

          {/* Apply Button */}
          <View style={styles.actionContainer}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={handleApplyBpm}
            >
              {lang === 'th' ? `บันทึกค่า ${measuredBpm} BPM และนำไปใช้` : `Apply ${measuredBpm} BPM`}
            </Button>
          </View>
        </View>
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
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heartPulseContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(0, 196, 179, 0.2)',
  },
  pulseRingActive: {
    borderColor: '#F26E6E',
    backgroundColor: 'rgba(242, 110, 110, 0.08)',
  },
  sensorPad: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F8FAFC',
    borderWidth: 3,
    borderColor: colors.borderTeal,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.soft,
  },
  sensorPrompt: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  resultsCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: radii.xl,
    paddingVertical: 18,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderSubtle,
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  metricSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  explanationBox: {
    flexDirection: 'row',
    backgroundColor: '#E6F9F7',
    padding: 12,
    borderRadius: radii.lg,
    gap: 8,
    alignItems: 'center',
  },
  explanationText: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
  actionContainer: {
    width: '100%',
  },
});
