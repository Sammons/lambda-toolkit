import * as J from './types-for-json-schema';
import { ObjectBuilder } from 'index';
import { RegisterKind } from 'modifier-wrappers';

export class DoubleBuilder {
  _shape: number = null as any;
  schema: J.JsonSchemaDouble = { type: 'double' };
  withDescription(s: string) {
    this.schema.description = s;
    return this;
  }
  withMin<S extends J.JsonSchemaDouble['minimum']>(s: S) {
    this.schema.minimum = s;
    return this;
  }
  withMax<S extends J.JsonSchemaDouble['maximum']>(s: S) {
    this.schema.maximum = s;
    return this;
  }
  withDefault(v: this['_shape']) {
    this.schema.default = v;
    return this;
  }
  withEnum(...values: this['_shape'][]) {
    this.schema.enum = values;
    return this;
  }
}

RegisterKind('object', ObjectBuilder);