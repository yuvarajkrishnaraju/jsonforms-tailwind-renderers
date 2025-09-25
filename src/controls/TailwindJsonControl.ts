import { and, isStringControl, optionIs, rankWith, ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import React from 'react';

import TailwindInputJson from '../renderers/TailwindInputJson';

export const tailwindJsonControlTester = rankWith(
  1001,
  and(isStringControl, optionIs('format', 'json'))
);

const TailwindJsonControlWrapper = (props: ControlProps) => {
  const { errors, ...otherProps } = props;

  // Normalize errors to array format
  let normalizedErrors: any[] = [];
  if (Array.isArray(errors)) {
    normalizedErrors = errors;
  } else if (errors) {
    normalizedErrors = [errors];
  }

  return React.createElement(TailwindInputJson, {
    ...otherProps,
    errors: normalizedErrors
  });
};

export const TailwindJsonControl = withJsonFormsControlProps(TailwindJsonControlWrapper);
