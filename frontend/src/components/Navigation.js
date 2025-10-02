import React from 'react';
import { Button } from './ui/button';
import { Home, Calendar, TrendingUp, Dumbbell } from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, user }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workout', label: 'Workout', icon: Dumbbell },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 shadow-2xl">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 min-h-[60px] transition-all duration-300 rounded-xl ${
                  isActive 
                    ? 'bg-gradient-to-t from-gray-900 to-gray-700 text-white hover:from-gray-800 hover:to-gray-600 shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                }`}
                data-testid={`nav-${item.id}`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-semibold">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;