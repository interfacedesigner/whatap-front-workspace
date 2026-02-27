/**
 * Onboarding API
 * @description 온보딩 API 래퍼. DEV 모드에서는 Mock API를 호출하고,
 * Production에서는 실제 API를 호출합니다.
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

// =============================================================================
// Step 1: Workspace
// =============================================================================

export async function createWorkspaceApi(params: {
  name: string;
  region: RegionOption;
  preset: WorkspacePreset;
}): Promise<CreateWorkspaceResponse> {
  // DEV 환경에서는 Mock 사용
  if (import.meta.env.DEV) {
    return mockCreateWorkspace(params);
  }

  // TODO: Production API 연동
  throw new Error('Production API not implemented');
}

// =============================================================================
// Step 2: Agent
// =============================================================================

export async function pollAgentStatusApi(): Promise<AgentPollingResponse> {
  if (import.meta.env.DEV) {
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
  if (import.meta.env.DEV) {
    return mockInviteMembers(members);
  }
  throw new Error('Production API not implemented');
}

// =============================================================================
// Step 4: Monitoring Rules
// =============================================================================

export async function saveMonitoringRulesApi(data: MonitoringRulesData): Promise<SaveMonitoringRulesResponse> {
  if (import.meta.env.DEV) {
    return mockSaveMonitoringRules(data);
  }
  throw new Error('Production API not implemented');
}

// =============================================================================
// Step 5: ActionBook
// =============================================================================

export async function saveActionBookApi(data: ActionBookData): Promise<SaveActionBookResponse> {
  if (import.meta.env.DEV) {
    return mockSaveActionBook(data);
  }
  throw new Error('Production API not implemented');
}

export async function testLlmConnectionApi(params: {
  provider: string;
  apiKey: string;
}): Promise<{ success: boolean; message: string }> {
  if (import.meta.env.DEV) {
    return mockTestLlmConnection(params);
  }
  throw new Error('Production API not implemented');
}

// =============================================================================
// Complete
// =============================================================================

export async function completeOnboardingApi(workspaceId: string): Promise<CompleteOnboardingResponse> {
  if (import.meta.env.DEV) {
    return mockCompleteOnboarding(workspaceId);
  }
  throw new Error('Production API not implemented');
}
