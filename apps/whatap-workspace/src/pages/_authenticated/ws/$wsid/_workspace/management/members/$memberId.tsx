import {
  addPolicyToMember,
  deleteMember,
  getAllPolicies,
  getMemberById,
  getPermissionsByMemberId,
  getPoliciesByMemberId,
  getRolesByMemberId,
  getRolesByPolicyId,
  getUnassignedPolicies,
  removePolicyFromMember,
  updateMember,
} from '@/entities/management';
import type { Role } from '@/entities/management';
import {
  AddPolicyToMemberDialog,
  DeactivateMemberDialog,
  DeleteMemberDialog,
  MemberDetailHeader,
  MemberEffectivePermissions,
  MemberPoliciesTable,
  MemberRolesTable,
} from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/members/$memberId')({
  component: MemberDetailPage,
});

function MemberDetailPage() {
  const { wsid, memberId } = Route.useParams();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const member = useMemo(() => getMemberById(memberId), [memberId, refreshKey]);
  const policies = useMemo(() => getPoliciesByMemberId(memberId), [memberId, refreshKey]);
  const roles = useMemo(() => getRolesByMemberId(memberId), [memberId, refreshKey]);
  const effectivePermissions = useMemo(() => getPermissionsByMemberId(memberId), [memberId, refreshKey]);
  const availablePolicies = useMemo(() => getUnassignedPolicies(memberId), [memberId, refreshKey]);

  // Roles map for add-policy dialog
  const rolesMap = useMemo(() => {
    const allPolicies = getAllPolicies();
    const map: Record<string, Role[]> = {};
    for (const policy of allPolicies) {
      map[policy.id] = getRolesByPolicyId(policy.id);
    }
    return map;
  }, [refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Handlers
  const handleNameUpdate = useCallback(
    (name: string) => {
      updateMember(memberId, { name });
      refresh();
    },
    [memberId, refresh],
  );

  const handleAddPolicy = useCallback(
    (policyIds: string[]) => {
      for (const policyId of policyIds) {
        addPolicyToMember(memberId, policyId);
      }
      refresh();
    },
    [memberId, refresh],
  );

  const handleRemovePolicy = useCallback(
    (policyId: string) => {
      removePolicyFromMember(memberId, policyId);
      refresh();
    },
    [memberId, refresh],
  );

  const handleConfirmDelete = useCallback(() => {
    deleteMember(memberId);
    void navigate({
      to: '/ws/$wsid/management/members',
      params: { wsid },
    });
  }, [memberId, navigate, wsid]);

  const handleConfirmDeactivate = useCallback(() => {
    if (!member) {
      return;
    }
    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    updateMember(memberId, { status: newStatus });
    setIsDeactivateOpen(false);
    refresh();
  }, [member, memberId, refresh]);

  if (!member) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>Member not found</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <MemberDetailHeader
        member={member}
        wsid={wsid}
        onNameUpdate={handleNameUpdate}
        onDeleteClick={() => setIsDeleteOpen(true)}
        onDeactivateClick={() => setIsDeactivateOpen(true)}
      />
      <MemberPoliciesTable
        policies={policies}
        wsid={wsid}
        onPolicyClick={(policy) =>
          void navigate({
            to: '/ws/$wsid/management/policies/$policyId',
            params: { wsid, policyId: policy.id },
          })
        }
        onAddPolicyClick={() => setIsAddPolicyOpen(true)}
        onRemovePolicy={handleRemovePolicy}
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
      <MemberEffectivePermissions permissions={effectivePermissions} />

      {/* Dialogs */}
      <AddPolicyToMemberDialog
        open={isAddPolicyOpen}
        onOpenChange={setIsAddPolicyOpen}
        availablePolicies={availablePolicies}
        rolesMap={rolesMap}
        onSubmit={handleAddPolicy}
      />
      <DeleteMemberDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        member={member}
        onConfirm={handleConfirmDelete}
      />
      <DeactivateMemberDialog
        open={isDeactivateOpen}
        onOpenChange={setIsDeactivateOpen}
        member={member}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}
