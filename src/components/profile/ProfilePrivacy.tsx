import React from 'react';
import { useUserSettings } from '../../hooks/useUserSettings';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Shield, 
  Eye, 
  Download, 
  Trash2, 
  Lock, 
  Users, 
  Globe, 
  Mail, 
  Settings,
  BarChart
} from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { exportUserData, deleteUserAccount } from '../../lib/firebase';

export function ProfilePrivacy() {
  const { settings, loading, updateSettings } = useUserSettings();
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (loading || !settings || !user) {
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

  const handleVisibilityChange = async (value: string) => {
    try {
      await updateSettings({
        privacy: {
          ...settings.privacy,
          profileVisibility: value as 'public' | 'friends' | 'private'
        }
      });
    } catch (error) {
      // Error is handled by useUserSettings
    }
  };

  const handleToggle = async (key: string, value: boolean) => {
    try {
      await updateSettings({
        privacy: {
          ...settings.privacy,
          [key]: value
        }
      });
    } catch (error) {
      // Error is handled by useUserSettings
    }
  };

  const handleExportData = async () => {
    try {
      toast.loading('Export des données en cours...');
      const data = await exportUserData(user.uid);
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mylifemap-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Export terminé !');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erreur lors de l\'export des données');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUserAccount(user.uid);
      toast.success('Compte supprimé avec succès');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setIsDeleting(false);
    }
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public', icon: <Globe className="h-4 w-4" />, description: 'Visible par tous les utilisateurs' },
    { value: 'friends', label: 'Amis uniquement', icon: <Users className="h-4 w-4" />, description: 'Visible uniquement par vos amis' },
    { value: 'private', label: 'Privé', icon: <Lock className="h-4 w-4" />, description: 'Visible uniquement par vous' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Visibilité du profil</h3>
        </div>
        <div className="space-y-4">
          {visibilityOptions.map(({ value, label, icon, description }) => (
            <label key={value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
              <input
                type="radio"
                name="visibility"
                value={value}
                checked={settings.privacy.profileVisibility === value}
                onChange={(e) => handleVisibilityChange(e.target.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {icon}
                  <span className="font-medium">{label}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {description}
                </p>
              </div>
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
          <Eye className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Visibilité des informations</h3>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>Afficher l'email</span>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showEmail}
              onChange={(e) => handleToggle('showEmail', e.target.checked)}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
            <div className="flex items-center gap-3">
              <BarChart className="h-4 w-4" />
              <span>Afficher les statistiques</span>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showStats}
              onChange={(e) => handleToggle('showStats', e.target.checked)}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
          </label>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold">Données personnelles</h3>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter mes données
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500"
            onClick={handleDeleteAccount}
            loading={isDeleting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer mon compte
          </Button>
        </div>
      </motion.div>
    </div>
  );
}