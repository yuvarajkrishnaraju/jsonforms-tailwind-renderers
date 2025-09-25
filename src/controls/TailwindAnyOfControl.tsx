import {
  createCombinatorRenderInfos,
  isAnyOfControl,
  rankWith,
  CombinatorRendererProps
} from '@jsonforms/core';
import { withJsonFormsAnyOfProps } from '@jsonforms/react';
import React, { useCallback, useState } from 'react';

import { Card, CardHeader, ErrorMessage, TabRenderer } from '../common';

const TailwindAnyOfRenderer = React.memo(
  ({
    id,
    schema,
    rootSchema,
    indexOfFittingSchema,
    visible,
    path,
    renderers,
    cells,
    uischema,
    uischemas,
    errors
  }: CombinatorRendererProps) => {
    const [selectedAnyOf, setSelectedAnyOf] = useState(indexOfFittingSchema || 0);
    const handleChange = useCallback(
      (value: number) => setSelectedAnyOf(value),
      [setSelectedAnyOf]
    );

    if (!visible) return null;

    const anyOf = 'anyOf';
    const anyOfRenderInfos = createCombinatorRenderInfos(
      schema.anyOf || [],
      rootSchema,
      anyOf,
      uischema,
      path,
      uischemas
    );

    return (
      <Card>
        <CardHeader>{String(uischema.label || '')}</CardHeader>
        <TabRenderer
          selected={selectedAnyOf}
          onChange={handleChange}
          infos={anyOfRenderInfos}
          path={path}
          renderers={renderers || []}
          cells={cells || []}
        />
        <ErrorMessage
          id={id}
          path={path}
          errors={Array.isArray(errors) ? errors : errors ? [errors] : []}
        />
      </Card>
    );
  }
);

export const tailwindAnyOfControlTester = rankWith(1003, isAnyOfControl);

export const TailwindAnyOfControl = withJsonFormsAnyOfProps(TailwindAnyOfRenderer);
