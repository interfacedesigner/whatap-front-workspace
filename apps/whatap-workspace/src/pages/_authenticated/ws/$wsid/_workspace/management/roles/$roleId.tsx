import { getMembersByRoleId, getPermissionsByRoleId, getPoliciesByRoleId, getRoleById } from '@/entities/management';
import { RoleDetailHeader, RoleMembersTable, RolePermissionsTable, RolePoliciesTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/roles/$roleId')({
  component: RoleDetailPage,
});

function RoleDetailPage() {
  const { wsid, roleId } = Route.useParams();
  const navigate = useNavigate();

  const role = useMemo(() => getRoleById(roleId), [roleId]);
  const policies = useMemo(() => getPoliciesByRoleId(roleId), [roleId]);
  const members = useMemo(() => getMembersByRoleId(roleId), [roleId]);
  const permissions = useMemo(() => getPermissionsByRoleId(roleId), [roleId]);

  if (!role) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>Role not found</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <RoleDetailHeader role={role} wsid={wsid} />
      <RolePoliciesTable
        policies={policies}
        wsid={wsid}
        onPolicyClick={(policy) =>
          void navigate({
            to: '/ws/$wsid/management/policies/$policyId',
            params: { wsid, policyId: policy.id },
          })
        }
      />
      <RoleMembersTable
        members={members}
        wsid={wsid}
        onMemberClick={(member) =>
          void navigate({
            to: '/ws/$wsid/management/members/$memberId',
            params: { wsid, memberId: member.id },
          })
        }
      />
      <RolePermissionsTable permissions={permissions} />
    </div>
  );
}
