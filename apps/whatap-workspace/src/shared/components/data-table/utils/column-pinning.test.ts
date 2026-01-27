import { describe, expect, it } from 'vitest';

import type { ColumnDefWithMeta } from '../data-table.types';
import { computeColumnPinning } from './column-pinning';

describe('computeColumnPinning', () => {
  const createColumn = (id: string, pinned: 'left' | 'right' | false, sequence: number): ColumnDefWithMeta<object> => ({
    id,
    pinned,
    sequence,
  });

  it('pinned 컬럼이 columnOrder 순서대로 정렬되어야 한다', () => {
    const columns = [
      createColumn('id', 'left', 100),
      createColumn('name', 'left', 101),
      createColumn('age', false, 102),
      createColumn('city', false, 103),
    ];
    const columnOrder = ['name', 'id', 'age', 'city'];

    const result = computeColumnPinning({ columns, columnOrder });

    // columnOrder 순서: name → id
    expect(result.left).toEqual(['name', 'id']);
    expect(result.right).toEqual([]);
  });

  it('columnOrder가 없으면 sequence 순서대로 정렬되어야 한다', () => {
    const columns = [
      createColumn('id', 'left', 100),
      createColumn('name', 'left', 101),
      createColumn('age', false, 102),
    ];

    const result = computeColumnPinning({ columns });

    // sequence 순서: id(100) → name(101)
    expect(result.left).toEqual(['id', 'name']);
  });

  it('left와 right pinned 컬럼이 올바르게 분리되어야 한다', () => {
    const columns = [
      createColumn('id', 'left', 100),
      createColumn('name', false, 101),
      createColumn('age', false, 102),
      createColumn('city', 'right', 103),
    ];

    const result = computeColumnPinning({ columns });

    expect(result.left).toEqual(['id']);
    expect(result.right).toEqual(['city']);
  });

  it('pinned가 false인 컬럼은 pinning 배열에 포함되지 않아야 한다', () => {
    const columns = [
      createColumn('id', false, 100),
      createColumn('name', 'left', 101),
      createColumn('age', false, 102),
    ];

    const result = computeColumnPinning({ columns });

    expect(result.left).toEqual(['name']);
    expect(result.left).not.toContain('id');
    expect(result.left).not.toContain('age');
  });

  it('enableRowSelection이 true이면 selectColumnId가 left 맨 앞에 추가되어야 한다', () => {
    const columns = [createColumn('id', 'left', 100)];

    const result = computeColumnPinning({
      columns,
      enableRowSelection: true,
      selectColumnId: 'select',
    });

    expect(result.left).toEqual(['select', 'id']);
  });

  it('enableExpanding이 true이면 expandColumnId가 left에 추가되어야 한다', () => {
    const columns = [createColumn('id', 'left', 100)];

    const result = computeColumnPinning({
      columns,
      enableExpanding: true,
      expandColumnId: 'expand',
    });

    expect(result.left).toEqual(['expand', 'id']);
  });

  it('enableRowSelection과 enableExpanding이 모두 true이면 select → expand → pinned 순서여야 한다', () => {
    const columns = [createColumn('id', 'left', 100)];

    const result = computeColumnPinning({
      columns,
      enableRowSelection: true,
      enableExpanding: true,
      selectColumnId: 'select',
      expandColumnId: 'expand',
    });

    expect(result.left).toEqual(['select', 'expand', 'id']);
  });

  it('컬럼을 껐다 켜도 columnOrder 순서가 유지되어야 한다 (핵심 버그 수정 테스트)', () => {
    // 시나리오: 원래 [active, hostname, modelName] 순서
    // modelName을 껐다가 다시 켬 → 여전히 같은 순서 유지되어야 함
    const columnOrder = ['active', 'hostname', 'modelName', 'gpuIndex'];

    // 초기 상태
    const initialColumns = [
      createColumn('active', 'left', 100),
      createColumn('hostname', 'left', 101),
      createColumn('modelName', 'left', 102),
      createColumn('gpuIndex', false, 103),
    ];

    const initialResult = computeColumnPinning({ columns: initialColumns, columnOrder });
    expect(initialResult.left).toEqual(['active', 'hostname', 'modelName']);

    // modelName을 껐다가 다시 켬 (새로운 sequence 할당)
    const afterToggleColumns = [
      createColumn('active', 'left', 100),
      createColumn('hostname', 'left', 101),
      createColumn('modelName', 'left', 200), // 새로운 sequence
      createColumn('gpuIndex', false, 103),
    ];

    const afterToggleResult = computeColumnPinning({ columns: afterToggleColumns, columnOrder });

    // columnOrder 순서가 유지되어야 함
    expect(afterToggleResult.left).toEqual(['active', 'hostname', 'modelName']);
  });
});
