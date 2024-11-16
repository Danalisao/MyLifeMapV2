import React from 'react';
import { useUserSettings } from '../../hooks/useUserSettings';
import { Bell, Mail, Globe, Trophy, BookOpen, Share2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function ProfileNotifications() {
  const { settings, loading, updateSettings } = useUserSettings();

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const notificationChannels = [
    { key: 'email', label: 'Notifications par email', icon: <Mail className="h-4 w-4" /> },
    { key: 'push', label: 'Notifications push', icon: <Bell className="h-4 w-4" /> },
  ];

  const notificationTypes = [
    { key: 'memories', label: 'Nouveaux souvenirs partagés', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'achievements', label: 'Succès débloqués', icon: <Trophy className="h-4 w-4" /> },
    { key: 'social', label: 'Interactions sociales', icon: <Share2 className="h-4 w-4" /> },
    { key: 'reminders', label: 'Rappels', icon: <Calendar className="h-4 w-4" /> },
  ];

  const handleToggle = async (category: string, key: string, value: boolean) => {
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <Globe className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Canaux de notification</h3>
        </div>
        <div className="space-y-4">
          {notificationChannels.map(({ key, label, icon }) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications[key as keyof typeof settings.notifications]}
                onChange={(e) => handleToggle('notifications', key, e.target.checked)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Types de notifications</h3>
        </div>
        <div className="space-y-4">
          {notificationTypes.map(({ key, label, icon }) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <div className="flex items-center gap-3">
                {icon}
                <span>{label}</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications[key as keyof typeof settings.notifications]}
                onChange={(e) => handleToggle('notifications', key, e.target.checked)}
                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          ))}
        </div>
      </motion.div>
    </div>
  );
}