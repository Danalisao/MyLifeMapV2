import React from 'react';
import { Trophy, Star, Target, Award } from 'lucide-react';
import type { Achievement } from '../../types/achievement';
import { motion } from 'framer-motion';

interface AchievementsOverviewProps {
  achievements: Achievement[];
}

export function AchievementsOverview({ achievements }: AchievementsOverviewProps) {
  const totalPoints = achievements.reduce((total, achievement) => {
    return total + (achievement.unlocked ? achievement.points : 0);
  }, 0);

  const maxPoints = achievements.reduce((total, achievement) => {
    return total + achievement.points;
  }, 0);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;
  const nextMilestone = Math.ceil(totalPoints / 100) * 100;

  const stats = [
    {
      icon: <Trophy className="h-5 w-5" />,
      label: "Points",
      value: totalPoints,
      max: maxPoints,
      color: "text-yellow-500"
    },
    {
      icon: <Star className="h-5 w-5" />,
      label: "Succès débloqués",
      value: unlockedCount,
      max: achievements.length,
      color: "text-blue-500"
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: "Progression globale",
      value: Math.round(progressPercentage),
      suffix: "%",
      color: "text-green-500"
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Prochain palier",
      value: nextMilestone,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
        >
          <div className={`flex items-center gap-2 ${stat.color}`}>
            {stat.icon}
            <h4 className="font-medium">{stat.label}</h4>
          </div>
          <p className="text-2xl font-bold mt-2">
            {stat.value}
            {stat.suffix}
            {stat.max && (
              <span className="text-sm text-slate-500"> / {stat.max}</span>
            )}
          </p>
          {stat.max && (
            <div className="mt-2 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${stat.color.replace('text', 'bg')}`}
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}