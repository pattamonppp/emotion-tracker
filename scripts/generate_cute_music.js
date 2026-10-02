const fs = require('fs');
const path = require('path');

// Generate a cute, heartwarming, peaceful Music Box / Kalimba melody (16-bit 44.1kHz stereo PCM WAV)
const sampleRate = 44100;
const bpm = 72; // Calming, sweet tempo
const beatDuration = 60 / bpm; // ~0.833 sec per beat
const totalBars = 8;
const beatsPerBar = 4;
const totalDuration = totalBars * beatsPerBar * beatDuration; // ~26.66 seconds
const totalSamples = Math.floor(sampleRate * totalDuration);

const leftChannel = new Float32Array(totalSamples);
const rightChannel = new Float32Array(totalSamples);

// Cute Music Box note frequencies (G Major pentatonic & diatonic: soothing & uplifting)
const NOTES = {
  G3: 196.00,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.00,
  B5: 987.77,
};

// Cute music box pluck synthesis: clean bell sine + bright partials + exponential decay
function playMusicBoxNote(freq, startBeat, durationBeats, velocity = 0.6, pan = 0) {
  const startSample = Math.floor(startBeat * beatDuration * sampleRate);
  const noteDurationSec = durationBeats * beatDuration;
  const numSamples = Math.min(Math.floor(noteDurationSec * sampleRate), totalSamples - startSample);
  if (numSamples <= 0) return;

  const leftVol = velocity * (1 - pan * 0.5);
  const rightVol = velocity * (1 + pan * 0.5);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Envelope: quick attack (3ms), exponential decay
    const attack = Math.min(1, t / 0.004);
    const decay = Math.exp(-t * 3.2);
    const env = attack * decay;

    // Harmonic bell partials of a celesta/music box
    const f1 = Math.sin(2 * Math.PI * freq * t);
    const f2 = 0.45 * Math.sin(2 * Math.PI * freq * 2.0 * t) * Math.exp(-t * 4.5);
    const f3 = 0.25 * Math.sin(2 * Math.PI * freq * 3.01 * t) * Math.exp(-t * 6.0);
    const f4 = 0.12 * Math.sin(2 * Math.PI * freq * 4.2 * t) * Math.exp(-t * 8.0);
    const sampleVal = (f1 + f2 + f3 + f4) * env;

    const sampleIdx = startSample + i;
    if (sampleIdx < totalSamples) {
      leftChannel[sampleIdx] += sampleVal * leftVol * 0.35;
      rightChannel[sampleIdx] += sampleVal * rightVol * 0.35;
    }
  }
}

// Warm soft bass note for cozy accompaniment
function playSoftBass(freq, startBeat, durationBeats, velocity = 0.4) {
  const startSample = Math.floor(startBeat * beatDuration * sampleRate);
  const noteDurationSec = durationBeats * beatDuration;
  const numSamples = Math.min(Math.floor(noteDurationSec * sampleRate), totalSamples - startSample);
  if (numSamples <= 0) return;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const attack = Math.min(1, t / 0.02);
    const decay = Math.exp(-t * 1.8);
    const env = attack * decay;

    const val = (Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(2 * Math.PI * freq * 2 * t)) * env * velocity * 0.25;
    const sampleIdx = startSample + i;
    if (sampleIdx < totalSamples) {
      leftChannel[sampleIdx] += val;
      rightChannel[sampleIdx] += val;
    }
  }
}

// Composition: Cute, sweet, cozy 8-bar loop
// Melody notes: [note, startBeat, duration, velocity, pan]
const melody = [
  // Bar 1 (Beats 0-4): Sweet welcoming motif
  [NOTES.G4, 0.0, 1.0, 0.55, -0.2],
  [NOTES.B4, 1.0, 1.0, 0.55, 0.1],
  [NOTES.D5, 2.0, 1.5, 0.65, 0.2],
  [NOTES.E5, 3.5, 0.5, 0.5, -0.1],

  // Bar 2 (Beats 4-8): Gentle response
  [NOTES.D5, 4.0, 1.5, 0.6, 0.1],
  [NOTES.B4, 5.5, 0.5, 0.45, -0.2],
  [NOTES.G4, 6.0, 2.0, 0.55, -0.1],

  // Bar 3 (Beats 8-12): Playful lift
  [NOTES.E4, 8.0, 1.0, 0.5, 0.2],
  [NOTES.G4, 9.0, 1.0, 0.55, -0.1],
  [NOTES.A4, 10.0, 1.0, 0.6, 0.2],
  [NOTES.B4, 11.0, 1.0, 0.55, -0.2],

  // Bar 4 (Beats 12-16): Resting in comfort
  [NOTES.A4, 12.0, 2.5, 0.55, 0.1],
  [NOTES.G4, 14.5, 0.5, 0.45, -0.1],
  [NOTES.A4, 15.0, 1.0, 0.5, 0.2],

  // Bar 5 (Beats 16-20): High starry twinkle
  [NOTES.B4, 16.0, 1.0, 0.6, -0.2],
  [NOTES.D5, 17.0, 1.0, 0.65, 0.1],
  [NOTES.G5, 18.0, 1.5, 0.7, 0.2],
  [NOTES.E5, 19.5, 0.5, 0.55, -0.1],

  // Bar 6 (Beats 20-24): Sweet descent
  [NOTES.D5, 20.0, 1.0, 0.6, -0.1],
  [NOTES.B4, 21.0, 1.0, 0.55, 0.2],
  [NOTES.A4, 22.0, 1.0, 0.5, -0.2],
  [NOTES.G4, 23.0, 1.0, 0.55, 0.1],

  // Bar 7 (Beats 24-28): Cozy cuddle
  [NOTES.E4, 24.0, 1.0, 0.5, -0.2],
  [NOTES.G4, 25.0, 1.0, 0.55, 0.1],
  [NOTES.D5, 26.0, 1.5, 0.65, 0.2],
  [NOTES.B4, 27.5, 0.5, 0.45, -0.1],

  // Bar 8 (Beats 28-32): Seamless resolution
  [NOTES.G4, 28.0, 3.5, 0.6, 0.0],
];

