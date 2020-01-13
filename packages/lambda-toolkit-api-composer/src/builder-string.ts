import * as J from './types-for-json-schema';
import { RegisterKind } from 'modifier-wrappers';

export class StringBuilder {
  _shape: string = null as any;
  schema: J.JsonSchemaString = { type: 'string' };
  withPattern(s: string) {
    this.schema.pattern = s;
    return this;
  }
  withDescription(s: string) {
    this.schema.description = s;
    return this;
  }
  withFormat<S extends J.JsonSchemaString['format']>(s: S) {
    this.schema.format = s;
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

RegisterKind('string', StringBuilder);