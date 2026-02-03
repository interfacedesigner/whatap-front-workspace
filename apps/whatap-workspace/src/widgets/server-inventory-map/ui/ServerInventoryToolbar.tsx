/**
 * ServerInventoryToolbar Widget
 * @description 서버 인벤토리 맵의 그룹화/라벨 선택 툴바
 */
import { GroupSelector, LabelSelector } from '@/features/server-grouping';
import { useAtom } from 'jotai';

import { firstGroupOptionAtom, iconLabelOptionAtom, secondGroupOptionAtom } from '../model/server-inventory-map.store';

export interface ServerInventoryToolbarProps {
  /** 총 서버 수 */
  totalCount: number;
}

export function ServerInventoryToolbar({ totalCount }: ServerInventoryToolbarProps) {
  const [firstGroup, setFirstGroup] = useAtom(firstGroupOptionAtom);
  const [secondGroup, setSecondGroup] = useAtom(secondGroupOptionAtom);
  const [labelOption, setLabelOption] = useAtom(iconLabelOptionAtom);

  return (
    <div className='mb-4 flex flex-wrap items-center justify-between gap-4'>
      <div className='flex items-center gap-4'>
        <h2 className='text-lg font-medium'>서버 목록</h2>
        <span className='text-sm text-muted-foreground'>총 {totalCount}대</span>
      </div>
      <div className='flex items-center gap-4'>
        <GroupSelector
          label='1차 그룹'
          value={firstGroup}
          onChange={(value) => {
            setFirstGroup(value);
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
  );
}