// Accompanying sparkle arpeggios
const sparkles = [
  [NOTES.D5, 0.5, 0.5, 0.35, 0.3],
  [NOTES.G5, 1.5, 0.5, 0.38, -0.3],
  [NOTES.B5, 2.5, 0.5, 0.4, 0.25],
  [NOTES.D5, 4.5, 0.5, 0.35, -0.25],
  [NOTES.G4, 6.5, 0.5, 0.3, 0.2],

  [NOTES.C5, 8.5, 0.5, 0.35, 0.3],
  [NOTES.E5, 9.5, 0.5, 0.38, -0.3],
  [NOTES.D5, 12.5, 0.5, 0.35, 0.2],
  [NOTES.B4, 13.5, 0.5, 0.35, -0.2],

  [NOTES.D5, 16.5, 0.5, 0.4, 0.3],
  [NOTES.G5, 17.5, 0.5, 0.45, -0.25],
  [NOTES.A5, 18.5, 0.5, 0.42, 0.25],
  [NOTES.E5, 20.5, 0.5, 0.35, -0.3],
  [NOTES.D5, 21.5, 0.5, 0.35, 0.2],

  [NOTES.G4, 24.5, 0.5, 0.32, -0.2],
  [NOTES.B4, 25.5, 0.5, 0.35, 0.3],
  [NOTES.D5, 28.5, 0.5, 0.35, -0.2],
  [NOTES.B4, 29.5, 0.5, 0.3, 0.2],
];

// Bass line (Soft warm bass root notes on each bar)
const bass = [
  [NOTES.G3, 0.0, 3.8, 0.45],
  [NOTES.B3, 4.0, 3.8, 0.4],
  [NOTES.C4, 8.0, 3.8, 0.45],
  [NOTES.D4, 12.0, 3.8, 0.4],
  [NOTES.G3, 16.0, 3.8, 0.45],
  [NOTES.B3, 20.0, 3.8, 0.4],
  [NOTES.C4, 24.0, 3.8, 0.45],
  [NOTES.G3, 28.0, 3.8, 0.5],
];

// Synthesize melody
melody.forEach(([freq, startBeat, duration, vel, pan]) => {
  playMusicBoxNote(freq, startBeat, duration, vel, pan);
});

// Synthesize sparkles
sparkles.forEach(([freq, startBeat, duration, vel, pan]) => {
  playMusicBoxNote(freq, startBeat, duration, vel, pan);
});

// Synthesize bass
bass.forEach(([freq, startBeat, duration, vel]) => {
  playSoftBass(freq, startBeat, duration, vel);
});

// Build 16-bit PCM WAV
const dataSize = totalSamples * 2 * 2; // 2 channels, 2 bytes per sample
const buffer = Buffer.alloc(44 + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
buffer.writeUInt16LE(2, 22); // NumChannels (2)
buffer.writeUInt32LE(sampleRate, 24); // SampleRate
buffer.writeUInt32LE(sampleRate * 2 * 2, 28); // ByteRate
buffer.writeUInt16LE(4, 32); // BlockAlign (channels * bytes/sample)
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  // Soft fade in & fade out at edges for seamless looping
  const fadeIn = Math.min(1, i / (sampleRate * 0.1));
  const fadeOut = Math.min(1, (totalSamples - 1 - i) / (sampleRate * 0.1));
  const edgeFade = fadeIn * fadeOut;

  // Master limiter
  let l = Math.max(-0.95, Math.min(0.95, leftChannel[i] * edgeFade));
  let r = Math.max(-0.95, Math.min(0.95, rightChannel[i] * edgeFade));

  const sampleL = Math.floor(l * 32767);
  const sampleR = Math.floor(r * 32767);

  buffer.writeInt16LE(sampleL, offset);
  buffer.writeInt16LE(sampleR, offset + 2);
  offset += 4;
}

const outPath = path.resolve(__dirname, '../assets/audio/dreamscape.wav');
fs.writeFileSync(outPath, buffer);
console.log('Successfully generated cute cozy music box track at:', outPath, 'Size:', buffer.length);
