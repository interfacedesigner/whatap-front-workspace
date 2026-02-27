import type { Permission, PermissionDomain } from '@/entities/management';
import { Badge } from '@/shared/components/ui/badge';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useMemo } from 'react';

const ACTION_BADGE_CLASS: Record<string, string> = {
  READ: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  CREATE: 'bg-blue-500/10 text-blue-700 border-blue-200',
  UPDATE: 'bg-amber-500/10 text-amber-700 border-amber-200',
  DELETE: 'bg-red-500/10 text-red-700 border-red-200',
};

interface RolePermissionMatrixProps {
  permissions: Permission[];
  selectedPermissionIds: string[];
  onPermissionToggle: (permissionId: string) => void;
  onDomainToggleAll: (domain: PermissionDomain, permissionIds: string[]) => void;
  disabled?: boolean;
}

export function RolePermissionMatrix({
  permissions,
  selectedPermissionIds,
  onPermissionToggle,
  onDomainToggleAll,
  disabled = false,
}: RolePermissionMatrixProps) {
  // Group permissions by domain
  const domainGroups = useMemo(() => {
    const groups = new Map<PermissionDomain, Permission[]>();
    for (const perm of permissions) {
      const existing = groups.get(perm.domain);
      if (existing) {
        existing.push(perm);
      } else {
        groups.set(perm.domain, [perm]);
      }
    }
    return groups;
  }, [permissions]);

  const domains = useMemo(() => Array.from(domainGroups.keys()).sort(), [domainGroups]);
  const selectedSet = useMemo(() => new Set(selectedPermissionIds), [selectedPermissionIds]);

  if (domains.length === 0) {
    return (
      <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
        No permissions available
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <Tabs defaultValue={domains[0] ?? ''}>
        <TabsList variant='line' className='flex-wrap'>
          {domains.map((domain) => {
            const domainPerms = domainGroups.get(domain) ?? [];
            const selectedCount = domainPerms.filter((p) => selectedSet.has(p.id)).length;
            return (
              <TabsTrigger key={domain} value={domain}>
                {domain}
                {selectedCount > 0 && (
                  <Badge variant='secondary' className='ml-1.5 text-[10px] px-1.5 py-0'>
                    {selectedCount}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {domains.map((domain) => {
          const domainPerms = domainGroups.get(domain) ?? [];
          const domainPermIds = domainPerms.map((p) => p.id);
          const selectedInDomain = domainPerms.filter((p) => selectedSet.has(p.id)).length;
          const allSelected = selectedInDomain === domainPerms.length;
          const someSelected = selectedInDomain > 0 && !allSelected;

          return (
            <TabsContent key={domain} value={domain}>
              <div className='rounded-lg border'>
                {/* Domain header with select all */}
                <div className='flex items-center gap-3 border-b bg-muted/50 px-4 py-3'>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={() => onDomainToggleAll(domain, domainPermIds)}
                    disabled={disabled}
                  />
                  <span className='text-sm font-medium'>
                    Select all {domain} permissions ({selectedInDomain}/{domainPerms.length})
                  </span>
                </div>

                {/* Permission list */}
                <div className='divide-y'>
                  {domainPerms.map((perm) => (
                    <label
                      key={perm.id}
                      className='flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer'
                    >
                      <Checkbox
                        checked={selectedSet.has(perm.id)}
                        onChange={() => onPermissionToggle(perm.id)}
                        disabled={disabled}
                        className='mt-0.5'
                      />
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm font-medium'>{perm.name}</span>
                          <Badge variant='outline' className={ACTION_BADGE_CLASS[perm.action] ?? ''}>
                            {perm.action}
                          </Badge>
                          <Badge variant='outline' className='text-[10px]'>
                            {perm.scope === 'cross-workspace' ? 'Cross-WS' : 'Workspace'}
                          </Badge>
                        </div>
                        <p className='mt-0.5 text-xs text-muted-foreground'>{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Selected count footer */}
      <div className='text-sm text-muted-foreground'>
        {selectedPermissionIds.length} permission{selectedPermissionIds.length !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}
