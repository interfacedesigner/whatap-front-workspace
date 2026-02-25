/**
 * RecentIncidentsTable Widget
 * @description 최근 인시던트 목록 테이블
 */
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, Clock, ShieldAlert } from 'lucide-react';

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  affectedService: string;
  createdAt: string;
  assignee?: string;
}

interface RecentIncidentsTableProps {
  incidents: Incident[];
  className?: string;
}

const severityConfig = {
  critical: { label: 'Critical', variant: 'destructive' as const, className: '' },
  high: {
    label: 'High',
    variant: 'destructive' as const,
    className: 'bg-orange-500/10 text-orange-600 border-orange-200',
  },
  medium: {
    label: 'Medium',
    variant: 'secondary' as const,
    className: 'bg-amber-500/10 text-amber-600 border-amber-200',
  },
  low: { label: 'Low', variant: 'outline' as const, className: '' },
} as const;

const statusConfig = {
  open: { label: 'Open', className: 'bg-red-500/10 text-red-600' },
  investigating: { label: 'Investigating', className: 'bg-blue-500/10 text-blue-600' },
  resolved: { label: 'Resolved', className: 'bg-emerald-500/10 text-emerald-600' },
} as const;

export function RecentIncidentsTable({ incidents, className }: RecentIncidentsTableProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <ShieldAlert className='h-4 w-4 text-muted-foreground' />
          Recent Incidents
        </CardTitle>
        <CardAction>
          <button className='text-xs text-primary hover:underline flex items-center gap-1'>
            View all <ArrowRight className='h-3 w-3' />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className='space-y-1'>
          {incidents.length === 0 ? (
            <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
              No recent incidents
            </div>
          ) : (
            incidents.map((incident) => <IncidentRow key={incident.id} incident={incident} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status];

  return (
    <div className='flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium truncate'>{incident.title}</span>
          <Badge variant={severity.variant} className={cn('text-[10px] px-1.5 h-4', severity.className)}>
            {severity.label}
          </Badge>
        </div>
        <div className='flex items-center gap-3 mt-1'>
          <span className='text-xs text-muted-foreground'>{incident.affectedService}</span>
          <span className='text-xs text-muted-foreground flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {incident.createdAt}
          </span>
        </div>
      </div>
      <Badge variant='secondary' className={cn('text-[10px] px-1.5 h-4 shrink-0', status.className)}>
        {status.label}
      </Badge>
    </div>
  );
}

export function getDefaultIncidentsData(): Incident[] {
  return [
    {
      id: 'INC-2024-0147',
      title: 'High CPU usage on prod-api-03',
      severity: 'critical',
      status: 'investigating',
      affectedService: 'API Gateway',
      createdAt: '12 min ago',
      assignee: 'John Kim',
    },
    {
      id: 'INC-2024-0146',
      title: 'Database connection pool exhausted',
      severity: 'high',
      status: 'open',
      affectedService: 'PostgreSQL Cluster',
      createdAt: '28 min ago',
      assignee: 'Sarah Lee',
    },
    {
      id: 'INC-2024-0145',
      title: 'Memory leak detected in worker nodes',
      severity: 'medium',
      status: 'investigating',
      affectedService: 'Worker Pool',
      createdAt: '1 hour ago',
    },
    {
      id: 'INC-2024-0144',
      title: 'SSL certificate expiring in 7 days',
      severity: 'low',
      status: 'open',
      affectedService: 'Load Balancer',
      createdAt: '2 hours ago',
    },
    {
      id: 'INC-2024-0143',
      title: 'Disk usage above 85% on storage-01',
      severity: 'medium',
      status: 'resolved',
      affectedService: 'Storage Cluster',
      createdAt: '3 hours ago',
      assignee: 'Mike Park',
    },
  ];
}
