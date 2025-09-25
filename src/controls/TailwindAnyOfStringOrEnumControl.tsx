import {
  and,
  rankWith,
  schemaMatches,
  uiTypeIs,
  OwnPropsOfControl,
  JsonSchema
} from '@jsonforms/core';
import { withJsonFormsControlProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import React, { useMemo } from 'react';

import { useDebouncedChange } from '../util';
import { TailwindInputControl } from './TailwindInputControl';

const findEnumSchema = (schemas: JsonSchema[]) =>
  schemas.find((s) => s.enum !== undefined && (s.type === 'string' || s.type === undefined));

const findTextSchema = (schemas: JsonSchema[]) =>
  schemas.find((s) => s.type === 'string' && s.enum === undefined);

interface TailwindAutocompleteInputTextProps extends OwnPropsOfControl {
  data?: any;
  config?: any;
  className?: string;
  isValid?: boolean;
  handleChange?: (path: string, value: any) => void;
}

const TailwindAutocompleteInputText = (props: TailwindAutocompleteInputTextProps) => {
  const { data, config, className, id, enabled, uischema, isValid, path, handleChange, schema } =
    props;
  const enumSchema = findEnumSchema(schema?.anyOf || []);
  const stringSchema = findTextSchema(schema?.anyOf || []);
  const maxLength = stringSchema?.maxLength;
  const appliedUiSchemaOptions = useMemo(
    () => merge({}, config, uischema?.options),
    [config, uischema?.options]
  );
  const inputProps = useMemo(() => {
    let propMemo: any = {};
    if (appliedUiSchemaOptions.restrict) {
      propMemo = { maxLength: maxLength };
    }
    if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
      propMemo.size = maxLength;
    }
    propMemo.list = (props.id || '') + 'datalist';
    return propMemo;
  }, [appliedUiSchemaOptions, props.id, maxLength]);
  const [inputText, onChange] = useDebouncedChange(
    handleChange || (() => {}),
    '',
    data,
    path || ''
  );

  const dataList = (
    <datalist id={(props.id || '') + 'datalist'}>
      {Array.isArray(enumSchema?.enum) &&
        enumSchema.enum.map((optionValue) => <option value={optionValue} key={optionValue} />)}
    </datalist>
  );
  return (
    <div className="tw-relative">
      <input
        type="text"
        value={inputText ?? ''}
        onChange={onChange}
        className={`tw-block tw-w-full tw-rounded-md tw-border tw-px-3 tw-py-2 tw-text-sm tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-border-blue-500 ${
          !isValid
            ? 'tw-border-red-300 tw-bg-red-50 tw-text-red-900 focus:tw-ring-red-500 focus:tw-border-red-500'
            : !enabled
              ? 'tw-border-gray-200 tw-bg-gray-100 tw-text-gray-500 tw-cursor-not-allowed tw-opacity-75'
              : 'tw-border-gray-300 tw-bg-white tw-text-gray-900 hover:tw-border-gray-400 focus:tw-border-blue-500 focus:tw-ring-blue-500'
        } ${className || ''}`}
        id={id}
        disabled={!enabled}
        autoFocus={appliedUiSchemaOptions.focus}
        style={{
          width: appliedUiSchemaOptions.trim && maxLength !== undefined ? `${maxLength}ch` : '100%'
        }}
        list={inputProps.list}
        maxLength={inputProps.maxLength}
        size={inputProps.size}
      />
      {dataList}
    </div>
  );
};

const TailwindAnyOfStringOrEnum = (props: OwnPropsOfControl) => (
  <TailwindInputControl {...props} input={TailwindAutocompleteInputText} />
);

const hasEnumAndText = (schemas: JsonSchema[]) => {
  // idea: map to type,enum and check that all types are string and at least one item is of type enum,
  const enumSchema = findEnumSchema(schemas);
  const stringSchema = findTextSchema(schemas);
  const remainingSchemas = schemas.filter((s) => s !== enumSchema || s !== stringSchema);
  const wrongType = remainingSchemas.find((s) => s.type && s.type !== 'string');
  return enumSchema && stringSchema && !wrongType;
};

export const tailwindAnyOfStringOrEnumControlTester = rankWith(
  1005,
  and(
    uiTypeIs('Control'),
    schemaMatches(
      (schema: JsonSchema) =>
        (schema.hasOwnProperty('anyOf') && hasEnumAndText(schema.anyOf || [])) || false
    )
  )
);

export const TailwindAnyOfStringOrEnumControl =
  withJsonFormsControlProps(TailwindAnyOfStringOrEnum);
