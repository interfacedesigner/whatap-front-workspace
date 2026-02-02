import { cn } from '@/shared/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';

import { EXPAND_COLUMN_ID } from '../constants';
import { useColumnRegistry } from '../hooks/use-column-registry';
import { useTableContext } from '../hooks/use-table-context';

type isExpanded = boolean;
interface ExpandHeaderProps {
  isAllRowsExpanded: boolean;
  toggleAllRowExpand: () => isExpanded;
  defaultRenderHeader?: ({ className }: { className?: string }) => React.ReactNode;
}

interface ExpandCellProps<TData extends object> {
  isExpanded: boolean;
  toggleRowExpand: () => isExpanded;
  rowData: TData;
  defaultRenderCell?: ({ className }: { className?: string }) => React.ReactNode;
  /** row의 깊이 (0: root, 1+: sub rows) */
  depth: number;
  /** expand 가능 여부 (subRows가 있는지) */
  canExpand: boolean;
}

export function ExpandRowColumn<TData extends object>({
  pinned = false,
  renderCustomHeader,
  renderCustomCell,
}: {
  pinned?: false | 'left' | 'right';
  renderCustomHeader?: ({ isAllRowsExpanded, toggleAllRowExpand }: ExpandHeaderProps) => React.ReactNode;
  renderCustomCell?: ({ isExpanded, toggleRowExpand, rowData }: ExpandCellProps<TData>) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}) {
  const { table } = useTableContext<TData>();
  const { registerColumn, unregisterColumn, getColumnSequence } = useColumnRegistry<TData>();
  const generatedSequence = useMemo(() => getColumnSequence(), [getColumnSequence]);

  useEffect(() => {
    registerColumn(
      {
        id: EXPAND_COLUMN_ID,
        size: 28,
        enableResizing: false,
        enableSorting: false,
        header: ({ table }) =>
          renderCustomHeader ? (
            renderCustomHeader({
              isAllRowsExpanded: table.getIsAllRowsExpanded(),
              toggleAllRowExpand() {
                if (table.getIsAllRowsExpanded()) {
                  table.resetExpanded();
                  return false;
                } else {
                  table.toggleAllRowsExpanded();
                  return true;
                }
              },
              defaultRenderHeader: ({ className }) => (
                <DefaultRenderHeader
                  className={className}
                  isAllRowsExpanded={table.getIsAllRowsExpanded()}
                  resetExpanded={table.resetExpanded}
                  toggleAllRowsExpanded={table.toggleAllRowsExpanded}
                />
              ),
            })
          ) : (
            <DefaultRenderHeader
              isAllRowsExpanded={table.getIsAllRowsExpanded()}
              resetExpanded={table.resetExpanded}
              toggleAllRowsExpanded={table.toggleAllRowsExpanded}
            />
          ),
        cell: ({ row }) => {
          return renderCustomCell ? (
            renderCustomCell({
              isExpanded: row.getIsExpanded(),
              toggleRowExpand: () => {
                row.toggleExpanded();
                return row.getIsExpanded();
              },
              rowData: row.original,
              depth: row.depth,
              canExpand: row.getCanExpand(),
              defaultRenderCell: ({ className }) => (
                <DefaultRenderCell
                  className={className}
                  toggleExpanded={row.toggleExpanded}
                  isExpanded={row.getIsExpanded()}
                />
              ),
            })
          ) : (
            <DefaultRenderCell toggleExpanded={row.toggleExpanded} isExpanded={row.getIsExpanded()} />
          );
        },
      },
      generatedSequence,
    );

    return () => {
      unregisterColumn(EXPAND_COLUMN_ID);
    };
  }, [registerColumn, renderCustomCell, renderCustomHeader, unregisterColumn, generatedSequence]);

  useEffect(() => {
    table?.setOptions((prev) => ({
      ...prev,
      enableExpanding: true,
    }));
  }, [table]);

  useEffect(() => {
    table?.getColumn(EXPAND_COLUMN_ID)?.pin(pinned);
  }, [pinned, table]);

  return null;
}

function DefaultRenderHeader({
  className,
  isAllRowsExpanded,
  resetExpanded,
  toggleAllRowsExpanded,
}: {
  className?: string;
  isAllRowsExpanded: boolean;
  resetExpanded: () => void;
  toggleAllRowsExpanded: () => void;
}) {
  return (
    <div
      className={cn('flex w-full h-full justify-center items-center py-1 px-2 cursor-pointer', className)}
      onClick={(e) => {
        e.stopPropagation();
        if (isAllRowsExpanded) {
          resetExpanded();
        } else {
          toggleAllRowsExpanded();
        }
      }}
    >
      {isAllRowsExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
    </div>
  );
}

function DefaultRenderCell({
  className,
  toggleExpanded,
  isExpanded,
}: {
  className?: string;
  toggleExpanded: () => void;
  isExpanded: boolean;
}) {
  return (
    <div
      className={cn('flex w-full h-full justify-center items-center cursor-pointer py-1 px-2', className)}
      onClick={(e) => {
        e.stopPropagation();
        toggleExpanded();
      }}
    >
      {isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
    </div>
  );
}
