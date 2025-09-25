import {
  isDateControl,
  isDescriptionHidden,
  isTimeControl,
  or,
  rankWith,
  showAsRequired,
  OwnPropsOfControl
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import React from 'react';

import { useDebouncedChange, useFocus } from '../util';

interface TailwindNativeProps extends OwnPropsOfControl {
  errors?: string;
  label?: string;
  description?: string;
  required?: boolean;
  handleChange?: (path: string, value: any) => void;
  data?: any;
  config?: any;
}

const TailwindNative = (props: TailwindNativeProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const {
    id,
    errors,
    label,
    schema,
    description,
    enabled,
    visible,
    required,
    path,
    handleChange,
    data,
    config,
    uischema
  } = props;

  if (!visible) return null;

  const isValid = !errors;
  const appliedUiSchemaOptions = merge({}, config, uischema?.options);
  const [inputValue, onChange] = useDebouncedChange(
    handleChange || (() => {}),
    '',
    data,
    path || ''
  );
  const fieldType = appliedUiSchemaOptions.format ?? schema?.format;
  const showDescription = !isDescriptionHidden(
    !!visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  return (
    <div className="tw-w-full">
      <label
        htmlFor={id + '-input'}
        className={`tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1 ${
          showAsRequired(!!required, appliedUiSchemaOptions.hideRequiredAsterisk)
            ? 'tw-after:tw-content-["*"] tw-after:tw-ml-0.5 tw-after:tw-text-red-500'
            : ''
        }`}
      >
        {label}
      </label>
      <input
        id={id + '-input'}
        type={fieldType}
        disabled={!enabled}
        onFocus={onFocus}
        onBlur={onBlur}
        value={inputValue ?? ''}
        onChange={onChange}
        className={`tw-block tw-w-full tw-rounded-md tw-border tw-px-2.5 tw-py-1.5 tw-text-sm tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500 ${
          !isValid
            ? 'tw-border-red-300 tw-bg-red-50 tw-text-red-900 focus:tw-ring-red-500 focus:tw-border-red-500'
            : !enabled
              ? 'tw-border-gray-200 tw-bg-gray-100 tw-text-gray-500 tw-cursor-not-allowed tw-opacity-75'
              : 'tw-border-gray-300 tw-bg-white tw-text-gray-900 hover:tw-border-gray-400 focus:tw-border-blue-500 focus:tw-ring-blue-500'
        }`}
        placeholder={appliedUiSchemaOptions.placeholder || ''}
      />
      {!isValid && errors && <p className="tw-mt-1 tw-text-xs tw-text-red-600">{errors}</p>}
      {showDescription && description && (
        <p className="tw-mt-1 tw-text-xs tw-text-gray-500">{description}</p>
      )}
    </div>
  );
};

export const tailwindNativeControlTester = rankWith(1002, or(isDateControl, isTimeControl));

export const TailwindNativeControl = withJsonFormsControlProps(TailwindNative);
