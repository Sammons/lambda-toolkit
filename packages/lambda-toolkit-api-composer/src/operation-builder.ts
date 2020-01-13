import {
  ResponseObject,
  MediaTypeObject,
  StatusCodes,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  Operations,
} from './types-for-open-api';
import {ObjectBuilder} from './builder-object';
import * as U from './type-utilities';
import {JsonSchemaElement} from './types-for-json-schema';
import {ArrayBuilder} from './builder-array';
import {OpenApiBuilder} from './open-api-builder';

export class OperationBuilder<R, Url extends string, Op extends Operations> {
  constructor(
    private operationObject: OperationObject,
    private api: OpenApiBuilder<R>,
  ) {}
  respondsWithObject<
    Status extends StatusCodes,
    Modifier extends (o: ObjectBuilder) => ObjectBuilder
  >(
    status: Status,
    modifier: Modifier,
  ): OpenApiBuilder<
    U.DeepMerge3<R, Url, Op, Status, ReturnType<Modifier>['_shape']>
  > {
    const built = modifier(new ObjectBuilder());
    const mediaTypeObject: MediaTypeObject = {
      schema: built.schema,
    };
    const responseObject: ResponseObject = {
      description: '',
      content: {
        'application/json': mediaTypeObject,
      },
    };
    this.operationObject.responses[status] = responseObject;
    return this.api as any;
  }
  respondsWithArray<
    Status extends StatusCodes,
    Modifier extends (o: ArrayBuilder) => ArrayBuilder
  >(
    status: Status,
    modifier: Modifier,
  ): OpenApiBuilder<
    U.DeepMerge3<R, Url, Op, Status, ReturnType<Modifier>['_shape']>
  > {
    const built = modifier(new ArrayBuilder());
    const mediaTypeObject: MediaTypeObject = {
      schema: built.schema,
    };
    const responseObject: ResponseObject = {
      content: {
        'application/json': mediaTypeObject,
      },
    };
    this.operationObject.responses[status] = responseObject;
    return this.api as any;
  }
  acceptsQueryParam<K extends 'string' | 'long' | 'double' | 'boolean'>(
    name: string,
    kind: K,
  ) {
    const schema: JsonSchemaElement = {
      type: kind as any /* TODO */,
    };
    const paramObject: ParameterObject = {
      name,
      schema: schema,
      in: 'query',
    };
    if (!this.operationObject.parameters) {
      this.operationObject.parameters = [];
    }
    this.operationObject.parameters.push(paramObject);
    return this;
  }
  respondsWithHeaderValues<S extends StatusCodes>(
    status: S,
    o: {[key: string]: string},
  ) {
    let responseObject = this.operationObject.responses[
      status
    ] as ResponseObject;
    if (responseObject == null) {
      responseObject = this.operationObject.responses[status] = {};
    }
    if (responseObject.headers == null) {
      responseObject.headers = {};
    }
    const headers = Object.keys(o);
    for (let header of headers) {
      responseObject.headers[header] = {
        allowEmptyValue: false,
        example: o[header],
        schema: {type: 'string', enum: [o[header]]},
        required: true,
        style: 'simple',
      };
    }
    return this;
  }
  acceptsHeaderValue<K extends 'string' | 'long' | 'double' | 'boolean'>(
    name: string,
    kind: K,
  ) {
    const schema: JsonSchemaElement = {
      type: kind as any /* TODO */,
    };
    const paramObject: ParameterObject = {
      name,
      schema: schema,
      in: 'header',
    };
    if (!this.operationObject.parameters) {
      this.operationObject.parameters = [];
    }
    this.operationObject.parameters.push(paramObject);
    return this;
  }
  acceptsJsonArray<Modifier extends (o: ArrayBuilder) => ArrayBuilder>(
    builder: Modifier,
  ) {
    const built = builder(new ArrayBuilder());
    const media: MediaTypeObject = {
      schema: built.schema,
    };
    const requestBody: RequestBodyObject = {
      content: {
        'application/json': media,
      },
    };
    this.operationObject.requestBody = requestBody;
    return this;
  }
  acceptsJsonObject<Modifier extends (o: ObjectBuilder) => ObjectBuilder>(
    builder: Modifier,
  ) {
    const built = builder(new ObjectBuilder());
    const media: MediaTypeObject = {
      schema: built.schema,
    };
    const requestBody: RequestBodyObject = {
      content: {
        'application/json': media,
      },
    };
    this.operationObject.requestBody = requestBody;
    return this;
  }
}
