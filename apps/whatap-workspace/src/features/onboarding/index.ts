// Feature: Onboarding
// Public API — 다른 slice에서 이 feature 접근 시 이 파일을 통해 import

// Model
export type {
  ActionBookData,
  ActionBookItem,
  ActionBookPreset,
  AgentInstallData,
  AgentPlatform,
  ConnectedServer,
  DeliveryChannel,
  DeliveryChannelType,
  EventRule,
  EventSeverity,
  IncidentRule,
  IndustryCode,
  InvitedMember,
  LlmProvider,
  MemberInviteData,
  MemberRolePreset,
  MonitoringPreset,
  MonitoringRulesData,
  OnboardingProgress,
  OnboardingStep,
  RegionOption,
  StepMeta,
  WorkspacePreset,
  WorkspaceSetupData,
} from './model';

export { STEP_META } from './model';

export {
  // Atoms
  onboardingProgressAtom,
  workspaceSetupAtom,
  agentInstallAtom,
  memberInviteAtom,
  monitoringRulesAtom,
  actionBookAtom,
  // Derived
  currentStepAtom,
  completedStepsAtom,
  skippedStepsAtom,
  isOnboardingCompleteAtom,
  createdWorkspaceIdAtom,
  progressPercentAtom,
  isCurrentStepSkippableAtom,
  canProceedAtom,
  shouldShowOnboardingWidgetAtom,
  widgetDismissedAtom,
  // Actions
  goToNextStepAtom,
  skipCurrentStepAtom,
  goToPreviousStepAtom,
  goToStepAtom,
  setCreatedWorkspaceIdAtom,
  completeOnboardingAtom,
  resetOnboardingAtom,
} from './model';

// Schemas
export {
  workspaceSetupSchema,
  agentInstallSchema,
  memberEmailSchema,
  memberInviteSchema,
  monitoringRulesSchema,
  actionBookSchema,
} from './model';

// API
export {
  createWorkspaceApi,
  pollAgentStatusApi,
  resetAgentPollingApi,
  getInstallScript,
  inviteMembersApi,
  saveMonitoringRulesApi,
  saveActionBookApi,
  testLlmConnectionApi,
  completeOnboardingApi,
} from './api';
