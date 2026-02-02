import { useCallback, useRef } from 'react';

export function useSequence(initSeq = 0) {
  const sequence = useRef(initSeq);
  return { nextSequence: useCallback(() => sequence.current++, []) };
}
