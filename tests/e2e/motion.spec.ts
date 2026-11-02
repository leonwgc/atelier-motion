import { expect, test } from '@playwright/test';

test('所有组件有两个可用场景，窄屏不产生横向溢出', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  const menu = page.getByRole('button', { name: '切换导航' });
  if (await menu.isVisible()) await menu.click();
  await expect(page.getByRole('navigation', { name: '组件导航' }).getByRole('link')).toHaveCount(36);
  const links = await page.getByRole('navigation', { name: '组件导航' }).getByRole('link').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')).filter((href): href is string => !!href && href !== '#overview'));
  expect(links).toHaveLength(35);
  for (const href of links) {
    await page.goto(`/${href}`);
    await expect(page.getByRole('region', { name: /^场景 / })).toHaveCount(2);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    const scene = page.getByRole('region', { name: /^场景 2/ });
    await scene.getByRole('button', { name: /查看完整代码/ }).click();
    await expect(scene.locator('code')).toContainText('export function');
    await scene.getByRole('button', { name: /重播动画/ }).click();
  }
  expect(errors).toEqual([]);
});

test('键盘激活涟漪，减少动态效果仍保留操作', async ({ page }) => {
  await page.goto('/#ripple');
  const scene = page.getByRole('region', { name: /^场景 2/ });
  const button = scene.getByRole('button', { name: '☆ 收藏文章' });
  await button.focus(); await page.keyboard.press('Enter');
  await expect(scene.getByRole('button', { name: '★ 已收藏文章' })).toBeFocused();
  await expect(scene.locator('.at-ripple__wave')).toHaveCount(1);
  await expect(scene.locator('.at-ripple__wave')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Space');
  await expect(button).toBeVisible(); await expect(scene.locator('.at-ripple__wave')).toHaveCount(0);
});

test('列表重排产生真实位移并完成动画', async ({ page }) => {
  await page.goto('/#layoutList');
  const scene = page.getByRole('region', { name: /^场景 2/ });
  const items = scene.locator('li');
  await expect(items.first()).toContainText('林');
  await scene.getByRole('button', { name: '按得分升序' }).click();
  await expect(items.first()).toContainText('陈');
  await expect.poll(() => items.evaluateAll((nodes) => nodes.some((node) => node.getAnimations().some((animation) => animation.playState === 'running')))).toBe(true);
  await expect.poll(() => items.evaluateAll((nodes) => nodes.every((node) => node.getAnimations().length === 0))).toBe(true);
  const boxes = await items.evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
  expect(boxes[0]).toBeLessThan(boxes[1]); expect(boxes[1]).toBeLessThan(boxes[2]);
});

test('表单内容变化调整真实高度，保留已输入字段', async ({ page }) => {
  await page.goto('/#autoSize');
  const scene = page.getByRole('region', { name: /^场景 2/ });
  await scene.getByLabel('收件邮箱').fill('demo@example.com');
  const box = scene.locator('.at-auto-size'); const initial = await box.evaluate((node) => node.getBoundingClientRect().height);
  await scene.getByRole('checkbox').check(); await expect(scene.getByLabel('企业名称')).toBeVisible();
  await expect.poll(() => box.evaluate((node) => node.getBoundingClientRect().height)).toBeGreaterThan(initial + 50);
  await scene.getByRole('checkbox').uncheck(); await expect(scene.getByLabel('企业名称')).toHaveCount(0);
  await expect.poll(() => box.evaluate((node) => Math.round(node.getBoundingClientRect().height))).toBe(Math.round(initial));
  await expect(scene.getByLabel('收件邮箱')).toHaveValue('demo@example.com');
});

test('独立容器滚动更新阅读进度和视差', async ({ page }) => {
  await page.goto('/#scrollProgress');
  const scene = page.getByRole('region', { name: /^场景 2/ });
  await scene.getByLabel('入门手册', { exact: true }).evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await expect(scene.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await scene.getByRole('button', { name: '从头阅读' }).click();
  await expect(scene.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await page.goto('/#parallax');
  const story = page.getByRole('region', { name: /^场景 2/ });
  const inner = story.locator('.at-parallax__inner');
  await inner.scrollIntoViewIfNeeded();
  const before = await inner.evaluate((node) => node.getAttribute('style'));
  await story.getByLabel('滚动浏览创作故事').evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await expect.poll(() => inner.getAttribute('style')).not.toBe(before);
  await story.getByRole('checkbox').uncheck();
  await expect.poll(() => inner.evaluate((node) => (node as HTMLElement).style.transform)).toBe('');
});

test('键盘折叠保持焦点并使隐藏内容 inert', async ({ page }) => {
  await page.goto('/#expand');
  const scene = page.getByRole('region', { name: /^场景 2/ });
  const question = scene.getByRole('button', { name: '可以随时修改套餐吗？' });
  await question.focus(); await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'false'); await expect(question).toBeFocused();
  const panel = scene.locator('#scenario-faq-0');
  await expect(panel).toHaveAttribute('aria-hidden', 'true');
  await expect(panel.locator('.at-expand__inner')).toHaveJSProperty('inert', true);
  await expect.poll(() => panel.evaluate((node) => node.getBoundingClientRect().height)).toBe(0);
  await page.keyboard.press('Enter');
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(panel.locator('.at-expand__inner')).toHaveJSProperty('inert', false);
});
