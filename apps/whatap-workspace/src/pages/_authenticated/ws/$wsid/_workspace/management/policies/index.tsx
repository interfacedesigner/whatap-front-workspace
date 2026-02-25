import { getAllPolicies } from '@/entities/management';
import { CreatePolicyDialog, ManagementPageHeader, PoliciesTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/policies/')({
  component: PoliciesPage,
});

function PoliciesPage() {
  const { wsid } = Route.useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const policies = useMemo(() => getAllPolicies(), []);

  const filteredPolicies = useMemo(() => {
    if (!searchQuery) {
      return policies;
    }
    const q = searchQuery.toLowerCase();
    return policies.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [policies, searchQuery]);

  return (
    <div className='space-y-6'>
      <ManagementPageHeader
        title='Policies'
        description='Manage access policies that define member permissions'
        searchPlaceholder='Search policies...'
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        ctaLabel='+ Create Policy'
        onCtaClick={() => setIsCreateOpen(true)}
      />
      <PoliciesTable
        data={filteredPolicies}
        onRowClick={(policy) =>
          void navigate({
            to: '/ws/$wsid/management/policies/$policyId',
            params: { wsid, policyId: policy.id },
          })
        }
      />
      <CreatePolicyDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
