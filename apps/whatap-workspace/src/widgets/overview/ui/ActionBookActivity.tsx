/**
 * ActionBookActivity Widget
 * @description ActionBook 실행 통계 — 총 실행 / 성공 / 실패 + 성공률 + 최근 실행 목록
 */
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { Bot, CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';

export interface ActionBookExecution {
  id: string;
  name: string;
  status: 'Success' | 'Failed' | 'Running';
  duration: string;
  executedAt: string;
}

export interface ActionBookStats {
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  recentExecutions: ActionBookExecution[];
}

interface ActionBookActivityProps {
  stats: ActionBookStats;
  className?: string;
}

const executionStatusConfig: Record<ActionBookExecution['status'], { icon: typeof CheckCircle2; className: string }> = {
  Success: { icon: CheckCircle2, className: 'text-emerald-600' },
  Failed: { icon: XCircle, className: 'text-red-600' },
  Running: { icon: PlayCircle, className: 'text-blue-600' },
};

export function ActionBookActivity({ stats, className }: ActionBookActivityProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Bot className='h-4 w-4 text-muted-foreground' />
          ActionBook Activity
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Summary Stats */}
        <div className='grid grid-cols-3 gap-3'>
          <StatBox label='Total' value={stats.totalExecutions} color='text-foreground' />
          <StatBox label='Success' value={stats.successCount} color='text-emerald-600' />
          <StatBox label='Failed' value={stats.failureCount} color='text-red-600' />
        </div>

        {/* Success Rate Gauge */}
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between text-xs'>
            <span className='text-muted-foreground'>Success Rate</span>
            <span className='font-semibold tabular-nums'>{stats.successRate.toFixed(1)}%</span>
          </div>
          <Progress
            value={stats.successRate}
            className={cn(
              'h-2',
              stats.successRate >= 90 && '[&>div]:bg-emerald-500',
              stats.successRate >= 70 && stats.successRate < 90 && '[&>div]:bg-amber-500',
              stats.successRate < 70 && '[&>div]:bg-red-500',
            )}
          />
        </div>

        {/* Recent Executions */}
        <div className='space-y-1'>
          <p className='text-xs font-medium text-muted-foreground mb-2'>Recent Executions</p>
          {stats.recentExecutions.length === 0 ? (
            <div className='flex items-center justify-center py-4 text-xs text-muted-foreground'>
              No recent executions
            </div>
          ) : (
            stats.recentExecutions.map((exec) => <ExecutionRow key={exec.id} execution={exec} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className='rounded-md border p-2.5 text-center'>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className={cn('text-lg font-bold tabular-nums', color)}>{value}</p>
    </div>
  );
}

function ExecutionRow({ execution }: { execution: ActionBookExecution }) {
  const config = executionStatusConfig[execution.status];
  const StatusIcon = config.icon;

  return (
    <div className='flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors'>
      <StatusIcon className={cn('h-3.5 w-3.5 shrink-0', config.className)} />
      <div className='flex-1 min-w-0'>
        <span className='text-xs font-medium truncate block'>{execution.name}</span>
        <div className='flex items-center gap-2 mt-0.5'>
          <span className='text-[10px] text-muted-foreground flex items-center gap-0.5'>
            <Clock className='h-2.5 w-2.5' />
            {execution.duration}
          </span>
          <span className='text-[10px] text-muted-foreground'>{execution.executedAt}</span>
        </div>
      </div>
      <Badge
        variant='outline'
        className={cn(
          'text-[10px] px-1.5 h-4 shrink-0',
          execution.status === 'Success' && 'bg-emerald-50 text-emerald-700 border-emerald-200',
          execution.status === 'Failed' && 'bg-red-50 text-red-700 border-red-200',
          execution.status === 'Running' && 'bg-blue-50 text-blue-700 border-blue-200',
        )}
      >
        {execution.status}
      </Badge>
    </div>
  );
}

/** 기본 mock 데이터 생성 */
export function getDefaultActionBookStats(): ActionBookStats {
  return {
    totalExecutions: 156,
    successCount: 142,
    failureCount: 14,
    successRate: 91.0,
    recentExecutions: [
      {
        id: 'ab-exec-001',
        name: 'cache-service-restart',
        status: 'Success',
        duration: '12s',
        executedAt: '15 min ago',
      },
      {
        id: 'ab-exec-002',
        name: 'db-connection-pool-reset',
        status: 'Running',
        duration: '—',
        executedAt: '3 min ago',
      },
      {
        id: 'ab-exec-003',
        name: 'log-rotation-cleanup',
        status: 'Success',
        duration: '45s',
        executedAt: '1 hour ago',
      },
      {
        id: 'ab-exec-004',
        name: 'ssl-cert-renewal',
        status: 'Failed',
        duration: '8s',
        executedAt: '2 hours ago',
      },
      {
        id: 'ab-exec-005',
        name: 'memory-leak-mitigation',
        status: 'Success',
        duration: '23s',
        executedAt: '3 hours ago',
      },
    ],
  };
}
