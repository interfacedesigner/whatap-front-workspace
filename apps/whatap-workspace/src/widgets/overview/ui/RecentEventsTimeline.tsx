/**
 * RecentEventsTimeline Widget
 * @description 최근 이벤트 타임라인 — Server / Incident / ActionBook / System 타입 기반
 * 최대 5개 표시
 */
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, Bell, Bot, type LucideIcon, Monitor, Server, ShieldAlert } from 'lucide-react';

export type EventType = 'Server' | 'Incident' | 'ActionBook' | 'System';

export interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  timestamp: string;
}

interface RecentEventsTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventTypeConfig: Record<EventType, { icon: LucideIcon; color: string; bgColor: string; badgeClass: string }> = {
  Server: {
    icon: Server,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  Incident: {
    icon: ShieldAlert,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
  },
  ActionBook: {
    icon: Bot,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    badgeClass: 'bg-violet-100 text-violet-700 border-violet-200',
  },
  System: {
    icon: Monitor,
    color: 'text-slate-500',
    bgColor: 'bg-slate-500/10',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  },
};

export function RecentEventsTimeline({ events, className }: RecentEventsTimelineProps) {
  const displayEvents = events.slice(0, 5);

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
          {displayEvents.length === 0 ? (
            <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>No recent events</div>
          ) : (
            displayEvents.map((event, index) => (
              <TimelineItem key={event.id} event={event} isLast={index === displayEvents.length - 1} />
            ))
          )}
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
        <div className='flex items-center gap-2'>
          <p className='text-sm leading-snug truncate'>{event.title}</p>
          <Badge variant='outline' className={cn('text-[10px] px-1.5 h-4 shrink-0', config.badgeClass)}>
            {event.type}
          </Badge>
        </div>
        {event.description && <p className='text-xs text-muted-foreground mt-0.5 truncate'>{event.description}</p>}
        <span className='text-[11px] text-muted-foreground mt-1 block'>{event.timestamp}</span>
      </div>
    </div>
  );
}

/** 기본 mock 데이터 생성 */
export function getDefaultTimelineEvents(): TimelineEvent[] {
  return [
    {
      id: 'evt-001',
      type: 'Incident',
      title: 'Connection timeout on prod-db-primary',
      description: 'PostgreSQL primary node connection timeout detected',
      timestamp: '5 min ago',
    },
    {
      id: 'evt-002',
      type: 'Server',
      title: 'CPU usage exceeded 90% threshold on api-server-03',
      timestamp: '12 min ago',
    },
    {
      id: 'evt-003',
      type: 'ActionBook',
      title: 'Auto-restart executed on redis-cache-02',
      description: 'ActionBook: cache-service-restart completed successfully',
      timestamp: '25 min ago',
    },
    {
      id: 'evt-004',
      type: 'System',
      title: 'Scheduled maintenance window started',
      description: 'Maintenance window: 02:00-04:00 UTC',
      timestamp: '42 min ago',
    },
    {
      id: 'evt-005',
      type: 'Server',
      title: 'Auto-scaling triggered: worker pool 4 → 6 instances',
      timestamp: '1 hour ago',
    },
  ];
}
