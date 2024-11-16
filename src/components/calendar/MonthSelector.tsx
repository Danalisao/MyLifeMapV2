import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '../ui/Button';
import { CalendarDays } from 'lucide-react';

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (month: number) => void;
}

export function MonthSelector({ currentDate, onMonthChange }: MonthSelectorProps) {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2000, i, 1);
    return {
      value: i,
      label: format(date, 'MMMM', { locale: fr }),
    };
  });

  return (
    <div className="relative group">
      <Button variant="outline" size="sm" className="min-w-[120px]">
        <CalendarDays className="h-4 w-4 mr-2" />
        {format(currentDate, 'MMMM', { locale: fr })}
      </Button>
      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block z-50">
        <div className="grid grid-cols-3 gap-1">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => onMonthChange(month.value)}
              className={`px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                currentDate.getMonth() === month.value
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : ''
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}