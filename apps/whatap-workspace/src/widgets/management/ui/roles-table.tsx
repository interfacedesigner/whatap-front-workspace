import { ROLE_TYPE_CONFIG, type Role } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { RolesEmptyState } from './roles-empty-state';

interface RolesTableProps {
  data: Role[];
  onRowClick?: (role: Role) => void;
  policiesCountMap?: Record<string, number>;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onCreateClick: () => void;
}

export function RolesTable({
  data,
  onRowClick,
  policiesCountMap,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onCreateClick,
}: RolesTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount === 0) {
    return <RolesEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className='flex flex-col gap-3 flex-1 min-h-0'>
      <div className='flex-1 min-h-[200px] rounded-lg border overflow-hidden'>
        <DataTable
          data={data}
          getRowId={(row) => row.id}
          {...(onRowClick != null && { onRowClick })}
          enableSorting
          enableColumnResizing
        >
          <SelectRowColumn<Role> pinned='left' />
          <Column<Role> header='Role Name' accessorKey='name' size={200} align='left' />
          <Column<Role>
            header='Type'
            accessorKey='type'
            size={110}
            align='left'
            render={(row) => {
              const config = ROLE_TYPE_CONFIG[row.type];
              return (
                <Badge variant='outline' className={config.className}>
                  {config.label}
                </Badge>
              );
            }}
          />
          <Column<Role> header='Description' accessorKey='description' size={280} align='left' />
          <Column<Role>
            header='Scope'
            accessorKey='scope'
            size={140}
            align='left'
            render={(row) => (
              <Badge variant={row.scope === 'cross-workspace' ? 'default' : 'secondary'}>
                {row.scope === 'cross-workspace' ? 'Cross-WS' : 'Workspace'}
              </Badge>
            )}
          />
          <Column<Role>
            header='Policies'
            accessorKey='id'
            id='policiesCount'
            size={100}
            align='left'
            enableSorting={false}
            render={(row) => {
              const count = policiesCountMap?.[row.id] ?? 0;
              return <span className='text-sm text-muted-foreground'>{count}</span>;
            }}
          />
          <Column<Role>
            header='Permissions'
            accessorKey='permissionIds'
            size={110}
            align='left'
            enableSorting={false}
            render={(row) => <span className='text-sm text-muted-foreground'>{row.permissionIds.length}</span>}
          />
          <Column<Role>
            header='Created'
            accessorKey='createdAt'
            size={140}
            align='left'
            render={(row) => formatDate(row.createdAt)}
          />
        </DataTable>
      </div>

      {/* Pagination Controls */}
      <div className='flex items-center justify-between px-2'>
        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>Rows per page</span>
          <Select value={String(pageSize)} onValueChange={(val) => onPageSizeChange(Number(val))}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>
            Page {page} of {totalPages}
          </span>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
