import React from 'react';
import { MapPin, Camera, Calendar, Share2, Heart, Star, Trophy, Target, Zap, Crown, Clock, Globe, Video, Users, Palette, BookOpen, Map, Sparkles, Award } from 'lucide-react';
import type { Achievement } from '../types/achievement';

export const achievements: Achievement[] = [
  // Succès de base
  {
    id: 'first-memory',
    title: 'Premier souvenir',
    description: 'Créez votre premier souvenir',
    icon: <Star className="h-6 w-6 text-yellow-500" />,
    progress: 1,
    total: 1,
    unlocked: true,
    unlockedAt: '2024-01-15T10:30:00Z',
    rarity: 'common',
    points: 10,
    category: 'memories'
  },
  {
    id: 'memory-collector',
    title: 'Collectionneur',
    description: 'Ajoutez 10 souvenirs',
    icon: <Trophy className="h-6 w-6 text-blue-500" />,
    progress: 7,
    total: 10,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'collector'
  },

  // Succès photo & vidéo
  {
    id: 'photo-enthusiast',
    title: 'Photographe',
    description: 'Ajoutez 50 photos à vos souvenirs',
    icon: <Camera className="h-6 w-6 text-purple-500" />,
    progress: 23,
    total: 50,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'collector'
  },
  {
    id: 'video-creator',
    title: 'Vidéaste',
    description: 'Ajoutez 10 vidéos à vos souvenirs',
    icon: <Video className="h-6 w-6 text-red-500" />,
    progress: 3,
    total: 10,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'collector'
  },
  {
    id: 'media-master',
    title: 'Maître des médias',
    description: 'Atteignez 100 médias (photos + vidéos)',
    icon: <Palette className="h-6 w-6 text-pink-500" />,
    progress: 45,
    total: 100,
    unlocked: false,
    rarity: 'legendary',
    points: 100,
    category: 'collector'
  },

  // Succès exploration
  {
    id: 'world-explorer',
    title: 'Explorateur',
    description: 'Créez des souvenirs dans 5 pays différents',
    icon: <Globe className="h-6 w-6 text-green-500" />,
    progress: 2,
    total: 5,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'explorer'
  },
  {
    id: 'city-hopper',
    title: 'Globe-trotter',
    description: 'Visitez 10 villes différentes',
    icon: <MapPin className="h-6 w-6 text-indigo-500" />,
    progress: 4,
    total: 10,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'explorer'
  },
  {
    id: 'adventurer',
    title: 'Aventurier',
    description: 'Créez des souvenirs sur tous les continents',
    icon: <Map className="h-6 w-6 text-amber-500" />,
    progress: 2,
    total: 7,
    unlocked: false,
    rarity: 'legendary',
    points: 100,
    category: 'explorer'
  },

  // Succès sociaux
  {
    id: 'social-butterfly',
    title: 'Papillon social',
    description: 'Partagez 20 souvenirs avec des amis',
    icon: <Share2 className="h-6 w-6 text-pink-500" />,
    progress: 5,
    total: 20,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'social'
  },
  {
    id: 'group-memories',
    title: 'Souvenirs partagés',
    description: 'Créez 5 souvenirs avec plusieurs personnes',
    icon: <Users className="h-6 w-6 text-cyan-500" />,
    progress: 2,
    total: 5,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'social'
  },
  {
    id: 'social-star',
    title: 'Star sociale',
    description: 'Obtenez 50 réactions sur vos souvenirs',
    icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
    progress: 12,
    total: 50,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'social'
  },

  // Succès temporels
  {
    id: 'daily-writer',
    title: 'Écrivain quotidien',
    description: 'Écrivez des notes pendant 7 jours consécutifs',
    icon: <Calendar className="h-6 w-6 text-indigo-500" />,
    progress: 3,
    total: 7,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'memories'
  },
  {
    id: 'time-traveler',
    title: 'Voyageur temporel',
    description: 'Ajoutez des souvenirs sur 12 mois différents',
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    progress: 5,
    total: 12,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'memories'
  },
  {
    id: 'historian',
    title: 'Historien',
    description: 'Créez des souvenirs sur 5 années différentes',
    icon: <BookOpen className="h-6 w-6 text-amber-500" />,
    progress: 2,
    total: 5,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'memories'
  },

  // Succès spéciaux
  {
    id: 'emotional-journey',
    title: 'Voyage émotionnel',
    description: 'Utilisez toutes les émotions disponibles',
    icon: <Heart className="h-6 w-6 text-red-500" />,
    progress: 3,
    total: 5,
    unlocked: false,
    rarity: 'common',
    points: 10,
    category: 'memories'
  },
  {
    id: 'memory-master',
    title: 'Maître des souvenirs',
    description: 'Atteignez 100 souvenirs',
    icon: <Crown className="h-6 w-6 text-yellow-500" />,
    progress: 7,
    total: 100,
    unlocked: false,
    rarity: 'legendary',
    points: 100,
    category: 'collector'
  },
  {
    id: 'perfect-memory',
    title: 'Mémoire parfaite',
    description: 'Créez un souvenir avec photo, vidéo, localisation et participants',
    icon: <Award className="h-6 w-6 text-emerald-500" />,
    progress: 0,
    total: 1,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'memories'
  },
  {
    id: 'seasonal-collector',
    title: 'Collectionneur saisonnier',
    description: 'Créez des souvenirs pendant chaque saison',
    icon: <Target className="h-6 w-6 text-teal-500" />,
    progress: 2,
    total: 4,
    unlocked: false,
    rarity: 'rare',
    points: 25,
    category: 'collector'
  },
  {
    id: 'milestone-master',
    title: 'Maître des jalons',
    description: 'Débloquez 10 succès',
    icon: <Zap className="h-6 w-6 text-orange-500" />,
    progress: 3,
    total: 10,
    unlocked: false,
    rarity: 'epic',
    points: 50,
    category: 'collector'
  }
];