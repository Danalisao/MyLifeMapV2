import React from 'react';
import { format, isSameMonth, isToday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Memory } from '../../types/memory';
import type { DailyNote } from '../../types/dailyNote';
import type { CalendarEvent, CalendarView } from '../../types/calendar';

interface DayContentProps {
  date: Date;
  currentDate: Date;
  currentView: CalendarView;
  memories: Memory[];
  note?: DailyNote;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onMemoryClick: (memory: Memory) => void;
  onAddEvent: (date: Date) => void;
}

export function DayContent({
  date,
  currentDate,
  currentView,
  memories,
  note,
  events,
  onDayClick,
  onMemoryClick,
  onAddEvent,
}: DayContentProps) {
  const isCurrentMonth = isSameMonth(date, currentDate);
  const isCurrentDay = isToday(date);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onDayClick(date)}
      className={`
        relative p-2 rounded-lg border transition-colors cursor-pointer
        ${currentView === 'month' ? 'min-h-[80px]' : 'min-h-[150px]'}
        ${isCurrentMonth ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900'}
        ${isCurrentDay ? 'border-primary-500' : 'border-slate-200 dark:border-slate-700'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`
          text-sm font-medium
          ${isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'}
          ${isCurrentDay ? 'text-primary-600 dark:text-primary-400' : ''}
        `}>
          {format(date, currentView === 'month' ? 'd' : 'EEEE d', { locale: fr })}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddEvent(date);
          }}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1">
        {note && (
          <div className="text-xs p-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
            Note du jour
          </div>
        )}

        {memories.map((memory) => (
          <div
            key={memory.id}
            onClick={(e) => {
              e.stopPropagation();
              onMemoryClick(memory);
            }}
            className="text-xs p-1 rounded bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 truncate cursor-pointer"
          >
            {memory.title}
          </div>
        ))}

        {events.map((event) => (
          <div
            key={event.id}
            className="text-xs p-1 rounded flex items-center gap-1"
            style={{
              backgroundColor: `${event.color}20`,
              color: event.color,
            }}
          >
            {event.time && <span>{format(parseISO(`2000-01-01T${event.time}`), 'HH:mm')}</span>}
            <span className="truncate">{event.title}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}