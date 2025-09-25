import merge from 'lodash/merge';
import React, { useEffect } from 'react';
import {LabelRenderer} from '../common';

interface TailwindCheckboxRendererProps {
  id: string;
  visible: boolean;
  enabled: boolean;
  path: string;
  description?: string;
  uischema?: any;
  data?: any;
  handleChange: (path: string, value: boolean) => void;
  label?: string;
  schema?: any;
}

/**
 * Default renderer for a checkbox/boolean.
 */
const TailwindCheckboxRenderer = React.memo<TailwindCheckboxRendererProps>((props) => {
  const { id, visible, enabled, path, uischema, data, handleChange, label, schema } = props;
  const { resetTo } = merge({}, uischema?.options);

  useEffect(() => {
    if (!enabled && resetTo != null && data != resetTo) {
      handleChange(path, Boolean(resetTo));
    }
  }, [enabled, data, resetTo, handleChange, path]);

  if (!visible) return null;

  return (
    <div className="tw-mt-1 tw-flex tw-grow tw-flex-row tw-items-center tw-justify-between tw-space-x-3 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-px-3 tw-py-2 hover:tw-border-gray-300 hover:tw-shadow-sm tw-transition-all tw-duration-200">
      {label && label.length > 0 && <LabelRenderer {...props} fontSize="14px" />}
      <div className="tw-relative tw-flex tw-items-center">
        <label className="tw-flex tw-items-center tw-cursor-pointer">
          <input
            id={id}
            type="checkbox"
            disabled={!enabled}
            name={path}
            checked={data == undefined ? schema?.default : Boolean(data)}
            onChange={(ev) => handleChange(path, ev.target.checked)}
            className={`tw-h-4 tw-w-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 focus:tw-ring-2 tw-transition-all tw-duration-200 ${
              !enabled ? 'tw-cursor-not-allowed tw-opacity-60' : 'tw-cursor-pointer'
            }`}
          />
        </label>
      </div>
    </div>
  );
});

TailwindCheckboxRenderer.displayName = 'TailwindCheckboxRenderer';

export default TailwindCheckboxRenderer;
