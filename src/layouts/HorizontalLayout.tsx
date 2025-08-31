import React from 'react';
import { LayoutProps } from '../types';
import { JsonFormsRenderer } from '../JsonFormsRenderer';

export const HorizontalLayout: React.FC<LayoutProps> = ({
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

  const columns = uischema.options?.columns || 2;
  const gridCols = columns === 1 ? 'tw-grid-cols-1' : columns === 2 ? 'tw-grid-cols-1 md:tw-grid-cols-2' : 'tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3';

  return (
    <div className={`tw-grid ${gridCols} tw-gap-4 tw-animate-fade-in`}>
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
