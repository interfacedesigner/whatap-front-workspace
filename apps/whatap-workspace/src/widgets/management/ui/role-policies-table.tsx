import type { Policy } from '@/entities/management';
import { formatDate } from '@/entities/management';
import {
  Column,
  DataTable,
  SelectRowColumn,
  TablePagination,
  useClientPagination,
} from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface RolePoliciesTableProps {
  policies: Policy[];
  wsid: string;
  onPolicyClick?: (policy: Policy) => void;
}

export function RolePoliciesTable({ policies, wsid, onPolicyClick }: RolePoliciesTableProps) {
  const pagination = useClientPagination(policies);

  return (
    <Card>
      <CardContent>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-base font-medium'>Policies ({policies.length})</h3>
          <Link to='/ws/$wsid/management/policies' params={{ wsid }}>
            <Button variant='ghost' size='sm' className='gap-1 text-xs text-muted-foreground'>
              Policy Management <ArrowRight className='h-3.5 w-3.5' />
            </Button>
          </Link>
        </div>
        {policies.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No policies linked</p>
        ) : (
          <div className='rounded-lg border overflow-hidden'>
            <DataTable
              data={pagination.paginatedData}
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
            {pagination.showPagination && <TablePagination {...pagination} />}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
