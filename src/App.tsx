import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import {
  UserProfile,
  ResetPhase,
  EmotionTagId,
  InterventionOption,
  ShiftFeedback,
  SkyTimePeriod,
  Language,
  LANG,
  PHASE,
  INTERVENTION,
  SKY,
  ACTIVITY_TYPE,
  GOAL
} from './types';
import { EMOTION_TAGS } from './data/matrixData';
import { storageService } from './services/storageService';
import { audioService, HAPTIC_STYLE } from './services/audioService';
import { DEV_MODE, DEV_START } from './config';

import { MindfullLogo } from './components/MindfullLogo';
import { DynamicSkyEngine, SkyPeriodSwitcher } from './components/DynamicSkyEngine';
import { Phase1EmotionJar } from './phases/Phase1EmotionJar';
import { SomaticAbsorption } from './phases/Phase2Interventions/SomaticAbsorption';
import { VictorySip } from './phases/Phase2Interventions/VictorySip';
import { KineticShaker } from './phases/Phase2Interventions/KineticShaker';
import { BREATH_PATTERN, SomaticBreathingPacer } from './phases/Phase2Interventions/SomaticBreathingPacer';
import { AudioMatrixSanctuary } from './phases/Phase2Interventions/AudioMatrixSanctuary';
import { Phase3CognitiveReframing } from './phases/Phase3CognitiveReframing';
import { Phase4Feedback } from './phases/Phase4Feedback';
import { ResetCompletedView } from './phases/ResetCompletedView';

import { OnboardingModal } from './phases/Phase1EmotionJar/modals/OnboardingModal';
import { LivePulseSensorModal } from './phases/Phase1EmotionJar/modals/LivePulseSensorModal';
import { ResetHistoryModal } from './phases/ResetCompletedView/modals/ResetHistoryModal';

import { Languages, Volume2, VolumeX } from 'lucide-react-native';
import { colors, radii, shadows, typography } from './design-system/tokens';
import {
  useFonts,
  Prompt_300Light,
  Prompt_400Regular,
  Prompt_500Medium,
  Prompt_600SemiBold,
  Prompt_700Bold,
  Prompt_800ExtraBold
} from '@expo-google-fonts/prompt';

import { useUserProfile, LanguageProvider } from './hooks';

