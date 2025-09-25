import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';

import {ErrorMessage, LabelRenderer} from '../common';
import { createOnChangeHandler, getData } from '../util';

export interface TailwindDateRendererProps {
  data?: any;
  id: string;
  visible: boolean;
  path: string;
  handleChange: (path: string, value: any) => void;
  config?: any;
  uischema?: any;
  format?: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  placeholderText?: string;
  enabled?: boolean;
  errors?: any[];
  label?: string;
}

// Custom Date Input Component
export const CustomDateInput: React.FC<{
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
  isError: boolean;
  type: 'date' | 'datetime-local' | 'time';
}> = ({ id, name, value, onChange, placeholder, disabled, isError, type }) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`tw-block tw-w-full tw-rounded-md tw-border tw-px-3 tw-py-2 tw-text-sm tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500 ${
        isError
          ? 'tw-border-red-600 tw-bg-red-50 tw-text-red-900 focus:tw-ring-red-500 focus:tw-border-red-500'
          : disabled
            ? 'tw-border-gray-200 tw-bg-gray-100 tw-text-gray-500 tw-cursor-not-allowed tw-opacity-75'
            : 'tw-border-gray-300 tw-bg-white tw-text-gray-900 hover:tw-border-gray-400 focus:tw-border-blue-500 focus:tw-ring-blue-500'
      }`}
    />
  );
};

export const TailwindDateRenderer = React.memo<TailwindDateRendererProps>((props) => {
  const {
    data,
    id,
    visible,
    path,
    handleChange,
    config,
    uischema,
    format,
    showTimeSelect,
    showTimeSelectOnly,
    placeholderText,
    enabled = true,
    errors,
    label
  } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema?.options);
  const saveFormat = appliedUiSchemaOptions.dateTimeSaveFormat ?? format;

  const onChange = useMemo(
    () => createOnChangeHandler(path, handleChange, saveFormat),
    [path, handleChange, saveFormat]
  );

  const finalData = getData(data, saveFormat);

  if (!visible) return null;

  const isError = !isEmpty(errors);
  const value = finalData ? dayjs(finalData) : null;

  const handleDateChange = (inputValue: string) => {
    if (inputValue) {
      const parsedDate = dayjs(inputValue);
      onChange(parsedDate);
    } else {
      onChange(null);
    }
  };

  const getInputValue = () => {
    if (!value) return '';

    if (showTimeSelectOnly) {
      return value.format('HH:mm');
    } else if (showTimeSelect) {
      return value.format('YYYY-MM-DDTHH:mm');
    } else {
      return value.format('YYYY-MM-DD');
    }
  };

  const getInputType = (): 'date' | 'datetime-local' | 'time' => {
    if (showTimeSelectOnly) return 'time';
    if (showTimeSelect) return 'datetime-local';
    return 'date';
  };

  const getPlaceholder = () => {
    if (placeholderText) return placeholderText;
    if (showTimeSelectOnly) return 'Select time';
    if (showTimeSelect) return 'Select date and time';
    return 'Select date';
  };

  return (
    <div className="tw-grow">
      {label && label.length > 0 && <LabelRenderer {...props} />}
      <CustomDateInput
        id={id}
        name={path}
        value={getInputValue()}
        onChange={handleDateChange}
        placeholder={getPlaceholder()}
        disabled={!enabled}
        isError={isError}
        type={getInputType()}
      />
      <ErrorMessage {...props} />
    </div>
  );
});

TailwindDateRenderer.displayName = 'TailwindDateRenderer';
