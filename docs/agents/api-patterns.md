### API Patterns

```typescript
import { workspaceQueryKeys } from '@shared/api/ws-querykey'

// Query pattern (GET)
const { data: agentsByService } = useSuspenseQuery({
  ...workspaceQueryKeys.getAgentsByService({
    params: {
      wsid,
      serviceName: selectedService ?? '',
    },
  }),
});

// Always wrap in custom hooks
export function useDomainFeatureQuery() {
  return useQuery({
    ...domainQueryKey.feature,
    staleTime: Infinity,
  });
}

// Mutation pattern (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: createApiFn<ResponseType>({
    method: 'post',
    path: '/api/endpoint',
    params: {
      /* data */
    },
  }),
  onError: (err) => {
    // Handle errors with switch statements
  },
});
```
