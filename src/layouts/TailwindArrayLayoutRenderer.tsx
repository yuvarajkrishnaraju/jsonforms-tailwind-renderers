import React, { useCallback } from 'react';
import { isObjectArrayWithNesting, rankWith } from '@jsonforms/core';

import { withJsonFormsArrayProps } from '../common';
import { TailwindArrayLayout } from './TailwindArrayLayout';

interface TailwindArrayLayoutRendererProps {
  visible?: boolean;
  enabled?: boolean;
  id?: string;
  uischema: any;
  schema: any;
  label: string;
  rootSchema: any;
  renderers: any[];
  cells: any[];
  data: number;
  path: string;
  errors?: any[];
  uischemas: any[];
  addItem: (path: string, value: any) => void;
  required?: boolean;
  ctx?: {
    readonly?: boolean;
    config?: any;
  };
}

const TailwindArrayLayoutRenderer: React.FC<TailwindArrayLayoutRendererProps> = ({
  visible,
  uischema,
  schema,
  label,
  rootSchema,
  renderers,
  cells,
  data,
  path,
  errors,
  uischemas,
  addItem,
  required,
  ctx
}) => {
  if (!visible) return null;

  const addItemCb = useCallback((p: string, value: any) => addItem(p, value), [addItem]);

  return (
    <TailwindArrayLayout
      label={label}
      uischema={uischema}
      schema={schema}
      rootSchema={rootSchema}
      errors={errors}
      data={data}
      path={path}
      addItem={addItemCb}
      renderers={renderers}
      cells={cells}
      uischemas={uischemas}
      required={required ?? false}
      readonly={ctx?.readonly}
      config={ctx?.config}
    />
  );
};

export const tailwindArrayLayoutControlTester = rankWith(1004, isObjectArrayWithNesting);

export { TailwindArrayLayoutRenderer };

export const TailwindArrayLayoutControl = withJsonFormsArrayProps(
  TailwindArrayLayoutRenderer as React.ComponentType<any>
);
