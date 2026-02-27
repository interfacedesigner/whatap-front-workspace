/**
 * Management Mock Data
 * @description Members, Policies, Roles, Permissions dummy data
 */
import type {
  CreateRolePayload,
  EffectivePermission,
  InviteMemberPayload,
  Member,
  Permission,
  PermissionAction,
  PermissionDomain,
  PermissionScope,
  Policy,
  Role,
  RoleImpact,
  UpdateRolePayload,
} from '../model/management.types';

// ─── Permissions (24개) ───────────────────────────────────
const PERMISSION_DEFS: Array<{
  domain: PermissionDomain;
  action: PermissionAction;
  scope: PermissionScope;
  description: string;
}> = [
  { domain: 'DASHBOARD', action: 'READ', scope: 'workspace', description: 'View dashboards and overview data' },
  { domain: 'DASHBOARD', action: 'UPDATE', scope: 'workspace', description: 'Edit dashboard configurations' },
  { domain: 'SERVER', action: 'READ', scope: 'workspace', description: 'View server inventory and metrics' },
  { domain: 'SERVER', action: 'UPDATE', scope: 'workspace', description: 'Modify server configurations' },
  { domain: 'SERVER', action: 'CREATE', scope: 'workspace', description: 'Register new servers' },
  { domain: 'SERVER', action: 'DELETE', scope: 'workspace', description: 'Remove servers from inventory' },
  { domain: 'APM', action: 'READ', scope: 'workspace', description: 'View APM monitoring data' },
  { domain: 'APM', action: 'UPDATE', scope: 'workspace', description: 'Configure APM settings' },
  { domain: 'LOG', action: 'READ', scope: 'workspace', description: 'View application logs' },
  { domain: 'LOG', action: 'UPDATE', scope: 'workspace', description: 'Manage log configurations' },
  { domain: 'INCIDENT', action: 'READ', scope: 'workspace', description: 'View incidents and history' },
  { domain: 'INCIDENT', action: 'UPDATE', scope: 'workspace', description: 'Update incident status and assignments' },
  { domain: 'INCIDENT', action: 'CREATE', scope: 'workspace', description: 'Create new incidents manually' },
  { domain: 'INCIDENT', action: 'DELETE', scope: 'workspace', description: 'Delete incident records' },
  { domain: 'EVENT', action: 'READ', scope: 'workspace', description: 'View event rules and history' },
  { domain: 'EVENT', action: 'UPDATE', scope: 'workspace', description: 'Modify event rules' },
  { domain: 'EVENT', action: 'CREATE', scope: 'workspace', description: 'Create new event rules' },
  { domain: 'EVENT', action: 'DELETE', scope: 'workspace', description: 'Remove event rules' },
  { domain: 'ROLE', action: 'READ', scope: 'cross-workspace', description: 'View role definitions' },
  { domain: 'ROLE', action: 'UPDATE', scope: 'cross-workspace', description: 'Modify role permissions' },
  { domain: 'ROLE', action: 'CREATE', scope: 'cross-workspace', description: 'Create new roles' },
  { domain: 'ROLE', action: 'DELETE', scope: 'cross-workspace', description: 'Delete roles' },
  { domain: 'POLICY', action: 'READ', scope: 'cross-workspace', description: 'View policy definitions' },
  { domain: 'POLICY', action: 'CREATE', scope: 'cross-workspace', description: 'Create new policies' },
  { domain: 'MEMBER', action: 'READ', scope: 'cross-workspace', description: 'View member list and profiles' },
  { domain: 'MEMBER', action: 'CREATE', scope: 'cross-workspace', description: 'Invite new members' },
  { domain: 'WORKSPACE', action: 'READ', scope: 'cross-workspace', description: 'View workspace settings' },
  { domain: 'WORKSPACE', action: 'UPDATE', scope: 'cross-workspace', description: 'Modify workspace settings' },
];

const PERMISSIONS: Permission[] = PERMISSION_DEFS.map((def, i) => ({
  id: `perm-${String(i + 1).padStart(3, '0')}`,
  name: `${def.domain}_${def.action}`,
  domain: def.domain,
  action: def.action,
  scope: def.scope,
  description: def.description,
}));

