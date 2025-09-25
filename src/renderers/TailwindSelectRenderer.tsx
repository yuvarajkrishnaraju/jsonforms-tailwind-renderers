import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import React, { useEffect } from 'react';
import ReactSelect from 'react-select';
import { OwnPropsOfEnum, UISchemaElement } from '@jsonforms/core';

import {ErrorMessage, LabelRenderer} from '../common';
import { ReactSelectCustomStyles } from '../common/Constants';

interface TailwindSelectRendererProps extends OwnPropsOfEnum {
  id?: string;
  path: string;
  visible?: boolean;
  errors?: string[];
  enabled?: boolean;
  label?: string;
  data?: any;
  handleChange: (path: string, value: any) => void;
  enableFilter?: boolean;
  description?: string;
  placeholder?: string;
  showLabel?: boolean;
  className?: string;
  config?: any;
  uischema?: UISchemaElement;
  schema?: any; // Use any to allow custom properties like values and options
  required?: boolean;
}

const TailwindSelectRenderer = React.memo<TailwindSelectRendererProps>(
  ({
    id,
    path,
    visible = true,
    errors,
    enabled = true,
    label,
    data,
    handleChange,
    enableFilter = true,
    description,
    placeholder,
    showLabel = true,
    className,
    ...props
  }) => {
    const appliedUiSchemaOptions = merge(
      {},
      props.config,
      props.uischema?.options,
      props.schema?.options
    );
    const options = !isEmpty(props.schema?.values) ? props.schema?.values : props.options;
    const onChange = (selected: any) => {
      let ev;
      if (appliedUiSchemaOptions.returnIndex) {
        ev = options?.findIndex((item: any) => item?.value === selected.value);
      } else {
        ev = selected?.value;
      }
      handleChange(path, ev);
    };

    let selectedOption;
    if (appliedUiSchemaOptions.returnIndex) {
      selectedOption = options[data];
    } else {
      selectedOption = options?.find((item: any) => item.value === data);
    }

    useEffect(() => {
      if (data === undefined && props.schema?.default !== undefined) {
        onChange(options?.find((item: any) => item.value === props.schema?.default));
      }
    }, [data]);

    if (!visible) return null;

    return (
      <div className="tw-grow">
        {showLabel && label && label.length > 0 && (
          <LabelRenderer path={path} label={label} {...props} />
        )}
        <ReactSelect
          id={`select-${id}`}
          inputId={`select-input-${id}`}
          classNamePrefix={`twr-select-${id}`}
          placeholder={!isEmpty(label) ? label : 'Select...'}
          styles={ReactSelectCustomStyles({ enabled })}
          isSearchable={enableFilter}
          value={selectedOption}
          onChange={onChange}
          options={options}
          isDisabled={!enabled}
          menuPortalTarget={document.body}
          menuPosition="absolute"
          menuPlacement="auto"
          required={props?.required}
        />
        {isEmpty(props.schema?.values) && <ErrorMessage id={id} path={path} errors={errors} />}
      </div>
    );
  }
);

export default TailwindSelectRenderer;
