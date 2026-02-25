import { VerifyForm, VerifyingOverlay, useSignupScenario } from '@/features/signup';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';

// OTP 만료 시간 (5분)
const OTP_EXPIRATION_TIME = 5 * 60 * 1000;

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
  const [isExpired, setIsExpired] = useState(false);
  const [expirationKey, setExpirationKey] = useState(0);

  // OTP 만료 타이머
  useEffect(() => {
    setIsExpired(false);

    const expirationTimer = setTimeout(() => {
      setIsExpired(true);
    }, OTP_EXPIRATION_TIME);

    return () => clearTimeout(expirationTimer);
  }, [expirationKey]);

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
    setIsExpired(false);
    // 만료 타이머 리셋을 위해 key 변경
    setExpirationKey((prev) => prev + 1);
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <div className='w-full max-w-[480px] bg-white rounded-lg shadow-lg p-10'>
        <VerifyForm
          email={email}
          onVerify={handleVerify}
          onResend={handleResend}
          isVerifying={isVerifying}
          error={error}
          isExpired={isExpired}
        />
      </div>
      {showOverlay && <VerifyingOverlay />}
    </div>
  );
}
