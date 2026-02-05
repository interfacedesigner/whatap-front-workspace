import { SignupForm } from '@/features/signup';
import { useSignupScenario } from '@/features/signup';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/signup/')({
  component: SignupPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
      email: (search.email as string) || undefined,
    };
  },
});

function SignupPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/signup/' });
  const scenario = useSignupScenario();
  const [isLoading, setIsLoading] = useState(false);

  // Determine invited email: context scenario takes priority, then URL params
  const token = scenario.token || searchParams.token;
  const invitedEmail = token ? scenario.email || searchParams.email || 'invited-account@company.com' : undefined;

  const handleSubmit = async (email: string, _password: string) => {
    setIsLoading(true);
    // TODO: API call to create account
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    navigate({
      to: '/signup/lead-info',
      search: { email },
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <SignupForm invitedEmail={invitedEmail} onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
