import isEmpty from 'lodash/isEmpty';
import { useCallback, useState } from 'react';

import { SelectRenderer } from '../common';
import {CombinatorProperties} from '../util/CombinatorProperties';
import {
  CombinatorRendererProps,
  createCombinatorRenderInfos,
  createDefaultValue,
  isOneOfControl,
  JsonSchema,
  OwnPropsOfControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsOneOfProps } from '@jsonforms/react';

export interface OwnOneOfProps extends OwnPropsOfControl {
  indexOfFittingSchema?: number;
}

export const TailwindOneOfRenderer = ({
  handleChange,
  schema,
  path,
  renderers,
  cells,
  rootSchema,
  visible,
  enabled,
  indexOfFittingSchema,
  uischema,
  uischemas,
  data
}: CombinatorRendererProps) => {
  const [selectedIndex, setSelectedIndex] = useState(indexOfFittingSchema ?? 0);
  const [newSelectedIndex, setNewSelectedIndex] = useState(0);

  const oneOfRenderInfos = createCombinatorRenderInfos(
    (schema as JsonSchema).oneOf || [],
    rootSchema,
    'oneOf',
    uischema,
    path,
    uischemas
  );

  const openNewTab = useCallback(
    (newIndex: number) => {
      handleChange(path, createDefaultValue(oneOfRenderInfos[newIndex].schema, rootSchema));
      setSelectedIndex(newIndex);
    },
    [path, schema, rootSchema]
  );

  const confirm = useCallback(() => {
    openNewTab(newSelectedIndex);
  }, [openNewTab, createDefaultValue, newSelectedIndex]);

  const handleTabChange = useCallback(
    (_: any, newOneOfIndex: number) => {
      setNewSelectedIndex(newOneOfIndex);
      if (isEmpty(data)) {
        openNewTab(newOneOfIndex);
      } else {
        confirm();
      }
    },
    [setSelectedIndex, data]
  );

  if (!visible) {
    return null;
  }
  return (
    <div key={`oneof-${path}`} className="tw-inline-flex tw-w-full tw-space-x-1">
      <CombinatorProperties schema={schema} combinatorKeyword={'oneOf'} path={path} />
      <SelectRenderer
        id={`select-${path}`}
        path={path}
        showLabel={false}
        enabled={!enabled}
        options={oneOfRenderInfos.map((info, index) => ({ value: index, label: info.label }))}
        enableFilter={false}
        data={selectedIndex}
        handleChange={handleTabChange}
        fontSize={14}
        width={120}
        className="tw-p-1"
      />
      {oneOfRenderInfos.map(({ schema, uischema }, oneOfIndex) => {
        if (selectedIndex !== oneOfIndex) return null;
        return (
          <JsonFormsDispatch
            key={`oneOf-${oneOfIndex}-${path}`}
            schema={schema}
            uischema={uischema}
            path={path}
            renderers={renderers}
            cells={cells}
          />
        );
      })}
    </div>
  );
};

export const tailwindOneOfControlTester: RankedTester = rankWith(1004, isOneOfControl);

export const TailwindOneOfControl = withJsonFormsOneOfProps(TailwindOneOfRenderer);
