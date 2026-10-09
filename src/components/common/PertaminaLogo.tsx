import React from 'react';

interface PertaminaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  variant?: 'light' | 'dark';
}

export const PertaminaLogo: React.FC<PertaminaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textColor,
  variant = 'dark',
}) => {
  const iconDimensions = {
    sm: { w: 22, h: 22 },
    md: { w: 32, h: 28 },
    lg: { w: 44, h: 38 },
    xl: { w: 68, h: 58 },
  }[size];

  const textStyles = {
    sm: 'text-sm font-bold',
    md: 'text-base sm:text-lg font-bold',
    lg: 'text-xl sm:text-2xl font-extrabold',
    xl: 'text-2xl sm:text-3xl font-extrabold',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Official Pertamina 3-Color Curved Parallelogram Mark */}
      <svg
        width={iconDimensions.w}
        height={iconDimensions.h}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
        aria-label="Logo Pertamina"
      >
        {/* Top Red Bar / Trapezoid */}
        <path
          d="M32 8 C35 5 40 4 45 4 L86 4 C92 4 96 9 94 15 L78 30 C76 32 72 33 68 33 L26 33 C20 33 17 27 20 22 Z"
          fill="#E11D48"
        />
        {/* Bottom Left Blue Bar */}
        <path
          d="M18 42 C20 38 25 37 30 37 L52 37 C58 37 61 43 58 48 L46 68 C44 72 39 74 34 74 L8 74 C3 74 0 68 3 63 Z"
          fill="#0284C7"
        />
        {/* Bottom Right Green Bar */}
        <path
          d="M58 44 C61 40 66 39 71 39 L88 39 C93 39 96 44 94 48 L84 66 C82 70 78 72 73 72 L55 72 C50 72 47 67 49 62 Z"
          fill="#10B981"
        />
      </svg>

      {showText && (
        <span
          className={`tracking-tight flex items-center ${textStyles} ${
            textColor || (variant === 'light' ? 'text-white' : 'text-slate-900')
          }`}
        >
          <span>MyPertamina</span>
          <span className="ml-1 text-red-600 font-bold">Pay</span>
        </span>
      )}
    </div>
  );
};
