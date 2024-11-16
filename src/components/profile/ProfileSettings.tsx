import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = React.useState(user?.displayName || '');
  const [isEditing, setIsEditing] = React.useState(false);

  const handleUpdateProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(user, { displayName });
      setIsEditing(false);
      toast.success('Profil mis à jour !');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Informations personnelles</h3>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Input
            label="Nom"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleUpdateProfile}>
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-500 dark:text-slate-400">Nom</label>
            <p className="font-medium">{user?.displayName || 'Non défini'}</p>
          </div>
          <div>
            <label className="text-sm text-slate-500 dark:text-slate-400">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}