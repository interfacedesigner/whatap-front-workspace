import { MEMBER_STATUS_CONFIG, type Member } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

interface MembersTableProps {
  data: Member[];
  onRowClick?: (member: Member) => void;
}

export function MembersTable({ data, onRowClick }: MembersTableProps) {
  return (
    <div className='h-[480px] rounded-lg border overflow-hidden'>
      <DataTable
        data={data}
        getRowId={(row) => row.id}
        {...(onRowClick != null && { onRowClick })}
        enableSorting
        enableColumnResizing
      >
        <SelectRowColumn<Member> pinned='left' />
        <Column<Member>
          header='Name'
          accessorKey='name'
          size={220}
          align='left'
          render={(row) => (
            <div className='flex items-center gap-2 px-2'>
              <Avatar className='h-7 w-7'>
                <AvatarFallback className='text-xs'>{row.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className='text-sm font-medium'>{row.name}</span>
            </div>
          )}
        />
        <Column<Member> header='Email' accessorKey='email' size={250} align='left' />
        <Column<Member>
          header='Status'
          accessorKey='status'
          size={120}
          render={(row) => {
            const config = MEMBER_STATUS_CONFIG[row.status];
            return (
              <Badge variant='outline' className={config.className}>
                {config.label}
              </Badge>
            );
          }}
        />
        <Column<Member>
          header='Created'
          accessorKey='createdAt'
          size={140}
          render={(row) =>
            new Date(row.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          }
        />
      </DataTable>
    </div>
  );
}
