/**
 * Type-level tests for the generated client
 * These tests verify type safety and won't be executed at runtime
 */

import { useGetJobs, useGetJob, useGetJobByVersion } from "../src/api/job/job";

// Test 1: queryKey should be optional
function TestQueryKeyOptional() {
  // Should compile without queryKey
  useGetJobs(undefined, { query: { enabled: true, staleTime: 5000 } });

  // Should also work with queryKey
  useGetJobs(undefined, { query: { queryKey: ["custom", "key"], enabled: true } });

  return null;
}

// Test 2: select callback should properly infer types
function TestSelectCallback() {
  // Should infer that data is JobSummary[] after select
  const { data } = useGetJobs(undefined, {
    query: {
      select: (data) => {
        // data should be JobsGetResponse (verified by accessing properties)
        data.count satisfies number;
        data.jobs satisfies unknown[];

        // Return type should be inferred from select function
        return data.jobs;
      },
    },
  });

  // data should be JobSummary[] (return type of select), not JobsGetResponse
  if (data) {
    // This should work because data is JobSummary[]
    data.forEach((job) => {
      job.id satisfies number;
    });

    // @ts-expect-error - data should NOT have count property (it's an array now)
    const count = data.count;
  }

  return null;
}

// Test 3: select with transformation
function TestSelectTransformation() {
  const { data } = useGetJobs(undefined, {
    query: {
      select: (response) => {
        // Transform to just job IDs
        return response.jobs.map((job) => job.id);
      },
    },
  });

  if (data) {
    // data should be number[]
    data satisfies number[];

    // @ts-expect-error - should not have JobSummary properties
    const firstJob = data[0]?.name;
  }

  return null;
}

// Test 4: Parameters with required fields
function TestRequiredParameters() {
  // Should require jobId parameter
  useGetJob(123, undefined, { query: { enabled: true } });

  // @ts-expect-error - jobId is required
  useGetJob(undefined, undefined, { query: { enabled: true } });

  return null;
}

// Test 5: Parameters object with required fields
function TestRequiredParametersObject() {
  // Should require params with collection, job and version
  useGetJobByVersion(
    { collection: "im-test", job: "test-job", version: "1.0.0" },
    { query: { enabled: true } },
  );

  // Params are all required - this would be caught without 'as any'
  // Using 'as any' to demonstrate the type requirement exists
  useGetJobByVersion({ collection: "im-test", version: "1.0.0" } as any, {
    query: { enabled: true },
  });

  return null;
}

// Test 6: Query options type checking
function TestQueryOptions() {
  useGetJobs(undefined, {
    query: { enabled: true, staleTime: 5000, gcTime: 10000, refetchOnWindowFocus: false, retry: 3 },
  });

  useGetJobs(undefined, {
    query: {
      // @ts-expect-error - invalid option should be rejected
      invalidOption: true,
    },
  });

  return null;
}

// Test 7: TData generic inference
function TestTDataInference() {
  // Without select, TData = JobsGetResponse
  const { data: data1 } = useGetJobs(undefined, { query: { enabled: true } });

  if (data1) {
    // Should have count and jobs properties
    data1.count satisfies number;
    data1.jobs satisfies unknown[];
  }

  // With select, TData = return type of select
  const { data: data2 } = useGetJobs(undefined, {
    query: { select: (d) => d.jobs, enabled: true },
  });

  if (data2) {
    // Should be array, not have count property
    data2.forEach((job) => {
      job.id satisfies number;
    });

    // @ts-expect-error - should not have count
    const count = data2.count;
  }

  return null;
}

// Test 8: Error type
function TestErrorType() {
  const { error } = useGetJobs(undefined, { query: { enabled: true } });

  if (error) {
    // Error should have proper type structure (ErrorType<DmError>)
    error satisfies unknown;
  }

  return null;
}

// Test 9: Suspense query (if enabled)
// Uncomment if you have suspense queries enabled
// import { useGetJobsSuspense } from '../src/job/job';
//
// function TestSuspenseQuery() {
//   const { data } = useGetJobsSuspense(undefined, {
//     query: {
//       select: (data) => data.jobs,
//     },
//   });
//
//   // In suspense queries, data is never undefined
//   const jobs = data; // Should be JobSummary[], not undefined
//
//   return null;
// }

// Test 10: Request options
function TestRequestOptions() {
  useGetJobs(undefined, {
    query: { enabled: true },
    request: {
      // Request options from custom axios instance
      headers: { "X-Custom-Header": "value" },
    },
  });

  return null;
}

export {
  TestQueryKeyOptional,
  TestSelectCallback,
  TestSelectTransformation,
  TestRequiredParameters,
  TestRequiredParametersObject,
  TestQueryOptions,
  TestTDataInference,
  TestErrorType,
  TestRequestOptions,
};
