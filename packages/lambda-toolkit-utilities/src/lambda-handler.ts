import {
  ObjectBuilder,
  OpenApiBuilder,
  OpenApiOperationBuilder,
  OpenApiOperations,
  StatusCodes,
} from 'lambda-toolkit-api-composer';
import { LambdaCognitoApiEvent } from './lambda-cognito-api-event';
import { PrimitiveTypeMap } from './type-maps';

type ResponseBodyShape<S extends StatusCodes, ResponseShapes extends {}> = {
  [K in S]: ResponseShapes extends { [K2 in K]: infer Shape }
  ? {
    statusCode: K;
    body: Shape;
    headers?: { [key: string]: string };
  }
  : {
    statusCode: K;
    headers?: { [key: string]: string };
  };
}[S];

// Dirty modify global to pin the reference, to be absolutely
// sure its pinned across versions or clones of the node module
const processContext: any = process as any;
export const APISpecifications: OpenApiBuilder[] =
  processContext['_APISpecifications'] ?? [];
processContext['_APISpecifications'] = APISpecifications;

function mergeIntoGlobal(api: OpenApiBuilder) {
  const existingMatchingApi = APISpecifications.find(spec => {
    return (
      spec.definition.openapi === api.definition.openapi &&
      spec.definition.info.title === api.definition.info.title &&
      spec.definition.info.version === api.definition.info.version
    );
  });
  if (existingMatchingApi == null) {
    APISpecifications.push(api);
  } else {
    // merge paths
    const operations = [
      'get',
      'patch',
      'post',
      'put',
      'options',
      'delete',
      'head',
      'trace',
    ] as const;
    const paths = Object.keys(api.definition.paths || {});
    for (let path of paths) {
      const pathItem = api.definition.paths[path];
      if (
        existingMatchingApi.definition.paths == null ||
        existingMatchingApi.definition.paths[path] == null
      ) {
        existingMatchingApi.definition.paths[path] = pathItem;
      } else {
        // merge operations
        operations.forEach(h => {
          if (pathItem[h] != null) {
            if (existingMatchingApi.definition.paths[path][h] == null) {
              existingMatchingApi.definition.paths[path][h] = pathItem[h];
            } else {
              // merge responses
              Object.assign(
                existingMatchingApi.definition.paths[path][h]?.responses || {},
                pathItem[h]?.responses || {},
              );
            }
          }
        });
      }
    }
  }
}

export class LambdaHandler<
  RequestBody = {},
  RequestHeaders = {},
  RequestQueryParams = {},
  ResponseShapes = {},
  Url extends string = never,
  Op extends OpenApiOperations = never
  > {
  private api: OpenApiBuilder;
  private endpoint: OpenApiOperationBuilder<{}, Url, Op>;
  constructor(
    private options: {
      project: string;
      version: string;
      url: Url;
      method: Op;
      gen?: boolean;
    },
  ) {
    this.api = new OpenApiBuilder(this.options.project);
    this.endpoint = this.api.addJsonEndpoint(
      this.options.method,
      this.options.url,
    );
  }
  private acceptsQueryParam<
    N extends string,
    Kind extends 'string' | 'double' | 'long' | 'boolean'
  >(
    name: N,
    kind: Kind,
  ): LambdaHandler<
    RequestBody,
    RequestHeaders,
    RequestQueryParams & { [Name in N]: PrimitiveTypeMap[Kind] },
    ResponseShapes,
    Url,
    Op
  > {
    this.endpoint.acceptsQueryParam(name, kind);
    return this as any;
  }
  acceptsStringQueryParam<N extends string>(name: N) {
    return this.acceptsQueryParam(name, 'string');
  }
  acceptsDoubleQueryParam<N extends string>(name: N) {
    return this.acceptsQueryParam(name, 'double');
  }
  acceptsLongQueryParam<N extends string>(name: N) {
    return this.acceptsQueryParam(name, 'long');
  }
  acceptsBoolQueryParam<N extends string>(name: N) {
    return this.acceptsQueryParam(name, 'boolean');
  }
  private headerOverrides: { [key: number]: { [key: string]: string } } = {};
  setsHeaders(statuses: number[], headers: { [key: string]: string }) {
    for (let status of statuses) {
      this.endpoint.respondsWithHeaderValues(status as StatusCodes, headers);
      this.headerOverrides[status] = headers;
    }
    return this;
  }
  respondsWithJsonObject<
    S extends StatusCodes,
    F extends (b: ObjectBuilder) => ObjectBuilder
  >(
    status: S,
    builder: F,
  ): LambdaHandler<
    RequestBody,
    RequestHeaders,
    RequestQueryParams,
    ResponseShapes &
    {
      [K in S]: ReturnType<F>['_shape'];
    },
    Url,
    Op
  > {
    this.endpoint.respondsWithObject(status, builder);
    return this as any;
  }
  acceptsJsonObject<F extends (b: ObjectBuilder) => ObjectBuilder>(
    builder: F,
  ): LambdaHandler<
    ReturnType<F>['_shape'],
    RequestHeaders,
    RequestQueryParams,
    ResponseShapes,
    Url,
    Op
  > {
    this.endpoint.acceptsJsonObject(builder);
    return this as any;
  }
  private registeredHandlers: (<S extends StatusCodes>(
    e: LambdaCognitoApiEvent<
      RequestBody,
      Url,
      RequestQueryParams,
      RequestHeaders
    >,
    c: LambdaCognitoApiEvent<
      RequestBody,
      Url,
      RequestQueryParams,
      RequestHeaders
    >['requestContext'],
  ) =>
    | ResponseBodyShape<S, ResponseShapes>
    | PromiseLike<ResponseBodyShape<S, ResponseShapes>>)[] = [];
  processesEventWith<
    S extends StatusCodes,
    F extends (
      e: LambdaCognitoApiEvent<
        RequestBody,
        Url,
        RequestQueryParams,
        RequestHeaders
      >,
      c: LambdaCognitoApiEvent<
        RequestBody,
        Url,
        RequestQueryParams,
        RequestHeaders
      >['requestContext'],
    ) =>
      | ResponseBodyShape<S, ResponseShapes>
      | PromiseLike<ResponseBodyShape<S, ResponseShapes>>
  >(h: F) {
    this.registeredHandlers.push(h as any);
    return this.build();
  }

  private build() {
    if (this.options.gen) {
      mergeIntoGlobal(this.api);
    }
    return (event: any, context: any, callback: Function) => {
      try {
        if (this.registeredHandlers.length === 0) {
          throw new Error('Missing handler');
        }
        if (event.body != null) {
          event.body = JSON.parse(event.body);
        }
        const result = Promise.resolve(
          this.registeredHandlers[0](event, context),
        );
        result.then(result => {
          const status = result.statusCode;
          if (Object.keys(result).includes('body')) {
            (result as any)['body'] = JSON.stringify((result as any)['body']);
            if (result.headers == null) {
              result.headers = {};
            }
            result.headers['Content-Type'] = 'application/json'
          }
          if (this.headerOverrides[status] != null) {
            const keys = Object.keys(this.headerOverrides[status]);
            if (result.headers == null) {
              result.headers = {};
            }
            for (let key of keys) {
              result.headers[key] = this.headerOverrides[status][key];
            }
          }
          callback(null, result);
        });
      } catch (e) {
        console.log(e);
        callback(e, null);
      }
    };
  }
}
