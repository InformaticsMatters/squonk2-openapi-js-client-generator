import { UseQueryOptions } from '@tanstack/react-query';

export const queryMutator = <T>(args: T): T => {
  if ((args as UseQueryOptions).queryKey) {
    (args as any).queryKey.unshift('ORVAL_API_NAME');
    return args;
  }

  return args;
};

export default queryMutator;
