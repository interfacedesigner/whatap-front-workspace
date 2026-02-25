import { Checkbox } from '@/shared/components/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import React, { useEffect, useMemo } from 'react';

import { SELECT_COLUMN_ID } from '../constants';
import { useColumnRegistry } from '../hooks/use-column-registry';
import { useTableContext } from '../hooks/use-table-context';

interface SelectAllCheckboxProps {
  isSomeRowsSelected?: boolean;
  isAllRowsSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultRenderHeader?: ({ className }: { className?: string }) => React.ReactNode;
}

interface SelectCheckboxProps<TData extends object> {
  disabled: boolean;
  isSelected: boolean;
  rowData: TData;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultRenderCell?: ({ className }: { className?: string }) => React.ReactNode;
}

export function SelectRowColumn<TData extends object>({
  pinned = false,
  renderCustomHeader,
  renderCustomCell,
  enableMultiRowSelection = true,
}: {
  pinned?: false | 'left' | 'right';
  renderCustomHeader?: ({ isSomeRowsSelected, isAllRowsSelected, onChange }: SelectAllCheckboxProps) => React.ReactNode;
  renderCustomCell?: ({ isSelected, onChange, disabled, rowData }: SelectCheckboxProps<TData>) => React.ReactNode;
  enableMultiRowSelection?: boolean;
}) {
  const { registerColumn, unregisterColumn, getColumnSequence } = useColumnRegistry<TData>();
  const { table } = useTableContext<TData>();
  const generatedSequence = useMemo(() => getColumnSequence(), [getColumnSequence]);

  useEffect(() => {
    registerColumn(
      {
        id: SELECT_COLUMN_ID,
        size: 28,
        enableResizing: false,
        enableSorting: false,
        header: ({ table }) =>
          renderCustomHeader ? (
            renderCustomHeader({
              isSomeRowsSelected: table.getIsSomeRowsSelected(),
              isAllRowsSelected: table.getIsAllRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
              defaultRenderHeader: ({ className }) => (
                <DefaultRenderHeader
                  {...(className != null && { className })}
                  isSomeRowsSelected={table.getIsSomeRowsSelected()}
                  isAllRowsSelected={table.getIsAllRowsSelected()}
                  onChange={table.getToggleAllRowsSelectedHandler()}
                />
              ),
            })
          ) : (
            <DefaultRenderHeader
              isSomeRowsSelected={table.getIsSomeRowsSelected()}
              isAllRowsSelected={table.getIsAllRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />
          ),
        cell: ({ row }) => {
          return renderCustomCell ? (
            renderCustomCell({
              disabled: !row.getCanSelect(),
              isSelected: row.getIsSelected(),
              onChange: row.getToggleSelectedHandler(),
              rowData: row.original,
              defaultRenderCell: ({ className }) => (
                <DefaultRenderCell
                  {...(className != null && { className })}
                  isSelected={row.getIsSelected()}
                  onChange={row.getToggleSelectedHandler()}
                  disabled={!row.getCanSelect()}
                />
              ),
            })
          ) : (
            <DefaultRenderCell
              isSelected={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              disabled={!row.getCanSelect()}
            />
          );
        },
      },
      generatedSequence,
    );

    return () => {
      unregisterColumn(SELECT_COLUMN_ID);
    };
  }, [generatedSequence, registerColumn, renderCustomCell, renderCustomHeader, unregisterColumn]);

  useEffect(() => {
    table?.setOptions((prev) => ({
      ...prev,
      enableRowSelection: true,
      enableMultiRowSelection: enableMultiRowSelection,
    }));
  }, [table, enableMultiRowSelection]);

  useEffect(() => {
    table?.getColumn(SELECT_COLUMN_ID)?.pin(pinned);
  }, [pinned, table]);

  return null;
}

function DefaultRenderHeader({
  className,
  isSomeRowsSelected,
  isAllRowsSelected,
  onChange,
}: {
  className?: string;
  isSomeRowsSelected: boolean;
  isAllRowsSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={cn('flex w-full h-full justify-center items-center py-1 px-2', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox checked={isAllRowsSelected} indeterminate={isSomeRowsSelected} onChange={onChange} />
    </div>
  );
}

function DefaultRenderCell({
  className,
  isSelected,
  onChange,
  disabled,
}: {
  className?: string;
  isSelected: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={cn('flex w-full h-full justify-center items-center py-1 px-2', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <Checkbox checked={isSelected} onChange={onChange} disabled={disabled} />
    </div>
  );
}
