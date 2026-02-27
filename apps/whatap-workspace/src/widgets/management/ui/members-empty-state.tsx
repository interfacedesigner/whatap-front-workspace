import { Button } from '@/shared/components/ui/button';
import { Users } from 'lucide-react';

interface MembersEmptyStateProps {
  onInviteClick: () => void;
}

export function MembersEmptyState({ onInviteClick }: MembersEmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-16'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
        <Users className='h-6 w-6 text-muted-foreground' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>No members yet</h3>
      <p className='mt-1 text-sm text-muted-foreground'>Get started by inviting your first team member.</p>
      <Button className='mt-4' onClick={onInviteClick}>
        + Invite Member
      </Button>
    </div>
  );
}