// ─── Roles (6개) ──────────────────────────────────────────
const ROLES: Role[] = [
  {
    id: 'role-001',
    name: 'Viewer',
    description: 'Read-only access to dashboards, servers, and monitoring data',
    type: 'default',
    scope: 'workspace',
    createdAt: '2025-03-15T09:00:00Z',
    permissionIds: ['perm-001', 'perm-003', 'perm-007', 'perm-009', 'perm-011', 'perm-015'],
  },
  {
    id: 'role-002',
    name: 'Developer',
    description: 'Development-level access including logs, APM, and incident management',
    type: 'default',
    scope: 'workspace',
    createdAt: '2025-03-15T09:30:00Z',
    permissionIds: ['perm-001', 'perm-003', 'perm-007', 'perm-008', 'perm-009', 'perm-010', 'perm-011', 'perm-012'],
  },
  {
    id: 'role-003',
    name: 'Operator',
    description: 'Server and infrastructure operations with event and incident management',
    type: 'custom',
    scope: 'workspace',
    createdAt: '2025-04-01T10:00:00Z',
    permissionIds: [
      'perm-001',
      'perm-003',
      'perm-004',
      'perm-005',
      'perm-011',
      'perm-012',
      'perm-013',
      'perm-015',
      'perm-016',
      'perm-017',
    ],
  },
  {
    id: 'role-004',
    name: 'SRE Lead',
    description: 'Full operational control including server, incident, and event management',
    type: 'custom',
    scope: 'workspace',
    createdAt: '2025-04-10T14:00:00Z',
    permissionIds: [
      'perm-001',
      'perm-002',
      'perm-003',
      'perm-004',
      'perm-005',
      'perm-006',
      'perm-007',
      'perm-008',
      'perm-011',
      'perm-012',
      'perm-013',
      'perm-014',
      'perm-015',
      'perm-016',
      'perm-017',
      'perm-018',
    ],
  },
  {
    id: 'role-005',
    name: 'Admin',
    description: 'Cross-workspace administrative access for role, policy, and member management',
    type: 'default',
    scope: 'cross-workspace',
    createdAt: '2025-03-10T08:00:00Z',
    permissionIds: [
      'perm-019',
      'perm-020',
      'perm-021',
      'perm-022',
      'perm-023',
      'perm-024',
      'perm-025',
      'perm-026',
      'perm-027',
      'perm-028',
    ],
  },
  {
    id: 'role-006',
    name: 'Auditor',
    description: 'Read-only access across all workspaces for compliance and audit purposes',
    type: 'custom',
    scope: 'cross-workspace',
    createdAt: '2025-05-01T11:00:00Z',
    permissionIds: [
      'perm-001',
      'perm-003',
      'perm-007',
      'perm-009',
      'perm-011',
      'perm-015',
      'perm-019',
      'perm-023',
      'perm-025',
      'perm-027',
    ],
  },
];

