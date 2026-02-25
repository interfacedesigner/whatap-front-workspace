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

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
});

interface CreateRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRoleDialog({ open, onOpenChange }: CreateRoleDialogProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(formData: FormData) {
    const result = roleSchema.safeParse({
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
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>Define a new role with specific permissions.</DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='role-name' className='text-sm font-medium'>
              Role Name
            </label>
            <Input id='role-name' name='name' placeholder='e.g., Operator' />
            {errors['name'] != null && <p className='text-xs text-destructive'>{errors['name']}</p>}
          </div>
          <div className='space-y-2'>
            <label htmlFor='role-desc' className='text-sm font-medium'>
              Description
            </label>
            <Input id='role-desc' name='description' placeholder='Describe the role responsibilities' />
            {errors['description'] != null && <p className='text-xs text-destructive'>{errors['description']}</p>}
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit'>Create Role</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
