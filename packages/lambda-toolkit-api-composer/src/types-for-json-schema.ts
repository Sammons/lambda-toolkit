export type JsonSchemaBool = {
  type: 'boolean';
  description?: string;
  default?: boolean;
  nullable?: boolean;
};

export type JsonSchemaLong = {
  type: 'integer';
  format: 'int64';
  description?: string;
  minimum?: number;
  maximum?: number;
  enum?: number[];
  default?: number;
  nullable?: boolean;
};

export type JsonSchemaNumber = {
  type: 'number';
  format?: 'double' | 'float'
  description?: string;
  minimum?: number;
  maximum?: number;
  enum?: number[];
  default?: number;
  nullable?: boolean;
};

export type JsonSchemaDouble = {
  type: 'number';
  format: 'double'
  description?: string;
  minimum?: number;
  maximum?: number;
  enum?: number[];
  default?: number;
  nullable?: boolean;
};

export type JsonSchemaString = {
  type: 'string';
  pattern?: string;
  description?: string;
  format?: 'uuid' | 'email' | 'date' | 'timestamp';
  enum?: string[];
  minLength?: number;
  maxLength?: number;
  default?: string;
  nullable?: boolean;
};

export type JsonSchemaArray = {
  type: 'array';
  items: JsonSchemaElement;
  description?: string;
  minItems?: number;
  maxItems?: number;
  default?: any[];
  nullable?: boolean;
};

export type JsonSchemaElement =
  | JsonSchemaArray
  | JsonSchemaString
  | JsonSchemaLong
  | JsonSchemaDouble
  | JsonSchemaNumber
  | JsonSchemaBool
  | JsonSchemaObject;

export type JsonSchemaObject = {
  type: 'object';
  description?: string;
  properties?: {
    [key: string]: JsonSchemaElement;
  };
  required?: string[];
  default?: any;
  nullable?: boolean;
};
