export const clamp = (val: number, min: number, max: number): number => {
  return Math.min(Math.max(val, min), max);
};

export const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
