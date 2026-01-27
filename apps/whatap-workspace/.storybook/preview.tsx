import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryRouter } from '@tanstack/react-router';
import { type ReactNode, useState } from 'react';

import { I18nProvider, type Locales } from '../src/fsd/6_shared/i18n';
import '../src/index.css';
import './preview.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

interface DecoratorProps {
  children: ReactNode;
}

function Decorator({ children }: DecoratorProps) {
  const [locale, setLocale] = useState<Locales>('ko');

  return (
    <div className='storybook-wrapper'>
      <div className='storybook-toolbar'>
        <strong>언어</strong>
        {(['ko', 'en'] as const).map((key) => (
          <button
            key={key}
            type='button'
            className={`storybook-button ${key === locale ? 'storybook-button--selected' : ''}`}
            onClick={() => setLocale(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className='storybook-content'>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </div>
    </div>
  );
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      const router = createMemoryRouter({
        routeTree: {
          id: '__root__',
          children: [
            {
              id: '/',
              path: '/',
              component: () => (
                <Decorator>
                  <Story />
                </Decorator>
              ),
            },
          ],
        } as any,
      });

      return (
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
