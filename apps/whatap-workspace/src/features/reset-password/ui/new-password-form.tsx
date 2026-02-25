import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

const passwordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

interface NewPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
}

export function NewPasswordForm({ onSubmit, isLoading = false }: NewPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    const result = passwordSchema.safeParse({
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const pathKey = issue.path[0];
        if (pathKey !== undefined) {
          fieldErrors[String(pathKey)] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data.password);
  }

  return (
    <Card className='w-full max-w-[480px] shadow-lg'>
      <CardHeader className='gap-2 text-center'>
        <CardTitle className='text-2xl font-semibold'>Create new password</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          Enter a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className='flex flex-col gap-8'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='password'>New password</FieldLabel>
              <div className='relative'>
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                  className='pr-10'
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
            </Field>

            <Field>
              <FieldLabel htmlFor='confirmPassword'>Confirm password</FieldLabel>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  aria-invalid={!!errors.confirmPassword}
                  disabled={isLoading}
                  className='pr-10'
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
              {errors.confirmPassword && <p className='text-sm text-destructive'>{errors.confirmPassword}</p>}
            </Field>
          </FieldGroup>

          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Creating...' : 'Create new password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
