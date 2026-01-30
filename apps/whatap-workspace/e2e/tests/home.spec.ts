import { expect, test } from './fixtures';

test.describe('Home Page', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/');

    // 인증되지 않은 상태에서 홈페이지 접근 시 로그인으로 리다이렉트
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have correct title', async ({ page }) => {
    await page.goto('/');

    // 타이틀 확인 (실제 타이틀에 맞게 수정 필요)
    await expect(page).toHaveTitle(/WhaTap|Workspace/i);
  });
});
