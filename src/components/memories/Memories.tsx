import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { Memory } from '../../types/memory';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Pencil, Trash2, Image as ImageIcon, Film } from 'lucide-react';
import { Button } from '../ui/Button';
import { ImageGallery } from '../ui/ImageGallery';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const memoriesQuery = query(
      collection(db, 'memories'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      memoriesQuery,
      (snapshot) => {
        const newMemories: Memory[] = [];
        snapshot.forEach((doc) => {
          newMemories.push({ id: doc.id, ...doc.data() } as Memory);
        });
        setMemories(newMemories);
        setLoading(false);
      },
      (error) => {
        console.error('Erreur lors du chargement des souvenirs:', error);
        toast.error('Impossible de charger les souvenirs');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (memoryId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce souvenir ?')) return;

    try {
      await deleteDoc(doc(db, 'memories', memoryId));
      toast.success('Souvenir supprimé !');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Impossible de supprimer le souvenir');
    }
  };

  const handleEdit = (memory: Memory) => {
    navigate(`/memories/${memory.id}/edit`);
  };

  const handleMediaClick = (memory: Memory) => {
    if (memory.media && memory.media.length > 0) {
      setSelectedImages(memory.media.map(m => ({ url: m.url, type: m.type })));
      setShowGallery(true);
    }
  };

  const MediaMosaic = ({ memory }: { memory: Memory }) => {
    if (!memory.media || memory.media.length === 0) return null;

    const mediaItems = memory.media.slice(0, 5);
    const remainingCount = memory.media.length - 5;

    return (
      <div 
        className="grid gap-1 cursor-pointer"
        style={{
          gridTemplateColumns: mediaItems.length === 1 ? '1fr' : 
                              mediaItems.length === 2 ? '1fr 1fr' :
                              mediaItems.length >= 3 ? '1fr 1fr 1fr' : '',
          gridTemplateRows: mediaItems.length <= 3 ? '200px' :
                           'repeat(2, 150px)',
        }}
        onClick={() => handleMediaClick(memory)}
      >
        {mediaItems.map((media, index) => {
          const isLast = index === mediaItems.length - 1 && remainingCount > 0;

          return (
            <div
              key={media.id}
              className={`relative overflow-hidden group ${
                index === 0 && mediaItems.length >= 3 ? 'row-span-2' : ''
              }`}
            >
              {media.type === 'video' ? (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <Film className="w-8 h-8 text-white" />
                </div>
              ) : (
                <img
                  src={media.url}
                  alt=""
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              )}
              {isLast && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-medium">+{remainingCount}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes Souvenirs</h1>
        <Button onClick={() => navigate('/memories/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {memories.map((memory) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden"
            >
              <MediaMosaic memory={memory} />

              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{memory.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {format(parseISO(memory.date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(memory)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(memory.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {memory.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {memory.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    {memory.location.name}
                  </div>
                  {memory.media && (
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <ImageIcon className="h-4 w-4" />
                      {memory.media.length}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showGallery && (
        <ImageGallery
          media={selectedImages}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
}