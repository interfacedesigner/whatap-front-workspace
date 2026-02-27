/**
 * Stepper Component
 * @description 범용 멀티스텝 프로그레스 표시 컴포넌트
 * 각 스텝의 번호, 라벨, 완료/활성/비활성 상태를 시각적으로 표시
 */
import { cn } from '@/shared/lib/utils';
import { Check } from 'lucide-react';

export interface StepItem {
  step: number;
  label: string;
}

export type StepStatus = 'completed' | 'active' | 'upcoming' | 'skipped';

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  completedSteps: number[];
  skippedSteps?: number[];
  onStepClick?: (step: number) => void;
  className?: string;
}

function getStepStatus(
  step: number,
  currentStep: number,
  completedSteps: number[],
  skippedSteps: number[],
): StepStatus {
  if (completedSteps.includes(step)) {
    return 'completed';
  }
  if (skippedSteps.includes(step)) {
    return 'skipped';
  }
  if (step === currentStep) {
    return 'active';
  }
  return 'upcoming';
}

export function Stepper({
  steps,
  currentStep,
  completedSteps,
  skippedSteps = [],
  onStepClick,
  className,
}: StepperProps) {
  return (
    <nav aria-label='Onboarding progress' className={cn('flex items-center gap-0', className)}>
      {steps.map((item, index) => {
        const status = getStepStatus(item.step, currentStep, completedSteps, skippedSteps);
        const isClickable = onStepClick && (status === 'completed' || status === 'skipped' || item.step <= currentStep);
        const isLast = index === steps.length - 1;

        return (
          <div key={item.step} className='flex items-center'>
            {/* Step circle + label */}
            <button
              type='button'
              onClick={() => isClickable && onStepClick(item.step)}
              disabled={!isClickable}
              className={cn(
                'flex items-center gap-2 group transition-colors',
                isClickable && 'cursor-pointer',
                !isClickable && 'cursor-default',
              )}
              aria-current={status === 'active' ? 'step' : undefined}
            >
              {/* Circle */}
              <div
                className={cn(
                  'flex items-center justify-center rounded-full w-8 h-8 text-sm font-semibold transition-all shrink-0',
                  status === 'completed' && 'bg-[#296cf2] text-white',
                  status === 'skipped' && 'bg-zinc-300 text-white',
                  status === 'active' && 'bg-[#296cf2] text-white ring-4 ring-[#296cf2]/20',
                  status === 'upcoming' && 'bg-zinc-100 text-zinc-400 border border-zinc-200',
                )}
              >
                {status === 'completed' ? (
                  <Check className='w-4 h-4' />
                ) : status === 'skipped' ? (
                  <span className='text-xs'>—</span>
                ) : (
                  item.step
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-sm whitespace-nowrap hidden sm:inline',
                  status === 'active' && 'font-semibold text-[#222]',
                  status === 'completed' && 'font-medium text-[#296cf2]',
                  status === 'skipped' && 'font-medium text-zinc-400',
                  status === 'upcoming' && 'text-zinc-400',
                )}
              >
                {item.label}
              </span>
            </button>

            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'h-[2px] w-8 mx-2 transition-colors',
                  status === 'completed' || status === 'skipped' ? 'bg-[#296cf2]' : 'bg-zinc-200',
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
