import React, { useCallback, useState } from 'react';
import { composePaths, computeLabel, createDefaultValue } from '@jsonforms/core';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import merge from 'lodash/merge';
import range from 'lodash/range';

import { Centered, EmptyIconRenderer } from '../common';
import TableToolbar from '../renderers/Table/TableToolbar';
import ExpandPanelRenderer from './ExpandPanelRenderer';

interface TailwindArrayLayoutProps {
  data: number;
  path: string;
  schema: any;
  uischema: any;
  errors?: any[];
  addItem: (path: string, value: any) => void;
  renderers: any[];
  cells: any[];
  label: string;
  required: boolean;
  rootSchema: any;
  config: any;
  uischemas: any[];
  readonly?: boolean;
}

export const TailwindArrayLayout = React.memo<TailwindArrayLayoutProps>((props) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const innerCreateDefaultValue = useCallback(() => {
    let s = createDefaultValue(props.schema, props.rootSchema);
    if (isEmpty(s) && !isEmpty(props.schema.default)) s = props.schema.default;
    return s;
  }, [props.schema, props.rootSchema]);

  const handleChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, expandedPanel: boolean) => {
      setExpanded(expandedPanel ? panel : false);
    },
    []
  );

  const isExpanded = (index: number): boolean => expanded === composePaths(props.path, `${index}`);

  const {
    data,
    path,
    schema,
    uischema,
    errors,
    addItem,
    renderers,
    cells,
    label,
    required,
    rootSchema,
    config,
    uischemas,
    readonly
  } = props;

  const appliedUiSchemaOptions = merge({}, config, props.uischema.options);
  let showAddItem =
    appliedUiSchemaOptions.showAddItem != null ? appliedUiSchemaOptions.showAddItem : true;
  if (!isNaN(appliedUiSchemaOptions.maximum)) {
    showAddItem = data < Number(appliedUiSchemaOptions.maximum);
  }
  if (path.startsWith('raw_condition.')) {
    appliedUiSchemaOptions.disableExpand = true;
    appliedUiSchemaOptions.rowTitle = '';
  }

  return (
    <div className="tw-my-1 tw-mt-1 tw-w-full tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm">
      <TableToolbar
        label={computeLabel(label, required, appliedUiSchemaOptions.hideRequiredAsterisk ?? false)}
        labelEnd={
          <span className="tw-select-none tw-rounded-full tw-bg-gray-100 tw-px-2 tw-py-0.5 tw-text-xs tw-font-medium tw-text-gray-700">
            <strong>{`${data} items`}</strong>
          </span>
        }
        errors={errors}
        path={path}
        addItem={addItem}
        createDefault={innerCreateDefaultValue}
        enabled={true}
        schema={schema}
        readonly={readonly}
        rootSchema={rootSchema}
      />
      <div className="tw-px-3 tw-pb-3">
        {data > 0 ? (
          map(range(data), (index) => {
            return (
              <ExpandPanelRenderer
                index={index}
                expanded={appliedUiSchemaOptions.expand || isExpanded(index)}
                schema={schema}
                path={path}
                handleExpansion={handleChange}
                uischema={uischema}
                renderers={renderers}
                cells={cells}
                key={index}
                rootSchema={rootSchema}
                enableMoveUp={index !== 0}
                enableMoveDown={index < data - 1}
                config={{
                  ...config,
                  disableExpand: appliedUiSchemaOptions.disableExpand,
                  rowTitle: appliedUiSchemaOptions.rowTitle
                }}
                childLabelProp={appliedUiSchemaOptions.elementLabelProp}
                uischemas={uischemas}
                readonly={readonly}
              />
            );
          })
        ) : (
          <Centered>
            <EmptyIconRenderer title={`No ${label}`} showIcon={false} />
          </Centered>
        )}
      </div>
    </div>
  );
});

TailwindArrayLayout.displayName = 'TailwindArrayLayout';
