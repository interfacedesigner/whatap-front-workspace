import type { Role } from '@/entities/management';
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
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface PolicyRolesTableProps {
  roles: Role[];
  wsid: string;
  onRoleClick?: (role: Role) => void;
}

export function PolicyRolesTable({ roles, wsid, onRoleClick }: PolicyRolesTableProps) {
  const pagination = useClientPagination(roles);

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-base font-medium'>Roles ({roles.length})</h3>
          <Link to='/ws/$wsid/management/roles' params={{ wsid }}>
            <Button variant='ghost' size='sm' className='gap-1 text-xs text-muted-foreground'>
              Role Management <ArrowRight className='h-3.5 w-3.5' />
            </Button>
          </Link>
        </div>
        {roles.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No roles assigned</p>
        ) : (
          <div className='rounded-lg border overflow-hidden'>
            <DataTable
              data={pagination.paginatedData}
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
            {pagination.showPagination && <TablePagination {...pagination} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