// ─── Policies (8개) ───────────────────────────────────────
const POLICIES: Policy[] = [
  {
    id: 'pol-001',
    name: 'Production Read-Only',
    description: 'Read-only access to production workspace resources',
    createdAt: '2025-03-20T10:00:00Z',
    roleIds: ['role-001'],
    memberIds: ['mem-001', 'mem-005', 'mem-008', 'mem-012'],
  },
  {
    id: 'pol-002',
    name: 'Developer Standard',
    description: 'Standard developer access for development and staging environments',
    createdAt: '2025-03-25T11:00:00Z',
    roleIds: ['role-002'],
    memberIds: ['mem-002', 'mem-003', 'mem-006', 'mem-009', 'mem-010'],
  },
  {
    id: 'pol-003',
    name: 'Infrastructure Operations',
    description: 'Server and infrastructure operations team access',
    createdAt: '2025-04-05T09:00:00Z',
    roleIds: ['role-003', 'role-001'],
    memberIds: ['mem-004', 'mem-007', 'mem-011'],
  },
  {
    id: 'pol-004',
    name: 'SRE Full Access',
    description: 'Full SRE team access with incident and event management capabilities',
    createdAt: '2025-04-12T14:00:00Z',
    roleIds: ['role-004', 'role-002'],
    memberIds: ['mem-004', 'mem-013'],
  },
  {
    id: 'pol-005',
    name: 'Platform Admin',
    description: 'Full administrative access for platform management',
    createdAt: '2025-03-10T08:00:00Z',
    roleIds: ['role-005', 'role-004'],
    memberIds: ['mem-001', 'mem-014'],
  },
  {
    id: 'pol-006',
    name: 'Compliance Audit',
    description: 'Cross-workspace read-only access for compliance and audit team',
    createdAt: '2025-05-05T10:00:00Z',
    roleIds: ['role-006'],
    memberIds: ['mem-015'],
  },
  {
    id: 'pol-007',
    name: 'On-Call Engineer',
    description: 'Incident response access for on-call rotation members',
    createdAt: '2025-04-20T16:00:00Z',
    roleIds: ['role-003', 'role-002'],
    memberIds: ['mem-002', 'mem-004', 'mem-007', 'mem-011', 'mem-013'],
  },
  {
    id: 'pol-008',
    name: 'Monitoring Dashboard',
    description: 'Access to monitoring dashboards and basic server metrics',
    createdAt: '2025-05-10T09:00:00Z',
    roleIds: ['role-001'],
    memberIds: ['mem-005', 'mem-008', 'mem-012', 'mem-015'],
  },
  // ─── Test Policies (Role별 1:1 확인용) ──────────────────
  {
    id: 'pol-test-viewer',
    name: 'Test: Viewer Only',
    description: 'Test policy for Viewer role verification',
    createdAt: '2026-02-27T00:00:00Z',
    roleIds: ['role-001'],
    memberIds: ['mem-016'],
  },
  {
    id: 'pol-test-developer',
    name: 'Test: Developer Only',
    description: 'Test policy for Developer role verification',
    createdAt: '2026-02-27T00:00:00Z',
    roleIds: ['role-002'],
    memberIds: ['mem-017'],
  },
  {
    id: 'pol-test-operator',
    name: 'Test: Operator Only',
    description: 'Test policy for Operator role verification',
    createdAt: '2026-02-27T00:00:00Z',
    roleIds: ['role-003'],
    memberIds: ['mem-018'],
  },
  {
    id: 'pol-test-srelead',
    name: 'Test: SRE Lead Only',
    description: 'Test policy for SRE Lead role verification',
    createdAt: '2026-02-27T00:00:00Z',
    roleIds: ['role-004'],
    memberIds: ['mem-019'],
  },
  {
    id: 'pol-test-admin',
    name: 'Test: Admin Only',
    description: 'Test policy for Admin role verification',
    createdAt: '2026-02-27T00:00:00Z',
    roleIds: ['role-005'],
    memberIds: ['mem-020'],
  },
  {
    id: 'pol-test-auditor',
    name: 'Test: Auditor Only',
    description: 'Test policy for Auditor role verification',
    createdAt: '2026-02-27T00:00:00Z',
    roleIds: ['role-006'],
    memberIds: ['mem-021'],
  },
];

