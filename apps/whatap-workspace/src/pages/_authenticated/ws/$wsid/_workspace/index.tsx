import {
  RecentEventsTimeline,
  RecentIncidentsTable,
  ResourceUsageChart,
  ServerStatusChart,
  SystemHealthSummary,
  TopResourceConsumers,
  getDefaultHealthMetrics,
  getDefaultIncidentsData,
  getDefaultResourceConsumers,
  getDefaultResourceUsageData,
  getDefaultServerStatusData,
  getDefaultTimelineEvents,
} from '@/widgets/overview';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_authenticated/ws/$wsid/_workspace/')({
  component: OverviewPage,
});

function OverviewPage() {
  // Mock data - 실제로는 useSuspenseQuery로 API에서 가져올 데이터
  const healthMetrics = useMemo(() => getDefaultHealthMetrics(), []);
  const serverStatusData = useMemo(() => getDefaultServerStatusData(), []);
  const resourceUsageData = useMemo(() => getDefaultResourceUsageData(), []);
  const incidents = useMemo(() => getDefaultIncidentsData(), []);
  const timelineEvents = useMemo(() => getDefaultTimelineEvents(), []);
  const resourceConsumers = useMemo(() => getDefaultResourceConsumers(), []);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Overview</h1>
        <p className='text-sm text-muted-foreground mt-1'>System health and operational summary for your workspace</p>
      </div>

      {/* KPI Summary Cards */}
      <SystemHealthSummary metrics={healthMetrics} />

      {/* Charts Row: Resource Usage + Server Status */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <ResourceUsageChart data={resourceUsageData} className='lg:col-span-2' />
        <ServerStatusChart data={serverStatusData} />
      </div>

      {/* Bottom Row: Incidents + Events + Top Consumers */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <RecentIncidentsTable incidents={incidents} />
        <RecentEventsTimeline events={timelineEvents} />
        <TopResourceConsumers servers={resourceConsumers} />
      </div>
    </div>
  );
}
