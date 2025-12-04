// Custom fetch instance with runtime base URL configuration
// Based on Orval docs: https://orval.dev/guides/custom-client

let baseURL = "";

/**
 * Set the base URL for all fetch requests
 * @param url - The base URL to use for all API calls
 */
export const setBaseURL = (url: string) => {
  baseURL = url.replace(/\/$/, ""); // Remove trailing slash
};

/**
 * Get the current base URL
 */
export const getBaseURL = () => baseURL;

/**
 * Custom fetch wrapper that prepends the base URL
 * Compatible with Orval's generated RequestInit spreading
 */
export const customFetch = async <T>(
  url: string,
  options?: RequestInit & { params?: Record<string, unknown> },
): Promise<T> => {
  const { params, ...requestInit } = options ?? {};

  let targetUrl = `${baseURL}${url}`;

  if (params) {
    targetUrl += "?" + new URLSearchParams(params as Record<string, string>);
  }

  // If body exists and is an object, stringify it
  const processedBody =
    requestInit.body && typeof requestInit.body === "object"
      ? JSON.stringify(requestInit.body)
      : requestInit.body;

  const response = await fetch(targetUrl, {
    ...requestInit,
    body: processedBody,
    headers: { "Content-Type": "application/json", ...requestInit.headers },
  });

  if (!response.ok) {
    throw response;
  }

  // Handle empty responses
  if ([204, 205, 304].includes(response.status)) {
    return {} as T;
  }

  return response.json();
};

export type ErrorType<Error> = Error;
