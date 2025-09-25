import {
  composePaths,
  createDefaultValue,
  errorsAt,
  formatErrorMessage,
  Paths,
  Resolve,
  JsonSchema,
  UISchemaElement
} from '@jsonforms/core';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import range from 'lodash/range';
import startCase from 'lodash/startCase';
import union from 'lodash/union';
import React, { useCallback, useMemo, useState } from 'react';

import { CardHeader,Centered, EmptyIconRenderer, IconButton, Tooltip } from '../../common';
import { isVowel } from '../../util';
import TableToolbar from './TableToolbar';

// Interface for cell component props
interface CellProps {
  propName?: string;
  schema?: JsonSchema;
  title?: string;
  rowPath: string;
  cellPath: string;
  uischema?: UISchemaElement;
  enabled?: boolean;
  cells?: any[];
}

// Interface for non-empty cell component props
interface NonEmptyCellProps extends CellProps {
  path: string;
  schema: JsonSchema; // Make schema required
  rootSchema?: JsonSchema;
  errors?: string;
  renderers?: any[];
  isValid?: boolean;
}

// Interface for non-empty row component props
interface NonEmptyRowProps {
  childPath: string;
  schema: JsonSchema;
  rowIndex: number;
  openDeleteDialog: (path: string, index: number) => void;
  moveUpCreator: (path: string, index: number) => () => void;
  moveDownCreator: (path: string, index: number) => () => void;
  enableUp: boolean;
  enableDown: boolean;
  showSortButtons?: boolean;
  rowTitle?: string;
  enabled?: boolean;
  cells?: any[];
  path: string;
  records: number;
  uischema: UISchemaElement;
  readonly?: boolean;
  expanded?: boolean;
  handleExpansion?: (panel: string) => (event: any, expandedPanel: boolean) => void;
}

// Interface for table rows component props
interface TableRowsProps {
  data: number;
  path: string;
  schema: JsonSchema;
  openDeleteDialog: (path: string, index: number) => void;
  moveUp?: (path: string, index: number) => () => void;
  moveDown?: (path: string, index: number) => () => void;
  uischema: UISchemaElement;
  config?: any;
  enabled?: boolean;
  cells?: any[];
  readonly?: boolean;
}

// Interface for the main table control props
interface TailwindTableControlProps {
  label?: string;
  path: string;
  config?: any;
  schema: JsonSchema;
  uischema: UISchemaElement;
  errors?: string[];
  openDeleteDialog: (path: string, index: number) => void;
  visible?: boolean;
  enabled?: boolean;
  data: number;
  readonly?: boolean;
  addItem: (path: string, value: any) => void;
  cells?: any[];
  renderers?: any[];
  moveUp?: (path: string, toMove: number) => () => void;
  moveDown?: (path: string, toMove: number) => () => void;
}

const generateCells = (
  Cell: React.ComponentType<CellProps>,
  schema: JsonSchema,
  uischema: UISchemaElement,
  rowPath: string,
  enabled: boolean,
  cells: any[]
): React.ReactElement[] => {
  if (schema?.type === 'object') {
    return getValidColumnProps(schema).map((prop) => {
      const cellPath = Paths.compose(rowPath, prop);
      const props = {
        propName: prop,
        schema: schema?.properties?.[prop],
        title: schema?.properties?.[prop]?.title ?? startCase(prop),
        rowPath,
        cellPath,
        uischema: uischema?.options?.detail ?? uischema,
        enabled,
        cells
      };
      return <Cell key={cellPath} {...props} />;
    });
  } else {
    // primitives
    const props = {
      schema,
      uischema,
      rowPath,
      cellPath: rowPath,
      enabled
    };
    return [<Cell key={rowPath} {...props} />];
  }
};

const getValidColumnProps = (scopedSchema: JsonSchema): string[] => {
  if (scopedSchema.type === 'object' && scopedSchema.properties) {
    return Object.keys(scopedSchema.properties).filter(
      (prop) => scopedSchema.properties![prop].type !== 'array'
    );
  }
  // primitives
  return [''];
};

