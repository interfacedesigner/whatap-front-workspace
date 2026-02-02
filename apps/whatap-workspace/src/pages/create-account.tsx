import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/create-account')({
  component: CreateAccountPage,
});

function CreateAccountPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-md'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold'>WhaTap</h1>
          <h5 className='text-gray-600 mt-2'>Get started with a free account</h5>
        </div>

        <form className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='company'>Company</Label>
            <Input id='company' name='company' type='text' maxLength={255} required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' name='name' type='text' maxLength={50} required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input id='phone' name='phone' type='tel' maxLength={50} required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' type='email' required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password' name='password' type='password' minLength={9} required />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='passwordConfirm'>Confirm Password</Label>
            <Input id='passwordConfirm' name='passwordConfirm' type='password' required />
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox id='terms' name='terms' required />
            <Label htmlFor='terms' className='text-sm font-normal'>
              I accept the Terms of Use
            </Label>
          </div>

          <div className='flex items-center gap-2'>
            <Checkbox id='policy' name='policy' required />
            <Label htmlFor='policy' className='text-sm font-normal'>
              I accept the Privacy Policy
            </Label>
          </div>

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
