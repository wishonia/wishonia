/**
 * To learn more about Playwright Test visit:
 * https://www.checklyhq.com/docs/browser-checks/playwright-test/
 */
import {expect, test} from '@playwright/test'

test('visit page and take screenshot', async ({ page }) => {
  // If available, we set the target URL to a preview deployment URL provided by the ENVIRONMENT_URL created by Vercel.
  // Otherwise, we use the Production URL.
  const targetUrl = process.env.ENVIRONMENT_URL || 'https://wishonia.love'

  // We visit the page. This waits for the "load" event by default.
  const response = await page.goto(targetUrl)

  // If you are using Vercel's Deployment Protection, please check our docs on how to make this work with Checkly
  // https://www.checklyhq.com/docs/cicd/vercel-deployment-protection/
  //
  // Here's an example of some code you might need to add to your test to handle the auth dialog when using GitHub auth.
  //
  // if (!!process.env.ENVIRONMENT_URL) {
  //   // Auth dialog is a pop up
  //   const popupPromise = page.waitForEvent('popup');
  //   await page.getByText('Continue with GitHub').click()
  //   const popup = await popupPromise;
  //   await popup.waitForLoadState();
  //   await popup.locator('input[name="login"]').type(process.env.GITHUB_USER)
  //   await popup.locator('input[name="password"]').type(process.env.GITHUB_PASSWORD)
  //   await popup.getByText('Sign in', {exact: true}).click()
  // }

  // Test that the response did not fail
  if (response === null) {
    throw new Error(`Could not load ${targetUrl}`)
  }
  expect(response.status(),'should respond with correct status code').toBeLessThan(400)

  // Take a screenshot
  await page.screenshot({ path: '__checks__/screenshots/screenshot.jpg' })
})
