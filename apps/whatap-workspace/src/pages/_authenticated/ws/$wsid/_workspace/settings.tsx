import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const { wsid } = Route.useParams();

  return (
    <div>
      <h1>Settings</h1>
      <p>Workspace ID: {wsid}</p>
    </div>
  );
}
