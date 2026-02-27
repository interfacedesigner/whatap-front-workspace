import { SuccessView, useSignupScenario } from '@/features/signup';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/signup/success')({
  component: SuccessPage,
});

function SuccessPage() {
  const navigate = useNavigate();
  const scenario = useSignupScenario();

  const handleAction = () => {
    if (scenario.type === 'invited-single' && scenario.workspaces?.[0]) {
      // 초대받은 단일 워크스페이스 → 해당 워크스페이스로 이동
      navigate({
        to: '/ws/$wsid',
        params: { wsid: scenario.workspaces[0].id },
      });
    } else if (scenario.type === 'invited-multi') {
      // 초대받은 복수 워크스페이스 → 대시보드로 이동
      navigate({ to: '/' });
    } else {
      // 기본 시나리오 (신규 가입) → 온보딩으로 이동
      // localStorage 초기화 + 하드 네비게이션으로 Jotai 메모리도 리셋
      const storagePrefix = 'opsgent_onboarding_';
      const keysToRemove = Object.keys(localStorage).filter((key) => key.startsWith(storagePrefix));
      for (const key of keysToRemove) {
        localStorage.removeItem(key);
      }
      window.location.href = '/onboarding';
    }
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
      <div className='w-full max-w-[480px] bg-white rounded-lg shadow-lg p-10'>
        <SuccessView onCreateWorkspace={handleAction} ctaText={ctaText} subtitle={subtitle} />
      </div>
    </div>
  );
}
