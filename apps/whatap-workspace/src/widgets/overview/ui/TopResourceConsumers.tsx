/**
 * TopResourceConsumers Widget
 * @description 리소스 사용량 상위 서버 목록
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { cn } from '@/shared/lib/utils';
import { Cpu, HardDrive, MemoryStick } from 'lucide-react';

export interface ResourceConsumer {
  hostname: string;
  cpu: number;
  memory: number;
  disk: number;
  status: 'normal' | 'warning' | 'critical';
}

interface TopResourceConsumersProps {
  servers: ResourceConsumer[];
  className?: string;
}

export function TopResourceConsumers({ servers, className }: TopResourceConsumersProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>Top Resource Consumers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {servers.map((server) => (
            <ServerResourceRow key={server.hostname} server={server} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ServerResourceRow({ server }: { server: ResourceConsumer }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              server.status === 'normal' && 'bg-emerald-500',
              server.status === 'warning' && 'bg-amber-500',
              server.status === 'critical' && 'bg-red-500',
            )}
          />
          <span className='text-xs font-medium'>{server.hostname}</span>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-3'>
        <ResourceBar icon={Cpu} label='CPU' value={server.cpu} />
        <ResourceBar icon={MemoryStick} label='MEM' value={server.memory} />
        <ResourceBar icon={HardDrive} label='DISK' value={server.disk} />
      </div>
    </div>
  );
}

function ResourceBar({ icon: Icon, label, value }: { icon: typeof Cpu; label: string; value: number }) {
  const getColor = (val: number) => {
    if (val >= 90) {
      return 'text-red-500';
    }
    if (val >= 75) {
      return 'text-amber-500';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className='space-y-1'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1'>
          <Icon className='h-3 w-3 text-muted-foreground' />
          <span className='text-[10px] text-muted-foreground'>{label}</span>
        </div>
        <span className={cn('text-[10px] font-medium tabular-nums', getColor(value))}>{value}%</span>
      </div>
      <Progress
        value={value}
        className={cn('h-1', value >= 90 && '[&>div]:bg-red-500', value >= 75 && value < 90 && '[&>div]:bg-amber-500')}
      />
    </div>
  );
}

export function getDefaultResourceConsumers(): ResourceConsumer[] {
  return [
    { hostname: 'prod-api-03', cpu: 94, memory: 87, disk: 62, status: 'critical' },
    { hostname: 'prod-worker-07', cpu: 88, memory: 92, disk: 45, status: 'critical' },
    { hostname: 'prod-db-primary', cpu: 76, memory: 85, disk: 78, status: 'warning' },
    { hostname: 'prod-cache-01', cpu: 72, memory: 68, disk: 34, status: 'warning' },
    { hostname: 'prod-api-01', cpu: 65, memory: 71, disk: 52, status: 'normal' },
  ];
}
