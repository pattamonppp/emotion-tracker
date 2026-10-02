import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient as SvgRadialGradient,
  Circle,
  Stop,
} from 'react-native-svg';
import { audioService } from '../services/audioService';
import { Sun, Moon, Sunrise, Sunset, Clock, ChevronDown } from 'lucide-react-native';
import { colors, radii, shadows, typography } from '../design-system/tokens';

/**
 * Dreamy Celestial Aura - Pure SVG Radial Gradient for an ethereal, soft-diffused glow
 */
const DreamyCelestialAura: React.FC<{
  size: number;
  coreColor: string;
  midColor: string;
  outerColor: string;
  id: string;
}> = ({ size, coreColor, midColor, outerColor, id }) => {
  const r = size / 2;
  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Defs>
        <SvgRadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
          <Stop offset="0%" stopColor={coreColor} stopOpacity="0.8" />
          <Stop offset="35%" stopColor={midColor} stopOpacity="0.45" />
          <Stop offset="68%" stopColor={outerColor} stopOpacity="0.18" />
          <Stop offset="100%" stopColor={outerColor} stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>
      <Circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
    </Svg>
  );
};

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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * High-definition SVG Fluffy Cloud Silhouette
 * Storybook rounded cloud lobes with subtle gradient shading
 */
export const SvgFluffyCloud: React.FC<{
  width: number;
  height: number;
  fillColor?: string;
  shadowColor?: string;
  opacity?: number;
}> = ({
  width,
  height,
  fillColor = '#FFFFFF',
  shadowColor = 'rgba(255, 255, 255, 0.4)',
  opacity = 0.85,
}) => {
  const gradId = `cloudGrad_${Math.round(width)}_${Math.round(height)}`;
  return (
    <Svg width={width} height={height} viewBox="0 0 110 55" style={{ opacity }}>
      <Defs>
        <SvgLinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={fillColor} stopOpacity="1" />
          <Stop offset="1" stopColor={shadowColor} stopOpacity="0.9" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d="M25 46 C12 46 2 38 2 26 C2 15 12 8 22 9 C26 3 37 0 52 0 C68 0 80 7 85 16 C93 14 104 18 107 27 C110 37 100 46 88 46 Z"
        fill={`url(#${gradId})`}
      />
    </Svg>
  );
};

/**
 * 4-Point Diamond Twinkle Star (Vector Icon, NO EMOJI)
 */
