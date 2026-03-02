import {
  type Permission,
  type Policy,
  type Role,
  getAllRoles,
  getPermissionsByRoleId,
  getPoliciesByRoleId,
} from '@/entities/management';
import { TEST_SCENARIOS, type TestScenarioEntry, useSetSignupScenario } from '@/features/signup';
import { Badge } from '@/shared/components/ui/badge';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowRight, Check, Copy, KeyRound, Shield, Users } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

export const Route = createFileRoute('/signup/dev')({
  component: DevPage,
});

// ─── Role Test Account Card ──────────────────────────────

interface RoleAccountInfo {
  role: Role;
  email: string;
  policy: Policy | undefined;
  permissions: Permission[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
    [text],
  );

  return (
    <button onClick={handleCopy} className='p-1 rounded hover:bg-zinc-100 transition-colors' title='Copy email'>
      {copied ? (
        <Check className='w-3.5 h-3.5 text-green-500' />
      ) : (
        <Copy className='w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600' />
      )}
    </button>
  );
}

const SCOPE_COLORS: Record<string, string> = {
  workspace: 'bg-blue-50 text-blue-700 border-blue-200',
  'cross-workspace': 'bg-purple-50 text-purple-700 border-purple-200',
};

const ROLE_TYPE_BADGE: Record<string, string> = {
  default: 'bg-zinc-100 text-zinc-600',
  custom: 'bg-amber-50 text-amber-700',
};

