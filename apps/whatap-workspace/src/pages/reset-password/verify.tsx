import { VerifyCodeForm, useResetPasswordContext } from '@/features/reset-password';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

export const Route = createFileRoute('/reset-password/verify')({
  component: ResetPasswordVerifyPage,
});

function ResetPasswordVerifyPage() {
  const navigate = useNavigate();
  const { maskedEmail, setStep } = useResetPasswordContext();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const handleVerify = useCallback(
    async (_code: string) => {
      setError(null);
      setIsVerifying(true);

      // TODO: API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Simulate verification success
      setIsVerifying(false);
      setStep('new-password');
      navigate({ to: '/reset-password/new-password' });
    },
    [navigate, setStep],
  );

  const handleResend = useCallback(() => {
    // TODO: API call to resend verification code
    setError(null);
    setIsExpired(false);
  }, []);

  // Redirect to email step if no email is set
  if (!maskedEmail) {
    navigate({ to: '/reset-password' });
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <VerifyCodeForm
        maskedEmail={maskedEmail}
        onVerify={handleVerify}
        onResend={handleResend}
        isVerifying={isVerifying}
        error={error}
        isExpired={isExpired}
      />
    </div>
  );
}
