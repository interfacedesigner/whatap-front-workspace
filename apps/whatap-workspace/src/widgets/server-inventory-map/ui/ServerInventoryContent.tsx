/**
 * ServerInventoryContent Widget
 * @description 서버 인벤토리 맵의 서버 그리드/그룹 패널
 */
import type { ServerGroup } from '@/entities/server';
import { ServerGrid } from '@/entities/server';
import { ServerGroupPanel } from '@/entities/server/ui/ServerGroupPanel';
import { useAtomValue, useSetAtom } from 'jotai';

import { expandedGroupsAtom, iconLabelOptionAtom, toggleGroupExpandedAtom } from '../model/server-inventory-map.store';

export interface ServerInventoryContentProps {
  /** 서버 그룹 목록 */
  groups: ServerGroup[];
}

export function ServerInventoryContent({ groups }: ServerInventoryContentProps) {
  const labelOption = useAtomValue(iconLabelOptionAtom);
  const expandedGroups = useAtomValue(expandedGroupsAtom);
  const toggleGroupExpanded = useSetAtom(toggleGroupExpandedAtom);

  // 그룹화 여부 판단
  const isGrouped = !(groups.length === 1 && groups[0]?.key === 'all');

  if (!isGrouped) {
    return <ServerGrid servers={groups[0]?.servers ?? []} labelOption={labelOption} />;
  }

  return (
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
  );
}
