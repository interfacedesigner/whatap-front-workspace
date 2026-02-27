import {
  type PermissionDomain,
  deleteRole,
  getAllPermissions,
  getMembersByRoleId,
  getPermissionsByRoleId,
  getPoliciesByRoleId,
  getRoleById,
  getRoleImpact,
  updateRole,
} from '@/entities/management';
import {
  DeleteRoleDialog,
  RoleDetailHeader,
  RoleMembersTable,
  RolePermissionsTable,
  RolePoliciesTable,
} from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/roles/$roleId')({
  component: RoleDetailPage,
});

function RoleDetailPage() {
  const { wsid, roleId } = Route.useParams();
  const navigate = useNavigate();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [editPermissionIds, setEditPermissionIds] = useState<string[]>([]);

  const role = useMemo(() => getRoleById(roleId), [roleId, refreshKey]);
  const policies = useMemo(() => getPoliciesByRoleId(roleId), [roleId, refreshKey]);
  const members = useMemo(() => getMembersByRoleId(roleId), [roleId, refreshKey]);
  const permissions = useMemo(() => getPermissionsByRoleId(roleId), [roleId, refreshKey]);
  const allPermissions = useMemo(() => getAllPermissions(), []);
  const impact = useMemo(() => getRoleImpact(roleId), [roleId, refreshKey]);

  // Suppress unused variable warning
  void refreshKey;

  const isCustom = role?.type === 'custom';

  const handleNameUpdate = useCallback(
    (name: string) => {
      updateRole(roleId, { name });
      setRefreshKey((k) => k + 1);
    },
    [roleId],
  );

  const handleDescriptionUpdate = useCallback(
    (description: string) => {
      updateRole(roleId, { description });
      setRefreshKey((k) => k + 1);
    },
    [roleId],
  );

  const handleToggleEditPermissions = useCallback(() => {
    if (role) {
      setEditPermissionIds([...role.permissionIds]);
      setIsEditingPermissions(true);
    }
  }, [role]);

  const handlePermissionToggle = useCallback((permissionId: string) => {
    setEditPermissionIds((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    );
  }, []);

  const handleDomainToggleAll = useCallback((_domain: PermissionDomain, domainPermissionIds: string[]) => {
    setEditPermissionIds((prev) => {
      const domainSet = new Set(domainPermissionIds);
      const currentlySelected = prev.filter((id) => domainSet.has(id));
      const allSelected = currentlySelected.length === domainPermissionIds.length;

      if (allSelected) {
        return prev.filter((id) => !domainSet.has(id));
      } else {
        const withoutDomain = prev.filter((id) => !domainSet.has(id));
        return [...withoutDomain, ...domainPermissionIds];
      }
    });
  }, []);

  const handleSavePermissions = useCallback(() => {
    if (editPermissionIds.length === 0) {
      return;
    }
    updateRole(roleId, { permissionIds: editPermissionIds });
    setIsEditingPermissions(false);
    setRefreshKey((k) => k + 1);
  }, [roleId, editPermissionIds]);

  const handleCancelEditPermissions = useCallback(() => {
    setIsEditingPermissions(false);
    setEditPermissionIds([]);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteRole(roleId);
    setIsDeleteOpen(false);
    void navigate({
      to: '/ws/$wsid/management/roles',
      params: { wsid },
    });
  }, [roleId, navigate, wsid]);

  if (!role) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>Role not found</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <RoleDetailHeader
        role={role}
        wsid={wsid}
        {...(isCustom && {
          onNameUpdate: handleNameUpdate,
          onDescriptionUpdate: handleDescriptionUpdate,
          onDeleteClick: () => setIsDeleteOpen(true),
        })}
      />
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
      <RolePermissionsTable
        permissions={permissions}
        {...(isCustom && {
          isEditable: true,
          isEditing: isEditingPermissions,
          allPermissions,
          selectedPermissionIds: editPermissionIds,
          onToggleEdit: handleToggleEditPermissions,
          onPermissionToggle: handlePermissionToggle,
          onDomainToggleAll: handleDomainToggleAll,
          onSavePermissions: handleSavePermissions,
          onCancelEdit: handleCancelEditPermissions,
        })}
      />

      {/* Delete Dialog — only for custom roles */}
      {isCustom && (
        <DeleteRoleDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          role={role}
          impact={impact}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
