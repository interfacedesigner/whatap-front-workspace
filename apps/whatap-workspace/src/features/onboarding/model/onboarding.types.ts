/**
 * Onboarding Types
 * @description 온보딩 5단계 마법사의 전체 타입 정의
 */

// =============================================================================
// Step Definitions
// =============================================================================

/** 온보딩 스텝 번호 (1~5) */
export type OnboardingStep = 1 | 2 | 3 | 4 | 5;

/** 각 스텝의 메타 정보 */
export interface StepMeta {
  step: OnboardingStep;
  title: string;
  description: string;
  isSkippable: boolean;
}

/** 모든 스텝 메타 정보 */
export const STEP_META: Record<OnboardingStep, StepMeta> = {
  1: {
    step: 1,
    title: 'Create Workspace',
    description: 'Set up your workspace name and region',
    isSkippable: false,
  },
  2: {
    step: 2,
    title: 'Install Agent',
    description: 'Install the monitoring agent on your servers',
    isSkippable: true,
  },
  3: {
    step: 3,
    title: 'Invite Members',
    description: 'Invite your team members to the workspace',
    isSkippable: true,
  },
  4: {
    step: 4,
    title: 'Monitoring Rules',
    description: 'Configure event and incident rules',
    isSkippable: true,
  },
  5: {
    step: 5,
    title: 'ActionBook',
    description: 'Set up AI-powered automation',
    isSkippable: true,
  },
};

// =============================================================================
// Industry (업종)
// =============================================================================

/** 업종 코드 */
export type IndustryCode = 'IND_ECOM' | 'IND_FINT' | 'IND_GAME' | 'IND_SAAS' | 'IND_GEN';

// =============================================================================
// Step 1: Workspace Setup
// =============================================================================

export type RegionOption = 'ap-southeast-1' | 'ap-northeast-2' | 'ap-northeast-1' | 'us-west-2' | 'eu-west-1';

export type WorkspacePreset = 'startup' | 'enterprise' | 'custom';

export interface WorkspaceSetupData {
  name: string;
  region: RegionOption;
  preset: WorkspacePreset;
  industry: IndustryCode;
}

export const DEFAULT_WORKSPACE_SETUP: WorkspaceSetupData = {
  name: '',
  region: 'us-west-2',
  preset: 'startup',
  industry: 'IND_GEN',
};

// =============================================================================
// Step 2: Agent Install
// =============================================================================

export type AgentPlatform = 'linux-x86_64' | 'linux-arm64' | 'darwin-arm64' | 'windows-x86_64';

export interface ConnectedServer {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  status: 'connected' | 'pending';
  connectedAt: string;
}

export interface AgentInstallData {
  platform: AgentPlatform;
  connectedServers: ConnectedServer[];
}

export const DEFAULT_AGENT_INSTALL: AgentInstallData = {
  platform: 'linux-x86_64',
  connectedServers: [],
};

// =============================================================================
// Step 3: Member Invite
// =============================================================================

export type MemberRolePreset = 'viewer' | 'developer' | 'admin';

export interface InvitedMember {
  email: string;
  role: MemberRolePreset;
}

export interface MemberInviteData {
  invitedMembers: InvitedMember[];
  rolePreset: MemberRolePreset;
}

export const DEFAULT_MEMBER_INVITE: MemberInviteData = {
  invitedMembers: [],
  rolePreset: 'viewer',
};

// =============================================================================
// Step 4: Monitoring Rules
// =============================================================================

export type MonitoringPreset = 'basic' | 'advanced' | 'custom';

export type EventSeverity = 'critical' | 'warning' | 'info';

export interface EventRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  severity: EventSeverity;
  enabled: boolean;
}

export interface IncidentRule {
  id: string;
  name: string;
  triggerCondition: string;
  autoEscalation: boolean;
  severity: EventSeverity;
  enabled: boolean;
}

export type DeliveryChannelType = 'email' | 'slack' | 'pagerduty' | 'webhook';

export interface DeliveryChannel {
  id: string;
  type: DeliveryChannelType;
  name: string;
  config: Record<string, string>;
  enabled: boolean;
}

export interface MonitoringRulesData {
  preset: MonitoringPreset;
  eventRules: EventRule[];
  incidentRules: IncidentRule[];
  deliveryChannels: DeliveryChannel[];
}

export const DEFAULT_MONITORING_RULES: MonitoringRulesData = {
  preset: 'basic',
  eventRules: [],
  incidentRules: [],
  deliveryChannels: [],
};

// =============================================================================
// Step 5: ActionBook
// =============================================================================

export type LlmProvider = 'openai' | 'anthropic' | 'azure-openai';

export type ActionBookPreset = 'basic-ops' | 'incident-response' | 'full-automation';

export interface ActionBookItem {
  id: string;
  name: string;
  description: string;
  category: string;
  severity: 'low' | 'critical';
  autoActionEnabled: boolean;
}

export interface ActionBookData {
  llmProvider: LlmProvider | null;
  llmApiKey: string;
  preset: ActionBookPreset;
  actionBooks: ActionBookItem[];
  autoActionEnabled: boolean;
}

export const DEFAULT_ACTIONBOOK: ActionBookData = {
  llmProvider: null,
  llmApiKey: '',
  preset: 'basic-ops',
  actionBooks: [],
  autoActionEnabled: false,
};

// =============================================================================
// Onboarding Progress
// =============================================================================

export interface OnboardingProgress {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  skippedSteps: OnboardingStep[];
  isComplete: boolean;
  createdWorkspaceId: string | null;
}

export const DEFAULT_ONBOARDING_PROGRESS: OnboardingProgress = {
  currentStep: 1,
  completedSteps: [],
  skippedSteps: [],
  isComplete: false,
  createdWorkspaceId: null,
};

// =============================================================================
// API Types
// =============================================================================

export interface CreateWorkspaceResponse {
  workspaceId: string;
  accessKey: string;
  name: string;
  region: RegionOption;
}

export interface AgentPollingResponse {
  servers: ConnectedServer[];
}

export interface InviteMembersResponse {
  invited: string[];
  failed: string[];
}

export interface SaveMonitoringRulesResponse {
  eventRuleCount: number;
  incidentRuleCount: number;
  deliveryChannelCount: number;
}

export interface SaveActionBookResponse {
  actionBookCount: number;
  autoActionEnabled: boolean;
}

export interface CompleteOnboardingResponse {
  workspaceId: string;
  redirectUrl: string;
}
