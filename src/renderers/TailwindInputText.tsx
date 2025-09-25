import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';

import {ErrorMessage, LabelRenderer, OverlayKeys} from '../common';
import TailwindSelectRenderer from './TailwindSelectRenderer';

interface TailwindInputTextProps {
  id: string;
  visible?: boolean;
  enabled?: boolean;
  uischema?: any;
  path: string;
  errors?: any[];
  schema?: any;
  label?: string;
  description?: string;
  handleChange: (path: string, value: string) => void;
  data?: string;
  trim?: boolean;
  config?: any;
}

/**
 * Default renderer for a string.
 */
const TailwindInputText = React.memo<TailwindInputTextProps>((props) => {
  const {
    id,
    visible = true,
    enabled = true,
    uischema,
    path,
    errors,
    schema,
    label,
    description,
    handleChange,
    data,
    trim = false,
    config
  } = props;

  const [passwordShow, setPasswordShow] = useState(schema?.format !== 'password');
  const [showOverlay, setShowOverlay] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start'
  });

  useEffect(() => {
    setPasswordShow(false);
    return () => setPasswordShow(false);
  }, []);

  useEffect(() => {
    if (data == undefined && schema?.default != undefined) {
      handleChange(path, schema.default);
      return;
    }
  }, [data, schema?.default, handleChange, path]);

  const isError = !isEmpty(errors);
  const appliedUiSchemaOptions = merge({}, config, uischema?.options);
  const value = data ?? '';

  const shouldSuggest = () => {
    if (appliedUiSchemaOptions.suggest) {
      const textBeforeCursor = value.slice(-2);
      setShowOverlay(textBeforeCursor.endsWith('${'));
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    if (appliedUiSchemaOptions.suggest) {
      const cursorPosition = e.target.selectionStart || 0;
      const textBeforeCursor = e.target.value.slice(0, cursorPosition);
      setShowOverlay(textBeforeCursor.endsWith('${'));
    }
    handleChange(path, e.target.value);
  };

  const onBlur = (e: React.FocusEvent) => {
    e.preventDefault();
    setTimeout(() => setShowOverlay(false), 100);
  };

  if (!visible) return null;

  const isPassword = schema?.format === 'password' || appliedUiSchemaOptions.format === 'password';
  const isMultiLine = appliedUiSchemaOptions?.multi;
  const isSpecialPath = path === 'raw_condition.and.1.statement.key';

  const handlePasswordToggle = () => {
    if (enabled) {
      setPasswordShow(!passwordShow);
    }
  };

  const handleOverlaySelect = (selected: any) => {
    setShowOverlay(false);
    handleChange(path, value + selected.key);
  };

  const renderInput = () => {
    if (isSpecialPath) {
      return (
        <TailwindSelectRenderer
          showLabel={false}
          enabled={true}
          path={path}
          options={[
            { value: 'type', label: 'type' },
            { value: 'schema_id', label: 'schema_id' }
          ]}
          enableFilter={false}
          data={value}
          handleChange={(_, val) => handleChange(path, val)}
          className="tw-w-full"
        />
      );
    }

    if (isMultiLine) {
      return (
        <textarea
          id={id}
          ref={setReferenceElement}
          disabled={!enabled}
          name={path}
          rows={appliedUiSchemaOptions?.isLarge ? 8 : 4}
          placeholder={description}
          value={value}
          onChange={onChange}
          onFocus={shouldSuggest}
          className={`tw-block tw-w-full tw-rounded-md tw-border tw-px-3 tw-py-2 tw-text-sm tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500 ${
            isError
              ? 'tw-border-red-600 tw-bg-red-50 tw-text-red-900 focus:tw-ring-red-500 focus:tw-border-red-500'
              : !enabled
                ? 'tw-border-gray-200 tw-bg-gray-100 tw-text-gray-500 tw-cursor-not-allowed tw-opacity-75'
                : 'tw-border-gray-300 tw-bg-white tw-text-gray-900 hover:tw-border-gray-400 focus:tw-border-blue-500 focus:tw-ring-blue-500'
          }`}
        />
      );
    }

    return (
      <div className="tw-relative">
        <input
          id={id}
          ref={setReferenceElement}
          disabled={!enabled}
          type={isPassword && !passwordShow ? 'password' : 'text'}
          name={path}
          placeholder={description}
          value={value}
          onChange={onChange}
          onFocus={shouldSuggest}
          className={`tw-block tw-w-full tw-rounded-md tw-border tw-px-3 tw-py-2 tw-text-sm tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500 ${
            isError
              ? 'tw-border-red-600 tw-bg-red-50 tw-text-red-900 focus:tw-ring-red-500 focus:tw-border-red-500'
              : !enabled
                ? 'tw-border-gray-200 tw-bg-gray-100 tw-text-gray-500 tw-cursor-not-allowed tw-opacity-75'
                : 'tw-border-gray-300 tw-bg-white tw-text-gray-900 hover:tw-border-gray-400 focus:tw-border-blue-500 focus:tw-ring-blue-500'
          } ${isPassword ? 'tw-pr-10' : ''}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            disabled={!enabled}
            className="tw-absolute tw-right-2 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-p-1 tw-text-gray-400 hover:tw-text-gray-600 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-1 tw-rounded"
            aria-label="toggle password visibility"
          >
            {passwordShow ? (
              <svg className="tw-h-4 tw-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg className="tw-h-4 tw-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="tw-grow" onBlur={onBlur}>
      {label && label.length > 0 && <LabelRenderer {...props} />}
      <div className="tw-relative">
        {renderInput()}
        {appliedUiSchemaOptions.suggest && showOverlay && (
          <div
            ref={setPopperElement}
            style={{
              position: 'absolute',
              zIndex: Number.MAX_SAFE_INTEGER,
              ...styles.popper
            }}
            {...attributes.popper}
          >
            <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-border tw-border-gray-200">
              <div
                onClick={() => setShowOverlay(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowOverlay(false);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <OverlayKeys
                  suggest={appliedUiSchemaOptions.suggest}
                  onSelect={handleOverlaySelect}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <ErrorMessage id={id} path={path} errors={errors} />
    </div>
  );
});

TailwindInputText.displayName = 'TailwindInputText';

export default TailwindInputText;
