import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { useState } from 'react';

import type { WorkspaceInfo } from '../model';

export interface WorkspaceSelectViewProps {
  workspaces: WorkspaceInfo[];
  inviterName?: string | undefined;
  onJoin: (selectedIds: string[]) => void;
}

export function WorkspaceSelectView({ workspaces, inviterName, onJoin }: WorkspaceSelectViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(workspaces.map((ws) => ws.id)));

  const allSelected = selectedIds.size === workspaces.length;

  const toggleWorkspace = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(workspaces.map((ws) => ws.id)));
    }
  };

  const handleJoin = () => {
    onJoin(Array.from(selectedIds));
  };

  return (
    <div className='w-full max-w-md flex flex-col gap-6'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-[#222]'>Choose your workspaces</h1>
        <p className='text-sm text-[#757575] mt-1'>
          {inviterName
            ? `${inviterName} invited you to join the following workspaces.`
            : 'Select the workspaces you want to join.'}
        </p>
      </div>

      {/* Select all */}
      <div className='flex items-center justify-between'>
        <button onClick={toggleAll} className='text-xs text-[#296cf2] hover:underline font-medium cursor-pointer'>
          {allSelected ? 'Deselect all' : 'Select all'}
        </button>
        <span className='text-xs text-[#757575]'>
          {selectedIds.size} of {workspaces.length} selected
        </span>
      </div>

      {/* Workspace cards */}
      <div className='flex flex-col gap-2'>
        {workspaces.map((ws) => {
          const isSelected = selectedIds.has(ws.id);
          return (
            <label
              key={ws.id}
              className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected ? 'border-[#296cf2]/40 bg-[#296cf2]/[0.03]' : 'border-[#adadad]/30 hover:border-[#adadad]/50'
              }`}
            >
              <Checkbox checked={isSelected} onChange={() => toggleWorkspace(ws.id)} />
              <div className='flex-1 min-w-0'>
                <div className='text-sm font-medium text-[#222] truncate'>{ws.name}</div>
                <div className='text-xs text-[#757575]'>Role: {ws.role}</div>
              </div>
            </label>
          );
        })}
      </div>

      <Button
        disabled={selectedIds.size === 0}
        className='bg-[#296cf2] hover:bg-[#1e5ad9] text-white text-sm h-10 rounded w-full disabled:opacity-50'
        onClick={handleJoin}
      >
        Join{' '}
        {selectedIds.size > 0
          ? `${selectedIds.size} workspace${selectedIds.size > 1 ? 's' : ''}`
          : 'selected workspaces'}
      </Button>
    </div>
  );
}
