import type { ReactNode } from 'react';

interface WorkspaceLayoutProps {
  children: ReactNode;
}

export function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <div className='flex min-h-screen'>
      <aside className='w-60 shrink-0 border-r border-gray-200 bg-white'>{/* Sidebar will be added */}</aside>
      <div className='flex-1 flex flex-col'>
        <header className='h-14 border-b border-gray-200 bg-white'>{/* Header will be added */}</header>
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  );
}
