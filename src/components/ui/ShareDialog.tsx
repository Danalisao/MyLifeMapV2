import React, { useState } from 'react';
import { X, Search, Share2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (userId: string) => Promise<void>;
}

export function ShareDialog({ isOpen, onClose, onShare }: ShareDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('email', '>=', searchTerm),
        where('email', '<=', searchTerm + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      const users: Array<{ id: string; name: string; email: string }> = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() as { name: string; email: string } });
      });
      
      setSearchResults(users);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      toast.error('Impossible de rechercher des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Partager le souvenir</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} loading={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onShare(user.id)}
                  className="gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}