import React from 'react';

import { ErrorMessage } from './ErrorMessage';
import { LabelRenderer } from './LabelRenderer';

export interface TailwindNumericProps {
  id?: string;
  visible?: boolean;
  enabled?: boolean;
  path?: string;
  description?: string;
  data?: number | string;
  handleChange: (path: string, value: number) => void;
  label?: string;
  step?: number;
  errors?: string[];
}

function Parse(step: number, data: string | number | undefined): number {
  if (data === undefined) return 0;
  return step === 0.1 ? parseFloat(data as string) : parseInt(data as string);
}

/**
 * Default renderer for a number/integer.
 */
export const TailwindNumeric = React.memo<TailwindNumericProps>((props) => {
  const isError = (props.errors?.length ?? 0) > 0;
  const { id, visible, enabled, path, description, data, handleChange, label, step } = props;

  return (
    <>
      {visible && (
        <div className="tw-grow">
          {(label?.length ?? 0) > 0 && <LabelRenderer {...props} />}
          <input
            id={id}
            name={path}
            type="number"
            step={step}
            disabled={!enabled}
            value={data}
            placeholder={description}
            onWheel={(ev) => ev.currentTarget.blur()}
            autoComplete="off"
            className={`tw-block tw-rounded tw-border tw-px-2 tw-py-1 tw-placeholder-slate-500 tw-caret-slate-300 tw-ring-color-0600 ${
              !enabled && 'tw-bg-slate-200'
            } ${isError ? 'tw-border-red-600 focus:tw-border-red-500' : 'tw-border-slate-300 focus:tw-border-color-0600 focus:tw-ring-color-0500'} tw-w-full tw-text-sm focus:tw-outline-none`}
            onChange={(ev) => {
              ev.preventDefault();
              handleChange(path || '', Parse(step || 1, ev.target.value));
            }}
          />

          {isError && <ErrorMessage {...props} />}
        </div>
      )}
    </>
  );
});

TailwindNumeric.displayName = 'TailwindNumeric';
