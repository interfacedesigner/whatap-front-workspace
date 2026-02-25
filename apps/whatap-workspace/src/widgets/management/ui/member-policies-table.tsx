import type { Policy } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Column, DataTable, SelectRowColumn } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface MemberPoliciesTableProps {
  policies: Policy[];
  wsid: string;
  onPolicyClick?: (policy: Policy) => void;
}

export function MemberPoliciesTable({ policies, wsid, onPolicyClick }: MemberPoliciesTableProps) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Assigned Policies ({policies.length})</CardTitle>
        <Link to='/ws/$wsid/management/policies' params={{ wsid }}>
          <Button variant='ghost' size='sm' className='gap-1 text-xs text-muted-foreground'>
            Policy Management <ArrowRight className='h-3.5 w-3.5' />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {policies.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No policies assigned</p>
        ) : (
          <div className='max-h-[320px] rounded-lg border overflow-hidden'>
            <DataTable
              data={policies}
              getRowId={(row) => row.id}
              {...(onPolicyClick != null && { onRowClick: onPolicyClick })}
              enableSorting
            >
              <SelectRowColumn<Policy> pinned='left' />
              <Column<Policy> header='Name' accessorKey='name' size={180} align='left' />
              <Column<Policy> header='Description' accessorKey='description' size={280} align='left' />
              <Column<Policy>
                header='Created'
                accessorKey='createdAt'
                size={140}
                render={(row) => formatDate(row.createdAt)}
              />
            </DataTable>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
