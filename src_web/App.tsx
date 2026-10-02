import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  ResetPhase, 
  EmotionTagId, 
  InterventionOption, 
  ShiftFeedback 
} from './types';
import { EMOTION_TAGS } from './data/matrixData';
import { MobileFrame } from './components/MobileFrame';
import { DesignSystemDrawer } from './design-system/DesignSystemDrawer';
import { Phase1EmotionJar } from './phases/Phase1EmotionJar';
import { OnboardingModal } from './phases/Phase1EmotionJar/modals/OnboardingModal';
import { LivePulseSensorModal } from './phases/Phase1EmotionJar/modals/LivePulseSensorModal';
import { MoocaStoryModal } from './phases/Phase1EmotionJar/modals/MoocaStoryModal';
import { SomaticAbsorption } from './phases/Phase2Interventions/SomaticAbsorption';
import { VictorySip } from './phases/Phase2Interventions/VictorySip';
import { KineticShaker } from './phases/Phase2Interventions/KineticShaker';
import { AudioMatrixSanctuary } from './phases/Phase2Interventions/AudioMatrixSanctuary';
import { Phase3CognitiveReframing } from './phases/Phase3CognitiveReframing';
import { Phase4Feedback } from './phases/Phase4Feedback';
import { ResetCompletedView } from './phases/ResetCompletedView';
import { ResetHistoryModal } from './phases/ResetCompletedView/modals/ResetHistoryModal';
import { audioService } from './services/audioService';

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
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('kinetic_vibe_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [currentPhase, setCurrentPhase] = useState<ResetPhase>('phase1_jar');
  const [activeOption, setActiveOption] = useState<InterventionOption>('A');
  const [selectedEmotions, setSelectedEmotions] = useState<EmotionTagId[]>([]);
  const [heartRate, setHeartRate] = useState(105);
  const [feedback, setFeedback] = useState<ShiftFeedback | null>(null);
  const [history, setHistory] = useState<ShiftFeedback[]>(() => {
    const saved = localStorage.getItem('kinetic_vibe_history');
    return saved ? JSON.parse(saved) : [];
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

  // Save profile changes
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('kinetic_vibe_profile', JSON.stringify(newProfile));
    setIsOnboardingOpen(false);
  };

  const toggleLanguage = () => {
    const newLang: 'en' | 'th' = profile.language === 'th' ? 'en' : 'th';
    const updated: UserProfile = { ...profile, language: newLang };
    setProfile(updated);
    localStorage.setItem('kinetic_vibe_profile', JSON.stringify(updated));
  };

  // Timer lifecycle for 120-second architecture
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning && elapsedSeconds < 120) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          return next;
        });
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
    localStorage.setItem('kinetic_vibe_history', JSON.stringify(updatedHistory));
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

  return (
    <>
      <MobileFrame
        profile={profile}
        currentPhase={currentPhase}
        phaseTime={elapsedSeconds}
        onOpenDesignSystem={() => setIsDesignSystemOpen(true)}
        onOpenProfile={() => setIsOnboardingOpen(true)}
        onToggleLanguage={toggleLanguage}
        onOpenStory={() => setIsStoryModalOpen(true)}
      >
        {/* Phase 1: Zero-Friction Capture & Tactile Emotion Jar */}
        {currentPhase === 'phase1_jar' && (
          <Phase1EmotionJar
            currentLocation={
              profile.goal === 'exam'
                ? (profile.language === 'th' ? 'สนามสอบ / ห้องเรียน' : 'Exam Hall / School')
                : profile.goal === 'stage'
                ? (profile.language === 'th' ? 'หลังเวที / ก่อนพรีเซนต์' : 'Backstage / Event')
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

        {/* Phase 2: Tailored Intervention Engine (65s Dedicated Focus) */}
        {currentPhase === 'phase2_intervention' && (
          <div className="flex flex-col h-full">
            {/* Quick Intervention Switcher - Cozy Mooca pastel styling */}
            <div className="px-3 pt-2 pb-1.5 bg-[#E6F9F7]/80 backdrop-blur-md border-b border-[#00C4B3]/20 flex items-center justify-between text-xs shadow-2xs">
              <span className="text-[10px] text-[#004D40] font-extrabold flex items-center gap-1">
                <span>🐑</span>
                <span>{profile.language === 'th' ? 'โหมดรีเซ็ตใจกับ Mooca:' : 'Reset Mode:'}</span>
              </span>
              <div className="flex gap-1">
                {(['A', 'B', 'C', 'D'] as InterventionOption[]).map((opt) => (
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
                      opt === 'A' ? 'Option A: Somatic Absorption' :
                      opt === 'B' ? 'Option B: The Victory Sip' :
                      opt === 'C' ? 'Option C: Kinetic Shaker' :
                      'Option D: Audio Matrix'
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Intervention View */}
            <div className="flex-1 overflow-hidden">
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
            </div>
          </div>
        )}

        {/* Phase 3: The Cognitive Reframing Page (Insight & Next Step) */}
        {currentPhase === 'phase3_reframing' && (
          <Phase3CognitiveReframing
            goal={profile.goal}
            onProceed={handleReframingComplete}
            lang={profile.language}
          />
        )}

        {/* Phase 4: Closed-Loop Shift Feedback (Delta Check) */}
        {currentPhase === 'phase4_feedback' && (
          <Phase4Feedback
            preHeartRate={heartRate}
            selectedEmotions={selectedEmotions}
            onFinishReset={handleFinishFeedback}
            onRestart={handleRestart}
            lang={profile.language}
          />
        )}

        {/* Completed View */}
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

      {/* Mooca Story & Pocket Sanctuary Modal */}
      <MoocaStoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        lang={profile.language}
        userName={profile.name}
      />

      {/* Onboarding / Profile Settings Modal */}
      <OnboardingModal
        initialProfile={profile}
        onSave={handleSaveProfile}
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Design System & Tokens Inspector Modal */}
      <DesignSystemDrawer
        isOpen={isDesignSystemOpen}
        onClose={() => setIsDesignSystemOpen(false)}
        lang={profile.language}
      />

      {/* Live Optical Pulse & HRV Sensor Modal */}
      <LivePulseSensorModal
        isOpen={isPulseModalOpen}
        onClose={() => setIsPulseModalOpen(false)}
        currentBpm={heartRate}
        onUpdateBpm={setHeartRate}
        lang={profile.language}
      />

      {/* Reset History & Sanctuary Badge Modal */}
      <ResetHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        profile={profile}
        history={history}
        lang={profile.language}
      />
    </>
  );
}
