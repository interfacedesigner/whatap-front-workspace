import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Link } from '@tanstack/react-router';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

import { Divider } from './divider';
import { GoogleOAuthButton } from './google-oauth-button';

// Placeholder routes for terms/privacy/signin - update when actual routes are created
const TERMS_URL = '#';
const PRIVACY_URL = '#';
const SIGNIN_ROUTE = '/login' as const;

export interface SignupFormProps {
  invitedEmail?: string | undefined;
  onSubmit: (email: string, password: string) => void;
  isLoading?: boolean;
}

function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Please enter your email.';
  }
  if (/\s/.test(trimmed)) {
    return 'Invalid email format. e.g. name@company.com';
  }

  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    return 'Invalid email format. e.g. name@company.com';
  }

  const [local, domain] = trimmed.split('@');
  if (!local || !domain) {
    return 'Invalid email format. e.g. name@company.com';
  }
  if (local.length > 64) {
    return 'Invalid email format. e.g. name@company.com';
  }
  if (trimmed.length > 254) {
    return 'Invalid email format. e.g. name@company.com';
  }
  if (/\.\./.test(domain)) {
    return 'Invalid email format. e.g. name@company.com';
  }
  if (!domain.includes('.')) {
    return 'Invalid email format. e.g. name@company.com';
  }

  return null;
}

function validatePassword(password: string): string | null {
  if (!password) {
    return 'Please enter your password.';
  }
  if (password.length < 10) {
    return 'Password must be at least 10 characters.';
  }
  if (password.length > 20) {
    return 'Password must be 20 characters or less.';
  }
  return null;
}

export function SignupForm({ invitedEmail, onSubmit, isLoading = false }: SignupFormProps) {
  const isInvited = !!invitedEmail;

  const [email, setEmail] = useState(invitedEmail || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const isEmailValid = validateEmail(email) === null;
  const isPasswordValid = validatePassword(password) === null;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setTouched({ email: true, password: true });

    if (!eErr && !pErr) {
      onSubmit(email.trim(), password);
    }
  };

  return (
    <div className='w-full max-w-sm flex flex-col gap-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-[#222]'>Sign up</h1>
        <p className='text-sm text-[#757575] mt-1'>Create an account to get started</p>
      </div>

      {!isInvited && (
        <>
          <GoogleOAuthButton />
          <Divider />
        </>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='you@company.com'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) {
                setEmailError(validateEmail(e.target.value));
              }
            }}
            onBlur={handleEmailBlur}
            readOnly={isInvited}
            className={
              touched.email && emailError
                ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                : ''
            }
          />
          {touched.email && emailError && <p className='text-xs text-red-500'>{emailError}</p>}
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='password'>Password</Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Enter password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  setPasswordError(validatePassword(e.target.value));
                }
              }}
              onBlur={handlePasswordBlur}
              className={
                touched.password && passwordError
                  ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20 pr-10'
                  : 'pr-10'
              }
            />
            <button
              type='button'
              className='absolute right-2.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#222]'
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            </button>
          </div>
          {touched.password && passwordError && <p className='text-xs text-red-500'>{passwordError}</p>}
        </div>

        <Button
          type='submit'
          disabled={!isFormValid || isLoading}
          className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-sm h-10 rounded w-full disabled:opacity-50'
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>

      <p className='text-xs text-[#757575] text-center leading-relaxed'>
        By clicking &quot;Sign up&quot;, you agree to the{' '}
        <a href={TERMS_URL} className='text-[#296cf2] hover:underline'>
          Terms of Service
        </a>{' '}
        and acknowledge the{' '}
        <a href={PRIVACY_URL} className='text-[#296cf2] hover:underline'>
          Privacy Policy
        </a>
        .
      </p>

      <p className='text-sm text-[#757575] text-center'>
        Already have an account?{' '}
        <Link to={SIGNIN_ROUTE} className='text-[#296cf2] hover:underline font-medium'>
          Sign in
        </Link>
      </p>
    </div>
  );
}
