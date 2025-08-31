import React, { useState, useEffect, useCallback } from 'react';
import { JsonFormsProps, JsonFormsState } from './types';
import { JsonFormsRenderer } from './JsonFormsRenderer';
import { getDefaultValue } from './utils';

export const JsonForms: React.FC<JsonFormsProps> = ({
  schema,
  uischema,
  data: initialData,
  onChange,
  onBlur,
  onFocus,
  readonly = false,
  disabled = false,
  validationMode = 'ValidateAndShow'
}) => {
  const [data, setData] = useState<JsonFormsState['data']>(initialData || {});
  const [errors, setErrors] = useState<JsonFormsState['errors']>({});
  const [touched, setTouched] = useState<JsonFormsState['touched']>({});

  // Initialize data with default values
  useEffect(() => {
    if (initialData) {
      setData(initialData);
    } else if (schema) {
      const defaultData = getDefaultValue(schema);
      setData(defaultData);
    }
  }, [initialData, schema]);

  const handleChange = useCallback((newData: any) => {
    setData(newData);
    onChange?.(newData);
  }, [onChange]);

  const handleBlur = useCallback((path: string, value: any) => {
    setTouched(prev => ({ ...prev, [path]: true }));
    onBlur?.(path, value);
  }, [onBlur]);

  const handleFocus = useCallback((path: string, value: any) => {
    onFocus?.(path, value);
  }, [onFocus]);

  // Validate form data
  const validateForm = useCallback(() => {
    if (validationMode === 'NoValidation') return {};
    
    const newErrors: Record<string, string[]> = {};
    
    // This is a simplified validation - in a real implementation,
    // you would use a validation library like AJV
    if (schema.required) {
      schema.required.forEach(field => {
        const value = data[field];
        if (value === undefined || value === null || value === '') {
          newErrors[field] = ['This field is required'];
        }
      });
    }
    
    setErrors(newErrors);
    return newErrors;
  }, [data, schema, validationMode]);

  // Validate on data change if validation mode is set to show
  useEffect(() => {
    if (validationMode === 'ValidateAndShow') {
      validateForm();
    }
  }, [data, validationMode, validateForm]);

  if (!schema) {
    return (
      <div className="tw-p-4 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-md">
        <p className="tw-text-sm tw-text-red-800">No schema provided</p>
      </div>
    );
  }

  if (!uischema) {
    // Generate a default UI schema if none provided
    uischema = {
      type: 'VerticalLayout',
      elements: Object.keys(schema.properties || {}).map(prop => ({
        type: 'Control',
        scope: `#/properties/${prop}`,
        label: schema.properties?.[prop]?.title || prop,
        options: {
          description: schema.properties?.[prop]?.description
        }
      }))
    };
  }

  const hasErrors = errors && Object.keys(errors).length > 0;

  return (
    <div className="tw-jsonforms-container">
      <JsonFormsRenderer
        schema={schema}
        uischema={uischema}
        path=""
        data={data}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      
      {validationMode !== 'NoValidation' && hasErrors && (
        <div className="tw-mt-6 tw-p-4 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-md">
          <h3 className="tw-text-sm tw-font-medium tw-text-red-800 tw-mb-2">
            Please fix the following errors:
          </h3>
          <ul className="tw-list-disc tw-list-inside tw-space-y-1">
            {Object.keys(errors || {}).map((path) => {
              const pathErrors = errors?.[path] || [];
              return pathErrors.map((error: string, index: number) => (
                <li key={`${path}-${index}`} className="tw-text-sm tw-text-red-700">
                  <strong>{path}:</strong> {error}
                </li>
              ));
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
