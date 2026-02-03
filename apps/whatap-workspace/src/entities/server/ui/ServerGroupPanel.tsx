/**
 * ServerGroupPanel Component
 * @description Accordion 스타일의 서버 그룹 패널
 */
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';

import type { IconLabelOption, ServerGroup } from '../model/server.types';
import { ServerGrid } from './ServerGrid';

export interface ServerGroupPanelProps {
  /** 서버 그룹 */
  group: ServerGroup;
  /** 펼침 상태 */
  isExpanded: boolean;
  /** 펼침/접기 토글 */
  onToggle: () => void;
  /** 아이콘 라벨 옵션 */
  labelOption?: IconLabelOption;
  /** 부모 그룹명 (2차 그룹일 경우) */
  parentName?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 서버 그룹 패널 (Accordion)
 */
export function ServerGroupPanel({
  group,
  isExpanded,
  onToggle,
  labelOption = 'hostname',
  parentName,
  className,
}: ServerGroupPanelProps) {
  const groupId = parentName ? `${parentName}::${group.name}` : group.name;
  const hasSubGroups = group.groups.length > 0;

  return (
    <Accordion
      type='single'
      collapsible
      value={isExpanded ? groupId : ''}
      onValueChange={(value) => {
        if ((value === groupId) !== isExpanded) {
          onToggle();
        }
      }}
      className={className}
    >
      <AccordionItem value={groupId} className='border rounded-lg'>
        <AccordionTrigger className='px-4 hover:no-underline'>
          <GroupHeader group={group} />
        </AccordionTrigger>
        <AccordionContent className='px-4 pb-4'>
          {hasSubGroups ? (
            <div className='space-y-3'>
              {group.groups.map((subGroup) => (
                <SubGroupPanel key={subGroup.name} group={subGroup} labelOption={labelOption} />
              ))}
            </div>
          ) : (
            <ServerGrid servers={group.servers} labelOption={labelOption} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/**
 * 그룹 헤더 (그룹명 + 서버 수 + 상태 카운트)
 */
function GroupHeader({ group }: { group: ServerGroup }) {
  const { summary } = group;

  return (
    <div className='flex items-center gap-3 flex-1'>
      <span className='font-medium'>{group.name}</span>
      <span className='text-sm text-muted-foreground'>({summary.total}대)</span>
      <div className='flex items-center gap-2 ml-auto mr-2'>
        {summary.critical > 0 && <StatusBadge count={summary.critical} status='critical' />}
        {summary.warning > 0 && <StatusBadge count={summary.warning} status='warning' />}
        <span className='text-xs text-muted-foreground'>
          Active: {summary.active}/{summary.total}
        </span>
      </div>
    </div>
  );
}

/**
 * 상태 배지
 */
function StatusBadge({ count, status }: { count: number; status: 'warning' | 'critical' }) {
  const colors = {
    warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    critical: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', colors[status])}>
      {status === 'critical' ? 'Critical' : 'Warning'}: {count}
    </span>
  );
}

/**
 * 서브 그룹 패널 (2차 그룹)
 */
function SubGroupPanel({ group, labelOption }: { group: ServerGroup; labelOption: IconLabelOption }) {
  return (
    <div className='bg-muted/30 rounded-lg p-3'>
      <div className='flex items-center gap-2 mb-3'>
        <span className='text-sm font-medium'>{group.name}</span>
        <span className='text-xs text-muted-foreground'>({group.summary.total}대)</span>
        {group.summary.critical > 0 && <StatusBadge count={group.summary.critical} status='critical' />}
        {group.summary.warning > 0 && <StatusBadge count={group.summary.warning} status='warning' />}
      </div>
      <ServerGrid servers={group.servers} labelOption={labelOption} />
    </div>
  );
}
