/**
 * Onboarding Presets
 * @description 각 스텝에서 사용하는 Preset 상수 데이터
 * 업종(Industry)별 추가 규칙 포함
 */
import type {
  ActionBookItem,
  ActionBookPreset,
  DeliveryChannel,
  EventRule,
  IncidentRule,
  IndustryCode,
  MonitoringPreset,
  RegionOption,
  WorkspacePreset,
} from '@/features/onboarding';

// =============================================================================
// Industry Presets (업종)
// =============================================================================

export interface IndustryPresetInfo {
  value: IndustryCode;
  title: string;
  description: string;
  icon: string;
}

export const INDUSTRY_PRESETS: IndustryPresetInfo[] = [
  {
    value: 'IND_ECOM',
    title: 'E-Commerce',
    description: 'Retail, marketplace, payment processing',
    icon: '🛒',
  },
  {
    value: 'IND_FINT',
    title: 'Fintech / Finance',
    description: 'Banking, insurance, trading platforms',
    icon: '💰',
  },
  {
    value: 'IND_GAME',
    title: 'Gaming',
    description: 'Online games, real-time multiplayer',
    icon: '🎮',
  },
  {
    value: 'IND_SAAS',
    title: 'SaaS / Cloud',
    description: 'Cloud services, API platforms',
    icon: '☁️',
  },
  {
    value: 'IND_GEN',
    title: 'General',
    description: 'General-purpose monitoring',
    icon: '🏢',
  },
];

// =============================================================================
// Step 1: Workspace Presets (Scale)
// =============================================================================

export interface WorkspacePresetInfo {
  value: WorkspacePreset;
  title: string;
  description: string;
  badge?: string | undefined;
  features: string[];
}

export const WORKSPACE_PRESETS: WorkspacePresetInfo[] = [
  {
    value: 'startup',
    title: 'Startup',
    description: 'Optimized defaults for small-to-medium teams.',
    badge: 'Recommended',
    features: ['Up to 20 servers', 'Basic event & incident rules', 'Email + Slack notifications'],
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    description: 'Full-featured setup with advanced monitoring and AI automation.',
    badge: 'Premium',
    features: ['Unlimited servers', 'Advanced rules & AI ActionBook', 'All delivery channels + RBAC'],
  },
  {
    value: 'custom',
    title: 'Custom',
    description: 'Start from scratch and configure everything manually.',
    features: ['Manual rule configuration', 'Fine-grained control', 'Full customization'],
  },
];

export interface RegionInfo {
  value: RegionOption;
  label: string;
  flag: string;
  location: string;
}

export const REGIONS: RegionInfo[] = [
  { value: 'ap-southeast-1', label: 'SE Asia (Singapore)', flag: '🇸🇬', location: 'Singapore' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)', flag: '🇰🇷', location: 'Seoul, Korea' },
  { value: 'ap-northeast-1', label: 'Japan (Tokyo)', flag: '🇯🇵', location: 'Tokyo, Japan' },
  { value: 'us-west-2', label: 'US West (Oregon)', flag: '🇺🇸', location: 'Oregon, USA' },
  { value: 'eu-west-1', label: 'Europe (Ireland)', flag: '🇮🇪', location: 'Dublin, Ireland' },
];

// =============================================================================
// Step 2: Agent Platform Info
// =============================================================================

export interface PlatformInfo {
  value: string;
  label: string;
  os: string;
  arch: string;
  icon: string;
}

export const AGENT_PLATFORMS: PlatformInfo[] = [
  { value: 'linux-x86_64', label: 'Linux x86_64', os: 'Linux', arch: 'x86_64', icon: '🐧' },
  { value: 'linux-arm64', label: 'Linux ARM64', os: 'Linux', arch: 'ARM64', icon: '🐧' },
  { value: 'darwin-arm64', label: 'macOS (Apple Silicon)', os: 'macOS', arch: 'ARM64', icon: '🍎' },
  { value: 'windows-x86_64', label: 'Windows x86_64', os: 'Windows', arch: 'x86_64', icon: '🪟' },
];

// =============================================================================
// Step 3: Member Role Presets
// =============================================================================

