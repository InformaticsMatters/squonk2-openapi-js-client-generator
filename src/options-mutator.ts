import { type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";

export const queryMutator = <TQueryFnData, TError, TData>({
  queryKey,
  ...queryOptions
}: UseQueryOptions<TQueryFnData, TError, TData>): UseQueryOptions<TQueryFnData, TError, TData> => {
  const newQueryKey = ["API_TARGET_NAME", ...queryKey];
  return { queryKey: newQueryKey, ...queryOptions };
};

export const mutationMutator = <TData, TError, TVariables, TContext>({
  mutationKey,
  ...mutationOptions
}: UseMutationOptions<TData, TError, TVariables, TContext>): UseMutationOptions<
  TData,
  TError,
  TVariables,
  TContext
> => {
  if (Array.isArray(mutationKey)) {
    const newMutationKey = ["API_TARGET_NAME", ...mutationKey];
    return { mutationKey: newMutationKey, ...mutationOptions };
  }
  return { mutationKey: undefined, ...mutationOptions };
};

export default queryMutator;
