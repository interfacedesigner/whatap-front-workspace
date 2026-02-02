import { createContext, useContext } from 'react';

import type { ColumnRegistryContextType } from '../data-table.types';

// Create context with non-null assertion and proper generic type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ColumnRegistryContext = createContext<ColumnRegistryContextType<any>>(null!);

export function useColumnRegistry<TData extends object>() {
  const context = useContext(ColumnRegistryContext);
  if (!context) {
    throw new Error('useColumnRegistry must be used within a ColumnRegistryContextProvider');
  }
  return context as ColumnRegistryContextType<TData>;
}
