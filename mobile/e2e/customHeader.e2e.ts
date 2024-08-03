// e2e/customHeader.e2e.ts
describe('CustomHeader', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should render the header with the title', async () => {
    await expect(element(by.text('Test Title'))).toBeVisible();
  });

  it('should display a back button if not on the initial screen', async () => {
    // Navigate to a different screen if needed
    await element(by.text('Go to Details')).tap();

    await expect(element(by.id('backButton'))).toBeVisible();
  });
});
