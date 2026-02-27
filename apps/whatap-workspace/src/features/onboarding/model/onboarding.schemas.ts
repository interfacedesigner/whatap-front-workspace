/**
 * Onboarding Zod Schemas
 * @description 온보딩 각 스텝별 폼 데이터 유효성 검증 스키마
 */
import { z } from 'zod';

// =============================================================================
// Step 1: Workspace Setup
// =============================================================================

export const workspaceSetupSchema = z.object({
  name: z
    .string()
    .min(1, 'Workspace name is required.')
    .min(2, 'Workspace name must be at least 2 characters.')
    .max(50, 'Workspace name must be 50 characters or less.')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Only letters, numbers, spaces, hyphens, and underscores are allowed.'),
  region: z.enum(['ap-southeast-1', 'ap-northeast-2', 'ap-northeast-1', 'us-west-2', 'eu-west-1'], {
    message: 'Please select a region.',
  }),
  preset: z.enum(['startup', 'enterprise', 'custom'], {
    message: 'Please select a workspace preset.',
  }),
  industry: z.enum(['IND_ECOM', 'IND_FINT', 'IND_GAME', 'IND_SAAS', 'IND_GEN'], {
    message: 'Please select an industry.',
  }),
});

export type WorkspaceSetupFormData = z.infer<typeof workspaceSetupSchema>;

// =============================================================================
// Step 2: Agent Install (No form validation needed - platform selection only)
// =============================================================================

export const agentInstallSchema = z.object({
  platform: z.enum(['linux-x86_64', 'linux-arm64', 'darwin-arm64', 'windows-x86_64'], {
    message: 'Please select a platform.',
  }),
});

export type AgentInstallFormData = z.infer<typeof agentInstallSchema>;

// =============================================================================
// Step 3: Member Invite
// =============================================================================

export const memberEmailSchema = z
  .string()
  .email('Invalid email format.')
  .max(254, 'Email must be 254 characters or less.');

export const memberInviteSchema = z.object({
  invitedMembers: z.array(
    z.object({
      email: memberEmailSchema,
      role: z.enum(['viewer', 'developer', 'admin']),
    }),
  ),
  rolePreset: z.enum(['viewer', 'developer', 'admin']),
});

export type MemberInviteFormData = z.infer<typeof memberInviteSchema>;

// =============================================================================
// Step 4: Monitoring Rules
// =============================================================================

export const deliveryChannelConfigSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    recipients: z.string().min(1, 'At least one recipient is required.'),
  }),
  z.object({
    type: z.literal('slack'),
    webhookUrl: z
      .string()
      .url('Invalid Slack webhook URL.')
      .startsWith('https://hooks.slack.com/', 'Must be a valid Slack webhook URL.'),
  }),
  z.object({
    type: z.literal('pagerduty'),
    integrationKey: z
      .string()
      .min(1, 'PagerDuty integration key is required.')
      .length(32, 'Integration key must be 32 characters.'),
  }),
  z.object({
    type: z.literal('webhook'),
    url: z.string().url('Invalid webhook URL.'),
  }),
]);

export const monitoringRulesSchema = z.object({
  preset: z.enum(['basic', 'advanced', 'custom']),
});

export type MonitoringRulesFormData = z.infer<typeof monitoringRulesSchema>;

// =============================================================================
// Step 5: ActionBook
// =============================================================================

export const actionBookSchema = z.object({
  llmProvider: z.enum(['openai', 'anthropic', 'azure-openai']).nullable(),
  llmApiKey: z.string().optional(),
  preset: z.enum(['basic-ops', 'incident-response', 'full-automation']),
  autoActionEnabled: z.boolean(),
});

export type ActionBookFormData = z.infer<typeof actionBookSchema>;
