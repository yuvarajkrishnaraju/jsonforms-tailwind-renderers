import isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';

import {ErrorMessage, LabelRenderer} from '../common';

interface Option {
  value: any;
  label: string;
}

interface TailwindRadioGroupRendererProps {
  id: string;
  visible: boolean;
  enabled: boolean;
  path: string;
  data?: any;
  options?: Option[];
  uischema?: any;
  schema?: any;
  handleChange: (path: string, value: any) => void;
  label?: string;
  errors?: any[];
}

const TailwindRadioGroupRenderer = React.memo<TailwindRadioGroupRendererProps>((props) => {
  const {
    visible,
    enabled,
    path,
    data,
    options = [],
    uischema,
    schema,
    handleChange,
    label
  } = props;

  const onChange = (value: any) => {
    if (!enabled) return;
    let ev = value;
    if (uischema?.options?.returnIndex) {
      const index = options.findIndex((item) => item?.value === value);
      ev = !isEmpty(schema?.values) ? schema?.values[index] : index;
    }
    handleChange(path, ev);
  };

  let currentData = data;
  if (uischema?.options?.returnIndex) {
    if (!isEmpty(schema?.values)) {
      const index = schema?.values?.findIndex((item: any) => item === data);
      if (index !== -1) currentData = options[index]?.value;
    } else {
      currentData = options[data]?.value;
    }
  }

  useEffect(() => {
    if (currentData === undefined && schema?.default !== undefined) {
      onChange(schema?.default);
    }
  }, [currentData, schema?.default]);

  if (!visible) return null;

  const gridCols =
    options.length >= 3 ? 'tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4' : 'tw-grid-cols-2';

  return (
    <div className="tw-mx-1 tw-my-2 tw-flex tw-flex-col tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-p-3 tw-shadow-sm">
      {label && label.length > 0 && <LabelRenderer {...props} />}
      <div className="tw-mt-2">
        <div className={`tw-grid tw-gap-2 ${gridCols}`}>
          {options.map((option, index) => (
            <div key={`${option.value}-${index}`}>
              <div
                className={`tw-group tw-relative tw-flex tw-cursor-pointer tw-items-center tw-rounded-md tw-border-2 tw-p-2 tw-transition-all tw-duration-200 hover:tw-shadow-sm ${
                  option.value === currentData
                    ? 'tw-border-blue-500 tw-bg-blue-50 tw-shadow-sm'
                    : 'tw-border-gray-200 hover:tw-border-gray-300 hover:tw-bg-gray-50'
                } ${!enabled && 'tw-cursor-not-allowed tw-opacity-60'}`}
                onClick={() => enabled && onChange(option.value)}
                onKeyDown={(e) => {
                  if (enabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onChange(option.value);
                  }
                }}
                tabIndex={enabled ? 0 : -1}
                role="button"
              >
                <label className="tw-flex tw-items-center tw-cursor-pointer tw-w-full">
                  <input
                    type="radio"
                    value={option.value}
                    checked={option.value === currentData}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={!enabled}
                    className={`tw-h-4 tw-w-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 focus:tw-ring-blue-500 focus:tw-ring-2 tw-mr-2 tw-transition-all tw-duration-200 ${
                      !enabled && 'tw-cursor-not-allowed tw-opacity-50'
                    }`}
                  />
                  <span
                    className={`tw-text-xs tw-font-medium tw-text-gray-700 ${
                      option.value === currentData
                        ? 'tw-text-blue-900'
                        : 'group-hover:tw-text-gray-900'
                    }`}
                  >
                    {option.label}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!uischema?.options?.returnIndex && <ErrorMessage {...props} />}
    </div>
  );
});

TailwindRadioGroupRenderer.displayName = 'TailwindRadioGroupRenderer';

export default TailwindRadioGroupRenderer;
