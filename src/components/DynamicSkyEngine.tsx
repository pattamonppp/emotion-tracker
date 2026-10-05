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
import { audioService, HAPTIC_STYLE } from '../services/audioService';
import { Sun, Moon, Sunrise, Sunset, Clock, ChevronDown } from 'lucide-react-native';
import { colors, OOCA_TOKENS, radii, shadows, typography } from '../design-system/tokens';
import { getTranslation } from '../locales';
import { SKY, SKY_PERIOD, type SkyTimePeriod, type SkyMode, type Language, LANG, AUTO_SKY } from '../types';

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

export { SKY, SKY_PERIOD };
export type { SkyTimePeriod, SkyMode, Language };

export interface SkyContextType {
  activePeriod: SkyTimePeriod;
  skyMode: SkyMode;
  setSkyMode: (mode: SkyMode) => void;
  lang: Language;
}

const SkyContext = createContext<SkyContextType>({
  activePeriod: SKY.DAY,
  skyMode: AUTO_SKY,
  setSkyMode: () => { },
  lang: LANG.TH,
});

export const useSky = () => useContext(SkyContext);

export const getPeriodFromHour = (hour: number): SkyTimePeriod => {
  if (hour >= 5 && hour < 9) return SKY.DAWN;
  if (hour >= 9 && hour < 17) return SKY.DAY;
  if (hour >= 17 && hour < 19) return SKY.SUNSET;
  return SKY.NIGHT;
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
}> = ({ size, color = '#F4D280', opacity = 1 }) => (
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
  lang?: Language;
}

