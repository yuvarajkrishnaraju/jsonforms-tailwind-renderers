import React from 'react';
import { LayoutProps } from '../types';
import { JsonFormsRenderer } from '../JsonFormsRenderer';

export const GroupLayout: React.FC<LayoutProps> = ({
  schema,
  uischema,
  path,
  data,
  onChange,
  onBlur,
  onFocus
}) => {
  if (!uischema.elements || uischema.elements.length === 0) {
    return null;
  }

  return (
    <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm tw-p-6 tw-animate-fade-in">
      {(uischema.label || schema.title) && (
        <div className="tw-mb-4">
          <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">
            {uischema.label || schema.title}
          </h3>
          {(uischema.options?.description || schema.description) && (
            <p className="tw-mt-1 tw-text-sm tw-text-gray-500">
              {uischema.options?.description || schema.description}
            </p>
          )}
        </div>
      )}
      
      <div className="tw-space-y-4">
        {uischema.elements.map((element, index) => (
          <JsonFormsRenderer
            key={index}
            schema={schema}
            uischema={element}
            path={path}
            data={data}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
          />
        ))}
      </div>
    </div>
  );
};
