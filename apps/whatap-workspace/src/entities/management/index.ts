/**
 * Management Entity Public API
 * @description RBAC 관리 엔티티의 외부 노출 인터페이스
 */

// Types
export type {
  Member,
  MemberStatus,
  Permission,
  PermissionAction,
  PermissionDomain,
  PermissionScope,
  Policy,
  Role,
} from './model/management.types';

// Constants
export { MEMBER_STATUS_CONFIG } from './model/management.types';

// Mock Data & Queries
export {
  formatDate,
  formatDateTime,
  getAllMembers,
  getAllPermissions,
  getAllPolicies,
  getAllRoles,
  getMemberById,
  getMembersByPolicyId,
  getMembersByRoleId,
  getPermissionById,
  getPermissionsByRoleId,
  getPoliciesByMemberId,
  getPoliciesByRoleId,
  getPolicyById,
  getRoleById,
  getRolesByMemberId,
  getRolesByPolicyId,
} from './api/management.mock';
