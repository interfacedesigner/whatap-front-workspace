import { describe, expect, it } from 'vitest';

import { sanitizeCssVarToken } from './css-variables';

describe('sanitizeCssVarToken', () => {
  it('일반 문자열을 그대로 반환해야 한다', () => {
    expect(sanitizeCssVarToken('column-name')).toBe('column-name');
    expect(sanitizeCssVarToken('columnName')).toBe('columnName');
  });

  it('공백을 대시로 변환해야 한다', () => {
    expect(sanitizeCssVarToken('column name')).toBe('column-name');
    expect(sanitizeCssVarToken('column  name')).toBe('column-name');
  });

  it('특수 문자를 대시로 변환해야 한다', () => {
    expect(sanitizeCssVarToken('column.name')).toBe('column-name');
    expect(sanitizeCssVarToken('column:name')).toBe('column-name');
    expect(sanitizeCssVarToken('column@name')).toBe('column-name');
  });

  it('연속된 대시를 하나로 합쳐야 한다', () => {
    expect(sanitizeCssVarToken('column---name')).toBe('column-name');
  });

  it('앞뒤 대시를 제거해야 한다', () => {
    expect(sanitizeCssVarToken('-column-name-')).toBe('column-name');
    expect(sanitizeCssVarToken('--column-name--')).toBe('column-name');
  });

  it('숫자로 시작하는 경우 x- 접두사를 추가해야 한다', () => {
    expect(sanitizeCssVarToken('123column')).toBe('x-123column');
    expect(sanitizeCssVarToken('1-column')).toBe('x-1-column');
  });

  it('빈 문자열은 id를 반환해야 한다', () => {
    expect(sanitizeCssVarToken('')).toBe('id');
    expect(sanitizeCssVarToken('   ')).toBe('id');
  });

  it('언더스코어와 대시는 유지해야 한다', () => {
    expect(sanitizeCssVarToken('column_name')).toBe('column_name');
    expect(sanitizeCssVarToken('column-name')).toBe('column-name');
  });
});
