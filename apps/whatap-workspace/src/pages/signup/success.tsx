import { SuccessView, useSignupScenario } from '@/features/signup';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/signup/success')({
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();
  const scenario = useSignupScenario();

  const handleAction = () => {
    // TODO: Navigate to workspace or dashboard
    navigate({ to: '/' });
  };

  // Dynamic CTA text and subtitle based on scenario
  let ctaText = 'Create a workspace';
  let subtitle = 'Your monitoring is now active. You can start managing your infrastructure from the dashboard.';

  if (scenario.type === 'invited-single' && scenario.workspaces?.[0]) {
    ctaText = `Go to ${scenario.workspaces[0].name}`;
    subtitle = `You've joined ${scenario.workspaces[0].name}. Start monitoring your infrastructure now.`;
  } else if (scenario.type === 'invited-multi') {
    ctaText = 'Go to dashboard';
    subtitle = "You've joined the selected workspaces. Start monitoring your infrastructure now.";
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[rgba(215,226,255,0.15)] px-4'>
      <SuccessView onCreateWorkspace={handleAction} ctaText={ctaText} subtitle={subtitle} />
    </div>
  );
}
