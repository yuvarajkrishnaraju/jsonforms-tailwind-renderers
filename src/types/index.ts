export interface JsonSchema {
  type?: string;
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  required?: string[];
  enum?: any[];
  enumNames?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  default?: any;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  if?: JsonSchema;
  then?: JsonSchema;
  else?: JsonSchema;
  dependencies?: Record<string, JsonSchema | string[]>;
  additionalProperties?: boolean | JsonSchema;
  multipleOf?: number;
  [key: string]: any;
}

export interface UISchemaElement {
  type: string;
  scope?: string;
  label?: string;
  options?: Record<string, any>;
  elements?: UISchemaElement[];
  rule?: Rule;
  [key: string]: any;
}

export interface Rule {
  effect: 'SHOW' | 'HIDE' | 'DISABLE' | 'ENABLE';
  condition: {
    scope: string;
    schema: JsonSchema;
  };
}

export interface ControlProps {
  schema: JsonSchema;
  uischema: UISchemaElement;
  path: string;
  enabled?: boolean;
  visible?: boolean;
  data: any;
  errors?: Record<string, string[]>;
  touched?: Record<string, boolean>;
  label?: string;
  required?: boolean;
  onChange: (data: any) => void;
  onBlur?: (path: string, value: any) => void;
  onFocus?: (path: string, value: any) => void;
}

export interface LayoutProps {
  schema: JsonSchema;
  uischema: UISchemaElement;
  path: string;
  enabled?: boolean;
  visible?: boolean;
  data: any;
  onChange: (data: any) => void;
  onBlur?: (path: string, value: any) => void;
  onFocus?: (path: string, value: any) => void;
}

export interface RendererProps {
  schema: JsonSchema;
  uischema: UISchemaElement;
  path: string;
  enabled?: boolean;
  visible?: boolean;
  data: any;
  onChange: (data: any) => void;
  onBlur?: (path: string, value: any) => void;
  onFocus?: (path: string, value: any) => void;
}

export interface JsonFormsState {
  data: any;
  errors?: Record<string, string[]>;
  touched?: Record<string, boolean>;
  [key: string]: any;
}

export interface JsonFormsProps {
  schema: JsonSchema;
  uischema?: UISchemaElement;
  data?: any;
  onChange?: (data: any) => void;
  onBlur?: (path: string, value: any) => void;
  onFocus?: (path: string, value: any) => void;
  readonly?: boolean;
  disabled?: boolean;
  ajv?: any;
  i18n?: any;
  validationMode?: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';
}
