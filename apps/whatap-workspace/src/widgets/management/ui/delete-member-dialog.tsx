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
import { Input } from '@/shared/components/ui/input';
import { useEffect, useState } from 'react';

interface DeleteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member;
  onConfirm: () => void;
}

export function DeleteMemberDialog({ open, onOpenChange, member, onConfirm }: DeleteMemberDialogProps) {
  const [confirmEmail, setConfirmEmail] = useState('');

  useEffect(() => {
    if (!open) {
      setConfirmEmail('');
    }
  }, [open]);

  const isMatch = confirmEmail.toLowerCase() === member.email.toLowerCase();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Member</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className='font-semibold text-foreground'>{member.name}</span> and remove all associated policy
            assignments.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className='space-y-2 py-2'>
          <label className='text-sm text-muted-foreground'>
            Type <span className='font-mono font-medium text-foreground'>{member.email}</span> to confirm:
          </label>
          <Input
            placeholder='Enter email to confirm'
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            autoFocus
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!isMatch}
            onClick={onConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Delete Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
