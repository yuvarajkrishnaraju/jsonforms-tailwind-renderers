import { CustomDialog } from './CustomDialog';

export const DeleteItemDialog = ({ showDialog, title, question, item, onDelete, onClose }: any) => (
  <CustomDialog open={showDialog} onClose={onClose} title={title}>
    <span className="tw-mt-2 tw-text-center">{question}</span>
    <div className="tw-mb-4 tw-mt-2 tw-inline-flex tw-justify-center tw-text-lg tw-font-bold tw-text-red-600">
      {item}
    </div>
    <div className="tw-flex tw-items-start tw-justify-between tw-border-t tw-border-solid tw-border-slate-300 tw-pb-2" />
    <div className="tw-flex tw-w-full tw-justify-end tw-text-cds-white">
      <button
        id="delete-cancel"
        type="button"
        className="tw-rounded tw-bg-slate-200 tw-px-5 tw-py-1 tw-uppercase tw-text-color-label tw-shadow-sm hover:tw-bg-slate-100 focus:tw-outline-none"
        onClick={onClose}
      >
        CLOSE
      </button>
      <button
        id="delete-confirm"
        type="button"
        className="uppercase tw-ml-2 tw-rounded tw-bg-red-600 tw-px-5 tw-py-1 tw-shadow-sm hover:tw-bg-red-500 focus:tw-outline-none"
        onClick={onDelete}
      >
        DELETE
      </button>
    </div>
  </CustomDialog>
);
