import React from 'react';

export interface TailwindButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const TailwindButton: React.FC<TailwindButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...props
}) => {
  const baseClasses =
    'tw-inline-flex tw-items-center tw-justify-center tw-font-medium tw-rounded-md tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-1 disabled:tw-opacity-60 disabled:tw-cursor-not-allowed';

  const variantClasses: Record<string, string> = {
    primary:
      'tw-bg-blue-600 tw-text-white hover:tw-bg-blue-700 focus:tw-ring-blue-500 active:tw-bg-blue-800',
    secondary:
      'tw-bg-gray-200 tw-text-gray-900 hover:tw-bg-gray-300 focus:tw-ring-gray-500 active:tw-bg-gray-400',
    success:
      'tw-bg-green-600 tw-text-white hover:tw-bg-green-700 focus:tw-ring-green-500 active:tw-bg-green-800',
    danger:
      'tw-bg-red-600 tw-text-white hover:tw-bg-red-700 focus:tw-ring-red-500 active:tw-bg-red-800',
    warning:
      'tw-bg-yellow-500 tw-text-white hover:tw-bg-yellow-600 focus:tw-ring-yellow-500 active:tw-bg-yellow-700',
    outline:
      'tw-border tw-border-gray-300 tw-bg-white tw-text-gray-700 hover:tw-bg-gray-50 focus:tw-ring-blue-500 active:tw-bg-gray-100',
    ghost:
      'tw-bg-transparent tw-text-gray-700 hover:tw-bg-gray-100 focus:tw-ring-gray-500 active:tw-bg-gray-200'
  };

  const sizeClasses: Record<string, string> = {
    sm: 'tw-px-2 tw-py-1 tw-text-xs',
    md: 'tw-px-3 tw-py-1.5 tw-text-sm',
    lg: 'tw-px-4 tw-py-2 tw-text-base',
    xl: 'tw-px-6 tw-py-3 tw-text-lg'
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button className={buttonClasses} disabled={disabled || loading} {...props}>
      {loading && (
        <svg
          className="tw-mr-1.5 tw-h-3 tw-w-3 tw-animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="tw-opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="tw-opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span className="tw-mr-1.5">{icon}</span>}
      {children}
    </button>
  );
};
