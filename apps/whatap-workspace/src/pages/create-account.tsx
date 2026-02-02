import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/Field';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-account')({
  component: CreateAccountPage,
});

function CreateAccountPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold'>Workspace</h1>
          <h5 className='text-gray-600 mt-2'>Get started with a free account</h5>
        </div>

        <form className='space-y-4'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='company'>Company</FieldLabel>
              <Input id='company' name='company' type='text' maxLength={255} required />
            </Field>

            <Field>
              <FieldLabel htmlFor='name'>Name</FieldLabel>
              <Input id='name' name='name' type='text' maxLength={50} required />
            </Field>

            <Field>
              <FieldLabel htmlFor='phone'>Phone</FieldLabel>
              <Input id='phone' name='phone' type='tel' maxLength={50} required />
            </Field>

            <Field>
              <FieldLabel htmlFor='email'>Email</FieldLabel>
              <Input id='email' name='email' type='email' required />
            </Field>

            <Field>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <Input id='password' name='password' type='password' minLength={9} required />
            </Field>

            <Field>
              <FieldLabel htmlFor='passwordConfirm'>Confirm Password</FieldLabel>
              <Input id='passwordConfirm' name='passwordConfirm' type='password' required />
            </Field>
          </FieldGroup>

          <Field orientation='horizontal'>
            <Checkbox id='terms' name='terms' required />
            <FieldLabel htmlFor='terms' className='text-sm font-normal'>
              I accept the Terms of Use
            </FieldLabel>
          </Field>

          <Field orientation='horizontal'>
            <Checkbox id='policy' name='policy' required />
            <FieldLabel htmlFor='policy' className='text-sm font-normal'>
              I accept the Privacy Policy
            </FieldLabel>
          </Field>

          <Button type='submit' className='w-full'>
            Sign Up
          </Button>

          <div className='text-center text-sm'>
            <Link to='/login' className='text-primary hover:underline'>
              Login to your account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
