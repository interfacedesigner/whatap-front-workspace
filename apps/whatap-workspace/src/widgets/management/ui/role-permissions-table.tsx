import type { Permission } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface RolePermissionsTableProps {
  permissions: Permission[];
}

export function RolePermissionsTable({ permissions }: RolePermissionsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Permissions ({permissions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {permissions.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No permissions assigned</p>
        ) : (
          <div className='max-h-[360px] rounded-lg border overflow-hidden'>
            <DataTable data={permissions} getRowId={(row) => row.id} enableSorting>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
