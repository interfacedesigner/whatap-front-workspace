/**
 * OnboardingSidebarWidget
 * @description 사이드바에 표시되는 온보딩 미니 진행률 위젯.
 * 온보딩 미완료 상태에서만 표시되며, 클릭하면 /onboarding으로 이동
 * X 버튼으로 숨길 수 있음 (세션 단위)
 */
import {
  STEP_META,
  currentStepAtom,
  progressPercentAtom,
  shouldShowOnboardingWidgetAtom,
  widgetDismissedAtom,
} from '@/features/onboarding';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { Link } from '@tanstack/react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { Rocket, X } from 'lucide-react';

interface OnboardingSidebarWidgetProps {
  className?: string;
}

export function OnboardingSidebarWidget({ className }: OnboardingSidebarWidgetProps) {
  const shouldShow = useAtomValue(shouldShowOnboardingWidgetAtom);
  const progress = useAtomValue(progressPercentAtom);
  const currentStep = useAtomValue(currentStepAtom);
  const setDismissed = useSetAtom(widgetDismissedAtom);

  if (!shouldShow) {
    return null;
  }

  const stepMeta = STEP_META[currentStep];

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
  };

  return (
    <div className={cn('rounded-lg border border-[#296cf2]/20 bg-[#296cf2]/[0.04] p-3 relative', className)}>
      {/* Close button */}
      <button
        type='button'
        onClick={handleDismiss}
        className='absolute top-2 right-2 p-0.5 rounded-sm text-zinc-400 hover:text-zinc-600 transition-colors'
        aria-label='Dismiss onboarding widget'
      >
        <X className='w-3.5 h-3.5' />
      </button>

      <Link to='/onboarding' className='flex flex-col gap-2 group pr-4'>
        <div className='flex items-center gap-2'>
          <Rocket className='w-4 h-4 text-[#296cf2]' />
          <span className='text-xs font-semibold text-[#296cf2]'>Complete Setup</span>
          <span className='text-[10px] text-zinc-400 ml-auto'>{progress}%</span>
        </div>

        <Progress value={progress} className='h-1.5 bg-[#296cf2]/10 [&>div]:bg-[#296cf2]' />

        <p className='text-[11px] text-zinc-500 group-hover:text-zinc-700 transition-colors'>
          Step {currentStep}: {stepMeta.title}
        </p>
      </Link>
    </div>
  );
}