export interface MemberRoleInfo {
  value: string;
  title: string;
  description: string;
  permissions: string[];
}

export const MEMBER_ROLE_PRESETS: MemberRoleInfo[] = [
  {
    value: 'viewer',
    title: 'Viewer',
    description: 'Read-only access to dashboards and metrics.',
    permissions: ['View dashboards', 'View server metrics', 'View event history'],
  },
  {
    value: 'developer',
    title: 'Developer',
    description: 'Can manage logs, APM data, and server configurations.',
    permissions: ['All Viewer permissions', 'Manage logs', 'Manage APM data', 'Edit server configs'],
  },
  {
    value: 'admin',
    title: 'Admin',
    description: 'Full access including member and role management.',
    permissions: ['All Developer permissions', 'Manage members', 'Manage roles', 'Manage policies'],
  },
];

// =============================================================================
// Step 4: Monitoring Rule Presets (Base)
// =============================================================================

export interface MonitoringPresetInfo {
  value: MonitoringPreset;
  title: string;
  description: string;
  eventRules: EventRule[];
  incidentRules: IncidentRule[];
  deliveryChannels: DeliveryChannel[];
}

/** Base monitoring presets (공통 기본 규칙) */
export const MONITORING_PRESETS: MonitoringPresetInfo[] = [
  {
    value: 'basic',
    title: 'Basic Monitoring',
    description: 'Essential alerts for CPU, memory, and disk usage.',
    eventRules: [
      {
        id: 'evt-001',
        name: 'High CPU Usage',
        metric: 'cpu_usage',
        condition: '>',
        threshold: 90,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-002',
        name: 'High Memory Usage',
        metric: 'mem_usage',
        condition: '>',
        threshold: 85,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-003',
        name: 'Disk Full Warning',
        metric: 'disk_usage',
        condition: '>',
        threshold: 80,
        severity: 'critical',
        enabled: true,
      },
    ],
    incidentRules: [
      {
        id: 'inc-001',
        name: 'Server Down',
        triggerCondition: 'agent_offline > 5min',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
    ],
    deliveryChannels: [],
  },
  {
    value: 'advanced',
    title: 'Advanced Monitoring',
    description: 'Full observability with anomaly detection and auto-escalation.',
    eventRules: [
      {
        id: 'evt-201',
        name: 'CPU Warning',
        metric: 'cpu_usage',
        condition: '>',
        threshold: 80,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-202',
        name: 'CPU Critical',
        metric: 'cpu_usage',
        condition: '>',
        threshold: 90,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-203',
        name: 'Memory Warning',
        metric: 'mem_usage',
        condition: '>',
        threshold: 75,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-204',
        name: 'Memory Critical',
        metric: 'mem_usage',
        condition: '>',
        threshold: 90,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-205',
        name: 'Disk Warning',
        metric: 'disk_usage',
        condition: '>',
        threshold: 70,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-206',
        name: 'Disk Critical',
        metric: 'disk_usage',
        condition: '>',
        threshold: 85,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-207',
        name: 'Network Anomaly',
        metric: 'net_io_anomaly',
        condition: '>',
        threshold: 2,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-208',
        name: 'Process Count High',
        metric: 'proc_count',
        condition: '>',
        threshold: 500,
        severity: 'info',
        enabled: true,
      },
    ],
    incidentRules: [
      {
        id: 'inc-201',
        name: 'Server Down',
        triggerCondition: 'agent_offline > 2min',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'inc-202',
        name: 'Repeated CPU Alerts',
        triggerCondition: 'cpu_warning > 3 in 5min',
        autoEscalation: true,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'inc-203',
        name: 'Memory Leak Detected',
        triggerCondition: 'mem_trend_increase > 30min',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'inc-204',
        name: 'Disk Prediction Full',
        triggerCondition: 'disk_prediction_full < 24h',
        autoEscalation: false,
        severity: 'warning',
        enabled: true,
      },
    ],
    deliveryChannels: [],
  },
  {
    value: 'custom',
    title: 'Custom',
    description: 'Start with minimal rules and configure everything manually.',
    eventRules: [],
    incidentRules: [],
    deliveryChannels: [],
  },
];

// =============================================================================
// Step 4: Industry-Specific Additional Monitoring Rules
// 공통 기본 규칙 위에 업종별 추가 규칙을 덧붙이는 구조 (덮어쓰기 아님)
// =============================================================================

export interface IndustryMonitoringRules {
  eventRules: EventRule[];
  incidentRules: IncidentRule[];
  deliveryRules: DeliveryChannel[];
}

/** 업종별 추가 모니터링 규칙 (Advanced Preset 기준) */
export const INDUSTRY_MONITORING_RULES: Record<IndustryCode, IndustryMonitoringRules> = {
  IND_ECOM: {
    eventRules: [
      {
        id: 'evt-ecom-01',
        name: 'API Latency High (Checkout)',
        metric: 'api_latency_checkout',
        condition: '>',
        threshold: 500,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-ecom-02',
        name: 'Cart Abandonment Spike',
        metric: 'cart_abandon_rate',
        condition: '>',
        threshold: 30,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-ecom-03',
        name: 'Payment Gateway Error Rate',
        metric: 'payment_error_rate',
        condition: '>',
        threshold: 1,
        severity: 'critical',
        enabled: true,
      },
    ],
    incidentRules: [
      {
        id: 'inc-ecom-01',
        name: 'Checkout Flow Down',
        triggerCondition: 'checkout_error_rate > 5% for 2min',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'inc-ecom-02',
        name: 'Inventory Sync Failure',
        triggerCondition: 'inventory_sync_fail > 3 in 10min',
        autoEscalation: false,
        severity: 'warning',
        enabled: true,
      },
    ],
    deliveryRules: [
      {
        id: 'del-ecom-01',
        type: 'slack',
        name: 'E-Commerce Alerts — Slack',
        config: { value: '#ecommerce-alerts' },
        enabled: true,
      },
    ],
  },
  IND_FINT: {
    eventRules: [
      {
        id: 'evt-fint-01',
        name: 'Transaction Latency Critical',
        metric: 'txn_latency',
        condition: '>',
        threshold: 200,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-fint-02',
        name: 'Auth Failure Rate High',
        metric: 'auth_fail_rate',
        condition: '>',
        threshold: 5,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-fint-03',
        name: 'Compliance Audit Event',
        metric: 'audit_event_count',
        condition: '>',
        threshold: 1000,
        severity: 'info',
        enabled: true,
      },
    ],
    incidentRules: [
      {
        id: 'inc-fint-01',
        name: 'Core Banking Service Down',
        triggerCondition: 'core_banking_health == 0 for 1min',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'inc-fint-02',
        name: 'Fraud Detection Anomaly',
        triggerCondition: 'fraud_score_anomaly > 3 sigma',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
    ],
    deliveryRules: [
      {
        id: 'del-fint-01',
        type: 'pagerduty',
        name: 'Fintech Incidents — PagerDuty',
        config: { value: 'fintech-oncall' },
        enabled: true,
      },
    ],
  },
  IND_GAME: {
    eventRules: [
      {
        id: 'evt-game-01',
        name: 'Game Server Tick Rate Low',
        metric: 'tick_rate',
        condition: '<',
        threshold: 20,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-game-02',
        name: 'Matchmaking Queue Full',
        metric: 'matchmaking_queue',
        condition: '>',
        threshold: 5000,
        severity: 'warning',
        enabled: true,
      },
      {
        id: 'evt-game-03',
        name: 'Concurrent Users Spike',
        metric: 'concurrent_users',
        condition: '>',
        threshold: 50000,
        severity: 'info',
        enabled: true,
      },
    ],
    incidentRules: [
      {
        id: 'inc-game-01',
        name: 'Game Server Crash',
        triggerCondition: 'game_server_crash > 0',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'inc-game-02',
        name: 'Player Desync Spike',
        triggerCondition: 'desync_rate > 10% for 3min',
        autoEscalation: false,
        severity: 'warning',
        enabled: true,
      },
    ],
    deliveryRules: [
      {
        id: 'del-game-01',
        type: 'slack',
        name: 'Game Ops Alerts — Slack',
        config: { value: '#game-ops' },
        enabled: true,
      },
    ],
  },
  IND_SAAS: {
    eventRules: [
      {
        id: 'evt-saas-01',
        name: 'API Error Rate High',
        metric: 'api_error_rate',
        condition: '>',
        threshold: 2,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-saas-02',
        name: 'Tenant DB Connection Pool Exhausted',
        metric: 'db_conn_pool_usage',
        condition: '>',
        threshold: 90,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'evt-saas-03',
        name: 'Background Job Queue Backup',
        metric: 'job_queue_size',
        condition: '>',
        threshold: 10000,
        severity: 'warning',
        enabled: true,
      },
    ],
    incidentRules: [
      {
        id: 'inc-saas-01',
        name: 'Multi-Tenant Service Degradation',
        triggerCondition: 'service_health < 95% for 5min',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'inc-saas-02',
        name: 'SLA Breach Risk',
        triggerCondition: 'uptime < 99.9% in 24h window',
        autoEscalation: true,
        severity: 'critical',
        enabled: true,
      },
    ],
    deliveryRules: [
      {
        id: 'del-saas-01',
        type: 'webhook',
        name: 'SaaS Alerts — Webhook',
        config: { value: 'https://hooks.internal/saas-alerts' },
        enabled: true,
      },
    ],
  },
  IND_GEN: {
    eventRules: [],
    incidentRules: [],
    deliveryRules: [],
  },
};

/**
 * 업종별 모니터링 규칙을 기본 Preset 규칙과 병합하는 헬퍼
 * 공통 기본 규칙 + 업종 특화 추가분
 */
export function getMergedMonitoringRules(
  presetValue: MonitoringPreset,
  industry: IndustryCode,
): { eventRules: EventRule[]; incidentRules: IncidentRule[]; deliveryChannels: DeliveryChannel[] } {
  const basePreset = MONITORING_PRESETS.find((p) => p.value === presetValue);
  const industryRules = INDUSTRY_MONITORING_RULES[industry];

  if (!basePreset) {
    return { eventRules: [], incidentRules: [], deliveryChannels: [] };
  }

  // Custom preset인 경우 업종 규칙도 미적용
  if (presetValue === 'custom') {
    return { eventRules: [], incidentRules: [], deliveryChannels: [] };
  }

  return {
    eventRules: [...basePreset.eventRules, ...industryRules.eventRules],
    incidentRules: [...basePreset.incidentRules, ...industryRules.incidentRules],
    deliveryChannels: [...basePreset.deliveryChannels, ...industryRules.deliveryRules],
  };
}

// =============================================================================
// Step 5: ActionBook Presets (Base)
// =============================================================================

export interface ActionBookPresetInfo {
  value: ActionBookPreset;
  title: string;
  description: string;
  actionBooks: ActionBookItem[];
}

export const ACTIONBOOK_PRESETS: ActionBookPresetInfo[] = [
  {
    value: 'basic-ops',
    title: 'Basic Operations',
    description: 'Essential automation for common operational tasks.',
    actionBooks: [
      {
        id: 'ab-001',
        name: 'Restart Service',
        description: 'Safely restart a system service with health check',
        category: 'Service Management',
        severity: 'low',
        autoActionEnabled: false,
      },
      {
        id: 'ab-002',
        name: 'Clear Disk Space',
        description: 'Remove temporary files and old logs to free disk space',
        category: 'Disk Management',
        severity: 'low',
        autoActionEnabled: false,
      },
      {
        id: 'ab-003',
        name: 'Check Process Health',
        description: 'Verify process status and resource consumption',
        category: 'Diagnostics',
        severity: 'low',
        autoActionEnabled: false,
      },
    ],
  },
  {
    value: 'incident-response',
    title: 'Incident Response',
    description: 'Automated incident investigation and initial response.',
    actionBooks: [
      {
        id: 'ab-101',
        name: 'Collect Diagnostics',
        description: 'Gather system logs, metrics, and process info for analysis',
        category: 'Diagnostics',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-102',
        name: 'Kill Runaway Process',
        description: 'Identify and terminate processes consuming excessive resources',
        category: 'Process Management',
        severity: 'critical',
        autoActionEnabled: false,
      },
      {
        id: 'ab-103',
        name: 'Restart Failed Service',
        description: 'Detect and restart failed services with rollback capability',
        category: 'Service Management',
        severity: 'critical',
        autoActionEnabled: false,
      },
      {
        id: 'ab-104',
        name: 'Network Connectivity Check',
        description: 'Diagnose network issues and test connectivity to dependencies',
        category: 'Network',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-105',
        name: 'Scale Resources',
        description: 'Temporarily increase server resources during peak load',
        category: 'Resource Management',
        severity: 'critical',
        autoActionEnabled: false,
      },
    ],
  },
  {
    value: 'full-automation',
    title: 'Full Automation',
    description: 'Comprehensive AI-driven automation with auto-action capabilities.',
    actionBooks: [
      {
        id: 'ab-201',
        name: 'Auto-Heal Service',
        description: 'Automatically detect and recover failed services',
        category: 'Auto-Healing',
        severity: 'critical',
        autoActionEnabled: true,
      },
      {
        id: 'ab-202',
        name: 'Predictive Scaling',
        description: 'Scale resources based on predicted demand patterns',
        category: 'Auto-Scaling',
        severity: 'critical',
        autoActionEnabled: true,
      },
      {
        id: 'ab-203',
        name: 'Log Analysis & Triage',
        description: 'AI-powered log analysis for anomaly detection',
        category: 'AI Analysis',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-204',
        name: 'Root Cause Analysis',
        description: 'Automated RCA with correlated evidence timeline',
        category: 'AI Analysis',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-205',
        name: 'Incident Documentation',
        description: 'Auto-generate incident reports and postmortems',
        category: 'Documentation',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-206',
        name: 'Security Patch Check',
        description: 'Scan for missing security patches and recommend updates',
        category: 'Security',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-207',
        name: 'Database Optimization',
        description: 'Analyze slow queries and recommend index improvements',
        category: 'Database',
        severity: 'critical',
        autoActionEnabled: false,
      },
    ],
  },
];

// =============================================================================
// Step 5: Industry-Specific Additional ActionBooks
// 공통 기본 ActionBook 위에 업종별 추가 ActionBook을 덧붙이는 구조
// =============================================================================

export interface IndustryActionBooks {
  actionBooks: ActionBookItem[];
  autoActionRules: string[];
}

export const INDUSTRY_ACTIONBOOKS: Record<IndustryCode, IndustryActionBooks> = {
  IND_ECOM: {
    actionBooks: [
      {
        id: 'ab-ecom-01',
        name: 'Scale Payment Gateway',
        description: 'Auto-scale payment gateway instances during peak traffic',
        category: 'E-Commerce',
        severity: 'critical',
        autoActionEnabled: false,
      },
      {
        id: 'ab-ecom-02',
        name: 'CDN Cache Purge',
        description: 'Purge CDN cache for updated product pages',
        category: 'E-Commerce',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-ecom-03',
        name: 'Cart Recovery Diagnostics',
        description: 'Analyze cart abandonment patterns and API errors',
        category: 'E-Commerce',
        severity: 'low',
        autoActionEnabled: true,
      },
    ],
    autoActionRules: ['On payment_error → Scale Payment Gateway', 'On cdn_stale → CDN Cache Purge'],
  },
  IND_FINT: {
    actionBooks: [
      {
        id: 'ab-fint-01',
        name: 'Transaction Rollback',
        description: 'Safely rollback failed transactions with audit trail',
        category: 'Finance',
        severity: 'critical',
        autoActionEnabled: false,
      },
      {
        id: 'ab-fint-02',
        name: 'Compliance Report Generation',
        description: 'Generate compliance audit reports for regulatory review',
        category: 'Finance',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-fint-03',
        name: 'Fraud Investigation Package',
        description: 'Collect evidence package for suspicious transaction analysis',
        category: 'Finance',
        severity: 'low',
        autoActionEnabled: true,
      },
    ],
    autoActionRules: ['On fraud_alert → Fraud Investigation Package', 'On compliance_event → Compliance Report'],
  },
  IND_GAME: {
    actionBooks: [
      {
        id: 'ab-game-01',
        name: 'Game Server Hot Restart',
        description: 'Restart game server instance with player session migration',
        category: 'Gaming',
        severity: 'critical',
        autoActionEnabled: false,
      },
      {
        id: 'ab-game-02',
        name: 'Matchmaking Rebalance',
        description: 'Rebalance matchmaking pools when queue threshold exceeded',
        category: 'Gaming',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-game-03',
        name: 'Player Data Backup',
        description: 'Emergency backup of player progression data',
        category: 'Gaming',
        severity: 'critical',
        autoActionEnabled: false,
      },
    ],
    autoActionRules: ['On queue_full → Matchmaking Rebalance', 'On server_crash → Player Data Backup'],
  },
  IND_SAAS: {
    actionBooks: [
      {
        id: 'ab-saas-01',
        name: 'Tenant Isolation Check',
        description: 'Verify tenant data isolation after service disruption',
        category: 'SaaS',
        severity: 'critical',
        autoActionEnabled: false,
      },
      {
        id: 'ab-saas-02',
        name: 'API Rate Limit Adjustment',
        description: 'Dynamically adjust API rate limits during traffic spikes',
        category: 'SaaS',
        severity: 'low',
        autoActionEnabled: true,
      },
      {
        id: 'ab-saas-03',
        name: 'SLA Dashboard Refresh',
        description: 'Update SLA dashboards with latest uptime metrics',
        category: 'SaaS',
        severity: 'low',
        autoActionEnabled: true,
      },
    ],
    autoActionRules: ['On traffic_spike → API Rate Limit Adjustment', 'On sla_breach_risk → SLA Dashboard Refresh'],
  },
  IND_GEN: {
    actionBooks: [],
    autoActionRules: [],
  },
};

/**
 * 업종별 ActionBook을 기본 Preset ActionBook과 병합하는 헬퍼
 */
export function getMergedActionBooks(presetValue: ActionBookPreset, industry: IndustryCode): ActionBookItem[] {
  const basePreset = ACTIONBOOK_PRESETS.find((p) => p.value === presetValue);
  const industryBooks = INDUSTRY_ACTIONBOOKS[industry];

  if (!basePreset) {
    return [];
  }

  return [...basePreset.actionBooks, ...industryBooks.actionBooks];
}

// =============================================================================
// LLM Provider Info
// =============================================================================

export interface LlmProviderInfo {
  value: string;
  label: string;
  description: string;
  placeholder: string;
}

export const LLM_PROVIDERS: LlmProviderInfo[] = [
  { value: 'openai', label: 'OpenAI', description: 'GPT-4o and GPT-4o-mini models', placeholder: 'sk-...' },
  {
    value: 'anthropic',
    label: 'Anthropic',
    description: 'Claude 3.5 Sonnet and Haiku models',
    placeholder: 'sk-ant-...',
  },
  {
    value: 'azure-openai',
    label: 'Azure OpenAI',
    description: 'Azure-hosted OpenAI models',
    placeholder: 'Enter Azure API key',
  },
];

// =============================================================================
// Skip Step 4 시 기본 규칙 (POL_ONB_007)
// =============================================================================

export const DEFAULT_SKIP_MONITORING_RULES: { eventRules: EventRule[]; incidentRules: IncidentRule[] } = {
  eventRules: [
    {
      id: 'evt-skip-01',
      name: 'CPU Critical (Default)',
      metric: 'cpu_usage',
      condition: '>',
      threshold: 95,
      severity: 'critical',
      enabled: true,
    },
    {
      id: 'evt-skip-02',
      name: 'Memory Critical (Default)',
      metric: 'mem_usage',
      condition: '>',
      threshold: 95,
      severity: 'critical',
      enabled: true,
    },
    {
      id: 'evt-skip-03',
      name: 'Disk Critical (Default)',
      metric: 'disk_usage',
      condition: '>',
      threshold: 95,
      severity: 'critical',
      enabled: true,
    },
  ],
  incidentRules: [
    {
      id: 'inc-skip-01',
      name: 'Server Down (Default)',
      triggerCondition: 'agent_offline > 5min',
      autoEscalation: true,
      severity: 'critical',
      enabled: true,
    },
  ],
};
