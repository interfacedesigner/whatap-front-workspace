/**
 * ProjectSummary Component
 * @description 프로젝트 전체 요약 정보 표시
 */
import { cn } from '@/shared/lib/utils';

import type { ProjectSummary as ProjectSummaryType } from '../model/server.types';

export interface ProjectSummaryProps {
  /** 프로젝트 요약 데이터 */
  summary: ProjectSummaryType;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 프로젝트 요약 패널
 * - Total/Active/Core 메트릭
 * - OS별 서버 현황
 */
export function ProjectSummary({ summary, className }: ProjectSummaryProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-4', className)}>
      {/* 메인 메트릭 카드 */}
      <div className='col-span-full lg:col-span-1 border rounded-lg p-4 bg-card'>
        <div className='space-y-4'>
          <MetricItem label='Total' value={summary.total} unit='대' />
          <MetricItem label='Active' value={summary.active} unit='대' highlight={summary.active < summary.total} />
          <MetricItem label='Total Core' value={summary.totalCore} unit='cores' />
        </div>
      </div>

      {/* OS별 현황 카드 */}
      <div className='col-span-full lg:col-span-3 border rounded-lg p-4 bg-card'>
        <h3 className='text-sm font-medium text-muted-foreground mb-3'>OS별 현황</h3>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {summary.byOS.map((os) => (
            <OSSummaryCard key={os.label} osSummary={os} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** 메트릭 아이템 */
function MetricItem({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}) {
  return (
    <div className='flex items-baseline justify-between'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-baseline gap-1'>
        <span className={cn('text-2xl font-semibold tabular-nums', highlight && 'text-yellow-500')}>
          {value.toLocaleString()}
        </span>
        <span className='text-sm text-muted-foreground'>{unit}</span>
      </div>
    </div>
  );
}

/** OS 요약 카드 */
function OSSummaryCard({ osSummary }: { osSummary: ProjectSummaryType['byOS'][number] }) {
  const inactiveCount = osSummary.total - osSummary.active;

  return (
    <div className='border rounded-md p-3 bg-muted/30'>
      <div className='flex items-center gap-2 mb-2'>
        <OSIcon osType={osSummary.label} />
        <span className='font-medium text-sm'>{osSummary.label}</span>
      </div>
      <div className='space-y-1 text-sm'>
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Active</span>
          <span className='font-medium tabular-nums'>
            {osSummary.active}
            <span className='text-muted-foreground'>/{osSummary.total}</span>
          </span>
        </div>
        {inactiveCount > 0 && (
          <div className='flex justify-between text-yellow-500'>
            <span>Inactive</span>
            <span className='font-medium tabular-nums'>{inactiveCount}</span>
          </div>
        )}
        <div className='flex justify-between'>
          <span className='text-muted-foreground'>Cores</span>
          <span className='font-medium tabular-nums'>{osSummary.totalCore}</span>
        </div>
      </div>
    </div>
  );
}

/** OS 아이콘 */
function OSIcon({ osType }: { osType: string }) {
  const icons: Record<string, string> = {
    Linux: '🐧',
    Windows: '🪟',
    AIX: '🖥️',
    'HP-UX': '🖥️',
    Solaris: '☀️',
    Unknown: '❓',
  };

  return (
    <span className='text-lg' role='img' aria-label={osType}>
      {icons[osType] || icons.Unknown}
    </span>
  );
}
