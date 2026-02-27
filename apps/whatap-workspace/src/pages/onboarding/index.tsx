/**
 * /onboarding/ Index Page
 * @description 5단계 온보딩 마법사 메인 페이지
 * 좌측: StepDescription, 우측: Step 위젯, 상단: Stepper
 * Jotai atom으로 스텝 상태 관리
 */
import {
  type OnboardingStep,
  STEP_META,
  canProceedAtom,
  completeOnboardingApi,
  completedStepsAtom,
  createWorkspaceApi,
  createdWorkspaceIdAtom,
  currentStepAtom,
  goToNextStepAtom,
  goToPreviousStepAtom,
  goToStepAtom,
  isCurrentStepSkippableAtom,
  isOnboardingCompleteAtom,
  setCreatedWorkspaceIdAtom,
  skipCurrentStepAtom,
  skippedStepsAtom,
  workspaceSetupAtom,
} from '@/features/onboarding';
import { Button } from '@/shared/components/ui/button';
import { Stepper } from '@/shared/components/ui/stepper';
import {
  ActionBookStep,
  AgentInstallStep,
  MemberInviteStep,
  MonitoringRulesStep,
  OnboardingComplete,
  StepDescription,
  WorkspaceSetupStep,
} from '@/widgets/onboarding';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/onboarding/')({
  component: OnboardingPage,
});

const STEP_ITEMS = Object.values(STEP_META).map((meta) => ({
  step: meta.step,
  label: meta.title,
}));

function OnboardingPage() {
  const navigate = useNavigate();

  // Atom values
  const currentStep = useAtomValue(currentStepAtom);
  const completedSteps = useAtomValue(completedStepsAtom);
  const skippedSteps = useAtomValue(skippedStepsAtom);
  const canProceed = useAtomValue(canProceedAtom);
  const isSkippable = useAtomValue(isCurrentStepSkippableAtom);
  const isComplete = useAtomValue(isOnboardingCompleteAtom);
  const workspaceId = useAtomValue(createdWorkspaceIdAtom);
  const workspaceSetup = useAtomValue(workspaceSetupAtom);

  // Action atoms
  const goToNext = useSetAtom(goToNextStepAtom);
  const goToPrevious = useSetAtom(goToPreviousStepAtom);
  const goToStep = useSetAtom(goToStepAtom);
  const skipStep = useSetAtom(skipCurrentStepAtom);
  const setWorkspaceId = useSetAtom(setCreatedWorkspaceIdAtom);

  // Create Workspace mutation (Step 1)
  const createWorkspaceMutation = useMutation({
    mutationFn: () =>
      createWorkspaceApi({
        name: workspaceSetup.name,
        region: workspaceSetup.region,
        preset: workspaceSetup.preset,
      }),
    onSuccess: (data) => {
      setWorkspaceId(data.workspaceId);
      toast.success(`Workspace "${data.name}" created successfully!`);
      goToNext();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create workspace.');
    },
  });

  // Handle Next
  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      // Step 1: Create workspace first
      createWorkspaceMutation.mutate();
      return;
    }

    goToNext();
  }, [currentStep, createWorkspaceMutation, goToNext]);

  // Handle Skip
  const handleSkip = useCallback(() => {
    skipStep();
  }, [skipStep]);

  // Handle Step Click
  const handleStepClick = useCallback(
    (step: number) => {
      goToStep(step as OnboardingStep);
    },
    [goToStep],
  );

  // Handle Go To Dashboard (complete)
  const handleGoToDashboard = useCallback(async () => {
    const wsId = workspaceId ?? 'ws-onboarding-001';
    try {
      await completeOnboardingApi(wsId);
      navigate({
        to: '/ws/$wsid',
        params: { wsid: wsId },
      });
    } catch {
      // Fallback: navigate anyway
      navigate({
        to: '/ws/$wsid',
        params: { wsid: wsId },
      });
    }
  }, [workspaceId, navigate]);

  // If onboarding is complete, show the completion screen
  if (isComplete) {
    return (
      <div className='flex-1 flex items-center justify-center p-6'>
        <OnboardingComplete onGoToDashboard={handleGoToDashboard} />
      </div>
    );
  }

  const isPending = createWorkspaceMutation.isPending;

  return (
    <div className='flex flex-col h-full'>
      {/* Stepper Header */}
      <div className='flex items-center py-6 px-6 border-b border-zinc-100 bg-white'>
        <Stepper
          steps={STEP_ITEMS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          skippedSteps={skippedSteps}
          onStepClick={handleStepClick}
        />
      </div>

      {/* Main Content: Left Description + Right Form */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Left Panel: Step Description */}
        <div className='hidden lg:flex w-[360px] shrink-0 border-r border-zinc-100 bg-white p-8'>
          <StepDescription step={currentStep} />
        </div>

        {/* Right Panel: Step Form */}
        <div className='flex-1 overflow-y-auto p-6 lg:p-8'>
          <div className='max-w-2xl'>
            {/* Mobile Step Description */}
            <div className='lg:hidden mb-6'>
              <h2 className='text-xl font-bold text-[#222]'>{STEP_META[currentStep].title}</h2>
              <p className='text-sm text-zinc-500 mt-1'>{STEP_META[currentStep].description}</p>
            </div>

            {/* Step Content */}
            <StepContent step={currentStep} />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className='flex items-center justify-between py-4 px-6 border-t border-zinc-100 bg-white'>
        <div>
          {currentStep > 1 && (
            <Button type='button' variant='outline' onClick={goToPrevious} disabled={isPending} className='gap-2'>
              <ArrowLeft className='w-4 h-4' />
              Previous
            </Button>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {isSkippable && (
            <Button
              type='button'
              variant='ghost'
              onClick={handleSkip}
              disabled={isPending}
              className='gap-2 text-zinc-500'
            >
              <SkipForward className='w-4 h-4' />
              Skip
            </Button>
          )}

          <Button
            type='button'
            onClick={handleNext}
            disabled={!canProceed || isPending}
            className='gap-2 bg-[#296cf2] hover:bg-[#1e5ad9] text-white min-w-[120px]'
          >
            {isPending ? (
              'Processing...'
            ) : currentStep === 5 ? (
              'Complete'
            ) : (
              <>
                {currentStep === 1 ? 'Create & Continue' : 'Next'}
                <ArrowRight className='w-4 h-4' />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Step Content 분기 렌더링 */
function StepContent({ step }: { step: OnboardingStep }) {
  switch (step) {
    case 1:
      return <WorkspaceSetupStep />;
    case 2:
      return <AgentInstallStep />;
    case 3:
      return <MemberInviteStep />;
    case 4:
      return <MonitoringRulesStep />;
    case 5:
      return <ActionBookStep />;
    default:
      return null;
  }
}
