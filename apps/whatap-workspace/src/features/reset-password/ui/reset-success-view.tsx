import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Check } from 'lucide-react';

interface ResetSuccessViewProps {
  onSignIn: () => void;
}

export function ResetSuccessView({ onSignIn }: ResetSuccessViewProps) {
  return (
    <Card className='w-full max-w-[528px] shadow-lg'>
      <CardContent className='flex flex-col items-center gap-6 pt-10 pb-10 px-10'>
        {/* Success Icon */}
        <div className='w-[88px] h-[88px] rounded-full bg-primary flex items-center justify-center'>
          <Check className='w-12 h-12 text-primary-foreground' strokeWidth={3} />
        </div>

        {/* Header */}
        <div className='flex flex-col gap-3 text-center'>
          <h1 className='text-2xl font-semibold text-foreground'>Password reset complete</h1>
          <p className='text-base text-muted-foreground'>Your password has been successfully reset.</p>
        </div>

        {/* Action Button */}
        <Button onClick={onSignIn} className='w-full'>
          Sign in
        </Button>
      </CardContent>
    </Card>
  );
}
