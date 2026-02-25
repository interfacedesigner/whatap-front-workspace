/**
 * RecentEventsTimeline Widget
 * @description 최근 이벤트 타임라인 (알림 + 시스템 이벤트)
 */
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CheckCircle2,
  type LucideIcon,
  Server,
  ShieldCheck,
  XCircle,
  Zap,
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  type: 'alert' | 'deployment' | 'recovery' | 'failure' | 'scaling' | 'security';
  message: string;
  timestamp: string;
  source: string;
}

interface RecentEventsTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventTypeConfig: Record<TimelineEvent['type'], { icon: LucideIcon; color: string; bgColor: string }> = {
  alert: { icon: AlertTriangle, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  deployment: { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  recovery: { icon: CheckCircle2, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  failure: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
  scaling: { icon: Server, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  security: { icon: ShieldCheck, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
};

export function RecentEventsTimeline({ events, className }: RecentEventsTimelineProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Bell className='h-4 w-4 text-muted-foreground' />
          Recent Events
        </CardTitle>
        <CardAction>
          <button className='text-xs text-primary hover:underline flex items-center gap-1'>
            View all <ArrowRight className='h-3 w-3' />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className='space-y-0.5'>
          {events.map((event, index) => (
            <TimelineItem key={event.id} event={event} isLast={index === events.length - 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const config = eventTypeConfig[event.type];
  const Icon = config.icon;

  return (
    <div className='flex gap-3 py-2'>
      <div className='flex flex-col items-center'>
        <div className={cn('rounded-full p-1.5', config.bgColor)}>
          <Icon className={cn('h-3.5 w-3.5', config.color)} />
        </div>
        {!isLast && <div className='flex-1 w-px bg-border mt-1' />}
      </div>
      <div className='flex-1 min-w-0 pb-2'>
        <p className='text-sm leading-snug'>{event.message}</p>
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-[11px] text-muted-foreground'>{event.source}</span>
          <span className='text-[11px] text-muted-foreground/60'>&middot;</span>
          <span className='text-[11px] text-muted-foreground'>{event.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

export function getDefaultTimelineEvents(): TimelineEvent[] {
  return [
    {
      id: 'evt-001',
      type: 'failure',
      message: 'Connection timeout on prod-db-primary',
      timestamp: '5 min ago',
      source: 'PostgreSQL',
    },
    {
      id: 'evt-002',
      type: 'alert',
      message: 'CPU usage exceeded 90% threshold on api-server-03',
      timestamp: '12 min ago',
      source: 'Infrastructure',
    },
    {
      id: 'evt-003',
      type: 'deployment',
      message: 'Deployment v2.14.3 completed successfully',
      timestamp: '25 min ago',
      source: 'CI/CD Pipeline',
    },
    {
      id: 'evt-004',
      type: 'recovery',
      message: 'Service redis-cache-02 recovered automatically',
      timestamp: '42 min ago',
      source: 'ActionBook',
    },
    {
      id: 'evt-005',
      type: 'scaling',
      message: 'Auto-scaling triggered: worker pool 4 → 6 instances',
      timestamp: '1 hour ago',
      source: 'Kubernetes',
    },
    {
      id: 'evt-006',
      type: 'security',
      message: 'Security scan completed: 0 vulnerabilities found',
      timestamp: '1.5 hours ago',
      source: 'Security Scanner',
    },
    {
      id: 'evt-007',
      type: 'alert',
      message: 'Disk usage warning on storage-node-01 (85%)',
      timestamp: '2 hours ago',
      source: 'Infrastructure',
    },
  ];
}
