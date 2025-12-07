import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Sharper corners (rounded-sm), bolder text, technical feel
  const baseStyles = "px-6 py-3 rounded-sm font-bold uppercase tracking-wider text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:translate-y-0.5";
  
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-md shadow-orange-900/20 border-b-4 border-orange-800",
    secondary: "bg-neutral-800 text-white hover:bg-neutral-900 shadow-md shadow-neutral-900/20 border-b-4 border-neutral-950",
    outline: "border-2 border-neutral-300 text-neutral-700 hover:border-orange-600 hover:text-orange-600 bg-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md border-b-4 border-red-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};