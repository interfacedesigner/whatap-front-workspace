import { cn } from '@/shared/lib/utils';
import React, { isValidElement, useEffect, useId, useMemo } from 'react';

import { useColumnRegistry } from './hooks/use-column-registry';
import { defaultSortingFn } from './utils/sorting';

type ColumnAlign = 'left' | 'center' | 'right';
type StringifiablePrimitive = string | number | boolean | bigint;

function isStringifiablePrimitive(value: unknown): value is StringifiablePrimitive {
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint';
}

const alignToJustifyContent: Record<ColumnAlign, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const alignToTextAlign: Record<ColumnAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

interface ColumnProps<TData extends object> {
  groupId?: string; // 가능한 직접 전달하지 않는 것이 좋습니다.
  render?: (row: TData, index: number) => React.ReactNode;
  accessorKey: keyof TData;
  id?: string; // 기본값: accessorKey. 데이터 키를 사용하지 않는 추가 커스텀 컬럼 아이디 지정이 필요할 때 사용
  header: React.ReactNode;
  enableSorting?: boolean;
  enableResizing?: boolean;
  pinned?: 'left' | 'right' | false;
  sortingFn?: (valueA: TData[keyof TData], valueB: TData[keyof TData]) => number;
  /** 기본 컬럼 크기
   *
   * @default 150 (px)
   */
  size?: number;
  /** 최소 크기
   *
   * @default 50 (px)
   */
  minSize?: number;
  /** 컬럼 시퀀스 값을 직접 지정합니다.
   * - 컬럼 순서 조정이 필요할 경우 사용합니다.
   * */
  columnSequence?: number;
  /** 컬럼 정렬
   *
   * @default 'center'
   */
  align?: ColumnAlign;
}

export function Column<TData extends object>({
  accessorKey,
  id,
  header,
  render,
  groupId,
  enableSorting = true,
  enableResizing = true,
  pinned = false,
  sortingFn = defaultSortingFn,
  size = 150,
  minSize = 50,
  align = 'center',
}: ColumnProps<TData>) {
  const columnId = id ?? accessorKey.toString();
  const { registerColumn, unregisterColumn, getColumnSequence } = useColumnRegistry<TData>();
  const sequence = useMemo(() => getColumnSequence(), [getColumnSequence]);
  const justifyContent = alignToJustifyContent[align];
  const textAlign = alignToTextAlign[align];

  useEffect(() => {
    registerColumn(
      {
        id: columnId,
        ...(groupId !== undefined && { groupId }),
        sortDescFirst: false, // 데이터 타입에 상관없이 모든 컬럼 정렬이 asc부터 시작하도록 통일
        size,
        minSize,
        accessorKey,
        enableSorting,
        enableResizing,
        enablePinning: pinned !== false,
        pinned,
        sortingFn: (rowA, rowB, columnId) => {
          const valueA = rowA.getValue(columnId) as TData[keyof TData];
          const valueB = rowB.getValue(columnId) as TData[keyof TData];

          return sortingFn(valueA, valueB);
        },
        header: () =>
          typeof header === 'string' ? (
            <div className={cn('flex w-full items-center py-3.5 px-4', justifyContent)}>
              <span className='truncate text-sm font-semibold'>{header}</span>
            </div>
          ) : (
            header
          ),
        cell: render
          ? ({ row }) => {
              const result = render(row.original, row.index);

              if (isStringifiablePrimitive(result)) {
                return (
                  <div className={cn('flex w-full items-center py-3.5 px-4', justifyContent)}>
                    <span className={cn('truncate text-sm font-medium', textAlign)}>{result.toString()}</span>
                  </div>
                );
              }
              return <div className={cn('flex w-full items-center py-3.5 px-4', justifyContent)}>{result}</div>;
            }
          : ({ getValue }) => (
              <div className={cn('flex w-full items-center py-3.5 px-4', justifyContent)}>
                <span className={cn('truncate text-sm font-medium', textAlign)}>{String(getValue() ?? '')}</span>
              </div>
            ),
      },
      sequence,
    );

    return () => {
      unregisterColumn(columnId);
    };
  }, [
    accessorKey,
    header,
    render,
    groupId,
    enableSorting,
    enableResizing,
    pinned,
    size,
    minSize,
    registerColumn,
    columnId,
    sequence,
    sortingFn,
    unregisterColumn,
    align,
    justifyContent,
    textAlign,
  ]);

  return null;
}

export function ColumnGroup<TData extends object>({
  header,
  children,
  id,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  id?: string; // 그룹 ID를 직접 지정할 수 있도록 추가
}) {
  const autoId = useId();
  const groupId = id || autoId; // id가 주어지면 사용, 없으면 자동 생성
  const { registerGroup, unregisterGroup, getColumnSequence } = useColumnRegistry<TData>();
  const sequence = useMemo(() => getColumnSequence(), [getColumnSequence]);

  useEffect(() => {
    registerGroup(
      {
        id: groupId,
        header: () =>
          typeof header === 'string' ? (
            <div className='flex w-full justify-center items-center py-3.5 px-4'>
              <span className='truncate text-sm font-semibold'>{header}</span>
            </div>
          ) : (
            header
          ),
      },
      sequence,
    );
    return () => {
      unregisterGroup(groupId);
    };
  }, [groupId, header, sequence, registerGroup, unregisterGroup]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (isValidElement(child) && child.type === Column) {
          return React.cloneElement(
            child,
            Object.assign(
              {
                groupId,
              },
              child.props,
            ),
          );
        }
        return child;
      })}
    </>
  );
}
