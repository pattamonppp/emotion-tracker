import React, { useState, useEffect } from 'react';
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
import { MoocaStoryModal } from './phases/Phase1EmotionJar/modals/MoocaStoryModal';
import { SomaticAbsorption } from './phases/Phase2Interventions/SomaticAbsorption';
import { VictorySip } from './phases/Phase2Interventions/VictorySip';
import { KineticShaker } from './phases/Phase2Interventions/KineticShaker';
import { SomaticBreathingPacer } from './phases/Phase2Interventions/SomaticBreathingPacer';
import { AudioMatrixSanctuary } from './phases/Phase2Interventions/AudioMatrixSanctuary';
import { Phase3CognitiveReframing } from './phases/Phase3CognitiveReframing';
import { Phase4Feedback } from './phases/Phase4Feedback';
import { ResetCompletedView } from './phases/ResetCompletedView';
import { ResetHistoryModal } from './phases/ResetCompletedView/modals/ResetHistoryModal';
import { DesignSystemDrawer } from './design-system/DesignSystemDrawer';
import { audioService } from './services/audioService';
import { HeartIcon } from './icons';
import { DEV_MODE, DEV_START } from './config';
import { useLanguage } from './hooks';
import { STORAGE_KEYS, getStorageJSON, setStorageJSON } from './utils';

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
  const { lang, setLang, toggleLang, t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile>(() => {
    return getStorageJSON<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  });

  const [currentPhase, setCurrentPhase] = useState<ResetPhase>(
    DEV_MODE ? DEV_START.phase : 'phase1_jar'
  );
  const [activeOption, setActiveOption] = useState<InterventionOption>(
    DEV_MODE && ['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(DEV_START.activity)
      ? DEV_START.activity as InterventionOption
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
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isDesignSystemOpen, setIsDesignSystemOpen] = useState(false);
  const [isPulseModalOpen, setIsPulseModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [skyPeriod, setSkyPeriod] = useState<SkyTimePeriod>('day');

  // Save profile changes
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setStorageJSON(STORAGE_KEYS.PROFILE, newProfile);
    if (newProfile.language !== lang) {
      setLang(newProfile.language);
    }
    setIsOnboardingOpen(false);
  };

  const toggleLanguage = () => {
    toggleLang();
    const nextLang = lang === 'th' ? 'en' : 'th';
    const updated: UserProfile = { ...profile, language: nextLang };
    setProfile(updated);
    setStorageJSON(STORAGE_KEYS.PROFILE, updated);
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
    <>
      <MobileFrame
        profile={profile}
        currentPhase={currentPhase}
        phaseTime={elapsedSeconds}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onToggleLanguage={toggleLanguage}
        onOpenStory={() => setIsStoryModalOpen(true)}
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
            onOpenStory={() => setIsStoryModalOpen(true)}
            lang={lang}
            skyPeriod={skyPeriod}
          />
        )}

        {/* Phase 2: Tailored Intervention Engine (65s Dedicated Focus) */}
        {currentPhase === 'phase2_intervention' && (
          <div className="flex flex-col h-full">
            {/* Developer-only intervention switcher */}
            {DEV_MODE && (
              <div className="px-3 pt-2 pb-1.5 bg-[#E6F9F7]/80 backdrop-blur-md border-b border-[#00C4B3]/20 flex items-center justify-between text-xs shadow-2xs">
                <span className="text-[10px] text-[#004D40] font-extrabold flex items-center gap-1.5">
                  <HeartIcon className="w-3.5 h-3.5 text-[#00C4B3]" />
                  <span>{t.phases.phase1.resetModeTitle}</span>
                </span>
                <div className="flex gap-1">
                  {(['A', 'B', 'C', 'D', 'E', 'F', 'G'] as InterventionOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        audioService.stopAllVoice();
                        setActiveOption(opt);
                      }}
                      className={`w-7 h-7 rounded-full text-xs font-black transition-all cursor-pointer ${
                        activeOption === opt
                          ? 'bg-[#00C4B3] text-white shadow-xs scale-105 border border-[#00C4B3]'
                          : 'bg-white text-[#004D40] hover:bg-[#E6F9F7] border border-slate-200'
                      }`}
                      title={
                        opt === 'A' ? t.phases.phase2.options.optA :
                        opt === 'B' ? t.phases.phase2.options.optB :
                        opt === 'C' ? t.phases.phase2.options.optC :
                        opt === 'D' ? t.phases.phase2.options.optD :
                        opt === 'E' ? (t.phases.phase2.options as any).optE || 'Box Breathing' :
                        opt === 'F' ? (t.phases.phase2.options as any).optF || '4-7-8 Breathing' :
                        (t.phases.phase2.options as any).optG || 'Audio Matrix Sanctuary'
                      }
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Active Intervention View - Mirrored from Mobile RN App.tsx */}
            <div className="flex-1 overflow-hidden">
              {activeOption === 'A' && (
                <SomaticAbsorption
                  onComplete={handleInterventionComplete}
                  lang={lang}
                  skyPeriod={skyPeriod}
                />
              )}
              {activeOption === 'B' && (
                <VictorySip
                  onComplete={handleInterventionComplete}
                  lang={lang}
                />
              )}
              {activeOption === 'C' && (
                <KineticShaker
                  activityType="shake"
                  onComplete={handleInterventionComplete}
                  lang={lang}
                />
              )}
              {activeOption === 'D' && (
                <KineticShaker
                  activityType="jump"
                  onComplete={handleInterventionComplete}
                  lang={lang}
                />
              )}
              {activeOption === 'E' && (
                <SomaticBreathingPacer
                  pattern="box"
                  onComplete={handleInterventionComplete}
                  lang={lang}
                />
              )}
              {activeOption === 'F' && (
                <SomaticBreathingPacer
                  pattern="relax478"
                  onComplete={handleInterventionComplete}
                  lang={lang}
                />
              )}
              {activeOption === 'G' && (
                <AudioMatrixSanctuary
                  mbti={profile.mbti}
                  onComplete={handleInterventionComplete}
                  lang={lang}
                />
              )}
            </div>
          </div>
        )}

        {/* Phase 3: Cognitive Reframing (25s) */}
        {currentPhase === 'phase3_reframing' && (
          <Phase3CognitiveReframing
            goal={profile.goal}
            onProceed={handleReframingComplete}
            lang={lang}
          />
        )}

        {/* Phase 4: Shift Verification (15s) */}
        {currentPhase === 'phase4_feedback' && (
          <Phase4Feedback
            preHeartRate={heartRate}
            selectedEmotions={selectedEmotions}
            onFinishReset={handleFinishFeedback}
            onRestart={handleRestart}
            lang={lang}
          />
        )}

        {/* Completed View: 120s Hero Keepsake */}
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
      </MobileFrame>

      {/* Onboarding / Profile Settings Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialProfile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Live Optical PPG Heart Pulse Sensor Modal */}
      <LivePulseSensorModal
        isOpen={isPulseModalOpen}
        onClose={() => setIsPulseModalOpen(false)}
        currentBpm={heartRate}
        onUpdateBpm={setHeartRate}
        lang={lang}
      />

      {/* Reset Journal / Somatic Sanctuary History Modal */}
      <ResetHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        profile={profile}
        history={history}
        lang={lang}
      />

      {/* Mooca Mascot Origin Story Modal */}
      <MoocaStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        lang={lang}
        userName={profile.name}
      />

      {/* Design System Token & Component Drawer */}
      <DesignSystemDrawer
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
        lang={lang}
      />
    </>
  );
}
