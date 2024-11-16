import React from 'react';
import { useUserStats } from '../../hooks/useUserStats';
import { MapPin, Camera, Video, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileStats() {
  const { stats, loading } = useUserStats();

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    { icon: <BookOpen className="h-4 w-4" />, label: 'Souvenirs', value: stats?.memories || 0 },
    { icon: <Camera className="h-4 w-4" />, label: 'Photos', value: stats?.photos || 0 },
    { icon: <Video className="h-4 w-4" />, label: 'Vidéos', value: stats?.videos || 0 },
    { icon: <MapPin className="h-4 w-4" />, label: 'Lieux visités', value: stats?.locations || 0 },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
          >
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-1">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}