export const SvgDiamondStar: React.FC<{
  size: number;
  color?: string;
  opacity?: number;
}> = ({ size, color = '#FDE047', opacity = 1 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
    <Path
      d="M12 1 C12.5 8 16 11.5 23 12 C16 12.5 12.5 16 12 23 C11.5 16 8 12.5 1 12 C8 11.5 11.5 8 12 1 Z"
      fill={color}
    />
  </Svg>
);

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
  const sunPulseAnim = useRef(new Animated.Value(1)).current;
  const dreamOrbAnim1 = useRef(new Animated.Value(0.92)).current;
  const dreamOrbAnim2 = useRef(new Animated.Value(1.08)).current;

  // Background Cloud Drift Animations (Continuous looping)
  const cloudDrift1 = useRef(new Animated.Value(-160)).current;
  const cloudBob1 = useRef(new Animated.Value(0)).current;

  const cloudDrift2 = useRef(new Animated.Value(SCREEN_WIDTH + 80)).current;
  const cloudBob2 = useRef(new Animated.Value(0)).current;

  const cloudDrift3 = useRef(new Animated.Value(-100)).current;
  const cloudBob3 = useRef(new Animated.Value(0)).current;

  const cloudDrift4 = useRef(new Animated.Value(0)).current;
  const cloudBob4 = useRef(new Animated.Value(0)).current;

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

  // Continuous drifting background clouds physics
  useEffect(() => {
    // Cloud 1: High sky, slow continuous left-to-right
    const driftLoop1 = Animated.loop(
      Animated.timing(cloudDrift1, {
        toValue: SCREEN_WIDTH + 90,
        duration: 32000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    cloudDrift1.setValue(-160);
    driftLoop1.start();

    // Cloud 1 Bobbing
    const bobLoop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudBob1, {
          toValue: -5,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloudBob1, {
          toValue: 5,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop1.start();

    // Cloud 2: Mid sky, drifts right-to-left
    const driftLoop2 = Animated.loop(
      Animated.timing(cloudDrift2, {
        toValue: -150,
        duration: 26000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    cloudDrift2.setValue(SCREEN_WIDTH + 70);
    driftLoop2.start();

    const bobLoop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudBob2, {
          toValue: 6,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloudBob2, {
          toValue: -6,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop2.start();

    // Cloud 3: Upper-mid sky, left-to-right offset
    const driftLoop3 = Animated.loop(
      Animated.timing(cloudDrift3, {
        toValue: SCREEN_WIDTH + 110,
        duration: 38000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    cloudDrift3.setValue(-120);
    driftLoop3.start();

    const bobLoop3 = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudBob3, {
          toValue: -4,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloudBob3, {
          toValue: 4,
          duration: 4800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    bobLoop3.start();

    // Cloud 4: Gentle swaying cloud behind jar
    const driftLoop4 = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudDrift4, {
          toValue: 24,
          duration: 7500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(cloudDrift4, {
          toValue: -24,
          duration: 7500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    driftLoop4.start();

    // Celestial loops
    const starLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkleAnim, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starTwinkleAnim, {
          toValue: 0.25,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    starLoop.start();

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

    // Dreamy ambient Aurora / Bokeh orb breathing animations
    const orbLoop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(dreamOrbAnim1, {
          toValue: 1.15,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(dreamOrbAnim1, {
          toValue: 0.9,
          duration: 7000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    orbLoop1.start();

    const orbLoop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(dreamOrbAnim2, {
          toValue: 0.88,
          duration: 8500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(dreamOrbAnim2, {
          toValue: 1.12,
          duration: 8500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    orbLoop2.start();

    return () => {
      driftLoop1.stop();
      bobLoop1.stop();
      driftLoop2.stop();
      bobLoop2.stop();
      driftLoop3.stop();
      bobLoop3.stop();
      driftLoop4.stop();
      starLoop.stop();
      sunLoop.stop();
      orbLoop1.stop();
      orbLoop2.stop();
    };
  }, []);

  const getSkyGradients = (): [string, string, ...string[]] => {
    switch (activePeriod) {
      case 'dawn':
        return ['#FFEBE5', '#FED7AA', '#FDE68A', '#E0F2FE', '#F0FDFA'];
      case 'day':
        return ['#BAE6FD', '#CFFAFE', '#E0F2FE', '#F0FDFA', '#FFFBEB'];
      case 'sunset':
        return ['#FED7AA', '#FDBA74', '#F472B6', '#E879F9', '#818CF8', '#312E81'];
      case 'night':
      default:
        return ['#090D16', '#1E1B4B', '#1E293B', '#0F172A'];
    }
  };

  const getCloudTheme = () => {
    switch (activePeriod) {
      case 'dawn':
        return {
          fill1: '#FFF7ED',
          shadow1: '#FED7AA',
          opacity1: 0.85,
          fill2: '#FFEDD5',
          shadow2: '#FDBA74',
          opacity2: 0.8,
          fill3: '#FFFBEB',
          shadow3: '#FDE68A',
          opacity3: 0.82,
          fill4: '#FFF1F2',
          shadow4: '#FECDD3',
          opacity4: 0.75,
        };
      case 'day':
        return {
          fill1: '#FFFFFF',
          shadow1: '#E0F2FE',
          opacity1: 0.92,
          fill2: '#FFFFFF',
          shadow2: '#BAE6FD',
          opacity2: 0.86,
          fill3: '#F8FAFC',
          shadow3: '#E2E8F0',
          opacity3: 0.88,
          fill4: '#FFFFFF',
          shadow4: '#CCFBF1',
          opacity4: 0.8,
        };
      case 'sunset':
        return {
          fill1: '#FFF1F2',
          shadow1: '#F472B6',
          opacity1: 0.82,
          fill2: '#FDF4FF',
          shadow2: '#C084FC',
          opacity2: 0.78,
          fill3: '#FEF3C7',
          shadow3: '#FB923C',
          opacity3: 0.8,
          fill4: '#FCE7F3',
          shadow4: '#E879F9',
          opacity4: 0.72,
        };
      case 'night':
      default:
        return {
          fill1: '#1E293B',
          shadow1: '#0F172A',
          opacity1: 0.42,
          fill2: '#334155',
          shadow2: '#1E293B',
          opacity2: 0.36,
          fill3: '#1E293B',
          shadow3: '#0F172A',
          opacity3: 0.38,
          fill4: '#334155',
          shadow4: '#0F172A',
          opacity4: 0.32,
        };
    }
  };

  const cloudTheme = getCloudTheme();

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

        {/* Dreamy Ambient Floating Light Orbs (Aurora / Dream Bokeh) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Animated.View
            style={[
              styles.dreamOrb1,
              {
                backgroundColor:
                  activePeriod === 'sunset'
                    ? 'rgba(244, 114, 182, 0.28)'
                    : activePeriod === 'night'
                    ? 'rgba(99, 102, 241, 0.22)'
                    : activePeriod === 'dawn'
                    ? 'rgba(254, 215, 170, 0.35)'
                    : 'rgba(186, 230, 253, 0.38)',
                transform: [{ scale: dreamOrbAnim1 }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dreamOrb2,
              {
                backgroundColor:
                  activePeriod === 'sunset'
                    ? 'rgba(232, 121, 249, 0.25)'
                    : activePeriod === 'night'
                    ? 'rgba(56, 189, 248, 0.18)'
                    : activePeriod === 'dawn'
                    ? 'rgba(253, 230, 138, 0.32)'
                    : 'rgba(204, 251, 241, 0.38)',
                transform: [{ scale: dreamOrbAnim2 }],
              },
            ]}
          />
        </View>

        {/* Floating Fluffy Background Clouds (Always Active across all skies) */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Cloud 1: High Top Sky, large & soft, continuous drift */}
          <Animated.View
            style={[
              styles.floatingBgCloud,
              {
                top: 55,
                transform: [
                  { translateX: cloudDrift1 },
                  { translateY: cloudBob1 },
                ],
              },
            ]}
          >
            <SvgFluffyCloud
              width={135}
              height={68}
              fillColor={cloudTheme.fill1}
              shadowColor={cloudTheme.shadow1}
              opacity={cloudTheme.opacity1}
            />
          </Animated.View>

          {/* Cloud 2: Mid Sky, drifting right-to-left */}
          <Animated.View
            style={[
              styles.floatingBgCloud,
              {
                top: 130,
                transform: [
                  { translateX: cloudDrift2 },
                  { translateY: cloudBob2 },
                ],
              },
            ]}
          >
            <SvgFluffyCloud
              width={115}
              height={58}
              fillColor={cloudTheme.fill2}
              shadowColor={cloudTheme.shadow2}
              opacity={cloudTheme.opacity2}
            />
          </Animated.View>

          {/* Cloud 3: Upper-Mid Sky, cute smaller cloudlet */}
          <Animated.View
            style={[
              styles.floatingBgCloud,
              {
                top: 90,
                transform: [
                  { translateX: cloudDrift3 },
                  { translateY: cloudBob3 },
                ],
              },
            ]}
          >
            <SvgFluffyCloud
              width={88}
              height={44}
              fillColor={cloudTheme.fill3}
              shadowColor={cloudTheme.shadow3}
              opacity={cloudTheme.opacity3}
            />
          </Animated.View>

          {/* Cloud 4: Lower-Mid Sky, wide gentle cloud behind jar */}
          <Animated.View
            style={[
              styles.floatingBgCloud,
              {
                top: 240,
                left: SCREEN_WIDTH * 0.2,
                transform: [
                  { translateX: cloudDrift4 },
                ],
              },
            ]}
          >
            <SvgFluffyCloud
              width={150}
              height={74}
              fillColor={cloudTheme.fill4}
              shadowColor={cloudTheme.shadow4}
              opacity={cloudTheme.opacity4}
            />
          </Animated.View>
        </View>

        {/* Night Stars & Moon (Pure Vector Icons & Svg, NO EMOJI) */}
        {activePeriod === 'night' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.nightMoonContainer}>
              <DreamyCelestialAura
                size={120}
                coreColor="#FEF08A"
                midColor="#818CF8"
                outerColor="#38BDF8"
                id="moonBloom"
              />
              <Moon size={32} color="#FEF08A" fill="#FEF08A" />
            </View>
            <Animated.View style={[styles.starsLayer, { opacity: starTwinkleAnim }]}>
              <View style={[styles.vectorStarItem, { top: 95, left: 35 }]}>
                <SvgDiamondStar size={14} color="#FDE047" />
              </View>
              <View style={[styles.vectorStarItem, { top: 135, right: 60 }]}>
                <SvgDiamondStar size={10} color="#FDE047" opacity={0.85} />
              </View>
              <View style={[styles.vectorStarItem, { top: 215, left: 55 }]}>
                <SvgDiamondStar size={13} color="#FEF08A" />
              </View>
              <View style={[styles.vectorStarItem, { top: 185, right: 35 }]}>
                <SvgDiamondStar size={9} color="#FDE047" opacity={0.75} />
              </View>
              <View style={[styles.vectorStarItem, { top: 285, left: 35 }]}>
                <SvgDiamondStar size={11} color="#FEF08A" />
              </View>
              <View style={[styles.vectorStarItem, { top: 335, right: 70 }]}>
                <SvgDiamondStar size={14} color="#FDE047" />
              </View>
            </Animated.View>
          </View>
        )}

        {/* Dawn Sunrise */}
        {activePeriod === 'dawn' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.sunriseSunContainer,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <DreamyCelestialAura
                size={130}
                coreColor="#FDBA74"
                midColor="#FDE68A"
                outerColor="#FFF7ED"
                id="dawnBloom"
              />
              <Sunrise size={38} color="#F59E0B" />
            </Animated.View>
            <View style={styles.morningMist1} />
            <View style={styles.morningMist2} />
          </View>
        )}

        {/* Day Sun */}
        {activePeriod === 'day' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.daySunContainer,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <DreamyCelestialAura
                size={130}
                coreColor="#FDE047"
                midColor="#FEF08A"
                outerColor="#FFFBEB"
                id="daySunBloom"
              />
              <Sun size={32} color="#F59E0B" strokeWidth={2.4} />
            </Animated.View>
          </View>
        )}

        {/* Sunset Sun */}
        {activePeriod === 'sunset' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.sunsetSunContainer,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <DreamyCelestialAura
                size={130}
                coreColor="#FB923C"
                midColor="#F472B6"
                outerColor="#FDF4FF"
                id="sunsetBloom"
              />
              <Sunset size={36} color="#FB7185" />
            </Animated.View>
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>{children}</View>
      </View>
    </SkyContext.Provider>
  );
};

/**
 * Sky Period Switcher Badge & Expanded Icon Selector
 * Tap to cycle between periods instantly OR tap to open 5-icon picker bar
 * ALWAYS USES ICONS - NEVER EMOJI
 */
export const SkyPeriodSwitcher: React.FC = () => {
  const { activePeriod, skyMode, setSkyMode, lang } = useSky();
  const [isOpen, setIsOpen] = useState(false);
  const pillScaleAnim = useRef(new Animated.Value(1)).current;

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case 'dawn':
        return lang === 'th' ? 'เช้าตรู่' : 'Dawn';
      case 'day':
        return lang === 'th' ? 'กลางวัน' : 'Day';
      case 'sunset':
        return lang === 'th' ? 'ยามเย็น' : 'Sunset';
      case 'night':
        return lang === 'th' ? 'ราตรี' : 'Night';
    }
  };

  const getPeriodIcon = (period: SkyTimePeriod, size = 13, isActive = false) => {
    switch (period) {
      case 'dawn':
        return <Sunrise size={size} color={isActive ? '#FFFFFF' : '#D97706'} strokeWidth={2.4} />;
      case 'day':
        return <Sun size={size} color={isActive ? '#FFFFFF' : '#0284C7'} strokeWidth={2.4} />;
      case 'sunset':
        return <Sunset size={size} color={isActive ? '#FFFFFF' : '#DB2777'} strokeWidth={2.4} />;
      case 'night':
        return <Moon size={size} color={isActive ? '#FFFFFF' : '#FDE047'} fill={isActive ? '#FFFFFF' : '#FDE047'} strokeWidth={2.4} />;
    }
  };

  const cycleToNextPeriod = () => {
    audioService.triggerHaptic('light');

    // Soft tactile squish bounce on tap
    Animated.sequence([
      Animated.timing(pillScaleAnim, {
        toValue: 0.92,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(pillScaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();

    // Cycle order: auto -> dawn -> day -> sunset -> night -> auto
    const modes: SkyMode[] = ['auto', 'dawn', 'day', 'sunset', 'night'];
    const currentIndex = modes.indexOf(skyMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setSkyMode(nextMode);
  };

  return (
    <View style={styles.switcherContainer}>
      <Animated.View style={{ transform: [{ scale: pillScaleAnim }] }}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={cycleToNextPeriod}
          onLongPress={() => {
            audioService.triggerHaptic('medium');
            setIsOpen((prev) => !prev);
          }}
          style={[
            styles.pillBtn,
            activePeriod === 'night' && styles.pillBtnNight,
          ]}
        >
          {getPeriodIcon(activePeriod, 13)}

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
              <Clock size={8.5} color="#00C4B3" strokeWidth={2.5} />
              <Text style={styles.autoTagText}>Auto</Text>
            </View>
          ) : (
            <View style={styles.customTag}>
              <Text style={styles.customTagText}>Manual</Text>
            </View>
          )}

          {/* Quick Expand Toggle Arrow */}
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 6, right: 8 }}
            onPress={(e) => {
              e.stopPropagation();
              audioService.triggerHaptic('selection');
              setIsOpen((prev) => !prev);
            }}
            style={styles.expandArrowBtn}
          >
            <ChevronDown
              size={11}
              color={activePeriod === 'night' ? '#CBD5E1' : '#64748B'}
              strokeWidth={2.4}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>

      {/* Expanded Tactile Icon Palette (NO EMOJI - ALWAYS PURE ICONS) */}
      {isOpen && (
        <View style={styles.optionsPopup}>
          {/* Option: Auto Real-Time Clock */}
          <TouchableOpacity
            onPress={() => {
              setSkyMode('auto');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'auto' && styles.optionBtnActive]}
          >
            <Clock size={12} color={skyMode === 'auto' ? '#FFFFFF' : colors.primaryDark} strokeWidth={2.2} />
            <Text style={[styles.optionText, skyMode === 'auto' && styles.optionTextActive]}>
              {lang === 'th' ? 'เวลาจริง' : 'Auto'}
            </Text>
          </TouchableOpacity>

          {/* Option: Dawn */}
          <TouchableOpacity
            onPress={() => {
              setSkyMode('dawn');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'dawn' && styles.optionBtnActive]}
          >
            {getPeriodIcon('dawn', 12, skyMode === 'dawn')}
            <Text style={[styles.optionText, skyMode === 'dawn' && styles.optionTextActive]}>
              {lang === 'th' ? 'เช้า' : 'Dawn'}
            </Text>
          </TouchableOpacity>

          {/* Option: Day */}
          <TouchableOpacity
            onPress={() => {
              setSkyMode('day');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'day' && styles.optionBtnActive]}
          >
            {getPeriodIcon('day', 12, skyMode === 'day')}
            <Text style={[styles.optionText, skyMode === 'day' && styles.optionTextActive]}>
              {lang === 'th' ? 'กลางวัน' : 'Day'}
            </Text>
          </TouchableOpacity>

          {/* Option: Sunset */}
          <TouchableOpacity
            onPress={() => {
              setSkyMode('sunset');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'sunset' && styles.optionBtnActive]}
          >
            {getPeriodIcon('sunset', 12, skyMode === 'sunset')}
            <Text style={[styles.optionText, skyMode === 'sunset' && styles.optionTextActive]}>
              {lang === 'th' ? 'เย็น' : 'Sunset'}
            </Text>
          </TouchableOpacity>

          {/* Option: Night */}
          <TouchableOpacity
            onPress={() => {
              setSkyMode('night');
              setIsOpen(false);
            }}
            style={[styles.optionBtn, skyMode === 'night' && styles.optionBtnActive]}
          >
            {getPeriodIcon('night', 12, skyMode === 'night')}
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
  floatingBgCloud: {
    position: 'absolute',
  },
  dreamOrb1: {
    position: 'absolute',
    top: 90,
    left: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  dreamOrb2: {
    position: 'absolute',
    top: 250,
    right: -50,
    width: 240,
    height: 240,
    borderRadius: 120,
  },
  nightMoonContainer: {
    position: 'absolute',
    top: 185,
    right: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  moonDreamAuraOuter: {
    position: 'absolute',
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(129, 140, 248, 0.22)',
  },
  moonDreamAuraMid: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(253, 224, 71, 0.25)',
  },
  starsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  vectorStarItem: {
    position: 'absolute',
  },
  sunriseSunContainer: {
    position: 'absolute',
    top: 185,
    left: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sunDreamAuraOuterDawn: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(254, 215, 170, 0.35)',
  },
  sunDreamAuraMidDawn: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(251, 146, 60, 0.35)',
  },
  morningMist1: {
    position: 'absolute',
    top: 180,
    left: -40,
    right: -40,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 25,
  },
  morningMist2: {
    position: 'absolute',
    top: 250,
    left: -20,
    right: -20,
    height: 40,
    backgroundColor: 'rgba(255, 247, 237, 0.28)',
    borderRadius: 20,
  },
  daySunContainer: {
    position: 'absolute',
    top: 185,
    right: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sunDreamAuraOuterDay: {
    position: 'absolute',
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(254, 240, 138, 0.32)',
  },
  sunDreamAuraMidDay: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(253, 224, 71, 0.42)',
  },
  sunsetSunContainer: {
    position: 'absolute',
    top: 185,
    right: 22,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sunDreamAuraOuterSunset: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(244, 114, 182, 0.32)',
  },
  sunDreamAuraMidSunset: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(251, 113, 133, 0.45)',
  },
  switcherContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 999,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.3,
    borderColor: 'rgba(0, 196, 179, 0.3)',
    gap: 4,
    ...shadows.card,
  },
  pillBtnNight: {
    backgroundColor: 'rgba(30, 41, 59, 0.96)',
    borderColor: 'rgba(253, 224, 71, 0.4)',
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
    paddingHorizontal: 4.5,
    paddingVertical: 1,
    borderRadius: 5,
    gap: 2,
  },
  autoTagText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 7.5,
    color: colors.primaryDark,
  },
  customTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 4.5,
    paddingVertical: 1,
    borderRadius: 5,
  },
  customTagText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 7.5,
    color: '#92400E',
  },
  expandArrowBtn: {
    paddingLeft: 1,
    paddingRight: 1,
  },
  optionsPopup: {
    position: 'absolute',
    top: 30,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1.5,
    borderColor: colors.borderTeal,
    gap: 3,
    ...shadows.soft,
    zIndex: 9999,
    elevation: 10,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4.5,
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
