import { getAjv } from '@jsonforms/core';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

export const TailwindLayoutRenderer = React.memo(
  ({
    id,
    layout,
    visible,
    elements,
    schema,
    path,
    enabled,
    direction,
    renderers,
    cells,
    columns = 2,
    gridSize = 0
  }: any) => {
    if (isEmpty(elements)) return null;
    return (
      <>
        {visible && (
          <div
            id={id}
            my-name={layout}
            className={`tw-w-full tw-px-1 tw-py-1 ${
              direction === 'column'
                ? 'tw-flex tw-flex-col tw-space-y-2'
                : gridSize > 0
                  ? `tw-grid tw-grid-cols-${gridSize} tw-gap-2 tw-place-items-stretch`
                  : elements.length >= 4
                    ? 'tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-2 tw-place-items-stretch'
                    : elements.length >= 2
                      ? `tw-grid ${columns === 3 ? 'tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3' : 'tw-grid-cols-1 md:tw-grid-cols-2'} tw-gap-2 tw-place-items-stretch`
                      : 'tw-flex tw-flex-col tw-space-y-2'
            }`}
          >
            {renderLayoutElements(elements, schema, path, enabled, renderers, cells)}
          </div>
        )}
      </>
    );
  }
);

export const withAjvProps = (Component: any) => (props: any) => {
  const ctx = useJsonForms();
  const ajv = getAjv({ jsonforms: { ...ctx } });

  return <Component {...props} ajv={ajv} />;
};

const renderLayoutElements = (elements: any, schema: any, path: any, enabled: any, renderers: any, cells: any) => {
  return (
    Array.isArray(elements) &&
    elements.map((child, index) => {
      return (
        <JsonFormsDispatch
          key={`${path}-${index}`}
          uischema={child}
          schema={schema}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      );
    })
  );
};
