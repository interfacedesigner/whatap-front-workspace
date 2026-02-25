import { LoginForm } from '@/features/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      {/* Card container with shadow (no border per Figma) */}
      <div className='w-full max-w-[480px] bg-white rounded-md shadow-lg p-10'>
        {/* Header */}
        <div className='flex flex-col gap-2 mb-5'>
          {/* Title */}
          <h1 className='text-2xl font-semibold text-[#222]'>Sign in</h1>
          {/* Description */}
          <p className='text-sm text-[#757575]'>Access your workspaces and continue monitoring.</p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
