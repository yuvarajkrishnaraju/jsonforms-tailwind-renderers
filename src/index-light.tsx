import { JsonForms } from '@jsonforms/react';

import {
  CoreActions,
  createAjv,
  INIT,
  JsonFormsCore,
  JsonSchema,
  UISchemaElement,
  UPDATE_CORE,
  UPDATE_DATA
} from '@jsonforms/core';
import { useCallback } from 'react';
import { TailwindLabel, tailwindLabelTester } from './additional/TailwindLabelRenderer';
import { TailwindAllOfControl, tailwindAllOfControlTester } from './controls/TailwindAllOfControl';
import { TailwindAnyOfControl, tailwindAnyOfControlTester } from './controls/TailwindAnyOfControl';
import {
  TailwindAnyOfStringOrEnumControl,
  tailwindAnyOfStringOrEnumControlTester
} from './controls/TailwindAnyOfStringOrEnumControl';
import {
  TailwindBooleanControl,
  tailwindBooleanControlTester
} from './controls/TailwindBooleanControl';
import {
  TailwindBooleanToggleControl,
  tailwindBooleanToggleControlTester
} from './controls/TailwindBooleanToggleControl';
import { TailwindDateControl, tailwindDateControlTester } from './controls/TailwindDateControl';
import {
  TailwindDateTimeControl,
  tailwindDateTimeControlTester
} from './controls/TailwindDateTimeControl';
import { TailwindEnumControl, tailwindEnumTester } from './controls/TailwindEnumControl';
import {
  TailwindIntegerControl,
  tailwindIntegerControlTester
} from './controls/TailwindIntegerControl';
import {
  TailwindNativeControl,
  tailwindNativeControlTester
} from './controls/TailwindNativeControl';
import {
  TailwindNumberControl,
  tailwindNumberControlTester
} from './controls/TailwindNumberControl';
import {
  TailwindObjectArrayControl,
  tailwindObjectArrayControlTester
} from './controls/TailwindObjectArrayControl';
import {
  TailwindOneOfRadioGroupControl,
  tailwindOneOfRadioGroupControlTester
} from './controls/TailwindOneOfRadioGroupControl';
import { TailwindOneOfControl, tailwindOneOfControlTester } from './controls/TailwindOneOfRenderer';
import {
  TailwindRadioGroupControl,
  tailwindRadioGroupControlTester
} from './controls/TailwindRadioGroupControl';
import { TailwindTextControl, tailwindTextControlTester } from './controls/TailwindTextControl';
import {
  TailwindArrayLayoutControl,
  tailwindArrayLayoutControlTester
} from './layouts/TailwindArrayLayoutRenderer';
import {
  TailwindCategorizationControl,
  tailwindCategorizationControlTester
} from './layouts/TailwindCategorizationLayout';
import {
  TailwindGroupLayoutControl,
  tailwindGroupLayoutControlTester
} from './layouts/TailwindGroupLayoutControl';
import {
  TailwindHorizontalLayoutControl,
  tailwindHorizontalLayoutTester
} from './layouts/TailwindHorizontalLayoutControl';
import {
  TailwindVerticalLayoutControl,
  tailwindVerticalLayoutTester
} from './layouts/TailwindVerticalLayoutControl';
import isEmpty from 'lodash/isEmpty';
import { ErrorObject } from 'ajv/dist/types';
import {
  TailwindObjectControl,
  tailwindObjectControlTester
} from './controls/TailwindObjectRenderer';

