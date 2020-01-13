export type JsonSchemaBool = {
  type: 'boolean';
  description?: string;
  default?: boolean;
  nullable?: boolean;
};

export type JsonSchemaLong = {
  type: 'long';
  description?: string;
  minimum?: number;
  maximum?: number;
  enum?: number[];
  default?: number;
  nullable?: boolean;
};

export type JsonSchemaDouble = {
  type: 'double';
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
