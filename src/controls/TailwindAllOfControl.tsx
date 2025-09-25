import {
  createCombinatorRenderInfos,
  findMatchingUISchema,
  isAllOfControl,
  rankWith,
  CombinatorRendererProps
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsAllOfProps } from '@jsonforms/react';
import isEmpty from 'lodash/isEmpty';
import React from 'react';

import { Card, CardHeader } from '../common';

const TailwindAllOfRenderer = React.memo(
  ({
    schema,
    rootSchema,
    visible,
    renderers,
    cells,
    path,
    uischemas,
    uischema
  }: CombinatorRendererProps) => {
    const delegateUISchema = findMatchingUISchema(uischemas)(schema, uischema.scope, path);
    if (delegateUISchema) {
      return (
        <>
          {visible && (
            <JsonFormsDispatch
              schema={schema}
              uischema={delegateUISchema}
              path={path}
              renderers={renderers}
              cells={cells}
            />
          )}
        </>
      );
    }
    const allOfRenderInfos = createCombinatorRenderInfos(
      schema.allOf || [],
      rootSchema,
      'allOf',
      uischema,
      path,
      uischemas
    );
    if (!Array.isArray(allOfRenderInfos) || isEmpty(allOfRenderInfos) || !visible) return null;
    return (
      <div className="tw-mb-1.5 tw-w-full tw-grow">
        <Card>
          <CardHeader>{String(uischema.label || '')}</CardHeader>
          <div
            className={`tw-w-full tw-p-0.5 ${
              allOfRenderInfos.length >= 4
                ? 'tw-grid sm:tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4'
                : allOfRenderInfos.length >= 2
                  ? 'tw-grid sm:tw-grid-cols-1 md:tw-grid-cols-1 lg:tw-grid-cols-2'
                  : 'tw-flex tw-flex-col'
            }`}
          >
            {allOfRenderInfos.map((allOfRenderInfo, allOfIndex) => (
              <div
                key={allOfIndex}
                className={
                  allOfRenderInfo.schema.oneOf
                    ? allOfRenderInfos.length >= 4
                      ? 'tw-col-span-4'
                      : 'tw-col-span-2'
                    : ''
                }
              >
                <JsonFormsDispatch
                  schema={allOfRenderInfo.schema}
                  uischema={allOfRenderInfo.uischema}
                  path={path}
                  renderers={renderers}
                  cells={cells}
                />
              </div>
            ))}
          </div>
          {/* ------------ For Future Use ------------ */}
          {/* <ErrorMessage path={path} errors={errors} /> */}
        </Card>
      </div>
    );
  }
);

export const tailwindAllOfControlTester = rankWith(1003, isAllOfControl);

export const TailwindAllOfControl = withJsonFormsAllOfProps(TailwindAllOfRenderer);
