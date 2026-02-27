/**
 * ServerResourceOverview Widget
 * @description CPU/Memory 사용량 Top 5 서버 테이블 + IP, 상태, 하트비트 정보
 */
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { ArrowRight, Cpu } from 'lucide-react';

export interface ServerResource {
  hostname: string;
  ip: string;
  cpu: number;
  memory: number;
  status: 'Online' | 'Warning' | 'Critical' | 'Offline';
  lastHeartbeat: string;
}

interface ServerResourceOverviewProps {
  servers: ServerResource[];
  className?: string;
}

const statusConfig: Record<ServerResource['status'], { className: string; dotColor: string }> = {
  Online: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200', dotColor: 'bg-emerald-500' },
  Warning: { className: 'bg-amber-50 text-amber-700 border-amber-200', dotColor: 'bg-amber-500' },
  Critical: { className: 'bg-red-50 text-red-700 border-red-200', dotColor: 'bg-red-500' },
  Offline: { className: 'bg-slate-50 text-slate-700 border-slate-200', dotColor: 'bg-slate-400' },
};

function getUsageColor(value: number) {
  if (value >= 90) {
    return { text: 'text-red-600', bar: '[&>div]:bg-red-500' };
  }
  if (value >= 75) {
    return { text: 'text-amber-600', bar: '[&>div]:bg-amber-500' };
  }
  return { text: 'text-muted-foreground', bar: '' };
}

export function ServerResourceOverview({ servers, className }: ServerResourceOverviewProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Cpu className='h-4 w-4 text-muted-foreground' />
          Server Resource Overview
        </CardTitle>
        <CardAction>
          <button className='text-xs text-primary hover:underline flex items-center gap-1'>
            View all <ArrowRight className='h-3 w-3' />
          </button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <table className='w-full text-xs'>
            <thead>
              <tr className='border-b'>
                <th className='text-left font-medium text-muted-foreground pb-2 pr-4'>Server</th>
                <th className='text-left font-medium text-muted-foreground pb-2 pr-4'>IP</th>
                <th className='text-left font-medium text-muted-foreground pb-2 pr-4 w-[120px]'>CPU</th>
                <th className='text-left font-medium text-muted-foreground pb-2 pr-4 w-[120px]'>Memory</th>
                <th className='text-left font-medium text-muted-foreground pb-2 pr-4'>Status</th>
                <th className='text-right font-medium text-muted-foreground pb-2'>Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((server) => (
                <ServerRow key={server.hostname} server={server} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ServerRow({ server }: { server: ServerResource }) {
  const status = statusConfig[server.status];
  const cpuColor = getUsageColor(server.cpu);
  const memColor = getUsageColor(server.memory);

  return (
    <tr className='border-b last:border-0 hover:bg-muted/50 transition-colors'>
      <td className='py-2.5 pr-4'>
        <div className='flex items-center gap-2'>
          <div className={cn('h-2 w-2 rounded-full shrink-0', status.dotColor)} />
          <span className='font-medium whitespace-nowrap'>{server.hostname}</span>
        </div>
      </td>
      <td className='py-2.5 pr-4 text-muted-foreground font-mono'>{server.ip}</td>
      <td className='py-2.5 pr-4'>
        <div className='flex items-center gap-2'>
          <Progress value={server.cpu} className={cn('h-1.5 flex-1', cpuColor.bar)} />
          <span className={cn('tabular-nums font-medium w-[36px] text-right', cpuColor.text)}>{server.cpu}%</span>
        </div>
      </td>
      <td className='py-2.5 pr-4'>
        <div className='flex items-center gap-2'>
          <Progress value={server.memory} className={cn('h-1.5 flex-1', memColor.bar)} />
          <span className={cn('tabular-nums font-medium w-[36px] text-right', memColor.text)}>{server.memory}%</span>
        </div>
      </td>
      <td className='py-2.5 pr-4'>
        <Badge variant='outline' className={cn('text-[10px] px-1.5 h-4', status.className)}>
          {server.status}
        </Badge>
      </td>
      <td className='py-2.5 text-right text-muted-foreground whitespace-nowrap'>{server.lastHeartbeat}</td>
    </tr>
  );
}

/** 기본 mock 데이터 생성 */
export function getDefaultServerResources(): ServerResource[] {
  return [
    { hostname: 'prod-api-03', ip: '10.0.1.103', cpu: 94, memory: 87, status: 'Critical', lastHeartbeat: '2s ago' },
    { hostname: 'prod-worker-07', ip: '10.0.2.207', cpu: 88, memory: 92, status: 'Critical', lastHeartbeat: '5s ago' },
    { hostname: 'prod-db-primary', ip: '10.0.3.10', cpu: 76, memory: 85, status: 'Warning', lastHeartbeat: '3s ago' },
    { hostname: 'prod-cache-01', ip: '10.0.4.51', cpu: 72, memory: 68, status: 'Warning', lastHeartbeat: '8s ago' },
    { hostname: 'prod-api-01', ip: '10.0.1.101', cpu: 65, memory: 71, status: 'Online', lastHeartbeat: '1s ago' },
  ];
}
