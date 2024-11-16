import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import type { CalendarEvent } from '../../types/calendar';

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

export function EventDialog({ isOpen, onClose, date }: EventDialogProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      time: format(date, 'HH:mm'),
      color: '#3B82F6',
    },
  });

  const onSubmit = async (data: any) => {
    if (!user) return;

    try {
      const event: Partial<CalendarEvent> = {
        title: data.title,
        description: data.description,
        date: format(date, 'yyyy-MM-dd'),
        time: data.time,
        color: data.color,
        type: 'event',
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'events'), event);
      toast.success('Événement ajouté !');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary-500" />
              <h2 className="text-xl font-bold">Nouvel événement</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="space-y-4">
              <Input
                label="Titre"
                {...register('title', { required: 'Titre requis' })}
                error={errors.title?.message}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                    transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-primary-500 dark:border-slate-700 dark:bg-slate-800 dark:placeholder:text-slate-400
                    min-h-[100px] resize-none"
                  placeholder="Description de l'événement..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="time"
                  label="Heure"
                  {...register('time', { required: 'Heure requise' })}
                  error={errors.time?.message}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Couleur
                  </label>
                  <input
                    type="color"
                    {...register('color')}
                    className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Ajouter
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}