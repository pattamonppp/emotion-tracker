const fs = require('fs');
const path = require('path');

// Generate an ultra-soft, warm, cozy marshmallow drop sound (16-bit 44.1kHz stereo PCM WAV)
const sampleRate = 44100;
const durationSec = 0.55;
const totalSamples = Math.floor(sampleRate * durationSec);

const leftChannel = new Float32Array(totalSamples);
const rightChannel = new Float32Array(totalSamples);

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;

  // Pitch envelope: starts at ~620 Hz and gently glides down to ~440 Hz (soft warm waterdrop/marshmallow curve)
  const pitchGlide = Math.exp(-t * 9.0);
  const freq = 440 + 180 * pitchGlide;

  // Soft rounded attack (18ms) to completely eliminate any click/harshness, followed by gentle warm exponential decay
  const attack = Math.min(1, t / 0.018);
  const decay = Math.exp(-t * 5.2);
  const env = attack * decay;

  // Harmonics: pure warm sine fundamental + gentle soft octave overtone
  const f1 = Math.sin(2 * Math.PI * freq * t);
  const f2 = 0.28 * Math.sin(2 * Math.PI * (freq * 1.99) * t) * Math.exp(-t * 8.0);
  const f3 = 0.12 * Math.sin(2 * Math.PI * (freq * 2.98) * t) * Math.exp(-t * 12.0);

  // Soft low warm sub body
  const sub = 0.22 * Math.sin(2 * Math.PI * (freq * 0.5) * t) * Math.exp(-t * 6.5);

  const sampleVal = (f1 + f2 + f3 + sub) * env * 0.55;

  leftChannel[i] = sampleVal * 0.95;
  rightChannel[i] = sampleVal * 1.05;
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
