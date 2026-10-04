const fs = require('fs');
const path = require('path');

// Generate an ultra-soft, pleasant crystal-glass chime & warm marshmallow drop sound (16-bit 44.1kHz stereo PCM WAV)
const sampleRate = 44100;
const durationSec = 0.65;
const totalSamples = Math.floor(sampleRate * durationSec);

const leftChannel = new Float32Array(totalSamples);
const rightChannel = new Float32Array(totalSamples);

const chimeFreq = 1046.5; // C6 crystal bell
const fifthFreq = 1567.98; // G6 overtone

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;

  // Smooth anti-pop attack (14ms)
  const attack = Math.min(1, t / 0.014);

  // 1. Crystal Glass Chime layer (delicate bell ring)
  const chimeEnv = attack * Math.exp(-t * 4.6);
  const chime1 = Math.sin(2 * Math.PI * chimeFreq * t);
  const chime2 = 0.22 * Math.sin(2 * Math.PI * (chimeFreq * 2) * t) * Math.exp(-t * 8.0);
  const chime5th = 0.16 * Math.sin(2 * Math.PI * fifthFreq * t) * Math.exp(-t * 6.5);
  const glassChime = (chime1 + chime2 + chime5th) * chimeEnv * 0.28;

  // 2. Warm Marshmallow / Waterdrop body (gentle 520Hz -> 440Hz glide)
  const dropFreq = 440 + 80 * Math.exp(-t * 12.0);
  const dropEnv = attack * Math.exp(-t * 6.8);
  const drop = 0.32 * Math.sin(2 * Math.PI * dropFreq * t) * dropEnv;

  // 3. Ultra-soft sub warmth
  const sub = 0.15 * Math.sin(2 * Math.PI * 261.63 * t) * Math.exp(-t * 5.0) * attack;

  const sampleVal = (glassChime + drop + sub) * 0.7;

  leftChannel[i] = sampleVal * 0.96;
  rightChannel[i] = sampleVal * 1.04;
}

// Build 16-bit PCM WAV
const dataSize = totalSamples * 2 * 2;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(2, 22); // Stereo
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2 * 2, 28);
buffer.writeUInt16LE(4, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < totalSamples; i++) {
  let l = Math.max(-0.95, Math.min(0.95, leftChannel[i]));
  let r = Math.max(-0.95, Math.min(0.95, rightChannel[i]));

  buffer.writeInt16LE(Math.floor(l * 32767), offset);
  buffer.writeInt16LE(Math.floor(r * 32767), offset + 2);
  offset += 4;
}

const outPath = path.resolve(__dirname, '../assets/audio/jar_chime.wav');
fs.writeFileSync(outPath, buffer);
console.log('Successfully generated ultra-soft cozy chime sound at:', outPath, 'Size:', buffer.length);
