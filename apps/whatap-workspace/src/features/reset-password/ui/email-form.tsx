import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
});

interface EmailFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export function EmailForm({ onSubmit, isLoading = false }: EmailFormProps) {
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    const result = emailSchema.safeParse({
      email: formData.get('email'),
    });

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      if (firstIssue) {
        setError(firstIssue.message);
      }
      return;
    }

    setError(null);
    onSubmit(result.data.email);
  }

  return (
    <Card className='w-full max-w-[480px] shadow-lg'>
      <CardHeader className='gap-2 text-center'>
        <CardTitle className='text-2xl font-semibold'>Create new password</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          Enter your email address and we'll send you a verification code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className='flex flex-col gap-8'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@company.com'
                aria-invalid={!!error}
                disabled={isLoading}
              />
              {error && <p className='text-sm text-destructive'>{error}</p>}
            </Field>
          </FieldGroup>

          <Button type='submit' disabled={isLoading} className='w-full'>
            {isLoading ? 'Sending...' : 'Send code'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
