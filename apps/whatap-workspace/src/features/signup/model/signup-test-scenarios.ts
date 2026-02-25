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
    description: '초대 링크를 통해 하나의 워크스페이스에 가입합니다. 이메일 읽기전용, Lead-info 프리필.',
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
      email: 'alex.kim@whatap.io',
      token: 'test-invite-single',
      inviterName: 'Jay Park',
      workspaces: [{ id: 'ws-1', name: 'WhaTap Production', role: 'SRE' }],
      leadInfoPrefill: {
        companyName: 'WhaTap',
        industry: 'Software / SaaS',
        infrastructureSize: '201+',
      },
    },
  },
  {
    label: 'Invited — Multiple Workspaces',
    description: '초대 링크를 통해 여러 워크스페이스에 가입합니다. 인증 후 워크스페이스 선택 화면으로 이동합니다.',
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
      email: 'alex.kim@whatap.io',
      token: 'test-invite-multi',
      inviterName: 'Jay Park',
      workspaces: [
        { id: 'ws-1', name: 'WhaTap Production', role: 'SRE' },
        { id: 'ws-2', name: 'WhaTap Staging', role: 'DevOps' },
        { id: 'ws-3', name: 'WhaTap Development', role: 'Backend' },
      ],
      leadInfoPrefill: {
        companyName: 'WhaTap',
        industry: 'Software / SaaS',
        infrastructureSize: '201+',
      },
    },
  },
];
