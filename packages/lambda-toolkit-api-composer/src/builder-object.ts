import * as J from './types-for-json-schema';
import * as M from './type-maps';
import * as U from './type-utilities';
import { ArrayBuilder } from './builder-array';
import { StringBuilder } from './builder-string';
import { DoubleBuilder } from './builder-double';
import { LongBuilder } from './builder-long';
import { BoolBuilder } from './builder-boolean';
import { RegisterKind } from 'modifier-wrappers';

export class ObjectBuilder<R = {}> {
  constructor() { }
  public _shape: R = null as any;
  public schema: J.JsonSchemaObject = { type: 'object' };
  private addKeyToProperties(
    key: string,
    required: boolean,
    schema: J.JsonSchemaElement,
  ) {
    if (!this.schema.properties) {
      this.schema.properties = {};
    }
    this.schema.properties[key] = schema;
    if (required) {
      if (!this.schema.required) {
        this.schema.required = [];
      }
      this.schema.required.push(key);
      this.schema.required.sort();
    }
  }

  withDescription(description: string) {
    this.schema.description = description;
    return this;
  }

  /** String */

  withOptionalString<Key extends string>(
    key: Key,
    modifier?: M.Mutators['string'],
  ): ObjectBuilder<U.MergeOptionalKeyType<R, Key, string>> {
    const b = modifier ? modifier(new StringBuilder()) : new StringBuilder();
    this.addKeyToProperties(key, false, b.schema);
    return this as any;
  }

  withString<Key extends string>(
    key: Key,
    modifier?: M.Mutators['string'],
  ): ObjectBuilder<U.MergeKeyType<R, Key, string>> {
    const b = modifier ? modifier(new StringBuilder()) : new StringBuilder();
    this.addKeyToProperties(key, true, b.schema);
    return this as any;
  }

  /** Double */

  withOptionalDouble<Key extends string>(
    key: Key,
    modifier?: M.Mutators['double'],
  ): ObjectBuilder<U.MergeOptionalKeyType<R, Key, number>> {
    const b = modifier ? modifier(new DoubleBuilder()) : new DoubleBuilder();
    this.addKeyToProperties(key, false, b.schema);
    return this as any;
  }

  withDouble<Key extends string>(
    key: Key,
    modifier?: M.Mutators['double'],
  ): ObjectBuilder<U.MergeKeyType<R, Key, number>> {
    const b = modifier ? modifier(new DoubleBuilder()) : new DoubleBuilder();
    this.addKeyToProperties(key, true, b.schema);
    return this as any;
  }

  /** Long */

  withOptionalLong<Key extends string>(
    key: Key,
    modifier?: M.Mutators['long'],
  ): ObjectBuilder<U.MergeOptionalKeyType<R, Key, number>> {
    const b = modifier ? modifier(new LongBuilder()) : new LongBuilder();
    this.addKeyToProperties(key, false, b.schema);
    return this as any;
  }

  withLong<Key extends string>(
    key: Key,
    modifier?: M.Mutators['long'],
  ): ObjectBuilder<U.MergeKeyType<R, Key, number>> {
    const b = modifier ? modifier(new LongBuilder()) : new LongBuilder();
    this.addKeyToProperties(key, true, b.schema);
    return this as any;
  }

  /** Boolean */

  withOptionalBoolean<Key extends string>(
    key: Key,
    modifier?: M.Mutators['boolean'],
  ): ObjectBuilder<U.MergeOptionalKeyType<R, Key, boolean>> {
    const b = modifier ? modifier(new BoolBuilder()) : new BoolBuilder();
    this.addKeyToProperties(key, false, b.schema);
    return this as any;
  }

  withBoolean<Key extends string>(
    key: Key,
    modifier?: M.Mutators['boolean'],
  ): ObjectBuilder<U.MergeKeyType<R, Key, boolean>> {
    const b = modifier ? modifier(new BoolBuilder()) : new BoolBuilder();
    this.addKeyToProperties(key, false, b.schema);
    return this as any;
  }

  /** Object */

  withObject<
    Key extends string,
    Mod extends (o: ObjectBuilder) => ObjectBuilder
  >(
    key: Key,
    modifier: Mod,
  ): ObjectBuilder<U.MergeKeyType<R, Key, ReturnType<Mod>['_shape']>> {
    const b = modifier ? modifier(new ObjectBuilder()) : new ObjectBuilder();
    this.addKeyToProperties(key, true, b.schema);
    return this as any;
  }

  withOptionalObject<
    Key extends string,
    Mod extends (o: ObjectBuilder) => ObjectBuilder
  >(
    key: Key,
    modifier: Mod,
  ): ObjectBuilder<U.MergeOptionalKeyType<R, Key, ReturnType<Mod>['_shape']>> {
    const b = modifier ? modifier(new ObjectBuilder()) : new ObjectBuilder();
    this.addKeyToProperties(key, false, b.schema);
    return this as any;
  }

  /** Array */
  withArray<
    Key extends string,
    Mod extends (a: ArrayBuilder) => ArrayBuilder<any>
  >(
    key: Key,
    modifier: Mod,
  ): ObjectBuilder<U.MergeKeyType<R, Key, ReturnType<Mod>['_shape']>> {
    this.addKeyToProperties(key, true, modifier(new ArrayBuilder()).schema);
    return this as any;
  }
  withOptionalArray<
    Key extends string,
    Mod extends (a: ArrayBuilder) => ArrayBuilder<any>
  >(
    key: Key,
    modifier: Mod,
  ): ObjectBuilder<U.MergeOptionalKeyType<R, Key, ReturnType<Mod>['_shape']>> {
    this.addKeyToProperties(key, false, modifier(new ArrayBuilder()).schema);
    return this as any;
  }
  withDefault(v: this['_shape']) {
    this.schema.default = v;
    return this;
  }
}

RegisterKind('object', ObjectBuilder);