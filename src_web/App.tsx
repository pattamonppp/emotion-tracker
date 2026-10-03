import { useState, useEffect } from 'react';
import {
  UserProfile,
  ResetPhase,
  EmotionTagId,
  InterventionOption,
  ShiftFeedback,
  SkyTimePeriod
} from './types';
import { EMOTION_TAGS } from './data/matrixData';
import { MobileFrame } from './components/MobileFrame';
import { Phase1EmotionJar } from './phases/Phase1EmotionJar';
import { OnboardingModal } from './phases/Phase1EmotionJar/modals/OnboardingModal';
import { LivePulseSensorModal } from './phases/Phase1EmotionJar/modals/LivePulseSensorModal';
import { SomaticAbsorption } from './phases/Phase2Interventions/SomaticAbsorption';
import { VictorySip } from './phases/Phase2Interventions/VictorySip';
import { KineticShaker } from './phases/Phase2Interventions/KineticShaker';
import { SomaticBreathingPacer } from './phases/Phase2Interventions/SomaticBreathingPacer';
import { AudioMatrixSanctuary } from './phases/Phase2Interventions/AudioMatrixSanctuary';
import { Phase3CognitiveReframing } from './phases/Phase3CognitiveReframing';
import { Phase4Feedback } from './phases/Phase4Feedback';
import { AiFeedbackModal, ResetCompletedView } from './phases/ResetCompletedView';
import { ResetHistoryModal } from './phases/ResetCompletedView/modals/ResetHistoryModal';
import { audioService } from './services/audioService';
import { DEV_MODE, DEV_START } from './config';
import { STORAGE_KEYS, getStorageJSON, setStorageJSON } from './utils';
import { useUserProfile } from './hooks/useUserProfile';
import { LanguageProvider } from './hooks/useLanguage';

export default function App() {
  const { profile, setProfile } = useUserProfile();

  const [currentPhase, setCurrentPhase] = useState<ResetPhase>(
    DEV_MODE ? DEV_START.phase : 'phase1_jar'
  );
  const [activeOption, setActiveOption] = useState<InterventionOption>(
    DEV_MODE && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(DEV_START.activity)
      ? (DEV_START.activity as InterventionOption)
      : 'A'
  );
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionTagId[]>([]);
  const [heartRate, setHeartRate] = useState(105);
  const [feedback, setFeedback] = useState<ShiftFeedback | null>(null);
  const [history, setHistory] = useState<ShiftFeedback[]>(() => {
    return getStorageJSON<ShiftFeedback[]>(STORAGE_KEYS.HISTORY, []);
  });

  // 120-second session timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(
    DEV_MODE && DEV_START.phase === 'phase2_intervention'
  );

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(
    DEV_MODE && (DEV_START.phase as any) === 'onboarding'
  );
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [skyPeriod, setSkyPeriod] = useState<SkyTimePeriod>('day');

  // Start background ambient music on mount
  useEffect(() => {
    audioService.startBackgroundMusic();
  }, []);

  // Save profile changes
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setIsOnboardingOpen(false);
  };

  const toggleLanguage = () => {
    const nextLang: 'en' | 'th' = profile.language === 'th' ? 'en' : 'th';
    setProfile({ ...profile, language: nextLang });
    audioService.triggerHaptic('selection');
  };

  const handleOpenFeedback = () => {
    console.log('OPEN FEEDBACK');
    setIsFeedbackModalOpen(true);
  };

  // Timer lifecycle for 120-second architecture
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && elapsedSeconds < 120) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, elapsedSeconds, currentPhase]);

  // Phase navigation handlers
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
    setStorageJSON(STORAGE_KEYS.HISTORY, updatedHistory);
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

  const locationText =
    profile.goal === 'exam'
      ? (profile.language === 'th' ? 'สนามสอบ / ห้องเรียน' : 'Exam Hall / School')
      : profile.goal === 'stage'
        ? (profile.language === 'th' ? 'หลังเวที / พรีเซนต์' : 'Backstage / Event')
        : (profile.language === 'th' ? 'ออฟฟิศ / โต๊ะทำงาน' : 'Office Workstation');

  return (
    <LanguageProvider initialLang={profile.language}>
      <MobileFrame
        profile={profile}
        currentPhase={currentPhase}
        phaseTime={elapsedSeconds}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onToggleLanguage={toggleLanguage}
        onTimePeriodChange={setSkyPeriod}
      >
        {/* Phase 1: Zero-Friction Capture & Tactile Emotion Jar */}
        {currentPhase === 'phase1_jar' && (
          <Phase1EmotionJar
            currentLocation={locationText}
            heartRate={heartRate}
            selectedEmotions={selectedEmotions}
            onSelectEmotions={setSelectedEmotions}
            onProceed={handleStartIntervention}
            onOpenPulseSensor={() => setIsPulseModalOpen(true)}
            lang={profile.language}
            skyPeriod={skyPeriod}
          />
        )}

        {/* Phase 2: Tailored Intervention Engine (65s Dedicated Focus) */}
        {currentPhase === 'phase2_intervention' && (
          <div className="flex flex-col h-full flex-1 display-flex">
            {/* Active Intervention View - Mirrored from Mobile RN App.tsx */}
            <div className="flex-1 overflow-hidden display-flex">
              {activeOption === 'A' && (
                <SomaticAbsorption
                  onComplete={handleInterventionComplete}
                  lang={profile.language}
                  skyPeriod={skyPeriod}
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
                  activityType="shake"
                  onComplete={handleInterventionComplete}
                  lang={profile.language}
                />
              )}
              {activeOption === 'D' && (
                <KineticShaker
                  activityType="jump"
                  onComplete={handleInterventionComplete}
                  lang={profile.language}
                />
              )}
              {activeOption === 'E' && (
                <SomaticBreathingPacer
                  pattern="box"
                  onComplete={handleInterventionComplete}
                  lang={profile.language}
                />
              )}
              {activeOption === 'F' && (
                <SomaticBreathingPacer
                  pattern="relax478"
                  onComplete={handleInterventionComplete}
                  lang={profile.language}
                />
              )}
              {activeOption === 'G' && (
                <AudioMatrixSanctuary
                  mbti={profile.mbti}
                  onComplete={handleInterventionComplete}
                  lang={profile.language}
                />
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Cognitive Reframing Letter with Washi Tape */}
        {currentPhase === 'phase3_reframing' && (
          <Phase3CognitiveReframing
            goal={profile.goal}
            onProceed={handleReframingComplete}
            lang={profile.language}
          />
        )}

        {/* Phase 4: Shift Assessment & Biofeedback Shift */}
        {currentPhase === 'phase4_feedback' && (
          <Phase4Feedback
            preHeartRate={heartRate}
            selectedEmotions={selectedEmotions}
            onFinishReset={handleFinishFeedback}
            onRestart={handleRestart}
            lang={profile.language}
          />
        )}

        {/* Phase 5: Completion & Micro-Recovery Metrics Summary */}
        {currentPhase === 'completed' && (
          <ResetCompletedView
            profile={profile}
            feedback={feedback}
            onRestart={handleRestart}
            onOpenProfile={() => setIsOnboardingOpen(true)}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenFeedback={handleOpenFeedback}
          />
        )}
      </MobileFrame>

      {/* Modals - Aligned with Mobile RN App.tsx */}
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

      <AiFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        profile={profile}
        feedback={feedback}
        lang={profile.language}
      />
    </LanguageProvider>
  );
}
