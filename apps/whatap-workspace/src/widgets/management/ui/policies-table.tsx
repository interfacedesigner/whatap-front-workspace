import type { Policy } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';

interface PoliciesTableProps {
  data: Policy[];
  onRowClick?: (policy: Policy) => void;
}

export function PoliciesTable({ data, onRowClick }: PoliciesTableProps) {
  return (
    <div className='h-[480px] rounded-lg border overflow-hidden'>
      <DataTable
        data={data}
        getRowId={(row) => row.id}
        {...(onRowClick != null && { onRowClick })}
        enableSorting
        enableColumnResizing
      >
        <SelectRowColumn<Policy> pinned='left' />
        <Column<Policy> header='Policy Name' accessorKey='name' size={220} align='left' />
        <Column<Policy> header='Description' accessorKey='description' size={350} align='left' />
        <Column<Policy>
          header='Roles'
          accessorKey='roleIds'
          size={100}
          enableSorting={false}
          render={(row) => <span className='text-sm text-muted-foreground'>{row.roleIds.length}</span>}
        />
        <Column<Policy>
          header='Created'
          accessorKey='createdAt'
          size={140}
          render={(row) => formatDate(row.createdAt)}
        />
      </DataTable>
    </div>
  );
}
