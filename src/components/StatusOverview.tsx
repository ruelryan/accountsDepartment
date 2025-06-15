import React from 'react';
import { Users, Package, CheckCircle, TrendingUp } from 'lucide-react';

interface StatusOverviewProps {
  stats: {
    totalVolunteers: number;
    activeVolunteers: number;
    totalBoxes: number;
    activeBoxes: number;
    completedTasks: number;
  };
}

export function StatusOverview({ stats }: StatusOverviewProps) {
  const cards = [
    {
      label: 'Active',
      value: stats.activeVolunteers,
      total: stats.totalVolunteers,
      icon: Users,
      color: 'text-teal-600'
    },
    {
      label: 'Boxes',
      value: stats.activeBoxes,
      total: stats.totalBoxes,
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'Complete',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      label: 'Efficiency',
      value: 98,
      suffix: '%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {card.value}{card.total && `/${card.total}`}{card.suffix}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">{card.label}</div>
            </div>
            <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}