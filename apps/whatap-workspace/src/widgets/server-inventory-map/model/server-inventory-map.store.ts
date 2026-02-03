/**
 * Server Inventory Map Jotai Store
 * @description 서버 인벤토리 맵 페이지의 클라이언트 상태 관리
 */
import type { GroupOptionKey, IconLabelOption } from '@/entities/server';
import { atom } from 'jotai';

// =============================================================================
// Grouping State
// =============================================================================

/** 1차 그룹화 기준 */
export const firstGroupOptionAtom = atom<GroupOptionKey | null>(null);

/** 2차 그룹화 기준 */
export const secondGroupOptionAtom = atom<GroupOptionKey | null>(null);

// =============================================================================
// Display State
// =============================================================================

/** 서버 아이콘 라벨 옵션 */
export const iconLabelOptionAtom = atom<IconLabelOption>('hostname');

/** 펼쳐진 그룹 ID Set (Accordion 상태) */
export const expandedGroupsAtom = atom<Set<string>>(new Set<string>());

// =============================================================================
// Derived Atoms
// =============================================================================

/** 그룹화 적용 여부 */
export const isGroupedAtom = atom((get) => {
  const first = get(firstGroupOptionAtom);
  return first !== null;
});

/** 현재 선택된 그룹 옵션 목록 (중복 제거용) */
export const selectedGroupOptionsAtom = atom((get) => {
  const first = get(firstGroupOptionAtom);
  const second = get(secondGroupOptionAtom);
  return [first, second].filter((v): v is GroupOptionKey => v !== null);
});

// =============================================================================
// Actions
// =============================================================================

/** 그룹 펼침/접기 토글 */
export const toggleGroupExpandedAtom = atom(null, (get, set, groupId: string) => {
  const current = get(expandedGroupsAtom);
  const next = new Set(current);
  if (next.has(groupId)) {
    next.delete(groupId);
  } else {
    next.add(groupId);
  }
  set(expandedGroupsAtom, next);
});

/** 모든 그룹 펼치기 */
export const expandAllGroupsAtom = atom(null, (_get, set, groupIds: string[]) => {
  set(expandedGroupsAtom, new Set(groupIds));
});

/** 모든 그룹 접기 */
export const collapseAllGroupsAtom = atom(null, (_get, set) => {
  set(expandedGroupsAtom, new Set());
});

/** 그룹 옵션 초기화 */
export const resetGroupOptionsAtom = atom(null, (_get, set) => {
  set(firstGroupOptionAtom, null);
  set(secondGroupOptionAtom, null);
  set(expandedGroupsAtom, new Set());
});
