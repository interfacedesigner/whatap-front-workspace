import type { AuthState } from '@features/auth';
import type { QueryClient } from '@tanstack/react-query';

export interface RouterContext {
  queryClient: QueryClient;
  auth: AuthState;
}
