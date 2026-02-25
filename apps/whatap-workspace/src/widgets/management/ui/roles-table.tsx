import type { Role } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Badge } from '@/shared/components/ui/badge';

interface RolesTableProps {
  data: Role[];
  onRowClick?: (role: Role) => void;
}

export function RolesTable({ data, onRowClick }: RolesTableProps) {
  return (
    <div className='h-[480px] rounded-lg border overflow-hidden'>
      <DataTable
        data={data}
        getRowId={(row) => row.id}
        {...(onRowClick != null && { onRowClick })}
        enableSorting
        enableColumnResizing
      >
        <SelectRowColumn<Role> pinned='left' />
        <Column<Role> header='Role Name' accessorKey='name' size={200} align='left' />
        <Column<Role> header='Description' accessorKey='description' size={320} align='left' />
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
        <Column<Role>
          header='Permissions'
          accessorKey='permissionIds'
          size={110}
          enableSorting={false}
          render={(row) => <span className='text-sm text-muted-foreground'>{row.permissionIds.length}</span>}
        />
        <Column<Role> header='Created' accessorKey='createdAt' size={140} render={(row) => formatDate(row.createdAt)} />
      </DataTable>
    </div>
  );
}
