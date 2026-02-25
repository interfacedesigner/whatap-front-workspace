import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { useState } from 'react';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(1, 'Name is required').max(100),
});

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    const result = inviteSchema.safeParse({
      email: formData.get('email'),
      name: formData.get('name'),
    });

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

    setErrors({});
    // Mock: close dialog on success
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>Send an invitation to join this workspace.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='invite-name' className='text-sm font-medium'>
              Name
            </label>
            <Input id='invite-name' name='name' placeholder='Enter member name' />
            {errors['name'] != null && <p className='text-xs text-destructive'>{errors['name']}</p>}
          </div>
          <div className='space-y-2'>
            <label htmlFor='invite-email' className='text-sm font-medium'>
              Email
            </label>
            <Input id='invite-email' name='email' type='email' placeholder='Enter email address' />
            {errors['email'] != null && <p className='text-xs text-destructive'>{errors['email']}</p>}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit'>Send Invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
