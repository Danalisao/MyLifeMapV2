export type Emotion = 'happy' | 'sad' | 'excited' | 'peaceful' | 'nostalgic';

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  createdAt: string;
}

export interface SharedUser {
  id: string;
  name: string;
  email: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  emotion: Emotion;
  media: Media[];
  userId: string;
  sharedWith?: SharedUser[];
  createdAt: string;
  updatedAt: string;
}