export const DynamicSkyEngine: React.FC<DynamicSkyEngineProps> = ({
  children,
  onTimePeriodChange,
  lang = LANG.TH,
}) => {
  const [skyMode, setSkyMode] = useState<SkyMode>(AUTO_SKY);
  const [activePeriod, setActivePeriod] = useState<SkyTimePeriod>(() =>
    getPeriodFromHour(new Date().getHours())
  );

  // Celestial animations
  const starTwinkleAnim = useRef(new Animated.Value(0.4)).current;
  const starTwinkleAnim2 = useRef(new Animated.Value(0.8)).current;
  const dayBeamAnim = useRef(new Animated.Value(0.35)).current;
  const sunPulseAnim = useRef(new Animated.Value(1)).current;
  const dreamOrbAnim1 = useRef(new Animated.Value(0.92)).current;
  const dreamOrbAnim2 = useRef(new Animated.Value(1.08)).current;
  const shimmerGentleAnim = useRef(new Animated.Value(0)).current;
  const shimmerGentleOpacity = useRef(new Animated.Value(0.25)).current;

  // Background Cloud Drift Animations (Continuous looping)
  const cloudDrift1 = useRef(new Animated.Value(-160)).current;
  const cloudBob1 = useRef(new Animated.Value(0)).current;

  const cloudDrift2 = useRef(new Animated.Value(SCREEN_WIDTH + 80)).current;
  const cloudBob2 = useRef(new Animated.Value(0)).current;

  const cloudDrift3 = useRef(new Animated.Value(-100)).current;
  const cloudBob3 = useRef(new Animated.Value(0)).current;

  const cloudDrift4 = useRef(new Animated.Value(0)).current;

  // Real-time hour watcher for Auto mode
  useEffect(() => {
    const updateAuto = () => {
      if (skyMode === AUTO_SKY) {
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
    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
    setSkyMode(mode);
    const period = mode === AUTO_SKY ? getPeriodFromHour(new Date().getHours()) : mode;
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

    const starLoop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkleAnim2, {
          toValue: 0.2,
          duration: 1900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starTwinkleAnim2, {
          toValue: 1,
          duration: 1900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    starLoop2.start();

    const beamLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dayBeamAnim, {
          toValue: 0.6,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(dayBeamAnim, {
          toValue: 0.25,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    beamLoop.start();

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

    const shimmerLoop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shimmerGentleAnim, {
            toValue: -6,
            duration: 7500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(shimmerGentleAnim, {
            toValue: 6,
            duration: 7500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(shimmerGentleOpacity, {
            toValue: 0.95,
            duration: 4200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(shimmerGentleOpacity, {
            toValue: 0.52,
            duration: 4200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    shimmerLoop.start();

    return () => {
      driftLoop1.stop();
      bobLoop1.stop();
      driftLoop2.stop();
      bobLoop2.stop();
      driftLoop3.stop();
      bobLoop3.stop();
      driftLoop4.stop();
      starLoop.stop();
      starLoop2.stop();
      beamLoop.stop();
      sunLoop.stop();
      orbLoop1.stop();
      orbLoop2.stop();
      shimmerLoop.stop();
    };
  }, []);

  const getSkyGradients = (): [string, string, ...string[]] => {
    switch (activePeriod) {
      case SKY.DAWN:
        return ['#FFF2E9', '#F8E4B3', '#F0BF4D', '#E4EFFB', '#E0F8F6'];
      case SKY.DAY:
        return ['#C7DDF7', '#B3EDE8', '#E4EFFB', '#DBF0EE', '#FFFFFF'];
      case SKY.SUNSET:
        return ['#C7DDF7', '#F8E4B3', '#FAD6D5', '#F18B88', '#EF7773', '#FF8F4B'];
      case SKY.NIGHT:
      default:
        return ['#000000', '#26313c', '#272727', '#355956'];
    }
  };

  const getCloudTheme = () => {
    switch (activePeriod) {
      case SKY.DAWN:
        return {
          fill1: '#FCF4E0',
          shadow1: '#F8E4B3',
          opacity1: 0.85,
          fill2: '#FFF2E9',
          shadow2: '#FFDDC9',
          opacity2: 0.8,
          fill3: '#FCF4E0',
          shadow3: '#F0BF4D',
          opacity3: 0.82,
          fill4: '#FFF2E9',
          shadow4: '#F8E4B3',
          opacity4: 0.75,
        };
      case SKY.DAY:
        return {
          fill1: '#FFFFFF',
          shadow1: '#DBF0EE',
          opacity1: 0.92,
          fill2: '#FFFFFF',
          shadow2: '#B3EDE8',
          opacity2: 0.86,
          fill3: '#fbfbfb',
          shadow3: '#cdd8e1',
          opacity3: 0.88,
          fill4: '#FFFFFF',
          shadow4: '#E0F8F6',
          opacity4: 0.8,
        };
      case SKY.SUNSET:
        return {
          fill1: '#FDEFEE',
          shadow1: '#F18B88',
          opacity1: 0.82,
          fill2: '#FAD6D5',
          shadow2: '#EF7773',
          opacity2: 0.78,
          fill3: '#FFF2E9',
          shadow3: '#FF8F4B',
          opacity3: 0.8,
          fill4: '#FDEFEE',
          shadow4: '#F7BBB9',
          opacity4: 0.72,
        };
      case SKY.NIGHT:
      default:
        return {
          fill1: '#26313c',
          shadow1: '#000000',
          opacity1: 0.42,
          fill2: '#374654',
          shadow2: '#26313c',
          opacity2: 0.36,
          fill3: '#26313c',
          shadow3: '#000000',
          opacity3: 0.38,
          fill4: '#374654',
          shadow4: '#000000',
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
                  activePeriod === SKY.SUNSET
                    ? 'rgba(244, 114, 182, 0.28)'
                    : activePeriod === SKY.NIGHT
                      ? 'rgba(99, 102, 241, 0.22)'
                      : activePeriod === SKY.DAWN
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
                  activePeriod === SKY.SUNSET
                    ? 'rgba(232, 121, 249, 0.25)'
                    : activePeriod === SKY.NIGHT
                      ? 'rgba(56, 189, 248, 0.18)'
                      : activePeriod === SKY.DAWN
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
        {activePeriod === SKY.NIGHT && (
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

            {/* Night Twinkling Diamond Stars Layer 1 */}
            <Animated.View style={[styles.starsLayer, { opacity: starTwinkleAnim }]}>
              <View style={[styles.vectorStarItem, { top: 75, left: 30 }]}>
                <SvgDiamondStar size={13} color="#FDE047" />
              </View>
              <View style={[styles.vectorStarItem, { top: 90, left: 155 }]}>
                <SvgDiamondStar size={9} color="#FFFFFF" opacity={0.85} />
              </View>
              <View style={[styles.vectorStarItem, { top: 110, right: 80 }]}>
                <SvgDiamondStar size={11} color="#FEF08A" opacity={0.9} />
              </View>
              <View style={[styles.vectorStarItem, { top: 145, left: 60 }]}>
                <SvgDiamondStar size={14} color="#FDE047" />
              </View>
              <View style={[styles.vectorStarItem, { top: 175, right: 40 }]}>
                <SvgDiamondStar size={8} color="#FEF08A" opacity={0.8} />
              </View>
              <View style={[styles.vectorStarItem, { top: 220, left: 40 }]}>
                <SvgDiamondStar size={12} color="#FFFFFF" opacity={0.9} />
              </View>
              <View style={[styles.vectorStarItem, { top: 260, right: 115 }]}>
                <SvgDiamondStar size={10} color="#FDE047" opacity={0.75} />
              </View>
              <View style={[styles.vectorStarItem, { top: 310, left: 85 }]}>
                <SvgDiamondStar size={13} color="#FEF08A" />
              </View>
              <View style={[styles.vectorStarItem, { top: 355, right: 65 }]}>
                <SvgDiamondStar size={11} color="#FDE047" opacity={0.85} />
              </View>
            </Animated.View>

            {/* Night Twinkling Diamond Stars Layer 2 (Alternating Cadence) */}
            <Animated.View style={[styles.starsLayer, { opacity: starTwinkleAnim2 }]}>
              <View style={[styles.vectorStarItem, { top: 65, right: 45 }]}>
                <SvgDiamondStar size={10} color="#FEF08A" opacity={0.8} />
              </View>
              <View style={[styles.vectorStarItem, { top: 125, left: 110 }]}>
                <SvgDiamondStar size={8} color="#FFFFFF" opacity={0.85} />
              </View>
              <View style={[styles.vectorStarItem, { top: 160, right: 135 }]}>
                <SvgDiamondStar size={12} color="#FDE047" opacity={0.7} />
              </View>
              <View style={[styles.vectorStarItem, { top: 195, left: 170 }]}>
                <SvgDiamondStar size={10} color="#FEF08A" opacity={0.8} />
              </View>
              <View style={[styles.vectorStarItem, { top: 235, right: 35 }]}>
                <SvgDiamondStar size={13} color="#FDE047" />
              </View>
              <View style={[styles.vectorStarItem, { top: 280, left: 25 }]}>
                <SvgDiamondStar size={9} color="#FFFFFF" opacity={0.8} />
              </View>
              <View style={[styles.vectorStarItem, { top: 330, left: 140 }]}>
                <SvgDiamondStar size={12} color="#FEF08A" opacity={0.85} />
              </View>
              <View style={[styles.vectorStarItem, { top: 380, right: 45 }]}>
                <SvgDiamondStar size={14} color="#FDE047" />
              </View>
              <View style={[styles.vectorStarItem, { top: 405, left: 50 }]}>
                <SvgDiamondStar size={8} color="#FEF08A" opacity={0.75} />
              </View>
            </Animated.View>
          </View>
        )}

        {/* Dawn Sunrise (Pure Diffused Glowing Circle Sun - NO ICON) */}
        {activePeriod === SKY.DAWN && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.sunriseSunContainer,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <DreamyCelestialAura
                size={145}
                coreColor="#FFF7ED"
                midColor="#FDBA74"
                outerColor="#FED7AA"
                id="dawnBloom"
              />
              <View style={styles.diffusedSunCoreDawn} />
            </Animated.View>
            <View style={styles.morningMist1} />
            <View style={styles.morningMist2} />
          </View>
        )}

        {/* Daytime Sky: Radiant Sunbeams, Sunlight Sparkles & Diffused Sun (NO ICON) */}
        {activePeriod === SKY.DAY && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Dreamy Sunlight Beams radiating across the sky */}
            <Animated.View style={[styles.daySunbeamsLayer, { opacity: dayBeamAnim }]}>
              <Svg width={SCREEN_WIDTH} height={420} viewBox="0 0 390 420">
                <Defs>
                  <SvgLinearGradient id="beamGrad1" x1="1" y1="0.3" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.35" />
                    <Stop offset="55%" stopColor="#FEF08A" stopOpacity="0.12" />
                    <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="beamGrad2" x1="0.9" y1="0.25" x2="0.25" y2="1">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
                    <Stop offset="60%" stopColor="#FEF08A" stopOpacity="0.1" />
                    <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                <Path d="M 330 180 L 120 420 L 50 420 L 320 180 Z" fill="url(#beamGrad1)" />
                <Path d="M 345 190 L 270 420 L 210 420 L 335 190 Z" fill="url(#beamGrad2)" />
                <Path d="M 320 170 L 30 380 L 0 380 L 305 170 Z" fill="url(#beamGrad1)" opacity={0.5} />
              </Svg>
            </Animated.View>

            {/* Sunlight Floating Sparkles */}
            <Animated.View style={[styles.daySparklesLayer, { opacity: starTwinkleAnim }]}>
              <View style={[styles.vectorStarItem, { top: 110, left: 45 }]}>
                <SvgDiamondStar size={11} color="#FDE047" opacity={0.65} />
              </View>
              <View style={[styles.vectorStarItem, { top: 150, left: 160 }]}>
                <SvgDiamondStar size={13} color="#FFFFFF" opacity={0.8} />
              </View>
              <View style={[styles.vectorStarItem, { top: 205, left: 75 }]}>
                <SvgDiamondStar size={10} color="#FDE047" opacity={0.6} />
              </View>
              <View style={[styles.vectorStarItem, { top: 260, right: 60 }]}>
                <SvgDiamondStar size={12} color="#FEF08A" opacity={0.7} />
              </View>
              <View style={[styles.vectorStarItem, { top: 315, left: 35 }]}>
                <SvgDiamondStar size={11} color="#FFFFFF" opacity={0.75} />
              </View>
            </Animated.View>

            {/* Pure Diffused Glowing Circle Day Sun - NO ICON */}
            <Animated.View
              style={[
                styles.daySunContainer,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <DreamyCelestialAura
                size={155}
                coreColor="#FFFFFF"
                midColor="#FEF08A"
                outerColor="#FDE047"
                id="daySunBloom"
              />
              <View style={styles.diffusedSunCoreDay} />
            </Animated.View>
          </View>
        )}

        {/* Sunset Sun (Pure Diffused Glowing Circle Sun - NO ICON) */}
        {activePeriod === SKY.SUNSET && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.View
              style={[
                styles.sunsetSunContainer,
                { transform: [{ scale: sunPulseAnim }] },
              ]}
            >
              <DreamyCelestialAura
                size={145}
                coreColor="#FFF1F2"
                midColor="#FDA4AF"
                outerColor="#F43F5E"
                id="sunsetBloom"
              />
              <View style={styles.diffusedSunCoreSunset} />
            </Animated.View>
          </View>
        )}

        {/* Whimsical Fantasy Stardust & Fairy Mote Shimmer at Mid/Lower Sky */}
        <Animated.View
          style={[
            styles.bottomShimmerContainer,
            {
              opacity: shimmerGentleOpacity,
              transform: [{ translateY: shimmerGentleAnim }],
            },
          ]}
          pointerEvents="none"
        >
          {/* Fairy Mote 1: Stardust Gold / Rose with soft ambient aura */}
          <View style={{ position: 'absolute', bottom: 24, left: '8%' }}>
            <View style={[styles.fairyMoteGlow, { backgroundColor: activePeriod === SKY.SUNSET ? '#F18B88' : '#F4D280', opacity: 0.35 }]} />
            <View style={[styles.fairyMoteCore, { backgroundColor: activePeriod === SKY.SUNSET ? '#FDEFEE' : '#F8E4B3' }]} />
          </View>

          {/* Fairy Mote 2: Pastel Peach / Celestial Cyan */}
          <View style={{ position: 'absolute', bottom: 74, left: '22%' }}>
            <View style={[styles.fairyMoteGlow, { backgroundColor: activePeriod === SKY.NIGHT ? '#62A0E9' : '#F0BF4D', opacity: 0.3 }]} />
            <View style={[styles.fairyMoteCore, { backgroundColor: '#FFFFFF' }]} />
          </View>

          {/* Fairy Mote 3: Rose Stardust */}
          <View style={{ position: 'absolute', bottom: 16, right: '18%' }}>
            <View style={[styles.fairyMoteGlow, { backgroundColor: activePeriod === SKY.NIGHT ? '#C5ECB3' : '#FAD6D5', opacity: 0.35 }]} />
            <View style={[styles.fairyMoteCore, { backgroundColor: '#FFFFFF' }]} />
          </View>

          {/* Fairy Mote 4: Twilight Violet / Mint */}
          <View style={{ position: 'absolute', bottom: 92, right: '12%' }}>
            <View style={[styles.fairyMoteGlow, { backgroundColor: activePeriod === SKY.NIGHT ? '#8FBBEF' : '#80E2D9', opacity: 0.32 }]} />
            <View style={[styles.fairyMoteCore, { backgroundColor: '#F8E4B3' }]} />
          </View>

          {/* Fairy Mote 5: Center subtle float */}
          <View style={{ position: 'absolute', bottom: 44, left: '46%' }}>
            <View style={[styles.fairyMoteGlow, { width: 14, height: 14, backgroundColor: activePeriod === SKY.SUNSET ? '#EF7773' : '#4DD6CA', opacity: 0.3 }]} />
            <View style={[styles.fairyMoteCore, { width: 4.5, height: 4.5, backgroundColor: '#FFFFFF' }]} />
          </View>

          {/* Whimsical Fantasy Twinkling Diamond Stars */}
          <View style={{ position: 'absolute', bottom: 84, left: '14%' }}>
            <SvgDiamondStar size={11} color={activePeriod === SKY.SUNSET ? '#F4D280' : activePeriod === SKY.NIGHT ? '#C7DDF7' : '#F0BF4D'} opacity={0.9} />
          </View>
          <View style={{ position: 'absolute', bottom: 36, left: '32%' }}>
            <SvgDiamondStar size={8} color={activePeriod === SKY.SUNSET ? '#F18B88' : activePeriod === SKY.NIGHT ? '#4DD6CA' : '#FFFFFF'} opacity={0.85} />
          </View>
          <View style={{ position: 'absolute', bottom: 78, right: '28%' }}>
            <SvgDiamondStar size={10} color={activePeriod === SKY.SUNSET ? '#F4D280' : activePeriod === SKY.NIGHT ? '#F4D280' : '#80E2D9'} opacity={0.92} />
          </View>
          <View style={{ position: 'absolute', bottom: 58, right: '40%' }}>
            <SvgDiamondStar size={7.5} color={activePeriod === SKY.SUNSET ? '#FAD6D5' : activePeriod === SKY.NIGHT ? '#8FBBEF' : '#F8E4B3'} opacity={0.8} />
          </View>
          <View style={{ position: 'absolute', bottom: 104, right: '35%' }}>
            <SvgDiamondStar size={8.5} color="#FFFFFF" opacity={0.88} />
          </View>
        </Animated.View>

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
  const t = getTranslation(lang);
  const skyLabels = t.common.sky;

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case SKY.DAWN:
        return skyLabels.dawn;
      case SKY.DAY:
        return skyLabels.day;
      case SKY.SUNSET:
        return skyLabels.sunset;
      case SKY.NIGHT:
        return skyLabels.night;
    }
  };

  const getPeriodIcon = (period: SkyTimePeriod, size = 13, isActive = false) => {
    switch (period) {
      case SKY.DAWN:
        return <Sunrise size={size} color={isActive ? colors.white : OOCA_TOKENS.color.palette.marigo[800]} strokeWidth={2.4} />;
      case SKY.DAY:
        return <Sun size={size} color={isActive ? colors.white : colors.accentBlue} strokeWidth={2.4} />;
      case SKY.SUNSET:
        return <Sunset size={size} color={isActive ? colors.white : colors.accentPink} strokeWidth={2.4} />;
      case SKY.NIGHT:
        return (
          <Moon
            size={size}
            color={isActive ? colors.white : OOCA_TOKENS.color.palette.marigo[200]}
            fill={isActive ? colors.white : OOCA_TOKENS.color.palette.marigo[200]}
            strokeWidth={2.4}
          />
        );
    }
  };

  const cycleToNextPeriod = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);

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
    const modes: SkyMode[] = [AUTO_SKY, ...Object.values(SKY)];
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
            audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
            setIsOpen((prev) => !prev);
          }}
          style={[
            styles.pillBtn,
            activePeriod === SKY.NIGHT && styles.pillBtnNight,
          ]}
        >
          {getPeriodIcon(activePeriod, 13)}

          <Text
            style={[
              styles.pillText,
              activePeriod === SKY.NIGHT && { color: '#F1F5F9' },
            ]}
          >
            {getPeriodLabel()}
          </Text>

          {skyMode === AUTO_SKY ? (
            <View style={styles.autoTag}>
              <Clock size={8.5} color={colors.primary} strokeWidth={2.5} />
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
              audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
              setIsOpen((prev) => !prev);
            }}
            style={styles.expandArrowBtn}
          >
            <ChevronDown
              size={11}
              color={activePeriod === SKY.NIGHT ? colors.borderSubtle : colors.textMuted}
              strokeWidth={2.4}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>

      {/* Expanded Tactile Icon Palette (NO EMOJI - ALWAYS PURE ICONS) */}
      {isOpen && (
        <>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}
          />
          <View style={styles.optionsPopup}>
            {/* Option: Auto Real-Time Clock */}
            <TouchableOpacity
              onPress={() => {
                setSkyMode(AUTO_SKY);
                setIsOpen(false);
              }}
              style={[styles.optionBtn, skyMode === AUTO_SKY && styles.optionBtnActive]}
            >
              <Clock size={12} color={skyMode === AUTO_SKY ? '#FFFFFF' : colors.primaryDark} strokeWidth={2.2} />
              <Text style={[styles.optionText, skyMode === AUTO_SKY && styles.optionTextActive]}>
                {skyLabels.auto}
              </Text>
            </TouchableOpacity>

            {/* Option: Dawn */}
            <TouchableOpacity
              onPress={() => {
                setSkyMode(SKY.DAWN);
                setIsOpen(false);
              }}
              style={[styles.optionBtn, skyMode === SKY.DAWN && styles.optionBtnActive]}
            >
              {getPeriodIcon(SKY.DAWN, 12, skyMode === SKY.DAWN)}
              <Text style={[styles.optionText, skyMode === SKY.DAWN && styles.optionTextActive]}>
                {skyLabels.dawn}
              </Text>
            </TouchableOpacity>

            {/* Option: Day */}
            <TouchableOpacity
              onPress={() => {
                setSkyMode(SKY.DAY);
                setIsOpen(false);
              }}
              style={[styles.optionBtn, skyMode === SKY.DAY && styles.optionBtnActive]}
            >
              {getPeriodIcon(SKY.DAY, 12, skyMode === SKY.DAY)}
              <Text style={[styles.optionText, skyMode === SKY.DAY && styles.optionTextActive]}>
                {skyLabels.day}
              </Text>
            </TouchableOpacity>

            {/* Option: Sunset */}
            <TouchableOpacity
              onPress={() => {
                setSkyMode(SKY.SUNSET);
                setIsOpen(false);
              }}
              style={[styles.optionBtn, skyMode === SKY.SUNSET && styles.optionBtnActive]}
            >
              {getPeriodIcon(SKY.SUNSET, 12, skyMode === SKY.SUNSET)}
              <Text style={[styles.optionText, skyMode === SKY.SUNSET && styles.optionTextActive]}>
                {skyLabels.sunset}
              </Text>
            </TouchableOpacity>

            {/* Option: Night */}
            <TouchableOpacity
              onPress={() => {
                setSkyMode(SKY.NIGHT);
                setIsOpen(false);
              }}
              style={[styles.optionBtn, skyMode === SKY.NIGHT && styles.optionBtnActive]}
            >
              {getPeriodIcon(SKY.NIGHT, 12, skyMode === SKY.NIGHT)}
              <Text style={[styles.optionText, skyMode === SKY.NIGHT && styles.optionTextActive]}>
                {skyLabels.night}
              </Text>
            </TouchableOpacity>
          </View>
        </>
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
  diffusedSunCoreDawn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 6,
  },
  diffusedSunCoreDay: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 8,
  },
  diffusedSunCoreSunset: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF1F2',
    shadowColor: '#F43F5E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 20,
    elevation: 6,
  },
  daySunbeamsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  daySparklesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  switcherContainer: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 999,
  },
  pillBtn: {
    width: 130,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1.3,
    borderColor: 'rgba(0, 196, 179, 0.3)',
    ...shadows.card,
  },
  pillBtnNight: {
    backgroundColor: 'rgba(30, 41, 59, 0.96)',
    borderColor: 'rgba(253, 224, 71, 0.4)',
  },
  pillText: {
    width: 34,
    textAlign: 'center',
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 9.5,
    color: colors.primaryDark,
  },
  autoTag: {
    width: 37.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6F9F7',
    paddingHorizontal: 2,
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
    width: 37.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 2,
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
  backdrop: {
    position: 'absolute',
    top: -2000,
    bottom: -2000,
    left: -2000,
    right: -2000,
    zIndex: 9998,
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
  bottomShimmerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 110,
    height: 120,
    zIndex: 0,
    elevation: 0,
  },
  shimmerDot: {
    position: 'absolute',
    borderRadius: 9999,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  fairyMoteGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  fairyMoteCore: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 1,
  },
});
