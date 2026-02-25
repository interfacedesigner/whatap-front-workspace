import { EmailForm, useResetPasswordContext } from '@/features/reset-password';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/reset-password/')({
  component: ResetPasswordEmailPage,
});

function ResetPasswordEmailPage() {
  const navigate = useNavigate();
  const { setEmail, setStep } = useResetPasswordContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (email: string) => {
    setIsLoading(true);
    // TODO: API call to send verification code
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    setEmail(email);
    setStep('verify');
    navigate({ to: '/reset-password/verify' });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <EmailForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
