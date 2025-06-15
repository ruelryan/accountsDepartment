import React from 'react';
import { TrendingUp, Users, Package, CheckCircle } from 'lucide-react';

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
      title: 'Active Volunteers',
      value: `${stats.activeVolunteers}/${stats.totalVolunteers}`,
      icon: Users,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-900'
    },
    {
      title: 'Active Boxes',
      value: `${stats.activeBoxes}/${stats.totalBoxes}`,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900'
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-900'
    },
    {
      title: 'Efficiency',
      value: '98%',
      icon: TrendingUp,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-opacity-20`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${card.textColor} opacity-80`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.textColor} mt-1`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}