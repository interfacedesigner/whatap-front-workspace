import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/')({
  component: WorkspaceHomePage,
});

function WorkspaceHomePage() {
  const { wsid } = Route.useParams();

  return (
    <div>
      <h1>Workspace Home</h1>
      <p>Workspace ID: {wsid}</p>
    </div>
  );
}
