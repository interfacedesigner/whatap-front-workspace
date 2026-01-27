import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/ent/$eid/ws/$wsid/_workspace/')({
  component: WorkspaceHomePage,
});

function WorkspaceHomePage() {
  const { eid, wsid } = Route.useParams();

  return (
    <div>
      <h1>Workspace Home</h1>
      <p>Enterprise ID: {eid}</p>
      <p>Workspace ID: {wsid}</p>
    </div>
  );
}
