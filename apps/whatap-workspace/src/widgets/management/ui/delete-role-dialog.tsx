import type { Role, RoleImpact } from '@/entities/management';
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

interface DeleteRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role;
  impact: RoleImpact;
  onConfirm: () => void;
}

export function DeleteRoleDialog({ open, onOpenChange, role, impact, onConfirm }: DeleteRoleDialogProps) {
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    if (!open) {
      setConfirmName('');
    }
  }, [open]);

  const isMatch = confirmName === role.name;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Role</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the role{' '}
            <span className='font-semibold text-foreground'>{role.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Impact Analysis */}
        {(impact.linkedPoliciesCount > 0 || impact.affectedMembersCount > 0) && (
          <div className='rounded-lg border bg-amber-50 p-3 space-y-1'>
            <p className='text-sm font-medium text-amber-800'>Impact Analysis</p>
            <ul className='text-sm text-amber-700 list-disc list-inside space-y-0.5'>
              {impact.linkedPoliciesCount > 0 && (
                <li>
                  Will be removed from <span className='font-semibold'>{impact.linkedPoliciesCount}</span> polic
                  {impact.linkedPoliciesCount === 1 ? 'y' : 'ies'}
                  {impact.linkedPolicyNames.length > 0 && (
                    <span className='text-amber-600'> ({impact.linkedPolicyNames.join(', ')})</span>
                  )}
                </li>
              )}
              {impact.affectedMembersCount > 0 && (
                <li>
                  <span className='font-semibold'>{impact.affectedMembersCount}</span> member
                  {impact.affectedMembersCount === 1 ? '' : 's'} will be affected
                </li>
              )}
            </ul>
          </div>
        )}

        <div className='space-y-2 py-2'>
          <label className='text-sm text-muted-foreground'>
            Type <span className='font-mono font-medium text-foreground'>{role.name}</span> to confirm:
          </label>
          <Input
            placeholder='Enter role name to confirm'
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
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
            Delete Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
