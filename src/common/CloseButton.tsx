export const CloseButton = ({ id = 'close-btn', onClose }: any) => (
  <button
    id={id}
    type="button"
    className="tw-mr-2 tw-rounded tw-border tw-bg-slate-200 tw-px-4 tw-py-1 tw-text-center tw-text-xs tw-text-color-label tw-shadow hover:tw-bg-slate-100 hover:tw-shadow-xl focus:tw-outline-none"
    onClick={onClose}
  >
    Close
  </button>
);