const ctxToNonEmptyCellProps = (
  ctx: any,
  {
    rowPath,
    schema,
    propName,
    enabled,
    cells,
    renderers,
    uischema
  }: {
    rowPath: string;
    schema: JsonSchema;
    propName?: string;
    enabled?: boolean;
    cells?: any[];
    renderers?: any[];
    uischema?: UISchemaElement;
  }
): NonEmptyCellProps => {
  const path = rowPath + (schema?.type === 'object' ? '.' + propName : '');
  const errors = formatErrorMessage(
    union(
      errorsAt(
        path,
        schema,
        (p) => p === path
      )(ctx.core.errors).map((error) => 'propName:' + error.message)
    )
  );
  return {
    rowPath,
    propName,
    schema,
    rootSchema: ctx.core.schema,
    errors,
    path,
    cellPath: rowPath + (schema?.type === 'object' ? '.' + propName : ''),
    enabled,
    cells: cells || ctx.cells,
    renderers: renderers || ctx.renderers,
    uischema
  };
};

const createControl = (
  scope: string,
  name: string | undefined,
  uischema: UISchemaElement,
  title: string | undefined
): UISchemaElement => {
  return {
    ...uischema,
    type: 'Control',
    scope,
    label:
      title !== undefined
        ? title
        : (uischema as any).label !== undefined
          ? (uischema as any).label
          : name !== undefined
            ? startCase(name)
            : true
  };
};

const NonEmptyCellComponent: React.FC<NonEmptyCellProps> = ({
  path,
  propName,
  schema,
  rootSchema,
  enabled,
  renderers,
  cells,
  ...props
}) => {
  const uischema = createControl(
    schema?.properties ? `#/properties/${propName}` : '#',
    propName,
    props?.uischema || { type: 'Control' },
    schema?.title
  );

  if (!schema?.properties) {
    delete (uischema as any).elements;
  }
  return (
    <div className="tw-px-1 tw-pt-0.5 tw-text-xs">
      {schema?.properties ? (
        <JsonFormsDispatch
          schema={
            Resolve.schema(schema, `#/properties/${propName}`, rootSchema || schema) || schema
          }
          uischema={uischema}
          path={path}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      ) : (
        <JsonFormsDispatch
          schema={schema}
          uischema={uischema}
          path={path + '.' + propName}
          enabled={enabled}
          renderers={renderers}
          cells={cells}
        />
      )}
    </div>
  );
};

const NonEmptyCell: React.FC<CellProps> = (ownProps) => {
  const ctx = useJsonForms();
  const emptyCellProps = ctxToNonEmptyCellProps(ctx, {
    ...ownProps,
    schema: ownProps.schema!
  });
  const isValid = isEmpty(emptyCellProps.errors);
  return <NonEmptyCellComponent {...emptyCellProps} isValid={isValid} />;
};

