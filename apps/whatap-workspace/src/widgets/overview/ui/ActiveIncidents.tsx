/**
 * ActiveIncidents Widget
 * @description 활성 인시던트 목록 - SEV1~SEV4 심각도 기반
 */
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, Clock, ShieldAlert, User } from 'lucide-react';

export type IncidentSeverity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
export type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';

export interface ActiveIncident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedTo: string | null;
  createdAt: string;
}

interface ActiveIncidentsProps {
  incidents: ActiveIncident[];
  className?: string;
}

const severityConfig: Record<IncidentSeverity, { label: string; className: string }> = {
  SEV1: { label: 'SEV1', className: 'bg-red-100 text-red-700 border-red-200' },
  SEV2: { label: 'SEV2', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  SEV3: { label: 'SEV3', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  SEV4: { label: 'SEV4', className: 'bg-blue-100 text-blue-700 border-blue-200' },
};

const statusConfig: Record<IncidentStatus, { label: string; className: string }> = {
  Open: { label: 'Open', className: 'bg-red-500/10 text-red-600' },
  'In Progress': { label: 'In Progress', className: 'bg-blue-500/10 text-blue-600' },
  Resolved: { label: 'Resolved', className: 'bg-emerald-500/10 text-emerald-600' },
};

export function ActiveIncidents({ incidents, className }: ActiveIncidentsProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <ShieldAlert className='h-4 w-4 text-muted-foreground' />
          Active Incidents
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
              No active incidents
            </div>
          ) : (
            incidents.map((incident) => <IncidentRow key={incident.id} incident={incident} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IncidentRow({ incident }: { incident: ActiveIncident }) {
  const severity = severityConfig[incident.severity];
  const status = statusConfig[incident.status];

  return (
    <div className='flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-muted/50 transition-colors cursor-pointer'>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium truncate'>{incident.title}</span>
          <Badge variant='outline' className={cn('text-[10px] px-1.5 h-4 shrink-0', severity.className)}>
            {severity.label}
          </Badge>
        </div>
        <div className='flex items-center gap-3 mt-1'>
          <span className='text-xs text-muted-foreground flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            {incident.createdAt}
          </span>
          {incident.assignedTo && (
            <span className='text-xs text-muted-foreground flex items-center gap-1'>
              <User className='h-3 w-3' />
              {incident.assignedTo}
            </span>
          )}
        </div>
      </div>
      <Badge variant='secondary' className={cn('text-[10px] px-1.5 h-4 shrink-0', status.className)}>
        {status.label}
      </Badge>
    </div>
  );
}

/** 기본 mock 데이터 생성 */
export function getDefaultActiveIncidents(): ActiveIncident[] {
  return [
    {
      id: 'INC-2026-0147',
      title: 'High CPU usage on prod-api-03',
      severity: 'SEV1',
      status: 'In Progress',
      assignedTo: 'John Kim',
      createdAt: '12 min ago',
    },
    {
      id: 'INC-2026-0146',
      title: 'Database connection pool exhausted',
      severity: 'SEV2',
      status: 'Open',
      assignedTo: 'Sarah Lee',
      createdAt: '28 min ago',
    },
    {
      id: 'INC-2026-0145',
      title: 'Memory leak detected in worker nodes',
      severity: 'SEV3',
      status: 'In Progress',
      assignedTo: null,
      createdAt: '1 hour ago',
    },
    {
      id: 'INC-2026-0144',
      title: 'SSL certificate expiring in 7 days',
      severity: 'SEV4',
      status: 'Open',
      assignedTo: null,
      createdAt: '2 hours ago',
    },
    {
      id: 'INC-2026-0143',
      title: 'Disk usage above 85% on storage-01',
      severity: 'SEV3',
      status: 'Resolved',
      assignedTo: 'Mike Park',
      createdAt: '3 hours ago',
    },
  ];
}
