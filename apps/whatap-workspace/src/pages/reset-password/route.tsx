import { ResetPasswordProvider } from '@/features/reset-password';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordLayout,
});

function ResetPasswordLayout() {
  return (
    <ResetPasswordProvider>
      <Outlet />
    </ResetPasswordProvider>
  );
}
