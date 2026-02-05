import type { RouterContext } from '@app/context';
import { RootLayout } from '@app/layouts';
import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad(ctx) {
    if (ctx.location.pathname == '' || ctx.location.pathname == '/') {
      throw redirect({
        to: '/landing',
      });
    }
  },
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
