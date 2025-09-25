import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import { useEffect } from 'react';
import ReactSelect from 'react-select';

import { ErrorMessage } from './ErrorMessage';
import { LabelRenderer } from './LabelRenderer';
import { ReactSelectCustomStyles } from './Constants';

export const SelectRenderer = ({
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
  className = '',
  ...props
}: any) => {
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

  useEffect(() => {
    if (data === undefined && props.schema?.default !== undefined) {
      onChange(options?.find((item: any) => item.value === props.schema?.default));
    }
  }, [data]);

  let selectedOption;
  if (appliedUiSchemaOptions.returnIndex) {
    selectedOption = options[data];
  } else {
    selectedOption = options?.find((item: any) => item.value === data);
  }

  if (!visible) return null;

  return (
    <div className={className}>
      {showLabel && label?.length > 0 && <LabelRenderer path={path} label={label} {...props} />}
      <ReactSelect
        id={`select-${id}`}
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
      {appliedUiSchemaOptions.returnIndex != null && (
        <ErrorMessage id={id} path={path} errors={errors} />
      )}
    </div>
  );
};
