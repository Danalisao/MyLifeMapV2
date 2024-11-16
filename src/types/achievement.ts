export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  category: 'memories' | 'social' | 'explorer' | 'collector';
}

export const ACHIEVEMENT_POINTS = {
  common: 10,
  rare: 25,
  epic: 50,
  legendary: 100,
};

export const ACHIEVEMENT_COLORS = {
  common: 'text-slate-500',
  rare: 'text-blue-500',
  epic: 'text-purple-500',
  legendary: 'text-yellow-500',
};