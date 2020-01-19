import { StringBuilder } from './builder-string';
import { DoubleBuilder } from './builder-double';
import { LongBuilder } from './builder-long';
import { BoolBuilder } from './builder-boolean';
import { ArrayBuilder } from './builder-array';
import { ObjectBuilder } from './builder-object';
import { NumberBuilder } from './builder-number';

export type Mutators = {
  string: (s: StringBuilder) => StringBuilder;
  double: (d: DoubleBuilder) => DoubleBuilder;
  long: (l: LongBuilder) => LongBuilder;
  number: (n: NumberBuilder) => NumberBuilder;
  boolean: (b: BoolBuilder) => BoolBuilder;
  array: (a: ArrayBuilder<any>) => ArrayBuilder<any>;
  object: (o: ObjectBuilder) => ObjectBuilder;
};
