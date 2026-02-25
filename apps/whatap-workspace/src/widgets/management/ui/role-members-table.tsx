import type { Member } from '@/entities/management';
import { MEMBER_STATUS_CONFIG, formatDate } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface RoleMembersTableProps {
  members: Member[];
  wsid: string;
  onMemberClick?: (member: Member) => void;
}

export function RoleMembersTable({ members, wsid, onMemberClick }: RoleMembersTableProps) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Members ({members.length})</CardTitle>
        <Link to='/ws/$wsid/management/members' params={{ wsid }}>
          <Button variant='ghost' size='sm' className='gap-1 text-xs text-muted-foreground'>
            Member Management <ArrowRight className='h-3.5 w-3.5' />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No members linked</p>
        ) : (
          <div className='max-h-[320px] rounded-lg border overflow-hidden'>
            <DataTable
              data={members}
              getRowId={(row) => row.id}
              {...(onMemberClick != null && { onRowClick: onMemberClick })}
              enableSorting
            >
              <SelectRowColumn<Member> pinned='left' />
              <Column<Member>
                header='Name'
                accessorKey='name'
                size={180}
                align='left'
                render={(row) => (
                  <div className='flex items-center gap-2 px-2'>
                    <Avatar className='h-6 w-6'>
                      <AvatarFallback className='text-xs'>{row.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className='text-sm'>{row.name}</span>
                  </div>
                )}
              />
              <Column<Member> header='Email' accessorKey='email' size={220} align='left' />
              <Column<Member>
                header='Status'
                accessorKey='status'
                size={100}
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
                size={130}
                render={(row) => formatDate(row.createdAt)}
              />
            </DataTable>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
