import { isStringControl, optionIs, or, rankWith, ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import React from 'react';

import TailwindInputText from '../renderers/TailwindInputText';

export const tailwindTextControlTester = rankWith(
  1001,
  or(isStringControl, optionIs('format', 'bytes'))
);

const TailwindTextControlWrapper = (props: ControlProps) => {
  const { errors, ...otherProps } = props;

  // Normalize errors to array format
  let normalizedErrors: any[] = [];
  if (Array.isArray(errors)) {
    normalizedErrors = errors;
  } else if (errors) {
    normalizedErrors = [errors];
  }

  return React.createElement(TailwindInputText, {
    ...otherProps,
    errors: normalizedErrors
  });
};

export const TailwindTextControl = withJsonFormsControlProps(TailwindTextControlWrapper);
