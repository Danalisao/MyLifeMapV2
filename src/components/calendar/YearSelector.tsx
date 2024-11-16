import React from 'react';
import { Button } from '../ui/Button';

interface YearSelectorProps {
  currentDate: Date;
  onYearChange: (year: number) => void;
}

export function YearSelector({ currentDate, onYearChange }: YearSelectorProps) {
  const currentYear = currentDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="relative group">
      <Button variant="outline" size="sm" className="min-w-[100px]">
        {currentYear}
      </Button>
      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block z-50">
        <div className="grid grid-cols-3 gap-1">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 ${
                currentYear === year
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : ''
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}