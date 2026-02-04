import { AuthenticatedLayout } from '@app/layouts';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    // TODO: 임시 주석처리 - 인증 체크 비활성화 (개발용)
    // if (!context.auth.isAuthenticated) {
    //   throw redirect({
    //     to: '/login',
    //     search: { redirect: location.href },
    //   });
    // }
  },
  component: AuthenticatedLayoutRoute,
});

function AuthenticatedLayoutRoute() {
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}
