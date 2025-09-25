import { createDefaultValue } from '@jsonforms/core';
import React from 'react';

import { CardHeader, IconButton, Tooltip } from '../../common';
//import ValidationIcon from "./ValidationIcon";

const TableToolbar = React.memo(
  ({
    /*errors,*/ label,
    labelEnd,
    path,
    addItem,
    schema,
    rootSchema = {},
    enabled,
    createDefault,
    readonly = false
  }: any) => {
    return (
      <CardHeader>
        <div className="tw-inline-flex tw-w-full tw-items-center tw-space-x-2">
          <div className="tw-select-none tw-text-[14px] tw-tracking-wide">{label}</div>
          {labelEnd}
          {/**{errors.length > 0 && <ValidationIcon id="tooltip-validation" errorMessages={errors} />}**/}
        </div>
        {enabled && !readonly && (
          <Tooltip id="tooltip-add" title={`Add to ${label}`} placement="left">
            <IconButton
              id={`add-first-item-${path}`}
              icon="Add"
              onClick={addItem(
                path,
                createDefault !== undefined
                  ? createDefault()
                  : createDefaultValue(schema, rootSchema)
              )}
              iconSize="20"
              className="tw-text-color-0600 hover:tw-text-color-0500"
              bg="tw-bg-white tw-border"
            />
          </Tooltip>
        )}
      </CardHeader>
    );
  }
);

export default TableToolbar;
