import React, { useState, useCallback } from 'react';
import { ControlProps } from '../types';
import { getData, setData, getLabel, getDescription, isRequired, validateField } from '../utils';

export const BooleanControl: React.FC<ControlProps> = ({
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
  
  const value = getData(data, path) || false;
  const fieldErrors = errors?.[path] || [];
  const isTouched = touched?.[path] || false;
  const isFieldRequired = required || isRequired(schema, uischema);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
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
    onBlur?.(path, e.target.checked);
    
    // Validate on blur
    const fieldErrors = validateField(schema, value, isFieldRequired);
    if (fieldErrors.length > 0) {
      // Handle validation errors if needed
    }
  }, [path, onBlur, schema, value, isFieldRequired]);
  
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(path, e.target.checked);
  }, [path, onFocus]);
  
  return (
    <div className="tw-mb-4">
      <div className="tw-flex tw-items-start">
        <div className="tw-flex tw-items-center tw-h-5">
          <input
            type="checkbox"
            checked={value as boolean}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`
              tw-h-4 tw-w-4 tw-text-primary-600 tw-border-gray-300 tw-rounded
              focus:tw-ring-primary-500 focus:tw-ring-2
              ${fieldErrors.length > 0 && isTouched 
                ? 'tw-border-red-500 tw-ring-2 tw-ring-red-200' 
                : ''
              }
            `}
            required={isFieldRequired}
          />
        </div>
        <div className="tw-ml-3 tw-text-sm">
          <label className="tw-font-medium tw-text-gray-700">
            {getLabel(uischema, schema)}
            {isFieldRequired && <span className="tw-text-red-500 tw-ml-1">*</span>}
          </label>
          
          {getDescription(uischema, schema) && (
            <p className="tw-text-gray-500 tw-mt-1">
              {getDescription(uischema, schema)}
            </p>
          )}
        </div>
      </div>
      
      {fieldErrors.length > 0 && isTouched && (
        <div className="tw-mt-2">
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