const NonEmptyRow = React.memo<NonEmptyRowProps>(
  ({
    childPath,
    schema,
    rowIndex,
    openDeleteDialog,
    moveUpCreator,
    moveDownCreator,
    enableUp,
    enableDown,
    showSortButtons,
    rowTitle,
    enabled,
    cells,
    path,
    records,
    uischema,
    readonly
  }) => {
    const moveUp = useMemo(() => moveUpCreator(path, rowIndex), [moveUpCreator, path, rowIndex]);
    const moveDown = useMemo(
      () => moveDownCreator(path, rowIndex),
      [moveDownCreator, path, rowIndex]
    );
    const gridSize = uischema?.options?.detail?.options?.gridSize ?? 4;
    return (
      <div
        key={childPath}
        className="tw-my-1.5 tw-inline-flex tw-w-full tw-items-center tw-justify-between tw-rounded tw-bg-white tw-text-xs tw-shadow"
      >
        <div className="tw-flex tw-w-full tw-flex-col">
          <CardHeader>
            <span className="tw-w-20">{`${rowTitle ?? 'Record'} #${rowIndex + 1}`}</span>
            {!readonly && (
              <IconButton
                id={`delete-item-${childPath}`}
                icon="Delete"
                ariaLabel="Delete"
                onClick={() => openDeleteDialog(childPath, rowIndex)}
                className="tw-text-color-0600 hover:tw-text-cds-red-0800"
                showShadow={false}
              />
            )}
          </CardHeader>
          <div
            className={`tw-grid tw-grid-cols-${gridSize} tw-place-items-stretch tw-gap-[2px] tw-p-2`}
          >
            {generateCells(
              NonEmptyCell,
              schema,
              uischema,
              childPath,
              enabled || false,
              cells || []
            )}
          </div>
        </div>
        {enabled && showSortButtons && (
          <div className="tw-flex tw-flex-col tw-items-center tw-px-1 tw-pt-0.5 tw-text-xs">
            {rowIndex > 0 && (
              <IconButton
                id={`moveup-item-${childPath}`}
                className="tw-text-color-0600 hover:tw-text-color-0500"
                icon="ArrowUpward"
                ariaLabel="Move up"
                onClick={moveUp}
                disabled={!enableUp}
              />
            )}
            {rowIndex < records - 1 && (
              <IconButton
                id={`movedown-item-${childPath}`}
                className="tw-text-color-0600 hover:tw-text-color-0500"
                icon="ArrowDownward"
                ariaLabel="Move down"
                onClick={moveDown}
                disabled={!enableDown}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

const TableRows: React.FC<TableRowsProps> = ({
  data,
  path,
  schema,
  openDeleteDialog,
  moveUp,
  moveDown,
  uischema,
  config,
  enabled,
  cells,
  readonly
}) => {
  const [expanded, setExpanded] = useState<string | boolean>(false);
  const handleExpansion = useCallback(
    (panel: string) => (_event: any, expandedPanel: boolean) => {
      setExpanded(expandedPanel ? panel : false);
    },
    []
  );
  const isExpanded = (index: number): boolean => expanded === composePaths(path, `${index}`);

  if (data === 0) {
    return (
      <Centered>
        <EmptyIconRenderer title="No records found" showIcon={false} />
      </Centered>
    );
  }
  const appliedUiSchemaOptions = merge({}, config, uischema.options);
  return (
    <>
      {range(data).map((index) => {
        const childPath = Paths.compose(path, `${index}`);
        return (
          <NonEmptyRow
            key={childPath}
            childPath={childPath}
            rowIndex={index}
            records={data}
            schema={schema}
            uischema={uischema}
            openDeleteDialog={openDeleteDialog}
            moveUpCreator={moveUp || (() => () => {})}
            moveDownCreator={moveDown || (() => () => {})}
            enableUp={index !== 0}
            enableDown={index !== data - 1}
            showSortButtons={appliedUiSchemaOptions.showSortButtons}
            rowTitle={appliedUiSchemaOptions.rowTitle ?? 'Record'}
            enabled={enabled}
            cells={cells}
            path={path}
            expanded={isExpanded(index)}
            handleExpansion={handleExpansion}
            readonly={readonly}
          />
        );
      })}
    </>
  );
};

const TailwindTableControl: React.FC<TailwindTableControlProps> = (props) => {
  const {
    label,
    path,
    config,
    schema,
    uischema,
    errors,
    openDeleteDialog,
    visible,
    enabled,
    data,
    readonly
  } = props;
  const appliedUiSchemaOptions = merge(
    {},
    config,
    (schema as any)?.options,
    (uischema as any).options
  );

  return (
    <div className="tw-mb-1.5 tw-w-full tw-grow">
      {visible && (
        <div className="tw-group tw-mt-1 tw-block tw-w-full tw-rounded tw-border tw-bg-slate-50 tw-shadow">
          <TableToolbar
            errors={errors}
            label={label}
            addItem={props.addItem}
            path={path}
            enabled={enabled && data === 0}
            schema={schema}
            readonly={readonly}
          />
          <div className="tw-w-full tw-px-2 tw-pb-2">
            <TableRows {...props} />
            {data !== 0 && !readonly && (
              <div className="tw-inline-flex tw-items-center tw-justify-end tw-space-x-2">
                <div>
                  {`Add ${isVowel(appliedUiSchemaOptions?.rowTitle) ? 'an' : 'a'} ${appliedUiSchemaOptions?.rowTitle ?? 'Record'}`}
                </div>
                <Tooltip id="tooltip-add" title={`Add to ${label}`} placement="left">
                  <IconButton
                    id={`add-item-${path}`}
                    icon="Add"
                    onClick={props.addItem(path, createDefaultValue(schema, {}))}
                    iconSize="20"
                    className="tw-my-0.5 tw-text-color-0600 hover:tw-text-color-0500"
                    bg="tw-bg-white tw-border"
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TailwindTableControl;
