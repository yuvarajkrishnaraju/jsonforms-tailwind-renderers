import React from 'react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';

import { TailwindLayoutRenderer } from './layout';

interface TailwindHorizontalLayoutRendererProps {
  uischema: any;
  renderers: any[];
  cells: any[];
  schema: any;
  path: string;
  enabled?: boolean;
  visible?: boolean;
}

const TailwindHorizontalLayoutRenderer: React.FC<TailwindHorizontalLayoutRendererProps> = ({
  uischema,
  renderers,
  cells,
  schema,
  path,
  enabled,
  visible
}) => {
  const childProps = {
    elements: uischema.elements,
    schema,
    path,
    enabled,
    direction: 'row',
    visible
  };
  return (
    <TailwindLayoutRenderer
      layout="horizontal"
      {...childProps}
      renderers={renderers}
      cells={cells}
      {...uischema.options}
    />
  );
};

export const tailwindHorizontalLayoutTester = rankWith(1002, uiTypeIs('HorizontalLayout'));

export const TailwindHorizontalLayoutControl = withJsonFormsLayoutProps(
  TailwindHorizontalLayoutRenderer as React.ComponentType<any>
);
