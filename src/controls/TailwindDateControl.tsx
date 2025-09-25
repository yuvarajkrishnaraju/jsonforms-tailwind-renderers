import { isDateControl, rankWith, OwnPropsOfControl } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import React from 'react';

import {TailwindDateRenderer} from '../renderers/TailwindDateRenderer';

interface TailwindDateProps extends OwnPropsOfControl {
  format?: string;
  placeholderText?: string;
  showTimeSelect?: boolean;
}

/**
 * Default renderer for a date- yyyy-MM-dd.
 */
const TailwindDate = React.memo((props: TailwindDateProps) => {
  return (
    <TailwindDateRenderer {...(props as any)} format="YYYY-MM-DD" placeholderText="Select date" />
  );
});

export const tailwindDateControlTester = rankWith(1004, isDateControl);

export const TailwindDateControl = withJsonFormsControlProps(TailwindDate);
