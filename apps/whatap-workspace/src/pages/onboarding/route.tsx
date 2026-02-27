/**
 * /onboarding Route Layout
 * @description OnboardingLayout으로 감싸는 레이아웃 라우트
 */
import { OnboardingLayout } from '@app/layouts';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/onboarding')({
  component: OnboardingRouteLayout,
});

function OnboardingRouteLayout() {
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
}
