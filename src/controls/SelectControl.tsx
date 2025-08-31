import React, { useState, useCallback, useRef, useEffect } from 'react';
import { RiArrowDownSLine } from 'react-icons/ri';
import { ControlProps } from '../types';
import { getData, setData, getLabel, getDescription, isRequired, validateField, getEnumValues } from '../utils';

export const SelectControl: React.FC<ControlProps> = ({
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
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const value = getData(data, path) || '';
  const fieldErrors = errors?.[path] || [];
  const isTouched = touched?.[path] || false;
  const isFieldRequired = required || isRequired(schema, uischema);
  const options = getEnumValues(schema);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleChange = useCallback((selectedValue: any) => {
    const newData = setData(data, path, selectedValue);
    onChange(newData);
    setIsOpen(false);
    
    // Validate on change
    if (isTouched) {
      const fieldErrors = validateField(schema, selectedValue, isFieldRequired);
      if (fieldErrors.length > 0) {
        // Handle validation errors if needed
      }
    }
  }, [data, path, onChange, schema, isFieldRequired, isTouched]);
  
  const handleBlur = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(false);
    onBlur?.(path, value);
    
    // Validate on blur
    const fieldErrors = validateField(schema, value, isFieldRequired);
    if (fieldErrors.length > 0) {
      // Handle validation errors if needed
    }
  }, [path, onBlur, schema, value, isFieldRequired]);
  
  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    setIsFocused(true);
    onFocus?.(path, value);
  }, [path, onFocus, value]);
  
  const toggleDropdown = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <div className="tw-mb-4">
      <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
        {getLabel(uischema, schema)}
        {isFieldRequired && <span className="tw-text-red-500 tw-ml-1">*</span>}
      </label>
      
      <div className="tw-relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={`
            tw-w-full tw-px-3 tw-py-2 tw-pr-10 tw-text-left tw-border tw-rounded-md tw-shadow-sm
            tw-bg-white tw-transition-colors tw-duration-200
            ${isFocused 
              ? 'tw-border-primary-500 tw-ring-2 tw-ring-primary-200' 
              : 'tw-border-gray-300'
            }
            ${fieldErrors.length > 0 && isTouched 
              ? 'tw-border-red-500 tw-ring-2 tw-ring-red-200' 
              : ''
            }
            hover:tw-border-gray-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-primary-500 focus:tw-border-primary-500
          `}
        >
          <span className={selectedOption ? 'tw-text-gray-900' : 'tw-text-gray-500'}>
            {selectedOption ? selectedOption.label : uischema.options?.placeholder || 'Select an option'}
          </span>
          <RiArrowDownSLine className="tw-absolute tw-right-3 tw-top-1/2 tw-transform -tw-translate-y-1/2 tw-w-5 tw-h-5 tw-text-gray-400" />
        </button>
        
        {isOpen && (
          <div className="tw-absolute tw-z-10 tw-w-full tw-mt-1 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md tw-shadow-lg tw-max-h-60 tw-overflow-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleChange(option.value)}
                className={`
                  tw-w-full tw-px-3 tw-py-2 tw-text-left tw-transition-colors
                  ${option.value === value 
                    ? 'tw-bg-primary-100 tw-text-primary-900' 
                    : 'tw-text-gray-900 hover:tw-bg-gray-100'
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
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
