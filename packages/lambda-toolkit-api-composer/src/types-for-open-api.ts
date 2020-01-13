import * as J from './types-for-json-schema';

export type OpenAPI = {
  openapi: string; // version
  info: InfoObject;
  servers?: ServerObject[];
  paths: PathsObject;
  security?: SecurityRequirementObject[];
  tags?: TagObject[];
  externalDocs?: ExternalDocumentationObject;
};

type InfoObject = {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: ContactObject;
  license?: LicenseObject;
  version?: string;
};

type TagObject = {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
};

type ExternalDocumentationObject = {
  description?: string;
  url: string;
};

/**
 * e.g.
*   {
      "petstore_auth": [
        "write:pets",
        "read:pets"
      ]
    }
 */
type SecurityRequirementObject = {
  [key: string]: string[];
};

type LicenseObject = {
  name: string;
  url?: string;
};

type ContactObject = {
  name: string;
  url: string;
  email: string;
};

export type OperationObject = {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentationObject;
  operationId?: string;
  parameters?: ParameterObject[];
  requestBody?: RequestBodyObject;
  callbacks?: {
    [key: string]: CallbackObject;
  };
  responses: ResponsesObject;
};

type CallbackObject = {
  [expression: string]: PathItemObject;
};

export type ParameterObject = {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  style?: StyleKinds;
  explode?: boolean;
  allowReserved?: boolean;
  schema?: J.JsonSchemaElement;
  example?: any;
  examples?: {
    [key: string]: any;
  };
  content?: {
    [key: string]: MediaTypeObject;
  };
};

export type RequestBodyObject = {
  description?: string;
  content: {
    [K in MediaTypes]?: MediaTypeObject;
  };
  required?: boolean;
};

type ResponsesObject = {
  default?: ResponseObject;
} & {
  [Status in StatusCodes]?: ResponseObject;
};

export type ResponseObject = {
  description?: string;
  headers?: {
    [key: string]: HeaderObject;
  };
  content?: {
    [key: string]: MediaTypeObject;
  };
  links?: {
    [key: string]: LinkObject;
  };
};

type LinkObject = {
  operationId?: string;
  parameters?: {
    [key: string]: any;
  };
  requestBody?: any;
  description?: string;
  server?: ServerObject;
};

type ServerObject = {
  url: string;
  description?: string;
  variables?: {
    [key: string]: ServerVariableObject;
  };
};

type ServerVariableObject = {
  enum?: string[];
  default: string;
  description?: string;
};

type HeaderObject = {
  description?: string;
  required?: boolean;
  explode?: boolean;
  schema?: J.JsonSchemaElement;
  style?: StyleKinds;
  allowEmptyValue?: boolean;
  allowReserved?: boolean;
  example?: any;
  content?: string;
  examples?: any;
};

type EncodingObject = {
  contentType: string;
  headers?: {
    [key: string]: HeaderObject;
  };
  style?: string;
  explode?: boolean;
  allowReserved?: boolean;
};

export type MediaTypeObject = {
  schema?: J.JsonSchemaElement;
  example?: any;
  examples?: {[key: string]: any};
  encoding?: {
    [schemaKey: string]: EncodingObject;
  };
};

export type PathItemContentType = {
  schema: J.JsonSchemaElement;
};

type MediaTypes = 'application/json' | 'application/xml' | 'text/html';

export type PathItemResponseObject = {
  description: string;
  content: {
    [ContentType in MediaTypes]?: PathItemContentType;
  };
};

export type StatusCodes =
  | 200
  | 201
  | 400
  | 401
  | 404
  | 403
  | 429
  | 500
  | 501
  | 503;
export type InKinds = 'path' | 'query' | 'cookie' | 'header';
export type StyleKinds =
  | 'matrix'
  | 'label'
  | 'form'
  | 'simple'
  | 'spaceDelimited'
  | 'pipeDelimited'
  | 'deepObject';

export type Operations =
  | 'get'
  | 'put'
  | 'post'
  | 'delete'
  | 'options'
  | 'head'
  | 'patch'
  | 'trace';

export type PathItemObject = {
  summary?: string;
  description?: string;
  servers?: ServerObject[];
  parameters?: ParameterObject[];
} & {
  [Op in Operations]?: OperationObject;
};

export type PathsObject = {
  [key: string]: PathItemObject;
};
