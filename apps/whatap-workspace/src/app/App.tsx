import { routeTree } from '@/routeTree.gen';
import { QueryProvider, queryClient } from '@app/providers';
import { useAuth } from '@features/auth';
import { I18nProvider } from '@shared/i18n';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode, useMemo } from 'react';

const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!,
  },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  const context = useMemo(() => ({ queryClient, auth }), [auth]);

  return <RouterProvider router={router} context={context} />;
}

export default function App() {
  return (
    <StrictMode>
      <QueryProvider>
        <I18nProvider>
          <InnerApp />
        </I18nProvider>
      </QueryProvider>
    </StrictMode>
  );
}
