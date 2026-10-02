export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  absorbed: boolean;
}

interface AuraParticleOptions {
  centerX: number;
  centerY: number;
  total: number;
  colors: readonly string[];
}

export const createAuraParticles = ({
  centerX,
  centerY,
  total,
  colors,
}: AuraParticleOptions): Particle[] => {
  return Array.from({ length: total }, (_, index) => {
    const angle = (Math.PI * 2 * index) / total;
    const radius = 60 + Math.random() * 50;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: 2 + Math.random() * 3,
      alpha: 0.3 + Math.random() * 0.5,
      color: colors[index % colors.length],
      absorbed: false,
    };
  });
};
