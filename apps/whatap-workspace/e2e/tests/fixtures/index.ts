import { test as base, expect } from '@playwright/test';

/**
 * 공통 테스트 픽스처
 * 필요에 따라 확장하여 사용
 */
export const test = base.extend({
  // 추후 인증된 페이지 컨텍스트 등 추가 가능
});

export { expect };
