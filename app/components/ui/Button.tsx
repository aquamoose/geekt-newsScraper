'use client';

import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'light' | 'highlight';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'accent':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'light':
        return 'bg-white hover:bg-gray-100 text-indigo-600 border border-indigo-600';
      case 'highlight':
        return 'bg-amber-500 hover:bg-amber-600 text-white';
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'text-sm px-4 py-1.5';
      case 'md':
        return 'text-base px-6 py-2';
      case 'lg':
        return 'text-lg px-8 py-3';
      default:
        return 'text-base px-6 py-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 
