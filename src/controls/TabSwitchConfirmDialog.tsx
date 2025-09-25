import React, { useEffect } from 'react';

export interface TabSwitchConfirmDialogProps {
  open: boolean;
  handleClose: () => void;
  confirm: () => void;
  cancel: () => void;
  id: string;
}

export const TabSwitchConfirmDialog = ({
  open,
  handleClose,
  confirm,
  cancel,
  id
}: TabSwitchConfirmDialogProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div className="tw-fixed tw-inset-0 tw-z-50 tw-overflow-y-auto">
      {/* Backdrop */}
      <div
        className="tw-fixed tw-inset-0 tw-bg-gray-500 tw-bg-opacity-75 tw-transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="tw-flex tw-min-h-full tw-items-end tw-justify-center tw-p-4 tw-text-center sm:tw-items-center sm:tw-p-0">
        <div
          role="dialog"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="tw-relative tw-transform tw-overflow-hidden tw-rounded-lg tw-bg-white tw-px-4 tw-pt-5 tw-pb-4 tw-text-left tw-shadow-xl tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-max-w-lg sm:tw-p-6"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="tw-absolute tw-right-4 tw-top-4 tw-text-gray-400 hover:tw-text-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2 tw-rounded-md tw-p-1"
            aria-label="Close dialog"
          >
            <svg className="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Title */}
          <div className="tw-mb-4">
            <h3
              id="alert-dialog-title"
              className="tw-text-lg tw-font-medium tw-leading-6 tw-text-gray-900 tw-pr-8"
            >
              Clear form?
            </h3>
          </div>

          {/* Content */}
          <div className="tw-mb-6">
            <p id="alert-dialog-description" className="tw-text-sm tw-text-gray-500">
              Your data will be cleared if you navigate away from this tab. Do you want to proceed?
            </p>
          </div>

          {/* Actions */}
          <div className="tw-flex tw-flex-col-reverse sm:tw-flex-row sm:tw-justify-end sm:tw-space-x-3 tw-space-y-3 tw-space-y-reverse sm:tw-space-y-0">
            <button
              onClick={cancel}
              className="tw-inline-flex tw-w-full tw-justify-center tw-rounded-md tw-border tw-border-gray-300 tw-bg-white tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 tw-shadow-sm hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2 sm:tw-w-auto"
            >
              No
            </button>
            <button
              onClick={confirm}
              id={`${id}-confirm-yes`}
              className="tw-inline-flex tw-w-full tw-justify-center tw-rounded-md tw-border tw-border-transparent tw-bg-blue-600 tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-white tw-shadow-sm hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2 sm:tw-w-auto tw-auto-focus"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
