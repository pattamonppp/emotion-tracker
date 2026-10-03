import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import classNames from 'classnames';
import { audioService, HAPTIC_STYLE } from '../../services/audioService';
import { Sun, Moon, Sunrise, Sunset, Clock, ChevronDown } from 'lucide-react';
import { getTranslation } from '../../locales';
import { SKY, SKY_PERIOD, type SkyTimePeriod, type SkyMode, type Language, LANG, AUTO_SKY } from '../../types';
import styles from './styles.module.scss';

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
      <svg width={width} height={height} viewBox="0 0 110 55" style={{ opacity }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="1" />
            <stop offset="100%" stopColor={shadowColor} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path
          d="M25 46 C12 46 2 38 2 26 C2 15 12 8 22 9 C26 3 37 0 52 0 C68 0 80 7 85 16 C93 14 104 18 107 27 C110 37 100 46 88 46 Z"
          fill={`url(#${gradId})`}
        />
      </svg>
    );
  };

export const SvgDiamondStar: React.FC<{
  size: number;
  color?: string;
  opacity?: number;
}> = ({ size, color = '#F4D280', opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ opacity }}>
    <path
      d="M12 1 C12.5 8 16 11.5 23 12 C16 12.5 12.5 16 12 23 C11.5 16 8 12.5 1 12 C8 11.5 11.5 8 12 1 Z"
      fill={color}
    />
  </svg>
);


