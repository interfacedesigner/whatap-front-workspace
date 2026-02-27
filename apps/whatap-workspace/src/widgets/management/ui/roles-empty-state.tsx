import { Button } from '@/shared/components/ui/button';
import { Shield } from 'lucide-react';

interface RolesEmptyStateProps {
  onCreateClick: () => void;
}

export function RolesEmptyState({ onCreateClick }: RolesEmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed py-16'>
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted'>
        <Shield className='h-6 w-6 text-muted-foreground' />
      </div>
      <h3 className='mt-4 text-lg font-semibold'>No roles found</h3>
      <p className='mt-1 text-sm text-muted-foreground'>Get started by creating your first custom role.</p>
      <Button className='mt-4' onClick={onCreateClick}>
        + Create Role
      </Button>
    </div>
  );
}
