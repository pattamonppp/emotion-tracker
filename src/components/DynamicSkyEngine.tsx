import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { audioService } from '../services/audioService';
import { Sun, Moon, Sunrise, Sunset, Clock, Sparkles } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

export type SkyTimePeriod = 'dawn' | 'day' | 'sunset' | 'night';
export type SkyMode = 'auto' | SkyTimePeriod;

export interface SkyContextType {
  activePeriod: SkyTimePeriod;
  skyMode: SkyMode;
  setSkyMode: (mode: SkyMode) => void;
  lang: 'th' | 'en';
}

const SkyContext = createContext<SkyContextType>({
  activePeriod: 'day',
  skyMode: 'auto',
  setSkyMode: () => {},
  lang: 'th',
});

export const useSky = () => useContext(SkyContext);

export const getPeriodFromHour = (hour: number): SkyTimePeriod => {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'sunset';
  return 'night';
};

export interface DynamicSkyEngineProps {
  children: React.ReactNode;
  onTimePeriodChange?: (period: SkyTimePeriod) => void;
  lang?: 'th' | 'en';
}

export const DynamicSkyEngine: React.FC<DynamicSkyEngineProps> = ({
  children,
  onTimePeriodChange,
  lang = 'th',
}) => {
  const [skyMode, setSkyMode] = useState<SkyMode>('auto');
  const [activePeriod, setActivePeriod] = useState<SkyTimePeriod>(() =>
    getPeriodFromHour(new Date().getHours())
  );

  // Celestial animations
  const starTwinkleAnim = useRef(new Animated.Value(0.4)).current;
  const cloudDriftAnim = useRef(new Animated.Value(0)).current;
  const sunPulseAnim = useRef(new Animated.Value(1)).current;

  // Real-time hour watcher for Auto mode
  useEffect(() => {
    const updateAuto = () => {
      if (skyMode === 'auto') {
        const detected = getPeriodFromHour(new Date().getHours());
        setActivePeriod(detected);
        if (onTimePeriodChange) onTimePeriodChange(detected);
      }
    };

    updateAuto();
    const timer = setInterval(updateAuto, 60000);
    return () => clearInterval(timer);
  }, [skyMode, onTimePeriodChange]);

  const handleSetSkyMode = (mode: SkyMode) => {
    audioService.triggerHaptic('selection');
    setSkyMode(mode);
    const period = mode === 'auto' ? getPeriodFromHour(new Date().getHours()) : mode;
    setActivePeriod(period);
    if (onTimePeriodChange) onTimePeriodChange(period);
  };

  // Sky ambient animations
  useEffect(() => {
    const starLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkleAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starTwinkleAnim, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    starLoop.start();

    const cloudLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudDriftAnim, {
          toValue: 16,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloudDriftAnim, {
          toValue: -16,
          duration: 8000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    cloudLoop.start();

    const sunLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(sunPulseAnim, {
          toValue: 1.08,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sunPulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    sunLoop.start();

    return () => {
      starLoop.stop();
      cloudLoop.stop();
      sunLoop.stop();
    };
  }, [starTwinkleAnim, cloudDriftAnim, sunPulseAnim]);

  const getSkyGradients = (): [string, string, ...string[]] => {
    switch (activePeriod) {
      case 'dawn':
        return ['#FFE4D6', '#FFEDD5', '#FEF3C7', '#E0F2FE'];
      case 'day':
        return ['#BAE6FD', '#E0F2FE', '#F0FDFA', '#FFFFFF'];
      case 'sunset':
        return ['#FED7AA', '#FDBA74', '#F472B6', '#C084FC', '#4F46E5'];
      case 'night':
      default:
        return ['#0B1120', '#1E1B4B', '#0F172A', '#020617'];
    }
  };

  return (
    <SkyContext.Provider
      value={{
        activePeriod,
        skyMode,
        setSkyMode: handleSetSkyMode,
        lang,
      }}
    >
      <View style={styles.container}>
        {/* Dynamic Background Linear Gradient */}
        <LinearGradient
          colors={getSkyGradients()}
          style={StyleSheet.absoluteFill}
        />

        {/* Night Stars & Moon */}
        {activePeriod === 'night' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.nightMoon}>
              <Moon size={34} color="#FDE047" fill="#FDE047" />
              <View style={styles.moonGlow} />
            </View>
            <Animated.View style={[styles.starsLayer, { opacity: starTwinkleAnim }]}>
              <Text style={[styles.twinkleStar, { top: 90, left: 30 }]}>✨</Text>
              <Text style={[styles.twinkleStar, { top: 130, right: 55, fontSize: 11 }]}>⭐</Text>
              <Text style={[styles.twinkleStar, { top: 220, left: 60, fontSize: 13 }]}>🌟</Text>
              <Text style={[styles.twinkleStar, { top: 180, right: 35, fontSize: 10 }]}>✨</Text>
              <Text style={[styles.twinkleStar, { top: 290, left: 35, fontSize: 12 }]}>💫</Text>
              <Text style={[styles.twinkleStar, { top: 340, right: 75, fontSize: 14 }]}>⭐</Text>
            </Animated.View>
          </View>
        )}

        {/* Dawn Sunrise */}
        {activePeriod === 'dawn' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.sunriseSun,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <Sunrise size={40} color="#F59E0B" />
            </Animated.View>
            <View style={styles.morningMist1} />
            <View style={styles.morningMist2} />
          </View>
        )}

        {/* Day Sun & Drifting White Clouds */}
        {activePeriod === 'day' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.daySunContainer,
                { transform: [{ translateX: cloudDriftAnim }] },
              ]}
            >
              <Sun size={30} color="#F59E0B" />
            </Animated.View>
            <Animated.View
              style={[
                styles.driftingCloud1,
                { transform: [{ translateX: cloudDriftAnim }] },
              ]}
            >
              <Text style={{ fontSize: 26, opacity: 0.65 }}>☁️</Text>
            </Animated.View>
          </View>
        )}

        {/* Sunset Sky */}
        {activePeriod === 'sunset' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.sunsetSun}>
              <Sunset size={38} color="#FB7185" />
            </View>
            <Animated.View
              style={[
                styles.driftingCloud2,
                { transform: [{ translateX: cloudDriftAnim }] },
              ]}
            >
              <Text style={{ fontSize: 22, opacity: 0.55 }}>☁️</Text>
            </Animated.View>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </View>
    </SkyContext.Provider>
  );
};

