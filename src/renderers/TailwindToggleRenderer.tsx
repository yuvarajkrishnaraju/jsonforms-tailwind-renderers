import { LabelRenderer } from '../common';
import merge from 'lodash/merge';
import React from 'react';

interface TailwindToggleRendererProps {
  data?: any;
  uischema?: any;
  path: string;
  handleChange: (path: string, value: boolean) => void;
  config?: any;
  visible?: boolean;
  enabled?: boolean;
}

/**
 * Default renderer for a boolean toggle.
 */
const TailwindToggleRenderer = React.memo<TailwindToggleRendererProps>(
  ({ data, uischema, path, handleChange, config, visible = true, enabled = true }) => {
    const appliedUiSchemaOptions = merge({}, config, uischema?.options);
    const inputProps = { autoFocus: Boolean(appliedUiSchemaOptions.focus) };
    const checked = data === true || data === 'True' || data === 'TRUE';

    if (!visible) return null;

    return (
      <button
        id={`${path}-toggle`}
        autoFocus={inputProps.autoFocus}
        name={path}
        disabled={!enabled}
        onClick={() => {
          if (!enabled) return;
          handleChange(path, !checked);
        }}
        className={`tw-relative tw-inline-flex tw-h-6 tw-w-11 tw-flex-shrink-0 tw-cursor-pointer tw-rounded-full tw-border-2 tw-border-transparent tw-transition-colors tw-duration-200 tw-ease-in-out focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-2 ${
          checked ? 'tw-bg-blue-600' : 'tw-bg-gray-200'
        } ${!enabled ? 'tw-cursor-not-allowed tw-opacity-60' : ''}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`tw-pointer-events-none tw-inline-block tw-h-5 tw-w-5 tw-transform tw-rounded-full tw-bg-white tw-shadow tw-ring-0 tw-transition tw-duration-200 tw-ease-in-out ${
            checked ? 'tw-translate-x-5' : 'tw-translate-x-0'
          }`}
        />
      </button>
    );
  }
);

TailwindToggleRenderer.displayName = 'TailwindToggleRenderer';

export default TailwindToggleRenderer;

interface TailwindBooleanToggleProps {
  visible?: boolean;
  label?: string;
  [key: string]: any;
}

export const TailwindBooleanToggle = React.memo<TailwindBooleanToggleProps>((props) => {
  if (props.visible === false) return null;

  return (
    <div className="tw-mt-1 tw-flex tw-grow tw-flex-row tw-items-center tw-justify-between tw-space-x-3 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-px-3 tw-py-2 hover:tw-border-gray-300 hover:tw-shadow-sm tw-transition-all tw-duration-200">
      {props.label && props.label.length > 0 && <LabelRenderer {...props} fontSize="14px" />}
      <TailwindToggleRenderer
        path={props.path || ''}
        handleChange={props.handleChange || (() => {})}
        {...props}
      />
    </div>
  );
});

TailwindBooleanToggle.displayName = 'TailwindBooleanToggle';
