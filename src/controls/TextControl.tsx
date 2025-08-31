import React, { useState, useCallback } from 'react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import { ControlProps } from '../types';
import { getData, setData, getLabel, getDescription, isRequired, validateField } from '../utils';

export const TextControl: React.FC<ControlProps> = ({
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
  const [showPassword, setShowPassword] = useState(false);
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
  
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);
  
  const getInputType = () => {
    if (schema.format === 'password') return 'password';
    if (schema.format === 'email') return 'email';
    if (schema.format === 'url') return 'url';
    if (schema.format === 'tel') return 'tel';
    if (schema.format === 'date') return 'date';
    if (schema.format === 'datetime-local') return 'datetime-local';
    if (schema.format === 'time') return 'time';
    return 'text';
  };
  
  const inputType = getInputType();
  const showPasswordToggle = inputType === 'password';
  
  return (
    <div className="tw-mb-4">
      <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
        {getLabel(uischema, schema)}
        {isFieldRequired && <span className="tw-text-red-500 tw-ml-1">*</span>}
      </label>
      
      <div className="tw-relative">
        <input
          type={showPasswordToggle && showPassword ? 'text' : inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`
            tw-w-full tw-px-3 tw-py-2 tw-border tw-rounded-md tw-shadow-sm
            tw-transition-colors tw-duration-200
            ${isFocused 
              ? 'tw-border-primary-500 tw-ring-2 tw-ring-primary-200' 
              : 'tw-border-gray-300'
            }
            ${fieldErrors.length > 0 && isTouched 
              ? 'tw-border-red-500 tw-ring-2 tw-ring-red-200' 
              : ''
            }
            ${showPasswordToggle ? 'tw-pr-10' : ''}
            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary-500 focus:tw-border-primary-500
          `}
          placeholder={uischema.options?.placeholder || ''}
          required={isFieldRequired}
        />
        
        {showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="tw-absolute tw-right-2 tw-top-1/2 tw-transform -tw-translate-y-1/2
                     tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <RiEyeOffLine className="tw-w-5 tw-h-5" />
            ) : (
              <RiEyeLine className="tw-w-5 tw-h-5" />
            )}
          </button>
        )}
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
