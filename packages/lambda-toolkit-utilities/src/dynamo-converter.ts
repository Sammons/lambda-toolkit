


type Fundamentals = boolean | string | number | null;

type ConvertFundamental<T> =
  T extends string ? { S: string } :
  T extends number ? { N: string } :
  T extends boolean ? { BOOL: boolean } :
  T extends null ? { NULL: true } : never;

type ConvertArray<T> =
  T extends Array<infer Items>
  ? { L: Convert<Items>[] }
  : never;

type ConvertObject<T> =
  T extends { [key: string]: any }
  ? {
    M: {
      [K in keyof T]: Convert<T[K]>
    }
  }
  : never;

type Convert<T> =
  T extends Fundamentals
  ? ConvertFundamental<T>
  : T extends Array<any> ? ConvertArray<T> : ConvertObject<T>
  ;

export function Dynamoify<T>(item: T): Convert<T> {
  const type = typeof item;
  if (type === 'string') {
    return { S: String(item) } as any;
  }
  if (type === 'bigint' || type === 'number') {
    return { N: String(item) } as any;
  }
  if (type === 'boolean') {
    return { BOOL: Boolean(item) } as any;
  }
  if (item == null) {
    return { NULL: true } as any;
  }
  if (Array.isArray(item)) {
    return { L: item.map(Dynamoify) } as any;
  }
  if (type === 'object') {
    const newobj = {} as { [key: string]: any };
    Object.keys(item).forEach(key => {
      newobj[key] = Dynamoify((item as any)[key]) as any;
    });
    return { M: newobj } as any;
  }
  throw new Error('Unhandled input type ' + type);
}

export function UnDynamoify(item: any): any {
  const keys = Object.keys(item);
  if (keys.length > 0) {
    const kind = keys[0];
    if (['S', 'N', 'BOOL', 'NULL'].includes(kind)) {
      return item[kind]; // note numbers are strings here
    }
    if (kind === 'L') {
      return item[kind].map(UnDynamoify);
    }
    if (kind === 'M') {
      let output = {} as any;
      Object.keys(item[kind]).forEach(key => {
        output[key] = UnDynamoify(item[kind][key]);
      });
    }
    throw new Error(`Unexpected Dynamo Object Shap (kind ${kind})`);
  }
  throw new Error('Unexpected Dynamo Object Shape (no keys)');
}