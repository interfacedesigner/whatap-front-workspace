import { useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

import { METRICS } from './constants';
import { DashboardTopBar } from './dashboard-top-bar';
import { MainChart } from './main-chart';
import { MetricCard } from './metric-card';
import { SparklineRow } from './sparkline-row';
import { useDashboardData } from './use-dashboard-data';

export function DashboardMock() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const shouldReduce = useReducedMotion();
  const { mainChartData, secondaryChartData, sparklines } = useDashboardData();

  return (
    <div ref={containerRef} className='w-full h-full bg-[#fafbfc] rounded-lg overflow-hidden flex flex-col'>
      {/* Top Bar */}
      <DashboardTopBar isInView={isInView} />

      {/* Metric Cards Row */}
      <div className='grid grid-cols-4 gap-2 px-3 py-2'>
        {METRICS.map((metric, i) => (
          <MetricCard
            key={i}
            label={metric.label}
            value={metric.value}
            unit={metric.unit}
            decimals={metric.decimals}
            trend={metric.trend}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Main Chart */}
      <div className='flex-1 px-3 pb-1 min-h-0'>
        <MainChart
          data={mainChartData}
          secondaryData={secondaryChartData}
          isInView={isInView}
          reducedMotion={shouldReduce ?? false}
        />
      </div>

      {/* Bottom Sparkline Row */}
      <SparklineRow sparklines={sparklines} isInView={isInView} />
    </div>
  );
}
