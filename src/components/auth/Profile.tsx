import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { AchievementsList } from '../achievements/AchievementsList';
import { AchievementsOverview } from '../achievements/AchievementsOverview';
import { AchievementDetails } from '../achievements/AchievementDetails';
import { ProfileHeader } from '../profile/ProfileHeader';
import { ProfileStats } from '../profile/ProfileStats';
import { ProfileSettings } from '../profile/ProfileSettings';
import { ProfileNotifications } from '../profile/ProfileNotifications';
import { ProfilePrivacy } from '../profile/ProfilePrivacy';
import { achievements } from '../../data/achievements';
import { toast } from 'sonner';
import {
  LogOut,
  User,
  Bell,
  Globe,
  Shield,
  Award,
} from 'lucide-react';
import type { Achievement } from '../../types/achievement';

export function Profile() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'profile' | 'achievements' | 'notifications' | 'appearance' | 'privacy'>('profile');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const sections = [
    { id: 'profile', label: 'Profil', icon: <User className="h-4 w-4" /> },
    { id: 'achievements', label: 'Succès', icon: <Award className="h-4 w-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
    { id: 'appearance', label: 'Apparence', icon: <Globe className="h-4 w-4" /> },
    { id: 'privacy', label: 'Confidentialité', icon: <Shield className="h-4 w-4" /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <ProfileStats />
            <ProfileSettings />
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <AchievementsOverview achievements={achievements} />
            <AchievementsList
              achievements={achievements}
              onSelect={setSelectedAchievement}
            />
          </div>
        );

      case 'notifications':
        return <ProfileNotifications />;

      case 'appearance':
        return (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-primary-500" />
              <h3 className="text-lg font-semibold">Thème</h3>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              className="w-full justify-start"
            >
              {theme === 'dark' ? 'Thème sombre' : 'Thème clair'}
            </Button>
          </div>
        );

      case 'privacy':
        return <ProfilePrivacy />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <ProfileHeader />

            <div className="grid md:grid-cols-[240px,1fr] gap-6">
              <nav className="space-y-1 md:sticky md:top-6 self-start bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {section.icon}
                    <span>{section.label}</span>
                  </button>
                ))}
                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </Button>
              </nav>

              <main className="min-w-0">
                {renderContent()}
              </main>
            </div>
          </div>
        </div>
      </div>

      {selectedAchievement && (
        <AchievementDetails
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </div>
  );
}