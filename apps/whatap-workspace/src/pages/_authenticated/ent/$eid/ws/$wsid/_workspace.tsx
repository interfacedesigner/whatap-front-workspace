import { WorkspaceLayout } from '@app/layouts';
import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/ent/$eid/ws/$wsid/_workspace')({
  component: WorkspaceLayoutRoute,
});

function WorkspaceLayoutRoute() {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  );
}
