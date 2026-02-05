import { Button } from '@/shared/components/ui/button';
import { Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { OtpInput } from './otp-input';

interface VerifyFormProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isVerifying?: boolean;
  error?: string | null;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return email;
  }
  if (local.length <= 2) {
    return `${local}***@${domain}`;
  }
  return `${local.slice(0, 2)}***@${domain}`;
}

export function VerifyForm({ email, onVerify, onResend, isVerifying = false, error = null }: VerifyFormProps) {
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleComplete = useCallback(
    (value: string) => {
      onVerify(value);
    },
    [onVerify],
  );

  const handleVerify = () => {
    if (code.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) {
      return;
    }
    setCooldown(60);
    setCode('');
    onResend();
  };

  return (
    <div className='w-full max-w-sm flex flex-col items-center gap-6 text-center'>
      <div className='w-14 h-14 rounded-full bg-[#296cf2]/10 flex items-center justify-center'>
        <Mail className='w-7 h-7 text-[#296cf2]' />
      </div>

      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold text-[#222]'>Check your email</h1>
        <p className='text-sm text-[#757575]'>We sent a verification code to</p>
        <p className='text-sm font-medium text-[#222]'>{maskEmail(email)}</p>
      </div>

      <div className='flex flex-col gap-2 w-full'>
        <Label className='text-sm text-[#757575]'>Enter verification code</Label>
        <OtpInput value={code} onChange={setCode} onComplete={handleComplete} disabled={isVerifying} error={!!error} />
        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>

      <Button
        disabled={code.length !== 6 || isVerifying}
        className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-sm h-10 rounded w-full disabled:opacity-50'
        onClick={handleVerify}
      >
        {isVerifying ? 'Verifying...' : 'Verify'}
      </Button>

      <p className='text-sm text-[#757575]'>
        Didn&apos;t receive the code?{' '}
        {cooldown > 0 ? (
          <span className='text-[#adadad]'>Resend ({cooldown}s)</span>
        ) : (
          <button type='button' className='text-[#296cf2] hover:underline font-medium' onClick={handleResend}>
            Resend
          </button>
        )}
        {' · '}
        <button type='button' className='text-[#296cf2] hover:underline font-medium'>
          Help
        </button>
      </p>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <p className={className}>{children}</p>;
}
