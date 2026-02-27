import type { Member } from '@/entities/management';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

interface DeactivateMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onConfirm: () => void;
}

export function DeactivateMemberDialog({ open, onOpenChange, member, onConfirm }: DeactivateMemberDialogProps) {
  const isActive = member.status === 'active';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isActive ? 'Deactivate' : 'Activate'} Member</AlertDialogTitle>
          <AlertDialogDescription>
            {isActive ? (
              <>
                <span className='font-semibold text-foreground'>{member.name}</span> will be deactivated and will no
                longer be able to access the workspace. Their policy assignments will be preserved.
              </>
            ) : (
              <>
                <span className='font-semibold text-foreground'>{member.name}</span> will be reactivated and will regain
                access based on their assigned policies.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{isActive ? 'Deactivate' : 'Activate'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
