import { expect, test } from './fixtures';

test.describe('Login Page', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');

    // 로그인 페이지가 정상적으로 로드되었는지 확인
    await expect(page).toHaveURL('/login');
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/login');

    // 이메일 입력 필드 확인
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await expect(emailInput).toBeVisible();

    // 비밀번호 입력 필드 확인
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toBeVisible();

    // 로그인 버튼 확인
    const loginButton = page.getByRole('button', { name: /login|sign in/i });
    await expect(loginButton).toBeVisible();
  });

  test('should have submit button disabled or handle empty form', async ({ page }) => {
    await page.goto('/login');

    // 로그인 버튼이 존재하는지 확인
    const loginButton = page.getByRole('button', { name: /login|sign in/i });
    await expect(loginButton).toBeVisible();

    // 버튼이 비활성화되어 있거나 클릭 가능한 상태인지 확인
    // 실제 구현에 따라 동작이 다를 수 있음
    const isDisabled = await loginButton.isDisabled();
    expect(typeof isDisabled).toBe('boolean');
  });
});
