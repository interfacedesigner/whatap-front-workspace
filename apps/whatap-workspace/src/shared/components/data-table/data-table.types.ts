import type { ColumnDef, ColumnSizingState, SortingState, Table } from '@tanstack/react-table';
import type { ScrollToOptions } from '@tanstack/react-virtual';

import type { DefaultRowContentProps } from './components/data-table-row';

export type ScrollAlign = NonNullable<ScrollToOptions['align']>;

export interface DataTableProps<TData extends object> {
  data: TData[];
  children: React.ReactElement | React.ReactElement[];
  /** 외부에서 제어하는 선택된 row ID 목록
   * - enableRowSelection이 true일 때만 사용할 수 있습니다. */
  selectedRowIds?: string[];

  initialSorting?: SortingState;
  initialSizing?: ColumnSizingState;
  columnOrder?: string[]; // column id 배열
  columnVisibility?: Record<string, boolean>; // column id to boolean

  enableColumnResizing?: boolean;
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  enableColumnPinning?: boolean;
  disableStickyHeader?: boolean;
  /** thead를 고정하고 tbody 영역에서만 스크롤바를 표시합니다.
   * 리스트 페이지처럼 뷰포트에 맞게 테이블 높이가 제한되는 경우 사용합니다. */
  scrollableBody?: boolean;
  isLoading?: boolean;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  /** 테이블 하단 캡션 텍스트 */
  caption?: React.ReactNode;
  captionClassName?: string;
  /** 테이블 Footer 렌더링 함수 */
  renderFooter?: (table: Table<TData>) => React.ReactNode;

  /**
   * getRowId 함수를 통해 얻은 행 ID를 기준으로 스크롤합니다.
   *
   * 기본값으로 row의 index를 사용합니다.
   */
  scrollToRowId?: string;

  /**
   * 스크롤의 정렬 방향을 지정합니다.
   *
   * @default 'start'
   */
  scrollToRowIdAlign?: ScrollAlign;
  getRowId?: (data: TData, index: number) => string;
  /** 체크박스 항목 변경 시 호출됩니다. */
  onRowSelectionChange?: (data: TData[], idList: string[]) => void;
  /** 행 클릭 시 호출됩니다. */
  onRowClick?: (data: TData, index: number) => void;
  onSortingChange?: (sorting: SortingState, sortedData: TData[]) => void;
  onResizingChange?: (resizing: ColumnSizingState) => void;
  renderNoData?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  renderExpandedRow?: (row: TData) => React.ReactNode;
  /**
   * subRows 기능을 사용하기 위한 함수
   * TanStack Table의 subRows 기능을 활용하여 하위 row를 렌더링합니다.
   * @param row - 부모 row의 데이터
   * @returns 하위 row 데이터 배열 또는 undefined
   */
  getSubRows?: (originalRow: TData, index: number) => undefined | TData[];
  /**
   * 커스텀 row 렌더링 함수
   * @param row - 렌더링할 row의 데이터
   * @param index - row의 index
   * @param defaultRender - 기본 row 렌더링 함수
   * @returns 커스터마이징된 row 엘리먼트
   */
  renderCustomRow?: ({
    rowData,
    index,
    defaultRender,
  }: {
    rowData: TData;
    index: number;
    defaultRender: ({
      rowClassName,
      cellClassName,
    }: Pick<DefaultRowContentProps<TData>, 'rowClassName' | 'cellClassName'>) => React.ReactNode;
  }) => React.ReactNode;

  /** 행 선택 기능 활성화 여부
   * - 활성화 시 selectedRowIds 속성이 필수입니다.
   * @deprecated 해당 프로퍼티는 사용하지 마세요. \<SelectRowColumn\> 을 DataTable 자식으로 추가 하세요.
   */
  enableRowSelection?: boolean;
  /**
   * @deprecated 해당 프로퍼티는 사용하지 마세요. \<ExpandRowColumn\> 을 DataTable 자식으로 추가 하세요.
   */
  enableExpanding?: boolean;
}

// Define our column type with custom meta
export type ColumnDefWithMeta<TData extends object> = Omit<ColumnDef<TData>, 'accessorKey'> & {
  accessorKey?: keyof TData;
  groupId?: string;
  sequence: number;
  enableSorting?: boolean;
  sortDescFirst?: boolean;
  pinned?: 'left' | 'right' | false;
};

export type GroupDefWithMeta<TData extends object> = Omit<ColumnDef<TData>, 'accessorKey' | 'columns' | 'id'> & {
  columnIds: string[];
  sequence: number;
  id: string;
};

// Create a context with properly typed generic
export type ColumnRegistryContextType<TData extends object> = {
  registerColumn: (column: Omit<ColumnDefWithMeta<TData>, 'sequence'>, sequence?: number) => void;
  unregisterColumn: (columnId: string) => void;
  registerGroup: (
    groupDef: Omit<GroupDefWithMeta<TData>, 'sequence' | 'columns' | 'columnIds'>,
    sequence?: number,
  ) => void;
  unregisterGroup: (groupId: string) => void;
  getColumnSequence: () => number;
};

export type TableContextType<TData extends object> = {
  table: Table<TData> | null;
};

export type GroupId = string;
export type ColumnId = string;
