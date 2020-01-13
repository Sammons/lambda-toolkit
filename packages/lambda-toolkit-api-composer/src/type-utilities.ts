export type MergeKeyType<Original, Key extends string, Type> = Original &
  {[K in Key]: Type};
export type MergeOptionalKeyType<
  Original,
  Key extends string,
  Type
> = Original & {[K in Key]?: Type};

export type DeepMerge3<
  Target,
  Url extends string | number,
  Method extends string | number,
  Status extends string | number,
  Shape
> = Url extends keyof Target
  ? Method extends keyof Target[Url]
    ? Omit<Target, Url> &
        {
          [U in Url]: Omit<Target[U], Method> &
            {
              [M in Method]: {
                [S in keyof Target[U][M] | Status]: S extends keyof Target[U][M]
                  ? Target[U][M][S]
                  : Shape;
              };
            };
        }
    : Omit<Target, Url> &
        {[U in Url]: Target[U] & {[M in Method]: {[S in Status]: Shape}}}
  : Target & {[U in Url]: {[M in Method]: {[S in Status]: Shape}}};
