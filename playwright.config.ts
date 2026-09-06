import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3005',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'codshop-local',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3005',
      },
    },
    {
      name: 'codshop-production',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://codshop.vipone.site',
      },
    },
  ],
  webServer: undefined,
});
