import React from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Achievement } from '../../types/achievement';
import { ACHIEVEMENT_COLORS } from '../../types/achievement';

interface AchievementDetailsProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementDetails({ achievement, onClose }: AchievementDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-br from-primary-500 to-primary-600" />
          
          <div className="relative pt-12 px-6 pb-6">
            <div className="flex justify-center -mt-8">
              <div className={`p-4 rounded-xl shadow-lg ${
                achievement.unlocked 
                  ? 'bg-white dark:bg-slate-800' 
                  : 'bg-slate-100 dark:bg-slate-700'
              }`}>
                {achievement.icon}
              </div>
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold">{achievement.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {achievement.description}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>Progression</span>
                  <span>{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(achievement.progress / achievement.total) * 100}%`,
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 text-center">
                  {achievement.progress} / {achievement.total}
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">Rareté</span>
                <span className={`font-medium ${ACHIEVEMENT_COLORS[achievement.rarity]}`}>
                  {achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-600 dark:text-slate-400">Points</span>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{achievement.points}</span>
                </div>
              </div>

              {achievement.unlocked && achievement.unlockedAt && (
                <div className="flex items-center justify-between py-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Débloqué le</span>
                  <span className="font-medium">
                    {format(parseISO(achievement.unlockedAt), 'dd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button
                className="w-full"
                variant="outline"
                onClick={onClose}
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}