import React from 'react';
import { 
  Users, 
  Calendar, 
  Package, 
  DollarSign, 
  Settings 
} from 'lucide-react';

interface MinimalistActionBarProps {
  onVolunteersClick: () => void;
  onScheduleClick: () => void;
  onBoxesClick: () => void;
  onMoneyClick: () => void;
  onSettingsClick: () => void;
  activeAction?: string;
}

export function MinimalistActionBar({
  onVolunteersClick,
  onScheduleClick,
  onBoxesClick,
  onMoneyClick,
  onSettingsClick,
  activeAction
}: MinimalistActionBarProps) {
  const actions = [
    {
      id: 'volunteers',
      icon: Users,
      label: 'Volunteers',
      onClick: onVolunteersClick
    },
    {
      id: 'schedule',
      icon: Calendar,
      label: 'Schedule',
      onClick: onScheduleClick
    },
    {
      id: 'boxes',
      icon: Package,
      label: 'Boxes',
      onClick: onBoxesClick
    },
    {
      id: 'money',
      icon: DollarSign,
      label: 'Money',
      onClick: onMoneyClick
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
      onClick: onSettingsClick
    }
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const isActive = activeAction === action.id;
            
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`group flex flex-col items-center justify-center min-w-0 flex-1 py-3 px-2 transition-all duration-200 ease-out ${
                  isActive 
                    ? 'text-gray-900' 
                    : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                <div className={`relative mb-2 transition-all duration-200 ease-out ${
                  isActive 
                    ? 'transform scale-110' 
                    : 'group-hover:transform group-hover:scale-105'
                }`}>
                  <Icon 
                    className={`w-6 h-6 transition-all duration-200 ease-out ${
                      isActive 
                        ? 'stroke-2' 
                        : 'stroke-1.5 group-hover:stroke-2'
                    }`} 
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"></div>
                  )}
                </div>
                <span className={`text-xs font-medium tracking-wide transition-all duration-200 ease-out ${
                  isActive 
                    ? 'text-gray-900 font-semibold' 
                    : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}