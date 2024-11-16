export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    memories: boolean;
    achievements: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showStats: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  memories: number;
  photos: number;
  videos: number;
  locations: number;
  updatedAt: string;
}