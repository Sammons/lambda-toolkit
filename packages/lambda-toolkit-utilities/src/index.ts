import {LambdaHandler, APISpecifications} from './lambda-handler';

export const StrEnum = <T extends string>(...v: T[]): {[K in T]: K} => {
  const res = {} as any;
  v.forEach(v => (res[v] = v));
  return res;
};

export {LambdaHandler, APISpecifications};
