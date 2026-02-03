/**
 * ServerInventoryMapPage Widget
 * @description 서버 인벤토리 맵 페이지 위젯
 */
import { ProjectSummaryPanel, ServerGrid, useProjectSummaryMockData, useServerMockData } from '@/entities/server';
import { ServerGroupPanel } from '@/entities/server/ui/ServerGroupPanel';
import { GroupSelector, LabelSelector } from '@/features/server-grouping';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

import {
  expandedGroupsAtom,
  firstGroupOptionAtom,
  iconLabelOptionAtom,
  secondGroupOptionAtom,
  toggleGroupExpandedAtom,
} from '../model/server-inventory-map.store';

export interface ServerInventoryMapPageProps {
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 서버 인벤토리 맵 페이지
 * - 프로젝트 요약 정보
 * - 그룹화 툴바
 * - 서버 그리드 (그룹화 지원)
 */
export function ServerInventoryMapPage({ className }: ServerInventoryMapPageProps) {
  // 그룹화 상태
  const [firstGroup, setFirstGroup] = useAtom(firstGroupOptionAtom);
  const [secondGroup, setSecondGroup] = useAtom(secondGroupOptionAtom);
  const [labelOption, setLabelOption] = useAtom(iconLabelOptionAtom);
  const expandedGroups = useAtomValue(expandedGroupsAtom);
  const toggleGroupExpanded = useSetAtom(toggleGroupExpandedAtom);

  // Mock 데이터
  const { data: groups, servers } = useServerMockData({
    group1: firstGroup,
    group2: secondGroup,
  });
  const { data: projectSummary } = useProjectSummaryMockData();

  // 그룹화 여부
  const isGrouped = !(groups.length === 1 && groups[0]?.key === 'all');

  return (
    <div className={className}>
      {/* 페이지 헤더 */}
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold'>Server Inventory Map</h1>
        <p className='text-muted-foreground mt-1'>서버 상태를 한눈에 파악하세요</p>
      </div>

      {/* 프로젝트 요약 */}
      <div className='mb-6'>
        <ProjectSummaryPanel summary={projectSummary} />
      </div>

      {/* 서버 그리드 */}
      <div className='border rounded-lg p-4'>
        {/* 툴바: 그룹화 선택 */}
        <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <h2 className='text-lg font-medium'>서버 목록</h2>
            <span className='text-sm text-muted-foreground'>총 {servers.length}대</span>
          </div>
          <div className='flex items-center gap-4'>
            <GroupSelector
              label='1차 그룹'
              value={firstGroup}
              onChange={(value) => {
                setFirstGroup(value);
                // 1차 그룹 해제 시 2차 그룹도 해제
                if (!value) {
                  setSecondGroup(null);
                }
              }}
            />
            <GroupSelector
              label='2차 그룹'
              value={secondGroup}
              onChange={setSecondGroup}
              excludeValues={[firstGroup]}
              disabled={!firstGroup}
            />
            <div className='border-l pl-4 ml-2'>
              <LabelSelector value={labelOption} onChange={setLabelOption} />
            </div>
          </div>
        </div>

        {/* 그룹화 없을 때: 단일 그리드 */}
        {!isGrouped ? (
          <ServerGrid servers={groups[0]?.servers ?? []} labelOption={labelOption} />
        ) : (
          /* 그룹화 있을 때: Accordion 패널 */
          <div className='space-y-3'>
            {groups.map((group) => (
              <ServerGroupPanel
                key={group.name}
                group={group}
                isExpanded={expandedGroups.has(group.name)}
                onToggle={() => toggleGroupExpanded(group.name)}
                labelOption={labelOption}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
