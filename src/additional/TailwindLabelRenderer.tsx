import React from 'react';
import { rankWith, uiTypeIs, LayoutProps } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';

/**
 * Default renderer for a label.
 */
const TailwindLabelRenderer: React.FC<LayoutProps> = ({ uischema, visible, path }) => {
  if (!visible || (uischema as any).text == undefined) return null;
  return (
    <div className="tw-w-full tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-1 tw-px-0.5">
      <label htmlFor={path} className="tw-block tw-text-gray-900 tw-font-medium">
        {(uischema as any).text}
      </label>
    </div>
  );
};

export const tailwindLabelTester = rankWith(1001, uiTypeIs('Label'));

export const TailwindLabel = withJsonFormsLayoutProps(TailwindLabelRenderer);
