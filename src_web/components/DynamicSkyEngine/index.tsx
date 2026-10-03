import React, { useState, useEffect, createContext, useContext } from 'react';
import classNames from 'classnames';
import { audioService } from '../../services/audioService';
import { Sun, Moon, Sunrise, Sunset, Clock, ChevronDown } from 'lucide-react';
import { getTranslation } from '../../locales';
import { SKY_PERIOD, type SkyTimePeriod, type SkyMode } from '../../types';
import styles from './styles.module.scss';

export { SKY_PERIOD };
export type { SkyTimePeriod, SkyMode };

export interface SkyContextType {
  activePeriod: SkyTimePeriod;
  skyMode: SkyMode;
  setSkyMode: (mode: SkyMode) => void;
  lang: 'th' | 'en';
}

const SkyContext = createContext<SkyContextType>({
  activePeriod: 'day',
  skyMode: 'auto',
  setSkyMode: () => { },
  lang: 'th',
});

export const useSky = () => useContext(SkyContext);

export const getPeriodFromHour = (hour: number): SkyTimePeriod => {
  if (hour >= 5 && hour < 9) return 'dawn';
  if (hour >= 9 && hour < 17) return 'day';
  if (hour >= 17 && hour < 19) return 'sunset';
  return 'night';
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

export const SkyPeriodSwitcher: React.FC = () => {
  const { activePeriod, skyMode, setSkyMode, lang } = useSky();
  const [isOpen, setIsOpen] = useState(false);
  const t = getTranslation(lang);
  const skyLabels = t.common.sky;

  const getPeriodLabel = () => {
    switch (activePeriod) {
      case 'dawn':
        return skyLabels.dawn;
      case 'day':
        return skyLabels.day;
      case 'sunset':
        return skyLabels.sunset;
      case 'night':
        return skyLabels.night;
    }
  };

  const getPeriodIcon = (period: SkyTimePeriod, size = 13, isActive = false) => {
    switch (period) {
      case 'dawn':
        return <Sunrise size={size} color={isActive ? '#FFFFFF' : '#F9A000'} strokeWidth={2.4} />;
      case 'day':
        return <Sun size={size} color={isActive ? '#FFFFFF' : '#1F77DF'} strokeWidth={2.4} />;
      case 'sunset':
        return <Sunset size={size} color={isActive ? '#FFFFFF' : '#EF7773'} strokeWidth={2.4} />;
      case 'night':
        return <Moon size={size} color={isActive ? '#FFFFFF' : '#F4D280'} fill={isActive ? '#FFFFFF' : '#F4D280'} strokeWidth={2.4} />;
    }
  };

  const cycleToNextPeriod = () => {
    audioService.triggerHaptic('light');
    const modes: SkyMode[] = ['auto', 'dawn', 'day', 'sunset', 'night'];
    const currentIndex = modes.indexOf(skyMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setSkyMode(nextMode);
  };

  return (
    <div className={styles.switcherContainer}>
      <button
        type="button"
        onClick={cycleToNextPeriod}
        className={classNames(styles.pillBtn, {
          [styles.pillBtnNight]: activePeriod === 'night',
        })}
      >
        {getPeriodIcon(activePeriod, 13)}

        <span
          className={styles.pillText}
          style={activePeriod === 'night' ? { color: '#F1F5F9' } : undefined}
        >
          {getPeriodLabel()}
        </span>

        {skyMode === 'auto' ? (
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
          onClick={(e) => {
            e.stopPropagation();
            audioService.triggerHaptic('selection');
            setIsOpen((prev) => !prev);
          }}
          className={styles.expandArrowBtn}
          title="Change sky mode"
        >
          <ChevronDown
            size={11}
            color={activePeriod === 'night' ? '#CBD5E1' : '#64748B'}
            strokeWidth={2.4}
          />
        </button>
      </button>

      {isOpen && (
        <div className={styles.optionsPopup}>
          <button
            type="button"
            onClick={() => {
              setSkyMode('auto');
              setIsOpen(false);
            }}
            className={classNames(styles.optionBtn, {
              [styles.optionBtnActive]: skyMode === 'auto',
            })}
          >
            <Clock size={12} color={skyMode === 'auto' ? '#FFFFFF' : '#00695C'} strokeWidth={2.2} />
            <span className={classNames(styles.optionText, { [styles.optionTextActive]: skyMode === 'auto' })}>
              {skyLabels.auto}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSkyMode('dawn');
              setIsOpen(false);
            }}
            className={classNames(styles.optionBtn, {
              [styles.optionBtnActive]: skyMode === 'dawn',
            })}
          >
            {getPeriodIcon('dawn', 12, skyMode === 'dawn')}
            <span className={classNames(styles.optionText, { [styles.optionTextActive]: skyMode === 'dawn' })}>
              {skyLabels.dawn}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSkyMode('day');
              setIsOpen(false);
            }}
            className={classNames(styles.optionBtn, {
              [styles.optionBtnActive]: skyMode === 'day',
            })}
          >
            {getPeriodIcon('day', 12, skyMode === 'day')}
            <span className={classNames(styles.optionText, { [styles.optionTextActive]: skyMode === 'day' })}>
              {skyLabels.day}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSkyMode('sunset');
              setIsOpen(false);
            }}
            className={classNames(styles.optionBtn, {
              [styles.optionBtnActive]: skyMode === 'sunset',
            })}
          >
            {getPeriodIcon('sunset', 12, skyMode === 'sunset')}
            <span className={classNames(styles.optionText, { [styles.optionTextActive]: skyMode === 'sunset' })}>
              {skyLabels.sunset}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSkyMode('night');
              setIsOpen(false);
            }}
            className={classNames(styles.optionBtn, {
              [styles.optionBtnActive]: skyMode === 'night',
            })}
          >
            {getPeriodIcon('night', 12, skyMode === 'night')}
            <span className={classNames(styles.optionText, { [styles.optionTextActive]: skyMode === 'night' })}>
              {skyLabels.night}
            </span>ห
          </button>
        </div>
      )}
    </div>
  );
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

  const getSkyBackgroundStyle = (): React.CSSProperties => {
    switch (activePeriod) {
      case 'dawn':
        return {
          background: 'linear-gradient(180deg, #FFF2E9 0%, #F8E4B3 25%, #F0BF4D 50%, #E4EFFB 75%, #E0F8F6 100%)',
        };
      case 'sunset':
        return {
          background: 'linear-gradient(180deg, #C7DDF7 0%, #F8E4B3 20%, #FAD6D5 45%, #F18B88 70%, #EF7773 100%)',
        };
      case 'night':
        return {
          background: 'linear-gradient(180deg, #000000 0%, #26313c 35%, #272727 70%, #355956 100%)',
        };
      case 'day':
      default:
        return {
          background: 'linear-gradient(180deg, #C7DDF7 0%, #B3EDE8 25%, #E4EFFB 50%, #DBF0EE 75%, #FFFFFF 100%)',
        };
    }
  };

  const isNight = activePeriod === 'night';
  const isDawn = activePeriod === 'dawn';
  const isSunset = activePeriod === 'sunset';

  return (
    <SkyContext.Provider
      value={{
        activePeriod,
        skyMode,
        setSkyMode: handleSetSkyMode,
        lang,
      }}
    >
      <div className={styles.container} style={getSkyBackgroundStyle()}>
        {/* Visual Sky Effects */}
        <div className={styles.skyBackground}>
          {/* Celestial Auras */}
          <div
            className={styles.celestialOrb1}
            style={{
              width: 180,
              height: 180,
              background: isNight
                ? 'radial-gradient(circle, rgba(143, 187, 239, 0.4) 0%, rgba(98, 160, 233, 0.1) 70%, transparent 100%)'
                : isSunset
                  ? 'radial-gradient(circle, rgba(255, 143, 75, 0.45) 0%, rgba(241, 139, 136, 0.2) 70%, transparent 100%)'
                  : isDawn
                    ? 'radial-gradient(circle, rgba(244, 210, 128, 0.5) 0%, rgba(248, 228, 179, 0.25) 70%, transparent 100%)'
                    : 'radial-gradient(circle, rgba(252, 244, 224, 0.5) 0%, rgba(179, 237, 232, 0.25) 70%, transparent 100%)',
            }}
          />

          <div
            className={styles.celestialOrb2}
            style={{
              width: 140,
              height: 140,
              background: isNight
                ? 'radial-gradient(circle, rgba(31, 119, 223, 0.3) 0%, transparent 70%)'
                : isSunset
                  ? 'radial-gradient(circle, rgba(239, 119, 115, 0.35) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(0, 196, 179, 0.2) 0%, transparent 70%)',
            }}
          />

          {/* Twinkling Stars in Night Sky */}
          {isNight && (
            <div className={styles.starField}>
              <div className={styles.twinkleStar} style={{ top: '8%', left: '15%' }}>
                <SvgDiamondStar size={14} color="#F4D280" opacity={0.8} />
              </div>
              <div className={styles.twinkleStar} style={{ top: '15%', right: '20%', animationDelay: '1.2s' }}>
                <SvgDiamondStar size={18} color="#F8E4B3" opacity={0.9} />
              </div>
              <div className={styles.twinkleStar} style={{ top: '28%', left: '78%', animationDelay: '0.6s' }}>
                <SvgDiamondStar size={12} color="#FFFFFF" opacity={0.7} />
              </div>
              <div className={styles.twinkleStar} style={{ top: '35%', left: '30%', animationDelay: '1.8s' }}>
                <SvgDiamondStar size={15} color="#C7DDF7" opacity={0.85} />
              </div>
              <div className={styles.twinkleStar} style={{ top: '48%', right: '12%', animationDelay: '2.1s' }}>
                <SvgDiamondStar size={11} color="#F4D280" opacity={0.65} />
              </div>
            </div>
          )}

          {/* Drifting Clouds */}
          <div className={styles.cloudLayer}>
            <div className={styles.driftingCloud1}>
              <SvgFluffyCloud
                width={140}
                height={70}
                fillColor={isNight ? '#26313c' : isSunset ? '#FDEFEE' : '#FFFFFF'}
                shadowColor={isNight ? '#000000' : isSunset ? '#F18B88' : '#DBF0EE'}
                opacity={isNight ? 0.35 : 0.85}
              />
            </div>
            <div className={styles.driftingCloud2}>
              <SvgFluffyCloud
                width={120}
                height={60}
                fillColor={isNight ? '#374654' : isSunset ? '#FDEFEE' : '#fbfbfb'}
                shadowColor={isNight ? '#26313c' : isSunset ? '#FAD6D5' : '#C7DDF7'}
                opacity={isNight ? 0.3 : 0.8}
              />
            </div>
            <div className={styles.driftingCloud3}>
              <SvgFluffyCloud
                width={110}
                height={55}
                fillColor={isNight ? '#26313c' : isSunset ? '#FFF2E9' : '#FFFFFF'}
                shadowColor={isNight ? '#000000' : isSunset ? '#FF8F4B' : '#E0F8F6'}
                opacity={isNight ? 0.25 : 0.75}
              />
            </div>
            <div className={styles.driftingCloud4}>
              <SvgFluffyCloud
                width={160}
                height={80}
                fillColor={isNight ? '#000000' : '#FFFFFF'}
                shadowColor={isNight ? '#000000' : '#DBF0EE'}
                opacity={isNight ? 0.4 : 0.65}
              />
            </div>
          </div>
        </div>

        {/* Child Content */}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </SkyContext.Provider>
  );
};

export default DynamicSkyEngine;
