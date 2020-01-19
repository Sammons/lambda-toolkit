import * as M from './type-maps';

export const ModifierWrappers: {
  [K in keyof M.Mutators]: (f: M.Mutators[K]) => ReturnType<M.Mutators[K]>;
} = {} as any;
export const RegisterKind = (kind: string, constructor: any) => {
  (ModifierWrappers as any)[kind] = (f: any) => f(new constructor())
}

import { StringBuilder } from './builder-string';
import { DoubleBuilder } from './builder-double';
import { LongBuilder } from './builder-long';
import { NumberBuilder } from './builder-number';
import { BoolBuilder } from './builder-boolean';
import { ArrayBuilder } from './builder-array';
import { ObjectBuilder } from './builder-object';

export const TypeToBuilderConstructor = {
  string: StringBuilder,
  double: DoubleBuilder,
  long: LongBuilder,
  number: NumberBuilder,
  boolean: BoolBuilder,
  object: ObjectBuilder,
  array: ArrayBuilder,
};
