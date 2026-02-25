import { getMemberById, getPoliciesByMemberId, getRolesByMemberId } from '@/entities/management';
import { MemberDetailHeader, MemberPoliciesTable, MemberRolesTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/members/$memberId')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { wsid, memberId } = Route.useParams();
  const navigate = useNavigate();

  const member = useMemo(() => getMemberById(memberId), [memberId]);
  const policies = useMemo(() => getPoliciesByMemberId(memberId), [memberId]);
  const roles = useMemo(() => getRolesByMemberId(memberId), [memberId]);

  if (!member) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>Member not found</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <MemberDetailHeader member={member} wsid={wsid} />
      <MemberPoliciesTable
        policies={policies}
        wsid={wsid}
        onPolicyClick={(policy) =>
          void navigate({
            to: '/ws/$wsid/management/policies/$policyId',
            params: { wsid, policyId: policy.id },
          })
        }
      />
      <MemberRolesTable
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
