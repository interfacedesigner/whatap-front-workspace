/**
 * ServerGrid Component
 * @description 서버 아이콘을 반응형 그리드로 표시
 */
import { cn } from '@/shared/lib/utils';

import type { IconLabelOption, Server } from '../model/server.types';
import { ServerIcon } from './ServerIcon';

export interface ServerGridProps {
  /** 서버 목록 */
  servers: Server[];
  /** 아이콘 라벨 옵션 */
  labelOption?: IconLabelOption;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 서버 아이콘 그리드
 * - 반응형: 화면 크기에 따라 열 개수 자동 조절
 * - 빈 상태 UI 지원
 */
export function ServerGrid({ servers, labelOption = 'hostname', className }: ServerGridProps) {
  if (servers.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-32 text-muted-foreground', className)}>
        표시할 서버가 없습니다
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-4',
        // 반응형 그리드: 최소 80px 너비로 자동 배치
        'grid-cols-[repeat(auto-fill,minmax(80px,1fr))]',
        className,
      )}
    >
      {servers.map((server) => (
        <ServerIcon key={server.oid} server={server} labelOption={labelOption} />
      ))}
    </div>
  );
}
