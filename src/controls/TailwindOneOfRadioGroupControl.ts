import { and, isOneOfEnumControl, optionIs, rankWith } from '@jsonforms/core';
import { withJsonFormsOneOfEnumProps } from '@jsonforms/react';
import React from 'react';

import TailwindRadioGroupRenderer from '../renderers/TailwindRadioGroupRenderer';

export const tailwindOneOfRadioGroupControlTester = rankWith(
  1020,
  and(isOneOfEnumControl, optionIs('format', 'radio'))
);

const TailwindOneOfRadioGroupControlWrapper = (props: any) => {
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

export const TailwindOneOfRadioGroupControl = withJsonFormsOneOfEnumProps(
  TailwindOneOfRadioGroupControlWrapper
);
