import { type PermissionDomain, addRole, getAllPermissions, isRoleNameDuplicate } from '@/entities/management';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { RolePermissionMatrix } from '@/widgets/management';
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/roles/create')({
  component: CreateRolePage,
});

const roleNameSchema = z
  .string()
  .min(3, 'Role name must be at least 3 characters')
  .max(50, 'Role name must be at most 50 characters')
  .regex(/^[a-zA-Z0-9 -]+$/, 'Role name can only contain letters, numbers, spaces, and hyphens');

const roleDescriptionSchema = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(200, 'Description must be at most 200 characters');

function CreateRolePage() {
  const { wsid } = Route.useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allPermissions = useMemo(() => getAllPermissions(), []);

  const handlePermissionToggle = useCallback((permissionId: string) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    );
  }, []);

  const handleDomainToggleAll = useCallback((_domain: PermissionDomain, domainPermissionIds: string[]) => {
    setSelectedPermissionIds((prev) => {
      const domainSet = new Set(domainPermissionIds);
      const currentlySelected = prev.filter((id) => domainSet.has(id));
      const allSelected = currentlySelected.length === domainPermissionIds.length;

      if (allSelected) {
        // Deselect all in this domain
        return prev.filter((id) => !domainSet.has(id));
      } else {
        // Select all in this domain
        const withoutDomain = prev.filter((id) => !domainSet.has(id));
        return [...withoutDomain, ...domainPermissionIds];
      }
    });
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameResult = roleNameSchema.safeParse(name);
    if (!nameResult.success) {
      newErrors.name = nameResult.error.issues[0]?.message ?? 'Invalid name';
    } else if (isRoleNameDuplicate(name)) {
      newErrors.name = 'A role with this name already exists';
    }

    const descResult = roleDescriptionSchema.safeParse(description);
    if (!descResult.success) {
      newErrors.description = descResult.error.issues[0]?.message ?? 'Invalid description';
    }

    if (selectedPermissionIds.length === 0) {
      newErrors.permissions = 'At least one permission must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      addRole({
        name: name.trim(),
        description: description.trim(),
        permissionIds: selectedPermissionIds,
      });

      void navigate({
        to: '/ws/$wsid/management/roles',
        params: { wsid },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-1 text-sm text-muted-foreground'>
        <Link to='/ws/$wsid/management/roles' params={{ wsid }} className='hover:text-foreground transition-colors'>
          Roles
        </Link>
        <ChevronRight className='h-4 w-4' />
        <span className='text-foreground font-medium'>Create Role</span>
      </nav>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Role</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='role-name'>Role Name</Label>
            <Input
              id='role-name'
              placeholder='e.g., Infrastructure Manager'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='role-description'>Description</Label>
            <Textarea
              id='role-description'
              placeholder='Describe the purpose and scope of this role...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className='text-sm text-red-500'>{errors.description}</p>}
          </div>

          {/* Permission Matrix */}
          <div className='space-y-2'>
            <Label>Permissions</Label>
            {errors.permissions && <p className='text-sm text-red-500'>{errors.permissions}</p>}
            <RolePermissionMatrix
              permissions={allPermissions}
              selectedPermissionIds={selectedPermissionIds}
              onPermissionToggle={handlePermissionToggle}
              onDomainToggleAll={handleDomainToggleAll}
            />
          </div>

          {/* Actions */}
          <div className='flex items-center justify-end gap-3 pt-4 border-t'>
            <Button
              variant='outline'
              onClick={() =>
                void navigate({
                  to: '/ws/$wsid/management/roles',
                  params: { wsid },
                })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Role'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
