import {
  OpenAPI,
  Operations,
  OperationObject,
  PathItemObject,
} from './types-for-open-api';
import {OperationBuilder} from './operation-builder';

export class OpenApiBuilder<R = {}> {
  _shape: R = undefined as any;

  constructor(private title: string) {}

  definition: OpenAPI = {
    openapi: '3.0.0',
    info: {
      title: this.title,
      version: '1.0.0',
    },
    paths: {},
  };

  addJsonEndpoint<Op extends Operations, Url extends string>(
    method: Op,
    url: Url,
  ) {
    if (this.definition.paths[url] == null) {
      this.definition.paths[url] = {};
    }
    const pathItemObject: PathItemObject = this.definition.paths[url] ?? {};
    const operationObject: OperationObject = pathItemObject[method] ?? {
      responses: {},
    };
    this.definition.paths[url][method] = operationObject;

    return new OperationBuilder<R, Url, Op>(operationObject, this);
  }
  setApiVersion(v: string) {
    this.definition.info.version = v;
    return this;
  }
}

new OpenApiBuilder('test')
  .addJsonEndpoint('get', '/one')
  .acceptsQueryParam('id', 'string')
  .respondsWithObject(200, b => b);
