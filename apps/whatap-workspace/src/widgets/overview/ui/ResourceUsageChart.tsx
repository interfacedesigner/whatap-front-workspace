/**
 * ResourceUsageChart Widget
 * @description CPU / Memory / Disk / Network 리소스 사용량 추이 차트
 */
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { cn } from '@/shared/lib/utils';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export interface ResourceUsagePoint {
  time: string;
  cpu: number;
  memory: number;
  disk: number;
}

interface ResourceUsageChartProps {
  data: ResourceUsagePoint[];
  className?: string;
}

const chartConfig = {
  cpu: { label: 'CPU', color: 'hsl(221, 83%, 53%)' },
  memory: { label: 'Memory', color: 'hsl(262, 83%, 58%)' },
  disk: { label: 'Disk I/O', color: 'hsl(142, 71%, 45%)' },
} satisfies ChartConfig;

export function ResourceUsageChart({ data, className }: ResourceUsageChartProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>Resource Usage Trend</CardTitle>
        <CardAction>
          <div className='flex items-center gap-3'>
            {Object.entries(chartConfig).map(([key, config]) => (
              <div key={key} className='flex items-center gap-1.5'>
                <div className='h-2 w-2 rounded-full' style={{ backgroundColor: config.color }} />
                <span className='text-xs text-muted-foreground'>{config.label}</span>
              </div>
            ))}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-[220px] w-full'>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id='fillCpu' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(221, 83%, 53%)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='hsl(221, 83%, 53%)' stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id='fillMemory' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(262, 83%, 58%)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='hsl(262, 83%, 58%)' stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id='fillDisk' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='hsl(142, 71%, 45%)' stopOpacity={0.3} />
                <stop offset='95%' stopColor='hsl(142, 71%, 45%)' stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
            <XAxis dataKey='time' tickLine={false} axisLine={false} className='text-xs' tick={{ fontSize: 10 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              className='text-xs'
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type='monotone'
              dataKey='cpu'
              stroke='hsl(221, 83%, 53%)'
              fill='url(#fillCpu)'
              strokeWidth={1.5}
              dot={false}
            />
            <Area
              type='monotone'
              dataKey='memory'
              stroke='hsl(262, 83%, 58%)'
              fill='url(#fillMemory)'
              strokeWidth={1.5}
              dot={false}
            />
            <Area
              type='monotone'
              dataKey='disk'
              stroke='hsl(142, 71%, 45%)'
              fill='url(#fillDisk)'
              strokeWidth={1.5}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

/** 24시간 mock 데이터 생성 */
export function getDefaultResourceUsageData(): ResourceUsagePoint[] {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return hours.map((time, i) => {
    // 업무 시간대(9~18시)에 리소스 사용량이 높은 패턴
    const isBusinessHours = i >= 9 && i <= 18;
    const baseMultiplier = isBusinessHours ? 1.4 : 0.7;
    const peakMultiplier = i >= 11 && i <= 15 ? 1.2 : 1;

    return {
      time,
      cpu: Math.min(95, Math.max(15, Math.round(35 * baseMultiplier * peakMultiplier + (Math.random() * 15 - 7)))),
      memory: Math.min(92, Math.max(40, Math.round(55 * baseMultiplier + (Math.random() * 10 - 5)))),
      disk: Math.min(80, Math.max(10, Math.round(20 * baseMultiplier + (Math.random() * 8 - 4)))),
    };
  });
}
