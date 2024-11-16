import { useState, useEffect } from 'react';
import { getUserStats } from '../lib/firebase';
import type { UserStats } from '../types/user';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userStats = await getUserStats(user.uid);
        if (mounted) {
          setStats(userStats as UserStats);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
        if (mounted) {
          toast.error('Impossible de charger les statistiques');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStats();

    // Refresh stats every 5 minutes
    const interval = setInterval(loadStats, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [user]);

  return { stats, loading };
}