import { JsonSchema, UISchemaElement } from '../types';

export const getData = (data: any, path: string): any => {
  if (!path || !data) return data;
  
  const pathArray = path.split('/').filter(Boolean);
  let current = data;
  
  for (const key of pathArray) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
};

export const setData = (data: any, path: string, value: any): any => {
  if (!path) return value;
  
  const pathArray = path.split('/').filter(Boolean);
  const result = { ...data };
  let current = result;
  
  for (let i = 0; i < pathArray.length - 1; i++) {
    const key = pathArray[i];
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  const lastKey = pathArray[pathArray.length - 1];
  current[lastKey] = value;
  
  return result;
};

export const isRequired = (schema: JsonSchema, uischema: UISchemaElement): boolean => {
  if (!schema.required) return false;
  
  // Check if the field is in the required array
  const fieldName = uischema.scope?.split('/').pop();
  if (fieldName && schema.required.includes(fieldName)) {
    return true;
  }
  
  return false;
};

export const getLabel = (uischema: UISchemaElement, schema: JsonSchema): string => {
  return uischema.label || schema.title || '';
};

export const getDescription = (uischema: UISchemaElement, schema: JsonSchema): string => {
  return uischema.options?.description || schema.description || '';
};

export const getEnumValues = (schema: JsonSchema): { value: any; label: string }[] => {
  if (!schema.enum) return [];
  
  return schema.enum.map((value, index) => ({
    value,
    label: schema.enumNames?.[index] || String(value)
  }));
};

export const validateField = (schema: JsonSchema, value: any, required: boolean = false): string[] => {
  const errors: string[] = [];
  
  if (required && (value === undefined || value === null || value === '')) {
    errors.push('This field is required');
  }
  
  if (value !== undefined && value !== null && value !== '') {
    if (schema.type === 'string') {
      if (schema.minLength && String(value).length < schema.minLength) {
        errors.push(`Minimum length is ${schema.minLength} characters`);
      }
      if (schema.maxLength && String(value).length > schema.maxLength) {
        errors.push(`Maximum length is ${schema.maxLength} characters`);
      }
      if (schema.pattern) {
        const regex = new RegExp(schema.pattern);
        if (!regex.test(String(value))) {
          errors.push('Invalid format');
        }
      }
    }
    
    if (schema.type === 'number' || schema.type === 'integer') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors.push('Must be a valid number');
      } else {
        if (schema.minimum !== undefined && numValue < schema.minimum) {
          errors.push(`Minimum value is ${schema.minimum}`);
        }
        if (schema.maximum !== undefined && numValue > schema.maximum) {
          errors.push(`Maximum value is ${schema.maximum}`);
        }
      }
    }
  }
  
  return errors;
};

export const getFieldType = (schema: JsonSchema): string => {
  if (schema.format === 'email') return 'email';
  if (schema.format === 'password') return 'password';
  if (schema.format === 'date') return 'date';
  if (schema.format === 'datetime-local') return 'datetime-local';
  if (schema.format === 'time') return 'time';
  if (schema.format === 'url') return 'url';
  if (schema.format === 'tel') return 'tel';
  
  if (schema.enum) return 'select';
  if (schema.type === 'boolean') return 'checkbox';
  if (schema.type === 'array') return 'array';
  if (schema.type === 'object') return 'object';
  
  return schema.type || 'text';
};

export const getDefaultValue = (schema: JsonSchema): any => {
  if (schema.default !== undefined) return schema.default;
  
  switch (schema.type) {
    case 'string':
      return '';
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      return [];
    case 'object':
      return {};
    default:
      return undefined;
  }
};
