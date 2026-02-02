export function defaultSortingFn(a: unknown, b: unknown) {
  // null/undefined 처리: null 값은 항상 끝으로 정렬
  if (a === null || a === undefined) {
    if (b === null || b === undefined) {
      return 0;
    }

    return 1; // null 값을 뒤로
  } else {
    if (b === null || b === undefined) {
      return -1; // null이 아닌 값을 앞으로
    }
  }

  // 나머지는 TanStack Table의 기본 auto 정렬 함수에 위임
  // 숫자 비교
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  // 기본 비교 (TanStack Table 기본 동작)
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}
