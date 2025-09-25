import React from 'react';
import {LabelRenderer} from '../common';

interface TailwindCheckboxProps {
  visible?: boolean;
  enabled?: boolean;
  path: string;
  id: string;
  description?: string;
  data?: boolean;
  label?: string;
  handleChange: (path: string, value: boolean) => void;
}

const TailwindCheckbox = React.memo<TailwindCheckboxProps>((props) => {
  const {
    visible = true,
    enabled = true,
    path,
    id,
    description,
    data,
    label,
    handleChange
  } = props;

  if (!visible) return null;

  return (
    <div className="tw-my-2 tw-w-full">
      <label
        className={`tw-m-0 tw-w-full tw-rounded tw-border tw-border-slate-100 tw-px-2 tw-py-1 tw-flex tw-items-center tw-cursor-pointer ${
          enabled ? 'tw-bg-white' : 'tw-bg-slate-100'
        }`}
      >
        <input
          type="checkbox"
          disabled={!enabled}
          name={path}
          id={id}
          checked={Boolean(data)}
          onChange={(event) => handleChange(path, event.target.checked)}
          className="tw-h-4 tw-w-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 focus:tw-ring-2 tw-mr-2"
        />
        {label && label.length > 0 ? (
          <LabelRenderer {...props} fontSize="12px" />
        ) : (
          <span className="tw-text-sm tw-text-gray-700">{description}</span>
        )}
      </label>
    </div>
  );
});

TailwindCheckbox.displayName = 'TailwindCheckbox';

export default TailwindCheckbox;
