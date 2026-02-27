import type { Policy } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Column, DataTable } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';

interface MemberPoliciesTableProps {
  policies: Policy[];
  wsid: string;
  onPolicyClick?: (policy: Policy) => void;
  onAddPolicyClick?: () => void;
  onRemovePolicy?: (policyId: string) => void;
}

function PoliciesTableWithRemove({
  policies,
  onPolicyClick,
  onRemovePolicy,
}: {
  policies: Policy[];
  onPolicyClick?: (policy: Policy) => void;
  onRemovePolicy: (policyId: string) => void;
}) {
  return (
    <DataTable
      data={policies}
      getRowId={(row) => row.id}
      {...(onPolicyClick != null && { onRowClick: onPolicyClick })}
      enableSorting
    >
      <Column<Policy> header='Name' accessorKey='name' size={180} align='left' />
      <Column<Policy> header='Description' accessorKey='description' size={280} align='left' />
      <Column<Policy> header='Created' accessorKey='createdAt' size={140} render={(row) => formatDate(row.createdAt)} />
      <Column<Policy>
        header=''
        accessorKey='id'
        size={60}
        render={(row) => (
          <Button
            variant='ghost'
            size='icon'
            className='h-7 w-7 text-muted-foreground hover:text-destructive'
            onClick={(e) => {
              e.stopPropagation();
              onRemovePolicy(row.id);
            }}
          >
            <Trash2 className='h-3.5 w-3.5' />
          </Button>
        )}
      />
    </DataTable>
  );
}

function PoliciesTableReadOnly({
  policies,
  onPolicyClick,
}: {
  policies: Policy[];
  onPolicyClick?: (policy: Policy) => void;
}) {
  return (
    <DataTable
      data={policies}
      getRowId={(row) => row.id}
      {...(onPolicyClick != null && { onRowClick: onPolicyClick })}
      enableSorting
    >
      <Column<Policy> header='Name' accessorKey='name' size={180} align='left' />
      <Column<Policy> header='Description' accessorKey='description' size={280} align='left' />
      <Column<Policy> header='Created' accessorKey='createdAt' size={140} render={(row) => formatDate(row.createdAt)} />
    </DataTable>
  );
}

export function MemberPoliciesTable({
  policies,
  wsid,
  onPolicyClick,
  onAddPolicyClick,
  onRemovePolicy,
}: MemberPoliciesTableProps) {
  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between space-y-0'>
        <CardTitle className='text-base'>Assigned Policies ({policies.length})</CardTitle>
        <div className='flex items-center gap-2'>
          {onAddPolicyClick && (
            <Button variant='outline' size='sm' className='gap-1 text-xs' onClick={onAddPolicyClick}>
              <Plus className='h-3.5 w-3.5' />
              Add Policy
            </Button>
          )}
          <Link to='/ws/$wsid/management/policies' params={{ wsid }}>
            <Button variant='ghost' size='sm' className='gap-1 text-xs text-muted-foreground'>
              Policy Management <ArrowRight className='h-3.5 w-3.5' />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {policies.length === 0 ? (
          <p className='py-6 text-center text-sm text-muted-foreground'>No policies assigned</p>
        ) : (
          <div className='max-h-[320px] rounded-lg border overflow-hidden'>
            {onRemovePolicy != null ? (
              <PoliciesTableWithRemove
                policies={policies}
                {...(onPolicyClick != null && { onPolicyClick })}
                onRemovePolicy={onRemovePolicy}
              />
            ) : (
              <PoliciesTableReadOnly policies={policies} {...(onPolicyClick != null && { onPolicyClick })} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
