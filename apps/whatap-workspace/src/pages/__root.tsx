import type { RouterContext } from '@app/context';
import { RootLayout } from '@app/layouts';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootLayout>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
    </RootLayout>
  );
}
