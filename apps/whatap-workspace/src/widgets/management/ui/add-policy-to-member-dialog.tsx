import type { Policy, Role } from '@/entities/management';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useEffect, useState } from 'react';

interface AddPolicyToMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availablePolicies: Policy[];
  rolesMap: Record<string, Role[]>;
  onSubmit: (policyIds: string[]) => void;
}

export function AddPolicyToMemberDialog({
  open,
  onOpenChange,
  availablePolicies,
  rolesMap,
  onSubmit,
}: AddPolicyToMemberDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!open) {
      setSelected([]);
    }
  }, [open]);

  function togglePolicy(policyId: string) {
    setSelected((prev) => (prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId]));
  }

  function handleSubmit() {
    if (selected.length === 0) {
      return;
    }
    onSubmit(selected);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Add Policy</DialogTitle>
          <DialogDescription>Select policies to assign to this member.</DialogDescription>
        </DialogHeader>

        <div className='max-h-[360px] space-y-2 overflow-y-auto'>
          {availablePolicies.length === 0 ? (
            <p className='py-8 text-center text-sm text-muted-foreground'>
              All policies are already assigned to this member.
            </p>
          ) : (
            availablePolicies.map((policy) => {
              const roles = rolesMap[policy.id] ?? [];
              const isSelected = selected.includes(policy.id);
              return (
                <label
                  key={policy.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <Checkbox checked={isSelected} onChange={() => togglePolicy(policy.id)} className='mt-0.5' />
                  <div className='flex-1 min-w-0'>
                    <span className='text-sm font-medium'>{policy.name}</span>
                    <p className='mt-0.5 text-xs text-muted-foreground line-clamp-1'>{policy.description}</p>
                    {roles.length > 0 && (
                      <div className='mt-1.5 flex flex-wrap gap-1'>
                        {roles.map((role) => (
                          <Badge key={role.id} variant='outline' className='text-[10px]'>
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selected.length === 0}>
            Add {selected.length > 0 ? `${selected.length} ${selected.length === 1 ? 'Policy' : 'Policies'}` : 'Policy'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
