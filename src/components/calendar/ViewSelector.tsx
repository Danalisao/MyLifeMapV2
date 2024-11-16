import React from 'react';
import { Button } from '../ui/Button';
import type { CalendarView } from '../../types/calendar';

interface ViewSelectorProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function ViewSelector({ currentView, onViewChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant={currentView === 'day' ? 'default' : 'outline'}
        onClick={() => onViewChange('day')}
      >
        Jour
      </Button>
      <Button
        size="sm"
        variant={currentView === 'week' ? 'default' : 'outline'}
        onClick={() => onViewChange('week')}
      >
        Semaine
      </Button>
      <Button
        size="sm"
        variant={currentView === 'month' ? 'default' : 'outline'}
        onClick={() => onViewChange('month')}
      >
        Mois
      </Button>
    </div>
  );
}