// ─── Members (15명) ───────────────────────────────────────
const MEMBERS: Member[] = [
  {
    id: 'mem-001',
    name: 'Sarah Kim',
    email: 'sarah.kim@opsgent.io',
    status: 'active',
    createdAt: '2025-03-01T08:00:00Z',
    lastLoginAt: '2026-02-24T09:15:00Z',
    policyIds: ['pol-001', 'pol-005'],
  },
  {
    id: 'mem-002',
    name: 'James Park',
    email: 'james.park@opsgent.io',
    status: 'active',
    createdAt: '2025-03-05T10:00:00Z',
    lastLoginAt: '2026-02-24T08:45:00Z',
    policyIds: ['pol-002', 'pol-007'],
  },
  {
    id: 'mem-003',
    name: 'Emily Chen',
    email: 'emily.chen@opsgent.io',
    status: 'active',
    createdAt: '2025-03-10T11:00:00Z',
    lastLoginAt: '2026-02-23T17:30:00Z',
    policyIds: ['pol-002'],
  },
  {
    id: 'mem-004',
    name: 'Michael Lee',
    email: 'michael.lee@opsgent.io',
    status: 'active',
    createdAt: '2025-03-12T09:00:00Z',
    lastLoginAt: '2026-02-24T10:00:00Z',
    policyIds: ['pol-003', 'pol-004', 'pol-007'],
  },
  {
    id: 'mem-005',
    name: 'Jessica Wang',
    email: 'jessica.wang@opsgent.io',
    status: 'active',
    createdAt: '2025-03-15T14:00:00Z',
    lastLoginAt: '2026-02-22T16:00:00Z',
    policyIds: ['pol-001', 'pol-008'],
  },
  {
    id: 'mem-006',
    name: 'David Choi',
    email: 'david.choi@opsgent.io',
    status: 'active',
    createdAt: '2025-03-20T09:00:00Z',
    lastLoginAt: '2026-02-24T07:30:00Z',
    policyIds: ['pol-002'],
  },
  {
    id: 'mem-007',
    name: 'Rachel Yoon',
    email: 'rachel.yoon@opsgent.io',
    status: 'active',
    createdAt: '2025-04-01T10:00:00Z',
    lastLoginAt: '2026-02-23T22:00:00Z',
    policyIds: ['pol-003', 'pol-007'],
  },
  {
    id: 'mem-008',
    name: 'Thomas Jung',
    email: 'thomas.jung@opsgent.io',
    status: 'inactive',
    createdAt: '2025-04-05T11:00:00Z',
    lastLoginAt: '2026-01-15T14:00:00Z',
    policyIds: ['pol-001', 'pol-008'],
  },
  {
    id: 'mem-009',
    name: 'Sophia Han',
    email: 'sophia.han@opsgent.io',
    status: 'active',
    createdAt: '2025-04-10T09:00:00Z',
    lastLoginAt: '2026-02-24T11:00:00Z',
    policyIds: ['pol-002'],
  },
  {
    id: 'mem-010',
    name: 'Daniel Shin',
    email: 'daniel.shin@opsgent.io',
    status: 'active',
    createdAt: '2025-04-15T10:00:00Z',
    lastLoginAt: '2026-02-23T15:30:00Z',
    policyIds: ['pol-002'],
  },
  {
    id: 'mem-011',
    name: 'Olivia Kang',
    email: 'olivia.kang@opsgent.io',
    status: 'active',
    createdAt: '2025-04-20T14:00:00Z',
    lastLoginAt: '2026-02-24T06:00:00Z',
    policyIds: ['pol-003', 'pol-007'],
  },
  {
    id: 'mem-012',
    name: 'Alexander Ryu',
    email: 'alex.ryu@opsgent.io',
    status: 'pending',
    createdAt: '2025-05-01T09:00:00Z',
    lastLoginAt: null,
    policyIds: ['pol-001', 'pol-008'],
  },
  {
    id: 'mem-013',
    name: 'Grace Lim',
    email: 'grace.lim@opsgent.io',
    status: 'active',
    createdAt: '2025-05-05T11:00:00Z',
    lastLoginAt: '2026-02-24T08:00:00Z',
    policyIds: ['pol-004', 'pol-007'],
  },
  {
    id: 'mem-014',
    name: 'William Oh',
    email: 'william.oh@opsgent.io',
    status: 'active',
    createdAt: '2025-03-08T08:00:00Z',
    lastLoginAt: '2026-02-24T09:30:00Z',
    policyIds: ['pol-005'],
  },
  {
    id: 'mem-015',
    name: 'Isabella Bae',
    email: 'isabella.bae@opsgent.io',
    status: 'active',
    createdAt: '2025-05-10T10:00:00Z',
    lastLoginAt: '2026-02-21T18:00:00Z',
    policyIds: ['pol-006', 'pol-008'],
  },
  // ─── Test Members (Role별 @whatap.io 확인용) ─────────────
  {
    id: 'mem-016',
    name: 'Test Viewer',
    email: 'viewer@whatap.io',
    status: 'active',
    createdAt: '2026-02-27T00:00:00Z',
    lastLoginAt: '2026-02-27T09:00:00Z',
    policyIds: ['pol-test-viewer'],
  },
  {
    id: 'mem-017',
    name: 'Test Developer',
    email: 'developer@whatap.io',
    status: 'active',
    createdAt: '2026-02-27T00:00:00Z',
    lastLoginAt: '2026-02-27T09:00:00Z',
    policyIds: ['pol-test-developer'],
  },
  {
    id: 'mem-018',
    name: 'Test Operator',
    email: 'operator@whatap.io',
    status: 'active',
    createdAt: '2026-02-27T00:00:00Z',
    lastLoginAt: '2026-02-27T09:00:00Z',
    policyIds: ['pol-test-operator'],
  },
  {
    id: 'mem-019',
    name: 'Test SRE Lead',
    email: 'sre-lead@whatap.io',
    status: 'active',
    createdAt: '2026-02-27T00:00:00Z',
    lastLoginAt: '2026-02-27T09:00:00Z',
    policyIds: ['pol-test-srelead'],
  },
  {
    id: 'mem-020',
    name: 'Test Admin',
    email: 'admin@whatap.io',
    status: 'active',
    createdAt: '2026-02-27T00:00:00Z',
    lastLoginAt: '2026-02-27T09:00:00Z',
    policyIds: ['pol-test-admin'],
  },
  {
    id: 'mem-021',
    name: 'Test Auditor',
    email: 'auditor@whatap.io',
    status: 'active',
    createdAt: '2026-02-27T00:00:00Z',
    lastLoginAt: '2026-02-27T09:00:00Z',
    policyIds: ['pol-test-auditor'],
  },
];

