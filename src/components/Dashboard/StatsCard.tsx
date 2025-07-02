import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  color: 'blue' | 'green' | 'orange' | 'red';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600'
  },
  green: {
    bg: 'bg-green-500',
    light: 'bg-green-50',
    text: 'text-green-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600'
  },
  orange: {
    bg: 'bg-orange-500',
    light: 'bg-orange-50',
    text: 'text-orange-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600'
  },
  red: {
    bg: 'bg-red-500',
    light: 'bg-red-50',
    text: 'text-red-600',
    changeUp: 'text-green-600',
    changeDown: 'text-red-600'
  }
};

export function StatsCard({ title, value, change, icon: Icon, color }: StatsCardProps) {
  const classes = colorClasses[color];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              change.type === 'increase' ? classes.changeUp : classes.changeDown
            }`}>
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
              <span className="text-slate-500 ml-1">from last week</span>
            </p>
          )}
        </div>
        <div className={`w-12 h-12 ${classes.light} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${classes.text}`} />
        </div>
      </div>
    </motion.div>
  );
}