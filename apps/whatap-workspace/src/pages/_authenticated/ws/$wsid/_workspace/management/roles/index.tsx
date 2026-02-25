import { getAllRoles } from '@/entities/management';
import { CreateRoleDialog, ManagementPageHeader, RolesTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/roles/')({
  component: RolesPage,
});

function RolesPage() {
  const { wsid } = Route.useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const roles = useMemo(() => getAllRoles(), []);

  const filteredRoles = useMemo(() => {
    if (!searchQuery) {
      return roles;
    }
    const q = searchQuery.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
  }, [roles, searchQuery]);

  return (
    <div className='space-y-6'>
      <ManagementPageHeader
        title='Roles'
        description='Manage roles and their associated permissions'
        searchPlaceholder='Search roles...'
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        ctaLabel='+ Create Role'
        onCtaClick={() => setIsCreateOpen(true)}
      />
      <RolesTable
        data={filteredRoles}
        onRowClick={(role) =>
          void navigate({
            to: '/ws/$wsid/management/roles/$roleId',
            params: { wsid, roleId: role.id },
          })
        }
      />
      <CreateRoleDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
