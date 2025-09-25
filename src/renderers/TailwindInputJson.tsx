import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import React, { useState } from 'react';

import { CustomEditor, ErrorMessage } from '../common';
import { LabelRenderer } from '../common';

interface TailwindInputJsonProps {
  id: string;
  enabled?: boolean;
  path: string;
  errors?: any[];
  label?: string;
  description?: string;
  handleChange: (path: string, value: string) => void;
  data?: any;
  config?: any;
  uischema?: any;
}

const TailwindInputJson = React.memo<TailwindInputJsonProps>((props) => {
  const {
    id,
    enabled = true,
    path,
    errors,
    label,
    description = '',
    handleChange,
    data,
    config,
    uischema
  } = props;

  const appliedUiSchemaOptions = merge({}, config, uischema?.options);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { maxHeight = 250 } = appliedUiSchemaOptions;

  const onChange = (value: string) => {
    let isValid = false;

    try {
      JSON.parse(value);
      isValid = true;
    } catch (_) {
      // Invalid JSON
    }

    if (isValid && !isNaN(Number(value))) isValid = false;
    setErrorMessage(isValid ? '' : 'Invalid JSON');

    handleChange(path, value);
  };

  const value = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;

  const handlePrettify = () => {
    try {
      if (!isEmpty(data) && typeof data === 'string') {
        const obj = JSON.parse(data);
        handleChange(path, JSON.stringify(obj, null, 2));
      }
    } catch (_) {
      // Handle prettify error silently
    }
  };

  return (
    <div className="tw-grow">
      {label && label.length > 0 && (
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
          <LabelRenderer {...props} />
          <button
            type="button"
            onClick={handlePrettify}
            disabled={!enabled}
            className="tw-p-1 tw-text-gray-500 hover:tw-text-blue-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-1 tw-rounded"
            title="Prettify JSON"
          >
            <svg className="tw-h-4 tw-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </button>
        </div>
      )}
      <CustomEditor
        value={value}
        height={maxHeight}
        onChange={(val) => onChange(val || '')}
        isError={!!errorMessage}
        language="json"
        enabled={enabled}
      />
      {(errorMessage || errors) && (
        <ErrorMessage
          id={id}
          path={path}
          errors={Array.isArray(errors) ? errors : [errorMessage]}
        />
      )}
    </div>
  );
});

TailwindInputJson.displayName = 'TailwindInputJson';

export default TailwindInputJson;
