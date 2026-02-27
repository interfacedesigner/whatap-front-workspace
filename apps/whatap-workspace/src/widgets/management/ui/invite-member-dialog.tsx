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
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().max(100, 'Name must be 100 characters or fewer').optional(),
  policyIds: z.array(z.string()),
  welcomeMessage: z.string().max(500, 'Message must be 500 characters or fewer').optional(),
});

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policies: Policy[];
  rolesMap: Record<string, Role[]>;
  onSubmit: (data: { email: string; name?: string; policyIds: string[]; welcomeMessage?: string }) => void;
  checkEmailExists?: (email: string) => boolean;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  policies,
  rolesMap,
  onSubmit,
  checkEmailExists,
}: InviteMemberDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPolicyIds, setSelectedPolicyIds] = useState<string[]>([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [emailDupError, setEmailDupError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setErrors({});
      setSelectedPolicyIds([]);
      setWelcomeMessage('');
      setEmailValue('');
      setEmailDupError(null);
    }
  }, [open]);

  // Debounced email duplicate check
  const handleEmailChange = useCallback(
    (email: string) => {
      setEmailValue(email);
      setEmailDupError(null);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (!checkEmailExists || !email) {
        return;
      }
      debounceRef.current = setTimeout(() => {
        if (checkEmailExists(email)) {
          setEmailDupError('A member with this email already exists.');
        }
      }, 500);
    },
    [checkEmailExists],
  );

  function togglePolicy(policyId: string) {
    setSelectedPolicyIds((prev) =>
      prev.includes(policyId) ? prev.filter((id) => id !== policyId) : [...prev, policyId],
    );
  }

  function handleSubmit(formData: FormData) {
    const raw = {
      email: formData.get('email') as string,
      name: (formData.get('name') as string) || undefined,
      policyIds: selectedPolicyIds,
      welcomeMessage: welcomeMessage || undefined,
    };

    const result = inviteSchema.safeParse(raw);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const key = err.path[0];
        if (key != null) {
          fieldErrors[String(key)] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (emailDupError) {
      return;
    }

    setErrors({});
    const submitData: { email: string; name?: string; policyIds: string[]; welcomeMessage?: string } = {
      email: result.data.email,
      policyIds: result.data.policyIds,
    };
    if (result.data.name) {
      submitData.name = result.data.name;
    }
    if (result.data.welcomeMessage) {
      submitData.welcomeMessage = result.data.welcomeMessage;
    }
    onSubmit(submitData);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join this workspace. Select policies to assign initial access.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className='space-y-5'>
          {/* Email */}
          <div className='space-y-2'>
            <label htmlFor='invite-email' className='text-sm font-medium'>
              Email <span className='text-destructive'>*</span>
            </label>
            <Input
              id='invite-email'
              name='email'
              type='email'
              placeholder='Enter email address'
              value={emailValue}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            {errors['email'] != null && <p className='text-xs text-destructive'>{errors['email']}</p>}
            {emailDupError && <p className='text-xs text-destructive'>{emailDupError}</p>}
          </div>

          {/* Name */}
          <div className='space-y-2'>
            <label htmlFor='invite-name' className='text-sm font-medium'>
              Name <span className='text-xs text-muted-foreground'>(optional)</span>
            </label>
            <Input id='invite-name' name='name' placeholder='Enter member name' />
            {errors['name'] != null && <p className='text-xs text-destructive'>{errors['name']}</p>}
          </div>

          {/* Policy Selection */}
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Assign Policies</label>
              {selectedPolicyIds.length > 0 && (
                <Badge variant='secondary' className='text-xs'>
                  {selectedPolicyIds.length} {selectedPolicyIds.length === 1 ? 'policy' : 'policies'} selected
                </Badge>
              )}
            </div>
            <div className='max-h-[240px] space-y-2 overflow-y-auto rounded-lg border p-3'>
              {policies.map((policy) => {
                const roles = rolesMap[policy.id] ?? [];
                const isSelected = selectedPolicyIds.includes(policy.id);
                return (
                  <label
                    key={policy.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox checked={isSelected} onChange={() => togglePolicy(policy.id)} className='mt-0.5' />
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium'>{policy.name}</span>
                      </div>
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
              })}
            </div>
          </div>

          {/* Welcome Message */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <label htmlFor='invite-message' className='text-sm font-medium'>
                Welcome Message <span className='text-xs text-muted-foreground'>(optional)</span>
              </label>
              <span className='text-xs text-muted-foreground'>{welcomeMessage.length}/500</span>
            </div>
            <Textarea
              id='invite-message'
              placeholder='Add a personal welcome message...'
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value.slice(0, 500))}
              rows={3}
            />
            {errors['welcomeMessage'] != null && <p className='text-xs text-destructive'>{errors['welcomeMessage']}</p>}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={!!emailDupError}>
              Send Invitation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
