/**
 * ServerStatusChart Widget
 * @description 서버 상태 분포 차트 (Donut chart + 리스트)
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/components/ui/chart';
import { cn } from '@/shared/lib/utils';
import { Label, Pie, PieChart } from 'recharts';

export interface ServerStatusData {
  status: string;
  count: number;
  fill: string;
}

interface ServerStatusChartProps {
  data: ServerStatusData[];
  className?: string;
}

const chartConfig = {
  count: { label: 'Servers' },
  running: { label: 'Running', color: 'hsl(142, 71%, 45%)' },
  warning: { label: 'Warning', color: 'hsl(38, 92%, 50%)' },
  critical: { label: 'Critical', color: 'hsl(0, 84%, 60%)' },
  stopped: { label: 'Stopped', color: 'hsl(215, 16%, 47%)' },
} satisfies ChartConfig;

export function ServerStatusChart({ data, className }: ServerStatusChartProps) {
  const totalServers = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium'>Server Status</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-4'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square h-[180px]'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey='count' nameKey='status' innerRadius={55} outerRadius={80} strokeWidth={2}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) - 8} className='fill-foreground text-2xl font-bold'>
                          {totalServers}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 12} className='fill-muted-foreground text-xs'>
                          Total
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className='grid w-full grid-cols-2 gap-2'>
          {data.map((item) => (
            <div key={item.status} className='flex items-center gap-2 rounded-md px-2 py-1.5'>
              <div className='h-2.5 w-2.5 shrink-0 rounded-full' style={{ backgroundColor: item.fill }} />
              <span className='text-xs text-muted-foreground'>{item.status}</span>
              <span className='ml-auto text-xs font-medium tabular-nums'>{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function getDefaultServerStatusData(): ServerStatusData[] {
  return [
    { status: 'Running', count: 198, fill: 'hsl(142, 71%, 45%)' },
    { status: 'Warning', count: 32, fill: 'hsl(38, 92%, 50%)' },
    { status: 'Critical', count: 8, fill: 'hsl(0, 84%, 60%)' },
    { status: 'Stopped', count: 10, fill: 'hsl(215, 16%, 47%)' },
  ];
}
