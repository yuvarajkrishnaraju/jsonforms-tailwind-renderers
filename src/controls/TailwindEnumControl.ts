import { isEnumControl, rankWith } from '@jsonforms/core';
import { withJsonFormsEnumProps } from '@jsonforms/react';
import React from 'react';

import TailwindSelectRenderer from '../renderers/TailwindSelectRenderer';

export const tailwindEnumTester = rankWith(1002, isEnumControl);

const TailwindEnumControlWrapper = (props: any) => {
  const { errors, ...otherProps } = props;

  // Normalize errors to array format
  let normalizedErrors: any[] = [];
  if (Array.isArray(errors)) {
    normalizedErrors = errors;
  } else if (errors) {
    normalizedErrors = [errors];
  }

  return React.createElement(TailwindSelectRenderer, {
    ...otherProps,
    errors: normalizedErrors
  });
};

export const TailwindEnumControl = withJsonFormsEnumProps(TailwindEnumControlWrapper);
