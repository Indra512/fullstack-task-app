import { test, expect } from "@playwright/test";

const APP_URL = "http://localhost:5173";

test("user can add a task", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("input[placeholder='New task']", "Playwright Add Task");
  await page.click("text=Add");
  const locator = page.locator("//li[contains(text(),'Playwright Add Task')]");
  expect(await locator.isVisible());
});

test("user can update a task to done", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("input[placeholder='New task']", "Playwright Update Task");
  await page.click("text=Add");
  await page.click("li >> text=✔️");
  const locator = page.getByText('done');
  expect(await locator.isVisible());
});

test("user can delete a task", async ({ page }) => {
  await page.goto(APP_URL);
  await page.fill("input[placeholder='New task']", "Playwright Delete Task");
  await page.click("text=Add");
  await page.click("li >> text=🗑️");
  const locator = page.locator("//li[contains(text(),'Playwright Delete Task')]");
  expect(await locator.isHidden());
});
