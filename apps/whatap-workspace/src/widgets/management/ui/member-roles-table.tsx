import type { Role } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface MemberRolesTableProps {
  roles: Role[];
  wsid: string;
  onRoleClick?: (role: Role) => void;
}

export function MemberRolesTable({ roles, wsid, onRoleClick }: MemberRolesTableProps) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Effective Roles ({roles.length})</CardTitle>
        <Link to='/ws/$wsid/management/roles' params={{ wsid }}>
          <Button variant='ghost' size='sm' className='gap-1 text-xs text-muted-foreground'>
            Role Management <ArrowRight className='h-3.5 w-3.5' />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {roles.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No roles assigned</p>
        ) : (
          <div className='max-h-[320px] rounded-lg border overflow-hidden'>
            <DataTable
              data={roles}
              getRowId={(row) => row.id}
              {...(onRoleClick != null && { onRowClick: onRoleClick })}
              enableSorting
            >
              <SelectRowColumn<Role> pinned='left' />
              <Column<Role> header='Name' accessorKey='name' size={180} align='left' />
              <Column<Role> header='Description' accessorKey='description' size={280} align='left' />
              <Column<Role>
                header='Scope'
                accessorKey='scope'
                size={140}
                render={(row) => (
                  <Badge variant={row.scope === 'cross-workspace' ? 'default' : 'secondary'}>
                    {row.scope === 'cross-workspace' ? 'Cross-WS' : 'Workspace'}
                  </Badge>
                )}
              />
            </DataTable>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
