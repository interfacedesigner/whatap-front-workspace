import { useAuth } from '@features/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
});

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='flex justify-between items-center p-4 border-b border-gray-200'>
        <h1 className='text-2xl font-bold m-0'>WhaTap Workspace</h1>
        {user && (
          <div className='flex items-center gap-4'>
            <span>{user.email}</span>
            <button
              onClick={logout}
              className='px-3 py-1 bg-transparent border border-gray-200 rounded cursor-pointer hover:bg-gray-100'
            >
              Logout
            </button>
          </div>
        )}
      </header>
      <main className='flex-1 flex items-center justify-center'>
        <p>Welcome to WhaTap Workspace</p>
      </main>
    </div>
  );
}
