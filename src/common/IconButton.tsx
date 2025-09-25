import { useState } from 'react';

import { Tooltip } from './Tooltip';

export const IconButton = ({
  id,
  onClick,
  icon,
  title,
  disabled = false,
  ariaLabel,
  bg = 'tw-bg-color-0600 hover:tw-bg-color-0500',
  showShadow = true,
  defaultShowTitle = true,
  tooltip
}: any) => {
  const [showTitle, setShowTitle] = useState(defaultShowTitle);
  const toggleShowTitle = () => {
    if (!defaultShowTitle) {
      setShowTitle(!showTitle);
    }
  };

  const Button = () => (
    <button
      id={id}
      disabled={disabled}
      className={`${ariaLabel === undefined ? (disabled ? 'tw-cursor-not-allowed tw-bg-slate-300 hover:tw-bg-slate-200' : bg) : ''} tw-rounded tw-p-0.5 tw-text-white ${title != undefined ? 'tw-pr-2' : ''} ${showShadow ? 'tw-shadow hover:tw-shadow-xl' : ''} tw-inline-flex tw-items-center tw-justify-center`}
      onClick={onClick}
      onMouseEnter={toggleShowTitle}
      onMouseLeave={toggleShowTitle}
    >
      {icon}
      {title !== undefined && showTitle === true && (
        <span className="tw-select-none tw-py-0.5 tw-text-xs">{title}</span>
      )}
    </button>
  );

  if (tooltip)
    return (
      <Tooltip title={tooltip}>
        <Button />
      </Tooltip>
    );
  return <Button />;
};
