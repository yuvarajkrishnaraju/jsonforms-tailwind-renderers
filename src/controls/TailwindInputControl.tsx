import { isDescriptionHidden, showAsRequired, OwnPropsOfControl } from '@jsonforms/core';
import merge from 'lodash/merge';
import React from 'react';

import { useFocus } from '../util';

interface TailwindInputControlProps extends OwnPropsOfControl {
  input: React.ComponentType<any>;
  description?: string;
  errors?: string[];
  label?: string;
  required?: boolean;
  config?: any;
}

export const TailwindInputControl = (props: TailwindInputControlProps) => {
  const [focused, onFocus, onBlur] = useFocus();
  const { id, description, errors, label, uischema, visible, required, config, input } = props;

  if (!visible) return null;

  const isValid = (errors || []).length === 0;
  const appliedUiSchemaOptions = merge({}, config, uischema?.options);

  const showDescription = !isDescriptionHidden(
    !!visible,
    description,
    focused,
    appliedUiSchemaOptions.showUnfocusedDescription
  );

  const firstFormHelperText = showDescription ? description : !isValid ? errors : null;
  const secondFormHelperText = showDescription && !isValid ? errors : null;
  const InnerComponent = input;

  return (
    <div className="tw-w-full" onFocus={onFocus} onBlur={onBlur} id={id}>
      <label
        htmlFor={id + '-input'}
        className={`tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1 ${
          showAsRequired(!!required, appliedUiSchemaOptions.hideRequiredAsterisk)
            ? 'tw-after:tw-content-["*"] tw-after:tw-ml-0.5 tw-after:tw-text-red-500'
            : ''
        }`}
      >
        {label}
      </label>
      <div className={!appliedUiSchemaOptions.trim ? 'tw-w-full' : ''}>
        <InnerComponent {...props} id={id + '-input'} isValid={isValid} visible={!!visible} />
      </div>
      {firstFormHelperText && (
        <p
          className={`tw-mt-1 tw-text-xs ${!isValid && !showDescription ? 'tw-text-red-600' : 'tw-text-gray-500'}`}
        >
          {firstFormHelperText}
        </p>
      )}
      {secondFormHelperText && (
        <p className="tw-mt-1 tw-text-xs tw-text-red-600">{secondFormHelperText}</p>
      )}
    </div>
  );
};
