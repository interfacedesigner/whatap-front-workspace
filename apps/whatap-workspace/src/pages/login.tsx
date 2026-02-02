import { LoginForm } from '@features/auth';
import { Button } from '@shared/components/ui/button';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center mb-6'>Login</h1>
        <LoginForm />
        <div className='mt-4 text-center'>
          <span className='text-sm text-gray-600'>Don't have an account?</span>
          <Button variant='link' asChild className='ml-1'>
            <Link to='/create-account'>Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
