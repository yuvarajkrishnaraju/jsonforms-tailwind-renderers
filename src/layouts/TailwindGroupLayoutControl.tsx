import React from 'react';
import { rankWith, uiTypeIs, withIncreasedRank } from '@jsonforms/core';
import { withJsonFormsContext, withJsonFormsLayoutProps } from '@jsonforms/react';

import { Card, CardHeader } from '../common';
import { TailwindLayoutRenderer } from './layout';

interface TailwindGroupLayoutProps {
  props: {
    schema: any;
    uischema: any;
    path: string;
    label: string;
    visible?: boolean;
    enabled?: boolean;
    renderers: any[];
    cells: any[];
    direction?: string;
  };
  ctx?: {
    core?: {
      schema?: {
        definitions?: any;
      };
    };
  };
}

const TailwindGroupLayout: React.FC<TailwindGroupLayoutProps> = (properties) => {
  const { schema, uischema, path, label, visible, enabled, renderers, cells, direction } =
    properties.props;
  if (properties.ctx?.core?.schema?.definitions) {
    schema.definitions = properties.ctx?.core?.schema?.definitions;
  }
  if (!visible) return null;
  return (
    <Card>
      <CardHeader>{label}</CardHeader>
      <TailwindLayoutRenderer
        layout="group"
        schema={schema}
        uischema={uischema}
        path={path}
        elements={uischema.elements}
        direction={direction}
        renderers={renderers}
        cells={cells}
        visible={visible}
        enabled={enabled}
      />
    </Card>
  );
};

export const TailwindGroupLayoutControl = withJsonFormsLayoutProps(
  withJsonFormsContext(TailwindGroupLayout)
);

export const tailwindGroupLayoutControlTester = withIncreasedRank(
  1,
  rankWith(1001, uiTypeIs('Group'))
);
