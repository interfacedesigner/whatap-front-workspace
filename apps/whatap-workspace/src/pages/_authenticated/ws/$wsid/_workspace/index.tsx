/**
 * Overview Page
 * @description 워크스페이스 대시보드 — 시스템 상태, 인시던트, 이벤트, 리소스, ActionBook 활동 요약
 * Auto-refresh 30초, 수동 새로고침, 마지막 업데이트 시각 표시
 */
import {
  ActionBookActivity,
  ActiveIncidents,
  QuickActions,
  RecentEventsTimeline,
  ResourceUsageChart,
  ServerResourceOverview,
  ServerStatusChart,
  SystemHealthSummary,
  getDefaultActionBookStats,
  getDefaultActiveIncidents,
  getDefaultHealthSummary,
  getDefaultResourceUsageData,
  getDefaultServerResources,
  getDefaultServerStatusData,
  getDefaultTimelineEvents,
} from '@/widgets/overview';
import { createFileRoute } from '@tanstack/react-router';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const AUTO_REFRESH_INTERVAL = 30_000; // 30초

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/')({
  component: OverviewPage,
});

function OverviewPage() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Mock 데이터 — 실제로는 useSuspenseQuery로 API에서 가져올 데이터
  const healthSummary = useMemo(() => getDefaultHealthSummary(), []);
  const activeIncidents = useMemo(() => getDefaultActiveIncidents(), []);
  const timelineEvents = useMemo(() => getDefaultTimelineEvents(), []);
  const serverResources = useMemo(() => getDefaultServerResources(), []);
  const actionBookStats = useMemo(() => getDefaultActionBookStats(), []);
  const serverStatusData = useMemo(() => getDefaultServerStatusData(), []);
  const resourceUsageData = useMemo(() => getDefaultResourceUsageData(), []);

  /** 수동 새로고침 */
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setLastUpdated(new Date());
    // 실제 구현 시에는 queryClient.invalidateQueries() 호출
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  /** Auto-refresh 30초 타이머 */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLastUpdated(new Date());
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formattedTime = lastUpdated.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className='space-y-6'>
      {/* ── Page Header ── */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Overview</h1>
          <p className='text-sm text-muted-foreground mt-1'>System health and operational summary for your workspace</p>
        </div>
        <div className='flex items-center gap-3'>
          <span className='text-xs text-muted-foreground'>Last updated: {formattedTime}</span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50'
            aria-label='Refresh'
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── 1. System Health Summary ── */}
      <SystemHealthSummary data={healthSummary} />

      {/* ── 2. Charts Row: Resource Usage Trend + Server Status Donut ── */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <ResourceUsageChart data={resourceUsageData} className='lg:col-span-2' />
        <ServerStatusChart data={serverStatusData} />
      </div>

      {/* ── 3. Server Resource Overview (Top 5) ── */}
      <ServerResourceOverview servers={serverResources} />

      {/* ── 4. Active Incidents + Recent Events ── */}
      <div className='grid gap-4 lg:grid-cols-2'>
        <ActiveIncidents incidents={activeIncidents} />
        <RecentEventsTimeline events={timelineEvents} />
      </div>

      {/* ── 5. ActionBook Activity + Quick Actions ── */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <ActionBookActivity stats={actionBookStats} className='lg:col-span-2' />
        <QuickActions />
      </div>
    </div>
  );
}
