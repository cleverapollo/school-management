// @ts-expect-error
export type UseQueryReturnType<T> = NonNullable<ReturnType<T>['data']>;
