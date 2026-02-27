/**
 * QuickActions Widget
 * @description 빠른 액션 버튼 패널 — 주요 기능 바로가기
 * TODO: 라우트가 생성되면 TanStack Router Link로 교체
 */
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Bell, type LucideIcon, Plus, Server, ShieldAlert, Zap } from 'lucide-react';

interface QuickAction {
  label: string;
  icon: LucideIcon;
  description: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Create Incident',
    icon: Plus,
    description: 'Report a new incident',
  },
  {
    label: 'Server Inventory',
    icon: Server,
    description: 'View all servers',
  },
  {
    label: 'View Events',
    icon: Bell,
    description: 'Browse event logs',
  },
  {
    label: 'View Incidents',
    icon: ShieldAlert,
    description: 'Manage incidents',
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className='pb-2'>
        <CardTitle className='text-sm font-medium flex items-center gap-2'>
          <Zap className='h-4 w-4 text-muted-foreground' />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-2 gap-2'>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant='outline'
                className='h-auto flex flex-col items-center gap-1.5 py-3 px-2'
              >
                <Icon className='h-5 w-5 text-primary' />
                <span className='text-xs font-medium'>{action.label}</span>
                <span className='text-[10px] text-muted-foreground text-center leading-tight'>
                  {action.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
