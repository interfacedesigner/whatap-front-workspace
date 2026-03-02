import { MEMBER_STATUS_CONFIG, type Member } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { MembersEmptyState } from './members-empty-state';

interface MembersTableProps {
  data: Member[];
  onRowClick?: (member: Member) => void;
  roleNames?: Record<string, string[]>;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onInviteClick: () => void;
}

export function MembersTable({
  data,
  onRowClick,
  roleNames,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onInviteClick,
}: MembersTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (totalCount === 0) {
    return <MembersEmptyState onInviteClick={onInviteClick} />;
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
          scrollableBody
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
            header='Roles'
            accessorKey='id'
            size={200}
            align='left'
            render={(row) => {
              const names = roleNames?.[row.id] ?? [];
              if (names.length === 0) {
                return <span className='text-xs text-muted-foreground'>No roles</span>;
              }
              return (
                <div className='flex flex-wrap gap-1'>
                  {names.slice(0, 2).map((name) => (
                    <Badge key={name} variant='secondary' className='text-[11px]'>
                      {name}
                    </Badge>
                  ))}
                  {names.length > 2 && (
                    <Badge variant='outline' className='text-[11px]'>
                      +{names.length - 2}
                    </Badge>
                  )}
                </div>
              );
            }}
          />
          <Column<Member>
            header='Status'
            accessorKey='status'
            size={120}
            align='left'
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
            header='Joined Date'
            accessorKey='createdAt'
            size={140}
            align='left'
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
