import { NewPasswordForm, useResetPasswordContext } from '@/features/reset-password';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/reset-password/new-password')({
  component: ResetPasswordNewPasswordPage,
});

function ResetPasswordNewPasswordPage() {
  const navigate = useNavigate();
  const { email, setStep } = useResetPasswordContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (_password: string) => {
    setIsLoading(true);
    // TODO: API call to reset password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    setStep('success');
    navigate({ to: '/reset-password/success' });
  };

  // Redirect to email step if no email is set
  if (!email) {
    navigate({ to: '/reset-password' });
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
