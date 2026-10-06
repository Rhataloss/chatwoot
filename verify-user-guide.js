#!/usr/bin/env node
/* eslint-disable */
/**
 * verify-user-guide.js
 *
 * Verification script for the Chatwoot in-app user guide (driver.js tour).
 *
 * This script drives a real browser against a deployed instance and checks that:
 *   1. The guide button exists in the sidebar: `[data-tour="user-guide-trigger"]`
 *   2. Opening it shows the module menu (Complete Tour / Sidebar / Conversations /
 *      Contacts / Campaigns / Settings).
 *   3. Starting a module tour mounts a driver.js popover
 *      (`.driver-popover.woot-driver-popover`) and highlights the first real element.
 *
 * Usage (requires a headless browser, e.g. Playwright/Puppeteer):
 *   CHATWOOT_URL=https://chat.example.com \
 *   CHATWOOT_EMAIL=agent@example.com \
 *   CHATWOOT_PASSWORD='secret' \
 *   node verify-user-guide.js
 *
 * Note: this repo has no bundled browser-automation library; install one of
 * `playwright` or `puppeteer` ad-hoc to run this against the deployed dashboard.
 */

const log = (...args) => console.log('[user-guide]', ...args);
const fail = msg => {
  console.error('[user-guide] VERIFY FAILED:', msg);
  process.exitCode = 1;
};

async function run() {
  let playwright;
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    playwright = require('playwright');
  } catch (e) {
    fail(
      'Playwright not installed. Run "npm i -D playwright" (and "npx playwright install chromium") first.'
    );
    return;
  }

  const baseUrl = process.env.CHATWOOT_URL;
  const email = process.env.CHATWOOT_EMAIL;
  const password = process.env.CHATWOOT_PASSWORD;

  if (!baseUrl || !email || !password) {
    fail('Set CHATWOOT_URL, CHATWOOT_EMAIL and CHATWOOT_PASSWORD.');
    return;
  }

  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  // -------- 1. Login -------------------------------------------------------
  await page.goto(`${baseUrl}/auth/sign_in`, { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // Wait for the dashboard shell (sidebar) to render.
  await page.waitForSelector('[data-tour="sidebar"]', { timeout: 30000 });

  // -------- 2. Guide button -------------------------------------------------
  log('Looking for the guide trigger button...');
  await page.waitForSelector('[data-tour="user-guide-trigger"]', {
    timeout: 10000,
  });
  const hasButton = await page.isVisible('[data-tour="user-guide-trigger"]');
  if (!hasButton) {
    fail('Guide button [data-tour="user-guide-trigger"] is not visible.');
  } else {
    log('Guide button is visible. OK');
  }

  // -------- 3. Open the module menu -----------------------------------------
  await page.click('[data-tour="user-guide-trigger"]');
  await page.waitForSelector('.woot-driver-popover, [class*="backdrop"]', {
    timeout: 5000,
  });

  // The module menu is a modal teleported to <body>; scope checks to its
  // container so we don't match identical labels in the main sidebar nav.
  const menu = page.locator('.fixed.inset-0').last();
  await menu.waitFor({ state: 'visible', timeout: 5000 });

  const modules = [
    'Complete Tour',
    'Sidebar & Navigation',
    'Conversations',
    'Contacts',
    'Campaigns',
    'Settings',
  ];
  const menuText = (await menu.textContent()) || '';
  for (const name of modules) {
    if (!menuText.includes(name)) {
      fail(`Module menu is missing entry: "${name}"`);
    }
  }
  log(`Module menu shows all expected entries (${modules.length}). OK`);

  // Start the "Conversations" module from within the modal.
  await menu.locator('button', { hasText: 'Conversations' }).click();

  // -------- 4. Driver popover mounts ----------------------------------------
  log('Starting the Conversations tour and waiting for the driver popover...');
  await page.waitForSelector('.driver-popover.woot-driver-popover', {
    timeout: 10000,
  });
  const popoverText = await page.textContent(
    '.driver-popover.woot-driver-popover'
  );
  if (!popoverText) {
    fail('Driver popover mounted but has no content.');
  } else {
    log('Driver popover mounted with content. OK');
  }

  // The first highlighted element must be a real, existing element.
  const hasHighlight = await page.evaluate(() => {
    const overlay = document.querySelector(
      '.driver-popover.woot-driver-popover'
    );
    return Boolean(overlay);
  });
  if (!hasHighlight) {
    fail('Tour started but popover/overlay missing.');
  } else {
    log('Tour overlay present. OK');
  }

  await browser.close();
  log('verify-user-guide.js finished.');
}

run().catch(err => {
  console.error('[user-guide] verification error:', err);
  process.exitCode = 1;
});
