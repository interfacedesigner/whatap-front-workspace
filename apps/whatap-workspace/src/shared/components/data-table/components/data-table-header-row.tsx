import { cn } from '@/shared/lib/utils';
import type { HeaderGroup, SortDirection } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import React, { memo } from 'react';

import { sanitizeCssVarToken } from '../utils/css-variables';

interface MemoizedDataTableHeaderRowProps<TData extends object> {
  headerGroup: HeaderGroup<TData>;
  enableSorting: boolean;
  enableMultiSort?: boolean;
  tableStateForRerenderOnly: unknown[]; // memo 비교를 위해서만 사용
}

export const MemoizedDataTableHeaderRow = memo(
  function MemoizedDataTableHeaderRowWrapper<TData extends object>({
    headerGroup,
    enableSorting,
    enableMultiSort,
  }: MemoizedDataTableHeaderRowProps<TData>) {
    return (
      <DataTableHeaderRow
        headerGroup={headerGroup}
        enableSorting={enableSorting}
        enableMultiSort={enableMultiSort ?? enableSorting}
      />
    );
  },
  (prev, next) => {
    return prev.tableStateForRerenderOnly.every((state, index) => state === next.tableStateForRerenderOnly[index]);
  },
) as <TData extends object>(props: MemoizedDataTableHeaderRowProps<TData>) => React.JSX.Element;

function DataTableHeaderRow<TData extends object>({
  headerGroup,
  enableSorting,
  enableMultiSort,
}: {
  headerGroup: HeaderGroup<TData>;
  enableSorting: boolean;
  enableMultiSort: boolean;
}) {
  return (
    <tr key={headerGroup.id} className={cn('border-b', headerGroup.depth > 0 && 'border-t-0')}>
      {headerGroup.headers.map((header) => {
        // 정렬 가능 조건: 전체 정렬이 활성화되어 있고 컬럼이 정렬을 지원하는 경우
        const canSort = header.column.getCanSort();
        const sortDirection = header.column.getIsSorted();
        const canResize = header.column.getCanResize();
        const headerWidth = `calc(var(--header-${sanitizeCssVarToken(header.column.id)}-size) * 1px)`;
        const headerLeft = `calc(var(--header-${sanitizeCssVarToken(header.column.id)}-left-size) * 1px)`;
        const headerRight = `calc(var(--header-${sanitizeCssVarToken(header.column.id)}-right-size) * 1px)`;

        return (
          <th
            key={header.id}
            className={cn(
              'select-none p-0 text-left align-middle font-medium text-muted-foreground',
              header.column.getIsPinned() && 'bg-background',
            )}
            style={{
              position: header.column.getIsPinned() ? 'sticky' : undefined,
              left: headerLeft,
              right: headerRight,
              width: headerWidth,
              minWidth: headerWidth,
              cursor: canSort ? 'pointer' : 'default',
              zIndex: header.column.getIsPinned() ? 1 : 0,
            }}
            onClick={(event) => {
              if (canSort) {
                // Shift 키가 눌렸고 multisort가 활성화된 경우
                const isMultiSort = enableSorting && event.shiftKey;
                header.column.toggleSorting(undefined, !!isMultiSort);
              }
            }}
          >
            <div className='flex w-full h-full items-center grow relative'>
              {/* 헤더 콘텐츠: 정렬 아이콘을 위한 공간을 남기고 나머지 영역 차지 */}
              <div className='flex-1 min-w-0'>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </div>
              {/* 정렬 아이콘: 항상 고정 너비로 표시 */}
              {canSort && (
                <div className='mr-1 shrink-0'>
                  <SortingIndicator
                    sortDirection={sortDirection}
                    sortIndex={header.column.getSortIndex() + 1}
                    enableMultiSort={enableMultiSort}
                  />
                </div>
              )}
              {/* 컬럼 리사이즈 핸들 */}
              {canResize && (
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    header.getResizeHandler()(e);
                  }}
                  className='h-full w-2 absolute -right-1 top-0 bg-transparent cursor-col-resize select-none z-[1]'
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              )}
            </div>
          </th>
        );
      })}
    </tr>
  );
}

function SortingIndicator({
  sortDirection,
  sortIndex,
  enableMultiSort,
}: {
  sortDirection: SortDirection | false;
  sortIndex: number;
  enableMultiSort: boolean;
}) {
  return (
    <div className='flex items-center max-w-fit shrink-0'>
      {/* 정렬 방향 아이콘 */}
      <div className='flex items-center'>
        {sortDirection &&
          (sortDirection === 'asc' ? <ArrowUp className='h-3 w-3' /> : <ArrowDown className='h-3 w-3' />)}
      </div>
      {/* multisort가 활성화되고 정렬된 경우 순서 표시 */}
      {enableMultiSort && sortDirection !== false && (
        <div className='flex justify-center items-center bg-secondary rounded-sm w-3 h-3'>
          <span className='text-[8px] leading-tight text-background'>{sortIndex}</span>
        </div>
      )}
    </div>
  );
}
