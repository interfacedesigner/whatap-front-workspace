export const CHART_HEX = {
  primary: '#296cf2',
  secondary: '#4a8af5',
  tertiary: '#8bb4f8',
  accent: '#3577f3',
  dark: '#1d52c4',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
} as const;

export const METRICS = [
  { label: 'CPU Usage', value: 42.7, unit: '%', decimals: 1, trend: 'stable' as const },
  { label: 'Memory', value: 6.2, unit: 'GB', decimals: 1, trend: 'up' as const },
  { label: 'Requests/s', value: 12847, unit: '/s', decimals: 0, trend: 'up' as const },
  { label: 'Error Rate', value: 0.12, unit: '%', decimals: 2, trend: 'down' as const },
] as const;

export const SPARKLINE_LABELS = [
  { label: 'Throughput', value: '12.8k/s', color: CHART_HEX.primary },
  { label: 'Latency', value: '23ms', color: CHART_HEX.accent },
  { label: 'Active Conns', value: '847', color: CHART_HEX.dark },
] as const;

export const SERVER_STATUSES = [
  { name: 'web-01', status: 'healthy' as const },
  { name: 'web-02', status: 'healthy' as const },
  { name: 'api-01', status: 'warning' as const },
  { name: 'api-02', status: 'healthy' as const },
  { name: 'db-pri', status: 'healthy' as const },
  { name: 'db-rep', status: 'healthy' as const },
] as const;
