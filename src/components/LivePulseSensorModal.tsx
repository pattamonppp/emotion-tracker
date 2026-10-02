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
import { X, Heart, ShieldCheck } from 'lucide-react-native';
import { colors } from '../design-system/tokens';
import { getTranslation } from '../locales';
import { MODAL_CONFIG } from '../constants';

export interface LivePulseSensorModalProps {
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
  const [hrvMs, setHrvMs] = useState<number>(MODAL_CONFIG.pulseSensor.defaultHrvMs);
  const [isScanComplete, setIsScanComplete] = useState(false);

  const t = getTranslation(lang);
  const ps = t.modals.pulseSensor;
  const cfg = MODAL_CONFIG.pulseSensor;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isScanning && scanProgress < 100) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const next = prev + cfg.scanProgressStep;
          audioService.triggerHaptic('light');
          if (next >= 100) {
            setIsScanning(false);
            setIsScanComplete(true);
            const randomBpm = cfg.simulatedBpmBase + Math.floor(Math.random() * cfg.simulatedBpmRange);
            setMeasuredBpm(randomBpm);
            setHrvMs(cfg.simulatedHrvBase + Math.floor(Math.random() * cfg.simulatedHrvRange));
            audioService.triggerHaptic('success');
            return 100;
          }
          return next;
        });
      }, cfg.scanIntervalMs);
    }
    return () => clearInterval(interval);
  }, [isScanning, scanProgress, cfg]);

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
            {ps.liveCalibrationTitle}
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
                  ? ps.calibrated
                  : ps.tapToMeasure}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Results Card */}
          <View style={styles.resultsCard}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{ps.pulseBpm}</Text>
              <Text style={styles.metricValue}>{measuredBpm}</Text>
              <Text style={styles.metricSub}>{ps.bpmUnit}</Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>{ps.hrvLabel}</Text>
              <Text style={[styles.metricValue, { color: colors.secondary }]}>{hrvMs}</Text>
              <Text style={styles.metricSub}>ms</Text>
            </View>
          </View>

          <View style={styles.explanationBox}>
            <ShieldCheck size={16} color={colors.primary} />
            <Text style={styles.explanationText}>
              {ps.explanation}
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
              {ps.applyBpm.replace('{bpm}', String(measuredBpm))}
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
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: colors.borderSubtle,
  },
  sensorPrompt: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  resultsCard: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricCol: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  metricSub: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderSubtle,
  },
  explanationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    padding: 12,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  explanationText: {
    flex: 1,
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
    fontWeight: '500',
  },
  actionContainer: {
    width: '100%',
    paddingBottom: 16,
  },
});
