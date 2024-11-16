import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, parseISO, addMonths, subMonths, setMonth, setYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { onSnapshot } from 'firebase/firestore';
import { db, createCompositeQuery } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { DailyNoteDialog } from './DailyNoteDialog';
import { EventDialog } from './EventDialog';
import { ViewSelector } from './ViewSelector';
import { DayContent } from './DayContent';
import { MonthSelector } from './MonthSelector';
import { YearSelector } from './YearSelector';
import { ImageGallery } from '../ui/ImageGallery';
import { SearchDialog } from './SearchDialog';
import type { Memory } from '../../types/memory';
import type { DailyNote } from '../../types/dailyNote';
import type { CalendarEvent, CalendarView } from '../../types/calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [notes, setNotes] = useState<DailyNote[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ url: string; type: 'image' | 'video' }[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const getDaysInView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    if (currentView === 'month') {
      return eachDayOfInterval({
        start: startOfWeek(start, { weekStartsOn: 1 }),
        end: endOfWeek(end, { weekStartsOn: 1 }),
      });
    }

    if (currentView === 'week') {
      return eachDayOfInterval({
        start: startOfWeek(currentDate, { weekStartsOn: 1 }),
        end: endOfWeek(currentDate, { weekStartsOn: 1 }),
      });
    }

    return [currentDate];
  };

  useEffect(() => {
    if (!user) return;

    const start = format(startOfMonth(currentDate), 'yyyy-MM-dd');
    const end = format(endOfMonth(currentDate), 'yyyy-MM-dd');

    const setupSubscription = async () => {
      try {
        setIsLoading(true);
        const memoriesQuery = await createCompositeQuery('memories', user.uid, start, end);
        const notesQuery = await createCompositeQuery('dailyNotes', user.uid, start, end);
        const eventsQuery = await createCompositeQuery('events', user.uid, start, end);

        const unsubscribeMemories = onSnapshot(memoriesQuery, (snapshot) => {
          const newMemories: Memory[] = [];
          snapshot.forEach((doc) => {
            newMemories.push({ id: doc.id, ...doc.data() } as Memory);
          });
          setMemories(newMemories);
        });

        const unsubscribeNotes = onSnapshot(notesQuery, (snapshot) => {
          const newNotes: DailyNote[] = [];
          snapshot.forEach((doc) => {
            newNotes.push({ id: doc.id, ...doc.data() } as DailyNote);
          });
          setNotes(newNotes);
        });

        const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
          const newEvents: CalendarEvent[] = [];
          snapshot.forEach((doc) => {
            newEvents.push({ id: doc.id, ...doc.data() } as CalendarEvent);
          });
          setEvents(newEvents);
        });

        setIsLoading(false);

        return () => {
          unsubscribeMemories();
          unsubscribeNotes();
          unsubscribeEvents();
        };
      } catch (error) {
        console.error('Error setting up subscriptions:', error);
        toast.error('Erreur de chargement des données');
        setIsLoading(false);
      }
    };

    setupSubscription();
  }, [user, currentDate]);

  const getItemsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      memories: memories.filter((memory) => format(parseISO(memory.date), 'yyyy-MM-dd') === dateStr),
      note: notes.find((note) => note.date === dateStr),
      events: events.filter((event) => event.date === dateStr),
    };
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleMonthChange = (month: number) => {
    setCurrentDate(setMonth(currentDate, month));
  };

  const handleYearChange = (year: number) => {
    setCurrentDate(setYear(currentDate, year));
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowNoteDialog(true);
  };

  const handleMemoryClick = (memory: Memory) => {
    if (memory.media && memory.media.length > 0) {
      setSelectedImages(memory.media.map(m => ({ url: m.url, type: m.type })));
      setShowGallery(true);
    }
  };

  const handleAddEvent = (date: Date) => {
    setSelectedDate(date);
    setShowEventDialog(true);
  };

  const handleKeyboardNavigation = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePreviousMonth();
    } else if (e.key === 'ArrowRight') {
      handleNextMonth();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => window.removeEventListener('keydown', handleKeyboardNavigation);
  }, []);

  const days = getDaysInView();

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <MonthSelector
              currentDate={currentDate}
              onMonthChange={handleMonthChange}
            />
            <YearSelector
              currentDate={currentDate}
              onYearChange={handleYearChange}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearchDialog(true)}
          >
            Rechercher
          </Button>
          <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      ) : (
        <motion.div
          layout
          className={`grid gap-2 ${
            currentView === 'month' ? 'grid-cols-7' : 
            currentView === 'week' ? 'grid-cols-7' : 
            'grid-cols-1'
          }`}
        >
          {currentView !== 'day' && (
            <>
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-slate-600 dark:text-slate-400"
                >
                  {day}
                </div>
              ))}
            </>
          )}

          <AnimatePresence mode="wait">
            {days.map((date) => {
              const { memories: dayMemories, note, events: dayEvents } = getItemsForDate(date);
              
              return (
                <DayContent
                  key={date.toString()}
                  date={date}
                  currentDate={currentDate}
                  currentView={currentView}
                  memories={dayMemories}
                  note={note}
                  events={dayEvents}
                  onDayClick={handleDayClick}
                  onMemoryClick={handleMemoryClick}
                  onAddEvent={handleAddEvent}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {selectedDate && (
        <>
          <DailyNoteDialog
            isOpen={showNoteDialog}
            onClose={() => setShowNoteDialog(false)}
            date={selectedDate}
            note={getItemsForDate(selectedDate).note}
          />
          <EventDialog
            isOpen={showEventDialog}
            onClose={() => setShowEventDialog(false)}
            date={selectedDate}
          />
        </>
      )}

      <SearchDialog
        isOpen={showSearchDialog}
        onClose={() => setShowSearchDialog(false)}
        memories={memories}
        notes={notes}
        events={events}
        onMemoryClick={handleMemoryClick}
      />

      {showGallery && selectedImages.length > 0 && (
        <ImageGallery
          media={selectedImages}
          onClose={() => setShowGallery(false)}
        />
      )}

      <Button
        onClick={() => handleAddEvent(new Date())}
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}