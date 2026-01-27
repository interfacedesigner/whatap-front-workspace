import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';

import { type LoginCredentials, loginApi } from '../api';
import { useAuth } from '../model';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      login(data.user);
      navigate({ to: '/' });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(credentials);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <label htmlFor='email' className='text-sm font-medium'>
          Email
        </label>
        <Input
          id='email'
          type='email'
          value={credentials.email}
          onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
          placeholder='Enter your email'
          required
        />
      </div>

      <div className='flex flex-col gap-2'>
        <label htmlFor='password' className='text-sm font-medium'>
          Password
        </label>
        <Input
          id='password'
          type='password'
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          placeholder='Enter your password'
          required
        />
      </div>

      {loginMutation.error && (
        <div className='p-2 bg-destructive/10 text-destructive rounded text-sm'>{loginMutation.error.message}</div>
      )}

      <Button type='submit' disabled={loginMutation.isPending} className='w-full'>
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
