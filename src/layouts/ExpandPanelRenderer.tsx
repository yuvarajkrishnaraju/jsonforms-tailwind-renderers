import React, { useCallback, useMemo } from 'react';
import {
  composePaths,
  findUISchema,
  getFirstPrimitiveProp,
  moveDown,
  moveUp,
  Resolve,
  update
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsContext } from '@jsonforms/react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';

import { Accordion, IconButton } from '../common';

interface ExpandPanelRendererProps {
  childLabel: string;
  childPath: string;
  totalItems: number;
  index: number;
  expanded: boolean;
  moveDown: (path: string, toMove: number) => (ev: React.SyntheticEvent) => void;
  moveUp: (path: string, toMove: number) => (ev: React.SyntheticEvent) => void;
  enableMoveDown: boolean;
  enableMoveUp: boolean;
  handleExpansion: (path: string) => (event: React.SyntheticEvent, expanded: boolean) => void;
  addItem: (path: string, toAdd: number[]) => (ev: React.SyntheticEvent) => void;
  removeItems: (path: string, toDelete: number[]) => (ev: React.SyntheticEvent) => void;
  path: string;
  rootSchema: any;
  schema: any;
  uischema: any;
  uischemas: any[];
  renderers: any[];
  cells: any[];
  config: any;
  readonly?: boolean;
  childLabelProp?: string;
}

const ExpandPanelRenderer = React.memo<ExpandPanelRendererProps>((props) => {
  const {
    childLabel,
    childPath,
    totalItems,
    index,
    expanded,
    moveDown,
    moveUp,
    enableMoveDown,
    enableMoveUp,
    handleExpansion,
    addItem,
    removeItems,
    path,
    rootSchema,
    schema,
    uischema,
    uischemas,
    renderers,
    cells,
    config,
    readonly = false
  } = props;

  const foundUISchema = useMemo(
    () => findUISchema(uischemas, schema, uischema.scope, path, undefined, uischema, rootSchema),
    [uischemas, schema, path, uischema, rootSchema]
  );

  const appliedUiSchemaOptions = merge({}, config, schema.options, uischema.options);
  let showAddItem =
    appliedUiSchemaOptions.showAddItem != null ? appliedUiSchemaOptions.showAddItem : true;
  if (!isNaN(appliedUiSchemaOptions.maximum)) {
    showAddItem = totalItems < Number(appliedUiSchemaOptions.maximum);
  }
  const showActionButtons =
    !readonly && childPath != 'raw_condition.and.0' && childPath != 'raw_condition.and.1';

  return (
    <div
      key={index}
      className="tw-group tw-inline-flex tw-w-full tw-items-center tw-justify-between tw-bg-white tw-px-2 tw-text-xs"
    >
      {!appliedUiSchemaOptions.disableExpand ? (
        <Accordion
          pid={childPath}
          title={`${appliedUiSchemaOptions.rowTitle ?? 'Record'} #${index + 1} ${!isEmpty(childLabel) ? '- ' + childLabel : ''}`}
          defaultOpen={expanded}
          onChange={handleExpansion(childPath)}
          onDelete={() => {}}
        >
          <JsonFormsDispatch
            schema={schema}
            uischema={foundUISchema}
            path={childPath}
            key={childPath}
            renderers={renderers}
            cells={cells}
          />
        </Accordion>
      ) : (
        <div className="tw-inline-flex tw-w-full tw-items-center tw-space-x-1">
          <label
            className={`${appliedUiSchemaOptions.rowTitle != '' ? 'tw-min-w-10' : ''} tw-text-[10px]`}
          >{`${appliedUiSchemaOptions.rowTitle ?? 'Record'} ${index + 1}.`}</label>
          <JsonFormsDispatch
            schema={schema}
            uischema={foundUISchema}
            path={childPath}
            key={childPath}
            renderers={renderers}
            cells={cells}
          />
        </div>
      )}
      <>
        <div className="tw-w-5">
          {showActionButtons && (
            <div className="tw-flex tw-flex-col tw-opacity-50 group-hover:tw-opacity-100">
              <IconButton
                id={`${path}-delete-row-${index}`}
                icon="Delete"
                ariaLabel="Delete Record"
                onClick={removeItems(path, [index])}
                className="tw-text-color-0600 hover:tw-text-cds-red-0800"
                showShadow={false}
                tooltip={`Delete this ${appliedUiSchemaOptions.rowTitle ?? 'Record'} ?`}
              />
              {showAddItem && (
                <IconButton
                  id={`clone-add-${index}`}
                  className="tw-text-color-0600 hover:tw-text-color-0500"
                  icon="FileCopy"
                  ariaLabel="Add Record"
                  onClick={addItem(path, [index])}
                  showShadow={false}
                />
              )}
            </div>
          )}
        </div>
        {appliedUiSchemaOptions.showSortButtons && (
          <div className="tw-flex tw-flex-col tw-items-center tw-px-1 tw-text-xs tw-opacity-50 group-hover:tw-opacity-100">
            {enableMoveUp && (
              <IconButton
                id={`moveup-item-${childPath}`}
                className="tw-text-color-0600 hover:tw-text-color-0500"
                icon="ArrowUpward"
                ariaLabel="Move up"
                onClick={moveUp(path, index)}
                bg=""
                showShadow={false}
                tooltip="Move Item Up"
              />
            )}
            {enableMoveDown && (
              <IconButton
                id={`movedown-item-${childPath}`}
                className="tw-text-color-0600 hover:tw-text-color-0500"
                icon="ArrowDownward"
                ariaLabel="Move down"
                onClick={moveDown(path, index)}
                bg=""
                showShadow={false}
                tooltip="Move Item Down"
              />
            )}
          </div>
        )}
      </>
    </div>
  );
});

