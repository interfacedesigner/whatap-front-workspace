/**
 * Onboarding API
 * @description 온보딩 API 래퍼. API 서버가 없으면 Mock API를 호출하고,
 * API 서버가 설정되면 실제 API를 호출합니다.
 */
import type {
  ActionBookData,
  AgentPollingResponse,
  CompleteOnboardingResponse,
  CreateWorkspaceResponse,
  InviteMembersResponse,
  InvitedMember,
  MonitoringRulesData,
  RegionOption,
  SaveActionBookResponse,
  SaveMonitoringRulesResponse,
  WorkspacePreset,
} from '../model';
import {
  generateInstallScript,
  mockCompleteOnboarding,
  mockCreateWorkspace,
  mockInviteMembers,
  mockPollAgentStatus,
  mockSaveActionBook,
  mockSaveMonitoringRules,
  mockTestLlmConnection,
  resetAgentPolling,
} from './onboarding.mock';

/** API 서버가 설정되지 않으면 Mock 모드 (로컬 개발 + Vercel 데모) */
const USE_MOCK = !import.meta.env.VITE_API_URL;

// =============================================================================
// Step 1: Workspace
// =============================================================================

export async function createWorkspaceApi(params: {
  name: string;
  region: RegionOption;
  preset: WorkspacePreset;
}): Promise<CreateWorkspaceResponse> {
  if (USE_MOCK) {
    return mockCreateWorkspace(params);
  }

  // TODO: Production API 연동
  throw new Error('Production API not implemented');
}

// =============================================================================
// Step 2: Agent
// =============================================================================

export async function pollAgentStatusApi(): Promise<AgentPollingResponse> {
  if (USE_MOCK) {
    return mockPollAgentStatus();
  }
  throw new Error('Production API not implemented');
}

export function resetAgentPollingApi(): void {
  resetAgentPolling();
}

export function getInstallScript(params: { accessKey: string; region: RegionOption; platform: string }): string {
  return generateInstallScript(params);
}

// =============================================================================
// Step 3: Members
// =============================================================================

export async function inviteMembersApi(members: InvitedMember[]): Promise<InviteMembersResponse> {
  if (USE_MOCK) {
    return mockInviteMembers(members);
  }
  throw new Error('Production API not implemented');
}

// =============================================================================
// Step 4: Monitoring Rules
// =============================================================================

export async function saveMonitoringRulesApi(data: MonitoringRulesData): Promise<SaveMonitoringRulesResponse> {
  if (USE_MOCK) {
    return mockSaveMonitoringRules(data);
  }
  throw new Error('Production API not implemented');
}

// =============================================================================
// Step 5: ActionBook
// =============================================================================

export async function saveActionBookApi(data: ActionBookData): Promise<SaveActionBookResponse> {
  if (USE_MOCK) {
    return mockSaveActionBook(data);
  }
  throw new Error('Production API not implemented');
}

export async function testLlmConnectionApi(params: {
  provider: string;
  apiKey: string;
}): Promise<{ success: boolean; message: string }> {
  if (USE_MOCK) {
    return mockTestLlmConnection(params);
  }
  throw new Error('Production API not implemented');
}

// =============================================================================
// Complete
// =============================================================================

export async function completeOnboardingApi(workspaceId: string): Promise<CompleteOnboardingResponse> {
  if (USE_MOCK) {
    return mockCompleteOnboarding(workspaceId);
  }
  throw new Error('Production API not implemented');
}
