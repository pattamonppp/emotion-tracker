import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { 
  UserProfile, 
  ResetPhase, 
  EmotionTagId, 
  InterventionOption, 
  ShiftFeedback 
} from './types';
import { EMOTION_TAGS } from './data/matrixData';
import { storageService } from './services/storageService';
import { audioService } from './services/audioService';

import { MindfullLogo } from './components/MindfullLogo';
import { Phase1EmotionJar } from './components/Phase1EmotionJar';
import { SomaticAbsorption } from './components/Phase2Interventions/SomaticAbsorption';
import { VictorySip } from './components/Phase2Interventions/VictorySip';
import { KineticShaker } from './components/Phase2Interventions/KineticShaker';
import { AudioMatrixSanctuary } from './components/Phase2Interventions/AudioMatrixSanctuary';
import { Phase3CognitiveReframing } from './components/Phase3CognitiveReframing';
import { Phase4Feedback } from './components/Phase4Feedback';
import { ResetCompletedView } from './components/ResetCompletedView';

import { OnboardingModal } from './components/OnboardingModal';
import { DesignSystemDrawer } from './design-system/DesignSystemDrawer';
import { LivePulseSensorModal } from './components/LivePulseSensorModal';
import { ResetHistoryModal } from './components/ResetHistoryModal';
import { MoocaStoryModal } from './components/MoocaStoryModal';

