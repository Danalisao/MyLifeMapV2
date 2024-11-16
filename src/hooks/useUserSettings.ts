import { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../lib/firebase';
import type { UserSettings } from '../types/user';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadSettings() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userSettings = await getUserSettings(user.uid);
        setSettings(userSettings as UserSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Impossible de charger les paramètres');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [user]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !settings) return;

    try {
      await updateUserSettings(user.uid, newSettings);
      setSettings({ ...settings, ...newSettings });
      toast.success('Paramètres mis à jour !');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Impossible de mettre à jour les paramètres');
      throw error;
    }
  };

  return { settings, loading, updateSettings };
}