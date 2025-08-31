import React, { useState, useCallback } from 'react';
import { ControlProps } from '../types';
import { getData, setData, getLabel, getDescription, isRequired, validateField } from '../utils';

export const NumberControl: React.FC<ControlProps> = ({
  schema,
  uischema,
  path,
  data,
  onChange,
  onBlur,
  onFocus,
  errors,
  touched,
  required
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const value = getData(data, path) || '';
  const fieldErrors = errors?.[path] || [];
  const isTouched = touched?.[path] || false;
  const isFieldRequired = required || isRequired(schema, uischema);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newData = setData(data, path, newValue);
    onChange(newData);
    
    // Validate on change
    if (isTouched) {
      const fieldErrors = validateField(schema, newValue, isFieldRequired);
      if (fieldErrors.length > 0) {
        // Handle validation errors if needed
      }
    }
  }, [data, path, onChange, schema, isFieldRequired, isTouched]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(path, e.target.value);
    
    // Validate on blur
    const fieldErrors = validateField(schema, value, isFieldRequired);
    if (fieldErrors.length > 0) {
      // Handle validation errors if needed
    }
  }, [path, onBlur, schema, value, isFieldRequired]);
  
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(path, e.target.value);
  }, [path, onFocus]);
  
  const handleStepUp = useCallback(() => {
    const currentValue = parseFloat(value as string) || 0;
    const step = schema.multipleOf || 1;
    const newValue = currentValue + step;
    const newData = setData(data, path, newValue);
    onChange(newData);
  }, [data, path, onChange, schema.multipleOf, value]);
  
  const handleStepDown = useCallback(() => {
    const currentValue = parseFloat(value as string) || 0;
    const step = schema.multipleOf || 1;
    const newValue = currentValue - step;
    const newData = setData(data, path, newValue);
    onChange(newData);
  }, [data, path, onChange, schema.multipleOf, value]);
  
  return (
    <div className="tw-mb-4">
      <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
        {getLabel(uischema, schema)}
        {isFieldRequired && <span className="tw-text-red-500 tw-ml-1">*</span>}
      </label>
      
      <div className="tw-relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          min={schema.minimum}
          max={schema.maximum}
          step={schema.multipleOf || 1}
          className={`
            tw-w-full tw-px-3 tw-py-2 tw-pr-16 tw-border tw-rounded-md tw-shadow-sm
            tw-transition-colors tw-duration-200
            ${isFocused 
              ? 'tw-border-primary-500 tw-ring-2 tw-ring-primary-200' 
              : 'tw-border-gray-300'
            }
            ${fieldErrors.length > 0 && isTouched 
              ? 'tw-border-red-500 tw-ring-2 tw-ring-red-200' 
              : ''
            }
            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary-500 focus:tw-border-primary-500
          `}
          placeholder={uischema.options?.placeholder || ''}
          required={isFieldRequired}
        />
        
        <div className="tw-absolute tw-right-1 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-flex tw-flex-col">
          <button
            type="button"
            onClick={handleStepUp}
            className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-text-gray-500 
                     hover:tw-text-gray-700 hover:tw-bg-gray-100 tw-rounded-sm tw-transition-colors"
            tabIndex={-1}
          >
            <svg className="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleStepDown}
            className="tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-text-gray-500 
                     hover:tw-text-gray-700 hover:tw-bg-gray-100 tw-rounded-sm tw-transition-colors"
            tabIndex={-1}
          >
            <svg className="tw-w-3 tw-h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {getDescription(uischema, schema) && (
        <p className="tw-mt-1 tw-text-sm tw-text-gray-500">
          {getDescription(uischema, schema)}
        </p>
      )}
      
      {fieldErrors.length > 0 && isTouched && (
        <div className="tw-mt-1">
          {fieldErrors.map((error, index) => (
            <p key={index} className="tw-text-sm tw-text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
