import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E 테스트 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e/tests',

  /* 병렬 실행 설정 */
  fullyParallel: true,

  /* CI에서만 fail-fast 비활성화 */
  forbidOnly: !!process.env.CI,

  /* CI에서 재시도 */
  retries: process.env.CI ? 2 : 0,

  /* CI에서 worker 수 제한 */
  workers: process.env.CI ? 1 : undefined,

  /* 리포터 설정 */
  reporter: [['html', { outputFolder: './e2e/playwright-report' }], ['list']],

  /* 테스트 타임아웃 */
  timeout: 30_000,

  /* 공통 설정 */
  use: {
    baseURL: 'http://localhost:4000',

    /* 실패 시 스크린샷 */
    screenshot: 'only-on-failure',

    /* 실패 시 트레이스 */
    trace: 'on-first-retry',

    /* 비디오 녹화 (실패 시) */
    video: 'on-first-retry',
  },

  /* 브라우저 프로젝트 설정 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 개발 서버 자동 시작 */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },

  /* 출력 디렉토리 */
  outputDir: './e2e/test-results',
});
