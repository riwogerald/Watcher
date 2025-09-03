import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white'
};

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm'
};

export function QuickActionButton({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'sm',
  disabled = false 
}: QuickActionButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center space-x-1 font-medium rounded-full transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
      `}
    >
      <Icon className="w-3 h-3" />
      <span>{label}</span>
    </motion.button>
  );
}