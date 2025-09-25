import { MdNotificationsActive } from 'react-icons/md';

interface ValidationIconProps {
  errorMessages?: string;
}

const ValidationIcon = ({ errorMessages }: ValidationIconProps) => {
  const errorCount = errorMessages !== undefined ? errorMessages.split('\n').length : 0;

  return (
    <span className="tw-relative tw-mx-4 tw-inline-block">
      <MdNotificationsActive />
      <span className="tw-absolute -tw-right-4 -tw-top-1 tw-transform tw-rounded-full tw-bg-red-600 tw-px-1 tw-py-0.5 tw-text-[10px] tw-font-bold tw-leading-none tw-text-white">
        {errorCount}
      </span>
    </span>
  );
};

export default ValidationIcon;
