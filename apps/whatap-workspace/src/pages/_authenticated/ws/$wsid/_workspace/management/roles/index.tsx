import { type RoleType, getAllPolicies, getAllRoles } from '@/entities/management';
import { ManagementPageHeader, RolesTable, RolesTypeFilter } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/roles/')({
  component: RolesPage,
});

function RolesPage() {
  const { wsid } = Route.useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | RoleType>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const roles = useMemo(() => getAllRoles(), [refreshKey]);
  const policies = useMemo(() => getAllPolicies(), [refreshKey]);

  // Calculate policies count per role
  const policiesCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const role of roles) {
      map[role.id] = policies.filter((p) => p.roleIds.includes(role.id)).length;
    }
    return map;
  }, [roles, policies]);

  // Filter by search + type, then sort: default roles first
  const filteredRoles = useMemo(() => {
    let result = roles;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((r) => r.type === typeFilter);
    }

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }

    // Sort: default roles first, then by createdAt descending
    return [...result].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'default' ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [roles, searchQuery, typeFilter]);

  // Paginated data
  const totalCount = filteredRoles.length;
  const paginatedRoles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRoles.slice(start, start + pageSize);
  }, [filteredRoles, page, pageSize]);

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value as 'all' | RoleType);
    setPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const handleCreateClick = () => {
    void navigate({
      to: '/ws/$wsid/management/roles/create',
      params: { wsid },
    });
  };

  // Suppress unused variable warning — refreshKey setter is used for future mutations
  void refreshKey;
  void setRefreshKey;

  return (
    <div className='flex flex-col gap-6 flex-1 min-h-0'>
      <ManagementPageHeader
        title='Roles'
        description='Manage roles and their associated permissions'
        searchPlaceholder='Search roles...'
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        ctaLabel='+ Create Role'
        onCtaClick={handleCreateClick}
        badge={roles.length}
        filterElement={<RolesTypeFilter value={typeFilter} onChange={handleTypeFilterChange} />}
      />
      <RolesTable
        data={paginatedRoles}
        policiesCountMap={policiesCountMap}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        onCreateClick={handleCreateClick}
        onRowClick={(role) =>
          void navigate({
            to: '/ws/$wsid/management/roles/$roleId',
            params: { wsid, roleId: role.id },
          })
        }
      />
    </div>
  );
}
