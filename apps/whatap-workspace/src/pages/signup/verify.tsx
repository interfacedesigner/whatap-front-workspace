import { VerifyForm, VerifyingOverlay, useSignupScenario } from '@/features/signup';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useState } from 'react';

export const Route = createFileRoute('/signup/verify')({
  component: VerifyPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || undefined,
    };
  },
});

function VerifyPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/signup/verify' });
  const scenario = useSignupScenario();
  const email = searchParams.email || 'you@company.com';

  const [isVerifying, setIsVerifying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = useCallback(
    async (_code: string) => {
      setError(null);
      setIsVerifying(true);

      // TODO: API call to verify OTP
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsVerifying(false);
      setShowOverlay(true);

      // Simulate transition delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Route based on scenario type
      if (scenario.type === 'invited-multi') {
        navigate({ to: '/signup/workspace-select' });
      } else {
        navigate({ to: '/signup/success' });
      }
    },
    [navigate, scenario.type],
  );

  const handleResend = useCallback(() => {
    // TODO: API call to resend verification code
    setError(null);
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <VerifyForm
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        isVerifying={isVerifying}
        error={error}
      />
      {showOverlay && <VerifyingOverlay />}
    </div>
  );
}
