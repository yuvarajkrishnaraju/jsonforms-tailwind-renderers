import React from 'react';

interface CardProps {
  children?: React.ReactNode;
}

interface CardHeaderProps {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <div className="tw-mx-1 tw-mb-2 tw-mt-1 tw-flex tw-w-full tw-flex-col tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm hover:tw-shadow-md tw-transition-all tw-duration-200">
    {children}
  </div>
);

export const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  if (!children) return null;
  return (
    <div className="tw-flex tw-flex-row tw-items-center tw-justify-between tw-rounded-t-lg tw-border-b tw-border-gray-200 tw-bg-gradient-to-r tw-from-gray-50 tw-to-gray-100 tw-px-4 tw-py-2 tw-text-left tw-text-base tw-font-semibold tw-text-gray-800">
      {children}
    </div>
  );
};