// Lightweight renderers - no Monaco Editor dependencies
export const TailwindRenderers = [
  // controls
  { tester: tailwindBooleanControlTester, renderer: TailwindBooleanControl },
  { tester: tailwindBooleanToggleControlTester, renderer: TailwindBooleanToggleControl },
  { tester: tailwindNativeControlTester, renderer: TailwindNativeControl },
  { tester: tailwindEnumTester, renderer: TailwindEnumControl },
  { tester: tailwindIntegerControlTester, renderer: TailwindIntegerControl },
  { tester: tailwindNumberControlTester, renderer: TailwindNumberControl },
  { tester: tailwindTextControlTester, renderer: TailwindTextControl },
  { tester: tailwindAllOfControlTester, renderer: TailwindAllOfControl },
  { tester: tailwindAnyOfControlTester, renderer: TailwindAnyOfControl },
  { tester: tailwindOneOfControlTester, renderer: TailwindOneOfControl },
  { tester: tailwindDateTimeControlTester, renderer: TailwindDateTimeControl },
  { tester: tailwindDateControlTester, renderer: TailwindDateControl },
  { tester: tailwindRadioGroupControlTester, renderer: TailwindRadioGroupControl },
  { tester: tailwindOneOfRadioGroupControlTester, renderer: TailwindOneOfRadioGroupControl },
  { tester: tailwindObjectArrayControlTester, renderer: TailwindObjectArrayControl },
  { tester: tailwindObjectControlTester, renderer: TailwindObjectControl },

  // layouts
  { tester: tailwindGroupLayoutControlTester, renderer: TailwindGroupLayoutControl },
  { tester: tailwindHorizontalLayoutTester, renderer: TailwindHorizontalLayoutControl },
  { tester: tailwindVerticalLayoutTester, renderer: TailwindVerticalLayoutControl },
  { tester: tailwindCategorizationControlTester, renderer: TailwindCategorizationControl },
  { tester: tailwindArrayLayoutControlTester, renderer: TailwindArrayLayoutControl },

  // additional
  { tester: tailwindLabelTester, renderer: TailwindLabel },
  { tester: tailwindAnyOfStringOrEnumControlTester, renderer: TailwindAnyOfStringOrEnumControl }
];

const hexStringPattern = /^[0-9a-fA-F]+$/;

const ajv = createAjv({
  discriminator: true,
  strict: false
});
ajv.addFormat(
  'ip',
  /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/
);

ajv.addFormat('mac', /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/);

ajv.addFormat('numeric-string', /^\d+$/);

ajv.addFormat('hex-string', hexStringPattern);

ajv.addFormat('alphanumeric', /^[a-zA-Z0-9-]+$/);

ajv.addFormat('alphanumeric-string', {
  type: 'string',
  validate: (data) =>
    data.length > 0 && /^[a-zA-Z_]+$/.test(data[0]) && /^[0-9a-zA-Z+_-]+$/.test(data)
});

ajv.addFormat('bit-string', /^[0-1]+$/);

ajv.addFormat('octet-string', {
  type: 'string',
  validate: (data) => {
    if (data == null || data.length % 2 !== 0) return false;
    return hexStringPattern.test(data);
  }
});

ajv.addFormat('printable-string', /^[\x20-\x7E]+$/);

ajv.addFormat('vdusim.tar.gz', {
  type: 'string',
  validate: (data) => {
    let isUrlCorrect = false;
    try {
      new URL(data);
      isUrlCorrect = true;
    } catch (_) {}
    return isUrlCorrect && /vdusim.tar.gz/.test(data);
  }
});

export interface TailwindJsonFormsProps {
  data: any;
  transformData?: (prop: any) => any;
  isValid?: (prop: { isValid: boolean; errors?: ErrorObject[] | null; errorsText: string }) => any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  onChange?(state: Pick<JsonFormsCore, 'data' | 'errors'>): void;
  patternErrorMessageMap?: any;
  readonly?: boolean;
}

export default function TailwindJsonForms({
  transformData,
  isValid,
  patternErrorMessageMap,
  ...props
}: TailwindJsonFormsProps) {
  const middleware = useCallback(
    (
      state: JsonFormsCore,
      action: CoreActions,
      defaultReducer: (state: JsonFormsCore, action: CoreActions) => JsonFormsCore
    ) => {
      const newState = defaultReducer(state, action);
      switch (action.type) {
        case INIT:
        case UPDATE_CORE:
        case UPDATE_DATA: {
          if (typeof transformData == 'function') {
            newState.data = transformData(newState.data);
          }
          if (typeof isValid == 'function') {
            isValid({
              isValid: ajv.validate(newState.schema, newState.data),
              errors: ajv.errors,
              errorsText: ajv.errorsText(ajv.errors)
            });
          }
          if (newState.schema != undefined) {
            if (!isEmpty(newState.errors)) {
              console.log('Form Errors', newState.errors);
            }
            newState.errors?.forEach((error) => {
              if (
                error?.params?.pattern &&
                patternErrorMessageMap &&
                patternErrorMessageMap[error?.params?.pattern]
              ) {
                error.message = patternErrorMessageMap[error.params.pattern];
              }
            });
          }
          return newState;
        }
        default:
          return newState;
      }
    },
    [patternErrorMessageMap]
  );
  return (
    <div className="tw-w-full">
      <JsonForms {...props} renderers={TailwindRenderers} middleware={middleware} />
    </div>
  );
}

export const isValidData = (schema: JsonSchema, data: any) => {
  return {
    isValid: ajv.validate(schema, data),
    errors: ajv.errors,
    errorsText: ajv.errorsText(ajv.errors)
  };
};
