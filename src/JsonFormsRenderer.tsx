import React from 'react';
import { RendererProps, JsonSchema, UISchemaElement } from './types';
import { getFieldType } from './utils';

// Import all control components
import { TextControl } from './controls/TextControl';
import { NumberControl } from './controls/NumberControl';
import { BooleanControl } from './controls/BooleanControl';
import { SelectControl } from './controls/SelectControl';
import { ArrayControl } from './controls/ArrayControl';

// Import all layout components
import { VerticalLayout } from './layouts/VerticalLayout';
import { HorizontalLayout } from './layouts/HorizontalLayout';
import { GroupLayout } from './layouts/GroupLayout';

export const JsonFormsRenderer: React.FC<RendererProps> = ({
  schema,
  uischema,
  path,
  data,
  onChange,
  onBlur,
  onFocus
}) => {
  // Handle layout types
  if (uischema.type === 'VerticalLayout') {
    return (
      <VerticalLayout
        schema={schema}
        uischema={uischema}
        path={path}
        data={data}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }

  if (uischema.type === 'HorizontalLayout') {
    return (
      <HorizontalLayout
        schema={schema}
        uischema={uischema}
        path={path}
        data={data}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }

  if (uischema.type === 'Group') {
    return (
      <GroupLayout
        schema={schema}
        uischema={uischema}
        path={path}
        data={data}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    );
  }

  // Handle control types
  if (uischema.type === 'Control') {
    const fieldType = getFieldType(schema);
    
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'password':
      case 'url':
      case 'tel':
      case 'date':
      case 'datetime-local':
      case 'time':
        return (
          <TextControl
            schema={schema}
            uischema={uischema}
            path={path}
            data={data}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        );
      
      case 'number':
      case 'integer':
        return (
          <NumberControl
            schema={schema}
            uischema={uischema}
            path={path}
            data={data}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        );
      
      case 'checkbox':
        return (
          <BooleanControl
            schema={schema}
            uischema={uischema}
            path={path}
            data={data}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        );
      
      case 'select':
        return (
          <SelectControl
            schema={schema}
            uischema={uischema}
            path={path}
            data={data}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        );
      
      case 'array':
        return (
          <ArrayControl
            schema={schema}
            uischema={uischema}
            path={path}
            data={data}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        );
      
      default:
        return (
          <div className="tw-p-4 tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded-md">
            <p className="tw-text-sm tw-text-yellow-800">
              Unsupported field type: {fieldType}
            </p>
          </div>
        );
    }
  }

  // Fallback for unknown types
  return (
    <div className="tw-p-4 tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-md">
      <p className="tw-text-sm tw-text-red-800">
        Unknown UI schema type: {uischema.type}
      </p>
    </div>
  );
};
