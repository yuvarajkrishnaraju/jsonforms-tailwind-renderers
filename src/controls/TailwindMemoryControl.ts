import { isStringControl, optionIs, and, rankWith } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';

import TailwindMemoryRenderer from '../renderers/TailwindMemoryRenderer';

export const tailwindMemoryControlTester = rankWith(
  1004,
  and(isStringControl, optionIs('format', 'memory'))
);

export const TailwindMemoryControl = withJsonFormsControlProps(TailwindMemoryRenderer);
