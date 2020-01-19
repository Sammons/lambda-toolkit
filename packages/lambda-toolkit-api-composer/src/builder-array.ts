import * as M from './type-maps';
import * as J from './types-for-json-schema';
import { ModifierWrappers, TypeToBuilderConstructor, RegisterKind } from './modifier-wrappers';

type ArrayZeroIfArray<T> = T extends Array<infer K> ? K : T;

export class ArrayBuilder<R = never> {
  _shape: R[] = null as any;
  schema: J.JsonSchemaArray = {
    type: 'array',
    items: { type: 'string' },
  };

  withItemType<
    Type extends keyof M.Mutators,
    Mod extends M.Mutators[Type]
  >(
    type: Type,
    modifier?: Mod,
  ): ArrayBuilder<
    Mod extends never
    ? ArrayZeroIfArray<ReturnType<typeof ModifierWrappers[Type]>['_shape']>
    : ArrayZeroIfArray<ReturnType<Mod>['_shape']>
  > {
    const b = modifier
      ? ModifierWrappers[type](modifier as any /** TODO */)
      : new (TypeToBuilderConstructor[type] as any)(/** TODO */);
    this.schema.items = b.schema;
    return this as any;
  }

  withDescription(description: string) {
    this.schema.description = description;
    return this;
  }

  withMaxItems(max: number) {
    this.schema.maxItems = max;
    return this;
  }

  withMinItems(min: number) {
    this.schema.minItems = min;
    return this;
  }

  andIsNullable() {
    this.schema.nullable = true;
    return this;
  }

  withDefault(v: R[]) {
    this.schema.default = v;
    return this;
  }
}

export type ExtractShapeFromArrayBuilder<
  A extends ArrayBuilder<any>
  > = A extends ArrayBuilder<infer Items> ? Items[] : never;

RegisterKind('array', ArrayBuilder);