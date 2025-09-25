import { isObjectArrayControl, isPrimitiveArrayControl, or, rankWith } from '@jsonforms/core';
import { useCallback, useState } from 'react';

import TailwindTableControl from '../renderers/Table/TailwindTableControl';
import {DeleteItemDialog, withJsonFormsArrayProps } from '../common';

export const TailwindObjectArrayControlRenderer = (props: any) => {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState('');
  const [rowData, setRowData] = useState(undefined);
  const { ctx, visible } = props;

  if (!visible) return null;

  const openDeleteDialog = useCallback(
    (p: any, rowIndex: any) => {
      setOpen(true);
      setPath(p);
      setRowData(rowIndex);
    },
    [setOpen, setPath, setRowData]
  );
  const deleteCancel = useCallback(() => setOpen(false), [setOpen]);
  const deleteConfirm = useCallback(() => {
    const p = path.substring(0, path.lastIndexOf('.'));
    props.removeItems(p, [rowData])();
    setOpen(false);
  }, [setOpen, path, rowData, props]);

  return (
    <div className="overflow-y-scroll custom-scrollbar">
      <TailwindTableControl
        {...props}
        openDeleteDialog={openDeleteDialog}
        readonly={ctx?.readonly}
      />
      <DeleteItemDialog
        title="Delete Entry"
        question="Are you sure you want to delete the selected entry?"
        showDialog={open}
        onClose={deleteCancel}
        onDelete={deleteConfirm}
      />
    </div>
  );
};

export const tailwindObjectArrayControlTester = rankWith(
  1003,
  or(isObjectArrayControl, isPrimitiveArrayControl)
);

export const TailwindObjectArrayControl = withJsonFormsArrayProps(
  TailwindObjectArrayControlRenderer
);
