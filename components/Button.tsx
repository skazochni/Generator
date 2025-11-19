import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`
        bg-blue-600 hover:bg-blue-700 
        text-white text-xl font-bold 
        py-4 px-10 rounded-full 
        shadow-lg hover:shadow-2xl 
        transition-all duration-300 ease-in-out 
        transform hover:-translate-y-1 hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-blue-300
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};