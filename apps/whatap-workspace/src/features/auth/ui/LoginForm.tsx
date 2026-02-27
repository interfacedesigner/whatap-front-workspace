import { Button } from '@/shared/components/ui/button';
import { Divider } from '@/shared/components/ui/divider';
import { GoogleOAuthButton } from '@/shared/components/ui/google-oauth-button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useState } from 'react';

import { type LoginCredentials, loginApi } from '../api';
import { useAuth } from '../model';

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
  if (!domain.includes('.')) {
    return 'Invalid email format. e.g. name@company.com';
  }

  return null;
}

function validatePassword(password: string): string | null {
  if (!password) {
    return 'Please enter your password.';
  }
  return null;
}

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      login(data.user);

      // 온보딩 계정은 항상 새로운 온보딩으로 이동
      // localStorage 초기화 + 하드 네비게이션으로 Jotai 메모리도 리셋
      if (!data.workspaceId) {
        const storagePrefix = 'opsgent_onboarding_';
        const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith(storagePrefix));
        for (const key of keysToRemove) {
          localStorage.removeItem(key);
        }
        window.location.href = '/onboarding';
        return;
      }

      // 기존 회원(workspaceId 보유)은 Overview로
      navigate({
        to: '/ws/$wsid',
        params: { wsid: data.workspaceId },
      });
    },
    onError: (error) => {
      // API 에러 시 패스워드 필드에 에러 표시
      setPasswordError(error.message || 'Login failed. Please check your credentials.');
    },
  });

  const isEmailValid = validateEmail(credentials.email) === null;
  const isPasswordValid = validatePassword(credentials.password) === null;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    setEmailError(validateEmail(credentials.email));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    setPasswordError(validatePassword(credentials.password));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const eErr = validateEmail(credentials.email);
    const pErr = validatePassword(credentials.password);
    setEmailError(eErr);
    setPasswordError(pErr);
    setTouched({ email: true, password: true });

    if (!eErr && !pErr) {
      loginMutation.mutate(credentials);
    }
  };

  const handleGoogleLogin = async () => {
    // Mock Google OAuth flow for development
    // In production, this would redirect to Google's OAuth consent screen
    setTouched({ email: false, password: false });
    setEmailError(null);
    setPasswordError(null);

    // Simulate OAuth loading state
    loginMutation.mutate({
      email: 'google-user@gmail.com',
      password: 'google-oauth-mock',
    });
  };

  return (
    <div className='w-full flex flex-col gap-5'>
      {/* Google OAuth */}
      <GoogleOAuthButton onClick={handleGoogleLogin} isLoading={loginMutation.isPending} />

      {/* Divider */}
      <Divider text='or sign in with email' />

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          {/* Email Field */}
          <div className='flex flex-col gap-1'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Input
                id='email'
                type='email'
                placeholder='you@company.com'
                value={credentials.email}
                onChange={(e) => {
                  setCredentials((prev) => ({ ...prev, email: e.target.value }));
                  if (touched.email) {
                    setEmailError(validateEmail(e.target.value));
                  }
                }}
                onBlur={handleEmailBlur}
                className={`pl-10 ${
                  touched.email && emailError
                    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                    : ''
                }`}
              />
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]' />
            </div>
            {touched.email && emailError && <p className='text-xs text-red-500'>{emailError}</p>}
          </div>

          {/* Password Field */}
          <div className='flex flex-col gap-1'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                value={credentials.password}
                onChange={(e) => {
                  setCredentials((prev) => ({ ...prev, password: e.target.value }));
                  if (touched.password) {
                    setPasswordError(validatePassword(e.target.value));
                  }
                }}
                onBlur={handlePasswordBlur}
                className={`pr-10 ${
                  (touched.password && passwordError) || loginMutation.error
                    ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                    : ''
                }`}
              />
              <button
                type='button'
                className='absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#222]'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              </button>
            </div>
            {touched.password && passwordError && <p className='text-xs text-red-500'>{passwordError}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col gap-4'>
          <Button
            type='submit'
            disabled={!isFormValid || loginMutation.isPending}
            className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-sm h-10 rounded w-full disabled:opacity-50'
          >
            {loginMutation.isPending ? 'Signing in...' : loginMutation.error ? 'Retry' : 'Sign in'}
          </Button>

          {/* Error message */}
          {loginMutation.error && (
            <p className='text-sm text-[#EF4444] text-center'>
              Request time out
              <br />
              Sign in failed. Retry now or refresh your session.
            </p>
          )}

          {/* Sign up link */}
          <p className='text-xs text-[#222] text-center'>
            Don't have an account?{' '}
            <Link
              to='/signup'
              search={{ token: undefined, email: undefined }}
              className='text-[#296cf2] hover:underline'
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>

      {/* Password reset link */}
      <div className='flex justify-end'>
        <Link to='/reset-password' className='text-sm text-[#296cf2] hover:underline'>
          Create new password
        </Link>
      </div>
    </div>
  );
}
