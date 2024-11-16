import React from 'react';
import { motion } from 'framer-motion';
import type { Achievement } from '../../types/achievement';

interface AchievementsListProps {
  achievements: Achievement[];
  onSelect: (achievement: Achievement) => void;
}

export function AchievementsList({ achievements, onSelect }: AchievementsListProps) {
  const categories = {
    memories: 'Souvenirs',
    social: 'Social',
    explorer: 'Explorateur',
    collector: 'Collectionneur'
  };

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3">
            {categories[category as keyof typeof categories]}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {categoryAchievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border cursor-pointer ${
                  achievement.unlocked
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                }`}
                onClick={() => onSelect(achievement)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg shadow-sm ${
                    achievement.unlocked 
                      ? 'bg-white dark:bg-slate-800' 
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{achievement.title}</h4>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                        >
                          Débloqué !
                        </motion.div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {achievement.description}
                    </p>
                    <div className="mt-2">
                      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary-500"
                          initial={{ width: 0 }}
                          animate={{ 
                            width: `${(achievement.progress / achievement.total) * 100}%`,
                          }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {achievement.progress} / {achievement.total}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}