// ─── Data Access Functions ─────────────────────────────────

export function getAllMembers(): Member[] {
  return MEMBERS;
}

export function getAllPolicies(): Policy[] {
  return POLICIES;
}

export function getAllRoles(): Role[] {
  return ROLES;
}

export function getAllPermissions(): Permission[] {
  return PERMISSIONS;
}

export function getMemberById(id: string): Member | undefined {
  return MEMBERS.find((m) => m.id === id);
}

export function getPolicyById(id: string): Policy | undefined {
  return POLICIES.find((p) => p.id === id);
}

export function getRoleById(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export function getPermissionById(id: string): Permission | undefined {
  return PERMISSIONS.find((p) => p.id === id);
}

// ─── Relational Queries ─────────────────────────────────

export function getPoliciesByMemberId(memberId: string): Policy[] {
  const member = getMemberById(memberId);
  if (!member) {
    return [];
  }
  return POLICIES.filter((p) => member.policyIds.includes(p.id));
}

export function getMembersByPolicyId(policyId: string): Member[] {
  const policy = getPolicyById(policyId);
  if (!policy) {
    return [];
  }
  return MEMBERS.filter((m) => policy.memberIds.includes(m.id));
}

export function getRolesByPolicyId(policyId: string): Role[] {
  const policy = getPolicyById(policyId);
  if (!policy) {
    return [];
  }
  return ROLES.filter((r) => policy.roleIds.includes(r.id));
}

export function getRolesByMemberId(memberId: string): Role[] {
  const policies = getPoliciesByMemberId(memberId);
  const roleIdSet = new Set(policies.flatMap((p) => p.roleIds));
  return ROLES.filter((r) => roleIdSet.has(r.id));
}

export function getPoliciesByRoleId(roleId: string): Policy[] {
  return POLICIES.filter((p) => p.roleIds.includes(roleId));
}

export function getMembersByRoleId(roleId: string): Member[] {
  const policies = getPoliciesByRoleId(roleId);
  const memberIdSet = new Set(policies.flatMap((p) => p.memberIds));
  return MEMBERS.filter((m) => memberIdSet.has(m.id));
}

export function getPermissionsByRoleId(roleId: string): Permission[] {
  const role = getRoleById(roleId);
  if (!role) {
    return [];
  }
  return PERMISSIONS.filter((p) => role.permissionIds.includes(p.id));
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(isoString: string | null): string {
  if (!isoString) {
    return 'Never';
  }
  return new Date(isoString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Member CRUD & Extended Queries ──────────────────────

export function getMemberByEmail(email: string): Member | undefined {
  return MEMBERS.find((m) => m.email.toLowerCase() === email.toLowerCase());
}

export function getRoleNamesByMemberId(memberId: string): string[] {
  const roles = getRolesByMemberId(memberId);
  return roles.map((r) => r.name);
}

export function getPermissionsByMemberId(memberId: string): EffectivePermission[] {
  const policies = getPoliciesByMemberId(memberId);
  const seen = new Set<string>();
  const result: EffectivePermission[] = [];

  for (const policy of policies) {
    for (const roleId of policy.roleIds) {
      const role = getRoleById(roleId);
      if (!role) {
        continue;
      }
      for (const permId of role.permissionIds) {
        const key = `${permId}-${role.name}-${policy.name}`;
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        const perm = getPermissionById(permId);
        if (!perm) {
          continue;
        }
        result.push({
          ...perm,
          sourceRoleName: role.name,
          sourcePolicyName: policy.name,
        });
      }
    }
  }

  return result;
}

let memberCounter = 21; // MEMBERS.length (15 original + 6 test accounts)

export function addMember(payload: InviteMemberPayload): Member {
  memberCounter += 1;
  const newMember: Member = {
    id: `mem-${String(memberCounter).padStart(3, '0')}`,
    name: payload.name ?? payload.email.split('@')[0] ?? payload.email,
    email: payload.email,
    status: 'pending',
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    policyIds: [...payload.policyIds],
  };
  MEMBERS.push(newMember);

  // Update policies' memberIds
  for (const policyId of payload.policyIds) {
    const policy = POLICIES.find((p) => p.id === policyId);
    if (policy && !policy.memberIds.includes(newMember.id)) {
      policy.memberIds.push(newMember.id);
    }
  }

  return newMember;
}

export function updateMember(id: string, updates: Partial<Pick<Member, 'name' | 'status'>>): Member | undefined {
  const member = MEMBERS.find((m) => m.id === id);
  if (!member) {
    return undefined;
  }
  if (updates.name != null) {
    member.name = updates.name;
  }
  if (updates.status != null) {
    member.status = updates.status;
  }
  return member;
}

export function deleteMember(id: string): boolean {
  const index = MEMBERS.findIndex((m) => m.id === id);
  if (index === -1) {
    return false;
  }

  // Remove from all policies
  for (const policy of POLICIES) {
    policy.memberIds = policy.memberIds.filter((mid) => mid !== id);
  }

  MEMBERS.splice(index, 1);
  return true;
}

export function addPolicyToMember(memberId: string, policyId: string): boolean {
  const member = MEMBERS.find((m) => m.id === memberId);
  const policy = POLICIES.find((p) => p.id === policyId);
  if (!member || !policy) {
    return false;
  }

  if (!member.policyIds.includes(policyId)) {
    member.policyIds.push(policyId);
  }
  if (!policy.memberIds.includes(memberId)) {
    policy.memberIds.push(memberId);
  }
  return true;
}

export function removePolicyFromMember(memberId: string, policyId: string): boolean {
  const member = MEMBERS.find((m) => m.id === memberId);
  const policy = POLICIES.find((p) => p.id === policyId);
  if (!member || !policy) {
    return false;
  }

  member.policyIds = member.policyIds.filter((id) => id !== policyId);
  policy.memberIds = policy.memberIds.filter((id) => id !== memberId);
  return true;
}

export function getUnassignedPolicies(memberId: string): Policy[] {
  const member = getMemberById(memberId);
  if (!member) {
    return [];
  }
  return POLICIES.filter((p) => !member.policyIds.includes(p.id));
}

// ─── Role CRUD & Extended Queries ────────────────────────

let roleCounter = ROLES.length;

export function addRole(payload: CreateRolePayload): Role {
  roleCounter += 1;
  const newRole: Role = {
    id: `role-${String(roleCounter).padStart(3, '0')}`,
    name: payload.name,
    description: payload.description,
    type: 'custom',
    scope: 'workspace',
    createdAt: new Date().toISOString(),
    permissionIds: [...payload.permissionIds],
  };
  ROLES.push(newRole);
  return newRole;
}

export function updateRole(id: string, updates: UpdateRolePayload): Role | undefined {
  const role = ROLES.find((r) => r.id === id);
  if (!role) {
    return undefined;
  }
  // Default roles are protected from edits
  if (role.type === 'default') {
    return undefined;
  }
  if (updates.name != null) {
    role.name = updates.name;
  }
  if (updates.description != null) {
    role.description = updates.description;
  }
  if (updates.permissionIds != null) {
    role.permissionIds = [...updates.permissionIds];
  }
  return role;
}

export function deleteRole(id: string): boolean {
  const index = ROLES.findIndex((r) => r.id === id);
  if (index === -1) {
    return false;
  }
  const role = ROLES[index];
  // Default roles cannot be deleted
  if (role != null && role.type === 'default') {
    return false;
  }

  // Remove from all policies' roleIds
  for (const policy of POLICIES) {
    policy.roleIds = policy.roleIds.filter((rid) => rid !== id);
  }

  ROLES.splice(index, 1);
  return true;
}

export function isRoleNameDuplicate(name: string, excludeId?: string): boolean {
  return ROLES.some((r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== excludeId);
}

export function getRoleImpact(roleId: string): RoleImpact {
  const linkedPolicies = POLICIES.filter((p) => p.roleIds.includes(roleId));
  const affectedMemberIds = new Set(linkedPolicies.flatMap((p) => p.memberIds));
  return {
    linkedPoliciesCount: linkedPolicies.length,
    affectedMembersCount: affectedMemberIds.size,
    linkedPolicyNames: linkedPolicies.map((p) => p.name),
  };
}
