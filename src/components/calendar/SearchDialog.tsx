import React, { useState, useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { X, Search, Calendar, BookOpen, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import type { Memory } from '../../types/memory';
import type { DailyNote } from '../../types/dailyNote';
import type { CalendarEvent } from '../../types/calendar';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memories: Memory[];
  notes: DailyNote[];
  events: CalendarEvent[];
  onMemoryClick: (memory: Memory) => void;
}

export function SearchDialog({
  isOpen,
  onClose,
  memories,
  notes,
  events,
  onMemoryClick,
}: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return {
      memories: memories.filter(
        (memory) =>
          memory.title.toLowerCase().includes(term) ||
          memory.description?.toLowerCase().includes(term)
      ),
      notes: notes.filter(
        (note) => note.content.toLowerCase().includes(term)
      ),
      events: events.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description?.toLowerCase().includes(term)
      ),
    };
  }, [searchTerm, memories, notes, events]);

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
          className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-xl font-bold">Rechercher</h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
              icon={<Search className="h-4 w-4" />}
            />

            <div className="space-y-6">
              {filteredItems.memories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Souvenirs
                  </h3>
                  <div className="space-y-2">
                    {filteredItems.memories.map((memory) => (
                      <div
                        key={memory.id}
                        onClick={() => onMemoryClick(memory)}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <div className="font-medium">{memory.title}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {format(parseISO(memory.date), 'dd MMMM yyyy', { locale: fr })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredItems.notes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Notes
                  </h3>
                  <div className="space-y-2">
                    {filteredItems.notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                      >
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {format(parseISO(note.date), 'dd MMMM yyyy', { locale: fr })}
                        </div>
                        <div className="mt-1 line-clamp-2">{note.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredItems.events.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Événements
                  </h3>
                  <div className="space-y-2">
                    {filteredItems.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                      >
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {format(parseISO(event.date), 'dd MMMM yyyy', { locale: fr })}
                          {event.time && ` à ${event.time}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchTerm && 
                filteredItems.memories.length === 0 &&
                filteredItems.notes.length === 0 &&
                filteredItems.events.length === 0 && (
                <div className="text-center text-slate-600 dark:text-slate-400">
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}