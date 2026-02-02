import { cn } from '@/shared/lib/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { ExpandRowColumn } from './components/expand-row-column';
import { SelectRowColumn } from './components/select-row-column';
import { DataTable } from './data-table';
import { Column, ColumnGroup } from './data-table-columns';
import { DataTableStoriesData, type DataTableStoriesDataType } from './data-table.stories.data';

/**
 * DataTable is a feature-rich table component with support for sorting, column resizing,
 * row selection, row expansion, and custom rendering capabilities.
 */
const meta: Meta<typeof DataTable<DataTableStoriesDataType>> = {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      description: {
        component:
          'A comprehensive table component built on TanStack Table v8, providing features like sorting, column resizing, row selection, expandable rows, and custom row/cell rendering.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DataTable<DataTableStoriesDataType>>;

export const Default: Story = {
  render: () => (
    <div className='h-[400px]'>
      <DataTable
        data={DataTableStoriesData.map((server, index) => ({
          idx: index,
          ...server,
        }))}
        getRowId={(row) => `${row.idx}`}
        onRowSelectionChange={(selectedDataList, selectedRowIdList) => {
          console.log(selectedDataList, selectedRowIdList);
        }}
        renderExpandedRow={(row) => <div className='p-4'>{row.oname}</div>}
        enableExpanding
        enableRowSelection
        enableSorting
        enableColumnResizing
      >
        <ColumnGroup header='서버 기본 정보'>
          <Column<DataTableStoriesDataType & { idx: number }> header='Index' accessorKey='idx' />
          <Column<DataTableStoriesDataType & { idx: number }>
            header='서버명'
            accessorKey='oname'
            render={({ oname }) => <div className='px-2 py-1'>{oname}</div>}
          />
        </ColumnGroup>
      </DataTable>
    </div>
  ),
};

export const SortTest: Story = {
  render: () => (
    <div className='h-[400px] flex flex-col gap-2'>
      <span className='text-sm text-muted-foreground'>Shift+클릭으로 다중 정렬 가능합니다.</span>
      <DataTable
        data={[
          { id: 1, name: 'Charlie', score: 85, department: 'Engineering' },
          { id: 2, name: 'Alice', score: 92, department: 'Design' },
          { id: 3, name: 'Bob', score: 78, department: 'Engineering' },
          { id: 4, name: 'Diana', score: 85, department: 'Design' },
          { id: 5, name: 'Eve', score: 92, department: 'Engineering' },
        ]}
        enableSorting={true}
      >
        <Column header='ID' accessorKey='id' />
        <Column header='이름' accessorKey='name' />
        <Column header='점수' accessorKey='score' />
        <Column header='부서(정렬 비활성화)' accessorKey='department' enableSorting={false} />
      </DataTable>
    </div>
  ),
};

export const ColumnResizeTest: Story = {
  render: () => (
    <div className='h-[400px]'>
      <DataTable
        data={[
          {
            id: 1,
            name: 'Charlie Brown',
            score: 85,
            department: 'Engineering Team',
            description: 'Senior Frontend Developer with 5+ years experience',
          },
          {
            id: 2,
            name: 'Alice Johnson',
            score: 92,
            department: 'Design Team',
            description: 'UI/UX Designer specializing in user research',
          },
          {
            id: 3,
            name: 'Bob Smith',
            score: 78,
            department: 'Engineering Team',
            description: 'Backend Developer focusing on microservices',
          },
        ]}
        enableSorting={true}
        enableColumnResizing={true}
      >
        <Column header='ID' accessorKey='id' />
        <Column header='이름' accessorKey='name' />
        <Column header='점수' accessorKey='score' />
        <Column header='부서' accessorKey='department' />
        <Column header='설명' accessorKey='description' />
      </DataTable>
    </div>
  ),
};

export const CustomCheckboxAndExpandColumn: Story = {
  render: () => (
    <div className='h-[400px]'>
      <DataTable
        data={[
          {
            id: 1,
            name: 'Charlie Brown',
            score: 85,
            department: 'Engineering Team',
            description: 'Senior Frontend Developer with 5+ years experience',
          },
        ]}
        enableSorting={true}
        enableColumnResizing={true}
        renderExpandedRow={(row) => <div className='p-4'>{row.description}</div>}
        selectedRowIds={[]}
      >
        <SelectRowColumn<DataTableStoriesDataType>
          pinned='left'
          renderCustomHeader={({ isAllRowsSelected, onChange }) => (
            <input type='checkbox' checked={isAllRowsSelected} onChange={onChange} />
          )}
          renderCustomCell={({ isSelected, onChange, disabled }) => (
            <input type='checkbox' checked={isSelected} onChange={onChange} disabled={disabled} />
          )}
        />
        <ExpandRowColumn<DataTableStoriesDataType>
          pinned='left'
          renderCustomHeader={({ isAllRowsExpanded, toggleAllRowExpand }) => (
            <button onClick={toggleAllRowExpand}>
              {isAllRowsExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
            </button>
          )}
          renderCustomCell={({ isExpanded, toggleRowExpand }) => (
            <button onClick={toggleRowExpand}>
              {isExpanded ? <ChevronDown className='h-4 w-4' /> : <ChevronRight className='h-4 w-4' />}
            </button>
          )}
        />
        <Column header='ID' accessorKey='id' />
        <Column header='설명' accessorKey='description' />
      </DataTable>
    </div>
  ),
};

export const RenderCustomRowTest: Story = {
  render: () => (
    <div className='h-[400px]'>
      <DataTable
        data={[
          {
            id: 1,
            name: 'Charlie Brown',
            score: 85,
            department: 'Engineering Team',
            description: 'Senior Frontend Developer with 5+ years experience',
            status: 'error',
          },
          {
            id: 2,
            name: 'Alice Johnson',
            score: 92,
            department: 'Design Team',
            description: 'UI/UX Designer specializing in user research',
            status: 'warning',
          },
        ]}
        renderCustomRow={({ rowData, defaultRender }) => {
          const backgroundColor =
            rowData.status === 'error' ? 'bg-red-100' : rowData.status === 'warning' ? 'bg-yellow-100' : undefined;

          return defaultRender({
            rowClassName: cn(backgroundColor),
            cellClassName: '',
          });
        }}
      >
        <Column accessorKey='oname' header='oname' />
        <Column accessorKey='ip' header='ip' />
        <Column accessorKey='cpu_cores' header='cpu_cores' />
      </DataTable>
    </div>
  ),
};

export const VirtualScrollTest: Story = {
  render: () => (
    <div className='h-[600px] flex flex-col gap-2'>
      <span className='text-sm text-muted-foreground'>1,200 rows with virtual scrolling for optimal performance</span>
      <DataTable data={DataTableStoriesData} getRowId={(row) => row.oid} enableSorting enableColumnResizing>
        <Column header='OID' accessorKey='oid' size={80} />
        <Column header='서버명' accessorKey='oname' size={180} />
        <Column header='IP' accessorKey='ip' size={140} />
        <Column header='CPU Cores' accessorKey='cpu_cores' size={100} />
        <Column header='CPU %' accessorKey='cpu_usedPercent' size={80} />
        <Column header='Memory' accessorKey='memory_usedPercent' size={80} />
        <Column header='Status' accessorKey='status' size={100} />
      </DataTable>
    </div>
  ),
};

export const ColumnPinningTest: Story = {
  render: () => (
    <div className='h-[400px] flex flex-col gap-2'>
      <span className='text-sm text-muted-foreground'>
        Left and right pinned columns stay visible while scrolling horizontally
      </span>
      <DataTable
        data={DataTableStoriesData.slice(0, 20)}
        getRowId={(row) => row.oid}
        enableSorting
        enableColumnResizing
        enableColumnPinning
      >
        <Column header='OID' accessorKey='oid' size={80} pinned='left' />
        <Column header='서버명' accessorKey='oname' size={180} pinned='left' />
        <Column header='IP' accessorKey='ip' size={140} />
        <Column header='CPU Cores' accessorKey='cpu_cores' size={100} />
        <Column header='CPU %' accessorKey='cpu_usedPercent' size={80} />
        <Column header='Memory Total' accessorKey='memory_total' size={120} />
        <Column header='Memory Used' accessorKey='memory_used' size={120} />
        <Column header='Memory %' accessorKey='memory_usedPercent' size={80} />
        <Column header='Disk Total' accessorKey='disk_total' size={120} />
        <Column header='Disk Used' accessorKey='disk_used' size={120} />
        <Column header='Status' accessorKey='status' size={100} pinned='right' />
      </DataTable>
    </div>
  ),
};

export const ScrollToRowTest: Story = {
  render: () => {
    const targetRowId = '500';
    return (
      <div className='h-[400px] flex flex-col gap-2'>
        <span className='text-sm text-muted-foreground'>Automatically scrolled to row with OID: {targetRowId}</span>
        <DataTable
          data={DataTableStoriesData}
          getRowId={(row) => row.oid}
          scrollToRowId={targetRowId}
          scrollToRowIdAlign='center'
          enableSorting
        >
          <Column header='OID' accessorKey='oid' size={80} />
          <Column header='서버명' accessorKey='oname' size={180} />
          <Column header='IP' accessorKey='ip' size={140} />
          <Column header='Status' accessorKey='status' size={100} />
        </DataTable>
      </div>
    );
  },
};
