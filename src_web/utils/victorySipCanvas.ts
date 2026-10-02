interface RenderVictorySipFluidOptions {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  liquidLevel: number;
  tiltAngle: number;
  tiltMaxDeg: number;
  isDrinking: boolean;
  waveOffset: number;
}

export const renderVictorySipFluid = ({
  ctx,
  width,
  height,
  liquidLevel,
  tiltAngle,
  tiltMaxDeg,
  isDrinking,
  waveOffset,
}: RenderVictorySipFluidOptions): number => {
  ctx.clearRect(0, 0, width, height);
  const nextWaveOffset = waveOffset + 0.05;
  const fillH = (height * liquidLevel) / 100;
  const surfaceY = height - fillH;

  if (fillH <= 2) return nextWaveOffset;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(width - 10, 0);
  ctx.lineTo(width - 10, height - 30);
  ctx.quadraticCurveTo(width - 10, height - 5, width - 35, height - 5);
  ctx.lineTo(35, height - 5);
  ctx.quadraticCurveTo(10, height - 5, 10, height - 30);
  ctx.closePath();
  ctx.clip();

  const gradient = ctx.createLinearGradient(0, surfaceY, 0, height);
  gradient.addColorStop(0, '#00C4B3');
  gradient.addColorStop(0.5, '#33D0C2');
  gradient.addColorStop(1, '#1E3A8A');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(0, height);

  const tiltOffset = (tiltAngle / tiltMaxDeg) * 20;
  ctx.lineTo(0, surfaceY - tiltOffset);
  for (let x = 0; x <= width; x += 10) {
    const wave = Math.sin(x * 0.04 + nextWaveOffset) * (isDrinking ? 6 : 2.5);
    const tiltedY = surfaceY - tiltOffset + (tiltOffset * 2 * x) / width + wave;
    ctx.lineTo(x, tiltedY);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (let bubble = 0; bubble < 6; bubble++) {
    const x = 25 + ((bubble * 32 + nextWaveOffset * 20) % (width - 50));
    const y = height - 15 - ((bubble * 45 + nextWaveOffset * 30) % Math.max(20, fillH - 10));
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (bubble % 2), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  return nextWaveOffset;
};
