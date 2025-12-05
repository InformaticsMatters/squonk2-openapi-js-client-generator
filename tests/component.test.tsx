/**
 * Type-safe React component tests
 * Verifies type safety of using generated hooks in actual React components
 */

import { useGetJobs, useGetJob } from '../src/api/job/job';
import type { GetJobsParams } from '../src/api/api-schemas';

// Test 1: Basic component with query
export function JobListComponent() {
  const { data, isLoading, error } = useGetJobs(undefined, {
    query: {
      enabled: true,
      staleTime: 5000,
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;
  if (!data) return null;

  return (
    <ul>
      {data.jobs.map((job) => (
        <li key={job.id}>{job.name}</li>
      ))}
    </ul>
  );
}

// Test 2: Component with transformed data using select
export function JobIdsComponent() {
  const { data: jobIds } = useGetJobs(undefined, {
    query: {
      select: (response) => response.jobs.map((j) => j.id),
    },
  });

  return (
    <div>
      {jobIds?.map((id) => (
        <div key={id}>Job ID: {id}</div>
      ))}
    </div>
  );
}

// Test 3: Component with parameters
export function JobDetailComponent({ jobId }: { jobId: number }) {
  const { data: job } = useGetJob(jobId, undefined, {
    query: {
      enabled: jobId > 0,
    },
  });

  return <div>{job?.name}</div>;
}

// Test 4: Component with conditional query
export function ConditionalJobComponent({ shouldFetch, jobId }: { shouldFetch: boolean; jobId: number }) {
  const { data, isFetching } = useGetJob(jobId, undefined, {
    query: {
      enabled: shouldFetch,
      refetchOnWindowFocus: false,
    },
  });

  if (!shouldFetch) return <div>Fetch disabled</div>;
  if (isFetching) return <div>Fetching...</div>;

  return <div>{data?.name}</div>;
}

// Test 5: Component with custom queryKey
export function CustomQueryKeyComponent() {
  const customKey = ['jobs', 'custom', 'key'];

  const { data } = useGetJobs(undefined, {
    query: {
      queryKey: customKey,
    },
  });

  return <div>{data?.count} jobs</div>;
}

// Test 6 (mutation tests removed - job endpoints are read-only)

// Test 7: Component with multiple queries
export function MultipleQueriesComponent({ jobId }: { jobId: number }) {
  const { data: jobs } = useGetJobs(undefined, {
    query: { staleTime: 10000 },
  });

  const { data: specificJob } = useGetJob(jobId, undefined, {
    query: { enabled: jobId > 0 },
  });

  return (
    <div>
      <div>Total jobs: {jobs?.count}</div>
      <div>Current job: {specificJob?.name}</div>
    </div>
  );
}

// Test 8: Component with query params
export function FilteredJobsComponent({ projectId }: { projectId?: string }) {
  const params: GetJobsParams | undefined = projectId
    ? {
        project_id: projectId,
      }
    : undefined;

  const { data } = useGetJobs(params, {
    query: {
      enabled: Boolean(projectId),
    },
  });

  return <div>{data?.jobs.length} filtered jobs</div>;
}

// Test 9: Component with complex select transformation
export function TransformedJobDataComponent() {
  const { data: transformedData } = useGetJobs(undefined, {
    query: {
      select: (response) => ({
        totalCount: response.count,
        jobNames: response.jobs.map((j) => j.name),
        firstJob: response.jobs[0],
      }),
    },
  });

  return (
    <div>
      <div>Total: {transformedData?.totalCount}</div>
      <div>Names: {transformedData?.jobNames.join(', ')}</div>
      <div>First: {transformedData?.firstJob?.name}</div>
    </div>
  );
}

// Test 10 (mutation tests removed - job endpoints are read-only)

// Test 11: Component with error handling
export function ErrorHandlingComponent() {
  const { data, isLoading, isError, error, refetch } = useGetJobs(undefined, {
    query: {
      retry: 2,
      retryDelay: 1000,
    },
  });

  if (isLoading) {
    return <div>Loading jobs...</div>;
  }

  if (isError) {
    return (
      <div>
        <div>Error occurred: {JSON.stringify(error)}</div>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return <div>Loaded {data?.count} jobs</div>;
}

// Test 12: Component with dependent queries
export function DependentQueriesComponent() {
  const { data: jobs } = useGetJobs(undefined, {
    query: { staleTime: 5000 },
  });

  const firstJobId = jobs?.jobs[0]?.id;

  const { data: firstJob } = useGetJob(firstJobId ?? 0, undefined, {
    query: {
      enabled: Boolean(firstJobId),
    },
  });

  return (
    <div>
      {jobs && <div>First job: {firstJob?.name}</div>}
    </div>
  );
}
