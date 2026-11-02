import { expect, test } from '@playwright/test';

test('全站 demo 选择控件紧邻文字，文本控件与滑块保持可用布局', async ({ page }) => {
  await page.goto('/');
  const menu = page.getByRole('button', { name: '切换导航' });
  if (await menu.isVisible()) await menu.click();
  const navigation = page.getByRole('navigation', { name: '组件导航' });
  await expect(navigation.getByRole('link')).toHaveCount(36);
  const urls = await navigation.getByRole('link').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')).filter((href): href is string => !!href && href !== '#overview'));
  let toggles = 0;
  for (const url of urls) {
    await page.goto(`/${url}`);
    await expect(page.getByRole('region', { name: /^场景 / })).toHaveCount(2);
    for (const checkbox of await page.locator('.example-card input[type="checkbox"]').all()) {
      const geometry = await checkbox.evaluate((input) => {
        const box = input.getBoundingClientRect();
        const label = input.closest('label')!;
        const text = [...label.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())!;
        const range = document.createRange(); range.selectNode(text);
        const caption = range.getBoundingClientRect();
        return { width: box.width, height: box.height, gap: caption.left - box.right, centerDelta: Math.abs(caption.top + caption.height / 2 - box.top - box.height / 2) };
      });
      expect(geometry.width, url).toBeLessThanOrEqual(24);
      expect(geometry.height, url).toBeLessThanOrEqual(24);
      expect(geometry.gap, url).toBeGreaterThanOrEqual(0);
      expect(geometry.gap, url).toBeLessThanOrEqual(16);
      expect(geometry.centerDelta, url).toBeLessThanOrEqual(5);
      const checked = await checkbox.isChecked();
      await checkbox.locator('..').click(); await expect(checkbox).toBeChecked({ checked: !checked });
      await checkbox.focus(); await page.keyboard.press('Space'); await expect(checkbox).toBeChecked({ checked });
      toggles++;
    }
    for (const input of await page.locator('.example-card input:not([type="checkbox"]), .example-card select').all()) {
      if (!await input.isVisible()) continue;
      const size = await input.boundingBox(); expect(size?.width, url).toBeGreaterThan(40); expect(size?.height, url).toBeGreaterThan(10);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), url).toBe(true);
  }
  expect(toggles).toBe(4);
});

test('717px 视口渐变开关保持单行并正确切换', async ({ page }) => {
  await page.setViewportSize({ width: 717, height: 717 });
  await page.goto('/#gradientText');
  const checkbox = page.getByRole('checkbox', { name: '开启渐变流动' });
  await expect(checkbox).toBeVisible();
  const box = await checkbox.boundingBox(); expect(box?.width).toBeLessThanOrEqual(24);
  await checkbox.check(); await expect(checkbox).toBeChecked();
  await page.getByRole('region', { name: /^场景 2/ }).screenshot({ path: `test-results/gradient-toggle-${test.info().project.name}.png` });
});

test('渐变重播保留选择，关闭时播放一次并尊重减少动态效果', async ({ page }) => {
  await page.goto('/#gradientText');
  const scene = page.getByRole('region', { name: /^场景 2/ });
  const checkbox = scene.getByRole('checkbox');
  const title = scene.locator('.at-gradient-text');
  const replay = scene.getByRole('button', { name: /重播动画/ });
  await checkbox.check();
  for (let index = 0; index < 2; index++) {
    await expect.poll(() => title.evaluate((node) => Number(node.getAnimations()[0]?.currentTime ?? 0))).toBeGreaterThan(500);
    await replay.click();
    await expect(checkbox).toBeChecked();
    expect(await title.evaluate((node) => Number(node.getAnimations()[0]?.currentTime))).toBeLessThan(500);
    await expect.poll(() => title.evaluate((node) => node.getAnimations()[0]?.playState)).toBe('running');
  }
  await checkbox.uncheck(); await replay.click(); await expect(checkbox).not.toBeChecked();
  await expect.poll(() => title.evaluate((node) => node.getAnimations()[0]?.playState)).toBe('running');
  await expect.poll(() => title.evaluate((node) => getComputedStyle(node).backgroundPosition)).not.toBe('0% 50%');
  await expect.poll(() => title.evaluate((node) => node.getAnimations().length)).toBe(0);
  await expect(checkbox).not.toBeChecked();
  await replay.click();
  await expect.poll(() => title.evaluate((node) => node.getAnimations()[0]?.playState)).toBe('running');
  await checkbox.check();
  expect(await title.evaluate((node) => node.getAnimations().length)).toBe(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await checkbox.check(); await replay.click(); await expect(checkbox).toBeChecked();
  expect(await title.evaluate((node) => node.getAnimations().length)).toBe(0);
});
