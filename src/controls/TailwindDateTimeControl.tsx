import { isDateTimeControl, rankWith, OwnPropsOfControl } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import React from 'react';

import {TailwindDateRenderer} from '../renderers/TailwindDateRenderer';

interface TailwindDateTimeProps extends OwnPropsOfControl {
  format?: string;
  placeholderText?: string;
  showTimeSelect?: boolean;
}

/**
 * Default renderer for a date- yyyy-MM-DD HH:mm:ss .
 */
const TailwindDateTime = React.memo((props: TailwindDateTimeProps) => (
  <TailwindDateRenderer
    {...(props as any)}
    format="YYYY-MM-DD HH:mm:ss"
    placeholderText="Select date and time"
    showTimeSelect={true}
  />
));

export const tailwindDateTimeControlTester = rankWith(1002, isDateTimeControl);

export const TailwindDateTimeControl = withJsonFormsControlProps(TailwindDateTime);
