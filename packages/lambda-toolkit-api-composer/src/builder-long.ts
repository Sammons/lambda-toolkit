import * as J from './types-for-json-schema';
import { RegisterKind } from 'modifier-wrappers';

export class LongBuilder {
  _shape: number = null as any;
  schema: J.JsonSchemaLong = { type: 'long' };
  withDescription(s: string) {
    this.schema.description = s;
    return this;
  }
  withMin<S extends J.JsonSchemaLong['minimum']>(s: S) {
    this.schema.minimum = s;
    return this;
  }
  withMax<S extends J.JsonSchemaLong['maximum']>(s: S) {
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

RegisterKind('long', LongBuilder);