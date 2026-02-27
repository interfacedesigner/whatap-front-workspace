/**
 * SystemHealthSummary Widget
 * @description Overview 페이지 상단 - 시스템 전체 건강 상태 요약
 * Total / Online / Offline / Warning / Critical 서버 수 + Health Gauge + Status Badge
 */
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { AlertTriangle, CheckCircle2, Server, ServerOff, ShieldAlert, XCircle } from 'lucide-react';

export interface HealthSummary {
  totalServers: number;
  onlineServers: number;
  offlineServers: number;
  warningServers: number;
  criticalServers: number;
  healthPercentage: number;
  status: 'Healthy' | 'Warning' | 'Critical';
  lastUpdated: string;
}

interface SystemHealthSummaryProps {
  data: HealthSummary;
  className?: string;
}

const statusBadgeConfig = {
  Healthy: { variant: 'outline' as const, className: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  Warning: { variant: 'outline' as const, className: 'border-amber-300 bg-amber-50 text-amber-700' },
  Critical: { variant: 'outline' as const, className: 'border-red-300 bg-red-50 text-red-700' },
} as const;

const gaugeColor = {
  Healthy: 'bg-emerald-500',
  Warning: 'bg-amber-500',
  Critical: 'bg-red-500',
} as const;

const kpiCards = [
  {
    key: 'totalServers' as const,
    label: 'Total Servers',
    icon: Server,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    key: 'onlineServers' as const,
    label: 'Online',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    key: 'offlineServers' as const,
    label: 'Offline',
    icon: ServerOff,
    iconColor: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
  },
  {
    key: 'warningServers' as const,
    label: 'Warning',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    key: 'criticalServers' as const,
    label: 'Critical',
    icon: XCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
] as const;

export function SystemHealthSummary({ data, className }: SystemHealthSummaryProps) {
  const badgeConfig = statusBadgeConfig[data.status];

  return (
    <div className={cn('space-y-4', className)}>
      {/* KPI Cards Row */}
      <div className='grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'>
        {kpiCards.map(({ key, label, icon: Icon, iconColor, bgColor }) => (
          <Card key={key} size='sm'>
            <CardContent className='pt-0'>
              <div className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <p className='text-xs font-medium text-muted-foreground'>{label}</p>
                  <span className='text-2xl font-bold tabular-nums tracking-tight'>{data[key].toLocaleString()}</span>
                </div>
                <div className={cn('rounded-lg p-2.5', bgColor)}>
                  <Icon className={cn('h-5 w-5', iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Gauge Bar */}
      <Card size='sm'>
        <CardContent className='pt-0'>
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <ShieldAlert className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>System Health</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold tabular-nums'>{data.healthPercentage}%</span>
              <Badge variant={badgeConfig.variant} className={cn('text-xs', badgeConfig.className)}>
                {data.status}
              </Badge>
            </div>
          </div>
          <Progress value={data.healthPercentage} className={cn('h-2', `[&>div]:${gaugeColor[data.status]}`)} />
        </CardContent>
      </Card>
    </div>
  );
}

/** 기본 mock 데이터 생성 */
export function getDefaultHealthSummary(): HealthSummary {
  return {
    totalServers: 248,
    onlineServers: 198,
    offlineServers: 10,
    warningServers: 32,
    criticalServers: 8,
    healthPercentage: 79.8,
    status: 'Warning',
    lastUpdated: new Date().toISOString(),
  };
}
