import * as J from './types-for-json-schema';
import { RegisterKind } from 'modifier-wrappers';

export class BoolBuilder {
  _shape: boolean = null as any;
  schema: J.JsonSchemaBool = { type: 'boolean' };
  withDescription(s: string) {
    this.schema.description = s;
    return this;
  }
  withDefault(v: boolean) {
    this.schema.default = v;
    return this;
  }
}

RegisterKind('boolean', BoolBuilder);