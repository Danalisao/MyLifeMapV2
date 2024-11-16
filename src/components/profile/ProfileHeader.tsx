import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Camera } from 'lucide-react';
import { Button } from '../ui/Button';
import { storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';

export function ProfileHeader() {
  const { user } = useAuth();

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;

    try {
      const file = e.target.files[0];
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      
      await updateProfile(user, { photoURL });
      toast.success('Photo de profil mise à jour !');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Erreur lors de la mise à jour de la photo');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'Avatar'} 
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {user?.displayName?.[0] || user?.email?.[0] || '?'}
              </span>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-1 bg-white dark:bg-slate-700 rounded-full shadow-lg cursor-pointer">
            <Camera className="h-4 w-4" />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>
        <div>
          <h2 className="text-xl font-bold">{user?.displayName || 'Utilisateur'}</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}