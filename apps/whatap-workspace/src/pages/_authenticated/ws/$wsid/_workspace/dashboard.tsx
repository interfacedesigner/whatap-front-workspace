import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { wsid } = Route.useParams();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Workspace ID: {wsid}</p>
    </div>
  );
}
