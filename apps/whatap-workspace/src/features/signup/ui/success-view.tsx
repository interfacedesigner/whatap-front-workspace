import { Button } from '@/shared/components/ui/button';
import { CheckCircle } from 'lucide-react';

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
    <div className='flex flex-col items-center gap-6 text-center max-w-md'>
      <div className='w-16 h-16 rounded-full border-2 border-[#296cf2] flex items-center justify-center'>
        <CheckCircle className='w-10 h-10 text-[#296cf2]' />
      </div>

      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold text-[#222]'>Account has been created successfully.</h1>
        <p className='text-sm text-[#757575]'>{subtitle}</p>
      </div>

      <Button
        className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-sm h-10 px-6 rounded w-full'
        onClick={onCreateWorkspace}
      >
        {ctaText}
      </Button>
    </div>
  );
}
