import { Button } from '@/shared/components/ui/button';
import { Check } from 'lucide-react';

interface SuccessViewProps {
  onCreateWorkspace: () => void;
  /** Custom CTA button text */
  ctaText?: string;
  /** Custom subtitle message */
  subtitle?: string;
}

export function SuccessView({
  onCreateWorkspace,
  ctaText = 'Create a workspace',
  subtitle = 'Your monitoring is now active. You can start managing your infrastructure from the dashboard.',
}: SuccessViewProps) {
  return (
    <div className='flex flex-col items-center gap-6 text-center w-full'>
      {/* Figma: solid navy blue circle (#1E3A8A, 48x48) with white check icon (24x24) */}
      <div className='w-12 h-12 rounded-full bg-[#1E3A8A] flex items-center justify-center'>
        <Check className='w-6 h-6 text-white' strokeWidth={2.5} />
      </div>

      {/* Heading & description */}
      <div className='flex flex-col gap-3'>
        <h1 className='text-2xl font-semibold text-[#222]'>Account has been created successfully.</h1>
        <p className='text-base text-[#757575] leading-relaxed'>{subtitle}</p>
      </div>

      {/* CTA Button */}
      <Button
        className='bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-sm h-10 rounded-lg w-full'
        onClick={onCreateWorkspace}
      >
        {ctaText}
      </Button>
    </div>
  );
}
