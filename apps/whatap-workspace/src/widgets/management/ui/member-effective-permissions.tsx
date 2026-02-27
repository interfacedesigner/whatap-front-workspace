import type { EffectivePermission, PermissionDomain } from '@/entities/management';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import { ChevronRight, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';

interface MemberEffectivePermissionsProps {
  permissions: EffectivePermission[];
}

const ACTION_COLORS: Record<string, string> = {
  READ: 'bg-blue-500/10 text-blue-700 border-blue-200',
  CREATE: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  UPDATE: 'bg-amber-500/10 text-amber-700 border-amber-200',
  DELETE: 'bg-red-500/10 text-red-700 border-red-200',
};

const DOMAIN_ORDER: PermissionDomain[] = [
  'DASHBOARD',
  'SERVER',
  'APM',
  'LOG',
  'INCIDENT',
  'EVENT',
  'ROLE',
  'POLICY',
  'MEMBER',
  'WORKSPACE',
];

export function MemberEffectivePermissions({ permissions }: MemberEffectivePermissionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<PermissionDomain, EffectivePermission[]>();
    for (const perm of permissions) {
      const existing = map.get(perm.domain) ?? [];
      existing.push(perm);
      map.set(perm.domain, existing);
    }
    // Sort by domain order
    return DOMAIN_ORDER.filter((d) => map.has(d)).map((d) => ({
      domain: d,
      permissions: map.get(d)!,
    }));
  }, [permissions]);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className='flex-row items-center gap-2 space-y-0 cursor-pointer hover:bg-muted/50 transition-colors'>
            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            />
            <Shield className='h-4 w-4 text-muted-foreground' />
            <CardTitle className='text-base'>Effective Permissions ({permissions.length})</CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className='pt-0'>
            {permissions.length === 0 ? (
              <p className='py-6 text-center text-sm text-muted-foreground'>
                No permissions. Assign policies with roles to grant permissions.
              </p>
            ) : (
              <div className='space-y-4'>
                {grouped.map(({ domain, permissions: perms }) => (
                  <div key={domain}>
                    <h4 className='mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                      {domain}
                    </h4>
                    <div className='space-y-1.5'>
                      {perms.map((perm, idx) => (
                        <div
                          key={`${perm.id}-${perm.sourceRoleName}-${perm.sourcePolicyName}-${idx}`}
                          className='flex items-center justify-between rounded-md border px-3 py-2'
                        >
                          <div className='flex items-center gap-3'>
                            <code className='text-xs font-mono text-foreground'>{perm.name}</code>
                            <Badge variant='outline' className={ACTION_COLORS[perm.action] ?? ''}>
                              {perm.action}
                            </Badge>
                            <Badge variant='secondary' className='text-[10px]'>
                              {perm.scope === 'cross-workspace' ? 'Cross-WS' : 'Workspace'}
                            </Badge>
                          </div>
                          <span className='text-[11px] text-muted-foreground'>
                            via <span className='font-medium'>{perm.sourceRoleName}</span> in{' '}
                            <span className='font-medium'>{perm.sourcePolicyName}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
