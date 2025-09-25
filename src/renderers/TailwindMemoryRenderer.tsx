import {ErrorMessage, LabelRenderer} from '../common';
import isEmpty from 'lodash/isEmpty';
import { Select } from '@headlessui/react';
import merge from 'lodash/merge';

const MAX_MEMORY = 8;

export default function TailwindMemoryRenderer(props:any) {
  const { id, enabled, path, description, data, handleChange, label, visible, uischema } = props;

  const appliedUiSchemaOptions = merge({}, uischema.options);
  const maxMemory = appliedUiSchemaOptions.maxMemory ?? MAX_MEMORY;
  const isDataEmpty = isEmpty(data);
  let num = !isDataEmpty ? parseInt(data.slice(0, -1)) : 0;
  const unit = !isDataEmpty ? data.at(-1) : 'm';
  const isError = props.errors?.length > 0;

  const max = unit === 'g' ? maxMemory : maxMemory * 1024;
  return (
    <>
      {visible && (
        <div className="tw-grow group">
          <div className="tw-flex tw-items-end tw-space-x-0">
            <div className="tw-grow">
              {label?.length > 0 && <LabelRenderer {...props} />}
              <input
                id={id}
                name={path + '-value'}
                type="number"
                step={1}
                disabled={!enabled}
                value={num}
                placeholder={description}
                min={0}
                max={max}
                autoComplete="off"
                className={`tw-block tw-rounded-s tw-border tw-px-2 tw-py-1 tw-placeholder-slate-500 tw-caret-slate-300 tw-ring-color-0600 ${
                  !props.enabled && 'tw-bg-slate-200'
                } ${isError ? 'tw-border-red-600 focus:tw-border-red-500' : 'tw-border-slate-300 focus:tw-border-color-0600 focus:tw-ring-color-0500'} tw-w-full tw-text-sm focus:tw-outline-none`}
                onChange={(ev) => {
                  ev.preventDefault();
                  let value = parseInt(ev.target.value);
                  value = value > max ? max : value;
                  handleChange(path, value + unit);
                }}
              />
            </div>
            <Select
              id={id + '-unit'}
              name={path + '-unit'}
              disabled={!enabled}
              value={unit}
              onChange={(ev) => {
                ev.preventDefault();
                if (ev.target.value === 'g') {
                  num = num > maxMemory ? maxMemory : num;
                }
                handleChange(path, num + ev.target.value);
              }}
              className={`tw-block tw-rounded-e tw-border tw-py-1 tw-placeholder-slate-500 tw-caret-slate-300 tw-ring-color-0600 ${
                !props.enabled && 'tw-bg-slate-200'
              } ${isError ? 'tw-border-red-600 focus:tw-border-red-500' : 'tw-border-slate-300 focus:tw-border-color-0600 focus:tw-ring-color-0500'} tw-text-sm focus:tw-outline-none`}
            >
              <option value="m">MB</option>
              <option value="g">GB</option>
            </Select>
          </div>
          {isError && <ErrorMessage {...props} />}
        </div>
      )}
    </>
  );
}
