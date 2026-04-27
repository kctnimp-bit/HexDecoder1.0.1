import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children }) => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
    destructive: "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
    outline: "text-foreground",
  };

  return (
    <div className={`${base} ${variants[variant]}`}>
      {children}
    </div>
  );
};
