import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/components/ui/input-otp';
import { cn } from '@/shared/lib/utils';
import { Mail } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface VerifyCodeFormProps {
  maskedEmail: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  isVerifying?: boolean;
  error?: string | null;
  isExpired?: boolean;
}

export function VerifyCodeForm({
  maskedEmail,
  onVerify,
  onResend,
  isVerifying = false,
  error = null,
  isExpired = false,
}: VerifyCodeFormProps) {
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
      if (!isExpired) {
        onVerify(value);
      }
    },
    [onVerify, isExpired],
  );

  const handleVerify = () => {
    if (code.length === 6 && !isExpired) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    if (cooldown > 0 && !isExpired) {
      return;
    }
    setCooldown(60);
    setCode('');
    onResend();
  };

  const hasError = !!error || isExpired;

  return (
    <Card className='w-full max-w-[480px] shadow-lg'>
      <CardContent className='flex flex-col items-center gap-6 pt-10 pb-10 px-10'>
        {/* Icon */}
        <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center'>
          <Mail className='w-6 h-6 text-primary' />
        </div>

        {/* Header */}
        <div className='flex flex-col gap-3 text-center'>
          <h1 className='text-2xl font-semibold text-foreground'>Check your email</h1>
          <div>
            <p className='text-sm text-muted-foreground'>We sent a verification code to</p>
            <p className='text-sm font-semibold text-foreground'>{maskedEmail}</p>
          </div>
        </div>

        {/* OTP Input */}
        <div className='flex flex-col gap-3 w-full items-center'>
          <p className='text-sm text-foreground'>Enter verification code</p>
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            disabled={isVerifying}
            aria-invalid={hasError}
          >
            <InputOTPGroup className={cn(hasError && 'border-destructive')}>
              <InputOTPSlot index={0} aria-invalid={hasError} />
              <InputOTPSlot index={1} aria-invalid={hasError} />
              <InputOTPSlot index={2} aria-invalid={hasError} />
              <InputOTPSlot index={3} aria-invalid={hasError} />
              <InputOTPSlot index={4} aria-invalid={hasError} />
              <InputOTPSlot index={5} aria-invalid={hasError} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className='text-sm text-destructive'>{error}</p>}
          {isExpired && <p className='text-sm text-destructive'>Code expired. Resend to get a new one.</p>}
        </div>

        {/* Action Button */}
        {isExpired ? (
          <Button onClick={handleResend} className='w-full'>
            Resend code
          </Button>
        ) : (
          <Button onClick={handleVerify} disabled={code.length !== 6 || isVerifying} className='w-full'>
            {isVerifying ? 'Verifying...' : 'Verify'}
          </Button>
        )}

        {/* Resend Link */}
        <p className='text-sm text-muted-foreground'>
          {isExpired ? (
            <>
              Create an account with another E-mail?{' '}
              <button type='button' className='text-primary hover:underline font-medium'>
                Sign up
              </button>
            </>
          ) : (
            <>
              Didn&apos;t receive the code?{' '}
              {cooldown > 0 ? (
                <span className='text-muted-foreground/60'>Resend ({cooldown}s)</span>
              ) : (
                <button type='button' className='text-primary hover:underline font-medium' onClick={handleResend}>
                  Resend
                </button>
              )}
            </>
          )}
        </p>
      </CardContent>
    </Card>
  );
}
