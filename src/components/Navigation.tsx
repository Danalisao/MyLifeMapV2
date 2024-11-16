import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPinned, CalendarDays, BookMarked, UserCircle } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 px-6 py-2 safe-area-bottom">
      <div className="max-w-screen-xl mx-auto">
        <ul className="flex justify-around items-center">
          <NavItem to="/" icon={<MapPinned className="w-6 h-6 stroke-[1.5]" />} label="Carte" />
          <NavItem to="/memories" icon={<BookMarked className="w-6 h-6 stroke-[1.5]" />} label="Souvenirs" />
          <NavItem to="/calendar" icon={<CalendarDays className="w-6 h-6 stroke-[1.5]" />} label="Journal" />
          <NavItem to="/profile" icon={<UserCircle className="w-6 h-6 stroke-[1.5]" />} label="Profil" />
        </ul>
      </div>
    </nav>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex flex-col items-center space-y-1 transition-colors duration-200 ${
            isActive
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-300'
          }`
        }
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </NavLink>
    </li>
  );
}