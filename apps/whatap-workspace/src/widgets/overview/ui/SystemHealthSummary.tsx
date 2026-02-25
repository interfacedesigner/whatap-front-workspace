/**
 * SystemHealthSummary Widget
 * @description Overview 페이지 상단 KPI 카드 영역 - 시스템 전체 상태 요약
 */
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Activity, AlertTriangle, type LucideIcon, Server, ShieldAlert, TrendingDown, TrendingUp } from 'lucide-react';

export interface HealthMetric {
  label: string;
  value: number | string;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    direction: 'up' | 'down';
    value: string;
    isPositive: boolean;
  };
  status?: 'healthy' | 'warning' | 'critical';
}

interface SystemHealthSummaryProps {
  metrics: HealthMetric[];
  className?: string;
}

const statusColors = {
  healthy: 'text-emerald-500',
  warning: 'text-amber-500',
  critical: 'text-red-500',
} as const;

const statusBgColors = {
  healthy: 'bg-emerald-500/10',
  warning: 'bg-amber-500/10',
  critical: 'bg-red-500/10',
} as const;

export function SystemHealthSummary({ metrics, className }: SystemHealthSummaryProps) {
  return (
    <div className={cn('grid gap-4 grid-cols-2 lg:grid-cols-4', className)}>
      {metrics.map((metric) => (
        <HealthCard key={metric.label} metric={metric} />
      ))}
    </div>
  );
}

function HealthCard({ metric }: { metric: HealthMetric }) {
  const Icon = metric.icon;
  const status = metric.status ?? 'healthy';

  return (
    <Card size='sm'>
      <CardContent className='pt-0'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-xs font-medium text-muted-foreground'>{metric.label}</p>
            <div className='flex items-baseline gap-1'>
              <span className='text-2xl font-bold tabular-nums tracking-tight'>
                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
              </span>
              {metric.unit && <span className='text-sm text-muted-foreground'>{metric.unit}</span>}
            </div>
          </div>
          <div className={cn('rounded-lg p-2.5', statusBgColors[status])}>
            <Icon className={cn('h-5 w-5', statusColors[status])} />
          </div>
        </div>
        {metric.trend && (
          <div className='mt-2 flex items-center gap-1'>
            {metric.trend.direction === 'up' ? (
              <TrendingUp
                className={cn('h-3.5 w-3.5', metric.trend.isPositive ? 'text-emerald-500' : 'text-red-500')}
              />
            ) : (
              <TrendingDown
                className={cn('h-3.5 w-3.5', metric.trend.isPositive ? 'text-emerald-500' : 'text-red-500')}
              />
            )}
            <span className={cn('text-xs font-medium', metric.trend.isPositive ? 'text-emerald-500' : 'text-red-500')}>
              {metric.trend.value}
            </span>
            <span className='text-xs text-muted-foreground'>vs last hour</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** 기본 mock 데이터 생성 */
export function getDefaultHealthMetrics(): HealthMetric[] {
  return [
    {
      label: 'Total Servers',
      value: 248,
      icon: Server,
      status: 'healthy',
      trend: { direction: 'up', value: '+3', isPositive: true },
    },
    {
      label: 'Active Services',
      value: 1284,
      icon: Activity,
      status: 'healthy',
      trend: { direction: 'up', value: '+12', isPositive: true },
    },
    {
      label: 'Open Incidents',
      value: 7,
      icon: ShieldAlert,
      status: 'warning',
      trend: { direction: 'down', value: '-2', isPositive: true },
    },
    {
      label: 'Active Alerts',
      value: 23,
      icon: AlertTriangle,
      status: 'warning',
      trend: { direction: 'up', value: '+5', isPositive: false },
    },
  ];
}
