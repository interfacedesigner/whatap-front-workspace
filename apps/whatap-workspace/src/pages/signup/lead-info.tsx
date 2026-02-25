import { LeadInfoForm, useSignupScenario } from '@/features/signup';
import type { LeadInfoData } from '@/features/signup';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

export const Route = createFileRoute('/signup/lead-info')({
  component: LeadInfoPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || undefined,
    };
  },
});

function LeadInfoPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/signup/lead-info' });
  const scenario = useSignupScenario();
  const email = searchParams.email || '';

  const handleContinue = (_data: LeadInfoData) => {
    // TODO: API call to save lead info
    navigate({
      to: '/signup/verify',
      search: { email },
    });
  };

  const handleSkip = () => {
    navigate({
      to: '/signup/verify',
      search: { email },
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <div className='w-full max-w-[480px] bg-white rounded-lg shadow-lg p-10'>
        <LeadInfoForm
          onContinue={handleContinue}
          onSkip={handleSkip}
          initialData={scenario.leadInfoPrefill || undefined}
        />
      </div>
    </div>
  );
}
