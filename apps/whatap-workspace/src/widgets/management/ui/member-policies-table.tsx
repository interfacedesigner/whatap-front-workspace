import type { Policy } from '@/entities/management';
import { formatDate } from '@/entities/management';
import { Column, DataTable, TablePagination, useClientPagination } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ConfirmActionDialog } from '@/shared/components/ui/confirm-action-dialog';
import { Link } from '@tanstack/react-router';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

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
  onRequestRemove,
}: {
  policies: Policy[];
  onPolicyClick?: (policy: Policy) => void;
  onRequestRemove: (policyId: string) => void;
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
              onRequestRemove(row.id);
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
  const [pendingRemovePolicyId, setPendingRemovePolicyId] = useState<string | null>(null);
  const pagination = useClientPagination(policies);

  const pendingPolicy = pendingRemovePolicyId ? policies.find((p) => p.id === pendingRemovePolicyId) : null;

  const handleConfirmRemove = useCallback(() => {
    if (pendingRemovePolicyId && onRemovePolicy) {
      onRemovePolicy(pendingRemovePolicyId);
    }
    setPendingRemovePolicyId(null);
  }, [pendingRemovePolicyId, onRemovePolicy]);

  return (
    <>
      <Card>
        <CardContent>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-base font-medium'>Assigned Policies ({policies.length})</h3>
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
          </div>
          {policies.length === 0 ? (
            <p className='py-6 text-center text-sm text-muted-foreground'>No policies assigned</p>
          ) : (
            <div className='rounded-lg border overflow-hidden'>
              {onRemovePolicy != null ? (
                <PoliciesTableWithRemove
                  policies={pagination.paginatedData}
                  {...(onPolicyClick != null && { onPolicyClick })}
                  onRequestRemove={setPendingRemovePolicyId}
                />
              ) : (
                <PoliciesTableReadOnly
                  policies={pagination.paginatedData}
                  {...(onPolicyClick != null && { onPolicyClick })}
                />
              )}
              {pagination.showPagination && <TablePagination {...pagination} />}
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmActionDialog
        open={pendingRemovePolicyId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingRemovePolicyId(null);
          }
        }}
        title='Remove Policy'
        description={`Are you sure you want to remove "${pendingPolicy?.name ?? ''}" from this member? The member will lose all permissions granted by this policy.`}
        confirmLabel='Remove'
        variant='destructive'
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
