import { and, isBooleanControl, optionIs, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

import { TailwindBooleanToggle } from '../renderers/TailwindToggleRenderer';

export const tailwindBooleanToggleControlTester = rankWith(
  1003,
  and(isBooleanControl, optionIs('toggle', true))
);

export const TailwindBooleanToggleControl = withJsonFormsControlProps(TailwindBooleanToggle);
