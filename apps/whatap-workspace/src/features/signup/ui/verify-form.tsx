import { Button } from '@/shared/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Loader2, Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { OtpInput } from './otp-input';

interface VerifyFormProps {
  email: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isVerifying?: boolean;
  error?: string | null;
  isExpired?: boolean;
}

export function VerifyForm({
  email,
  onVerify,
  onResend,
  isVerifying = false,
  error = null,
  isExpired = false,
}: VerifyFormProps) {
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

  // Expired state UI
  if (isExpired) {
    return (
      <div className='w-full flex flex-col items-center gap-6 text-center'>
        {/* Mail icon - Figma: solid navy blue circle (#1E3A8A) with white icon */}
        <div className='w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center'>
          <Mail className='w-6 h-6 text-white' />
        </div>

        {/* Heading */}
        <div className='flex flex-col gap-3'>
          <h1 className='text-2xl font-semibold text-[#222]'>Check your email</h1>
          <p className='text-sm text-[#757575]'>
            We sent a verification code to
            <br />
            <span className='font-semibold text-[#222]'>{email}</span>
          </p>
        </div>

        {/* OTP Input (disabled) */}
        <div className='flex flex-col gap-3 w-full'>
          <label className='text-sm font-medium text-[#222] text-left'>Enter verification code</label>
          <OtpInput value={code} onChange={setCode} disabled={true} error={true} />
          <p className='text-xs text-red-500'>Code expired. Resend to get a new one.</p>
        </div>

        {/* Resend Button */}
        <Button
          className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-sm h-10 rounded-lg w-full'
          onClick={handleResend}
        >
          Resend code
        </Button>

        <p className='text-sm text-[#757575]'>
          Create an account with another E-mail?{' '}
          <Link
            to='/signup'
            search={{ token: undefined, email: undefined }}
            className='text-[#1E3A8A] hover:underline font-medium'
          >
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  // Default state UI
  return (
    <div className='w-full flex flex-col items-center gap-6 text-center'>
      {/* Mail icon - Figma: solid navy blue circle (#1E3A8A) with white icon */}
      <div className='w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center'>
        <Mail className='w-6 h-6 text-white' />
      </div>

      {/* Heading */}
      <div className='flex flex-col gap-3'>
        <h1 className='text-2xl font-semibold text-[#222]'>Check your email</h1>
        <p className='text-sm text-[#757575]'>
          We sent a verification code to
          <br />
          <span className='font-semibold text-[#222]'>{email}</span>
        </p>
      </div>

      {/* OTP Input */}
      <div className='flex flex-col gap-3 w-full'>
        <label className='text-sm font-medium text-[#222] text-left'>Enter verification code</label>
        <OtpInput value={code} onChange={setCode} onComplete={handleComplete} disabled={isVerifying} error={!!error} />
        {error && <p className='text-xs text-red-500'>{error}</p>}
      </div>

      {/* Verify Button */}
      <Button
        disabled={code.length !== 6 || isVerifying}
        className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-sm h-10 rounded-lg w-full disabled:opacity-50'
        onClick={handleVerify}
      >
        {isVerifying ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin mr-2' />
            Verifying
          </>
        ) : (
          'Verify'
        )}
      </Button>

      {/* Resend link */}
      <p className='text-sm text-[#757575]'>
        Didn&apos;t receive the code?{' '}
        {cooldown > 0 ? (
          <span className='text-[#adadad]'>Resend ({cooldown}s)</span>
        ) : (
          <button type='button' className='text-[#1E3A8A] hover:underline font-medium' onClick={handleResend}>
            Resend
          </button>
        )}
      </p>
    </div>
  );
}
