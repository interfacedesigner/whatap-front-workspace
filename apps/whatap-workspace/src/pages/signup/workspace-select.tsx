import { useSignupScenario } from '@/features/signup';
import { WorkspaceSelectView } from '@/features/signup';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/signup/workspace-select')({
  component: WorkspaceSelectPage,
});

function WorkspaceSelectPage() {
  const navigate = useNavigate();
  const scenario = useSignupScenario();

  const workspaces = scenario.workspaces ?? [];

  const handleJoin = (_selectedIds: string[]) => {
    // TODO: API call to join selected workspaces
    navigate({ to: '/signup/success' });
  };

  // If no workspaces available, show message
  if (workspaces.length === 0) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white px-4'>
        <p className='text-sm text-[#757575]'>No workspaces to select. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-white px-4'>
      <div className='w-full max-w-[480px] bg-white rounded-lg shadow-lg p-10'>
        <WorkspaceSelectView
          workspaces={workspaces}
          inviterName={scenario.inviterName ?? undefined}
          onJoin={handleJoin}
        />
      </div>
    </div>
  );
}
