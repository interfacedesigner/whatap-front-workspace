import type { Permission, PermissionDomain } from '@/entities/management';
import {
  Column,
  DataTable,
  SelectRowColumn,
  TablePagination,
  useClientPagination,
} from '@/shared/components/data-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Pencil, Save, X } from 'lucide-react';

import { RolePermissionMatrix } from './role-permission-matrix';

interface RolePermissionsTableProps {
  permissions: Permission[];
  // Edit mode props
  allPermissions?: Permission[];
  selectedPermissionIds?: string[];
  isEditable?: boolean;
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onPermissionToggle?: (permissionId: string) => void;
  onDomainToggleAll?: (domain: PermissionDomain, permissionIds: string[]) => void;
  onSavePermissions?: () => void;
  onCancelEdit?: () => void;
}

export function RolePermissionsTable({
  permissions,
  allPermissions,
  selectedPermissionIds,
  isEditable = false,
  isEditing = false,
  onToggleEdit,
  onPermissionToggle,
  onDomainToggleAll,
  onSavePermissions,
  onCancelEdit,
}: RolePermissionsTableProps) {
  const pagination = useClientPagination(permissions);

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-base font-medium'>Permissions ({permissions.length})</h3>
          {isEditable && !isEditing && onToggleEdit && (
            <Button variant='outline' size='sm' className='gap-1.5' onClick={onToggleEdit}>
              <Pencil className='h-3.5 w-3.5' />
              Edit Permissions
            </Button>
          )}
          {isEditing && (
            <div className='flex items-center gap-2'>
              <Button variant='outline' size='sm' className='gap-1.5' onClick={onCancelEdit}>
                <X className='h-3.5 w-3.5' />
                Cancel
              </Button>
              <Button size='sm' className='gap-1.5' onClick={onSavePermissions}>
                <Save className='h-3.5 w-3.5' />
                Save
              </Button>
            </div>
          )}
        </div>
        {isEditing && allPermissions && selectedPermissionIds && onPermissionToggle && onDomainToggleAll ? (
          <RolePermissionMatrix
            permissions={allPermissions}
            selectedPermissionIds={selectedPermissionIds}
            onPermissionToggle={onPermissionToggle}
            onDomainToggleAll={onDomainToggleAll}
          />
        ) : permissions.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No permissions assigned</p>
        ) : (
          <div className='rounded-lg border overflow-hidden'>
            <DataTable data={pagination.paginatedData} getRowId={(row) => row.id} enableSorting>
              <SelectRowColumn<Permission> pinned='left' />
              <Column<Permission> header='Permission' accessorKey='name' size={200} align='left' />
              <Column<Permission>
                header='Domain'
                accessorKey='domain'
                size={130}
                render={(row) => (
                  <Badge variant='outline' className='font-mono text-xs'>
                    {row.domain}
                  </Badge>
                )}
              />
              <Column<Permission>
                header='Action'
                accessorKey='action'
                size={100}
                render={(row) => {
                  const colors: Record<string, string> = {
                    READ: 'bg-blue-500/10 text-blue-700 border-blue-200',
                    CREATE: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
                    UPDATE: 'bg-amber-500/10 text-amber-700 border-amber-200',
                    DELETE: 'bg-red-500/10 text-red-700 border-red-200',
                  };
                  return (
                    <Badge variant='outline' className={colors[row.action] ?? ''}>
                      {row.action}
                    </Badge>
                  );
                }}
              />
              <Column<Permission>
                header='Scope'
                accessorKey='scope'
                size={130}
                render={(row) => (
                  <Badge variant={row.scope === 'cross-workspace' ? 'default' : 'secondary'}>
                    {row.scope === 'cross-workspace' ? 'Cross-WS' : 'Workspace'}
                  </Badge>
                )}
              />
              <Column<Permission> header='Description' accessorKey='description' size={260} align='left' />
            </DataTable>
            {pagination.showPagination && <TablePagination {...pagination} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