ExpandPanelRenderer.displayName = 'ExpandPanelRenderer';

/**
 * Maps state to dispatch properties of an expand panel control.
 *
 * @param dispatch the store's dispatch method
 * @returns {DispatchPropsOfArrayControl} dispatch props of an expand panel control
 */
export const useDispatchToExpandPanelProps = (dispatch: any) => ({
  addItem: useCallback(
    (path: string, toAdd: number[]) => (ev: React.SyntheticEvent) => {
      const insert = (arr: any[], index: number, newItem: any) => [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted item
        newItem,
        // part of the array after the specified index
        ...arr.slice(index)
      ];
      ev.stopPropagation();
      dispatch(
        update(path, (array: any[]) => {
          toAdd
            .sort()
            .reverse()
            .forEach((i) => {
              array = insert(array, i + 1, array[i]);
            });
          return array;
        })
      );
    },
    [dispatch]
  ),
  removeItems: useCallback(
    (path: string, toDelete: number[]) => (ev: React.SyntheticEvent) => {
      ev.stopPropagation();
      dispatch(
        update(path, (array: any[]) => {
          toDelete
            .sort()
            .reverse()
            .forEach((i) => array.splice(i, 1));
          return array;
        })
      );
    },
    [dispatch]
  ),
  moveUp: useCallback(
    (path: string, toMove: number) => (ev: React.SyntheticEvent) => {
      ev.stopPropagation();
      dispatch(
        update(path, (array: any[]) => {
          moveUp(array, toMove);
          return array;
        })
      );
    },
    [dispatch]
  ),
  moveDown: useCallback(
    (path: string, toMove: number) => (ev: React.SyntheticEvent) => {
      ev.stopPropagation();
      dispatch(
        update(path, (array: any[]) => {
          moveDown(array, toMove);
          return array;
        })
      );
    },
    [dispatch]
  )
});

/**
 * Map state to control props.
 * @param state the JSON Forms state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const withContextToExpandPanelProps =
  <P extends ExpandPanelRendererProps>(Component: React.ComponentType<P>) =>
  ({ ctx, props }: { ctx: any; props: P }) => {
    const dispatchProps = useDispatchToExpandPanelProps(ctx.dispatch);
    const { childLabelProp, schema, path, index, uischemas } = props;
    const childPath = composePaths(path, `${index}`);
    const children = Resolve.data(ctx.core.data, path);
    const childData = Resolve.data(ctx.core.data, childPath);
    const childLabel = childLabelProp
      ? get(childData, childLabelProp, '')
      : get(childData, getFirstPrimitiveProp(schema), '');
    return (
      <Component
        {...props}
        {...dispatchProps}
        childLabel={childLabel}
        childPath={childPath}
        uischemas={uischemas}
        totalItems={Array.isArray(children) ? children.length : 0}
      />
    );
  };

export const withJsonFormsExpandPanelProps = <P extends ExpandPanelRendererProps>(
  Component: React.ComponentType<P>
) => withJsonFormsContext(withContextToExpandPanelProps(Component));

export default withJsonFormsExpandPanelProps(ExpandPanelRenderer);
