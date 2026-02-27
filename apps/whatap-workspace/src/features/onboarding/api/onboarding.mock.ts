/**
 * Onboarding Mock API
 * @description 개발 환경용 온보딩 Mock API 함수들
 */
import type {
  ActionBookData,
  AgentPollingResponse,
  CompleteOnboardingResponse,
  ConnectedServer,
  CreateWorkspaceResponse,
  InviteMembersResponse,
  InvitedMember,
  MonitoringRulesData,
  RegionOption,
  SaveActionBookResponse,
  SaveMonitoringRulesResponse,
  WorkspacePreset,
} from '../model';

// =============================================================================
// Helpers
// =============================================================================

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// Step 1: Workspace Creation
// =============================================================================

export async function mockCreateWorkspace(params: {
  name: string;
  region: RegionOption;
  preset: WorkspacePreset;
}): Promise<CreateWorkspaceResponse> {
  await delay(1200);

  return {
    workspaceId: 'ws-onboarding-001',
    accessKey: `ak-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    name: params.name,
    region: params.region,
  };
}

// =============================================================================
// Step 2: Agent Install - Polling
// =============================================================================

/** 폴링 카운터 (연결된 서버 수를 점진적으로 늘림) */
let pollCount = 0;

const MOCK_SERVERS: ConnectedServer[] = [
  {
    id: 'srv-001',
    hostname: 'web-prod-01',
    ip: '10.0.1.10',
    os: 'Ubuntu 22.04',
    status: 'connected',
    connectedAt: new Date().toISOString(),
  },
  {
    id: 'srv-002',
    hostname: 'api-prod-01',
    ip: '10.0.1.20',
    os: 'Ubuntu 22.04',
    status: 'connected',
    connectedAt: new Date(Date.now() + 5000).toISOString(),
  },
  {
    id: 'srv-003',
    hostname: 'db-prod-01',
    ip: '10.0.2.10',
    os: 'Amazon Linux 2',
    status: 'connected',
    connectedAt: new Date(Date.now() + 10000).toISOString(),
  },
];

export async function mockPollAgentStatus(): Promise<AgentPollingResponse> {
  await delay(800);
  pollCount++;

  // 점진적으로 서버 연결 시뮬레이션
  const connectedCount = Math.min(pollCount, MOCK_SERVERS.length);
  const servers = MOCK_SERVERS.slice(0, connectedCount);

  return { servers };
}

export function resetAgentPolling(): void {
  pollCount = 0;
}

// =============================================================================
// Step 2: Install Script Generation
// =============================================================================

export function generateInstallScript(params: { accessKey: string; region: RegionOption; platform: string }): string {
  const regionHost: Record<string, string> = {
    'us-west-2': 'collector-us.opsgent.io',
    'ap-northeast-2': 'collector-kr.opsgent.io',
    'eu-west-1': 'collector-eu.opsgent.io',
  };

  const host = regionHost[params.region] || 'collector-us.opsgent.io';

  return `#!/bin/bash
# OpsGent Agent Installer
# Region: ${params.region} | Platform: ${params.platform}

set -e

echo "=== OpsGent Agent Installation ==="
echo "Downloading agent for ${params.platform}..."

curl -sL https://repo.opsgent.io/install.sh | \\
  WHATAP_ACCESS_KEY=${params.accessKey} \\
  WHATAP_COLLECTOR=${host} \\
  bash

echo "Agent installed successfully!"
echo "Starting monitoring agent..."

systemctl start whatap-agent
systemctl enable whatap-agent

echo "=== Installation Complete ==="`;
}

// =============================================================================
// Step 3: Member Invite
// =============================================================================

export async function mockInviteMembers(members: InvitedMember[]): Promise<InviteMembersResponse> {
  await delay(1000);

  // 일부 실패 시뮬레이션 (이메일에 'fail' 포함 시)
  const invited: string[] = [];
  const failed: string[] = [];

  for (const member of members) {
    if (member.email.includes('fail')) {
      failed.push(member.email);
    } else {
      invited.push(member.email);
    }
  }

  return { invited, failed };
}

// =============================================================================
// Step 4: Monitoring Rules
// =============================================================================

export async function mockSaveMonitoringRules(data: MonitoringRulesData): Promise<SaveMonitoringRulesResponse> {
  await delay(800);

  return {
    eventRuleCount: data.eventRules.length,
    incidentRuleCount: data.incidentRules.length,
    deliveryChannelCount: data.deliveryChannels.length,
  };
}

// =============================================================================
// Step 5: ActionBook
// =============================================================================

export async function mockSaveActionBook(data: ActionBookData): Promise<SaveActionBookResponse> {
  await delay(800);

  return {
    actionBookCount: data.actionBooks.length,
    autoActionEnabled: data.autoActionEnabled,
  };
}

export async function mockTestLlmConnection(params: {
  provider: string;
  apiKey: string;
}): Promise<{ success: boolean; message: string }> {
  await delay(1500);

  if (!params.apiKey || params.apiKey.length < 10) {
    return { success: false, message: 'Invalid API key. Please check your key and try again.' };
  }

  return { success: true, message: `Successfully connected to ${params.provider}.` };
}

// =============================================================================
// Complete Onboarding
// =============================================================================

export async function mockCompleteOnboarding(workspaceId: string): Promise<CompleteOnboardingResponse> {
  await delay(500);

  return {
    workspaceId,
    redirectUrl: `/ws/${workspaceId}`,
  };
}
