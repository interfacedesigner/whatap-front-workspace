import { getAllMembers } from '@/entities/management';
import { InviteMemberDialog, ManagementPageHeader, MembersTable } from '@/widgets/management';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/management/members/')({
  component: MembersPage,
});

function MembersPage() {
  const { wsid } = Route.useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const members = useMemo(() => getAllMembers(), []);

  const filteredMembers = useMemo(() => {
    if (!searchQuery) {
      return members;
    }
    const q = searchQuery.toLowerCase();
    return members.filter((m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q));
  }, [members, searchQuery]);

  return (
    <div className='space-y-6'>
      <ManagementPageHeader
        title='Members'
        description='Manage workspace members and their access permissions'
        searchPlaceholder='Search members...'
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        ctaLabel='+ Invite Member'
        onCtaClick={() => setIsInviteOpen(true)}
      />
      <MembersTable
        data={filteredMembers}
        onRowClick={(member) =>
          void navigate({
            to: '/ws/$wsid/management/members/$memberId',
            params: { wsid, memberId: member.id },
          })
        }
      />
      <InviteMemberDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} />
    </div>
  );
}