import { Layers, Languages, Heart } from 'lucide-react-native';
import { colors, radii, shadows, typography } from './design-system/tokens';
import { 
  useFonts, 
  Prompt_300Light, 
  Prompt_400Regular, 
  Prompt_500Medium, 
  Prompt_600SemiBold, 
  Prompt_700Bold 
} from '@expo-google-fonts/prompt';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex',
  ageBracket: '19-24 (มหาวิทยาลัย)',
  goal: 'exam',
  mbti: 'INTJ',
  language: 'th',
  permissions: {
    motion: true,
    haptics: true,
    heartRate: true,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Prompt_300Light,
    Prompt_400Regular,
    Prompt_500Medium,
    Prompt_600SemiBold,
    Prompt_700Bold,
  });

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [currentPhase, setCurrentPhase] = useState<ResetPhase>('phase1_jar');
  const [activeOption, setActiveOption] = useState<InterventionOption>('A');
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionTagId[]>([]);
  const [heartRate, setHeartRate] = useState(105);
  const [feedback, setFeedback] = useState<ShiftFeedback | null>(null);
  const [history, setHistory] = useState<ShiftFeedback[]>([]);

  // 120-second session timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // Load saved profile & history on mount
  useEffect(() => {
    storageService.getProfile(DEFAULT_PROFILE).then(setProfile);
    storageService.getHistory().then(setHistory);
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
    storageService.saveProfile(newProfile);
    setIsOnboardingOpen(false);
  };

  const toggleLanguage = () => {
    const newLang: 'en' | 'th' = profile.language === 'th' ? 'en' : 'th';
    const updated: UserProfile = { ...profile, language: newLang };
    setProfile(updated);
    storageService.saveProfile(updated);
    audioService.triggerHaptic('selection');
  };

  const handleStartIntervention = () => {
    const firstTag = EMOTION_TAGS.find((t) => t.id === selectedEmotions[0]);
    const option = firstTag?.recommendedOption || 'A';
    setActiveOption(option);
    setCurrentPhase('phase2_intervention');
    setIsTimerRunning(true);
  };

  const handleInterventionComplete = () => {
    setCurrentPhase('phase3_reframing');
  };

  const handleReframingComplete = () => {
    setCurrentPhase('phase4_feedback');
  };

  const handleFinishFeedback = (result: ShiftFeedback) => {
    setFeedback(result);
    const updatedHistory = [result, ...history];
    setHistory(updatedHistory);
    storageService.saveHistory(updatedHistory);
    setCurrentPhase('completed');
    setIsTimerRunning(false);
  };

  const handleRestart = () => {
    audioService.stopAllVoice();
    setCurrentPhase('phase1_jar');
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
    if (profile.language === 'th') {
      switch (currentPhase) {
        case 'phase1_jar': return '1. โหลเก็บความกังวล';
        case 'phase2_intervention': return '2. กายกรรมรีเซ็ต';
        case 'phase3_reframing': return '3. ปลดล็อกความคิด';
        case 'phase4_feedback': return '4. วัดผลลัพธ์ใจ';
        case 'completed': return 'กอดใจสำเร็จ';
        default: return 'เริ่มรีเซ็ต';
      }
    } else {
      switch (currentPhase) {
        case 'phase1_jar': return '1. Emotion Jar';
        case 'phase2_intervention': return '2. Somatic Shift';
        case 'phase3_reframing': return '3. Cognitive Insight';
        case 'phase4_feedback': return '4. Bio Feedback';
        case 'completed': return 'Reset Complete';
        default: return 'Start Reset';
      }
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#E6F9F7', '#FFFDF9', '#E0F7F5']}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Top Bar (Wordmark, Story Trigger, Profile/Language Actions) */}
          <View style={styles.topBar}>
            {/* Zone 1: Logo */}
            <View style={styles.logoRow}>
              <MindfullLogo size="sm" />
              <View style={styles.badge120}>
                <Text style={styles.badge120Text}>120s</Text>
              </View>
            </View>

            {/* Zone 2: Mooca Friend Trigger */}
            <TouchableOpacity
              onPress={() => {
                audioService.triggerHaptic('selection');
                setIsStoryModalOpen(true);
              }}
              style={styles.moocaStoryBtn}
            >
              <Text style={{ fontSize: 13 }}>🐑</Text>
              <Text style={styles.moocaStoryText}>
                {profile.language === 'th' ? 'เพื่อน Mooca' : 'Mooca'}
              </Text>
            </TouchableOpacity>

            {/* Zone 3: Actions */}
            <View style={styles.actionsRow}>
              {/* Design Tokens Drawer */}
              <TouchableOpacity
                onPress={() => {
                  audioService.triggerHaptic('selection');
                  setIsDesignSystemOpen(true);
                }}
                style={styles.circleBtn}
              >
                <Layers size={13} color={colors.primary} />
              </TouchableOpacity>

              {/* Language Switch */}
              <TouchableOpacity
                onPress={toggleLanguage}
                style={styles.langBtn}
              >
                <Languages size={12} color={colors.primary} />
                <Text style={styles.langText}>{profile.language.toUpperCase()}</Text>
              </TouchableOpacity>

              {/* Profile Avatar */}
              <TouchableOpacity
                onPress={() => {
                  audioService.triggerHaptic('selection');
                  setIsOnboardingOpen(true);
                }}
                style={styles.avatarBtn}
              >
                <Text style={styles.avatarText}>
                  {profile.name.charAt(0).toUpperCase() || 'M'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dynamic Island Session Pill with Countdown */}
          <View style={styles.dynamicIslandContainer}>
            <View style={styles.dynamicPill}>
              <View style={styles.pingDot} />
              <Text style={styles.phaseLabelText}>{getPhaseName()}</Text>
              <View style={styles.timerChip}>
                <Text style={styles.timerChipText}>{formatSeconds(elapsedSeconds)}</Text>
              </View>
            </View>
          </View>

          {/* Main Phase Viewport */}
          <View style={styles.viewport}>
            {currentPhase === 'phase1_jar' && (
              <Phase1EmotionJar
                currentLocation={
                  profile.goal === 'exam'
                    ? (profile.language === 'th' ? 'สนามสอบ / ห้องเรียน' : 'Exam Hall / School')
                    : profile.goal === 'stage'
                    ? (profile.language === 'th' ? 'หลังเวที / พรีเซนต์' : 'Backstage / Event')
                    : (profile.language === 'th' ? 'ออฟฟิศ / โต๊ะทำงาน' : 'Office Workstation')
                }
                heartRate={heartRate}
                selectedEmotions={selectedEmotions}
                onSelectEmotions={setSelectedEmotions}
                onProceed={handleStartIntervention}
                onOpenPulseSensor={() => setIsPulseModalOpen(true)}
                onOpenStory={() => setIsStoryModalOpen(true)}
                lang={profile.language}
              />
            )}

            {currentPhase === 'phase2_intervention' && (
              <View style={styles.interventionContainer}>
                {/* Intervention Option Switcher */}
                <View style={styles.interventionHeader}>
                  <Text style={styles.interventionHeaderTitle}>
                    🐑 {profile.language === 'th' ? 'โหมดรีเซ็ตใจ:' : 'Reset Mode:'}
                  </Text>
                  <View style={styles.optionsRow}>
                    {(['A', 'B', 'C', 'D'] as InterventionOption[]).map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => {
                          audioService.stopAllVoice();
                          audioService.triggerHaptic('selection');
                          setActiveOption(opt);
                        }}
                        style={[
                          styles.optionBtn,
                          activeOption === opt && styles.optionBtnActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.optionBtnText,
                            activeOption === opt && styles.optionBtnTextActive,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Active Intervention View */}
                <View style={{ flex: 1 }}>
                  {activeOption === 'A' && (
                    <SomaticAbsorption
                      onComplete={handleInterventionComplete}
                      lang={profile.language}
                    />
                  )}
                  {activeOption === 'B' && (
                    <VictorySip
                      onComplete={handleInterventionComplete}
                      lang={profile.language}
                    />
                  )}
                  {activeOption === 'C' && (
                    <KineticShaker
                      onComplete={handleInterventionComplete}
                      lang={profile.language}
                    />
                  )}
                  {activeOption === 'D' && (
                    <AudioMatrixSanctuary
                      mbti={profile.mbti}
                      onComplete={handleInterventionComplete}
                      lang={profile.language}
                    />
                  )}
                </View>
              </View>
            )}

            {currentPhase === 'phase3_reframing' && (
              <Phase3CognitiveReframing
                goal={profile.goal}
                onProceed={handleReframingComplete}
                lang={profile.language}
              />
            )}

            {currentPhase === 'phase4_feedback' && (
              <Phase4Feedback
                preHeartRate={heartRate}
                selectedEmotions={selectedEmotions}
                onFinishReset={handleFinishFeedback}
                onRestart={handleRestart}
                lang={profile.language}
              />
            )}

            {currentPhase === 'completed' && (
              <ResetCompletedView
                profile={profile}
                feedback={feedback}
                onRestart={handleRestart}
                onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
                onOpenProfile={() => setIsOnboardingOpen(true)}
                onOpenHistory={() => setIsHistoryOpen(true)}
                onOpenStory={() => setIsStoryModalOpen(true)}
              />
            )}
          </View>

          {/* Modals */}
          <MoocaStoryModal
            isOpen={isStoryModalOpen}
            onClose={() => setIsStoryModalOpen(false)}
            lang={profile.language}
            userName={profile.name}
          />

          <OnboardingModal
            initialProfile={profile}
            onSave={handleSaveProfile}
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
          />

          <DesignSystemDrawer
            isOpen={isDesignSystemOpen}
            onClose={() => setIsDesignSystemOpen(false)}
            lang={profile.language}
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
      </LinearGradient>
    </SafeAreaProvider>
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
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderTeal,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge120: {
    backgroundColor: '#E6F9F7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderTeal,
  },
  badge120Text: {
    fontFamily: typography.fontPromptBold,
    fontSize: 9,
    color: colors.primaryDark,
  },
  moocaStoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F9F7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.borderTeal,
    gap: 4,
  },
  moocaStoryText: {
    fontFamily: typography.fontPromptSemiBold,
    fontSize: 11,
    color: colors.primaryDark,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  circleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 28,
    paddingHorizontal: 8,
    borderRadius: radii.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    gap: 4,
  },
  langText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  avatarBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  avatarText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  dynamicIslandContainer: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 196, 179, 0.1)',
  },
  dynamicPill: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  timerChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
  },
  timerChipText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 10,
    color: colors.primaryDark,
  },
  viewport: {
    flex: 1,
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
    gap: 6,
  },
  optionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionBtnText: {
    fontFamily: typography.fontPromptBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  optionBtnTextActive: {
    color: '#FFFFFF',
  },
});
