import { createContext, useContext } from 'react';

import type { TableContextType } from '../data-table.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TableContext = createContext<TableContextType<any> | null>(null);

export function useTableContext<TData extends object>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error('useTableContext must be used within a TableContextProvider');
  }
  return context as TableContextType<TData>;
}
