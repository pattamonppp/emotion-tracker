# Mindfull — 120s Somatic & Cognitive Reset (React Native / Expo)

A full native mobile application powered by **React Native** and **Expo**, designed for 120-second somatic nervous system resets, acute stress decompression, and pre-performance grounding.

---

## 📱 Quick Start

### 1. Start the Expo Development Server
```bash
npm start
# or
npx expo start
```
From the interactive terminal menu:
- Press `a` to open in an **Android Emulator**
- Press `i` to open in an **iOS Simulator**
- Press `w` to open in the **Web Browser**
- Scan the QR code with **Expo Go** on your physical iPhone or Android device!

### 2. Run Directly on Device or Simulators
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 🛠 Mobile Native Capabilities

- **Hardware Sensors (`expo-sensors`)**:
  - **Accelerometer**: Real device shake detection in Option C (*Kinetic Tension Shaker*) to physically discharge sympathetic adrenaline.
  - **Gyroscope**: Phone tilt tracking in Option B (*The Victory Sip*) with vagal breathing rhythms.
- **Tactile Haptics (`expo-haptics`)**:
  - Tactile clinks when capturing worries into the glass jar.
  - Friction rumble ticks during somatic hand warming.
  - Shockwave haptic triggers upon breakthrough completion.
- **Voice Sanctuary (`expo-speech`)**:
  - Studio vocal affirmations and grounding guidance tailored to the user's MBTI archetype in both **Thai** and **English**.
- **Vector Mascot & Graphics (`react-native-svg`)**:
  - Pure SVG Mooca cloud companion with reactive moods (`happy`, `comforting`, `hugging`, `praying`, `rubbing`, `drinking`, `shaking`, `listening`, `celebrating`).
- **Persistent Storage (`@react-native-async-storage/async-storage`)**:
  - Saves user calibration profile, language preference, and historical session logs.

---

## 📂 Project Structure

```
├── App.tsx                     # Root App component
├── index.ts                    # Expo registration entrypoint
├── app.json                    # Expo configuration & app metadata
├── assets/                     # App icons, splash screens, and adaptive icons
├── src/
│   ├── components/             # Native mobile components
│   │   ├── GlassEmotionJar.tsx           # Glass jar container & tag chips
│   │   ├── MindfullLogo.tsx              # Native brand logo
│   │   ├── MoocaMascot.tsx               # Native SVG interactive mascot
│   │   ├── MoocaStoryModal.tsx           # Lore & companion modal
│   │   ├── OnboardingModal.tsx           # Profile & calibration modal
│   │   ├── LivePulseSensorModal.tsx      # PPG pulse sensor calibration modal
│   │   ├── ResetHistoryModal.tsx         # Reset history modal
│   │   ├── Phase1EmotionJar.tsx          # Phase 1: Worries capture
│   │   ├── Phase2Interventions/          # Phase 2: Somatic interventions
│   │   │   ├── SomaticAbsorption.tsx     # Option A: Hand warming & PanResponder
│   │   │   ├── VictorySip.tsx            # Option B: Vagal sip & Gyroscope
│   │   │   ├── KineticShaker.tsx         # Option C: Shake & Accelerometer
│   │   │   └── AudioMatrixSanctuary.tsx  # Option D: MBTI voice sanctuary
│   │   ├── Phase3CognitiveReframing.tsx  # Phase 3: Cognitive reframe
│   │   ├── Phase4Feedback.tsx            # Phase 4: Bio-delta feedback
│   │   └── ResetCompletedView.tsx        # Completed view & summary
│   ├── data/                   # Emotion matrix, MBTI scripts, reframing insights
│   ├── design-system/          # Native design tokens (colors, radii, shadows) & Button
│   ├── services/               # Native audio, speech, haptics, and async storage
│   └── types/                  # TypeScript types
└── src_web/                    # Preserved original web build
```
