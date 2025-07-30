/** Based off the example custom-instance from Orval docs
 * https://github.com/anymaniax/orval/blob/master/samples/react-app-with-react-query/src/api/mutator/custom-instance.ts
 *
 * See https://react-query.tanstack.com/guides/query-cancellation
 *
 * TODO: Considering using Fetch-API instead of axios. This instance will have to change. Could be
 * achieved without changing much using `redaxios`
 * Or use 'ky'
 */

import Axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create();

/**
 * Set the access token to be added as the `Authorization: Bearer 'token'` header
 * Useful for client only apps where a proxy API route isn't involved to securely add the access token
 * @param token access token
 */
export const setAuthToken = (token: string) => {
  AXIOS_INSTANCE.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Set the url to which request paths are added to.
 * @param baseUrl origin + subpath e.g. 'https://example.com/subpath' or '/subpath'
 */
export const setBaseUrl = (baseUrl: string) => {
  AXIOS_INSTANCE.defaults.baseURL = baseUrl;
};

export const customInstance = <TReturn>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<TReturn> => {
  const source = Axios.CancelToken.source();

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error need to add a cancel method to the promise
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export type ErrorType<TError> = AxiosError<TError>;