function RoleAccountCard({ info }: { info: RoleAccountInfo }) {
  const [expanded, setExpanded] = useState(false);
  const { role, email, policy, permissions } = info;

  // Group permissions by domain
  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of permissions) {
      const list = map.get(p.domain) || [];
      list.push(p);
      map.set(p.domain, list);
    }
    return map;
  }, [permissions]);

  return (
    <div className='border border-zinc-200 rounded-lg bg-white overflow-hidden'>
      {/* Header */}
      <div
        onClick={() => setExpanded((v) => !v)}
        className='w-full text-left px-5 py-4 hover:bg-zinc-50/50 transition-colors cursor-pointer'
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center'>
              <Shield className='w-4.5 h-4.5 text-white' />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-sm font-semibold text-zinc-900'>{role.name}</h3>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${ROLE_TYPE_BADGE[role.type] ?? ''}`}>
                  {role.type}
                </span>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${SCOPE_COLORS[role.scope] ?? ''}`}
                >
                  {role.scope}
                </span>
              </div>
              <p className='text-xs text-zinc-500 mt-0.5'>{role.description}</p>
            </div>
          </div>
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>

        {/* Account & Policy summary */}
        <div className='flex items-center gap-4 mt-3 ml-12'>
          <div className='flex items-center gap-1.5 text-xs text-zinc-600'>
            <Users className='w-3.5 h-3.5 text-zinc-400' />
            <code className='font-mono text-[11px] bg-zinc-100 px-1.5 py-0.5 rounded'>{email}</code>
            <CopyButton text={email} />
          </div>
          {policy && (
            <div className='flex items-center gap-1.5 text-xs text-zinc-500'>
              <KeyRound className='w-3.5 h-3.5 text-zinc-400' />
              <span>{policy.name}</span>
            </div>
          )}
          <Badge variant='outline' className='text-[10px] h-5'>
            {permissions.length} permissions
          </Badge>
        </div>
      </div>

      {/* Expanded: Permission details */}
      {expanded && (
        <div className='px-5 pb-4 pt-1 border-t border-zinc-100'>
          <div className='grid grid-cols-2 gap-3 ml-12'>
            {Array.from(grouped.entries()).map(([domain, perms]) => (
              <div key={domain} className='flex flex-col gap-1'>
                <span className='text-[10px] font-semibold text-zinc-400 uppercase tracking-wider'>{domain}</span>
                <div className='flex flex-wrap gap-1'>
                  {perms.map((p) => (
                    <span key={p.id} className='text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600'>
                      {p.action}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Signup Scenario Card ────────────────────────────────

function ScenarioCard({ entry, onSelect }: { entry: TestScenarioEntry; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className='w-full text-left border border-[#adadad]/30 rounded-lg p-5 hover:border-[#296cf2]/50 hover:shadow-md transition-all group cursor-pointer bg-white'
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <h3 className='text-base font-semibold text-[#222]'>{entry.label}</h3>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${entry.badgeColor}`}>{entry.badge}</span>
        </div>
        <ArrowRight className='w-4 h-4 text-[#adadad] group-hover:text-[#296cf2] transition-colors' />
      </div>

      <p className='text-sm text-[#757575] mb-4 leading-relaxed'>{entry.description}</p>

      {/* Flow steps */}
      <div className='flex flex-col gap-1'>
        {entry.flow.map((step, i) => (
          <div key={i} className='flex items-center gap-2 text-xs text-[#757575]'>
            <span className='w-4 h-4 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[10px] font-medium text-[#222] shrink-0'>
              {i + 1}
            </span>
            <code className='font-mono text-[11px]'>{step}</code>
          </div>
        ))}
      </div>

      {/* Account info for invited scenarios */}
      {entry.scenario.type !== 'default' && (
        <div className='mt-4 pt-3 border-t border-[#adadad]/15 flex flex-col gap-1'>
          <span className='text-[10px] text-[#adadad] uppercase tracking-wider font-medium'>Test Account</span>
          <span className='text-xs text-[#222] font-mono'>{entry.scenario.email}</span>
          {entry.scenario.inviterName && (
            <span className='text-xs text-[#757575]'>Invited by: {entry.scenario.inviterName}</span>
          )}
          {entry.scenario.workspaces && (
            <span className='text-xs text-[#757575]'>
              Workspaces: {entry.scenario.workspaces.map((ws) => ws.name).join(', ')}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

// ─── Main Dev Page ───────────────────────────────────────

function DevPage() {
  const navigate = useNavigate();
  const setScenario = useSetSignupScenario();

  const handleSelect = (entry: TestScenarioEntry) => {
    setScenario(entry.scenario);

    if (entry.scenario.token) {
      navigate({ to: '/signup', search: { token: entry.scenario.token, email: entry.scenario.email } });
    } else {
      navigate({ to: '/signup', search: { token: undefined, email: undefined } });
    }
  };

  // Build role account info from mock data
  const roleAccounts: RoleAccountInfo[] = useMemo(() => {
    const roles = getAllRoles();
    return roles.map((role) => {
      const roleName = role.name.toLowerCase().replace(/\s+/g, '-');
      const email = `${roleName}@whatap.io`;
      const policies = getPoliciesByRoleId(role.id);
      const testPolicy = policies.find((p) => p.id.startsWith('pol-test'));
      const permissions = getPermissionsByRoleId(role.id);
      return { role, email, policy: testPolicy, permissions };
    });
  }, []);

  return (
    <div className='min-h-screen bg-[#fafbfc] px-4 py-12'>
      <div className='max-w-2xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4'>
            <span className='w-1.5 h-1.5 rounded-full bg-amber-500' />
            Development Only
          </div>
          <h1 className='text-2xl font-bold text-[#222]'>Signup Flow Test Hub</h1>
          <p className='text-sm text-[#757575] mt-2'>아래 시나리오를 선택하여 각 가입 플로우를 테스트할 수 있습니다.</p>
        </div>

        {/* Scenario Cards */}
        <div className='flex flex-col gap-4'>
          {TEST_SCENARIOS.map((entry) => (
            <ScenarioCard key={entry.scenario.type} entry={entry} onSelect={() => handleSelect(entry)} />
          ))}
        </div>

        {/* ─── RBAC Test Accounts Section ─── */}
        <div className='mt-12'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='h-px flex-1 bg-zinc-200' />
            <span className='text-xs font-medium text-zinc-400 uppercase tracking-wider'>RBAC Test Accounts</span>
            <div className='h-px flex-1 bg-zinc-200' />
          </div>
          <p className='text-sm text-zinc-500 mb-5 text-center'>
            6가지 역할별 테스트 계정입니다. 각 카드를 클릭하면 보유 권한을 확인할 수 있습니다.
          </p>

          <div className='flex flex-col gap-3'>
            {roleAccounts.map((info) => (
              <RoleAccountCard key={info.role.id} info={info} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p className='text-center text-xs text-[#adadad] mt-8'>
          이 페이지는 개발/테스트 전용입니다. 프로덕션 배포 시 제거하세요.
        </p>
      </div>
    </div>
  );
}
