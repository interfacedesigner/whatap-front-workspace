import {
  addMember,
  getAllMembers,
  getAllPolicies,
  getMemberByEmail,
  getRoleNamesByMemberId,
  getRolesByPolicyId,
} from '@/entities/management';
import type { Role } from '@/entities/management';
import { InviteMemberDialog, ManagementPageHeader, MembersRoleFilter, MembersTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/members/')({
  component: MembersPage,
});

function MembersPage() {
  const { wsid } = Route.useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const members = useMemo(() => getAllMembers(), [refreshKey]);

  // Compute role names map for all members
  const roleNamesMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const m of members) {
      map[m.id] = getRoleNamesByMemberId(m.id);
    }
    return map;
  }, [members]);

  // Get all unique role names for filter
  const allRoleNames = useMemo(() => {
    const nameSet = new Set<string>();
    for (const names of Object.values(roleNamesMap)) {
      for (const n of names) {
        nameSet.add(n);
      }
    }
    return Array.from(nameSet).sort();
  }, [roleNamesMap]);

  // Filter members
  const filteredMembers = useMemo(() => {
    let result = members;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
    }

    // Role filter
    if (roleFilter !== 'all') {
      result = result.filter((m) => roleNamesMap[m.id]?.includes(roleFilter));
    }

    return result;
  }, [members, searchQuery, roleFilter, roleNamesMap]);

  // Pagination
  const totalCount = filteredMembers.length;
  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, page, pageSize]);

  // Reset page when filters change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((value: string) => {
    setRoleFilter(value);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  // Invite logic
  const allPolicies = useMemo(() => getAllPolicies(), []);

  const rolesMap = useMemo(() => {
    const map: Record<string, Role[]> = {};
    for (const policy of allPolicies) {
      map[policy.id] = getRolesByPolicyId(policy.id);
    }
    return map;
  }, [allPolicies]);

  const handleInvite = useCallback(
    (data: { email: string; name?: string; policyIds: string[]; welcomeMessage?: string }) => {
      const payload: { email: string; name?: string; policyIds: string[]; welcomeMessage?: string } = {
        email: data.email,
        policyIds: data.policyIds,
      };
      if (data.name) {
        payload.name = data.name;
      }
      if (data.welcomeMessage) {
        payload.welcomeMessage = data.welcomeMessage;
      }
      addMember(payload);
      setRefreshKey((k) => k + 1);
    },
    [],
  );

  const checkEmailExists = useCallback((email: string) => {
    return !!getMemberByEmail(email);
  }, []);

  return (
    <div className='flex flex-col gap-6 flex-1 min-h-0'>
      <ManagementPageHeader
        title='Members'
        description='Manage workspace members and their access permissions'
        badge={members.length}
        searchPlaceholder='Search members...'
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        ctaLabel='+ Invite Member'
        onCtaClick={() => setIsInviteOpen(true)}
        filterElement={<MembersRoleFilter roles={allRoleNames} value={roleFilter} onChange={handleRoleFilterChange} />}
      />
      <MembersTable
        data={paginatedMembers}
        roleNames={roleNamesMap}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onInviteClick={() => setIsInviteOpen(true)}
        onRowClick={(member) =>
          void navigate({
            to: '/ws/$wsid/management/members/$memberId',
            params: { wsid, memberId: member.id },
          })
        }
      />
      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        policies={allPolicies}
        rolesMap={rolesMap}
        onSubmit={handleInvite}
        checkEmailExists={checkEmailExists}
      />
    </div>
  );
}
