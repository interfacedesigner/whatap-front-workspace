import { SignupProvider } from '@/features/signup';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  component: SignupLayout,
});

function SignupLayout() {
  return (
    <SignupProvider>
      <Outlet />
    </SignupProvider>
  );
}
