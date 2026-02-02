import { describe, expect, it } from 'vitest';

import { defaultSortingFn } from './sorting';

describe('defaultSortingFn', () => {
  it('숫자를 올바르게 비교해야 한다', () => {
    expect(defaultSortingFn(1, 2)).toBeLessThan(0);
    expect(defaultSortingFn(2, 1)).toBeGreaterThan(0);
    expect(defaultSortingFn(1, 1)).toBe(0);
  });

  it('문자열을 올바르게 비교해야 한다', () => {
    expect(defaultSortingFn('apple', 'banana')).toBeLessThan(0);
    expect(defaultSortingFn('banana', 'apple')).toBeGreaterThan(0);
    expect(defaultSortingFn('apple', 'apple')).toBe(0);
  });

  it('숫자가 포함된 문자열을 자연스럽게 정렬해야 한다', () => {
    expect(defaultSortingFn('item1', 'item2')).toBeLessThan(0);
    expect(defaultSortingFn('item10', 'item2')).toBeGreaterThan(0);
    expect(defaultSortingFn('item2', 'item10')).toBeLessThan(0);
  });

  it('null 값은 끝으로 정렬해야 한다', () => {
    expect(defaultSortingFn(null, 1)).toBe(1);
    expect(defaultSortingFn(1, null)).toBe(-1);
    expect(defaultSortingFn(null, null)).toBe(0);
  });

  it('undefined 값은 끝으로 정렬해야 한다', () => {
    expect(defaultSortingFn(undefined, 1)).toBe(1);
    expect(defaultSortingFn(1, undefined)).toBe(-1);
    expect(defaultSortingFn(undefined, undefined)).toBe(0);
  });

  it('null과 undefined를 동일하게 처리해야 한다', () => {
    expect(defaultSortingFn(null, undefined)).toBe(0);
    expect(defaultSortingFn(undefined, null)).toBe(0);
  });

  it('대소문자를 구분하지 않고 비교해야 한다', () => {
    expect(defaultSortingFn('Apple', 'apple')).toBe(0);
    expect(defaultSortingFn('BANANA', 'banana')).toBe(0);
  });
});
