import type { SignupScenario } from './signup.context';

export interface TestScenarioEntry {
  label: string;
  description: string;
  badge: string;
  badgeColor: string;
  flow: string[];
  scenario: SignupScenario;
}

export const TEST_SCENARIOS: TestScenarioEntry[] = [
  {
    label: 'Default Signup',
    description: '일반 사용자가 직접 가입합니다. 모든 필드가 비어 있고 워크스페이스를 새로 생성합니다.',
    badge: 'Default',
    badgeColor: 'bg-gray-100 text-gray-700',
    flow: [
      '/signup-default',
      '/signup/lead-Info-default',
      '/signup/verify-default → verify-loading',
      '/signup-success/create-workspace',
    ],
    scenario: {
      type: 'default',
      email: '',
    },
  },
  {
    label: 'Invited — Single Workspace',
    description: 'Admin이 Operator를 단일 워크스페이스에 초대합니다. 이메일 읽기전용, Lead-info 프리필.',
    badge: 'Invited',
    badgeColor: 'bg-blue-50 text-[#1E3A8A]',
    flow: [
      '/signup-invited (email readonly)',
      '/signup/lead-Info-default-invited',
      '/signup/verify-default → verify-loading',
      '/signup-success/single-workspace',
    ],
    scenario: {
      type: 'invited-single',
      email: 'operator@whatap.io',
      token: 'test-invite-single',
      inviterName: 'Test Admin (admin@whatap.io)',
      workspaces: [{ id: 'ws-1', name: 'OpsGent Production', role: 'Operator' }],
      leadInfoPrefill: {
        companyName: 'WhaTap Labs',
        industry: 'Software / SaaS',
        infrastructureSize: '201+',
      },
    },
  },
  {
    label: 'Invited — Multiple Workspaces',
    description: 'Admin이 SRE Lead를 여러 워크스페이스에 초대합니다. 인증 후 워크스페이스 선택 화면으로 이동합니다.',
    badge: 'Multi',
    badgeColor: 'bg-amber-50 text-amber-700',
    flow: [
      '/signup-invited (email readonly)',
      '/signup/lead-Info-default-invited',
      '/signup/verify-default → verify-loading',
      '/signup/workspace-select',
      '/signup-success/multi-workspace',
    ],
    scenario: {
      type: 'invited-multi',
      email: 'sre-lead@whatap.io',
      token: 'test-invite-multi',
      inviterName: 'Test Admin (admin@whatap.io)',
      workspaces: [
        { id: 'ws-1', name: 'OpsGent Production', role: 'SRE Lead' },
        { id: 'ws-2', name: 'OpsGent Staging', role: 'SRE Lead' },
        { id: 'ws-3', name: 'OpsGent Development', role: 'Developer' },
      ],
      leadInfoPrefill: {
        companyName: 'WhaTap Labs',
        industry: 'Software / SaaS',
        infrastructureSize: '201+',
      },
    },
  },
];
