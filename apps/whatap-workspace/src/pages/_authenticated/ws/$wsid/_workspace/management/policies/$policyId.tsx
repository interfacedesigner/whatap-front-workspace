import { getMembersByPolicyId, getPolicyById, getRolesByPolicyId } from '@/entities/management';
import { PolicyDetailHeader, PolicyMembersTable, PolicyRolesTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/policies/$policyId')({
  component: PolicyDetailPage,
});

function PolicyDetailPage() {
  const { wsid, policyId } = Route.useParams();
  const navigate = useNavigate();

  const policy = useMemo(() => getPolicyById(policyId), [policyId]);
  const members = useMemo(() => getMembersByPolicyId(policyId), [policyId]);
  const roles = useMemo(() => getRolesByPolicyId(policyId), [policyId]);

  if (!policy) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>Policy not found</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PolicyDetailHeader policy={policy} wsid={wsid} />
      <PolicyMembersTable
        members={members}
        wsid={wsid}
        onMemberClick={(member) =>
          void navigate({
            to: '/ws/$wsid/management/members/$memberId',
            params: { wsid, memberId: member.id },
          })
        }
      />
      <PolicyRolesTable
        roles={roles}
        wsid={wsid}
        onRoleClick={(role) =>
          void navigate({
            to: '/ws/$wsid/management/roles/$roleId',
            params: { wsid, roleId: role.id },
          })
        }
      />
    </div>
  );
}
