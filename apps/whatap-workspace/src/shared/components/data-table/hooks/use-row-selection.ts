import type { RowSelectionState, Updater } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';

export const useRowSelection = <TData>({
  data,
  selectedRowIds = [], // 외부에서 제어되는 선택된 row ID 목록
  onRowSelectionChange,
  getRowId,
}: {
  data: TData[];
  selectedRowIds: string[]; // 외부에서 전달받는 선택된 row ID들
  onRowSelectionChange?: (data: TData[], idList: string[]) => void;
  getRowId?: (data: TData, index: number) => string | number;
}) => {
  // 외부에서 전달받은 selectedRowIds를 기반으로 rowSelectionState 생성
  const rowSelectionState: RowSelectionState = useMemo(() => {
    return (
      selectedRowIds?.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as RowSelectionState) ?? {}
    );
  }, [selectedRowIds]);

  const idToDataMap = useMemo(
    () =>
      data.reduce(
        (acc, data, idx) => {
          const id = getRowId?.(data, idx) ?? idx;
          acc[id] = data;
          return acc;
        },
        {} as { [id: string]: TData },
      ),
    [data, getRowId],
  );

  const onRowSelectionChangeHandler = useCallback(
    (updaterOrValue: Updater<RowSelectionState>) => {
      // 새로운 선택 상태 계산
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(rowSelectionState) : updaterOrValue;

      // 선택된 데이터 목록 계산
      const selectedIdList: string[] = [];
      const selectedDataList: TData[] = [];
      Object.entries(next).forEach(([id, isSelected]) => {
        if (isSelected) {
          selectedIdList.push(id);
          selectedDataList.push(idToDataMap[id]);
        }
      });

      // 외부에 변경 사항 알림 - 외부에서 selectedRowIds 상태를 업데이트해야 함
      onRowSelectionChange?.(selectedDataList as TData[], selectedIdList);
    },
    [rowSelectionState, idToDataMap, onRowSelectionChange],
  );

  return {
    rowSelectionState,
    onRowSelectionChangeHandler,
  };
};
