import { QueryProvider, queryClient } from '@app/providers';
import { useAuth } from '@features/auth';
import { routeTree } from '@pages/routeTree.gen';
import { I18nProvider } from '@shared/i18n';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

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

  return <RouterProvider router={router} context={{ queryClient, auth }} />;
}

function App() {
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

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<App />);
