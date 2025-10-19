import React from 'react';
import { Button } from './ui/button';
import { Home, Calendar, TrendingUp, Dumbbell } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto px-4">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={`flex flex-col items-center space-y-1 px-2 py-3 transition-all duration-200 ${
              currentView === id 
                ? 'text-gray-900' 
                : 'text-gray-400'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;