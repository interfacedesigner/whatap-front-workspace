/**
 * StepDescription
 * @description 온보딩 좌측 패널 — 각 스텝별 제목, 설명, 일러스트를 표시
 */
import type { OnboardingStep } from '@/features/onboarding';
import { cn } from '@/shared/lib/utils';
import { BookOpen, type LucideIcon, Server, Settings, Shield, Users } from 'lucide-react';

interface StepDescriptionData {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  features: string[];
  color: string;
}

const STEP_DESCRIPTIONS: Record<OnboardingStep, StepDescriptionData> = {
  1: {
    icon: Settings,
    title: 'Create Your Workspace',
    subtitle: 'Set up the foundation for your monitoring environment.',
    features: [
      'Name your workspace for easy identification',
      'Select a region closest to your infrastructure',
      'Choose a preset that matches your team size',
    ],
    color: '#296cf2',
  },
  2: {
    icon: Server,
    title: 'Install Monitoring Agent',
    subtitle: 'Deploy the OpsGent agent on your servers to start collecting data.',
    features: [
      'One-line installation script',
      'Supports Linux, macOS, and Windows',
      'Real-time connection status monitoring',
    ],
    color: '#059669',
  },
  3: {
    icon: Users,
    title: 'Invite Your Team',
    subtitle: 'Collaborate with your team members on infrastructure monitoring.',
    features: [
      'Invite by email with role-based access',
      'Choose from Viewer, Developer, or Admin roles',
      'Team members get instant access after accepting',
    ],
    color: '#7c3aed',
  },
  4: {
    icon: Shield,
    title: 'Set Up Monitoring Rules',
    subtitle: 'Configure event detection and incident management rules.',
    features: [
      'Pre-configured rule presets for quick setup',
      'Custom event thresholds and conditions',
      'Multi-channel delivery (Email, Slack, PagerDuty)',
    ],
    color: '#ea580c',
  },
  5: {
    icon: BookOpen,
    title: 'Configure ActionBook',
    subtitle: 'Enable AI-powered automation for incident response.',
    features: [
      'Connect your preferred LLM provider',
      'Choose automation presets for common scenarios',
      'Enable auto-action for hands-free incident handling',
    ],
    color: '#0891b2',
  },
};

interface StepDescriptionProps {
  step: OnboardingStep;
  className?: string;
}

export function StepDescription({ step, className }: StepDescriptionProps) {
  const data = STEP_DESCRIPTIONS[step];
  const Icon = data.icon;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {/* Icon */}
      <div
        className='flex items-center justify-center w-12 h-12 rounded-xl'
        style={{ backgroundColor: `${data.color}15` }}
      >
        <Icon className='w-6 h-6' style={{ color: data.color }} />
      </div>

      {/* Title + Subtitle */}
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold text-[#222]'>{data.title}</h2>
        <p className='text-sm text-zinc-500 leading-relaxed'>{data.subtitle}</p>
      </div>

      {/* Features */}
      <ul className='flex flex-col gap-3'>
        {data.features.map((feature) => (
          <li key={feature} className='flex items-start gap-3 text-sm text-zinc-600'>
            <div
              className='flex items-center justify-center w-5 h-5 rounded-full mt-0.5 shrink-0'
              style={{ backgroundColor: `${data.color}15` }}
            >
              <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: data.color }} />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      {/* Step indicator */}
      <div className='mt-auto pt-6'>
        <p className='text-xs text-zinc-400'>Step {step} of 5</p>
      </div>
    </div>
  );
}
