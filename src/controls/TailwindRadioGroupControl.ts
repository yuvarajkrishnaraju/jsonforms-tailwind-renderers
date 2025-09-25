import { and, isEnumControl, optionIs, rankWith } from '@jsonforms/core';
import { withJsonFormsEnumProps } from '@jsonforms/react';
import React from 'react';

import TailwindRadioGroupRenderer from '../renderers/TailwindRadioGroupRenderer';

export const tailwindRadioGroupControlTester = rankWith(
  1020,
  and(isEnumControl, optionIs('format', 'radio'))
);

const TailwindRadioGroupControlWrapper = (props: any) => {
  const { errors, ...otherProps } = props;

  // Normalize errors to array format
  let normalizedErrors: any[] = [];
  if (Array.isArray(errors)) {
    normalizedErrors = errors;
  } else if (errors) {
    normalizedErrors = [errors];
  }

  return React.createElement(TailwindRadioGroupRenderer, {
    ...otherProps,
    errors: normalizedErrors
  });
};

export const TailwindRadioGroupControl = withJsonFormsEnumProps(TailwindRadioGroupControlWrapper);
