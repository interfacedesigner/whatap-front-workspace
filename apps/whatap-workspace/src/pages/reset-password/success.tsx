import { ResetSuccessView, useResetPasswordContext } from '@/features/reset-password';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/reset-password/success')({
  component: ResetPasswordSuccessPage,
});

function ResetPasswordSuccessPage() {
  const navigate = useNavigate();
  const { reset } = useResetPasswordContext();

  const handleSignIn = () => {
    reset();
    // TODO: Navigate to login page when available
    navigate({ to: '/' });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <ResetSuccessView onSignIn={handleSignIn} />
    </div>
  );
}
