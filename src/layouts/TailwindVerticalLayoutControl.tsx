import React from 'react';
import { rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';

import { TailwindLayoutRenderer } from './layout';

interface TailwindVerticalLayoutRendererProps {
  uischema: any;
  renderers: any[];
  cells: any[];
  schema: any;
  path: string;
  enabled?: boolean;
  visible?: boolean;
}

const TailwindVerticalLayoutRenderer: React.FC<TailwindVerticalLayoutRendererProps> = ({
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
    direction: 'column',
    visible
  };
  return (
    <TailwindLayoutRenderer layout="vertical" {...childProps} renderers={renderers} cells={cells} />
  );
};

export const tailwindVerticalLayoutTester = rankWith(1001, uiTypeIs('VerticalLayout'));

export const TailwindVerticalLayoutControl = withJsonFormsLayoutProps(
  TailwindVerticalLayoutRenderer as React.ComponentType<any>
);
