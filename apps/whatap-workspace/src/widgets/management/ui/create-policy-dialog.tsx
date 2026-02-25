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

const policySchema = z.object({
  name: z.string().min(1, 'Policy name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
});

interface CreatePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePolicyDialog({ open, onOpenChange }: CreatePolicyDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    const result = policySchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
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
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Create Policy</DialogTitle>
          <DialogDescription>Define a new access policy for your workspace.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='policy-name' className='text-sm font-medium'>
              Policy Name
            </label>
            <Input id='policy-name' name='name' placeholder='e.g., Production Read-Only' />
            {errors['name'] != null && <p className='text-xs text-destructive'>{errors['name']}</p>}
          </div>
          <div className='space-y-2'>
            <label htmlFor='policy-desc' className='text-sm font-medium'>
              Description
            </label>
            <Input id='policy-desc' name='description' placeholder='Describe the purpose of this policy' />
            {errors['description'] != null && <p className='text-xs text-destructive'>{errors['description']}</p>}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit'>Create Policy</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
