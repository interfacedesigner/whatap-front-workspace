import type { ColumnDef } from '@tanstack/react-table';
import { type Dispatch, type SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';

import type {
  ColumnDefWithMeta,
  ColumnId,
  ColumnRegistryContextType,
  GroupDefWithMeta,
  GroupId,
} from './data-table.types';
import { ColumnRegistryContext } from './hooks/use-column-registry';
import { useSequence } from './hooks/use-sequence';

/** 미리 예약된 컬럼 시퀀스 값을 위해 100을 기본으로 설정합니다. */
export const RESERVED_ADDON_COLUMN_SEQUENCE = 100;

export function ColumnRegistryProvider<TData extends object>({
  children,
  onColumnsChange,
}: {
  children: React.ReactNode;
  onColumnsChange?: Dispatch<SetStateAction<ColumnDef<TData>[]>>;
}) {
  const { nextSequence } = useSequence(RESERVED_ADDON_COLUMN_SEQUENCE);
  const [columnMap, setColumnMap] = useState<Map<ColumnId, ColumnDefWithMeta<TData>>>(() => new Map());
  const [groupMap, setGroupMap] = useState<Map<GroupId, GroupDefWithMeta<TData>>>(() => new Map());

  // 파생된 컬럼 배열 계산
  const columns = useMemo(() => {
    const result = Array.from(columnMap.values()).filter((col) => !col.groupId);

    for (const group of groupMap.values()) {
      const groupColumns = group.columnIds.map((id) => columnMap.get(id)).filter(Boolean) as ColumnDefWithMeta<TData>[];

      if (groupColumns.length > 0) {
        result.push({
          ...group,
          columns: groupColumns.sort((a, b) => a.sequence - b.sequence),
        } as ColumnDefWithMeta<TData>);
      }
    }

    const sorted = result.sort((a, b) => a.sequence - b.sequence);
    return sorted;
  }, [columnMap, groupMap]);

  // 컬럼 변경 시 콜백 호출
  useEffect(() => {
    onColumnsChange?.(columns as ColumnDef<TData>[]);
  }, [columns, onColumnsChange]);

  const addColumnToGroup = useCallback(
    (groupId: string, columnId: string) => {
      setGroupMap((prev) => {
        const newMap = new Map(prev);
        const group = newMap.get(groupId) || {
          id: groupId,
          columnIds: [],
          sequence: nextSequence(),
        };
        newMap.set(groupId, {
          ...group,
          columnIds: [...new Set([...group.columnIds, columnId])],
        });
        return newMap;
      });
    },
    [nextSequence],
  );

  const registerColumn = useCallback(
    (column: Omit<ColumnDefWithMeta<TData>, 'sequence'>, sequence?: number) => {
      if (!column.id) {
        throw new Error('column.id is required');
      }
      if (column.groupId) {
        addColumnToGroup(column.groupId, column.id);
      }
      setColumnMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(column.id!, {
          ...column,
          sequence: sequence ? sequence : nextSequence(),
        } as ColumnDefWithMeta<TData>);
        return newMap;
      });
    },
    [addColumnToGroup, nextSequence],
  );

  const removeColumnFromGroup = useCallback((groupId: string, columnId: string) => {
    setGroupMap((prev) => {
      const newMap = new Map(prev);
      const group = newMap.get(groupId);
      if (group) {
        newMap.set(groupId, {
          ...group,
          columnIds: group.columnIds.filter((id) => id !== columnId),
        });
      }
      return newMap;
    });
  }, []);

  const unregisterColumn = useCallback(
    (columnId: string) => {
      const column = columnMap.get(columnId);
      if (column?.groupId) {
        removeColumnFromGroup(column.groupId, columnId);
      }
      setColumnMap((prev) => {
        const newMap = new Map(prev);
        newMap.delete(columnId);
        return newMap;
      });
    },
    [columnMap, removeColumnFromGroup],
  );

  const registerGroup = useCallback(
    (groupDef: Omit<GroupDefWithMeta<TData>, 'sequence' | 'columns' | 'columnIds'>, sequence?: number) => {
      const groupId = groupDef.id;
      setGroupMap((prev) => {
        const newMap = new Map(prev);
        const existingGroup = newMap.get(groupId);
        const nexSeq = sequence ?? nextSequence();
        newMap.set(groupId, {
          ...groupDef,
          columnIds: existingGroup?.columnIds ?? [],
          sequence: nexSeq, // Column과 동일하게 항상 새 시퀀스 할당 → JSX 순서 보장
        });
        return newMap;
      });
    },
    [nextSequence],
  );

  const unregisterGroup = useCallback((groupId: string) => {
    setGroupMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(groupId);
      return newMap;
    });
  }, []);

  const contextValue = useMemo<ColumnRegistryContextType<TData>>(
    () => ({
      registerColumn,
      unregisterColumn,
      registerGroup,
      unregisterGroup,
      getColumnSequence: nextSequence,
    }),
    [registerColumn, unregisterColumn, registerGroup, unregisterGroup, nextSequence],
  );

  return <ColumnRegistryContext.Provider value={contextValue}>{children}</ColumnRegistryContext.Provider>;
}
