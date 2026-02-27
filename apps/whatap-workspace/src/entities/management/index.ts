/**
 * Management Entity Public API
 * @description RBAC 관리 엔티티의 외부 노출 인터페이스
 */

// Types
export type {
  CreateRolePayload,
  EffectivePermission,
  InviteMemberPayload,
  Member,
  MemberStatus,
  Permission,
  PermissionAction,
  PermissionDomain,
  PermissionScope,
  Policy,
  Role,
  RoleImpact,
  RoleType,
  UpdateRolePayload,
} from './model/management.types';

// Constants
export { MEMBER_STATUS_CONFIG, ROLE_TYPE_CONFIG } from './model/management.types';

// Mock Data & Queries
export {
  addMember,
  addPolicyToMember,
  addRole,
  deleteMember,
  deleteRole,
  formatDate,
  formatDateTime,
  getAllMembers,
  getAllPermissions,
  getAllPolicies,
  getAllRoles,
  getMemberByEmail,
  getMemberById,
  getMembersByPolicyId,
  getMembersByRoleId,
  getPermissionById,
  getPermissionsByMemberId,
  getPermissionsByRoleId,
  getPoliciesByMemberId,
  getPoliciesByRoleId,
  getPolicyById,
  getRoleById,
  getRoleImpact,
  getRoleNamesByMemberId,
  getRolesByMemberId,
  getRolesByPolicyId,
  getUnassignedPolicies,
  isRoleNameDuplicate,
  removePolicyFromMember,
  updateMember,
  updateRole,
} from './api/management.mock';