export default function App() {
  const { profile, setProfile } = useUserProfile();

  const [fontsLoaded, fontError] = useFonts({
    Prompt_300Light,
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
    Prompt_800ExtraBold,
    'GothamRounded-Bold': require('../assets/fonts/gothamrnd_bold.otf'),
    'GothamRounded-Medium': require('../assets/fonts/gothamrnd_medium.otf'),
    'GothamRounded-Book': require('../assets/fonts/gothamrnd_book.otf'),
    'GothamRounded-Light': require('../assets/fonts/gothamrnd_light.otf'),
    'Gotham Rounded': require('../assets/fonts/gothamrnd_bold.otf'),
  });
  const [currentPhase, setCurrentPhase] = useState<ResetPhase>(
    DEV_MODE ? DEV_START.phase : PHASE.PHASE1_JAR
  );
  const [activeOption, setActiveOption] = useState<InterventionOption>(
    DEV_MODE ? DEV_START.activity : INTERVENTION.A
  );
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionTagId[]>([]);
  const [heartRate, setHeartRate] = useState(105);
  const [feedback, setFeedback] = useState<ShiftFeedback | null>(null);
  const [history, setHistory] = useState<ShiftFeedback[]>([]);

  // 120-second session timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [skyPeriod, setSkyPeriod] = useState<SkyTimePeriod>('day');
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(true);

  // Load saved history on mount + start soothing cute ambient music
  useEffect(() => {
    storageService.getHistory().then(setHistory);
    audioService.startBackgroundMusic();
    const unsub = audioService.subscribeBgm(setIsMusicPlaying);
    return () => unsub();
  }, []);

  // Timer lifecycle for 120-second architecture
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && elapsedSeconds < 120) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, elapsedSeconds]);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsOnboardingOpen(false);
  };

  const toggleLanguage = () => {
    const newLang: Language = profile.language === LANG.TH ? LANG.EN : LANG.TH;
    setProfile({ ...profile, language: newLang });
    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
  };

  const handleStartIntervention = () => {
    const firstTag = EMOTION_TAGS.find((t) => t.id === selectedEmotions[0]);
    const option = firstTag?.recommendedOption || INTERVENTION.A;
    setActiveOption(option);
    setCurrentPhase(PHASE.PHASE2_INTERVENTION);
    setIsTimerRunning(true);
  };

  const handleInterventionComplete = () => {
    setCurrentPhase(PHASE.PHASE3_REFRAMING);
  };

  const handleReframingComplete = () => {
    setCurrentPhase(PHASE.PHASE4_FEEDBACK);
  };

  const handleFinishFeedback = (result: ShiftFeedback) => {
    setFeedback(result);
    const updatedHistory = [result, ...history];
    setHistory(updatedHistory);
    storageService.saveHistory(updatedHistory);
    setCurrentPhase(PHASE.COMPLETED);
    setIsTimerRunning(false);
  };

  const handleRestart = () => {
    audioService.stopAllVoice();
    setCurrentPhase(PHASE.PHASE1_JAR);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setSelectedEmotions([]);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getPhaseName = () => {
    if (profile.language === LANG.TH) {
      switch (currentPhase) {
        case PHASE.PHASE1_JAR: return '1. โหลเก็บความกังวล';
        case PHASE.PHASE2_INTERVENTION: return '2. กายกรรมรีเซ็ต';
        case PHASE.PHASE3_REFRAMING: return '3. ปลดล็อกความคิด';
        case PHASE.PHASE4_FEEDBACK: return '4. วัดผลลัพธ์ใจ';
        case PHASE.COMPLETED: return 'กอดใจสำเร็จ';
        default: return 'เริ่มรีเซ็ต';
      }
    } else {
      switch (currentPhase) {
        case PHASE.PHASE1_JAR: return '1. Emotion Jar';
        case PHASE.PHASE2_INTERVENTION: return '2. Somatic Shift';
        case PHASE.PHASE3_REFRAMING: return '3. Cognitive Insight';
        case PHASE.PHASE4_FEEDBACK: return '4. Bio Feedback';
        case PHASE.COMPLETED: return 'Reset Complete';
        default: return 'Start Reset';
      }
    }
  };

  // Guard rendering so Android does not instantiate native TextViews before fonts are in cache
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#E6F9F7', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }


  return (
    <LanguageProvider initialLang={profile.language}>
      <SafeAreaProvider>
        <StatusBar style={skyPeriod === SKY.NIGHT ? 'light' : 'dark'} />
        <DynamicSkyEngine
          onTimePeriodChange={setSkyPeriod}
          lang={profile.language}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Top Bar (Wordmark, Language Actions, Profile Avatar) - Stable CI */}
            <View style={styles.topBar}>
              {/* Zone 1: Logo */}
              <View style={styles.logoRow}>
                <MindfullLogo size="sm" />
              </View>

              {/* Zone 2: Actions */}
              <View style={styles.actionsRow}>
                {/* Language Switch */}
                <TouchableOpacity
                  onPress={toggleLanguage}
                  activeOpacity={0.8}
                  style={styles.langBtn}
                >
                  <Languages size={13} color={colors.primary} />
                  <Text style={styles.langText}>{profile.language.toUpperCase()}</Text>
                </TouchableOpacity>

                {/* Sound / Music Toggle Button (Between Language & Avatar) */}
                <TouchableOpacity
                  onPress={() => {
                    audioService.toggleBackgroundMusic();
                  }}
                  activeOpacity={0.8}
                  style={[
                    styles.soundBtn,
                    isMusicPlaying && styles.soundBtnActive,
                  ]}
                >
                  {isMusicPlaying ? (
                    <Volume2 size={13} color={colors.primaryDark} />
                  ) : (
                    <VolumeX size={13} color={colors.textMuted} />
                  )}
                </TouchableOpacity>

                {/* Profile Avatar (Rounded 12px Turquoise-Blue Gradient) */}
                <TouchableOpacity
                  onPress={() => {
                    audioService.triggerHaptic(HAPTIC_STYLE.SELECTION);
                    setIsOnboardingOpen(true);
                  }}
                  activeOpacity={0.85}
                  style={styles.avatarWrapper}
                >
                  <LinearGradient
                    colors={[colors.primary, colors.accentBlue]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>
                      {profile.name.charAt(0).toUpperCase() || 'M'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dynamic Island Session Pill with Countdown & Sky Atmosphere Switcher - Stable CI */}
            <View style={styles.dynamicIslandContainer}>
              <View style={styles.dynamicIslandRow}>
                <View style={styles.dynamicPill}>
                  <View style={styles.pingDot} />
                  <Text
                    style={[
                      styles.phaseLabelText,
                      profile.language === LANG.EN && { fontFamily: typography.fontGothamBold },
                    ]}
                    numberOfLines={1}
                  >
                    {getPhaseName()}
                  </Text>
                  <View style={styles.timerChip}>
                    <Text
                      style={[
                        styles.timerChipText,
                        profile.language === LANG.EN && { fontFamily: typography.fontGothamBold },
                      ]}
                    >
                      {formatSeconds(elapsedSeconds)}
                    </Text>
                  </View>
                </View>

                {/* Dynamic Sky Period Switcher */}
                <SkyPeriodSwitcher />
              </View>
            </View>

            {/* Main Phase Viewport */}
            <View style={styles.viewport}>
              {currentPhase === PHASE.PHASE1_JAR && (
                <Phase1EmotionJar
                  currentLocation={
                    profile.goal === GOAL.EXAM
                      ? (profile.language === LANG.TH ? 'สนามสอบ / ห้องเรียน' : 'Exam Hall / School')
                      : profile.goal === GOAL.STAGE
                        ? (profile.language === LANG.TH ? 'หลังเวที / พรีเซนต์' : 'Backstage / Event')
                        : (profile.language === LANG.TH ? 'ออฟฟิศ / โต๊ะทำงาน' : 'Office Workstation')
                  }
                  heartRate={heartRate}
                  selectedEmotions={selectedEmotions}
                  onSelectEmotions={setSelectedEmotions}
                  onProceed={handleStartIntervention}
                  onOpenPulseSensor={() => setIsPulseModalOpen(true)}
                  lang={profile.language}
                  skyPeriod={skyPeriod}
                />
              )}

              {currentPhase === PHASE.PHASE2_INTERVENTION && (
                <View style={styles.interventionContainer}>

                  {/* Active Intervention View */}
                  <View style={{ flex: 1 }}>
                    {activeOption === INTERVENTION.A && (
                      <SomaticAbsorption
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                        skyPeriod={skyPeriod}
                      />
                    )}
                    {activeOption === INTERVENTION.B && (
                      <VictorySip
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                      />
                    )}
                    {activeOption === INTERVENTION.C && (
                      <KineticShaker
                        activityType={ACTIVITY_TYPE.SHAKE}
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                      />
                    )}
                    {activeOption === INTERVENTION.D && (
                      <KineticShaker
                        activityType={ACTIVITY_TYPE.JUMP}
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                      />
                    )}
                    {activeOption === INTERVENTION.E && (
                      <SomaticBreathingPacer
                        pattern={BREATH_PATTERN.BOX}
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                      />
                    )}
                    {activeOption === INTERVENTION.F && (
                      <SomaticBreathingPacer
                        pattern={BREATH_PATTERN.RELAX_478}
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                      />
                    )}
                    {activeOption === INTERVENTION.G && (
                      <AudioMatrixSanctuary
                        mbti={profile.mbti}
                        onComplete={handleInterventionComplete}
                        lang={profile.language}
                      />
                    )}
                  </View>
                </View>
              )}

              {currentPhase === PHASE.PHASE3_REFRAMING && (
                <Phase3CognitiveReframing
                  goal={profile.goal}
                  onProceed={handleReframingComplete}
                  lang={profile.language}
                />
              )}

              {currentPhase === PHASE.PHASE4_FEEDBACK && (
                <Phase4Feedback
                  preHeartRate={heartRate}
                  selectedEmotions={selectedEmotions}
                  onFinishReset={handleFinishFeedback}
                  onRestart={handleRestart}
                  lang={profile.language}
                />
              )}

              {currentPhase === PHASE.COMPLETED && (
                <ResetCompletedView
                  profile={profile}
                  feedback={feedback}
                  onRestart={handleRestart}
                  onOpenProfile={() => setIsOnboardingOpen(true)}
                  onOpenHistory={() => setIsHistoryOpen(true)}
                />
              )}
            </View>

            {/* Modals */}
            <OnboardingModal
              initialProfile={profile}
              onSave={handleSaveProfile}
              isOpen={isOnboardingOpen}
              onClose={() => setIsOnboardingOpen(false)}
            />

            <LivePulseSensorModal
              isOpen={isPulseModalOpen}
              onClose={() => setIsPulseModalOpen(false)}
              currentBpm={heartRate}
              onUpdateBpm={setHeartRate}
              lang={profile.language}
            />

            <ResetHistoryModal
              isOpen={isHistoryOpen}
              onClose={() => setIsHistoryOpen(false)}
              profile={profile}
              history={history}
              lang={profile.language}
            />
          </SafeAreaView>
        </DynamicSkyEngine>
      </SafeAreaProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderTeal,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: 58,
    borderRadius: radii.full,
    backgroundColor: '#F0FDFB',
    borderWidth: 1.5,
    borderColor: '#BFEFEB',
    gap: 4,
  },
  langText: {
    fontFamily: typography.fontGothamBold,
    fontSize: 11,
    color: colors.primaryDark,
    width: 18,
    textAlign: 'center',
  },
  soundBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#F0FDFB',
    borderWidth: 1.5,
    borderColor: '#BFEFEB',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  soundBtnActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.borderTeal,
  },
  avatarWrapper: {
    borderRadius: radii.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: typography.fontGothamBold,
    fontSize: 13,
    color: '#FFFFFF',
  },
  dynamicIslandContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  dynamicIslandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dynamicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 185,
    minWidth: 185,
    backgroundColor: '#E6F9F7',
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 3,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 8,
  },
  pingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  phaseLabelText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
    minWidth: 100,
    flex: 1,
    textAlign: 'center',
  },
  timerChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.full,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerChipText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.primaryDark,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  viewport: {
    flex: 1,
    overflow: 'hidden',
  },
  interventionContainer: {
    flex: 1,
  },
  interventionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(230, 249, 247, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderTeal,
  },
  interventionHeaderTitle: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  optionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 58.5,
  },
  optionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionBtnText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  optionBtnTextActive: {
    color: '#FFFFFF',
  },
});
