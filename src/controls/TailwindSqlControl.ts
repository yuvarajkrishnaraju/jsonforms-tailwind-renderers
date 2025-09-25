import { and, isStringControl, optionIs, rankWith, ControlProps } from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import React from 'react';

import TailwindInputSql from '../renderers/TailwindInputSql';

export const tailwindSqlControlTester = rankWith(
  1002,
  and(isStringControl, optionIs('format', 'sql'))
);

const TailwindSqlControlWrapper = (props: ControlProps) => {
  const { errors, ...otherProps } = props;

  // Normalize errors to array format
  let normalizedErrors: any[] = [];
  if (Array.isArray(errors)) {
    normalizedErrors = errors;
  } else if (errors) {
    normalizedErrors = [errors];
  }

  return React.createElement(TailwindInputSql, {
    ...otherProps,
    errors: normalizedErrors
  });
};

export const TailwindSqlControl = withJsonFormsControlProps(TailwindSqlControlWrapper);
