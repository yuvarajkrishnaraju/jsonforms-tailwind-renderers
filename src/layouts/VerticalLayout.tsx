import React from 'react';
import { LayoutProps } from '../types';
import { JsonFormsRenderer } from '../JsonFormsRenderer';

export const VerticalLayout: React.FC<LayoutProps> = ({
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
    <div className="tw-space-y-4 tw-animate-fade-in">
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
  );
};
