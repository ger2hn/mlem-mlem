export interface PhotoPetal {
  id: string;
  image: string;
  title: string;
  caption: string;
  date: string;
  tag?: string;
  note?: string;
}

export interface FlowerStemConfig {
  id: string;
  type: 'photo' | 'floral';
  photoIndex?: number; // index into photoPetals
  stemHeight: number;
  curveX: number; // horizontal curve offset
  leanAngle: number; // degrees
  swayDelay: number; // seconds
  scale: number;
  zIndex: number;
  label: string;
  flowerType: 'blossom' | 'rose' | 'lotus' | 'sunflower' | 'daisy';
}

export interface FlowerTheme {
  id: string;
  name: string;
  description: string;
  emoji: string;
  // Petal aesthetic
  petalGradient: string[];
  petalSecondaryGradient: string[];
  petalBorder: string;
  petalShadow: string;
  // Center stamen & pollen
  centerColor: string;
  centerRingColor: string;
  pollenColor: string;
  // Foliage
  stemColor: string;
  stemLightColor: string;
  leafColor: string;
  groundMoundColor: string[];
  // Background atmosphere
  bgGradient: string;
  ambientPetalColors: string[];
  textColor: string;
  cardBg: string;
}

export interface DedicationMessage {
  enabled: boolean;
  to: string;
  message: string;
  from: string;
}

export type AnimationState = 'idle' | 'blooming' | 'bloomed' | 'paused';