const DreamyCelestialAura: React.FC<{
  size: number;
  coreColor: string;
  midColor: string;
  outerColor: string;
  id: string;
}> = ({ size, coreColor, midColor, outerColor, id }) => {
  const r = size / 2;
  return (
    <svg width={size} height={size} className={styles.celestialAura}>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={coreColor} stopOpacity="0.8" />
          <stop offset="35%" stopColor={midColor} stopOpacity="0.45" />
          <stop offset="68%" stopColor={outerColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={outerColor} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={r} cy={r} r={r} fill={`url(#${id})`} />
    </svg>
  );
};

type StarSpec = {
  top: number;
  left?: number;
  right?: number;
  size: number;
  color: string;
  opacity?: number;
};

const NIGHT_STARS_1: StarSpec[] = [
  { top: 75, left: 30, size: 13, color: '#FDE047' },
  { top: 90, left: 155, size: 9, color: '#FFFFFF', opacity: 0.85 },
  { top: 110, right: 80, size: 11, color: '#FEF08A', opacity: 0.9 },
  { top: 145, left: 60, size: 14, color: '#FDE047' },
  { top: 175, right: 40, size: 8, color: '#FEF08A', opacity: 0.8 },
  { top: 220, left: 40, size: 12, color: '#FFFFFF', opacity: 0.9 },
  { top: 260, right: 115, size: 10, color: '#FDE047', opacity: 0.75 },
  { top: 310, left: 85, size: 13, color: '#FEF08A' },
  { top: 355, right: 65, size: 11, color: '#FDE047', opacity: 0.85 },
];

const NIGHT_STARS_2: StarSpec[] = [
  { top: 65, right: 45, size: 10, color: '#FEF08A', opacity: 0.8 },
  { top: 125, left: 110, size: 8, color: '#FFFFFF', opacity: 0.85 },
  { top: 160, right: 135, size: 12, color: '#FDE047', opacity: 0.7 },
  { top: 195, left: 170, size: 10, color: '#FEF08A', opacity: 0.8 },
  { top: 235, right: 35, size: 13, color: '#FDE047' },
  { top: 280, left: 25, size: 9, color: '#FFFFFF', opacity: 0.8 },
  { top: 330, left: 140, size: 12, color: '#FEF08A', opacity: 0.85 },
  { top: 380, right: 45, size: 14, color: '#FDE047' },
  { top: 405, left: 50, size: 8, color: '#FEF08A', opacity: 0.75 },
];

const DAY_SPARKLES: StarSpec[] = [
  { top: 110, left: 45, size: 11, color: '#FDE047', opacity: 0.65 },
  { top: 150, left: 160, size: 13, color: '#FFFFFF', opacity: 0.8 },
  { top: 205, left: 75, size: 10, color: '#FDE047', opacity: 0.6 },
  { top: 260, right: 60, size: 12, color: '#FEF08A', opacity: 0.7 },
  { top: 315, left: 35, size: 11, color: '#FFFFFF', opacity: 0.75 },
];

const renderStars = (stars: StarSpec[]) =>
  stars.map((s, i) => (
    <div
      key={i}
      className={styles.vectorStarItem}
      style={{ top: s.top, left: s.left, right: s.right }}
    >
      <SvgDiamondStar size={s.size} color={s.color} opacity={s.opacity} />
    </div>
  ));

const getSkyGradients = (period: SkyTimePeriod): string[] => {
  switch (period) {
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

const toLinearGradient = (colors: string[]) =>
  `linear-gradient(180deg, ${colors.map((c, i) => `${c} ${Math.round((i / (colors.length - 1)) * 100)}%`).join(', ')})`;

const getCloudTheme = (period: SkyTimePeriod) => {
  switch (period) {
    case SKY.DAWN:
      return {
        fill1: '#FCF4E0', shadow1: '#F8E4B3', opacity1: 0.85,
        fill2: '#FFF2E9', shadow2: '#FFDDC9', opacity2: 0.8,
        fill3: '#FCF4E0', shadow3: '#F0BF4D', opacity3: 0.82,
        fill4: '#FFF2E9', shadow4: '#F8E4B3', opacity4: 0.75,
      };
    case SKY.DAY:
      return {
        fill1: '#FFFFFF', shadow1: '#DBF0EE', opacity1: 0.92,
        fill2: '#FFFFFF', shadow2: '#B3EDE8', opacity2: 0.86,
        fill3: '#fbfbfb', shadow3: '#cdd8e1', opacity3: 0.88,
        fill4: '#FFFFFF', shadow4: '#E0F8F6', opacity4: 0.8,
      };
    case SKY.SUNSET:
      return {
        fill1: '#FDEFEE', shadow1: '#F18B88', opacity1: 0.82,
        fill2: '#FAD6D5', shadow2: '#EF7773', opacity2: 0.78,
        fill3: '#FFF2E9', shadow3: '#FF8F4B', opacity3: 0.8,
        fill4: '#FDEFEE', shadow4: '#F7BBB9', opacity4: 0.72,
      };
    case SKY.NIGHT:
    default:
      return {
        fill1: '#26313c', shadow1: '#000000', opacity1: 0.42,
        fill2: '#374654', shadow2: '#26313c', opacity2: 0.36,
        fill3: '#26313c', shadow3: '#000000', opacity3: 0.38,
        fill4: '#374654', shadow4: '#000000', opacity4: 0.32,
      };
  }
};

const LONG_PRESS_MS = 450;

export const SkyPeriodSwitcher: React.FC = () => {
  const { activePeriod, skyMode, setSkyMode, lang } = useSky();
  const [isOpen, setIsOpen] = useState(false);
  const longPressTimer = useRef<number | null>(null);
  const didLongPress = useRef(false);
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
        return <Sunrise size={size} color={isActive ? '#FFFFFF' : '#D97706'} strokeWidth={2.4} />;
      case SKY.DAY:
        return <Sun size={size} color={isActive ? '#FFFFFF' : '#0284C7'} strokeWidth={2.4} />;
      case SKY.SUNSET:
        return <Sunset size={size} color={isActive ? '#FFFFFF' : '#DB2777'} strokeWidth={2.4} />;
      case SKY.NIGHT:
        return (
          <Moon
            size={size}
            color={isActive ? '#FFFFFF' : '#FDE047'}
            fill={isActive ? '#FFFFFF' : '#FDE047'}
            strokeWidth={2.4}
          />
        );
    }
  };

  const cycleToNextPeriod = () => {
    audioService.triggerHaptic(HAPTIC_STYLE.LIGHT);
    const modes: SkyMode[] = [AUTO_SKY, ...Object.values(SKY)];
    const currentIndex = modes.indexOf(skyMode);
    setSkyMode(modes[(currentIndex + 1) % modes.length]);
  };

  const startLongPress = () => {
    didLongPress.current = false;
    longPressTimer.current = window.setTimeout(() => {
      didLongPress.current = true;
      audioService.triggerHaptic(HAPTIC_STYLE.MEDIUM);
      setIsOpen((prev) => !prev);
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const options: { mode: SkyMode; label: string }[] = [
    { mode: AUTO_SKY, label: skyLabels.auto },
    { mode: SKY.DAWN, label: skyLabels.dawn },
    { mode: SKY.DAY, label: skyLabels.day },
    { mode: SKY.SUNSET, label: skyLabels.sunset },
    { mode: SKY.NIGHT, label: skyLabels.night },
  ];

  const isNightPill = activePeriod === SKY.NIGHT;

  return (
    <div className={styles.switcherContainer}>
      <div
        role="button"
        tabIndex={0}
        onPointerDown={startLongPress}
        onPointerUp={cancelLongPress}
        onPointerLeave={cancelLongPress}
        onClick={() => {
          if (didLongPress.current) {
            didLongPress.current = false;
            return;
          }
          cycleToNextPeriod();
        }}
        className={classNames(styles.pillBtn, { [styles.pillBtnNight]: isNightPill })}
      >
        {getPeriodIcon(activePeriod, 13)}

        <span className={classNames(styles.pillText, { [styles.pillTextNight]: isNightPill })}>
          {getPeriodLabel()}
        </span>

        {skyMode === AUTO_SKY ? (
          <span className={styles.autoTag}>
            <Clock size={8.5} color="#00C4B3" strokeWidth={2.5} />
            <span className={styles.autoTagText}>Auto</span>
          </span>
        ) : (
          <span className={styles.customTag}>
            <span className={styles.customTagText}>Manual</span>
          </span>
        )}

        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
            setIsOpen((prev) => !prev);
          }}
          className={styles.expandArrowBtn}
        >
          <ChevronDown size={11} color={isNightPill ? '#CBD5E1' : '#64748B'} strokeWidth={2.4} />
        </button>
      </div>

      {isOpen && (
        <div className={styles.optionsPopup}>
          {options.map(({ mode, label }) => {
            const active = skyMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setSkyMode(mode);
                  setIsOpen(false);
                }}
                className={classNames(styles.optionBtn, { [styles.optionBtnActive]: active })}
              >
                {mode === AUTO_SKY ? (
                  <Clock size={12} color={active ? '#FFFFFF' : '#009688'} strokeWidth={2.2} />
                ) : (
                  getPeriodIcon(mode, 12, active)
                )}
                <span className={classNames(styles.optionText, { [styles.optionTextActive]: active })}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

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

  const cloudTheme = getCloudTheme(activePeriod);
  const isSunset = activePeriod === SKY.SUNSET;
  const isNight = activePeriod === SKY.NIGHT;
  const isDawn = activePeriod === SKY.DAWN;

  const dreamOrb1 = isSunset
    ? 'rgba(244, 114, 182, 0.28)'
    : isNight
      ? 'rgba(99, 102, 241, 0.22)'
      : isDawn
        ? 'rgba(254, 215, 170, 0.35)'
        : 'rgba(186, 230, 253, 0.38)';
  const dreamOrb2 = isSunset
    ? 'rgba(232, 121, 249, 0.25)'
    : isNight
      ? 'rgba(56, 189, 248, 0.18)'
      : isDawn
        ? 'rgba(253, 230, 138, 0.32)'
        : 'rgba(204, 251, 241, 0.38)';

  return (
    <SkyContext.Provider
      value={{
        activePeriod,
        skyMode,
        setSkyMode: handleSetSkyMode,
        lang,
      }}
    >
      <div
        className={styles.container}
        style={{ background: toLinearGradient(getSkyGradients(activePeriod)) }}
      >
        <div className={styles.skyBackground}>
          {/* Dreamy ambient floating light orbs */}
          <div className={styles.dreamOrb1} style={{ backgroundColor: dreamOrb1 }} />
          <div className={styles.dreamOrb2} style={{ backgroundColor: dreamOrb2 }} />

          {/* Floating fluffy background clouds */}
          <div className={styles.cloudLayer}>
            <div className={styles.driftingCloud1}>
              <SvgFluffyCloud width={135} height={68} fillColor={cloudTheme.fill1} shadowColor={cloudTheme.shadow1} opacity={cloudTheme.opacity1} />
            </div>
            <div className={styles.driftingCloud2}>
              <SvgFluffyCloud width={115} height={58} fillColor={cloudTheme.fill2} shadowColor={cloudTheme.shadow2} opacity={cloudTheme.opacity2} />
            </div>
            <div className={styles.driftingCloud3}>
              <SvgFluffyCloud width={88} height={44} fillColor={cloudTheme.fill3} shadowColor={cloudTheme.shadow3} opacity={cloudTheme.opacity3} />
            </div>
            <div className={styles.driftingCloud4}>
              <SvgFluffyCloud width={150} height={74} fillColor={cloudTheme.fill4} shadowColor={cloudTheme.shadow4} opacity={cloudTheme.opacity4} />
            </div>
          </div>

          {/* Night: moon + twinkling diamond stars */}
          {activePeriod === SKY.NIGHT && (
            <div className={styles.periodLayer}>
              <div className={styles.nightMoonContainer}>
                <DreamyCelestialAura size={120} coreColor="#FEF08A" midColor="#818CF8" outerColor="#38BDF8" id="moonBloom" />
                <Moon size={32} color="#FEF08A" fill="#FEF08A" />
              </div>
              <div className={classNames(styles.starsLayer, styles.starTwinkle1)}>{renderStars(NIGHT_STARS_1)}</div>
              <div className={classNames(styles.starsLayer, styles.starTwinkle2)}>{renderStars(NIGHT_STARS_2)}</div>
            </div>
          )}

          {/* Dawn: diffused sunrise + morning mist */}
          {activePeriod === SKY.DAWN && (
            <div className={styles.periodLayer}>
              <div className={classNames(styles.sunriseSunContainer, styles.sunPulse)}>
                <DreamyCelestialAura size={145} coreColor="#FFF7ED" midColor="#FDBA74" outerColor="#FED7AA" id="dawnBloom" />
                <div className={styles.diffusedSunCoreDawn} />
              </div>
              <div className={styles.morningMist1} />
              <div className={styles.morningMist2} />
            </div>
          )}

          {/* Day: sunbeams, sparkles, diffused sun */}
          {activePeriod === SKY.DAY && (
            <div className={styles.periodLayer}>
              <div className={classNames(styles.daySunbeamsLayer, styles.dayBeam)}>
                <svg width="100%" height={420} viewBox="0 0 390 420" preserveAspectRatio="xMaxYMin slice">
                  <defs>
                    <linearGradient id="beamGrad1" x1="1" y1="0.3" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.35" />
                      <stop offset="55%" stopColor="#FEF08A" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="beamGrad2" x1="0.9" y1="0.25" x2="0.25" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
                      <stop offset="60%" stopColor="#FEF08A" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 330 180 L 120 420 L 50 420 L 320 180 Z" fill="url(#beamGrad1)" />
                  <path d="M 345 190 L 270 420 L 210 420 L 335 190 Z" fill="url(#beamGrad2)" />
                  <path d="M 320 170 L 30 380 L 0 380 L 305 170 Z" fill="url(#beamGrad1)" opacity={0.5} />
                </svg>
              </div>
              <div className={classNames(styles.daySparklesLayer, styles.starTwinkle1)}>{renderStars(DAY_SPARKLES)}</div>
              <div className={classNames(styles.daySunContainer, styles.sunPulse)}>
                <DreamyCelestialAura size={155} coreColor="#FFFFFF" midColor="#FEF08A" outerColor="#FDE047" id="daySunBloom" />
                <div className={styles.diffusedSunCoreDay} />
              </div>
            </div>
          )}

          {/* Sunset: diffused sun */}
          {activePeriod === SKY.SUNSET && (
            <div className={styles.periodLayer}>
              <div className={classNames(styles.sunsetSunContainer, styles.sunPulse)}>
                <DreamyCelestialAura size={145} coreColor="#FFF1F2" midColor="#FDA4AF" outerColor="#F43F5E" id="sunsetBloom" />
                <div className={styles.diffusedSunCoreSunset} />
              </div>
            </div>
          )}

          {/* Whimsical stardust & fairy mote shimmer */}
          <div className={styles.bottomShimmerContainer}>
            <div className={styles.fairyMote} style={{ bottom: 24, left: '8%' }}>
              <div className={styles.fairyMoteGlow} style={{ backgroundColor: isSunset ? '#F18B88' : '#F4D280', opacity: 0.35 }} />
              <div className={styles.fairyMoteCore} style={{ backgroundColor: isSunset ? '#FDEFEE' : '#F8E4B3' }} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 74, left: '22%' }}>
              <div className={styles.fairyMoteGlow} style={{ backgroundColor: isNight ? '#62A0E9' : '#F0BF4D', opacity: 0.3 }} />
              <div className={styles.fairyMoteCore} style={{ backgroundColor: '#FFFFFF' }} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 16, right: '18%' }}>
              <div className={styles.fairyMoteGlow} style={{ backgroundColor: isNight ? '#C5ECB3' : '#FAD6D5', opacity: 0.35 }} />
              <div className={styles.fairyMoteCore} style={{ backgroundColor: '#FFFFFF' }} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 92, right: '12%' }}>
              <div className={styles.fairyMoteGlow} style={{ backgroundColor: isNight ? '#8FBBEF' : '#80E2D9', opacity: 0.32 }} />
              <div className={styles.fairyMoteCore} style={{ backgroundColor: '#F8E4B3' }} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 44, left: '46%' }}>
              <div className={styles.fairyMoteGlow} style={{ width: 14, height: 14, backgroundColor: isSunset ? '#EF7773' : '#4DD6CA', opacity: 0.3 }} />
              <div className={styles.fairyMoteCore} style={{ width: 4.5, height: 4.5, backgroundColor: '#FFFFFF' }} />
            </div>

            <div className={styles.fairyMote} style={{ bottom: 84, left: '14%' }}>
              <SvgDiamondStar size={11} color={isSunset ? '#F4D280' : isNight ? '#C7DDF7' : '#F0BF4D'} opacity={0.9} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 36, left: '32%' }}>
              <SvgDiamondStar size={8} color={isSunset ? '#F18B88' : isNight ? '#4DD6CA' : '#FFFFFF'} opacity={0.85} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 78, right: '28%' }}>
              <SvgDiamondStar size={10} color={isSunset ? '#F4D280' : isNight ? '#F4D280' : '#80E2D9'} opacity={0.92} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 58, right: '40%' }}>
              <SvgDiamondStar size={7.5} color={isSunset ? '#FAD6D5' : isNight ? '#8FBBEF' : '#F8E4B3'} opacity={0.8} />
            </div>
            <div className={styles.fairyMote} style={{ bottom: 104, right: '35%' }}>
              <SvgDiamondStar size={8.5} color="#FFFFFF" opacity={0.88} />
            </div>
          </div>
        </div>

        {/* Child Content */}
        <div className={styles.content}>{children}</div>
      </div>
    </SkyContext.Provider>
  );
};

export default DynamicSkyEngine;
