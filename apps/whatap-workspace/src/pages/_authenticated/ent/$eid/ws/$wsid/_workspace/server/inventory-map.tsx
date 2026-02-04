/**
 * Server Inventory Map Page
 * @route /ent/:eid/ws/:wsid/server/inventory-map
 */
import { ProjectSummaryPanel, useProjectSummaryMockData, useServerMockData } from '@/entities/server';
import {
  ServerInventoryContent,
  ServerInventoryToolbar,
  firstGroupOptionAtom,
  secondGroupOptionAtom,
} from '@/widgets/server-inventory-map';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';

export const Route = createFileRoute('/_authenticated/ent/$eid/ws/$wsid/_workspace/server/inventory-map')({
  component: ServerInventoryMapPage,
});

function ServerInventoryMapPage() {
  // 그룹화 상태 (데이터 fetching에 필요)
  const firstGroup = useAtomValue(firstGroupOptionAtom);
  const secondGroup = useAtomValue(secondGroupOptionAtom);

  // 데이터 fetching
  const { data: groups, servers } = useServerMockData({
    group1: firstGroup,
    group2: secondGroup,
  });
  const { data: projectSummary } = useProjectSummaryMockData();

  return (
    <div className='container py-6'>
      {/* 페이지 헤더 */}
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold'>Server Inventory Map</h1>
        <p className='text-muted-foreground mt-1'>서버 상태를 한눈에 파악하세요</p>
      </div>

      {/* 프로젝트 요약 */}
      <div className='mb-6'>
        <ProjectSummaryPanel summary={projectSummary} />
      </div>

      {/* 서버 인벤토리 */}
      <div className='border rounded-lg p-4'>
        <ServerInventoryToolbar totalCount={servers.length} />
        <ServerInventoryContent groups={groups} />
      </div>
    </div>
  );
}
