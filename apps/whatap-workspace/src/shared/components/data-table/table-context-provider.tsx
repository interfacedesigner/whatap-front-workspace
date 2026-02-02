import type { Table } from '@tanstack/react-table';
import { useMemo } from 'react';

import { TableContext } from './hooks/use-table-context';

export function TableContextProvider<TData extends object>({
  table,
  children,
}: {
  table: Table<TData> | null;
  children: React.ReactNode;
}) {
  const contextValue = useMemo(() => ({ table }), [table]);

  return <TableContext.Provider value={contextValue}>{children}</TableContext.Provider>;
}