export const SkyPeriodSwitcher: React.FC = () => {
  const { activePeriod, skyMode, setSkyMode, lang } = useSky();
  const [isOpen, setIsOpen] = useState(false);

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case 'dawn':
        return lang === 'th' ? '🌅 เช้าตรู่' : '🌅 Dawn';
      case 'day':
        return lang === 'th' ? '☀️ กลางวัน' : '☀️ Day';
      case 'sunset':
        return lang === 'th' ? '🌇 ยามเย็น' : '🌇 Sunset';
      case 'night':
        return lang === 'th' ? '🌙 ราตรี' : '🌙 Night';
    }
  };

  return (
    <View style={styles.switcherContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          audioService.triggerHaptic('light');
          setIsOpen((prev) => !prev);
        }}
        style={[
          styles.pillBtn,
          activePeriod === 'night' && styles.pillBtnNight,
        ]}
      >
        {activePeriod === 'dawn' && <Sunrise size={12} color="#D97706" />}
        {activePeriod === 'day' && <Sun size={12} color="#0284C7" />}
        {activePeriod === 'sunset' && <Sunset size={12} color="#DB2777" />}
        {activePeriod === 'night' && <Moon size={12} color="#FDE047" fill="#FDE047" />}

        <Text
          style={[
            styles.pillText,
            activePeriod === 'night' && { color: '#F1F5F9' },
          ]}
        >
          {getPeriodLabel()}
        </Text>

        {skyMode === 'auto' ? (
          <View style={styles.autoTag}>
            <Clock size={8} color="#00C4B3" />
            <Text style={styles.autoTagText}>Auto</Text>
          </View>
        ) : (
          <View style={styles.customTag}>
            <Text style={styles.customTagText}>Manual</Text>
          </View>
        )}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsPopup}>
          <TouchableOpacity
            onPress={() => {
              setSkyMode('auto');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'auto' && styles.optionBtnActive]}
          >
            <Clock size={10} color={skyMode === 'auto' ? '#FFFFFF' : colors.primaryDark} />
            <Text style={[styles.optionText, skyMode === 'auto' && styles.optionTextActive]}>
              {lang === 'th' ? 'เวลาจริง (Auto)' : 'Auto'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSkyMode('dawn');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'dawn' && styles.optionBtnActive]}
          >
            <Text style={{ fontSize: 11 }}>🌅</Text>
            <Text style={[styles.optionText, skyMode === 'dawn' && styles.optionTextActive]}>
              {lang === 'th' ? 'เช้า' : 'Dawn'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSkyMode('day');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'day' && styles.optionBtnActive]}
          >
            <Text style={{ fontSize: 11 }}>☀️</Text>
            <Text style={[styles.optionText, skyMode === 'day' && styles.optionTextActive]}>
              {lang === 'th' ? 'กลางวัน' : 'Day'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSkyMode('sunset');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'sunset' && styles.optionBtnActive]}
          >
            <Text style={{ fontSize: 11 }}>🌇</Text>
            <Text style={[styles.optionText, skyMode === 'sunset' && styles.optionTextActive]}>
              {lang === 'th' ? 'เย็น' : 'Sunset'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSkyMode('night');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'night' && styles.optionBtnActive]}
          >
            <Text style={{ fontSize: 11 }}>🌙</Text>
            <Text style={[styles.optionText, skyMode === 'night' && styles.optionTextActive]}>
              {lang === 'th' ? 'ราตรี' : 'Night'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  nightMoon: {
    position: 'absolute',
    top: 90,
    right: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(253, 224, 71, 0.15)',
  },
  starsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  twinkleStar: {
    position: 'absolute',
    color: '#FDE047',
  },
  sunriseSun: {
    position: 'absolute',
    top: 95,
    right: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morningMist1: {
    position: 'absolute',
    top: 150,
    left: -40,
    right: -40,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
  },
  morningMist2: {
    position: 'absolute',
    top: 230,
    left: -20,
    right: -20,
    height: 40,
    backgroundColor: 'rgba(255, 247, 237, 0.25)',
    borderRadius: 20,
  },
  daySunContainer: {
    position: 'absolute',
    top: 90,
    right: 32,
  },
  driftingCloud1: {
    position: 'absolute',
    top: 130,
    left: 20,
  },
  sunsetSun: {
    position: 'absolute',
    top: 95,
    right: 32,
  },
  driftingCloud2: {
    position: 'absolute',
    top: 140,
    left: 30,
  },
  switcherContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 40,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1.2,
    borderColor: 'rgba(0, 196, 179, 0.25)',
    gap: 4,
    ...shadows.card,
  },
  pillBtnNight: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderColor: 'rgba(253, 224, 71, 0.35)',
  },
  pillText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 9.5,
    color: colors.primaryDark,
  },
  autoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    gap: 2,
  },
  autoTagText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 7.5,
    color: colors.primaryDark,
  },
  customTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  customTagText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 7.5,
    color: '#92400E',
  },
  optionsPopup: {
    position: 'absolute',
    top: 28,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 3,
    ...shadows.soft,
    zIndex: 50,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: radii.full,
    backgroundColor: '#F8FAFC',
    gap: 3,
  },
  optionBtnActive: {
    backgroundColor: colors.primary,
  },
  optionText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 8.5,
    color: colors.primaryDark,
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
