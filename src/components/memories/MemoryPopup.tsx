// ... (le reste du code reste identique jusqu'à la fonction handleShare)

const handleShare = async (userId: string) => {
  try {
    const userRef = doc(db, 'memories', memory.id);
    const sharedWith = memory.sharedWith || [];
    
    // Vérifier si l'utilisateur est déjà partagé
    if (!sharedWith.includes(userId)) {
      await updateDoc(userRef, {
        sharedWith: [...sharedWith, userId],
      });
      toast.success('Souvenir partagé avec succès !');
    } else {
      toast.info('Ce souvenir est déjà partagé avec cet utilisateur');
    }
  } catch (error) {
    console.error('Erreur lors du partage:', error);
    toast.error('Impossible de partager le souvenir');
  }
};

// ... (le reste du code reste identique jusqu'au rendu)

{memory.taggedUsers && memory.taggedUsers.length > 0 && (
  <div className="flex items-center gap-2 mb-2 text-sm text-slate-600 dark:text-slate-400">
    <Users className="h-4 w-4" />
    <span>Avec {memory.taggedUsers.join(', ')}</span>
  </div>
)}

{memory.sharedWith && memory.sharedWith.length > 0 && (
  <div className="flex items-center gap-2 mb-2 text-sm text-slate-600 dark:text-slate-400">
    <Share2 className="h-4 w-4" />
    <span>Partagé avec {memory.sharedWith.length} personnes</span>
  </div>
)}