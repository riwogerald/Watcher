import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const statusConfig = {
  open: {
    icon: AlertTriangle,
    color: 'text-red-600 bg-red-50 border-red-200',
    label: 'Open',
    pulseColor: 'bg-red-500'
  },
  in_progress: {
    icon: Clock,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    label: 'In Progress',
    pulseColor: 'bg-blue-500'
  },
  resolved: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200',
    label: 'Resolved',
    pulseColor: 'bg-green-500'
  },
  closed: {
    icon: XCircle,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
    label: 'Closed',
    pulseColor: 'bg-slate-500'
  }
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
};

export function StatusBadge({ status, size = 'md', animated = false }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.span
      initial={animated ? { scale: 0.8, opacity: 0 } : false}
      animate={animated ? { scale: 1, opacity: 1 } : false}
      className={`inline-flex items-center space-x-1 font-medium border rounded-full ${config.color} ${sizeConfig[size]}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
      {animated && status === 'in_progress' && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`w-1 h-1 rounded-full ${config.pulseColor}`}
        />
      )}
    </motion.span>
  );
}